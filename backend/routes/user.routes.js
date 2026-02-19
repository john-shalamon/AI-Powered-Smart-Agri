const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// All routes require authentication middleware (to be added)

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (soft delete)
router.delete('/:id', userController.deleteUser);

// Change password
router.post('/:id/change-password', userController.changePassword);

module.exports = router;