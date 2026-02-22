const Appointment = require('../models/appointment.model');
const { createTransporter } = require('../config/mail.config');

async function createAppointment(req, res) {
	try {
		// Accept frontend fields: service (id), sessions, charges, age, city, address
		const {
			name,
			email,
			phone,
			service,
			serviceId,
			serviceName,
			sessions,
			charges,
			age,
			city,
			address,
			date,
			timeSlot,
			notes,
		} = req.body;

		if (!name || !email) return res.status(400).json({ message: 'Missing required fields' });

		const resolvedServiceId = serviceId || service || null;
		const resolvedServiceName = serviceName || null;

		const apptData = {
			name,
			email,
			phone,
			age: age ? Number(age) : undefined,
			city,
			address,
			serviceId: resolvedServiceId,
			serviceName: resolvedServiceName,
			sessions: sessions ? Number(sessions) : undefined,
			charges: charges ? Number(charges) : undefined,
			timeSlot,
			notes,
		};

		if (date) {
			apptData.date = new Date(date);
		}

		const appt = await Appointment.create(apptData);

		// send confirmation email (best-effort)
		try {
			const transporter = createTransporter();
			await transporter.sendMail({
				from: process.env.SMTP_FROM || 'no-reply@example.com',
				to: email,
				subject: 'Appointment confirmation',
				text: `Hi ${name},\n\nYour appointment for ${resolvedServiceName || resolvedServiceId || 'service'}${appt.date ? ' on ' + appt.date.toLocaleString() : ''} has been received. We will confirm shortly.\n\nThanks.`,
			});
		} catch (e) {
			console.warn('Failed to send appointment email', e.message || e);
		}

		return res.status(201).json({ appointment: appt });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function listAppointments(req, res) {
	try {
		const appointments = await Appointment.find().sort({ date: -1 });
		return res.json({ appointments });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function updateAppointmentStatus(req, res) {
	try {
		const { id } = req.params;
		const { status } = req.body;
		const appt = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
		if (!appt) return res.status(404).json({ message: 'Appointment not found' });
		return res.json({ appointment: appt });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { createAppointment, listAppointments, updateAppointmentStatus };

