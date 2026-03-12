// Weather data service - provides agricultural weather insights
// Uses mock data for MVP, ready for OpenWeatherMap API integration

const weatherCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Mock weather data for key agricultural regions
const mockWeatherData = {
  'Delhi': { temp: 28, humidity: 45, rainfall: 0, windSpeed: 12, condition: 'Sunny', icon: 'sun', forecast: 'Clear skies expected for the next 3 days. Good for harvesting.' },
  'Ahmedabad': { temp: 32, humidity: 38, rainfall: 0, windSpeed: 15, condition: 'Hot', icon: 'sun', forecast: 'Hot and dry conditions. Ensure adequate irrigation for crops.' },
  'Mumbai': { temp: 30, humidity: 72, rainfall: 5, windSpeed: 18, condition: 'Humid', icon: 'cloud-rain', forecast: 'Light showers expected. Good conditions for rice cultivation.' },
  'Pune': { temp: 27, humidity: 55, rainfall: 2, windSpeed: 10, condition: 'Partly Cloudy', icon: 'cloud-sun', forecast: 'Moderate weather. Ideal for most agricultural activities.' },
  'Jaipur': { temp: 35, humidity: 25, rainfall: 0, windSpeed: 20, condition: 'Hot & Dry', icon: 'sun', forecast: 'Extreme heat expected. Water conservation recommendations active.' },
  'Lucknow': { temp: 30, humidity: 60, rainfall: 1, windSpeed: 8, condition: 'Warm', icon: 'cloud-sun', forecast: 'Warm weather with light wind. Good for wheat drying.' },
  'Kolkata': { temp: 31, humidity: 78, rainfall: 8, windSpeed: 14, condition: 'Rainy', icon: 'cloud-rain', forecast: 'Moderate rainfall expected. Monitor rice paddies for flooding.' },
  'Bangalore': { temp: 25, humidity: 65, rainfall: 3, windSpeed: 11, condition: 'Pleasant', icon: 'cloud-sun', forecast: 'Mild temperatures ideal for vegetable cultivation.' },
  'Chennai': { temp: 33, humidity: 70, rainfall: 0, windSpeed: 16, condition: 'Hot & Humid', icon: 'sun', forecast: 'Hot and humid. Pest activity may increase - monitor closely.' },
  'Hyderabad': { temp: 29, humidity: 50, rainfall: 1, windSpeed: 13, condition: 'Warm', icon: 'cloud-sun', forecast: 'Moderate weather conditions favorable for most crops.' },
};

// Agricultural alerts based on weather
const getAgriculturalAlerts = (weather) => {
  const alerts = [];

  if (weather.temp > 40) {
    alerts.push({ type: 'danger', title: 'Extreme Heat Warning', message: 'Temperature exceeds 40°C. Increase irrigation frequency and provide shade for sensitive crops.' });
  } else if (weather.temp > 35) {
    alerts.push({ type: 'warning', title: 'Heat Advisory', message: 'High temperatures may stress crops. Ensure adequate water supply.' });
  }

  if (weather.humidity > 80) {
    alerts.push({ type: 'warning', title: 'High Humidity Alert', message: 'High humidity increases fungal disease risk. Consider preventive fungicide application.' });
  }

  if (weather.rainfall > 20) {
    alerts.push({ type: 'danger', title: 'Heavy Rainfall Warning', message: 'Heavy rainfall expected. Ensure proper drainage and protect harvested crops.' });
  } else if (weather.rainfall > 5) {
    alerts.push({ type: 'info', title: 'Rainfall Expected', message: 'Moderate rainfall expected. Good natural irrigation for crops.' });
  }

  if (weather.windSpeed > 30) {
    alerts.push({ type: 'warning', title: 'Strong Wind Advisory', message: 'High wind speeds may damage tall crops. Consider staking or support structures.' });
  }

  if (weather.temp < 5) {
    alerts.push({ type: 'danger', title: 'Frost Warning', message: 'Near-freezing temperatures. Protect sensitive crops with covers or mulching.' });
  }

  if (alerts.length === 0) {
    alerts.push({ type: 'success', title: 'Favorable Conditions', message: 'Current weather conditions are favorable for agricultural activities.' });
  }

  return alerts;
};

// Generate 7-day forecast
const generate7DayForecast = (baseWeather, city) => {
  const forecast = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayName = days[date.getDay()];

    // Add realistic variation
    const tempVariation = (Math.random() - 0.5) * 6;
    const rainChance = Math.random() * 100;

    forecast.push({
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayName,
      date: date.toISOString().split('T')[0],
      tempMax: Math.round(baseWeather.temp + tempVariation + 3),
      tempMin: Math.round(baseWeather.temp + tempVariation - 5),
      humidity: Math.round(baseWeather.humidity + (Math.random() - 0.5) * 20),
      rainfall: rainChance > 70 ? Math.round(Math.random() * 15) : 0,
      condition: rainChance > 70 ? 'Rainy' : rainChance > 40 ? 'Partly Cloudy' : 'Sunny',
      icon: rainChance > 70 ? 'cloud-rain' : rainChance > 40 ? 'cloud-sun' : 'sun',
    });
  }

  return forecast;
};

// Get weather for a city
const getWeather = (req, res) => {
  try {
    const { city = 'Delhi' } = req.query;

    // Check cache
    const cached = weatherCache.get(city);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    // Get base weather (find closest match or default)
    const cityKey = Object.keys(mockWeatherData).find(k =>
      k.toLowerCase() === city.toLowerCase()
    ) || 'Delhi';

    const baseWeather = { ...mockWeatherData[cityKey] };

    // Add slight real-time variation
    baseWeather.temp += Math.round((Math.random() - 0.5) * 3);
    baseWeather.humidity += Math.round((Math.random() - 0.5) * 10);

    const result = {
      city: city,
      current: baseWeather,
      alerts: getAgriculturalAlerts(baseWeather),
      forecast: generate7DayForecast(baseWeather, city),
      lastUpdated: new Date(),
      cropRecommendations: getCropRecommendations(baseWeather),
    };

    // Cache result
    weatherCache.set(city, { data: result, timestamp: Date.now() });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crop recommendations based on weather
const getCropRecommendations = (weather) => {
  const recommendations = [];

  if (weather.temp >= 25 && weather.temp <= 35 && weather.humidity >= 40 && weather.humidity <= 70) {
    recommendations.push({ crop: 'Rice', suitability: 'high', reason: 'Temperature and humidity are ideal' });
    recommendations.push({ crop: 'Wheat', suitability: 'medium', reason: 'Slightly warm but manageable' });
  }

  if (weather.temp >= 20 && weather.temp <= 30) {
    recommendations.push({ crop: 'Tomato', suitability: 'high', reason: 'Perfect temperature range' });
    recommendations.push({ crop: 'Potato', suitability: 'high', reason: 'Moderate temperatures favor growth' });
  }

  if (weather.temp >= 30 && weather.humidity < 50) {
    recommendations.push({ crop: 'Cotton', suitability: 'high', reason: 'Hot and dry conditions are ideal' });
    recommendations.push({ crop: 'Groundnut', suitability: 'medium', reason: 'Can tolerate heat well' });
  }

  if (weather.rainfall > 5) {
    recommendations.push({ crop: 'Rice', suitability: 'high', reason: 'Good natural irrigation from rainfall' });
  }

  if (recommendations.length === 0) {
    recommendations.push({ crop: 'Various', suitability: 'medium', reason: 'Current conditions are moderate for most crops' });
  }

  return recommendations;
};

// Get weather for multiple locations
const getMultiLocationWeather = (req, res) => {
  try {
    const cities = (req.query.cities || 'Delhi,Mumbai,Ahmedabad').split(',');
    const results = {};

    cities.forEach(city => {
      const cityTrim = city.trim();
      const cityKey = Object.keys(mockWeatherData).find(k =>
        k.toLowerCase() === cityTrim.toLowerCase()
      ) || 'Delhi';

      const baseWeather = { ...mockWeatherData[cityKey] };
      baseWeather.temp += Math.round((Math.random() - 0.5) * 3);

      results[cityTrim] = {
        current: baseWeather,
        alerts: getAgriculturalAlerts(baseWeather),
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWeather,
  getMultiLocationWeather,
};
