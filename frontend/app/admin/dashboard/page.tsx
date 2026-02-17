'use client';

import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Package, Truck, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockFarmers } from '@/lib/mock-data/farmers';
import { mockBuyers } from '@/lib/mock-data/buyers';
import { mockOrders } from '@/lib/mock-data/orders';
import { mockCropListings } from '@/lib/mock-data/crops';

const monthlyData = [
  { month: 'Jan', orders: 120, revenue: 450000 },
  { month: 'Feb', orders: 145, revenue: 520000 },
  { month: 'Mar', orders: 135, revenue: 480000 },
  { month: 'Apr', orders: 180, revenue: 610000 },
  { month: 'May', orders: 165, revenue: 550000 },
  { month: 'Jun', orders: 195, revenue: 670000 },
];

const userDistribution = [
  { name: 'Farmers', value: 5, color: '#16a34a' },
  { name: 'Buyers', value: 5, color: '#3b82f6' },
  { name: 'Transporters', value: 4, color: '#8b5cf6' },
];

export default function AdminDashboardPage() {
  const totalUsers = mockFarmers.length + mockBuyers.length + 4;
  const activeOrders = mockOrders.filter(o => ['pending', 'confirmed', 'in_transit'].includes(o.status)).length;
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const availableCrops = mockCropListings.filter(c => c.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          subtitle="Active users"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders.toString()}
          icon={Package}
          trend={{ value: 8, isPositive: true }}
          subtitle="In progress"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
          subtitle="Last 6 months"
        />
        <StatCard
          title="Available Crops"
          value={availableCrops.toString()}
          icon={Truck}
          subtitle="Listed for sale"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Orders Trend */}
        <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Platform Growth</h3>
            <p className="text-sm text-slate-600">Orders and revenue trends</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
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
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User Distribution */}
        <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900">User Distribution</h3>
            <p className="text-sm text-slate-600">Platform user breakdown</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Recent Orders</h3>
            <Button variant="link" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {mockOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{order.cropName}</p>
                    <p className="text-xs text-slate-500">#{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 text-sm">{'₹'}{order.totalAmount.toLocaleString()}</p>
                  <Badge variant="outline" className="text-xs">
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">System Alerts</h3>
            <Button variant="link" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">Payment Pending</p>
                <p className="text-xs text-slate-500">3 orders awaiting payment confirmation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">New Farmer Registered</p>
                <p className="text-xs text-slate-500">5 new farmers joined today</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">Quality Review Required</p>
                <p className="text-xs text-slate-500">2 crop listings need verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">Transport Delay</p>
                <p className="text-xs text-slate-500">1 delivery exceeding estimated time</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
