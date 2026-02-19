const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const aiController = require('../controllers/ai.controller');
const marketController = require('../controllers/market.controller');

// Accepts optional multipart field `image` and returns a jobId
router.post('/disease-detection', upload.single('image'), aiController.submitDiseaseDetection);

// Job status
router.get('/jobs/:id', aiController.getJobStatus);

// Market prices from government data
router.get('/market-prices', marketController.getMarketPrices);

// Debug endpoint for testing AI predictions
router.get('/test-ai-prediction', marketController.testAIPrediction);

module.exports = router;