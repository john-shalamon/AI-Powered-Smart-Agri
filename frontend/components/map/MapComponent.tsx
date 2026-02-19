'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
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
  currentLocation?: {
    lat: number;
    lng: number;
  };
  showRoute?: boolean;
}

export default function MapComponent({
  pickupLocation,
  deliveryLocation,
  currentLocation,
  showRoute = true
}: MapComponentProps) {

  // Function to create a more realistic route (simulating road following)
  const createRealisticRoute = (start: [number, number], end: [number, number]): [number, number][] => {
    const [startLat, startLng] = start;
    const [endLat, endLng] = end;

    // Calculate distance and create intermediate points
    const distance = Math.sqrt(Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2));
    const numPoints = Math.max(15, Math.min(80, Math.floor(distance * 200))); // More points for smoother curves

    const route: [number, number][] = [];
    route.push(start);

    // Create multiple waypoints to simulate road network
    const waypoints: [number, number][] = [];

    // Add intermediate waypoints
    for (let i = 1; i < 4; i++) {
      const t = i / 4;
      const lat = startLat + (endLat - startLat) * t;
      const lng = startLng + (endLng - startLng) * t;

      // Add some offset to simulate taking different roads
      const offsetLat = (Math.random() - 0.5) * 0.02;
      const offsetLng = (Math.random() - 0.5) * 0.02;

      waypoints.push([lat + offsetLat, lng + offsetLng]);
    }

    // Create smooth path through waypoints
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;

      if (t <= 0.25) {
        // First segment: start to first waypoint
        const segmentT = t * 4;
        const lat = startLat + (waypoints[0][0] - startLat) * segmentT;
        const lng = startLng + (waypoints[0][1] - startLng) * segmentT;
        route.push([lat, lng]);
      } else if (t <= 0.5) {
        // Second segment: first to second waypoint
        const segmentT = (t - 0.25) * 4;
        const lat = waypoints[0][0] + (waypoints[1][0] - waypoints[0][0]) * segmentT;
        const lng = waypoints[0][1] + (waypoints[1][1] - waypoints[0][1]) * segmentT;
        route.push([lat, lng]);
      } else if (t <= 0.75) {
        // Third segment: second to third waypoint
        const segmentT = (t - 0.5) * 4;
        const lat = waypoints[1][0] + (waypoints[2][0] - waypoints[1][0]) * segmentT;
        const lng = waypoints[1][1] + (waypoints[2][1] - waypoints[1][1]) * segmentT;
        route.push([lat, lng]);
      } else {
        // Final segment: third waypoint to end
        const segmentT = (t - 0.75) * 4;
        const lat = waypoints[2][0] + (endLat - waypoints[2][0]) * segmentT;
        const lng = waypoints[2][1] + (endLng - waypoints[2][1]) * segmentT;
        route.push([lat, lng]);
      }
    }

    route.push(end);
    return route;
  };

  // Calculate route coordinates (realistic curved route)
  const routeCoordinates = showRoute ? createRealisticRoute(
    [pickupLocation.lat || 28.6139, pickupLocation.lng || 77.2090],
    [deliveryLocation.lat || 28.4595, deliveryLocation.lng || 77.0266]
  ) : [];

  // Calculate actual route distance and duration
  const calculateRouteStats = (coordinates: [number, number][]) => {
    if (coordinates.length < 2) return { distance: 0, duration: 0 };

    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lat1, lng1] = coordinates[i - 1];
      const [lat2, lng2] = coordinates[i];
      const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
      totalDistance += distance;
    }

    // Convert to kilometers (rough approximation)
    const distanceKm = totalDistance * 111; // 1 degree ≈ 111 km
    const durationMin = distanceKm * 2; // Rough estimate: 30 km/h average speed

    return {
      distance: Math.round(distanceKm * 10) / 10,
      duration: Math.round(durationMin)
    };
  };

  const routeStats = calculateRouteStats(routeCoordinates);

  // Calculate center point
  const centerLat = ((pickupLocation.lat || 28.6139) + (deliveryLocation.lat || 28.4595)) / 2;
  const centerLng = ((pickupLocation.lng || 77.2090) + (deliveryLocation.lng || 77.0266)) / 2;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={routeCoordinates.length > 0 ? 12 : 10} // Zoom in more when we have a real route
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pickup Location Marker */}
        <Marker position={[pickupLocation.lat || 28.6139, pickupLocation.lng || 77.2090]}>
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-green-700">📍 Pickup Location</div>
              <div className="text-sm text-gray-600">{pickupLocation.city}</div>
              <div className="text-xs text-gray-500">{pickupLocation.address}</div>
            </div>
          </Popup>
        </Marker>

        {/* Delivery Location Marker */}
        <Marker position={[deliveryLocation.lat || 28.4595, deliveryLocation.lng || 77.0266]}>
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-blue-700">🏁 Delivery Location</div>
              <div className="text-sm text-gray-600">{deliveryLocation.city}</div>
              <div className="text-xs text-gray-500">{deliveryLocation.address}</div>
            </div>
          </Popup>
        </Marker>

        {/* Current Location Marker (for tracking) */}
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-orange-700">🚛 Current Location</div>
                <div className="text-xs text-gray-500">Vehicle in transit</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {showRoute && routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Route info */}
        {showRoute && routeCoordinates.length > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-lg shadow-lg z-[1000]">
            <div className="text-xs space-y-1">
              <div className="font-semibold text-blue-700">🚗 Route Details</div>
              <div>Distance: {routeStats.distance} km</div>
              <div>Duration: {routeStats.duration} min</div>
              <div className="text-gray-500">Via road network</div>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
}