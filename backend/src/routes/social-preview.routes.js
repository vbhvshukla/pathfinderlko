const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Post = require('../models/post.model');
const Event = require('../models/event.model');

// Social-share crawlers (LinkedIn, Facebook, Twitter/X, Slack, WhatsApp, ...) don't
// execute JavaScript, so they only ever see this app's static index.html — the same
// generic title/description/image for every URL, regardless of which post was shared.
// nginx routes known bot user-agents for /blog/:slug and /events/:id to these routes
// instead of the static file, so they get that specific post's real title/excerpt/image.
// Everyone else (real browsers) is unaffected — nginx only redirects bot traffic here.

const DIST_INDEX_PATH = process.env.FRONTEND_DIST_PATH
	|| path.join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html');

const SITE_URL = (process.env.FRONTEND_URL || 'https://www.pathfinderlko.in').replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/icons/icon-512.png`;

function escapeAttr(str) {
	return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function stripHtml(html, maxLen) {
	const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
	return maxLen ? text.slice(0, maxLen) : text;
}

function renderPreview(res, { title, description, image, url, type }) {
	let html;
	try {
		html = fs.readFileSync(DIST_INDEX_PATH, 'utf-8');
	} catch (e) {
		console.error('social-preview: could not read built index.html at', DIST_INDEX_PATH, e.message);
		return res.status(500).send('Preview unavailable');
	}

	const fullTitle = `Pathfinder | ${title}`;
	const safeTitle = escapeAttr(fullTitle);
	const safeDesc = escapeAttr(description);
	const safeImage = escapeAttr(image || DEFAULT_IMAGE);
	const safeUrl = escapeAttr(url);

	html = html
		.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`)
		.replace(/(<meta name="description" content=")[^"]*(")/, `$1${safeDesc}$2`)
		.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${safeTitle}$2`)
		.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${safeDesc}$2`)
		.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${safeUrl}$2`)
		.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${safeImage}$2`)
		.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${type || 'website'}$2`)
		.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${safeUrl}$2`);

	res.set('Content-Type', 'text/html');
	res.send(html);
}

router.get('/blog/:slug', async (req, res) => {
	const { slug } = req.params;
	const post = await Post.findOne({ slug }).catch(() => null);
	if (!post) {
		return renderPreview(res, {
			title: 'Post Not Found',
			description: 'This article could not be found on Pathfinder.',
			url: `${SITE_URL}/blog/${slug}`,
		});
	}
	renderPreview(res, {
		title: post.seo?.title || post.title,
		description: post.seo?.description || post.excerpt || stripHtml(post.content, 160),
		image: post.featuredImage,
		url: `${SITE_URL}/blog/${post.slug}`,
		type: 'article',
	});
});

router.get('/events/:id', async (req, res) => {
	const { id } = req.params;
	const event = await Event.findById(id).catch(() => null);
	if (!event) {
		return renderPreview(res, {
			title: 'Event Not Found',
			description: 'This event could not be found on Pathfinder.',
			url: `${SITE_URL}/events/${id}`,
		});
	}
	renderPreview(res, {
		title: event.title,
		description: stripHtml(event.description, 160),
		image: event.coverImage,
		url: `${SITE_URL}/events/${event._id}`,
		type: 'article',
	});
});

module.exports = router;
