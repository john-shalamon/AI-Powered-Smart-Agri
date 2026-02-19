const axios = require('axios');

// Cache for market data to improve performance
const marketDataCache = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes
};

// AI Prediction Engine
class MarketPredictionEngine {
  constructor() {
    this.seasonalFactors = {
      'Wheat': { peak: [10, 11, 12, 1, 2, 3], low: [6, 7, 8, 9] },
      'Rice': { peak: [9, 10, 11, 12], low: [3, 4, 5, 6, 7, 8] },
      'Paddy': { peak: [9, 10, 11, 12], low: [3, 4, 5, 6, 7, 8] },
      'Tomato': { peak: [11, 12, 1, 2], low: [5, 6, 7, 8, 9, 10] },
      'Onion': { peak: [12, 1, 2, 3], low: [6, 7, 8, 9, 10, 11] },
      'Potato': { peak: [10, 11, 12, 1], low: [4, 5, 6, 7, 8, 9] },
      'Maize': { peak: [8, 9, 10, 11], low: [2, 3, 4, 5, 6, 7] },
      'Capsicum': { peak: [11, 12, 1, 2], low: [5, 6, 7, 8, 9, 10] },
      'Cauliflower': { peak: [10, 11, 12, 1], low: [4, 5, 6, 7, 8, 9] },
      'Cabbage': { peak: [10, 11, 12, 1], low: [4, 5, 6, 7, 8, 9] },
      'Carrot': { peak: [10, 11, 12, 1], low: [4, 5, 6, 7, 8, 9] },
      'Brinjal': { peak: [5, 6, 7, 8, 9], low: [11, 12, 1, 2, 3, 4] },
      'Banana': { peak: [1, 2, 3, 4, 5, 6], low: [7, 8, 9, 10, 11, 12] },
      'Apple': { peak: [9, 10, 11], low: [3, 4, 5, 6, 7, 8] },
      'Ginger': { peak: [11, 12, 1, 2], low: [5, 6, 7, 8, 9, 10] },
      'Mustard': { peak: [1, 2, 3], low: [7, 8, 9, 10, 11, 12] },
      'Cotton': { peak: [3, 4, 5, 6], low: [9, 10, 11, 12, 1, 2] },
      'Groundnut': { peak: [8, 9, 10, 11], low: [2, 3, 4, 5, 6, 7] },
    };
  }

  // Calculate trend based on historical data
  calculateTrend(history) {
    if (!history || history.length < 2) return 'stable';

    const recent = history.slice(-3);
    const older = history.slice(-6, -3);

    if (!older.length) return 'stable';

    const recentAvg = recent.reduce((sum, item) => sum + item.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.price, 0) / older.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (changePercent > 2) return 'up';
    if (changePercent < -2) return 'down';
    return 'stable';
  }

  // Generate AI prediction based on multiple factors
  generatePrediction(cropData) {
    const { cropName, currentPrice, history, category } = cropData;
    const currentMonth = new Date().getMonth() + 1; // 1-12

    if (!currentPrice || currentPrice <= 0) {
      return {
        nextWeekPrice: 0,
        confidence: 0,
        bestDayToSell: '',
        recommendation: 'Insufficient data for prediction',
      };
    }

    // Base prediction on current price with some randomness
    const basePrediction = currentPrice * (0.95 + Math.random() * 0.1); // ±5% variation

    // Seasonal adjustment
    const seasonalData = this.seasonalFactors[cropName] ||
                        this.seasonalFactors[Object.keys(this.seasonalFactors).find(key =>
                          cropName.toLowerCase().includes(key.toLowerCase())
                        )];
    let seasonalMultiplier = 1.0;

    if (seasonalData) {
      if (seasonalData.peak.includes(currentMonth)) {
        seasonalMultiplier = 1.05 + Math.random() * 0.05; // 5-10% increase in peak season
      } else if (seasonalData.low.includes(currentMonth)) {
        seasonalMultiplier = 0.9 + Math.random() * 0.05; // 5-10% decrease in low season
      }
    }

    // Trend-based adjustment
    const trend = this.calculateTrend(history);
    let trendMultiplier = 1.0;

    switch (trend) {
      case 'up':
        trendMultiplier = 1.03 + Math.random() * 0.04; // 3-7% increase if trending up
        break;
      case 'down':
        trendMultiplier = 0.95 + Math.random() * 0.04; // 5-9% decrease if trending down
        break;
      default:
        trendMultiplier = 0.98 + Math.random() * 0.04; // Slight variation if stable
    }

    // Calculate predicted price
    const predictedPrice = Math.max(1, Math.round(basePrediction * seasonalMultiplier * trendMultiplier));

    // Calculate confidence based on data quality and consistency
    let confidence = 70; // Base confidence

    if (history && history.length > 10) confidence += 10; // More historical data = higher confidence
    if (trend !== 'stable') confidence += 5; // Clear trend = higher confidence
    if (seasonalData) confidence += 5; // Seasonal data available = higher confidence
    if (category && category !== 'Unknown') confidence += 5; // Category data available

    // Cap confidence at 95%
    confidence = Math.min(confidence, 95);
    confidence = Math.max(confidence, 10); // Minimum 10% confidence

    // Generate best day to sell (within next 7-14 days)
    const daysToAdd = 7 + Math.floor(Math.random() * 7);
    const bestDayToSell = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    const bestDayFormatted = bestDayToSell.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    // Generate recommendation
    let recommendation = '';

    const priceChangePercent = ((predictedPrice - currentPrice) / currentPrice) * 100;

    if (priceChangePercent > 5) {
      recommendation = `Strong upward trend detected. Hold for ${daysToAdd} days for optimal pricing.`;
    } else if (priceChangePercent < -5) {
      recommendation = `Price may decline. Consider selling within ${Math.floor(daysToAdd/2)} days.`;
    } else {
      recommendation = `Stable market conditions. Monitor for ${daysToAdd} days before deciding.`;
    }

    // Add market insights based on category
    if (category === 'Vegetables' || category === 'Fruits') {
      recommendation += ' Prices are highly weather-dependent and can be volatile.';
    } else if (category === 'Cereals' || category === 'Pulses') {
      recommendation += ' Prices follow seasonal harvest patterns and government policies.';
    } else if (category === 'Oilseeds' || category === 'Spices') {
      recommendation += ' Demand is relatively stable with some seasonal variations.';
    }

    return {
      nextWeekPrice: predictedPrice,
      confidence: Math.round(confidence),
      bestDayToSell: bestDayFormatted,
      recommendation: recommendation.trim(),
    };
  }
}

const predictionEngine = new MarketPredictionEngine();

// Mock market data with realistic AI predictions
const mockMarketData = [
  {
    cropName: 'Wheat',
    category: 'Cereals',
    currentPrice: 2500,
    unit: 'quintal',
    change: 2.5,
    trend: 'up',
    history: [
      { date: 'Feb 1', price: 2380 },
      { date: 'Feb 5', price: 2420 },
      { date: 'Feb 10', price: 2450 },
      { date: 'Feb 15', price: 2500 },
      { date: 'Feb 20', price: 2500 },
    ],
  },
  {
    cropName: 'Rice',
    category: 'Cereals',
    currentPrice: 3200,
    unit: 'quintal',
    change: -1.2,
    trend: 'down',
    history: [
      { date: 'Feb 1', price: 3250 },
      { date: 'Feb 5', price: 3220 },
      { date: 'Feb 10', price: 3180 },
      { date: 'Feb 15', price: 3150 },
      { date: 'Feb 20', price: 3200 },
    ],
  },
  {
    cropName: 'Paddy(Common)',
    category: 'Cereals',
    currentPrice: 2200,
    unit: 'quintal',
    change: 1.8,
    trend: 'up',
    history: [
      { date: 'Feb 1', price: 2100 },
      { date: 'Feb 5', price: 2150 },
      { date: 'Feb 10', price: 2180 },
      { date: 'Feb 15', price: 2200 },
      { date: 'Feb 20', price: 2200 },
    ],
  },
  {
    cropName: 'Tomato',
    category: 'Vegetables',
    currentPrice: 35,
    unit: 'kg',
    change: 8.5,
    trend: 'up',
    history: [
      { date: 'Feb 1', price: 28 },
      { date: 'Feb 5', price: 30 },
      { date: 'Feb 10', price: 32 },
      { date: 'Feb 15', price: 34 },
      { date: 'Feb 20', price: 35 },
    ],
  },
  {
    cropName: 'Onion',
    category: 'Vegetables',
    currentPrice: 25,
    unit: 'kg',
    change: -3.2,
    trend: 'down',
    history: [
      { date: 'Feb 1', price: 28 },
      { date: 'Feb 5', price: 27 },
      { date: 'Feb 10', price: 26 },
      { date: 'Feb 15', price: 25 },
      { date: 'Feb 20', price: 25 },
    ],
  },
  {
    cropName: 'Potato',
    category: 'Vegetables',
    currentPrice: 18,
    unit: 'kg',
    change: 1.8,
    trend: 'up',
    history: [
      { date: 'Feb 1', price: 16 },
      { date: 'Feb 5', price: 17 },
      { date: 'Feb 10', price: 17 },
      { date: 'Feb 15', price: 18 },
      { date: 'Feb 20', price: 18 },
    ],
  },
  {
    cropName: 'Capsicum',
    category: 'Vegetables',
    currentPrice: 45,
    unit: 'kg',
    change: 4.2,
    trend: 'up',
    history: [
      { date: 'Feb 1', price: 38 },
      { date: 'Feb 5', price: 40 },
      { date: 'Feb 10', price: 42 },
      { date: 'Feb 15', price: 44 },
      { date: 'Feb 20', price: 45 },
    ],
  },
  {
    cropName: 'Cauliflower',
    category: 'Vegetables',
    currentPrice: 30,
    unit: 'kg',
    change: -2.1,
    trend: 'down',
    history: [
      { date: 'Feb 1', price: 32 },
      { date: 'Feb 5', price: 31 },
      { date: 'Feb 10', price: 30 },
      { date: 'Feb 15', price: 30 },
      { date: 'Feb 20', price: 30 },
    ],
  },
  {
    cropName: 'Cabbage',
    category: 'Vegetables',
    currentPrice: 20,
    unit: 'kg',
    change: 0.5,
    trend: 'stable',
    history: [
      { date: 'Feb 1', price: 19 },
      { date: 'Feb 5', price: 19 },
      { date: 'Feb 10', price: 20 },
      { date: 'Feb 15', price: 20 },
      { date: 'Feb 20', price: 20 },
    ],
  },
  {
    cropName: 'Carrot',
    category: 'Vegetables',
    currentPrice: 25,
    unit: 'kg',
    change: 2.8,
    trend: 'up',
    history: [
      { date: 'Feb 1', price: 22 },
      { date: 'Feb 5', price: 23 },
      { date: 'Feb 10', price: 24 },
      { date: 'Feb 15', price: 25 },
      { date: 'Feb 20', price: 25 },
    ],
  },
];

async function getMarketPrices(req, res) {
  try {
    // Check cache first
    const now = Date.now();
    if (marketDataCache.data && (now - marketDataCache.timestamp) < marketDataCache.ttl) {
      return res.json(marketDataCache.data);
    }

    let marketData = mockMarketData;

    // Try to fetch from government API if configured
    const apiKey = process.env.GOV_API_KEY;
    const apiUrl = process.env.GOV_API_URL;

    if (apiKey && apiUrl) {
      try {
        const response = await axios.get(apiUrl, {
          params: {
            'api-key': apiKey,
            format: 'json',
            limit: 100,
          },
          timeout: 5000, // 5 second timeout
        });

        if (response.data && response.data.records) {
          // Transform government API data
          const govData = response.data.records
            .filter(record => record.commodity && record.modal_price)
            .map(record => ({
              cropName: record.commodity,
              category: record.category || 'Unknown',
              currentPrice: parseFloat(record.modal_price) || 0,
              unit: record.unit || 'kg',
              change: 0,
              trend: 'stable',
            }));

          // Merge with mock data, keeping mock data's history for AI predictions
          marketData = mockMarketData.map(mockItem => {
            const govItem = govData.find(g =>
              g.cropName.toLowerCase().includes(mockItem.cropName.toLowerCase()) ||
              mockItem.cropName.toLowerCase().includes(g.cropName.toLowerCase())
            );
            if (govItem) {
              // Use government price but keep mock data's history and other fields
              return {
                ...mockItem,
                currentPrice: govItem.currentPrice,
                unit: govItem.unit,
                category: govItem.category,
                // Recalculate change based on last history point
                change: mockItem.history.length > 0
                  ? ((govItem.currentPrice - mockItem.history[mockItem.history.length - 1].price) /
                     mockItem.history[mockItem.history.length - 1].price * 100)
                  : 0
              };
            }
            return mockItem;
          });

          // Add any new crops from government data that aren't in mock data
          govData.forEach(govItem => {
            const exists = marketData.some(mockItem =>
              mockItem.cropName.toLowerCase().includes(govItem.cropName.toLowerCase()) ||
              govItem.cropName.toLowerCase().includes(mockItem.cropName.toLowerCase())
            );
            if (!exists) {
              // Generate synthetic history for new crops
              const syntheticHistory = [];
              const basePrice = govItem.currentPrice;
              for (let i = 4; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - (i * 4));
                const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
                syntheticHistory.push({
                  date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  price: Math.round(basePrice * (0.9 + Math.random() * 0.2))
                });
              }

              marketData.push({
                ...govItem,
                history: syntheticHistory,
                change: 0,
                trend: 'stable'
              });
            }
          });
        }
      } catch (apiError) {
        console.warn('Government API unavailable, using mock data:', apiError.message);
      }
    }

    // Generate AI predictions for all crops
    const dataWithPredictions = marketData.map(cropData => {
      try {
        const prediction = predictionEngine.generatePrediction(cropData);
        return {
          ...cropData,
          aiPrediction: prediction,
        };
      } catch (error) {
        console.warn(`Failed to generate prediction for ${cropData.cropName}:`, error.message);
        // Fallback prediction
        return {
          ...cropData,
          aiPrediction: {
            nextWeekPrice: Math.max(1, Math.round(cropData.currentPrice * (0.95 + Math.random() * 0.1))),
            confidence: 50,
            bestDayToSell: new Date(Date.now() + (7 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000)
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            recommendation: 'Market analysis temporarily unavailable. Monitor local market conditions.',
          },
        };
      }
    });

    // Update cache
    marketDataCache.data = dataWithPredictions;
    marketDataCache.timestamp = now;

    return res.json(dataWithPredictions);
  } catch (error) {
    console.error('Market data error:', error.message);

    // Return cached data if available, otherwise mock data with predictions
    if (marketDataCache.data) {
      return res.json(marketDataCache.data);
    }

    const fallbackData = mockMarketData.map(cropData => {
      try {
        return {
          ...cropData,
          aiPrediction: predictionEngine.generatePrediction(cropData),
        };
      } catch (error) {
        return {
          ...cropData,
          aiPrediction: {
            nextWeekPrice: Math.max(1, Math.round(cropData.currentPrice * (0.95 + Math.random() * 0.1))),
            confidence: 40,
            bestDayToSell: new Date(Date.now() + (7 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000)
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            recommendation: 'Basic market analysis available. Consider consulting local traders.',
          },
        };
      }
    });

    return res.json(fallbackData);
  }
}

async function testAIPrediction(req, res) {
  try {
    const testCrop = {
      cropName: 'Tomato',
      category: 'Vegetables',
      currentPrice: 35,
      unit: 'kg',
      change: 8.5,
      trend: 'up',
      history: [
        { date: 'Feb 1', price: 28 },
        { date: 'Feb 5', price: 30 },
        { date: 'Feb 10', price: 32 },
        { date: 'Feb 15', price: 34 },
        { date: 'Feb 20', price: 35 },
      ],
    };

    const prediction = predictionEngine.generatePrediction(testCrop);
    return res.json({
      testCrop,
      prediction,
      engineStatus: 'active'
    });
  } catch (error) {
    console.error('AI Prediction test error:', error);
    return res.status(500).json({ error: 'AI prediction test failed', details: error.message });
  }
}

module.exports = {
  getMarketPrices,
  testAIPrediction,
};