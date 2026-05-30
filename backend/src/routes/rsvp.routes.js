const express = require('express');
const router = express.Router();
const RSVP = require('../models/rsvp.model');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// @route   POST /api/rsvp
// @desc    Register for an event (RSVP)
// @access  Private
router.post('/', verifyToken, async (req, res) => {
	try {
		const { eventId, phone, notes } = req.body;

		// 1. Validation
		if (!eventId) {
			return res.status(400).json({ message: 'Event ID is required' });
		}
		if (!phone || !phone.trim()) {
			return res.status(400).json({ message: 'Phone number is required for registration' });
		}

		// 2. Check if user already registered for this event
		const existingRSVP = await RSVP.findOne({ user: req.user._id, eventId });
		if (existingRSVP) {
			return res.status(400).json({ message: 'You have already registered for this event' });
		}

		// 3. Create new RSVP entry
		const rsvp = new RSVP({
			user: req.user._id,
			eventId: String(eventId),
			name: req.user.name,
			email: req.user.email,
			phone: phone.trim(),
			notes: notes ? notes.trim() : '',
		});

		await rsvp.save();
		return res.status(201).json({
			message: 'Successfully registered for the event!',
			rsvp,
		});
	} catch (err) {
		console.error('RSVP error:', err);
		return res.status(500).json({ message: 'Server error processing your registration' });
	}
});

// @route   GET /api/rsvp/my-rsvps
// @desc    Get current user's RSVPs
// @access  Private
router.get('/my-rsvps', verifyToken, async (req, res) => {
	try {
		const rsvps = await RSVP.find({ user: req.user._id }).sort({ createdAt: -1 });
		return res.status(200).json({ rsvps });
	} catch (err) {
		console.error('Get RSVPs error:', err);
		return res.status(500).json({ message: 'Server error fetching your registrations' });
	}
});

// @route   GET /api/rsvp/admin/all-rsvps
// @desc    Get all guest registrations (admin only)
// @access  Private/Admin
router.get('/admin/all-rsvps', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const rsvps = await RSVP.find().sort({ createdAt: -1 });
		return res.status(200).json({ rsvps });
	} catch (err) {
		console.error('Get all RSVPs error:', err);
		return res.status(500).json({ message: 'Server error fetching registrations' });
	}
});

module.exports = router;
