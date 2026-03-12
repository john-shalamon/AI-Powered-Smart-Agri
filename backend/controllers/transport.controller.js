const { v4: uuidv4 } = require('uuid');
const { getUserById, sanitizeUser, users } = require('./auth.controller');
const { orders } = require('./order.controller');

// In-memory transport requests store
const transportRequests = [
  {
    id: 'tr1',
    orderId: 'ord1',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b1',
    buyerName: 'Amit Singh',
    cropName: 'Organic Wheat',
    quantity: 100,
    unit: 'quintal',
    pickupLocation: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    dropLocation: { lat: 28.6315, lng: 77.2167, address: 'Connaught Place', city: 'Delhi', state: 'Delhi' },
    distance: 15,
    estimatedCost: 5000,
    status: 'assigned',
    vehicleRequired: 'truck',
    weight: 10000,
    createdAt: new Date('2026-03-02'),
    pickupDate: new Date('2026-03-10'),
  },
  {
    id: 'tr2',
    orderId: 'ord2',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b2',
    buyerName: 'Priya Sharma',
    cropName: 'Basmati Rice',
    quantity: 50,
    unit: 'quintal',
    pickupLocation: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    dropLocation: { lat: 19.0760, lng: 72.8777, address: 'MG Road', city: 'Mumbai', state: 'Maharashtra' },
    distance: 1400,
    estimatedCost: 35000,
    status: 'open',
    vehicleRequired: 'truck',
    weight: 5000,
    createdAt: new Date('2026-03-05'),
    pickupDate: new Date('2026-03-12'),
  },
  {
    id: 'tr3',
    orderId: 'ord3',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    buyerId: 'b1',
    buyerName: 'Amit Singh',
    cropName: 'Fresh Tomatoes',
    quantity: 20,
    unit: 'quintal',
    pickupLocation: { lat: 23.0225, lng: 72.5714, address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat' },
    dropLocation: { lat: 28.6315, lng: 77.2167, address: 'Connaught Place', city: 'Delhi', state: 'Delhi' },
    distance: 950,
    estimatedCost: 22000,
    status: 'completed',
    vehicleRequired: 'mini-truck',
    weight: 2000,
    createdAt: new Date('2026-02-12'),
    pickupDate: new Date('2026-02-15'),
  },
  {
    id: 'tr4',
    orderId: 'ord4',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b2',
    buyerName: 'Priya Sharma',
    cropName: 'Fresh Potatoes',
    quantity: 80,
    unit: 'quintal',
    pickupLocation: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    dropLocation: { lat: 19.0760, lng: 72.8777, address: 'MG Road', city: 'Mumbai', state: 'Maharashtra' },
    distance: 1400,
    estimatedCost: 32000,
    status: 'open',
    vehicleRequired: 'truck',
    weight: 8000,
    createdAt: new Date('2026-03-09'),
    pickupDate: new Date('2026-03-15'),
  },
];

// In-memory deliveries store
const deliveries = [
  {
    id: 'del1',
    transportRequestId: 'tr1',
    transporterId: 't1',
    transporterName: 'Rajesh Transport',
    orderId: 'ord1',
    status: 'accepted',
    pickupLocation: { lat: 28.7041, lng: 77.1025, address: 'Village Khera, Delhi' },
    dropLocation: { lat: 28.6315, lng: 77.2167, address: 'Connaught Place, Delhi' },
    currentLocation: { lat: 28.6800, lng: 77.1500 },
    route: [
      { lat: 28.7041, lng: 77.1025 },
      { lat: 28.6800, lng: 77.1500 },
      { lat: 28.6315, lng: 77.2167 },
    ],
    distance: 15,
    estimatedTime: 2,
    earnings: 5000,
    createdAt: new Date('2026-03-02'),
  },
  {
    id: 'del2',
    transportRequestId: 'tr3',
    transporterId: 't2',
    transporterName: 'Vikram Logistics',
    orderId: 'ord3',
    status: 'delivered',
    pickupLocation: { lat: 23.0225, lng: 72.5714, address: 'Village Narol, Ahmedabad' },
    dropLocation: { lat: 28.6315, lng: 77.2167, address: 'Connaught Place, Delhi' },
    currentLocation: { lat: 28.6315, lng: 77.2167 },
    route: [
      { lat: 23.0225, lng: 72.5714 },
      { lat: 25.3176, lng: 74.7174 },
      { lat: 28.6315, lng: 77.2167 },
    ],
    distance: 950,
    estimatedTime: 18,
    actualTime: 17,
    earnings: 22000,
    startedAt: new Date('2026-02-15'),
    completedAt: new Date('2026-02-19'),
    createdAt: new Date('2026-02-12'),
  },
];

// Get available transport jobs (for transporters)
const getAvailableJobs = (req, res) => {
  try {
    const { search, distance } = req.query;
    let available = transportRequests.filter(tr => tr.status === 'open');

    if (search) {
      const searchLower = search.toLowerCase();
      available = available.filter(tr =>
        tr.cropName.toLowerCase().includes(searchLower) ||
        tr.pickupLocation.city.toLowerCase().includes(searchLower) ||
        tr.dropLocation.city.toLowerCase().includes(searchLower)
      );
    }

    if (distance === 'short') {
      available = available.filter(tr => tr.distance <= 100);
    } else if (distance === 'medium') {
      available = available.filter(tr => tr.distance > 100 && tr.distance <= 500);
    } else if (distance === 'long') {
      available = available.filter(tr => tr.distance > 500);
    }

    res.json({ jobs: available, total: available.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept a transport job
const acceptJob = (req, res) => {
  try {
    const { offerPrice, estimatedTime, message } = req.body;
    const requestIndex = transportRequests.findIndex(tr => tr.id === req.params.id);
    if (requestIndex === -1) return res.status(404).json({ error: 'Transport request not found' });

    const request = transportRequests[requestIndex];
    if (request.status !== 'open') {
      return res.status(400).json({ error: 'This job is no longer available' });
    }

    const transporter = getUserById(req.user.id);
    if (!transporter) return res.status(404).json({ error: 'Transporter not found' });

    // Update request
    request.status = 'assigned';

    // Create delivery
    const delivery = {
      id: uuidv4(),
      transportRequestId: request.id,
      transporterId: req.user.id,
      transporterName: transporter.name,
      orderId: request.orderId,
      status: 'accepted',
      pickupLocation: { ...request.pickupLocation, address: `${request.pickupLocation.address}, ${request.pickupLocation.city}` },
      dropLocation: { ...request.dropLocation, address: `${request.dropLocation.address}, ${request.dropLocation.city}` },
      currentLocation: transporter.currentLocation || request.pickupLocation,
      route: [request.pickupLocation, request.dropLocation],
      distance: request.distance,
      estimatedTime: estimatedTime || Math.ceil(request.distance / 60),
      earnings: offerPrice || request.estimatedCost,
      createdAt: new Date(),
    };

    deliveries.push(delivery);

    // Update the related order with transporter info
    const orderIndex = orders.findIndex(o => o.id === request.orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].transporterId = req.user.id;
      orders[orderIndex].transporterName = transporter.name;
    }

    // Notify farmer
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${request.farmerId}`).emit('transport-accepted', {
        message: `${transporter.name} accepted transport for ${request.cropName}`,
        delivery,
      });
    }

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transporter's deliveries
const getMyDeliveries = (req, res) => {
  try {
    const { status } = req.query;
    let myDeliveries = deliveries.filter(d => d.transporterId === req.user.id);

    if (status === 'active') {
      myDeliveries = myDeliveries.filter(d => ['accepted', 'in-transit'].includes(d.status));
    } else if (status === 'completed') {
      myDeliveries = myDeliveries.filter(d => d.status === 'delivered');
    }

    res.json({ deliveries: myDeliveries, total: myDeliveries.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update delivery status
const updateDeliveryStatus = (req, res) => {
  try {
    const { status, currentLocation } = req.body;
    const deliveryIndex = deliveries.findIndex(d => d.id === req.params.id);
    if (deliveryIndex === -1) return res.status(404).json({ error: 'Delivery not found' });

    const delivery = deliveries[deliveryIndex];

    if (delivery.transporterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const validTransitions = {
      'accepted': ['in-transit'],
      'in-transit': ['delivered'],
      'delivered': [],
      'cancelled': [],
    };

    if (!validTransitions[delivery.status]?.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${delivery.status} to ${status}` });
    }

    delivery.status = status;
    if (currentLocation) delivery.currentLocation = currentLocation;
    if (status === 'in-transit') delivery.startedAt = new Date();
    if (status === 'delivered') {
      delivery.completedAt = new Date();
      delivery.actualTime = delivery.startedAt
        ? Math.ceil((new Date() - new Date(delivery.startedAt)) / (1000 * 60 * 60))
        : delivery.estimatedTime;
    }

    // Also update the related order
    const orderIndex = orders.findIndex(o => o.id === delivery.orderId);
    if (orderIndex !== -1) {
      if (status === 'in-transit') {
        orders[orderIndex].status = 'in-transit';
        orders[orderIndex].timeline.push({ status: 'in-transit', timestamp: new Date(), note: 'Picked up by transporter' });
      } else if (status === 'delivered') {
        orders[orderIndex].status = 'delivered';
        orders[orderIndex].actualDelivery = new Date();
        orders[orderIndex].timeline.push({ status: 'delivered', timestamp: new Date(), note: 'Delivered successfully' });
      }
    }

    // Notify relevant users
    const io = req.app.get('io');
    if (io) {
      const request = transportRequests.find(tr => tr.id === delivery.transportRequestId);
      if (request) {
        io.to(`user_${request.farmerId}`).emit('delivery-status-changed', { delivery });
        io.to(`user_${request.buyerId}`).emit('delivery-status-changed', { delivery });
      }
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transporter earnings
const getEarnings = (req, res) => {
  try {
    const myDeliveries = deliveries.filter(d => d.transporterId === req.user.id);
    const completed = myDeliveries.filter(d => d.status === 'delivered');

    const totalEarnings = completed.reduce((sum, d) => sum + d.earnings, 0);

    // Monthly breakdown
    const monthlyEarnings = {};
    completed.forEach(d => {
      const month = new Date(d.completedAt || d.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyEarnings[month]) monthlyEarnings[month] = 0;
      monthlyEarnings[month] += d.earnings;
    });

    res.json({
      totalEarnings,
      totalTrips: completed.length,
      avgPerTrip: completed.length > 0 ? Math.round(totalEarnings / completed.length) : 0,
      monthlyEarnings,
      recentTransactions: completed.slice(-10).reverse().map(d => ({
        id: d.id,
        orderId: d.orderId,
        amount: d.earnings,
        date: d.completedAt || d.createdAt,
        status: 'paid',
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create transport request (by farmer after order confirmation)
const createTransportRequest = (req, res) => {
  try {
    const { orderId, pickupDate, vehicleRequired, notes } = req.body;

    const order = orders.find(o => o.id === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const newRequest = {
      id: uuidv4(),
      orderId,
      farmerId: order.farmerId,
      farmerName: order.farmerName,
      buyerId: order.buyerId,
      buyerName: order.buyerName,
      cropName: order.cropName,
      quantity: order.quantity,
      unit: order.unit,
      pickupLocation: order.pickupAddress,
      dropLocation: order.deliveryAddress,
      distance: Math.round(Math.random() * 1000 + 50), // simplified distance calc
      estimatedCost: Math.round(order.totalPrice * 0.05), // ~5% of order value
      status: 'open',
      vehicleRequired: vehicleRequired || 'truck',
      weight: order.quantity * 100, // rough kg estimate
      createdAt: new Date(),
      pickupDate: pickupDate ? new Date(pickupDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    transportRequests.push(newRequest);

    // Notify transporters
    const io = req.app.get('io');
    if (io) {
      io.to('role_transporter').emit('new-transport-job', {
        message: `New transport job: ${order.cropName} from ${order.pickupAddress.city || 'unknown'}`,
        request: newRequest,
      });
    }

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transport requests for a farmer
const getFarmerTransportRequests = (req, res) => {
  try {
    const farmerId = req.user.id;
    const farmerRequests = transportRequests.filter(tr => tr.farmerId === farmerId);

    res.json({
      requests: farmerRequests,
      total: farmerRequests.length,
      stats: {
        open: farmerRequests.filter(tr => tr.status === 'open').length,
        assigned: farmerRequests.filter(tr => tr.status === 'assigned').length,
        completed: farmerRequests.filter(tr => tr.status === 'completed').length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableJobs,
  acceptJob,
  getMyDeliveries,
  updateDeliveryStatus,
  getEarnings,
  createTransportRequest,
  getFarmerTransportRequests,
  transportRequests,
  deliveries,
};
