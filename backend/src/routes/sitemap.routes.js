const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Event = require('../models/event.model');

// Generated from the database instead of hand-maintained, so every blog post
// and event is automatically included without anyone needing to remember to
// edit a static XML file. nginx routes GET /sitemap.xml here instead of
// serving the old static file (see deployment notes).
const SITE_URL = (process.env.FRONTEND_URL || 'https://www.pathfinderlko.in').replace(/\/$/, '');

const STATIC_PAGES = [
	{ path: '/', changefreq: 'daily', priority: '1.0' },
	{ path: '/about', changefreq: 'monthly', priority: '0.9' },
	{ path: '/services', changefreq: 'weekly', priority: '0.9' },
	{ path: '/appointments', changefreq: 'weekly', priority: '0.8' },
	{ path: '/blog', changefreq: 'daily', priority: '0.8' },
	{ path: '/events', changefreq: 'weekly', priority: '0.7' },
	{ path: '/gallery', changefreq: 'weekly', priority: '0.6' },
	{ path: '/quiz', changefreq: 'monthly', priority: '0.6' },
	{ path: '/contact', changefreq: 'monthly', priority: '0.5' },
];

function urlEntry(loc, lastmod, changefreq, priority) {
	return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

router.get('/', async (req, res) => {
	try {
		const today = new Date().toISOString().split('T')[0];

		const entries = STATIC_PAGES.map((p) =>
			urlEntry(`${SITE_URL}${p.path}`, today, p.changefreq, p.priority)
		);

		const [posts, events] = await Promise.all([
			Post.find().select('slug updatedAt createdAt').lean(),
			Event.find().select('_id createdAt').lean(),
		]);

		for (const post of posts) {
			const lastmod = (post.updatedAt || post.createdAt || new Date()).toISOString().split('T')[0];
			entries.push(urlEntry(`${SITE_URL}/blog/${post.slug}`, lastmod, 'monthly', '0.7'));
		}

		for (const event of events) {
			const lastmod = (event.createdAt || new Date()).toISOString().split('T')[0];
			entries.push(urlEntry(`${SITE_URL}/events/${event._id}`, lastmod, 'monthly', '0.6'));
		}

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

		res.set('Content-Type', 'application/xml; charset=utf-8');
		res.send(xml);
	} catch (err) {
		console.error('Failed to generate sitemap', err);
		res.status(500).send('Failed to generate sitemap');
	}
});

module.exports = router;
