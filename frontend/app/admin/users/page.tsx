'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MoreVertical, UserCheck, UserX } from 'lucide-react';
import { mockFarmers } from '@/lib/mock-data/farmers';
import { mockBuyers } from '@/lib/mock-data/buyers';
import { mockTransporters } from '@/lib/mock-data/transporters';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarmers = mockFarmers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBuyers = mockBuyers.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTransporters = mockTransporters.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">Manage farmers, buyers, and transporters</p>
        </div>
        <Button>Add New User</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="farmers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="farmers">Farmers ({mockFarmers.length})</TabsTrigger>
          <TabsTrigger value="buyers">Buyers ({mockBuyers.length})</TabsTrigger>
          <TabsTrigger value="transporters">Transporters ({mockTransporters.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="farmers">
          <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Location</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Farm Size</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Crops</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Rating</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map((farmer) => (
                    <tr key={farmer.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{farmer.name}</p>
                          <p className="text-sm text-muted-foreground">{farmer.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {farmer.farmLocation.city}, {farmer.farmLocation.state}
                      </td>
                      <td className="p-4 text-sm text-foreground">{farmer.farmSize} acres</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {farmer.cropTypes.slice(0, 2).map((crop, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{crop}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground">{farmer.rating}</td>
                      <td className="p-4">
                        <Badge variant="default">Active</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
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

        <TabsContent value="buyers">
          <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Business</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Location</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Total Orders</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuyers.map((buyer) => (
                    <tr key={buyer.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{buyer.name}</p>
                          <p className="text-sm text-muted-foreground">{buyer.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">{buyer.businessType}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {buyer.location.city}, {buyer.location.state}
                      </td>
                      <td className="p-4 text-sm text-foreground">{buyer.totalOrders}</td>
                      <td className="p-4">
                        <Badge variant="default">Active</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
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

        <TabsContent value="transporters">
          <Card className="backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Name</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Vehicle</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Location</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Rating</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Total Trips</th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransporters.map((transporter) => (
                    <tr key={transporter.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{transporter.name}</p>
                          <p className="text-sm text-muted-foreground">{transporter.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">{transporter.vehicleType}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {transporter.currentLocation ? 'Delhi' : 'N/A'}
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground">{transporter.rating}</td>
                      <td className="p-4 text-sm text-foreground">{transporter.totalDeliveries}</td>
                      <td className="p-4">
                        <Badge variant="default">Active</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
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
      </Tabs>
    </div>
  );
}
