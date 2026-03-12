require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Note: Using mock data for MVP - MongoDB connection removed for simplicity

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.url !== '/api/health') {
      console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// Simple rate limiting (per IP, 100 requests per minute)
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
  } else {
    const entry = rateLimitMap.get(ip);
    if (now - entry.startTime > windowMs) {
      rateLimitMap.set(ip, { count: 1, startTime: now });
    } else {
      entry.count++;
      if (entry.count > maxRequests) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }
    }
  }
  next();
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// AI routes
const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);

// User routes (legacy, kept for compatibility)
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// Crop routes
const cropRoutes = require('./routes/crop.routes');
app.use('/api/crops', cropRoutes);

// Order routes
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

// Transport routes
const transportRoutes = require('./routes/transport.routes');
app.use('/api/transport', transportRoutes);

// Payment routes
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);

// Weather routes
const weatherRoutes = require('./routes/weather.routes');
app.use('/api/weather', weatherRoutes);

// Notification routes
const notificationRoutes = require('./routes/notification.routes');
app.use('/api/notifications', notificationRoutes);

// Admin routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join user-specific room for notifications
  socket.on('join-user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join role-specific rooms
  socket.on('join-role', (role) => {
    socket.join(`role_${role}`);
    console.log(`User joined ${role} room`);
  });

  // Handle order updates
  socket.on('order-update', (data) => {
    // Broadcast to relevant users
    io.to(`user_${data.buyerId}`).emit('order-status-changed', data);
    io.to(`user_${data.farmerId}`).emit('order-status-changed', data);
    if (data.transporterId) {
      io.to(`user_${data.transporterId}`).emit('order-status-changed', data);
    }
  });

  // Handle market data updates
  socket.on('market-data-update', (data) => {
    io.to('role_buyer').emit('market-data-changed', data);
    io.to('role_farmer').emit('market-data-changed', data);
  });

  // Handle disease alerts
  socket.on('disease-alert', (data) => {
    io.to('role_farmer').emit('disease-notification', data);
  });

  // Handle general notifications
  socket.on('send-notification', (data) => {
    if (data.userId) {
      io.to(`user_${data.userId}`).emit('notification', data);
    } else if (data.role) {
      io.to(`role_${data.role}`).emit('notification', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server with Socket.IO running on port ${PORT}`);
});