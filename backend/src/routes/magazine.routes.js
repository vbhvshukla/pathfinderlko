const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/', limits: { fileSize: 25 * 1024 * 1024 } })
const { createMagazine, listMagazines , downloadMagazine, deleteMagazine } = require('../controllers/magazine.controller')
const { verifyToken, requireRole } = require('../middlewares/auth.middleware')

// Admin create (accepts multipart with PDF file and optional cover image)
router.post('/', verifyToken, requireRole('admin'), upload.fields([
	{ name: 'file', maxCount: 1 },
	{ name: 'cover', maxCount: 1 },
]), createMagazine)

// public list
router.get('/', listMagazines)

// download proxy: streams PDF with inline headers so browser opens it
router.get('/:id/download', downloadMagazine)

// Admin delete
router.delete('/:id', verifyToken, requireRole('admin'), deleteMagazine)

module.exports = router
