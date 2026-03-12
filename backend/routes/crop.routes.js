const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
const { authenticate, authorize, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', optionalAuth, cropController.getAllCrops);
router.get('/categories', cropController.getCategories);
router.get('/:id', optionalAuth, cropController.getCropById);

// Protected routes (farmer only)
router.get('/farmer/my-listings', authenticate, authorize('farmer'), cropController.getCropsByFarmer);
router.post('/', authenticate, authorize('farmer'), upload.single('image'), cropController.createCrop);
router.put('/:id', authenticate, authorize('farmer', 'admin'), upload.single('image'), cropController.updateCrop);
router.delete('/:id', authenticate, authorize('farmer', 'admin'), cropController.deleteCrop);

module.exports = router;
