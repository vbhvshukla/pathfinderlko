const { configureCloudinary } = require('../config/cloudinary.config');
const fs = require('fs');
const Upload = require('../models/upload.model');

async function uploadImage(req, res) {
	try {
		const cloudinary = configureCloudinary();
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
		// multer should provide req.file.path and req.file.mimetype/size
		const filePath = req.file.path;
		const allowedOpts = { folder: process.env.CLOUDINARY_FOLDER || 'uploads' };
		// allow PDFs as well when category indicates magazine_pdf
		const result = await cloudinary.uploader.upload(filePath, allowedOpts);

		// remove local temp file
		fs.unlink(filePath, err => {
			if (err) console.warn('Failed to remove temp file', filePath, err.message || err);
		});

		// build upload metadata from result and optional body fields
		const { category, relatedId, title, alt, featured } = req.body || {}
		const mime = req.file.mimetype
		const size = req.file.size
		const type = mime === 'application/pdf' ? 'pdf' : (mime && mime.startsWith('image/') ? 'image' : 'other')

		const uploadDoc = await Upload.create({
			url: result.secure_url,
			publicId: result.public_id || result.publicId || null,
			mime,
			size,
			type,
			category,
			relatedId,
			title,
			alt,
			featured: featured === 'true' || featured === true,
		})

		return res.status(201).json({ upload: uploadDoc, raw: result });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Upload failed' });
	}
}

module.exports = { uploadImage };
