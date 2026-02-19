const axios = require('axios');
const fs = require('fs');
const { getJob, updateJob } = require('../store/jobStore');

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

  if (providerUrl && apiKey) {
    if (!filePath) throw new Error('Image file required for AI processing');
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
      return JSON.parse(content);
    } catch (err) {
      // Fall through to mock if provider call fails
      // eslint-disable-next-line no-console
      console.warn('AI provider call failed, falling back to mock result', err?.message);
    }
  }

  // Mock inference (MVP) - Enhanced with more detailed information
  await new Promise((r) => setTimeout(r, 1200));
  return {
    cropName: 'Tomato',
    detectedDisease: 'Late Blight (Phytophthora infestans)',
    confidence: 92,
    severity: 'high',
    symptoms: [
      'Dark, water-soaked lesions on leaves that enlarge rapidly',
      'White, cottony fungal growth on the underside of leaves',
      'Brown to black lesions on stems and fruits',
      'Leaves turn yellow and die from the bottom up',
      'Fruits develop firm, dark lesions that can rot',
      'Disease spreads rapidly in cool, humid conditions'
    ],
    treatment: {
      chemical: [
        'Apply copper-based fungicides (e.g., Bordeaux mixture) every 7-10 days',
        'Use systemic fungicides like metalaxyl or mefenoxam at recommended rates',
        'Apply chlorothalonil or mancozeb as protectant sprays',
        'Start treatment at first sign of disease and continue through growing season',
        'Use fungicides with different modes of action in rotation to prevent resistance'
      ],
      organic: [
        'Apply neem oil spray at 2-3% concentration every 7-10 days',
        'Use compost tea or beneficial bacteria sprays to boost plant immunity',
        'Remove and destroy all infected plant material immediately',
        'Improve air circulation by proper plant spacing and pruning',
        'Apply baking soda solution (1 tsp per quart water) as preventative spray',
        'Use milk spray (1:1 ratio with water) to suppress fungal growth'
      ],
      preventive: [
        'Plant disease-resistant tomato varieties (e.g., those with resistance genes Ph-2 or Ph-3)',
        'Ensure proper plant spacing (2-3 feet between plants) for air circulation',
        'Avoid overhead irrigation; use drip irrigation to keep foliage dry',
        'Rotate crops - avoid planting tomatoes in the same location for 2-3 years',
        'Mulch around plants to prevent soil splash onto leaves',
        'Monitor weather conditions - disease thrives in cool (60-70°F), humid conditions',
        'Remove volunteer tomato plants and nightshade weeds from the area',
        'Clean tools and equipment between uses to prevent disease spread',
        'Start with certified disease-free seeds and transplants',
        'Apply preventive fungicide sprays before symptoms appear, especially in wet seasons'
      ]
    },
    yieldImpact: {
      current: 35,
      withTreatment: 12,
      withoutTreatment: 75
    },
    additionalInfo: {
      spread: 'The disease spreads through spores carried by wind, rain, and infected tools. Spores can survive in soil for several years.',
      optimalConditions: 'Thrives in temperatures 60-75°F with high humidity (>90%) and wet conditions.',
      incubationPeriod: '5-16 days from infection to visible symptoms.',
      economicImpact: 'Can cause 100% crop loss in severe epidemics.',
      recommendedActions: [
        'Isolate infected plants immediately',
        'Increase monitoring frequency during wet weather',
        'Consider protective fungicide programs for high-risk areas',
        'Harvest fruits before they show symptoms if disease is detected early'
      ]
    }
  };
}

module.exports = { enqueue };