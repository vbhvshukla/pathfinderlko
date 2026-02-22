const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	title: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	excerpt: { type: String },
	content: { type: String },
	categories: [{ type: String }],
	tags: [{ type: String }],
	featuredImage: { type: String },
	seo: {
		title: String,
		description: String,
	},
	author: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
