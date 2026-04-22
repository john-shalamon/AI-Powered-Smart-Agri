'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { mockOrders } from '@/lib/mock-data/orders';
import { StatusBadge } from '@/components/shared/status-badge';
import { Package, MapPin, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerOrdersPage() {
  const farmerOrders = mockOrders.filter(o => o.farmerId === 'f1');

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Orders</h1>
          <p className="text-slate-600 mt-1">Track and manage your crop orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{farmerOrders.filter(o => o.status === 'pending').length}</p>
            <p className="text-sm text-slate-600 mt-1">Pending</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{farmerOrders.filter(o => o.status === 'confirmed').length}</p>
            <p className="text-sm text-slate-600 mt-1">Confirmed</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{farmerOrders.filter(o => o.status === 'in_transit').length}</p>
            <p className="text-sm text-slate-600 mt-1">In Transit</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{farmerOrders.filter(o => o.status === 'delivered').length}</p>
            <p className="text-sm text-slate-600 mt-1">Delivered</p>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {farmerOrders.map((order) => (
            <Card
              key={order.id}
              className="bg-white/80 backdrop-blur-md border-green-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={'/placeholder.svg?height=200&width=200'}
                    alt={order.cropName}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{order.cropName}</h3>
                    <p className="text-sm text-slate-600">Order #{order.id}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Buyer</p>
                    <p className="font-medium text-slate-900">{order.buyerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Quantity</p>
                    <p className="font-medium text-slate-900">{order.quantity} {order.unit}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="font-medium text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-green-100">
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{Number(order.totalAmount).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button variant="outline" className="rounded-xl text-red-600 hover:bg-red-50">
                        Reject
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 rounded-xl">
                        Accept Order
                      </Button>
                    </>
                  )}
                  {order.status !== 'pending' && (
                    <Button variant="outline" className="rounded-xl">
                      View Details
                    </Button>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {order.timeline && order.timeline.length > 0 && (
                <div className="mt-4 pt-4 border-t border-green-100">
                  <p className="text-sm font-medium text-slate-700 mb-3">Order Timeline</p>
                  <div className="space-y-2">
                    {order.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <StatusBadge status={event.status} variant="sm" />
                            <span className="text-xs text-slate-500">
                              {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
