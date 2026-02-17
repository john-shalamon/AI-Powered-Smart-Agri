'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, MapPin, TrendingUp } from 'lucide-react';

const mockContracts = [
  {
    id: 'contract-1',
    farmerName: 'Rajesh Kumar',
    cropType: 'Wheat',
    quantity: 5000,
    unit: 'kg',
    pricePerUnit: 25,
    duration: '6 months',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active',
    location: 'Punjab',
  },
  {
    id: 'contract-2',
    farmerName: 'Suresh Patel',
    cropType: 'Rice',
    quantity: 3000,
    unit: 'kg',
    pricePerUnit: 35,
    duration: '4 months',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    status: 'active',
    location: 'Haryana',
  },
];

export default function ContractsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contracts</h1>
          <p className="text-muted-foreground">Manage long-term supply agreements</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockContracts.map((contract) => (
          <Card key={contract.id} className="p-6 backdrop-blur-xl bg-card/80 border-border shadow-lg">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{contract.cropType} Supply Contract</h3>
                  <p className="text-sm text-muted-foreground">Contract #{contract.id.slice(-6)}</p>
                </div>
                <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                  {contract.status}
                </Badge>
              </div>

              {/* Farmer Info */}
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{contract.farmerName}</span>
                <MapPin className="w-4 h-4 text-muted-foreground ml-2" />
                <span className="text-muted-foreground">{contract.location}</span>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Quantity</p>
                  <p className="font-semibold text-foreground">{contract.quantity} {contract.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price per Unit</p>
                  <p className="font-semibold text-foreground">₹{contract.pricePerUnit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                  <p className="font-semibold text-primary">₹{(contract.quantity * contract.pricePerUnit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="font-semibold text-foreground">{contract.duration}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-secondary/30 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium text-foreground">{new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium text-foreground">{new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">View Details</Button>
                <Button variant="outline" className="flex-1">Download</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockContracts.length === 0 && (
        <Card className="p-12 text-center backdrop-blur-xl bg-card/80 border-border">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">No active contracts</p>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Create contracts with farmers for guaranteed supply
          </p>
          <Button>Create Contract</Button>
        </Card>
      )}
    </div>
  );
}
