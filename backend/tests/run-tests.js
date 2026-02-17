const assert = require('assert');
const { createJob, getJob, updateJob, clearJobs } = require('../store/jobStore');
const processor = require('../jobs/diseaseProcessor');

async function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  clearJobs();

  const job = createJob({ type: 'disease-detection', input: { filePath: null } });
  assert(job && job.id, 'Job should be created');

  processor.enqueue(job.id, null);

  // wait up to 5s for job to finish (mock processing is ~1.2s)
  const deadline = Date.now() + 5000;
  let final = null;

  while (Date.now() < deadline) {
    const j = getJob(job.id);
    if (j && (j.status === 'completed' || j.status === 'failed')) {
      final = j;
      break;
    }
    await delay(250);
  }

  assert(final, 'Job did not complete in time');
  assert(final.status === 'completed', `Expected completed status, got ${final.status}`);
  assert(final.result, 'Expected result object');

  console.log('✅ backend tests passed');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});