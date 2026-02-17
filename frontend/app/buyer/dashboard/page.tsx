'use client';

import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, TrendingUp, Star, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockCropListings } from '@/lib/mock-data/crops';
import { mockAIInsights } from '@/lib/mock-data/ai-insights';

const priceData = [
  { month: 'Jan', price: 45 },
  { month: 'Feb', price: 52 },
  { month: 'Mar', price: 48 },
  { month: 'Apr', price: 55 },
  { month: 'May', price: 58 },
  { month: 'Jun', price: 62 },
];

export default function BuyerDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Buyer Dashboard</h1>
        <p className="text-slate-600">Manage your orders and discover quality crops</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Orders"
          value="3"
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
          subtitle="Currently processing"
        />
        <StatCard
          title="Total Spent"
          value="₹292.5K"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          subtitle="This month"
        />
        <StatCard
          title="Completed Orders"
          value="1"
          icon={Package}
          trend={{ value: 5, isPositive: true }}
          subtitle="All time"
        />
        <StatCard
          title="Avg. Supplier Rating"
          value="4.6"
          icon={Star}
          subtitle="Based on your orders"
        />
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAIInsights.slice(0, 2).map((insight) => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* Market Price Trends */}
      <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Market Price Trends</h3>
            <p className="text-sm text-slate-600">Average wholesale prices per kg</p>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Available Crops */}
      <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Top Available Crops</h3>
          <Button variant="link" size="sm">Browse All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockCropListings.filter(c => c.status === 'active').slice(0, 4).map((crop) => (
            <div key={crop.id} className="flex items-center justify-between p-4 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors cursor-pointer border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{crop.cropName}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{crop.location.city}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-1" />
                    <span>{crop.farmerRating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{'₹'}{crop.pricePerUnit}/{crop.unit}</p>
                <p className="text-sm text-slate-500">{crop.quantity} {crop.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
