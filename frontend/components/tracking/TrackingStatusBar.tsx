'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Camera,
  AlertTriangle,
  Navigation
} from 'lucide-react';

export interface TrackingStatus {
  id: string;
  status: 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed';
  timestamp: string;
  location?: string;
  description: string;
  updatedBy: 'transporter' | 'system';
  notes?: string;
  photos?: string[];
}

interface TrackingStatusBarProps {
  orderId: string;
  currentStatus: string;
  trackingHistory: TrackingStatus[];
  onStatusUpdate?: (status: TrackingStatus) => void;
  userRole: 'farmer' | 'buyer' | 'transporter';
  transporterInfo?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
}

const statusSteps = [
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: Clock, color: 'bg-yellow-500' },
  { key: 'picked_up', label: 'Picked Up', icon: Package, color: 'bg-blue-500' },
  { key: 'in_transit', label: 'In Transit', icon: Truck, color: 'bg-blue-600' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Navigation, color: 'bg-orange-500' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'bg-green-500' },
];

const statusColors = {
  pickup_scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  picked_up: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  delayed: 'bg-red-100 text-red-800 border-red-200',
};

export default function TrackingStatusBar({
  orderId,
  currentStatus,
  trackingHistory,
  onStatusUpdate,
  userRole,
  transporterInfo
}: TrackingStatusBarProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');

  const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  const handleStatusUpdate = () => {
    if (!newStatus || !onStatusUpdate) return;

    const statusUpdate: TrackingStatus = {
      id: `status_${Date.now()}`,
      status: newStatus as any,
      timestamp: new Date().toISOString(),
      location: currentLocation || undefined,
      description: statusSteps.find(s => s.key === newStatus)?.label || newStatus,
      updatedBy: 'transporter',
      notes: statusNotes || undefined,
    };

    onStatusUpdate(statusUpdate);
    setShowUpdateDialog(false);
    setNewStatus('');
    setStatusNotes('');
    setCurrentLocation('');
  };

  const getStatusIcon = (status: string) => {
    const step = statusSteps.find(s => s.key === status);
    return step ? <step.icon className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Delivery Tracking</h3>
          <p className="text-sm text-slate-600">Order #{orderId}</p>
        </div>
        {userRole === 'transporter' && onStatusUpdate && (
          <Button
            onClick={() => setShowUpdateDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Update Status
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Delivery Progress</span>
          <span className="text-slate-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Status Steps */}
      <div className="grid grid-cols-5 gap-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="flex flex-col items-center space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted ? step.color : 'bg-gray-200'
              } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}>
                <step.icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="text-center">
                <p className={`text-xs font-medium ${
                  isCompleted ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <Badge className="mt-1 text-xs">Current</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          {getStatusIcon(currentStatus)}
          <div>
            <p className="font-semibold text-slate-900">Current Status</p>
            <Badge className={statusColors[currentStatus as keyof typeof statusColors] || statusColors.pickup_scheduled}>
              {statusSteps.find(s => s.key === currentStatus)?.label || currentStatus.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Last Updated</p>
          <p className="text-sm font-medium text-slate-900">
            {trackingHistory.length > 0
              ? new Date(trackingHistory[trackingHistory.length - 1].timestamp).toLocaleString()
              : 'N/A'
            }
          </p>
        </div>
      </div>

      {/* Transporter Info */}
      {transporterInfo && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Transporter Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Name:</span>
              <span className="text-blue-700">{transporterInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">{transporterInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Vehicle:</span>
              <span className="text-blue-700">{transporterInfo.vehicleNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tracking History */}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900">Tracking History</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {trackingHistory.slice().reverse().map((update, index) => (
            <div key={update.id} className="flex gap-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  update.status === 'delivered' ? 'bg-green-100' :
                  update.status === 'delayed' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {getStatusIcon(update.status)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{update.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {update.updatedBy === 'transporter' ? 'By Transporter' : 'System'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {new Date(update.timestamp).toLocaleString()}
                </p>
                {update.location && (
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {update.location}
                  </p>
                )}
                {update.notes && (
                  <p className="text-sm text-slate-600 mt-1 italic">
                    "{update.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Update the current status of delivery for Order #{orderId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusSteps.map(step => (
                    <SelectItem key={step.key} value={step.key}>
                      {step.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Current Location (Optional)</label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g., Delhi, Near Connaught Place"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
              <Textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleStatusUpdate} className="flex-1">
                Update Status
              </Button>
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}