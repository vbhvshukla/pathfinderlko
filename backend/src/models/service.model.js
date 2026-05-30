const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String },
	duration: { type: Number, default: 60 }, // minutes
	price: { type: Number, default: 0 },
	sessions: { type: Number, default: 1 },
	active: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', ServiceSchema);
