import { AIInsight, DiseaseDetection, PriceForecast } from '../types/ai-insights';

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'sell-recommendation',
    title: 'Optimal Time to Sell Wheat',
    description: 'Market analysis suggests wheat prices will increase by 8% in the next 2 weeks.',
    confidence: 85,
    recommendation: 'Hold your wheat inventory for 10-14 days to maximize profit. Expected gain: ₹15,600.',
    actionButton: {
      label: 'View Price Trends',
      action: '/farmer/market-insights',
    },
    priority: 'high',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'ai2',
    type: 'demand-prediction',
    title: 'High Demand for Tomatoes',
    description: 'AI forecasts 45% increase in tomato demand due to upcoming festival season.',
    confidence: 78,
    recommendation: 'Consider harvesting tomatoes early and listing at competitive prices for bulk orders.',
    actionButton: {
      label: 'Add Listing',
      action: '/farmer/add-listing',
    },
    priority: 'medium',
    createdAt: new Date('2024-02-19'),
  },
  {
    id: 'ai3',
    type: 'market-trend',
    title: 'Cotton Market Surge',
    description: 'Textile industry showing increased activity. Cotton prices trending upward.',
    confidence: 82,
    recommendation: 'Good time to negotiate with buyers. Current market supports premium pricing.',
    priority: 'high',
    createdAt: new Date('2024-02-18'),
  },
  {
    id: 'ai4',
    type: 'price-forecast',
    title: 'Onion Price Volatility Alert',
    description: 'Sharp price fluctuations expected in onion market over next 7 days.',
    confidence: 72,
    recommendation: 'Monitor daily prices closely. Consider selling before Feb 28 to avoid potential price drops.',
    actionButton: {
      label: 'Check Market Prices',
      action: '/farmer/market-insights',
    },
    priority: 'medium',
    createdAt: new Date('2024-02-20'),
  },
];

export const mockPriceForecasts: PriceForecast[] = [
  {
    cropName: 'Wheat',
    currentPrice: 2500,
    predictedPrices: [
      { date: '2024-02-25', price: 2540, confidence: 85 },
      { date: '2024-03-01', price: 2580, confidence: 82 },
      { date: '2024-03-05', price: 2620, confidence: 78 },
      { date: '2024-03-10', price: 2650, confidence: 72 },
    ],
    bestSellDate: '2024-03-05',
    expectedProfit: 15600,
    recommendation: 'Hold for 2 weeks. Market conditions favorable for price increase.',
  },
  {
    cropName: 'Tomato',
    currentPrice: 35,
    predictedPrices: [
      { date: '2024-02-25', price: 32, confidence: 72 },
      { date: '2024-03-01', price: 30, confidence: 68 },
      { date: '2024-03-05', price: 28, confidence: 65 },
      { date: '2024-03-10', price: 26, confidence: 60 },
    ],
    bestSellDate: 'Now',
    expectedProfit: -8400,
    recommendation: 'Sell immediately. Declining trend expected due to oversupply.',
  },
];

export const mockDiseaseDetections: DiseaseDetection[] = [
  {
    id: 'dis1',
    cropName: 'Tomato',
    imageUrl: '/placeholder.svg?height=400&width=400',
    detectedDisease: 'Late Blight',
    confidence: 92,
    severity: 'high',
    symptoms: [
      'Water-soaked lesions on leaves',
      'White mold growth on leaf underside',
      'Brown spots on fruits',
      'Rapid spread during humid conditions',
    ],
    treatment: {
      chemical: [
        'Apply Mancozeb 75% WP @ 2.5g/liter',
        'Use Copper Oxychloride @ 3g/liter',
        'Spray at 7-day intervals',
      ],
      organic: [
        'Bordeaux mixture spray',
        'Neem oil application',
        'Remove infected leaves immediately',
      ],
      preventive: [
        'Ensure proper plant spacing',
        'Avoid overhead irrigation',
        'Use disease-resistant varieties',
        'Crop rotation with non-solanaceous crops',
      ],
    },
    yieldImpact: {
      current: 35,
      withTreatment: 15,
      withoutTreatment: 60,
    },
    detectedAt: new Date('2024-02-18'),
  },
  {
    id: 'dis2',
    cropName: 'Wheat',
    imageUrl: '/placeholder.svg?height=400&width=400',
    detectedDisease: 'Leaf Rust',
    confidence: 88,
    severity: 'medium',
    symptoms: [
      'Orange-red pustules on leaves',
      'Yellowing of affected areas',
      'Premature leaf drying',
    ],
    treatment: {
      chemical: [
        'Apply Propiconazole @ 1ml/liter',
        'Use Tebuconazole @ 0.5ml/liter',
        'Two sprays at 15-day intervals',
      ],
      organic: [
        'Sulfur dust application',
        'Garlic extract spray',
      ],
      preventive: [
        'Plant resistant varieties',
        'Timely sowing',
        'Balanced fertilization',
      ],
    },
    yieldImpact: {
      current: 20,
      withTreatment: 8,
      withoutTreatment: 40,
    },
    detectedAt: new Date('2024-02-16'),
  },
];
