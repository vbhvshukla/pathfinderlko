const express = require('express');
const router = express.Router();
const { createAppointment, listAppointments, getMyAppointments, updateAppointment, downloadReceipt } = require('../controllers/appointment.controller');
const { verifyToken, requireRole, optionalAuth } = require('../middlewares/auth.middleware');

router.post('/', optionalAuth, createAppointment);
router.get('/', verifyToken, requireRole('admin'), listAppointments);
router.get('/my', verifyToken, getMyAppointments);
router.get('/:id/receipt', downloadReceipt);
router.patch('/:id/status', verifyToken, requireRole('admin'), updateAppointment);
router.patch('/:id', verifyToken, requireRole('admin'), updateAppointment);

module.exports = router;
