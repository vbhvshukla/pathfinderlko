const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial.model');

// Submit testimonial (pending approval)
router.post('/', async (req, res) => {
	try {
		const { name, content, rating } = req.body;
		if (!name || !content) return res.status(400).json({ message: 'Missing fields' });
		const t = await Testimonial.create({ name, content, rating });
		return res.status(201).json({ testimonial: t });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

// List approved
router.get('/', async (req, res) => {
	try {
		const list = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
		return res.json({ testimonials: list });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
