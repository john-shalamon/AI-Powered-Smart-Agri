'use client';

import { useState, useEffect, useCallback } from 'react';
import { weatherApi } from '@/lib/api.service';

interface WeatherData {
  city: string;
  current: any;
  alerts: any[];
  forecast: any[];
  cropRecommendations: any[];
  lastUpdated: string;
}

export function useWeather(city: string = 'Delhi') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherApi.getWeather(city);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather');
      // Fallback data
      setWeather({
        city,
        current: { temp: 28, humidity: 45, rainfall: 0, windSpeed: 12, condition: 'Sunny', icon: 'sun', forecast: 'Clear skies.' },
        alerts: [{ type: 'success', title: 'Good Conditions', message: 'Weather is favorable.' }],
        forecast: [],
        cropRecommendations: [],
        lastUpdated: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { weather, loading, error, refresh: fetchWeather };
}
