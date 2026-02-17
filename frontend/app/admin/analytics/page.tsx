'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 450000, profit: 135000 },
  { month: 'Feb', revenue: 520000, profit: 156000 },
  { month: 'Mar', revenue: 480000, profit: 144000 },
  { month: 'Apr', revenue: 610000, profit: 183000 },
  { month: 'May', revenue: 550000, profit: 165000 },
  { month: 'Jun', revenue: 670000, profit: 201000 },
];

const userGrowthData = [
  { month: 'Jan', farmers: 45, buyers: 38, transporters: 22 },
  { month: 'Feb', farmers: 52, buyers: 45, transporters: 28 },
  { month: 'Mar', farmers: 58, buyers: 51, transporters: 32 },
  { month: 'Apr', farmers: 65, buyers: 58, transporters: 38 },
  { month: 'May', farmers: 72, buyers: 64, transporters: 42 },
  { month: 'Jun', farmers: 80, buyers: 71, transporters: 48 },
];

const cropTrendsData = [
  { category: 'Grains', volume: 45000, value: 2250000 },
  { category: 'Vegetables', volume: 32000, value: 1920000 },
  { category: 'Fruits', volume: 28000, value: 2520000 },
  { category: 'Pulses', volume: 18000, value: 1440000 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground">Deep dive into platform performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹32.8L</p>
              <p className="text-xs text-green-600 mt-1">+15% vs last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Users</p>
              <p className="text-2xl font-bold text-foreground">199</p>
              <p className="text-xs text-green-600 mt-1">+12% growth</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Orders/Month</p>
              <p className="text-2xl font-bold text-foreground">195</p>
              <p className="text-xs text-green-600 mt-1">+18% increase</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg. Order Value</p>
              <p className="text-2xl font-bold text-foreground">₹3,435</p>
              <p className="text-xs text-green-600 mt-1">+8% growth</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Profit</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="crops">Crop Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Revenue & Profit Analysis</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Revenue (₹)" />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Profit (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">User Growth by Role</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="farmers" stroke="hsl(var(--primary))" strokeWidth={2} name="Farmers" />
                <Line type="monotone" dataKey="buyers" stroke="#3b82f6" strokeWidth={2} name="Buyers" />
                <Line type="monotone" dataKey="transporters" stroke="#8b5cf6" strokeWidth={2} name="Transporters" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="crops">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Crop Category Performance</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={cropTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Volume (kg)" />
                <Bar yAxisId="right" dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Value (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
