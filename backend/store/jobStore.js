const { v4: uuidv4 } = require('uuid');

const jobs = new Map();

function createJob({ type, status = 'pending', input = null }) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const job = {
    id,
    type,
    status,
    input,
    result: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(id, job);
  return job;
}

function updateJob(id, patch) {
  const job = jobs.get(id);
  if (!job) return null;
  const updated = { ...job, ...patch, updatedAt: new Date().toISOString() };
  jobs.set(id, updated);
  return updated;
}

function getJob(id) {
  return jobs.get(id) || null;
}

function clearJobs() {
  jobs.clear();
}

module.exports = {
  createJob,
  updateJob,
  getJob,
  clearJobs,
};