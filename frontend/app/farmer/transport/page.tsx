'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTransporters } from '@/lib/mock-data/transporters';
import { RatingDisplay } from '@/components/shared/rating-display';
import { Truck, MapPin, Phone, Badge as BadgeIcon, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FarmerTransportPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Transport</h1>
          <p className="text-slate-600 mt-1">Request pickup and find reliable transporters</p>
        </div>

        {/* Request Pickup */}
        <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white p-8">
          <h2 className="text-2xl font-bold mb-2">Need Pickup Service?</h2>
          <p className="mb-6 text-white/90">Connect with verified transporters for safe delivery</p>
          <Button className="bg-white text-green-600 hover:bg-green-50 rounded-xl">
            Request Pickup
          </Button>
        </Card>

        {/* Available Transporters */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Available Transporters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTransporters.map((transporter) => (
              <Card
                key={transporter.id}
                className="bg-white/80 backdrop-blur-md border-green-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{transporter.name}</h3>
                      <RatingDisplay rating={transporter.rating} size="sm" />
                    </div>
                  </div>
                  {transporter.availability ? (
                    <Badge className="bg-green-100 text-green-700">Available</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">Busy</Badge>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="capitalize">{transporter.vehicleType} • {transporter.capacity} ton capacity</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <BadgeIcon className="w-4 h-4 text-green-600" />
                    <span>{transporter.vehicleNumber}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{transporter.totalDeliveries} completed deliveries</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{transporter.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl">
                    View Profile
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl"
                    disabled={!transporter.availability}
                  >
                    Request
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Shipments */}
        <Card className="bg-white/80 backdrop-blur-md border-green-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Shipments</h2>
          <div className="space-y-3">
            {[1].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-green-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Wheat - 100 quintal</p>
                    <p className="text-sm text-slate-600">Transporter: Vikram Yadav</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-purple-100 text-purple-700 mb-1">In Transit</Badge>
                  <p className="text-xs text-slate-500">ETA: 2 hours</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
