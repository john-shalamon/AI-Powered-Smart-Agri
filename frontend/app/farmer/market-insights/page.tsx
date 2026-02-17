'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { mockMarketPrices } from '@/lib/mock-data/crops';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function MarketInsightsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Market Insights</h1>
          <p className="text-slate-600 mt-1">AI-powered market analysis and price trends</p>
        </div>

        {/* Price Table */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 overflow-hidden">
          <div className="p-6 border-b border-green-100">
            <h2 className="text-xl font-bold text-slate-900">Current Market Prices</h2>
          </div>
          <div className="overflow-x-auto">
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
                {mockMarketPrices.map((price) => (
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
                      {price.aiPrediction && (
                        <span className="text-sm font-medium text-green-600">
                          ₹{price.aiPrediction.nextWeekPrice}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockMarketPrices.slice(0, 2).map((price) => (
            <Card
              key={price.cropName}
              className="bg-white/80 backdrop-blur-md border-green-100 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{price.cropName} Forecast</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {price.aiPrediction?.confidence}% AI Confidence
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={price.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-green-50 rounded-xl">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  <strong>Best Day to Sell:</strong> {price.aiPrediction?.bestDayToSell}
                </p>
                <p className="text-sm text-slate-600">{price.aiPrediction?.recommendation}</p>
              </div>
            </Card>
          ))}
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
