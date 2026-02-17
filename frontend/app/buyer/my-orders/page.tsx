'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { Package, MapPin, Truck, Phone, Mail, Calendar } from 'lucide-react';
import { mockOrders } from '@/lib/mock-data/orders';
import { mockCrops } from '@/lib/mock-data/crops';
import { mockFarmers } from '@/lib/mock-data/farmers';

export default function MyOrdersPage() {
  const buyerOrders = mockOrders.filter(o => o.buyerId === 'buyer-1');
  
  const activeOrders = buyerOrders.filter(o => ['pending', 'confirmed', 'in_transit'].includes(o.status));
  const completedOrders = buyerOrders.filter(o => ['delivered', 'completed'].includes(o.status));
  const cancelledOrders = buyerOrders.filter(o => o.status === 'cancelled');

  const renderOrderCard = (order: typeof mockOrders[0]) => {
    const crop = mockCrops.find(c => c.id === order.cropId);
    const farmer = mockFarmers.find(f => f.id === order.farmerId);
    
    return (
      <Card key={order.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                🌾
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{crop?.cropName || 'Unknown Crop'}</h3>
                <p className="text-sm text-muted-foreground">{crop?.variety}</p>
                <p className="text-xs text-muted-foreground">Order #{order.id.slice(-8)}</p>
              </div>
            </div>
            <StatusBadge status={order.status} type="order" />
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Quantity</p>
              <p className="font-semibold text-foreground">{order.quantity} {crop?.unit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price per Unit</p>
              <p className="font-semibold text-foreground">₹{order.pricePerUnit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
              <p className="font-semibold text-primary">₹{order.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order Date</p>
              <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Farmer Details */}
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">SUPPLIER DETAILS</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{farmer?.name}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{order.pickupLocation.address}, {order.pickupLocation.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{farmer?.phone}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {order.timeline && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">ORDER TIMELINE</p>
              <div className="space-y-2">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${event.completed ? 'bg-primary' : 'bg-border'}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {event.status}
                      </p>
                      {event.timestamp && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {order.status === 'in_transit' && (
              <Button variant="outline" className="flex-1">
                <Truck className="w-4 h-4 mr-2" />
                Track Shipment
              </Button>
            )}
            {order.status === 'delivered' && (
              <Button className="flex-1">
                Confirm Receipt
              </Button>
            )}
            <Button variant="outline">
              View Details
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your crop orders</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.length > 0 ? (
            activeOrders.map(renderOrderCard)
          ) : (
            <Card className="p-12 text-center backdrop-blur-xl bg-card/80 border-border">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No active orders</p>
              <p className="text-sm text-muted-foreground mt-2">Browse crops to place your first order</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length > 0 ? (
            completedOrders.map(renderOrderCard)
          ) : (
            <Card className="p-12 text-center backdrop-blur-xl bg-card/80 border-border">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No completed orders</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledOrders.length > 0 ? (
            cancelledOrders.map(renderOrderCard)
          ) : (
            <Card className="p-12 text-center backdrop-blur-xl bg-card/80 border-border">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No cancelled orders</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
