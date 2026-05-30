const mongoose = require('mongoose');

const RsvpsSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	eventId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	phone: {
		type: String,
		required: true,
		trim: true,
	},
	notes: {
		type: String,
		trim: true,
		default: '',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Compound index to ensure a user can only register once per event
RsvpsSchema.index({ user: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', RsvpsSchema);
