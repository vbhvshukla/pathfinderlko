const Appointment = require('../models/appointment.model');
const { createTransporter } = require('../config/mail.config');
const { PDFDocument, rgb } = require('pdf-lib');

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
			userId: req.user ? req.user.id : undefined,
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

			if (process.env.SMTP_ADMIN) {
				await transporter.sendMail({
					from: process.env.SMTP_FROM || 'no-reply@example.com',
					to: process.env.SMTP_ADMIN,
					subject: 'New Appointment Booked',
					text: `A new appointment has been booked.\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nService: ${resolvedServiceName || resolvedServiceId || 'N/A'}\nDate: ${appt.date ? appt.date.toLocaleString() : 'N/A'}\nTime Slot: ${timeSlot || 'N/A'}\nNotes: ${notes || 'None'}\n\nPlease check the admin dashboard to review and manage.`,
				});
			}
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

async function getMyAppointments(req, res) {
	try {
		const appointments = await Appointment.find({ userId: req.user.id }).sort({ date: -1 });
		return res.json({ appointments });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function updateAppointment(req, res) {
	try {
		const { id } = req.params;
		const { status, date, timeSlot, notes } = req.body;
		
		const updateData = {};
		if (status !== undefined) updateData.status = status;
		if (date !== undefined) updateData.date = date ? new Date(date) : null;
		if (timeSlot !== undefined) updateData.timeSlot = timeSlot;
		if (notes !== undefined) updateData.notes = notes;

		const appt = await Appointment.findByIdAndUpdate(id, updateData, { new: true });
		if (!appt) return res.status(404).json({ message: 'Appointment not found' });

		// Send email update to patient if status or slot changed
		try {
			const transporter = createTransporter();
			await transporter.sendMail({
				from: process.env.SMTP_FROM || 'no-reply@example.com',
				to: appt.email,
				subject: `Appointment Update - ${appt.status.toUpperCase()}`,
				text: `Hi ${appt.name},\n\nYour appointment details have been updated by the administrator.\n\nNew Status: ${appt.status}\nNew Date/Time: ${appt.date ? appt.date.toLocaleString() : 'N/A'}\nTime Slot: ${appt.timeSlot || 'N/A'}\n\nPlease visit your dashboard for more details.\n\nBest regards,\nPathfinder NGO Lucknow`,
			});
		} catch (e) {
			console.warn('Failed to send status update email', e.message || e);
		}

		return res.json({ appointment: appt });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function downloadReceipt(req, res) {
	try {
		const { id } = req.params;
		const appt = await Appointment.findById(id);
		if (!appt) return res.status(404).json({ message: 'Appointment not found' });

		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 400]);
		const { width, height } = page.getSize();

		// Draw simple premium invoice layout
		page.drawText('PATHFINDER NGO - LUCKNOW', { x: 50, y: height - 50, size: 20, color: rgb(0.1, 0.5, 0.3) });
		page.drawText('Counseling & Mental Health Services', { x: 50, y: height - 70, size: 10, color: rgb(0.4, 0.4, 0.4) });

		page.drawText('APPOINTMENT RECEIPT', { x: 50, y: height - 120, size: 16, color: rgb(0.1, 0.1, 0.1) });
		page.drawText(`Receipt ID: ${appt._id}`, { x: 50, y: height - 145, size: 10 });
		page.drawText(`Date Booked: ${new Date(appt.createdAt).toLocaleString()}`, { x: 50, y: height - 160, size: 10 });

		page.drawText('Patient Name:', { x: 50, y: height - 200, size: 10, color: rgb(0.4, 0.4, 0.4) });
		page.drawText(appt.name, { x: 150, y: height - 200, size: 11 });

		page.drawText('Service:', { x: 50, y: height - 220, size: 10, color: rgb(0.4, 0.4, 0.4) });
		page.drawText(appt.serviceName || appt.serviceId || 'General Counseling', { x: 150, y: height - 220, size: 11 });

		page.drawText('Date & Time Slot:', { x: 50, y: height - 240, size: 10, color: rgb(0.4, 0.4, 0.4) });
		page.drawText(`${appt.date ? new Date(appt.date).toLocaleDateString() : 'Pending'} at ${appt.timeSlot || 'Pending'}`, { x: 150, y: height - 240, size: 11 });

		page.drawText('Sessions:', { x: 50, y: height - 260, size: 10, color: rgb(0.4, 0.4, 0.4) });
		page.drawText(`${appt.sessions || 1} Session(s)`, { x: 150, y: height - 260, size: 11 });

		page.drawText('Amount Paid:', { x: 50, y: height - 300, size: 12, color: rgb(0.1, 0.5, 0.3) });
		page.drawText(`INR ${appt.charges || 0}.00`, { x: 150, y: height - 300, size: 14, color: rgb(0.1, 0.5, 0.3) });

		page.drawText('Thank you for choosing Pathfinder. Healing begins with a conversation.', { x: 50, y: 50, size: 9, color: rgb(0.5, 0.5, 0.5) });

		const pdfBytes = await pdfDoc.save();

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename=receipt-${appt._id}.pdf`);
		return res.end(Buffer.from(pdfBytes));
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error generating PDF' });
	}
}

module.exports = { createAppointment, listAppointments, getMyAppointments, updateAppointment, downloadReceipt };

