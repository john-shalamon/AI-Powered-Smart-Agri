const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const aiController = require('../controllers/ai.controller');

// Accepts optional multipart field `image` and returns a jobId
router.post('/disease-detection', upload.single('image'), aiController.submitDiseaseDetection);

// Job status
router.get('/jobs/:id', aiController.getJobStatus);

module.exports = router;