const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Get orders (role-filtered automatically)
router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);

// Create order (buyer only)
router.post('/', authorize('buyer'), orderController.createOrder);

// Update order status (farmer, transporter, or admin)
router.put('/:id/status', authorize('farmer', 'transporter', 'admin'), orderController.updateOrderStatus);

// Assign transporter (farmer or admin)
router.put('/:id/assign-transporter', authorize('farmer', 'admin'), orderController.assignTransporter);

module.exports = router;
