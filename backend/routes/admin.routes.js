const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.get('/analytics', adminController.getAnalytics);
router.get('/crops-orders', adminController.getCropsAndOrders);
router.get('/reports', adminController.getReportData);

module.exports = router;
