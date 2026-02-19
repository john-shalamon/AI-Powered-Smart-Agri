'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Package, Calendar, Truck, Navigation, Map } from 'lucide-react';
import { mockTransportRequests } from '@/lib/mock-data/orders';
import { toast } from 'sonner';
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

export default function AvailableJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof mockTransportRequests[0] | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const availableJobs = transportRequests.filter(r => r.status === 'pending');

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = 
      job.pickupLocation.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deliveryLocation.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDistance = 
      distanceFilter === 'all' ||
      (distanceFilter === 'short' && job.distance < 50) ||
      (distanceFilter === 'medium' && job.distance >= 50 && job.distance < 150) ||
      (distanceFilter === 'long' && job.distance >= 150);
    
    return matchesSearch && matchesDistance;
  });

  const handleAcceptJob = () => {
    if (selectedJob) {
      // Update job status to accepted
      setTransportRequests(prev => 
        prev.map(job => 
          job.id === selectedJob.id 
            ? { ...job, status: 'accepted' as const, transporterId: 'current-transporter' }
            : job
        )
      );
      
      // Store accepted job in localStorage for persistence
      const acceptedJobs = JSON.parse(localStorage.getItem('acceptedJobs') || '[]');
      const updatedJob = { ...selectedJob, status: 'accepted', transporterId: 'current-transporter' };
      localStorage.setItem('acceptedJobs', JSON.stringify([...acceptedJobs, updatedJob]));
      
      toast.success('Job accepted successfully! Check your dashboard for active deliveries.');
      setShowJobDialog(false);
    }
  };

  const handleViewRoute = (job: typeof mockTransportRequests[0]) => {
    setSelectedJob(job);
    setShowRouteDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Available Jobs</h1>
        <p className="text-muted-foreground">Browse and accept delivery jobs</p>
      </div>

      {/* Filters */}
      <Card className="p-4 backdrop-blur-xl bg-card/80 border-border shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={distanceFilter} onValueChange={setDistanceFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Distances</SelectItem>
              <SelectItem value="short">Short (&lt; 50 km)</SelectItem>
              <SelectItem value="medium">Medium (50-150 km)</SelectItem>
              <SelectItem value="long">Long (&gt; 150 km)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> available jobs
      </p>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg hover:shadow-xl transition-all">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {job.pickupLocation.city} → {job.deliveryLocation.city}
                    </h3>
                    <p className="text-sm text-muted-foreground">Order #{job.orderId.slice(-8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{job.price}</p>
                  <p className="text-sm text-muted-foreground">Delivery fee</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Distance</p>
                  <div className="flex items-center gap-1">
                    <Navigation className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-foreground">{job.distance} km</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Type</p>
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-foreground">{job.vehicleType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pickup Date</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-foreground">{new Date(job.pickupDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cargo Weight</p>
                  <p className="font-semibold text-foreground">{job.weight || 500} kg</p>
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">PICKUP LOCATION</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{job.pickupLocation.city}</p>
                      <p className="text-sm text-muted-foreground">{job.pickupLocation.address}</p>
                      <p className="text-sm text-muted-foreground">{job.pickupLocation.pincode}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">DELIVERY LOCATION</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{job.deliveryLocation.city}</p>
                      <p className="text-sm text-muted-foreground">{job.deliveryLocation.address}</p>
                      <p className="text-sm text-muted-foreground">{job.deliveryLocation.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobDialog(true);
                  }}
                >
                  Accept Job
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedJob(job);
                    setShowDetailsDialog(true);
                  }}
                >
                  View Details
                </Button>
                <Button variant="outline" onClick={() => handleViewRoute(job)}>
                  <Map className="w-4 h-4 mr-2" />
                  View Route
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Accept Job Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Delivery Job</DialogTitle>
            <DialogDescription>
              Confirm job acceptance and estimated delivery time
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Job Details</Label>
              <div className="p-3 rounded-lg bg-secondary/30 space-y-1">
                <p className="font-semibold text-foreground">
                  {selectedJob?.pickupLocation.city} → {selectedJob?.deliveryLocation.city}
                </p>
                <p className="text-sm text-muted-foreground">{selectedJob?.distance} km • ₹{selectedJob?.price}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="est-time">Estimated Delivery Time</Label>
              <Input id="est-time" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-number">Vehicle Number</Label>
              <Input id="vehicle-number" placeholder="MH01AB1234" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcceptJob}>
              Confirm Acceptance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Route View Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Delivery Route</DialogTitle>
            <DialogDescription>
              Route from {selectedJob?.pickupLocation.city} to {selectedJob?.deliveryLocation.city}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Route Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Pickup Location</h4>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">{selectedJob?.pickupLocation.city}</p>
                      <p className="text-sm text-green-600">{selectedJob?.pickupLocation.address}</p>
                      <p className="text-sm text-green-600">{selectedJob?.pickupLocation.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Delivery Location</h4>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">{selectedJob?.deliveryLocation.city}</p>
                      <p className="text-sm text-blue-600">{selectedJob?.deliveryLocation.address}</p>
                      <p className="text-sm text-blue-600">{selectedJob?.deliveryLocation.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden border">
              {selectedJob && (
                <MapComponent
                  pickupLocation={{
                    lat: selectedJob.pickupLocation.lat || 28.6139,
                    lng: selectedJob.pickupLocation.lng || 77.2090,
                    city: selectedJob.pickupLocation.city,
                    address: selectedJob.pickupLocation.address,
                  }}
                  deliveryLocation={{
                    lat: selectedJob.deliveryLocation.lat || 28.4595,
                    lng: selectedJob.deliveryLocation.lng || 77.0266,
                    city: selectedJob.deliveryLocation.city,
                    address: selectedJob.deliveryLocation.address,
                  }}
                  showRoute={true}
                />
              )}
            </div>

            {/* Route Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{selectedJob?.distance} km</p>
                <p className="text-sm text-muted-foreground">Distance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">₹{selectedJob?.price}</p>
                <p className="text-sm text-muted-foreground">Earnings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{Math.ceil((selectedJob?.distance || 0) / 40)}h</p>
                <p className="text-sm text-muted-foreground">Est. Time</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRouteDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowRouteDialog(false);
              setSelectedJob(selectedJob);
              setShowJobDialog(true);
            }}>
              Accept Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Job Details - Order #{selectedJob?.orderId.slice(-8)}
            </DialogTitle>
            <DialogDescription>
              Complete information about this delivery job
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Job Overview */}
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {selectedJob?.pickupLocation.city} → {selectedJob?.deliveryLocation.city}
                  </h3>
                  <p className="text-sm text-muted-foreground">Order #{selectedJob?.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{selectedJob?.price}</p>
                  <p className="text-sm text-muted-foreground">Delivery fee</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Distance</p>
                  <p className="font-semibold text-foreground">{selectedJob?.distance} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Type</p>
                  <p className="font-semibold text-foreground">{selectedJob?.vehicleType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pickup Date</p>
                  <p className="font-semibold text-foreground">{selectedJob ? new Date(selectedJob.pickupDate).toLocaleDateString() : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cargo Weight</p>
                  <p className="font-semibold text-foreground">{selectedJob?.weight || 500} kg</p>
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
                <p className="font-medium text-green-800">{selectedJob?.pickupLocation.city}, {selectedJob?.pickupLocation.state}</p>
                <p className="text-sm text-green-600">{selectedJob?.pickupLocation.address}</p>
                <p className="text-sm text-green-600">PIN: {selectedJob?.pickupLocation.pincode}</p>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Delivery Location
              </h4>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-medium text-blue-800">{selectedJob?.deliveryLocation.city}, {selectedJob?.deliveryLocation.state}</p>
                <p className="text-sm text-blue-600">{selectedJob?.deliveryLocation.address}</p>
                <p className="text-sm text-blue-600">PIN: {selectedJob?.deliveryLocation.pincode}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Estimated Travel Time</p>
                <p className="font-semibold text-foreground">{Math.ceil((selectedJob?.distance || 0) / 40)} hours</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fuel Cost Estimate</p>
                <p className="font-semibold text-foreground">₹{Math.ceil((selectedJob?.distance || 0) * 8)}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowDetailsDialog(false);
              setSelectedJob(selectedJob);
              setShowJobDialog(true);
            }}>
              Accept Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
