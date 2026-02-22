const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String },
	age: { type: Number },
	city: { type: String },
	address: { type: String },
	serviceId: { type: String },
	serviceName: { type: String },
	sessions: { type: Number, default: 1 },
	charges: { type: Number, default: 0 },
	date: { type: Date },
	timeSlot: { type: String },
	notes: { type: String },
	status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
