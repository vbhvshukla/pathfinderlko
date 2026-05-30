const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	category: {
		type: String,
		required: true,
		trim: true,
	},
	date: {
		type: String,
		required: true,
		trim: true,
	},
	time: {
		type: String,
		trim: true,
		default: '',
	},
	location: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	limit: {
		type: String,
		trim: true,
		default: '',
	},
	type: {
		type: String,
		enum: ['upcoming', 'past'],
		default: 'upcoming',
	},
	impact: {
		type: String,
		trim: true,
		default: '',
	},
	coverImage: {
		type: String,
		trim: true,
		default: '',
	},
	gallery: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Event', EventSchema);
