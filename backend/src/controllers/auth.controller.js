const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const { createTransporter } = require('../config/mail.config');

async function register(req, res) {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const existing = await User.findOne({ email });
		if (existing) return res.status(409).json({ message: 'Email already registered' });
		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashed });
		if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET not configured' });
		const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
		// set httpOnly cookie
		const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
		res.cookie('token', token, {
			httpOnly: true,
			secure: isSecure,
			sameSite: isSecure ? 'none' : 'Lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
		return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET not configured' });
		const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
		const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
		res.cookie('token', token, {
			httpOnly: true,
			secure: isSecure,
			sameSite: isSecure ? 'none' : 'Lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
		return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function me(req, res) {
	try {
		const user = await User.findById(req.user?.id).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function logout(req, res) {
	try {
		const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
		res.clearCookie('token', {
			httpOnly: true,
			secure: isSecure,
			sameSite: isSecure ? 'none' : 'Lax',
		});
		return res.json({ message: 'Logged out' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function forgotPassword(req, res) {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ message: 'Email is required' });

		const user = await User.findOne({ email: String(email).toLowerCase().trim() });
		// Always respond with the same generic message whether or not the account
		// exists, so this endpoint can't be used to enumerate registered emails.
		const genericResponse = { message: 'If an account exists for that email, a reset link has been sent.' };

		if (!user) return res.json(genericResponse);

		const token = crypto.randomBytes(32).toString('hex');
		user.resetToken = token;
		user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
		await user.save();

		const siteUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
		const resetUrl = `${siteUrl}/reset-password?token=${token}`;

		try {
			const transporter = createTransporter();
			await transporter.sendMail({
				from: process.env.SMTP_FROM || 'no-reply@example.com',
				to: user.email,
				subject: 'Reset your Pathfinder password',
				text: `Hi ${user.name},\n\nWe received a request to reset your password. This link expires in 1 hour:\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
				html: `<p>Hi ${user.name},</p><p>We received a request to reset your password. This link expires in 1 hour:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
			});
		} catch (e) {
			console.warn('Failed to send password reset email', e.message || e);
		}

		return res.json(genericResponse);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function resetPassword(req, res) {
	try {
		const { token, password } = req.body;
		if (!token || !password) return res.status(400).json({ message: 'Missing fields' });
		if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

		const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
		if (!user) return res.status(400).json({ message: 'This reset link is invalid or has expired.' });

		user.password = await bcrypt.hash(password, 10);
		user.resetToken = null;
		user.resetTokenExpiry = null;
		await user.save();

		return res.json({ message: 'Password updated successfully. You can now sign in.' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { register, login, me, logout, forgotPassword, resetPassword };
