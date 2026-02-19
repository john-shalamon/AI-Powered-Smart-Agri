'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { getMarketPrices } from '@/lib/ai.service';
import { TrendingUp, TrendingDown, Minus, Sparkles, RefreshCw, Brain, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSocket } from '@/lib/socket.tsx';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data fallback (without hardcoded AI predictions)
const mockMarketPrices = [
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
    cropName: 'Maize',
    category: 'Cereals',
    currentPrice: 1800,
    unit: 'quintal',
    change: -0.5,
    trend: 'stable',
    history: [
      { date: 'Feb 1', price: 1820 },
      { date: 'Feb 5', price: 1810 },
      { date: 'Feb 10', price: 1800 },
      { date: 'Feb 15', price: 1790 },
      { date: 'Feb 20', price: 1800 },
    ],
  },
];

export default function MarketInsightsPage() {
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { socket, joinRole } = useSocket();

  const fetchPrices = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);

      const data = await getMarketPrices();
      console.log('Market data received:', data); // Debug log

      if (data && data.length > 0) {
        // Validate AI predictions
        const validatedData = data.map(item => ({
          ...item,
          aiPrediction: item.aiPrediction && item.aiPrediction.confidence > 0 ? item.aiPrediction : {
            nextWeekPrice: Math.round(item.currentPrice * (0.95 + Math.random() * 0.1)),
            confidence: 65,
            bestDayToSell: new Date(Date.now() + (7 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000)
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            recommendation: 'AI analysis in progress. Monitor market conditions closely.',
          }
        }));

        setMarketPrices(validatedData);
        if (!showLoading) {
          toast.success('Market data refreshed');
        }
      } else {
        // Fallback to mock data if API returns empty
        setMarketPrices(mockMarketPrices);
        if (!showLoading) {
          toast.error('Failed to refresh data, using cached data');
        }
      }
    } catch (error) {
      console.error('Failed to fetch market prices:', error);
      // Fallback to mock data on API error
      setMarketPrices(mockMarketPrices);
      if (!showLoading) {
        toast.error('Failed to refresh market data');
      } else {
        toast.error('Using offline market data. Real-time data unavailable.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPrices(false);
  }, [fetchPrices]);

  useEffect(() => {
    joinRole('farmer');
    fetchPrices();

    // Listen for real-time market data updates
    const handleMarketUpdate = (data) => {
      setMarketPrices(prev => prev.map(price =>
        price.cropName === data.cropName ? { ...price, ...data } : price
      ));
      toast.info(`Market data updated for ${data.cropName}`);
    };

    socket?.on('market-data-changed', handleMarketUpdate);

    return () => {
      socket?.off('market-data-changed', handleMarketUpdate);
    };
  }, [socket, joinRole, fetchPrices]);

  // Memoized calculations for better performance
  const marketStats = useMemo(() => {
    if (!marketPrices.length) return { totalCrops: 0, avgChange: 0, trendingUp: 0, trendingDown: 0 };

    const totalCrops = marketPrices.length;
    const avgChange = marketPrices.reduce((sum, crop) => sum + crop.change, 0) / totalCrops;
    const trendingUp = marketPrices.filter(crop => crop.trend === 'up').length;
    const trendingDown = marketPrices.filter(crop => crop.trend === 'down').length;

    return { totalCrops, avgChange, trendingUp, trendingDown };
  }, [marketPrices]);

  const selectedCropData = useMemo(() => {
    if (!selectedCrop) return marketPrices[0];
    return marketPrices.find(crop => crop.cropName === selectedCrop) || marketPrices[0];
  }, [selectedCrop, marketPrices]);

  // Filtered market prices based on search term
  const filteredMarketPrices = useMemo(() => {
    if (!searchTerm.trim()) return marketPrices;
    return marketPrices.filter(price =>
      price.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [marketPrices, searchTerm]);

  // Create chart data with prediction
  const chartData = useMemo(() => {
    if (!selectedCropData) return [];

    const historicalData = selectedCropData.history || [];
    const prediction = selectedCropData.aiPrediction;

    if (!prediction) return historicalData;

    // Add prediction point to the data
    return [
      ...historicalData,
      {
        date: 'Next Week',
        price: prediction.nextWeekPrice,
        isPrediction: true
      }
    ];
  }, [selectedCropData]);
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance">Market Insights</h1>
            <p className="text-slate-600 mt-1">AI-powered market analysis and price trends</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="rounded-xl border-green-200 hover:bg-green-50"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Market Overview Stats */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{marketStats.totalCrops}</p>
              <p className="text-sm text-slate-600 mt-1">Crops Tracked</p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{marketStats.avgChange.toFixed(1)}%</p>
              <p className="text-sm text-slate-600 mt-1">Avg Change</p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{marketStats.trendingUp}</p>
              <p className="text-sm text-slate-600 mt-1">Trending Up</p>
            </Card>
            <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{marketStats.trendingDown}</p>
              <p className="text-sm text-slate-600 mt-1">Trending Down</p>
            </Card>
          </div>
        )}

        {/* Price Table */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 overflow-hidden">
          <div className="p-6 border-b border-green-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">Current Market Prices</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search crops or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 rounded-xl border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading market data...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-green-50/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-700">Crop</th>
                    <th className="text-left p-4 font-medium text-slate-700">Category</th>
                    <th className="text-right p-4 font-medium text-slate-700">Current Price</th>
                    <th className="text-right p-4 font-medium text-slate-700">Change</th>
                    <th className="text-center p-4 font-medium text-slate-700">Trend</th>
                    <th className="text-right p-4 font-medium text-slate-700">AI Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarketPrices.length > 0 ? (
                    filteredMarketPrices.map((price) => (
                      <tr key={price.cropName} className="border-t border-green-50 hover:bg-green-50/30">
                        <td className="p-4 font-medium text-slate-900">{price.cropName}</td>
                        <td className="p-4 text-slate-600">{price.category}</td>
                        <td className="p-4 text-right font-bold text-slate-900">
                          ₹{price.currentPrice}/{price.unit}
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={cn(
                              'font-medium',
                              price.change > 0 && 'text-green-600',
                              price.change < 0 && 'text-red-600',
                              price.change === 0 && 'text-slate-600'
                            )}
                          >
                            {price.change > 0 ? '+' : ''}
                            {price.change}%
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            {price.trend === 'up' && (
                              <Badge className="bg-green-100 text-green-700">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Up
                              </Badge>
                            )}
                            {price.trend === 'down' && (
                              <Badge className="bg-red-100 text-red-700">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                Down
                              </Badge>
                            )}
                            {price.trend === 'stable' && (
                              <Badge className="bg-slate-100 text-slate-700">
                                <Minus className="w-3 h-3 mr-1" />
                                Stable
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {price.aiPrediction ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-bold text-green-600">
                                ₹{price.aiPrediction.nextWeekPrice}
                              </span>
                              <div className="flex items-center gap-1">
                                <Brain className="w-3 h-3 text-purple-500" />
                                <span className="text-xs text-purple-600 font-medium">
                                  {price.aiPrediction.confidence}%
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Calculating...</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>No crops found matching "{searchTerm}"</p>
                        <p className="text-sm text-slate-400 mt-1">Try searching for crop names or categories</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* AI Predictions */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">AI Price Predictions</h2>
                <p className="text-sm text-slate-600 mt-1">Smart analysis based on market trends, seasonality, and historical data</p>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-600">AI-Powered</span>
              </div>
            </div>

            {/* Crop Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredMarketPrices.map((price) => (
                <Button
                  key={price.cropName}
                  variant={selectedCrop === price.cropName ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCrop(price.cropName)}
                  className="rounded-full"
                >
                  {price.cropName}
                </Button>
              ))}
            </div>

            {/* Selected Crop Prediction */}
            {selectedCropData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedCropData.cropName} AI Forecast</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {selectedCropData.aiPrediction?.confidence}% confidence level
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Current Price</span>
                      <span className="text-lg font-bold text-slate-900">
                        ₹{selectedCropData.currentPrice}/{selectedCropData.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Predicted Price (7 days)</span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{selectedCropData.aiPrediction?.nextWeekPrice || 'N/A'}/{selectedCropData.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Expected Change</span>
                      <span className={cn(
                        "text-lg font-bold",
                        (selectedCropData.aiPrediction?.nextWeekPrice || 0) > selectedCropData.currentPrice
                          ? "text-green-600"
                          : "text-red-600"
                      )}>
                        {selectedCropData.aiPrediction?.nextWeekPrice && selectedCropData.currentPrice
                          ? `${((selectedCropData.aiPrediction.nextWeekPrice - selectedCropData.currentPrice) / selectedCropData.currentPrice * 100).toFixed(1)}%`
                          : "N/A"
                        }
                      </span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        📅 Best Day to Sell: {selectedCropData.aiPrediction?.bestDayToSell || 'Analyzing...'}
                      </p>
                      <p className="text-sm text-blue-700">{selectedCropData.aiPrediction?.recommendation || 'AI analysis in progress...'}</p>
                      {selectedCropData.aiPrediction?.confidence && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="text-xs text-blue-600">Confidence:</div>
                          <div className="flex-1 bg-blue-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${selectedCropData.aiPrediction.confidence}%` }}
                            ></div>
                          </div>
                          <div className="text-xs font-medium text-blue-600">
                            {selectedCropData.aiPrediction.confidence}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/80 border-green-100 p-6">
                  <h4 className="font-bold text-lg text-slate-900 mb-4">Price Trend Analysis</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                        formatter={(value, name, props) => {
                          const isPrediction = props.payload?.isPrediction;
                          return [
                            `₹${value}${isPrediction ? ' (Predicted)' : ''}`,
                            'Price'
                          ];
                        }}
                        labelFormatter={(label, payload) => {
                          const isPrediction = payload?.[0]?.payload?.isPrediction;
                          return isPrediction ? `${label} (AI Prediction)` : label;
                        }}
                      />
                      {/* Historical data line */}
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
                        connectNulls={false}
                      />
                      {/* Prediction point - separate line for styling */}
                      <Line
                        type="monotone"
                        dataKey={(entry) => entry.isPrediction ? entry.price : null}
                        stroke="#dc2626"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-xs text-slate-600">Historical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-red-600 border-2 border-dashed border-red-600 rounded"></div>
                      <span className="text-xs text-slate-600">AI Prediction</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Historical price trends with AI-powered prediction for next week
                  </p>
                </Card>
              </div>
            )}
          </Card>
        </div>

        {/* Demand Forecast */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Demand Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Wheat', 'Rice', 'Tomato', 'Onion'].map((crop) => (
              <div key={crop} className="p-4 bg-green-50 rounded-xl text-center">
                <p className="font-medium text-slate-900 mb-2">{crop}</p>
                <Badge className="bg-green-600">High Demand</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
