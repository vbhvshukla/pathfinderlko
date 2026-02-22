const Post = require('../models/post.model');
const slugify = require('slugify');
const fs = require('fs')
const { configureCloudinary } = require('../config/cloudinary.config')
const Upload = require('../models/upload.model')

async function createPost(req, res) {
	try {
		let { title, content, excerpt, categories, tags, featuredImage, seo } = req.body;
		if (!title) return res.status(400).json({ message: 'Title required' });
		const slug = slugify(title, { lower: true, strict: true });
		const existing = await Post.findOne({ slug });
		if (existing) return res.status(409).json({ message: 'Post with similar title exists' });

		// If categories/tags provided as comma-separated strings, convert to arrays
		if (typeof categories === 'string') categories = categories.split(',').map(s => s.trim()).filter(Boolean);
		if (typeof tags === 'string') tags = tags.split(',').map(s => s.trim()).filter(Boolean);
		// If an uploaded file is present (multer), upload to Cloudinary and create an Upload doc
		if (req.file) {
			try {
				const cloudinary = configureCloudinary()
				const filePath = req.file.path
				const opts = { folder: process.env.CLOUDINARY_FOLDER || 'uploads' }
				const result = await cloudinary.uploader.upload(filePath, opts)
				fs.unlink(filePath, () => {})
				featuredImage = result.secure_url || featuredImage
				// record upload metadata
				const uploadDoc = await Upload.create({
					url: result.secure_url,
					publicId: result.public_id || result.publicId || null,
					mime: req.file.mimetype,
					size: req.file.size,
					type: req.file.mimetype && req.file.mimetype.startsWith('image/') ? 'image' : 'other',
					category: 'post_featured',
					title: title,
					alt: title,
				})
			} catch (upErr) {
				console.warn('Post image upload failed', upErr)
			}
		}
		const post = await Post.create({ title, slug, content, excerpt, categories, tags, featuredImage, seo });
		return res.status(201).json({ post });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function listPosts(req, res) {
	try {
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
		const skip = (page - 1) * limit;
		const [posts, total] = await Promise.all([
			Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
			Post.countDocuments(),
		]);
		return res.json({ posts, total, page, limit });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function getPostBySlug(req, res) {
	try {
		const { slug } = req.params;
		const post = await Post.findOne({ slug });
		if (!post) return res.status(404).json({ message: 'Not found' });
		return res.json({ post });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function updatePost(req, res) {
	try {
		const { slug } = req.params;
		let updates = req.body || {};

		// normalize categories/tags if sent as strings
		if (typeof updates.categories === 'string') updates.categories = updates.categories.split(',').map(s => s.trim()).filter(Boolean);
		if (typeof updates.tags === 'string') updates.tags = updates.tags.split(',').map(s => s.trim()).filter(Boolean);

		// handle uploaded file (multer) similar to createPost
		if (req.file) {
			try {
				const cloudinary = configureCloudinary()
				const filePath = req.file.path
				const opts = { folder: process.env.CLOUDINARY_FOLDER || 'uploads' }
				const result = await cloudinary.uploader.upload(filePath, opts)
				fs.unlink(filePath, () => {})
				updates.featuredImage = result.secure_url || updates.featuredImage
				await Upload.create({
					url: result.secure_url,
					publicId: result.public_id || result.publicId || null,
					mime: req.file.mimetype,
					size: req.file.size,
					type: req.file.mimetype && req.file.mimetype.startsWith('image/') ? 'image' : 'other',
					category: 'post_featured',
					title: updates.title || '',
					alt: updates.title || '',
				})
			} catch (upErr) {
				console.warn('Post image upload failed', upErr)
			}
		}

		if (updates.title) updates.slug = slugify(updates.title, { lower: true, strict: true });
		updates.updatedAt = new Date();
		const post = await Post.findOneAndUpdate({ slug }, updates, { new: true });
		if (!post) return res.status(404).json({ message: 'Not found' });
		return res.json({ post });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

async function deletePost(req, res) {
	try {
		const { slug } = req.params;
		const post = await Post.findOneAndDelete({ slug });
		if (!post) return res.status(404).json({ message: 'Not found' });
		return res.json({ message: 'Deleted' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

module.exports = { createPost, listPosts, getPostBySlug, updatePost, deletePost };

