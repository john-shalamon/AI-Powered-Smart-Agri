const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transport.controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Transport jobs (for transporters)
router.get('/jobs', authorize('transporter'), transportController.getAvailableJobs);
router.post('/jobs/:id/accept', authorize('transporter'), transportController.acceptJob);

// Deliveries
router.get('/deliveries', authorize('transporter'), transportController.getMyDeliveries);
router.put('/deliveries/:id/status', authorize('transporter'), transportController.updateDeliveryStatus);

// Earnings
router.get('/earnings', authorize('transporter'), transportController.getEarnings);

// Transport requests (by farmer)
router.post('/requests', authorize('farmer'), transportController.createTransportRequest);
router.get('/requests/farmer', authorize('farmer'), transportController.getFarmerTransportRequests);

module.exports = router;
