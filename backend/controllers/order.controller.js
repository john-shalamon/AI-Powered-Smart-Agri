const { v4: uuidv4 } = require('uuid');
const { getUserById, sanitizeUser, users } = require('./auth.controller');
const { cropListings } = require('./crop.controller');

// In-memory orders store
const orders = [
  {
    id: 'ord1',
    cropListingId: 'cl1',
    cropName: 'Organic Wheat',
    cropImage: '/uploads/crops/wheat.jpg',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b1',
    buyerName: 'Amit Singh',
    quantity: 100,
    unit: 'quintal',
    pricePerUnit: 2200,
    totalPrice: 220000,
    status: 'confirmed',
    deliveryAddress: { address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167 },
    pickupAddress: { address: 'Village Khera', city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
    transporterId: 't1',
    transporterName: 'Rajesh Transport',
    estimatedDelivery: new Date('2026-03-20'),
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-05'),
    timeline: [
      { status: 'pending', timestamp: new Date('2026-03-01'), note: 'Order placed' },
      { status: 'confirmed', timestamp: new Date('2026-03-02'), note: 'Order confirmed by farmer' },
    ],
  },
  {
    id: 'ord2',
    cropListingId: 'cl2',
    cropName: 'Basmati Rice',
    cropImage: '/uploads/crops/rice.jpg',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b2',
    buyerName: 'Priya Sharma',
    quantity: 50,
    unit: 'quintal',
    pricePerUnit: 3500,
    totalPrice: 175000,
    status: 'in-transit',
    deliveryAddress: { address: 'MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', lat: 19.0760, lng: 72.8777 },
    pickupAddress: { address: 'Village Khera', city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
    transporterId: 't1',
    transporterName: 'Rajesh Transport',
    estimatedDelivery: new Date('2026-03-18'),
    createdAt: new Date('2026-02-25'),
    updatedAt: new Date('2026-03-08'),
    timeline: [
      { status: 'pending', timestamp: new Date('2026-02-25'), note: 'Order placed' },
      { status: 'confirmed', timestamp: new Date('2026-02-26'), note: 'Order confirmed' },
      { status: 'in-transit', timestamp: new Date('2026-03-08'), note: 'Picked up by transporter' },
    ],
  },
  {
    id: 'ord3',
    cropListingId: 'cl3',
    cropName: 'Fresh Tomatoes',
    cropImage: '/uploads/crops/tomato.jpg',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    buyerId: 'b1',
    buyerName: 'Amit Singh',
    quantity: 20,
    unit: 'quintal',
    pricePerUnit: 1800,
    totalPrice: 36000,
    status: 'delivered',
    deliveryAddress: { address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167 },
    pickupAddress: { address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    transporterId: 't2',
    transporterName: 'Vikram Logistics',
    estimatedDelivery: new Date('2026-02-20'),
    actualDelivery: new Date('2026-02-19'),
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-19'),
    timeline: [
      { status: 'pending', timestamp: new Date('2026-02-10'), note: 'Order placed' },
      { status: 'confirmed', timestamp: new Date('2026-02-11'), note: 'Order confirmed' },
      { status: 'in-transit', timestamp: new Date('2026-02-15'), note: 'Picked up' },
      { status: 'delivered', timestamp: new Date('2026-02-19'), note: 'Delivered successfully' },
    ],
  },
  {
    id: 'ord4',
    cropListingId: 'cl5',
    cropName: 'Fresh Potatoes',
    cropImage: '/uploads/crops/potato.jpg',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    buyerId: 'b2',
    buyerName: 'Priya Sharma',
    quantity: 80,
    unit: 'quintal',
    pricePerUnit: 1200,
    totalPrice: 96000,
    status: 'pending',
    deliveryAddress: { address: 'MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', lat: 19.0760, lng: 72.8777 },
    pickupAddress: { address: 'Village Khera', city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
    createdAt: new Date('2026-03-08'),
    updatedAt: new Date('2026-03-08'),
    timeline: [
      { status: 'pending', timestamp: new Date('2026-03-08'), note: 'Order placed' },
    ],
  },
  {
    id: 'ord5',
    cropListingId: 'cl4',
    cropName: 'Gujarat Cotton',
    cropImage: '/uploads/crops/cotton.jpg',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    buyerId: 'b1',
    buyerName: 'Amit Singh',
    quantity: 50,
    unit: 'quintal',
    pricePerUnit: 6000,
    totalPrice: 300000,
    status: 'cancelled',
    deliveryAddress: { address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167 },
    pickupAddress: { address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-05'),
    timeline: [
      { status: 'pending', timestamp: new Date('2026-02-01'), note: 'Order placed' },
      { status: 'cancelled', timestamp: new Date('2026-02-05'), note: 'Cancelled by buyer' },
    ],
  },
];

// Get all orders with filters
const getAllOrders = (req, res) => {
  try {
    const { page = 1, limit = 10, status, role } = req.query;
    let filtered = [...orders];

    // Filter by user role
    if (req.user.role === 'farmer') {
      filtered = filtered.filter(o => o.farmerId === req.user.id);
    } else if (req.user.role === 'buyer') {
      filtered = filtered.filter(o => o.buyerId === req.user.id);
    } else if (req.user.role === 'transporter') {
      filtered = filtered.filter(o => o.transporterId === req.user.id);
    }
    // admin sees all

    if (status && status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + parseInt(limit));

    const stats = {
      total: filtered.length,
      pending: filtered.filter(o => o.status === 'pending').length,
      confirmed: filtered.filter(o => o.status === 'confirmed').length,
      inTransit: filtered.filter(o => o.status === 'in-transit').length,
      delivered: filtered.filter(o => o.status === 'delivered').length,
      cancelled: filtered.filter(o => o.status === 'cancelled').length,
    };

    res.json({
      orders: paginated,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: parseInt(page),
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
const getOrderById = (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Check access
    if (req.user.role !== 'admin' &&
        order.farmerId !== req.user.id &&
        order.buyerId !== req.user.id &&
        order.transporterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new order
const createOrder = (req, res) => {
  try {
    const { cropListingId, quantity, deliveryAddress } = req.body;

    const crop = cropListings.find(c => c.id === cropListingId);
    if (!crop) return res.status(404).json({ error: 'Crop listing not found' });

    if (crop.status !== 'active') {
      return res.status(400).json({ error: 'This crop listing is no longer available' });
    }

    if (quantity > crop.quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available quantity' });
    }

    const buyer = getUserById(req.user.id);
    if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

    const newOrder = {
      id: uuidv4(),
      cropListingId,
      cropName: crop.cropName,
      cropImage: crop.images[0] || '',
      farmerId: crop.farmerId,
      farmerName: crop.farmerName,
      buyerId: req.user.id,
      buyerName: buyer.name,
      quantity: Number(quantity),
      unit: crop.unit,
      pricePerUnit: crop.pricePerUnit,
      totalPrice: Number(quantity) * crop.pricePerUnit,
      status: 'pending',
      deliveryAddress: deliveryAddress || buyer.address || {},
      pickupAddress: crop.location,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{ status: 'pending', timestamp: new Date(), note: 'Order placed by buyer' }],
    };

    orders.push(newOrder);

    // Update crop quantity
    crop.quantity -= Number(quantity);
    if (crop.quantity <= 0) {
      crop.status = 'sold';
    }

    // Notify farmer
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${crop.farmerId}`).emit('order-status-changed', {
        message: `New order for ${crop.cropName} from ${buyer.name}`,
        order: newOrder,
      });
      io.to('role_admin').emit('order-created', { order: newOrder });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
const updateOrderStatus = (req, res) => {
  try {
    const { status, note } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });

    const order = orders[orderIndex];

    // Validate status transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-transit', 'cancelled'],
      'in-transit': ['delivered'],
      'delivered': [],
      'cancelled': [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    order.updatedAt = new Date();
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status changed to ${status}`,
    });

    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }

    // Notify relevant users
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${order.farmerId}`).emit('order-status-changed', { order });
      io.to(`user_${order.buyerId}`).emit('order-status-changed', { order });
      if (order.transporterId) {
        io.to(`user_${order.transporterId}`).emit('order-status-changed', { order });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign transporter to order
const assignTransporter = (req, res) => {
  try {
    const { transporterId } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });

    const order = orders[orderIndex];
    const transporter = getUserById(transporterId);
    if (!transporter) return res.status(404).json({ error: 'Transporter not found' });

    order.transporterId = transporterId;
    order.transporterName = transporter.name;
    order.updatedAt = new Date();

    // Notify transporter
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${transporterId}`).emit('order-assigned', {
        message: `New delivery assigned: ${order.cropName}`,
        order,
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order stats (for dashboard)
const getOrderStats = (req, res) => {
  try {
    let filtered = [...orders];

    if (req.user.role === 'farmer') {
      filtered = filtered.filter(o => o.farmerId === req.user.id);
    } else if (req.user.role === 'buyer') {
      filtered = filtered.filter(o => o.buyerId === req.user.id);
    } else if (req.user.role === 'transporter') {
      filtered = filtered.filter(o => o.transporterId === req.user.id);
    }

    const totalRevenue = filtered
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({
      total: filtered.length,
      pending: filtered.filter(o => o.status === 'pending').length,
      confirmed: filtered.filter(o => o.status === 'confirmed').length,
      inTransit: filtered.filter(o => o.status === 'in-transit').length,
      delivered: filtered.filter(o => o.status === 'delivered').length,
      cancelled: filtered.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      avgOrderValue: filtered.length > 0 ? totalRevenue / filtered.filter(o => o.status === 'delivered').length || 0 : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders (internal)
const getOrders = () => orders;

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  assignTransporter,
  getOrderStats,
  getOrders,
  orders,
};
