const { configureCloudinary } = require('../config/cloudinary.config');
const fs = require('fs');
const Upload = require('../models/upload.model');

async function uploadImage(req, res) {
	try {
		const cloudinary = configureCloudinary();
		
		// Support both multiple files (req.files) and single file (req.file)
		const files = req.files || (req.file ? [req.file] : []);
		if (!files || files.length === 0) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		const { category, relatedId, title, alt, featured } = req.body || {};
		const isFeatured = featured === 'true' || featured === true;

		const uploadPromises = files.map(async (file) => {
			const filePath = file.path;
			const allowedOpts = { folder: process.env.CLOUDINARY_FOLDER || 'uploads' };
			const result = await cloudinary.uploader.upload(filePath, allowedOpts);

			// remove local temp file
			fs.unlink(filePath, err => {
				if (err) console.warn('Failed to remove temp file', filePath, err.message || err);
			});

			const mime = file.mimetype;
			const size = file.size;
			const type = mime === 'application/pdf' ? 'pdf' : (mime && mime.startsWith('image/') ? 'image' : 'other');

			// If multiple files, use file's original name as title if no specific title is specified
			const uploadTitle = title ? title : (file.originalname ? file.originalname.split('.')[0] : 'Untitled');

			const uploadDoc = await Upload.create({
				url: result.secure_url,
				publicId: result.public_id || result.publicId || null,
				mime,
				size,
				type,
				category,
				relatedId,
				title: uploadTitle,
				alt: alt || uploadTitle,
				featured: isFeatured,
			});

			return uploadDoc;
		});

		const uploadedDocs = await Promise.all(uploadPromises);

		// Keep backwards compatibility for response structure
		if (uploadedDocs.length === 1) {
			return res.status(201).json({ upload: uploadedDocs[0], uploads: uploadedDocs });
		}
		return res.status(201).json({ uploads: uploadedDocs, message: `${uploadedDocs.length} files uploaded successfully!` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Upload failed' });
	}
}

async function listUploads(req, res) {
	try {
		const { category } = req.query
		const q = {}
		if (category) q.category = category
		const uploads = await Upload.find(q).sort({ createdAt: -1 })
		return res.json({ uploads })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ message: 'Failed to list uploads' })
	}
}

async function deleteUpload(req, res) {
	try {
		const id = req.params.id
		const doc = await Upload.findById(id)
		if (!doc) return res.status(404).json({ message: 'Not found' })

		const cloudinary = configureCloudinary()
		// attempt to remove from cloudinary when we have a publicId
		if (doc.publicId) {
			try {
				const resourceType = doc.type === 'pdf' ? 'raw' : 'image'
				await cloudinary.uploader.destroy(doc.publicId, { resource_type: resourceType })
			} catch (e) {
				console.warn('Failed to remove remote asset', doc.publicId, e.message || e)
			}
		}

		await Upload.findByIdAndDelete(id)
		return res.json({ message: 'Deleted' })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ message: 'Failed to delete upload' })
	}
}

module.exports = { uploadImage , listUploads, deleteUpload };
