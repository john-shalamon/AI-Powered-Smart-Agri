'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { mockTransporters } from '@/lib/mock-data/transporters';
import { RatingDisplay } from '@/components/shared/rating-display';
import TrackingStatusBar from '@/components/tracking/TrackingStatusBar';
import { Truck, MapPin, Phone, Badge as BadgeIcon, CheckCircle2, Search, Filter, Plus, Calendar, Package, Navigation, Star } from 'lucide-react';
import { useState } from 'react';

interface TrackingStatus {
  id: string;
  status: 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed';
  timestamp: string;
  location?: string;
  description: string;
  updatedBy: 'transporter' | 'system';
  notes?: string;
  photos?: string[];
}

export default function FarmerTransportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({
    cropType: '',
    quantity: '',
    pickupLocation: '',
    deliveryLocation: '',
    preferredDate: '',
    specialInstructions: ''
  });

  // Mock active shipments with tracking data
  const activeShipments = [
    {
      id: 's1',
      orderId: 'ORD-2024-001',
      cropType: 'Wheat',
      quantity: '100 quintal',
      transporter: { name: 'Vikram Yadav', phone: '+91 9876543210', vehicleNumber: 'HR-26-AB-1234' },
      currentStatus: 'in_transit',
      pickupLocation: { address: 'Farm Plot 45', city: 'Hisar' },
      deliveryLocation: { address: 'Warehouse A', city: 'Delhi' },
      trackingHistory: [
        {
          id: 't1',
          status: 'pickup_scheduled',
          timestamp: '2024-02-18T08:00:00Z',
          description: 'Pickup Scheduled',
          updatedBy: 'system'
        },
        {
          id: 't2',
          status: 'picked_up',
          timestamp: '2024-02-18T10:30:00Z',
          location: 'Hisar Farm',
          description: 'Picked Up',
          updatedBy: 'transporter',
          notes: 'Crop loaded successfully'
        },
        {
          id: 't3',
          status: 'in_transit',
          timestamp: '2024-02-18T11:00:00Z',
          location: 'NH-44 Highway',
          description: 'In Transit',
          updatedBy: 'transporter'
        }
      ] as TrackingStatus[]
    }
  ];

  const filteredTransporters = mockTransporters.filter(transporter => {
    const matchesSearch = transporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transporter.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'available' && transporter.availability) ||
                         (filterType === 'truck' && transporter.vehicleType === 'Truck') ||
                         (filterType === 'tempo' && transporter.vehicleType === 'Tempo');
    return matchesSearch && matchesFilter;
  });

  const handleRequestPickup = (transporter: any) => {
    setSelectedTransporter(transporter);
    setShowRequestDialog(true);
  };

  const submitPickupRequest = () => {
    // Here you would typically send the request to backend
    console.log('Pickup request:', { transporter: selectedTransporter, ...requestForm });
    setShowRequestDialog(false);
    setRequestForm({
      cropType: '',
      quantity: '',
      pickupLocation: '',
      deliveryLocation: '',
      preferredDate: '',
      specialInstructions: ''
    });
  };

  const handleStatusUpdate = (orderId: string, statusUpdate: TrackingStatus) => {
    // Here you would update the tracking status in backend
    console.log('Status update:', orderId, statusUpdate);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 text-balance">Transport Services</h1>
            <p className="text-slate-600 mt-1">Find reliable transporters and track your shipments</p>
          </div>
          <Button
            onClick={() => setShowRequestDialog(true)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Pickup
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-white/80 backdrop-blur-md border-green-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search transporters by name or vehicle type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transporters</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="truck">Trucks</SelectItem>
                <SelectItem value="tempo">Tempos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Shipments</p>
                <p className="text-2xl font-bold text-blue-900">{activeShipments.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Completed This Month</p>
                <p className="text-2xl font-bold text-green-900">24</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-900">4.7</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">Total Capacity</p>
                <p className="text-2xl font-bold text-orange-900">2.5K Ton</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Shipments with Tracking */}
        {activeShipments.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Active Shipments</h2>
            <div className="space-y-6">
              {activeShipments.map((shipment) => (
                <TrackingStatusBar
                  key={shipment.id}
                  orderId={shipment.orderId}
                  currentStatus={shipment.currentStatus}
                  trackingHistory={shipment.trackingHistory}
                  onStatusUpdate={(status) => handleStatusUpdate(shipment.id, status)}
                  userRole="farmer"
                  transporterInfo={shipment.transporter}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Transporters */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Available Transporters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTransporters.map((transporter) => (
              <Card
                key={transporter.id}
                className="bg-white/80 backdrop-blur-md border-green-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-green-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{transporter.name}</h3>
                      <RatingDisplay rating={transporter.rating} size="sm" />
                    </div>
                  </div>
                  {transporter.availability ? (
                    <Badge className="bg-green-100 text-green-700 border border-green-200">Available Now</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border border-red-200">Busy</Badge>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="capitalize font-medium">{transporter.vehicleType} • {transporter.capacity} ton capacity</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <BadgeIcon className="w-4 h-4 text-green-600" />
                    <span className="font-mono">{transporter.vehicleNumber}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{transporter.totalDeliveries} successful deliveries</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{transporter.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-green-200 hover:bg-green-50"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => handleRequestPickup(transporter)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-xl shadow-md"
                    disabled={!transporter.availability}
                  >
                    Request Pickup
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredTransporters.length === 0 && (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-green-100">
              <Truck className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-medium text-slate-900">No transporters found</p>
              <p className="text-sm text-slate-600 mt-2">Try adjusting your search or filter criteria</p>
            </Card>
          )}
        </div>

        {/* Request Pickup Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Request Pickup Service
              </DialogTitle>
              <DialogDescription>
                {selectedTransporter ? `Request pickup from ${selectedTransporter.name}` : 'Fill in the details for your pickup request'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Crop Type</label>
                  <Input
                    value={requestForm.cropType}
                    onChange={(e) => setRequestForm({...requestForm, cropType: e.target.value})}
                    placeholder="e.g., Wheat, Rice, Cotton"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Quantity</label>
                  <Input
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                    placeholder="e.g., 100 quintal"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Pickup Location</label>
                <Input
                  value={requestForm.pickupLocation}
                  onChange={(e) => setRequestForm({...requestForm, pickupLocation: e.target.value})}
                  placeholder="Farm address, village, district"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Delivery Location</label>
                <Input
                  value={requestForm.deliveryLocation}
                  onChange={(e) => setRequestForm({...requestForm, deliveryLocation: e.target.value})}
                  placeholder="Warehouse, market, or buyer location"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Preferred Pickup Date</label>
                <Input
                  type="date"
                  value={requestForm.preferredDate}
                  onChange={(e) => setRequestForm({...requestForm, preferredDate: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Special Instructions</label>
                <Textarea
                  value={requestForm.specialInstructions}
                  onChange={(e) => setRequestForm({...requestForm, specialInstructions: e.target.value})}
                  placeholder="Any special handling requirements, timing preferences, etc."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={submitPickupRequest} className="flex-1 bg-green-600 hover:bg-green-700">
                  Submit Request
                </Button>
                <Button variant="outline" onClick={() => setShowRequestDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
