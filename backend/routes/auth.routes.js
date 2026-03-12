const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { validate, userRegistrationSchema, userLoginSchema } = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validate(userRegistrationSchema), authController.register);
router.post('/login', validate(userLoginSchema), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
