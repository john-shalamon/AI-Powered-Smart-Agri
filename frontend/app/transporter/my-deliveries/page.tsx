'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { Truck, MapPin, Phone, Calendar, Navigation, Package } from 'lucide-react';
import { mockTransportRequests } from '@/lib/mock-data/orders';
import DeliveryTracking from '@/components/tracking/DeliveryTracking';
import { toast } from 'sonner';

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState(mockTransportRequests);
  const [selectedDelivery, setSelectedDelivery] = useState<typeof mockTransportRequests[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const activeDeliveries = deliveries.filter(r => r.status === 'accepted' || r.status === 'in_transit');
  const completedDeliveries = deliveries.filter(r => r.status === 'delivered');

  const handleStartJourney = (deliveryId: string) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'in_transit' as const }
          : delivery
      )
    );
    toast.success('Journey started! You can now track your delivery in real-time.');
  };

  const handleMarkDelivered = (deliveryId: string) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'delivered' as const }
          : delivery
      )
    );
    toast.success('Delivery marked as completed! Payment will be processed soon.');
  };

  const renderDeliveryCard = (delivery: typeof deliveries[0]) => {
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
              <Button 
                className="flex-1"
                onClick={() => handleStartJourney(delivery.id)}
              >
                Start Journey
              </Button>
            )}
            {delivery.status === 'in_transit' && (
              <Button 
                className="flex-1"
                onClick={() => handleMarkDelivered(delivery.id)}
              >
                Mark as Delivered
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedDelivery(delivery);
                setShowDetailsDialog(true);
              }}
            >
              View Details
            </Button>
            <DeliveryTracking delivery={delivery} />
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

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Delivery Details - Order #{selectedDelivery?.orderId.slice(-8)}
            </DialogTitle>
            <DialogDescription>
              Complete information about this delivery
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Delivery Overview */}
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {selectedDelivery?.pickupLocation.city} → {selectedDelivery?.deliveryLocation.city}
                  </h3>
                  <p className="text-sm text-muted-foreground">Order #{selectedDelivery?.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{selectedDelivery?.price}</p>
                  <p className="text-sm text-muted-foreground">Earnings</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Distance</p>
                  <p className="font-semibold text-foreground">{selectedDelivery?.distance} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Type</p>
                  <p className="font-semibold text-foreground">{selectedDelivery?.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pickup Date</p>
                  <p className="font-semibold text-foreground">{selectedDelivery ? new Date(selectedDelivery.pickupDate).toLocaleDateString() : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cargo Weight</p>
                  <p className="font-semibold text-foreground">{selectedDelivery?.weight || 500} kg</p>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Pickup Location
              </h4>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="font-medium text-green-800">{selectedDelivery?.pickupLocation.city}, {selectedDelivery?.pickupLocation.state}</p>
                <p className="text-sm text-green-600">{selectedDelivery?.pickupLocation.address}</p>
                <p className="text-sm text-green-600">PIN: {selectedDelivery?.pickupLocation.pincode}</p>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Delivery Location
              </h4>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-medium text-blue-800">{selectedDelivery?.deliveryLocation.city}, {selectedDelivery?.deliveryLocation.state}</p>
                <p className="text-sm text-blue-600">{selectedDelivery?.deliveryLocation.address}</p>
                <p className="text-sm text-blue-600">PIN: {selectedDelivery?.deliveryLocation.pincode}</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Delivery Status</h4>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedDelivery?.status || 'pending'} type="transport" />
                <span className="text-sm text-muted-foreground">
                  {selectedDelivery?.status === 'accepted' && 'Ready to start journey'}
                  {selectedDelivery?.status === 'in_transit' && 'Currently in transit'}
                  {selectedDelivery?.status === 'delivered' && 'Successfully delivered'}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedDelivery?.status === 'accepted' && (
              <Button onClick={() => {
                setShowDetailsDialog(false);
                handleStartJourney(selectedDelivery.id);
              }}>
                Start Journey
              </Button>
            )}
            {selectedDelivery?.status === 'in_transit' && (
              <Button onClick={() => {
                setShowDetailsDialog(false);
                handleMarkDelivered(selectedDelivery.id);
              }}>
                Mark as Delivered
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
