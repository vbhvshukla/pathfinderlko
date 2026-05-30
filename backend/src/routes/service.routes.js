const express = require('express');
const router = express.Router();
const { listServices, createService, updateService, deleteService } = require('../controllers/service.controller');
const { verifyToken, requireRole, optionalAuth } = require('../middlewares/auth.middleware');

router.get('/', optionalAuth, listServices);
router.post('/', verifyToken, requireRole('admin'), createService);
router.put('/:id', verifyToken, requireRole('admin'), updateService);
router.delete('/:id', verifyToken, requireRole('admin'), deleteService);

module.exports = router;
