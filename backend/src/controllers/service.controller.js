const Service = require('../models/service.model');

// Public or Admin: list services
async function listServices(req, res) {
	try {
		// If requesting active only (default for public), filter active services
		const filter = {};
		if (!req.user || req.user.role !== 'admin') {
			filter.active = true;
		}
		const services = await Service.find(filter).sort({ createdAt: 1 });
		return res.json({ services });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

// Admin: create service
async function createService(req, res) {
	try {
		const { title, description, duration, price, sessions, active } = req.body;
		if (!title) return res.status(400).json({ message: 'Title is required' });

		const exists = await Service.findOne({ title });
		if (exists) return res.status(400).json({ message: 'Service with this title already exists' });

		const service = await Service.create({
			title,
			description,
			duration: duration ? Number(duration) : undefined,
			price: price ? Number(price) : undefined,
			sessions: sessions ? Number(sessions) : undefined,
			active: active !== undefined ? active : true,
		});

		return res.status(201).json({ service });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

// Admin: update service
async function updateService(req, res) {
	try {
		const { id } = req.params;
		const { title, description, duration, price, sessions, active } = req.body;

		const updateData = {};
		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (duration !== undefined) updateData.duration = Number(duration);
		if (price !== undefined) updateData.price = Number(price);
		if (sessions !== undefined) updateData.sessions = Number(sessions);
		if (active !== undefined) updateData.active = active;

		const service = await Service.findByIdAndUpdate(id, updateData, { new: true });
		if (!service) return res.status(404).json({ message: 'Service not found' });

		return res.json({ service });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

// Admin: delete service
async function deleteService(req, res) {
	try {
		const { id } = req.params;
		const service = await Service.findByIdAndDelete(id);
		if (!service) return res.status(404).json({ message: 'Service not found' });
		return res.json({ message: 'Service deleted successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = {
	listServices,
	createService,
	updateService,
	deleteService,
};
