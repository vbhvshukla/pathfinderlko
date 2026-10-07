const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
	name: { type: String, required: true },
	content: { type: String, required: true },
	rating: { type: Number, default: 5 },
	approved: { type: Boolean, default: false },
	// One-click approve link token, emailed to admins. Cleared once used so the
	// link can't be replayed after approval.
	approveToken: { type: String, default: null },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
