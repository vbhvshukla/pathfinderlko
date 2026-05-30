const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Secure all endpoints to admin role only
router.use(verifyToken);
router.use(requireRole('admin'));

// @desc    Get all users
// @route   GET /api/users
router.get('/', async (req, res) => {
	try {
		const users = await User.find().select('-password').sort({ createdAt: -1 });
		return res.json({ users });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error retrieving users' });
	}
});

// @desc    Toggle/update user role
// @route   PUT /api/users/:id/role
router.put('/:id/role', async (req, res) => {
	try {
		const { id } = req.params;
		const { role } = req.body;

		// Safety Lock: Prevent changing own administrative role
		if (String(req.user.id) === String(id)) {
			return res.status(400).json({ message: 'Operation blocked: You cannot change your own administrative role.' });
		}

		if (!['user', 'admin'].includes(role)) {
			return res.status(400).json({ message: 'Invalid role type provided.' });
		}

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ role },
			{ new: true }
		).select('-password');

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found.' });
		}

		return res.json({ user: updatedUser });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error updating user role.' });
	}
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;

		// Safety Lock: Prevent deleting own active account
		if (String(req.user.id) === String(id)) {
			return res.status(400).json({ message: 'Operation blocked: You cannot delete your own active administrator account.' });
		}

		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found.' });
		}

		return res.json({ message: 'User deleted successfully.' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error deleting user.' });
	}
});

module.exports = router;
