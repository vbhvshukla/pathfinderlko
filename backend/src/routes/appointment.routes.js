const express = require('express');
const router = express.Router();
const { createAppointment, listAppointments, updateAppointmentStatus } = require('../controllers/appointment.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.post('/', createAppointment);
router.get('/', verifyToken, requireRole('admin'), listAppointments);
router.patch('/:id/status', verifyToken, requireRole('admin'), updateAppointmentStatus);

module.exports = router;
