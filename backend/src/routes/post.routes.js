
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, listPosts, getPostBySlug, updatePost, deletePost } = require('../controllers/post.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const upload = multer({
	dest: 'uploads/',
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (allowed.includes(file.mimetype)) return cb(null, true);
		return cb(new Error('Invalid file type'));
	},
});


router.get('/', listPosts);
router.get('/:slug', getPostBySlug);
// accept an optional file upload under field name `file`
router.post('/', verifyToken, requireRole('admin'), upload.single('featuredImage'), createPost);
router.put('/:slug', verifyToken, requireRole('admin'), upload.single('featuredImage'), updatePost);
router.delete('/:slug', verifyToken, requireRole('admin'), deletePost);

module.exports = router;
