const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
	name: { type: String, required: true },
	content: { type: String, required: true },
	rating: { type: Number, default: 5 },
	approved: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
