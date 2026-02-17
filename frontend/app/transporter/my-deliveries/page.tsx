'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { Truck, MapPin, Phone, Calendar, Navigation } from 'lucide-react';
import { mockTransportRequests } from '@/lib/mock-data/orders';

export default function MyDeliveriesPage() {
  const activeDeliveries = mockTransportRequests.filter(r => r.status === 'accepted' || r.status === 'in_transit');
  const completedDeliveries = mockTransportRequests.filter(r => r.status === 'delivered');

  const renderDeliveryCard = (delivery: typeof mockTransportRequests[0]) => {
    return (
      <Card key={delivery.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {delivery.pickupLocation.city} → {delivery.deliveryLocation.city}
                </h3>
                <p className="text-sm text-muted-foreground">Order #{delivery.orderId.slice(-8)}</p>
              </div>
            </div>
            <StatusBadge status={delivery.status} type="transport" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Distance</p>
              <div className="flex items-center gap-1">
                <Navigation className="w-4 h-4 text-primary" />
                <p className="font-semibold text-foreground">{delivery.distance} km</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Earnings</p>
              <p className="font-semibold text-primary">₹{delivery.price}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pickup Date</p>
              <p className="font-semibold text-foreground">{new Date(delivery.pickupDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
              <p className="font-semibold text-foreground">{delivery.vehicleType}</p>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">PICKUP</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{delivery.pickupLocation.city}</p>
                  <p className="text-sm text-muted-foreground">{delivery.pickupLocation.address}</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">DELIVERY</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{delivery.deliveryLocation.city}</p>
                  <p className="text-sm text-muted-foreground">{delivery.deliveryLocation.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {delivery.status === 'accepted' && (
              <Button className="flex-1">Start Journey</Button>
            )}
            {delivery.status === 'in_transit' && (
              <Button className="flex-1">Mark as Delivered</Button>
            )}
            <Button variant="outline">View Route</Button>
            <Button variant="outline">
              <Phone className="w-4 h-4" />
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
        <h1 className="text-3xl font-bold text-foreground">My Deliveries</h1>
        <p className="text-muted-foreground">Track and manage your delivery jobs</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeDeliveries.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedDeliveries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDeliveries.length > 0 ? (
            activeDeliveries.map(renderDeliveryCard)
          ) : (
            <Card className="p-12 text-center backdrop-blur-xl bg-card/80 border-border">
              <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No active deliveries</p>
              <p className="text-sm text-muted-foreground mt-2">Browse available jobs to start earning</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeliveries.length > 0 ? (
            completedDeliveries.map(renderDeliveryCard)
          ) : (
            <Card className="p-12 text-center backdrop-blur-xl bg-card/80 border-border">
              <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">No completed deliveries</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
