'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { weatherApi } from '@/lib/api.service';

interface WeatherData {
  city: string;
  current: {
    temp: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
    icon: string;
    forecast: string;
  };
  alerts: Array<{
    type: string;
    title: string;
    message: string;
  }>;
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    rainfall: number;
    condition: string;
    icon: string;
  }>;
  cropRecommendations: Array<{
    crop: string;
    suitability: string;
    reason: string;
  }>;
}

const getWeatherIcon = (icon: string, size = 'w-6 h-6') => {
  switch (icon) {
    case 'sun': return <Sun className={`${size} text-yellow-500`} />;
    case 'cloud-rain': return <CloudRain className={`${size} text-blue-500`} />;
    case 'cloud-sun': return <Cloud className={`${size} text-slate-400`} />;
    default: return <Sun className={`${size} text-yellow-500`} />;
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
    default: return <Info className="w-4 h-4 text-blue-500" />;
  }
};

const getAlertBg = (type: string) => {
  switch (type) {
    case 'danger': return 'bg-red-50 border-red-200';
    case 'warning': return 'bg-yellow-50 border-yellow-200';
    case 'success': return 'bg-green-50 border-green-200';
    default: return 'bg-blue-50 border-blue-200';
  }
};

interface WeatherWidgetProps {
  city?: string;
  compact?: boolean;
}

export function WeatherWidget({ city = 'Delhi', compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    weatherApi.getWeather(city)
      .then(data => setWeather(data))
      .catch(() => {
        // Use fallback data
        setWeather({
          city,
          current: { temp: 28, humidity: 45, rainfall: 0, windSpeed: 12, condition: 'Sunny', icon: 'sun', forecast: 'Clear skies expected.' },
          alerts: [{ type: 'success', title: 'Good Conditions', message: 'Weather is favorable for farming.' }],
          forecast: [],
          cropRecommendations: [],
        });
      })
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.current.icon, 'w-8 h-8')}
              <div>
                <p className="text-2xl font-bold">{weather.current.temp}°C</p>
                <p className="text-sm text-muted-foreground">{weather.city} • {weather.current.condition}</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Droplets className="w-3 h-3" /> {weather.current.humidity}%
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Wind className="w-3 h-3" /> {weather.current.windSpeed} km/h
              </div>
            </div>
          </div>
          {weather.alerts.length > 0 && (
            <div className={`mt-3 p-2 rounded-lg border text-xs ${getAlertBg(weather.alerts[0].type)}`}>
              <div className="flex items-center gap-1">
                {getAlertIcon(weather.alerts[0].type)}
                <span className="font-medium">{weather.alerts[0].title}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cloud className="w-5 h-5 text-cyan-600" />
          Weather & Agricultural Advisory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.current.icon, 'w-12 h-12')}
              <div>
                <p className="text-3xl font-bold">{weather.current.temp}°C</p>
                <p className="text-sm text-muted-foreground">{weather.city} • {weather.current.condition}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-muted-foreground">Humidity</p>
                <p className="font-medium">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-muted-foreground">Wind</p>
                <p className="font-medium">{weather.current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-500" />
              <div>
                <p className="text-muted-foreground">Rainfall</p>
                <p className="font-medium">{weather.current.rainfall} mm</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground italic">{weather.current.forecast}</p>
        </div>

        {/* Alerts */}
        {weather.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Agricultural Alerts</h4>
            {weather.alerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border ${getAlertBg(alert.type)}`}>
                <div className="flex items-center gap-2 mb-1">
                  {getAlertIcon(alert.type)}
                  <span className="font-medium text-sm">{alert.title}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* 7-Day Forecast */}
        {weather.forecast.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">7-Day Forecast</h4>
            <div className="grid grid-cols-7 gap-1">
              {weather.forecast.map((day, i) => (
                <div key={i} className="text-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <p className="text-xs font-medium">{day.day}</p>
                  {getWeatherIcon(day.icon, 'w-5 h-5 mx-auto my-1')}
                  <p className="text-xs font-bold">{day.tempMax}°</p>
                  <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crop Recommendations */}
        {weather.cropRecommendations && weather.cropRecommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Crop Suitability</h4>
            <div className="space-y-1">
              {weather.cropRecommendations.map((rec, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-slate-50">
                  <span>{rec.crop}</span>
                  <Badge
                    variant={rec.suitability === 'high' ? 'default' : 'secondary'}
                    className={rec.suitability === 'high' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {rec.suitability}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
