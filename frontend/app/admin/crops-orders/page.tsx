'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { Search, Eye } from 'lucide-react';
import { mockCropListings } from '@/lib/mock-data/crops';
import { mockOrders } from '@/lib/mock-data/orders';

export default function CropsOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCrops = mockCropListings.filter(c => 
    c.cropName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOrders = mockOrders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Crops & Orders Management</h1>
        <p className="text-muted-foreground">Monitor crop listings and order transactions</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="crops" className="space-y-6">
        <TabsList>
          <TabsTrigger value="crops">Crop Listings ({mockCropListings.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({mockOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="crops">
          <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Crop</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Farmer</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Quantity</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Price</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Quality</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.map((crop) => (
                    <tr key={crop.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{crop.cropName}</p>
                          <p className="text-sm text-muted-foreground">{crop.variety}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{crop.farmerId}</td>
                      <td className="p-4 text-sm text-foreground">{crop.availableQuantity} {crop.unit}</td>
                      <td className="p-4 text-sm font-medium text-foreground">₹{crop.pricePerUnit}/{crop.unit}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{crop.quality.grade}</Badge>
                          <span className="text-sm text-muted-foreground">{crop.quality.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={crop.status} type="listing" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Order ID</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Crop</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Quantity</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const crop = mockCropListings.find(c => c.id === order.cropId);
                    return (
                      <tr key={order.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-foreground text-sm">#{order.id.slice(-8)}</p>
                        </td>
                        <td className="p-4 text-sm text-foreground">{crop?.cropName || 'Unknown'}</td>
                        <td className="p-4 text-sm text-foreground">{order.quantity} {crop?.unit}</td>
                        <td className="p-4 text-sm font-medium text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={order.status} type="order" />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
