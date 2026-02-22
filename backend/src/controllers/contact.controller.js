const Message = require('../models/message.model');
const { createTransporter } = require('../config/mail.config');

async function submitMessage(req, res) {
	try {
		const { name, email, subject, message , contactNumber} = req.body;
		if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });
		const msg = await Message.create({ name, email, subject, message, contactNumber });

		// send auto-reply to user
		try {
			const transporter = createTransporter();
            console.log(transporter);
			await transporter.sendMail({
				from: process.env.SMTP_FROM || 'no-reply@example.com',
				to: email,
				subject: `Pathfinder : Thanks for contacting us${subject ? ' - ' + subject : ''}`,
				text: `Hi ${name},\n\nThanks for reaching out. We received your message and will reply shortly.\n\nMessage:\n${message}`,
			});
            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'no-reply@example.com',
                to: process.env.SMTP_ADMIN || 'admin@example.com',
                subject: `Pathfinder : New Contact Message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\nContact Number: ${contactNumber}`,
            });
		} catch (e) {
            console.log(e);
			console.warn('Failed to send auto-reply', e.message || e);
		}

		return res.status(201).json({ message: "Message received successfully!" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function listMessages(req, res) {
	try {
		const page = Math.max(1, parseInt(req.query.page) || 1)
		const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 20))
		const skip = (page - 1) * limit

		const [total, messages] = await Promise.all([
			Message.countDocuments(),
			Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
		])

		const pages = Math.ceil(total / limit)
		return res.json({ messages, total, page, pages, limit })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ message: 'Server error' })
	}
}

module.exports = { submitMessage, listMessages };
