const jwt = require('jsonwebtoken');

function getTokenFromHeader(req) {
	const auth = req.headers.authorization || req.headers.Authorization;
	if (auth) {
		const parts = auth.split(' ');
		if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
	}

	// Fallback: try to read token from cookie header (simple parse)
	const cookieHeader = req.headers.cookie || req.headers.Cookie || '';
	if (cookieHeader) {
		const parts = cookieHeader.split(';').map(p => p.trim());
		for (const p of parts) {
			if (p.startsWith('token=')) return decodeURIComponent(p.split('=')[1]);
		}
	}
	return null;
}

function verifyToken(req, res, next) {
	try {
		const token = getTokenFromHeader(req);
		if (!token) return res.status(401).json({ message: 'No token provided' });
		const secret = process.env.JWT_SECRET;
		if (!secret) return res.status(500).json({ message: 'JWT_SECRET not configured' });
		const payload = jwt.verify(token, secret);
		req.user = payload;
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

function requireRole(role) {
	return function (req, res, next) {
		if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
		if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
		return next();
	};
}

function optionalAuth(req, res, next) {
	try {
		const token = getTokenFromHeader(req);
		if (!token) return next();
		const secret = process.env.JWT_SECRET;
		if (!secret) return next();
		const payload = jwt.verify(token, secret);
		req.user = payload;
	} catch (err) {
		// ignore invalid token for optional auth
	}
	return next();
}

module.exports = { verifyToken, requireRole, optionalAuth };

