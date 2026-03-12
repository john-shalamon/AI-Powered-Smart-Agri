const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');
const { optionalAuth } = require('../middleware/authMiddleware');

// Weather routes (public with optional auth)
router.get('/', optionalAuth, weatherController.getWeather);
router.get('/multi', optionalAuth, weatherController.getMultiLocationWeather);

module.exports = router;
