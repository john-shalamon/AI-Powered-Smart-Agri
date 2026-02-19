'use client';

import { PageTransition } from '@/components/animations/page-transition';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { mockOrders } from '@/lib/mock-data/orders';
import { StatusBadge } from '@/components/shared/status-badge';
import { Package, MapPin, User, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/lib/socket.tsx';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState(mockOrders.filter(o => o.farmerId === 'f1'));
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { socket, joinUser } = useSocket();

  useEffect(() => {
    // Join user room for real-time updates
    try {
      joinUser('f1'); // In real app, get from auth context
    } catch (error) {
      console.error('Socket connection error:', error);
    }

    // Listen for order status changes
    const handleOrderUpdate = (data: any) => {
      if (data.farmerId === 'f1') {
        setOrders(prev => prev.map(order =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        ));
        toast.success(`Order ${data.orderId} status updated to ${data.status}`);
      }
    };

    try {
      socket?.on('order-status-changed', handleOrderUpdate);
    } catch (error) {
      console.error('Socket listener error:', error);
    }

    return () => {
      try {
        socket?.off('order-status-changed', handleOrderUpdate);
      } catch (error) {
        console.error('Socket cleanup error:', error);
      }
    };
  }, [socket, joinUser]);
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
            <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
            <p className="text-sm text-slate-600 mt-1">Pending</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'confirmed').length}</p>
            <p className="text-sm text-slate-600 mt-1">Confirmed</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'in-transit').length}</p>
            <p className="text-sm text-slate-600 mt-1">In Transit</p>
          </Card>
          <Card className="bg-white/80 backdrop-blur-md border-green-100 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
            <p className="text-sm text-slate-600 mt-1">Delivered</p>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-white/80 backdrop-blur-md border-green-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={order.cropImage}
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
                    <p className="text-xs text-slate-500">Estimated Delivery</p>
                    <p className="font-medium text-slate-900">
                      {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-green-100">
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{order.totalAmount.toLocaleString()}</p>
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
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
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
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {event.note && (
                            <p className="text-slate-600 mt-1">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* View Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details - #{selectedOrder?.id}
              </DialogTitle>
              <DialogDescription>
                Complete information about your order
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Overview */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedOrder.cropImage}
                        alt={selectedOrder.cropName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{selectedOrder.cropName}</h3>
                        <p className="text-sm text-muted-foreground">Order #{selectedOrder.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                      <p className="font-semibold text-foreground">{selectedOrder.quantity} {selectedOrder.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price per Unit</p>
                      <p className="font-semibold text-foreground">₹{selectedOrder.pricePerUnit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                      <p className="font-semibold text-foreground">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Estimated Delivery</p>
                      <p className="font-semibold text-foreground">
                        {selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Buyer Information
                  </h4>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="font-medium text-blue-800">{selectedOrder.buyerName}</p>
                    <p className="text-sm text-blue-600">Buyer ID: {selectedOrder.buyerId}</p>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    Delivery Location
                  </h4>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="font-medium text-green-800">{selectedOrder.deliveryLocation.city}, {selectedOrder.deliveryLocation.state}</p>
                    <p className="text-sm text-green-600">{selectedOrder.deliveryLocation.address}</p>
                    <p className="text-sm text-green-600">PIN: {selectedOrder.deliveryLocation.pincode}</p>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    Pickup Location
                  </h4>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <p className="font-medium text-orange-800">{selectedOrder.pickupLocation.city}, {selectedOrder.pickupLocation.state}</p>
                    <p className="text-sm text-orange-600">{selectedOrder.pickupLocation.address}</p>
                    <p className="text-sm text-orange-600">PIN: {selectedOrder.pickupLocation.pincode}</p>
                  </div>
                </div>

                {/* Order Status */}
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Order Status</h4>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedOrder.status} />
                    <span className="text-sm text-muted-foreground">
                      {selectedOrder.status === 'confirmed' && 'Order confirmed and ready for pickup'}
                      {selectedOrder.status === 'in-transit' && 'Order is currently being transported'}
                      {selectedOrder.status === 'delivered' && 'Order has been successfully delivered'}
                      {selectedOrder.status === 'cancelled' && 'Order has been cancelled'}
                    </span>
                  </div>
                </div>

                {/* Order Timeline */}
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Order Timeline</h4>
                    <div className="space-y-3">
                      {selectedOrder.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${event.completed ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <StatusBadge status={event.status} variant="sm" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {event.note && (
                              <p className="text-sm text-muted-foreground">{event.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
