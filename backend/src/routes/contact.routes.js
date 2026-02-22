const express = require('express');
const router = express.Router();
const { submitMessage, listMessages } = require('../controllers/contact.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// public submit
router.post('/', submitMessage);

// admin list
router.get('/', verifyToken, requireRole('admin'), listMessages);

module.exports = router;
