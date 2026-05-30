const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Helper array representing the initial seed events
const DEFAULT_EVENTS = [
	{
		title: 'Mindfulness & Stress Management Seminar',
		category: 'Mental Health',
		date: 'June 15, 2026',
		time: '04:00 PM - 05:30 PM',
		location: 'Gomti Nagar Library Hall, Lucknow',
		description: 'A hands-on workshop led by veteran psychologists to teach students actionable stress relief techniques, breathing exercises, and cognitive reframing.',
		limit: '50 Seats Only',
		type: 'upcoming',
		coverImage: '/src/assets/1.jpg',
		gallery: ['/src/assets/2.jpg', '/src/assets/3.jpg']
	},
	{
		title: 'Career Pathways in Tech & Digital Arts',
		category: 'Career Guidance',
		date: 'June 28, 2026',
		time: '11:00 AM - 01:00 PM',
		location: 'Online via Zoom',
		description: 'Struggling to choose a path? Join industry mentors as they dissect modern career options in software development, UI/UX, product design, and artificial intelligence.',
		limit: 'Unlimited (Online)',
		type: 'upcoming',
		coverImage: '/src/assets/2.jpg',
		gallery: ['/src/assets/1.jpg', '/src/assets/3.jpg']
	},
	{
		title: 'De-stigmatizing Therapy: Community Outreach',
		category: 'Community Support',
		date: 'May 10, 2026',
		time: '10:00 AM - 04:00 PM',
		location: 'Hazratganj Main Plaza, Lucknow',
		description: 'An open-air awareness campaign sharing psychological support guides, counseling resources, and conducting free group check-ins.',
		impact: '200+ Beneficiaries',
		type: 'past',
		coverImage: '/src/assets/3.jpg',
		gallery: ['/src/assets/1.jpg', '/src/assets/2.jpg', '/src/assets/drpkdwivedi.jpg']
	},
	{
		title: 'Academic Anxiety Relief Camp',
		category: 'Student Mentorship',
		date: 'April 15, 2026',
		time: '09:00 AM - 01:00 PM',
		location: 'Pathfinder NGO Center, Lucknow',
		description: 'Focused study camps addressing exam anxiety, memory improvement techniques, and time management skills for high school board examinees.',
		impact: '80+ Students Attended',
		type: 'past',
		coverImage: '/src/assets/4.jpg',
		gallery: ['/src/assets/sandhya.png', '/src/assets/gargi.png', '/src/assets/urvassi.png']
	}
];

// @route   GET /api/events
// @desc    Get all events (public)
// @access  Public
router.get('/', async (req, res) => {
	try {
		let events = await Event.find().sort({ createdAt: -1 });
		
		// Seed default events if database is empty
		if (events.length === 0) {
			console.log('Seeding default events into database...');
			await Event.insertMany(DEFAULT_EVENTS);
			events = await Event.find().sort({ createdAt: -1 });
		}
		
		return res.status(200).json({ events });
	} catch (err) {
		console.error('Fetch events error:', err);
		return res.status(500).json({ message: 'Server error fetching events' });
	}
});

// @route   GET /api/events/:id
// @desc    Get a single event by id (public)
// @access  Public
router.get('/:id', async (req, res) => {
	try {
		const event = await Event.findById(req.params.id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}
		return res.status(200).json({ event });
	} catch (err) {
		console.error('Fetch single event error:', err);
		return res.status(500).json({ message: 'Server error retrieving event' });
	}
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private/Admin
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const { title, category, date, time, location, description, limit, type, impact, coverImage, gallery } = req.body;

		if (!title || !category || !date || !location || !description) {
			return res.status(400).json({ message: 'Missing required event fields' });
		}

		const newEvent = new Event({
			title: title.trim(),
			category: category.trim(),
			date: date.trim(),
			time: time ? time.trim() : '',
			location: location.trim(),
			description: description.trim(),
			limit: limit ? limit.trim() : '',
			type: type || 'upcoming',
			impact: impact ? impact.trim() : '',
			coverImage: coverImage ? coverImage.trim() : '',
			gallery: Array.isArray(gallery) ? gallery : [],
		});

		await newEvent.save();
		return res.status(201).json({
			message: 'Event created successfully!',
			event: newEvent
		});
	} catch (err) {
		console.error('Create event error:', err);
		return res.status(500).json({ message: 'Server error creating event' });
	}
});

// @route   PUT /api/events/:id
// @desc    Update an existing event
// @access  Private/Admin
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const { title, category, date, time, location, description, limit, type, impact, coverImage, gallery } = req.body;

		if (!title || !category || !date || !location || !description) {
			return res.status(400).json({ message: 'Missing required event fields' });
		}

		const updatedEvent = await Event.findByIdAndUpdate(
			req.params.id,
			{
				title: title.trim(),
				category: category.trim(),
				date: date.trim(),
				time: time ? time.trim() : '',
				location: location.trim(),
				description: description.trim(),
				limit: limit ? limit.trim() : '',
				type: type || 'upcoming',
				impact: impact ? impact.trim() : '',
				coverImage: coverImage ? coverImage.trim() : '',
				gallery: Array.isArray(gallery) ? gallery : [],
			},
			{ new: true } // Return updated document
		);

		if (!updatedEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}

		return res.status(200).json({
			message: 'Event updated successfully!',
			event: updatedEvent
		});
	} catch (err) {
		console.error('Update event error:', err);
		return res.status(500).json({ message: 'Server error updating event' });
	}
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
	try {
		const deletedEvent = await Event.findByIdAndDelete(req.params.id);
		if (!deletedEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}

		return res.status(200).json({
			message: 'Event deleted successfully!',
			event: deletedEvent
		});
	} catch (err) {
		console.error('Delete event error:', err);
		return res.status(500).json({ message: 'Server error deleting event' });
	}
});

module.exports = router;
