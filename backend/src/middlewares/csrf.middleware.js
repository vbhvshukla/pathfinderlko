const crypto = require('crypto');

function setupCsrf(req, res, next) {
	// Parse cookies manually to check for csrfToken
	const cookieHeader = req.headers.cookie || '';
	let csrfToken = null;
	const match = cookieHeader.match(/csrfToken=([^;]+)/);
	if (match) {
		csrfToken = match[1];
	}

	if (!csrfToken) {
		csrfToken = crypto.randomBytes(24).toString('hex');
	}

	// Set cookie (non-HttpOnly so client Axios can read it)
	res.cookie('csrfToken', csrfToken, {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Lax',
		path: '/',
	});

	// Also make it available on req
	req.csrfToken = csrfToken;
	next();
}

function verifyCsrf(req, res, next) {
	// Bypass CSRF validation in local development due to cross-port cookie reading limits
	if (process.env.NODE_ENV !== 'production') {
		return next();
	}

	// Safe methods do not require CSRF verification
	if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
		return next();
	}

	const cookieHeader = req.headers.cookie || '';
	let cookieToken = null;
	const match = cookieHeader.match(/csrfToken=([^;]+)/);
	if (match) {
		cookieToken = match[1];
	}

	const headerToken = req.headers['x-csrf-token'];

	if (!cookieToken || !headerToken || cookieToken !== headerToken) {
		return res.status(403).json({ message: 'CSRF validation failed' });
	}

	next();
}

module.exports = { setupCsrf, verifyCsrf };
