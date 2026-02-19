'use client';

import { PackageOpen, TrendingUp, ShoppingCart, IndianRupee } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';
import { Card } from '@/components/ui/card';
import { mockCropListings } from '@/lib/mock-data/crops';
import { mockAIInsights } from '@/lib/mock-data/ai-insights';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/status-badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNotifications } from '@/hooks/useNotifications';

const priceData = [
  { date: 'Feb 1', price: 2380 },
  { date: 'Feb 5', price: 2420 },
  { date: 'Feb 10', price: 2450 },
  { date: 'Feb 15', price: 2500 },
  { date: 'Feb 20', price: 2500 },
];

export default function FarmerDashboard() {
  // Enable real-time notifications for farmer role
  useNotifications('f1', 'farmer');

  const activeListings = mockCropListings.filter(c => c.farmerId === 'f1' && c.status === 'active');

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 text-balance">Welcome back, Ravi!</h1>
        <p className="text-slate-600 mt-1">{"Here's what's happening with your farm today"}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Listings"
          value={activeListings.length}
          trend={{ value: 12.5, isPositive: true }}
          icon={PackageOpen}
        />
        <StatCard
          title="Total Sales"
          value="₹2,50,000"
          trend={{ value: 8.2, isPositive: true }}
          icon={IndianRupee}
        />
        <StatCard
          title="Pending Orders"
          value={3}
          icon={ShoppingCart}
          subtitle="Awaiting action"
        />
        <StatCard
          title="Market Trend"
          value="Bullish"
          trend={{ value: 5.2, isPositive: true }}
          icon={TrendingUp}
          subtitle="Wheat prices rising"
        />
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAIInsights.slice(0, 2).map((insight) => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* Market Price Trend */}
      <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Wheat Price Trend</h2>
            <p className="text-sm text-slate-600 mt-1">Last 20 days</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{'₹'}2,500</p>
            <p className="text-sm text-slate-600">per quintal</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ fill: '#16a34a', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Active Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Active Listings</h2>
          <Button asChild className="bg-green-600 hover:bg-green-700 rounded-xl">
            <Link href="/farmer/add-listing">Add New Listing</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeListings.slice(0, 3).map((listing) => (
            <Card
              key={listing.id}
              className="bg-white/80 backdrop-blur-md border-green-100 overflow-hidden hover:shadow-xl transition-shadow rounded-2xl"
            >
              <div className="w-full h-48 bg-green-100 flex items-center justify-center">
                <PackageOpen className="w-12 h-12 text-green-300" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{listing.cropName}</h3>
                  <StatusBadge status={listing.status} variant="sm" />
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {listing.quantity} {listing.unit} {' \u2022 '} Quality {listing.quality}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-green-600">
                    {'₹'}{listing.pricePerUnit}/{listing.unit}
                  </p>
                  <p className="text-sm text-slate-600">{listing.views} views</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Buyer Offers */}
      <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Buyer Offers</h2>
        <div className="space-y-3">
          {[
            { name: 'Rajesh Traders', crop: 'Wheat', qty: '100 quintal', price: '₹2,55,000', diff: '+2% above listing' },
            { name: 'South Foods Processing', crop: 'Wheat', qty: '50 quintal', price: '₹1,25,000', diff: 'At listing price' },
            { name: 'Global Agri Exports', crop: 'Rice', qty: '200 quintal', price: '₹6,50,000', diff: '+1.5% above listing' },
          ].map((offer, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl border border-green-100"
            >
              <div>
                <p className="font-medium text-slate-900">{offer.name}</p>
                <p className="text-sm text-slate-600">{offer.crop} {' \u2022 '} {offer.qty}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{offer.price}</p>
                <p className="text-sm text-slate-600">{offer.diff}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
