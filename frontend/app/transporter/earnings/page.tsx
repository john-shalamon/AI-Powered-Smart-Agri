'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', earnings: 45000, trips: 42 },
  { month: 'Feb', earnings: 52000, trips: 48 },
  { month: 'Mar', earnings: 48000, trips: 45 },
  { month: 'Apr', earnings: 61000, trips: 55 },
  { month: 'May', earnings: 55000, trips: 51 },
  { month: 'Jun', earnings: 67000, trips: 62 },
];

const transactions = [
  { id: '1', date: '2024-06-15', orderId: 'ORD-12345', amount: 2500, status: 'completed' },
  { id: '2', date: '2024-06-14', orderId: 'ORD-12344', amount: 1800, status: 'completed' },
  { id: '3', date: '2024-06-13', orderId: 'ORD-12343', amount: 3200, status: 'completed' },
  { id: '4', date: '2024-06-12', orderId: 'ORD-12342', amount: 2100, status: 'completed' },
  { id: '5', date: '2024-06-11', orderId: 'ORD-12341', amount: 2800, status: 'pending' },
];

export default function EarningsPage() {
  const totalEarnings = monthlyData.reduce((sum, month) => sum + month.earnings, 0);
  const currentMonth = monthlyData[monthlyData.length - 1].earnings;
  const previousMonth = monthlyData[monthlyData.length - 2].earnings;
  const growth = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground">Track your income and transactions</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-foreground">₹{(totalEarnings / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground mt-1">Last 6 months</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-3xl font-bold text-foreground">₹{(currentMonth / 1000).toFixed(1)}K</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-600">+{growth}%</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg. Per Trip</p>
              <p className="text-3xl font-bold text-foreground">₹{(currentMonth / monthlyData[monthlyData.length - 1].trips).toFixed(0)}</p>
              <p className="text-sm text-muted-foreground mt-1">This month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
              🚛
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="earnings">Earnings Trend</TabsTrigger>
          <TabsTrigger value="trips">Trips Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="trips">
          <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Trips Completed</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
                <Line type="monotone" dataKey="trips" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction History */}
      <Card className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Order #{transaction.orderId}</p>
                  <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">₹{transaction.amount}</p>
                <p className={`text-sm ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
