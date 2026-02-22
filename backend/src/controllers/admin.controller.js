const Message = require('../models/message.model');
const Appointment = require('../models/appointment.model');
const Testimonial = require('../models/testimonial.model');
const Post = require('../models/post.model');

async function getMessages(req, res) {
	try {
		const messages = await Message.find().sort({ createdAt: -1 });
		return res.json({ messages });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function getAppointments(req, res) {
	try {
		const appointments = await Appointment.find().sort({ date: -1 });
		return res.json({ appointments });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function getTestimonials(req, res) {
	try {
		const testimonials = await Testimonial.find().sort({ createdAt: -1 });
		return res.json({ testimonials });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function getPosts(req, res) {
	try {
		const posts = await Post.find().sort({ createdAt: -1 });
		return res.json({ posts });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { getMessages, getAppointments, getTestimonials, getPosts };

