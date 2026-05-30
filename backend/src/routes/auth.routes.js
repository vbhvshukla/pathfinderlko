const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, me, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 15,
	message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', verifyToken, me);
router.post('/logout', logout);

module.exports = router;
