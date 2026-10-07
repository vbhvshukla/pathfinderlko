const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Testimonial = require('../models/testimonial.model');
const User = require('../models/user.model');
const { createTransporter } = require('../config/mail.config');

const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

function escapeHtml(str) {
	return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Best-effort: email every admin the new testimonial's details with a one-click
// approve link (no login required — the link carries its own per-testimonial token)
// plus a link into the dashboard for a full review.
async function notifyAdminsOfNewTestimonial(t) {
	try {
		const admins = await User.find({ role: 'admin' }).select('email');
		if (!admins.length) return;

		const siteUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
		const approveUrl = `${siteUrl}/api/testimonials/${t._id}/approve-link/${t.approveToken}`;
		const dashboardUrl = `${siteUrl}/admin/testimonials`;
		const stars = '★'.repeat(t.rating || 0) + '☆'.repeat(5 - (t.rating || 0));

		const transporter = createTransporter();
		const html = `
			<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
				<h2 style="margin-bottom: 4px;">New testimonial awaiting review</h2>
				<p style="color: #555; margin-top: 0;">Submitted on Pathfinder's website.</p>
				<div style="border: 1px solid #e5e5e5; border-radius: 12px; padding: 16px; margin: 16px 0;">
					<div style="font-weight: 600;">${escapeHtml(t.name)}</div>
					<div style="color: #d4a017; letter-spacing: 2px; margin: 4px 0;">${stars}</div>
					<div style="color: #333; font-style: italic;">"${escapeHtml(t.content)}"</div>
				</div>
				<a href="${approveUrl}" style="display: inline-block; background: #16a34a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Approve Testimonial</a>
				<p style="margin-top: 20px;"><a href="${dashboardUrl}" style="color: #2563eb;">Review all testimonials in the admin dashboard</a></p>
				<p style="color: #999; font-size: 12px; margin-top: 24px;">If you'd rather reject or edit this, use the dashboard link above instead of the approve button.</p>
			</div>
		`;

		await Promise.allSettled(admins.map((admin) =>
			transporter.sendMail({
				from: process.env.SMTP_FROM || 'no-reply@example.com',
				to: admin.email,
				subject: `New testimonial from ${t.name} — awaiting approval`,
				html,
				text: `New testimonial from ${t.name} (${t.rating}/5):\n\n"${t.content}"\n\nApprove: ${approveUrl}\nReview in dashboard: ${dashboardUrl}`,
			})
		));
	} catch (e) {
		console.warn('Failed to send testimonial admin notification', e.message || e);
	}
}

// Submit testimonial (held for admin approval before it appears publicly)
router.post('/', async (req, res) => {
	try {
		const { name, content, rating } = req.body;
		if (!name || !content) return res.status(400).json({ message: 'Missing fields' });
		const approveToken = crypto.randomBytes(24).toString('hex');
		const t = await Testimonial.create({ name, content, rating: rating ? Number(rating) : 5, approved: false, approveToken });
		notifyAdminsOfNewTestimonial(t); // best-effort, don't block the response on email delivery
		return res.status(201).json({ testimonial: t });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

// One-click approve from the admin notification email — no login required,
// the per-testimonial token in the URL is the credential. Token is cleared
// after use so the link can't be replayed.
router.get('/:id/approve-link/:token', async (req, res) => {
	const { id, token } = req.params;
	const page = (title, message, ok) => res.send(`
		<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<style>body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f7f7f7;}
		.card{background:#fff;border-radius:16px;padding:32px;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08);}
		h1{font-size:20px;color:${ok ? '#16a34a' : '#dc2626'};}</style></head>
		<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>
	`);

	try {
		const t = await Testimonial.findById(id);
		if (!t || !t.approveToken || t.approveToken !== token) {
			return page('Link expired', 'This approval link is invalid or has already been used.', false);
		}
		t.approved = true;
		t.approveToken = null;
		await t.save();
		return page('Testimonial approved', `"${escapeHtml(t.name)}"'s testimonial is now live on the site.`, true);
	} catch (err) {
		console.error(err);
		return page('Something went wrong', 'Please approve this from the admin dashboard instead.', false);
	}
});

// List approved (public)
router.get('/', async (req, res) => {
	try {
		const list = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
		return res.json({ testimonials: list });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

// Admin: List all testimonials (pending and approved)
router.get('/all', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const list = await Testimonial.find().sort({ createdAt: -1 });
		return res.json({ testimonials: list });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

// Admin: Approve testimonial
router.put('/:id/approve', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const { id } = req.params;
		const t = await Testimonial.findByIdAndUpdate(id, { approved: true, approveToken: null }, { new: true });
		if (!t) return res.status(404).json({ message: 'Testimonial not found' });
		return res.json({ testimonial: t });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

// Admin: Delete/reject testimonial
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const { id } = req.params;
		const t = await Testimonial.findByIdAndDelete(id);
		if (!t) return res.status(404).json({ message: 'Testimonial not found' });
		return res.json({ message: 'Testimonial deleted successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
