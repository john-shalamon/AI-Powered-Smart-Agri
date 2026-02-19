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
    methods: ["GET", "POST"]
  }
});

// Note: Using mock data for MVP - MongoDB connection removed for simplicity

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// AI routes
const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);

// User routes
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// Payment routes
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);

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