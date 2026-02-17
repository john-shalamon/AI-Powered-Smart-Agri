const path = require('path');
const { createJob, getJob, updateJob } = require('../store/jobStore');
const processor = require('../jobs/diseaseProcessor');

// POST /api/ai/disease-detection
// Accepts an optional `image` multipart field. Returns { jobId }
async function submitDiseaseDetection(req, res) {
  try {
    const file = req.file ? req.file.filename : null;

    const input = {
      filePath: file ? `/uploads/crops/${file}` : null,
    };

    const job = createJob({
      type: 'disease-detection',
      status: 'pending',
      input,
    });

    // Enqueue background processing (in‑process worker for MVP)
    processor.enqueue(job.id, file ? path.join(__dirname, '..', 'uploads', 'crops', file) : null);

    return res.json({ jobId: job.id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit job' });
  }
}

// GET /api/ai/jobs/:id
function getJobStatus(req, res) {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return res.json(job);
}

module.exports = {
  submitDiseaseDetection,
  getJobStatus,
};