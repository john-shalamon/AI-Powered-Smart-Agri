const axios = require('axios');
const fs = require('fs');
const { getJob, updateJob } = require('../store/jobStore');

function extractJsonObject(text) {
  if (!text || typeof text !== 'string') return null;
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch ? fencedMatch[1] : text;
  try {
    return JSON.parse(candidate);
  } catch (_err) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch (_err2) {
        return null;
      }
    }
    return null;
  }
}

// Simple in-process queue for MVP
const queue = [];
let running = false;

function enqueue(jobId, filePath = null) {
  queue.push({ jobId, filePath });
  _run();
}

async function _run() {
  if (running) return;
  running = true;
  while (queue.length > 0) {
    const { jobId, filePath } = queue.shift();
    try {
      updateJob(jobId, { status: 'processing' });

      const result = await _infer(filePath);

      updateJob(jobId, { status: 'completed', result });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Job failed', err);
      updateJob(jobId, { status: 'failed', error: err.message || String(err) });
    }
  }
  running = false;
}

async function _infer(filePath) {
  // If AI provider configured, attempt real inference
  const providerUrl = process.env.AI_PROVIDER_URL;
  const apiKey = process.env.AI_PROVIDER_API_KEY;

  if (providerUrl && apiKey && filePath) {
    try {
      const imageBuffer = fs.readFileSync(filePath);
      const base64 = imageBuffer.toString('base64');
      const data = {
        model: 'grok-vision-beta',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this crop image for diseases. Provide disease name, confidence percentage (0-100), severity level (low/medium/high), symptoms list (array), treatment options (object with chemical, organic, preventive arrays), and yield impact (object with current, withTreatment, withoutTreatment percentages). Respond in valid JSON format only.'
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64}` }
            }
          ]
        }]
      };
      const resp = await axios.post(`${providerUrl}/chat/completions`, data, {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 20000,
      });
      const content = resp.data.choices[0].message.content;
      const parsed = extractJsonObject(content);
      if (parsed) return parsed;
      throw new Error('Provider response is not valid JSON');
    } catch (err) {
      // Fall through to mock if provider call fails
      // eslint-disable-next-line no-console
      console.warn('AI provider call failed, falling back to mock result', err?.message);
    }
  }

  // Mock inference (MVP)
  await new Promise((r) => setTimeout(r, 1200));
  return {
    cropName: 'Tomato',
    imageUrl: '/placeholder.svg?height=400&width=400',
    detectedDisease: 'Late Blight (mock)',
    confidence: 90,
    severity: 'high',
    symptoms: ['Water-soaked lesions', 'White mold underside'],
    treatment: {
      chemical: ['Mancozeb @ recommended rate'],
      organic: ['Neem oil spray', 'Remove infected leaves'],
      preventive: ['Crop rotation', 'Avoid overhead irrigation'],
    },
    yieldImpact: { current: 35, withTreatment: 15, withoutTreatment: 60 },
    detectedAt: new Date().toISOString(),
  };
}

module.exports = { enqueue };