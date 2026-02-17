'use client';

import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, DollarSign, Star, MapPin, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockTransportRequests } from '@/lib/mock-data/transport-requests';

const earningsData = [
  { month: 'Jan', earnings: 45000 },
  { month: 'Feb', earnings: 52000 },
  { month: 'Mar', earnings: 48000 },
  { month: 'Apr', earnings: 61000 },
  { month: 'May', earnings: 55000 },
  { month: 'Jun', earnings: 67000 },
];

export default function TransporterDashboardPage() {
  const activeDeliveries = mockTransportRequests.filter(
    (r) => r.status === 'accepted' || r.status === 'in_transit'
  );
  const completedDeliveries = mockTransportRequests.filter(
    (r) => r.status === 'delivered'
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transporter Dashboard</h1>
        <p className="text-slate-600">Manage your deliveries and earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Deliveries"
          value={activeDeliveries.length.toString()}
          icon={Truck}
          trend={{ value: 15, isPositive: true }}
          subtitle="In progress"
        />
        <StatCard
          title="Monthly Earnings"
          value="₹67K"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          subtitle="This month"
        />
        <StatCard
          title="Completed Jobs"
          value={completedDeliveries.toString()}
          icon={Package}
          trend={{ value: 8, isPositive: true }}
          subtitle="All time"
        />
        <StatCard
          title="Average Rating"
          value="4.8"
          icon={Star}
          subtitle="From customers"
        />
      </div>

      {/* Earnings Chart */}
      <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Monthly Earnings</h3>
            <p className="text-sm text-slate-600">Last 6 months performance</p>
          </div>
          <Button variant="outline" size="sm">Download Report</Button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={earningsData}>
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
            <Bar dataKey="earnings" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Active Deliveries & Available Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Deliveries */}
        <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Active Deliveries</h3>
            <Button variant="link" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {activeDeliveries.slice(0, 4).map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Order #{delivery.orderId}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span>{delivery.distance} km</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{'₹'}{delivery.price}</p>
                  <Badge variant={delivery.status === 'in_transit' ? 'default' : 'secondary'}>
                    {delivery.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
            {activeDeliveries.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No active deliveries</p>
            )}
          </div>
        </Card>

        {/* Available Jobs */}
        <Card className="p-6 bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Available Jobs</h3>
            <Button variant="link" size="sm">Browse All</Button>
          </div>
          <div className="space-y-3">
            {mockTransportRequests.filter(r => r.status === 'pending').slice(0, 4).map((job) => (
              <div key={job.id} className="p-4 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">
                    {job.pickupLocation.city} {'→'} {job.deliveryLocation.city}
                  </p>
                  <p className="font-bold text-green-600">{'₹'}{job.price}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{job.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{job.pickupDate}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white">Accept Job</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
