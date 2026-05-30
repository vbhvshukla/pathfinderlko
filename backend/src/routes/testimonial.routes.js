const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial.model');

const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Submit testimonial (pending approval)
router.post('/', async (req, res) => {
	try {
		const { name, content, rating } = req.body;
		if (!name || !content) return res.status(400).json({ message: 'Missing fields' });
		const t = await Testimonial.create({ name, content, rating: rating ? Number(rating) : 5 });
		return res.status(201).json({ testimonial: t });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
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
		const t = await Testimonial.findByIdAndUpdate(id, { approved: true }, { new: true });
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
