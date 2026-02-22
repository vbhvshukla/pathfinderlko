const express = require('express');
const router = express.Router();
const multer = require('multer');
// limit uploads to images and reasonable size
const upload = multer({
	dest: 'uploads/',
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (allowed.includes(file.mimetype)) return cb(null, true);
		return cb(new Error('Invalid file type'));
	},
});

const { uploadImage } = require('../controllers/upload.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Admin-only upload endpoint (file field: file)
router.post('/', verifyToken, requireRole('admin'), upload.single('file'), uploadImage);
//router.post('/', upload.single('file'), uploadImage);


module.exports = router;
