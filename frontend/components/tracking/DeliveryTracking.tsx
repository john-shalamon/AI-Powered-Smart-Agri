'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Navigation, Clock, Truck, Package } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

interface DeliveryTrackingProps {
  delivery: {
    id: string;
    orderId: string;
    pickupLocation: {
      lat?: number;
      lng?: number;
      city: string;
      address: string;
    };
    deliveryLocation: {
      lat?: number;
      lng?: number;
      city: string;
      address: string;
    };
    status: string;
    distance: number;
    price: number;
  };
}

export default function DeliveryTracking({ delivery }: DeliveryTrackingProps) {
  const [showTracking, setShowTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Simulate real-time tracking
  useEffect(() => {
    if (delivery.status === 'in_transit' && showTracking) {
      const interval = setInterval(() => {
        // Simulate movement along the route
        const progress = Math.random() * 0.8 + 0.1; // 10-90% progress
        if (delivery.pickupLocation.lat !== undefined && delivery.deliveryLocation.lat !== undefined &&
            delivery.pickupLocation.lng !== undefined && delivery.deliveryLocation.lng !== undefined) {
          const currentLat = delivery.pickupLocation.lat +
            (delivery.deliveryLocation.lat - delivery.pickupLocation.lat) * progress;
          const currentLng = delivery.pickupLocation.lng +
            (delivery.deliveryLocation.lng - delivery.pickupLocation.lng) * progress;

          setCurrentLocation({ lat: currentLat, lng: currentLng });
        }
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [delivery, showTracking]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Clock className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowTracking(true)}
        className="text-xs"
      >
        <Navigation className="w-3 h-3 mr-1" />
        Track Route
      </Button>

      <Dialog open={showTracking} onOpenChange={setShowTracking}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Live Delivery Tracking
            </DialogTitle>
            <DialogDescription>
              Order #{delivery.orderId} • {delivery.distance} km route
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status and Info */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(delivery.status)}
                <div>
                  <p className="font-semibold text-foreground">Status</p>
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="font-bold text-primary">₹{delivery.price}</p>
              </div>
            </div>

            {/* Map */}
            <div className="h-96 bg-gray-100 rounded-lg overflow-hidden border">
              <MapComponent
                pickupLocation={{
                  lat: delivery.pickupLocation.lat || 28.6139,
                  lng: delivery.pickupLocation.lng || 77.2090,
                  city: delivery.pickupLocation.city,
                  address: delivery.pickupLocation.address,
                }}
                deliveryLocation={{
                  lat: delivery.deliveryLocation.lat || 28.4595,
                  lng: delivery.deliveryLocation.lng || 77.0266,
                  city: delivery.deliveryLocation.city,
                  address: delivery.deliveryLocation.address,
                }}
                currentLocation={currentLocation || undefined}
                showRoute={true}
              />
            </div>

            {/* Route Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Pickup Location
                </h4>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="font-medium text-green-800">{delivery.pickupLocation.city}</p>
                  <p className="text-sm text-green-600">{delivery.pickupLocation.address}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Delivery Location
                </h4>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="font-medium text-blue-800">{delivery.deliveryLocation.city}</p>
                  <p className="text-sm text-blue-600">{delivery.deliveryLocation.address}</p>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            {delivery.status === 'in_transit' && currentLocation && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-800">Live Tracking Active</span>
                </div>
                <p className="text-sm text-orange-700">
                  Vehicle is currently en route. Location updates every 3 seconds.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}