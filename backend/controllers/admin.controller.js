const { users, sanitizeUser } = require('./auth.controller');
const { cropListings } = require('./crop.controller');
const { orders } = require('./order.controller');
const { transportRequests, deliveries } = require('./transport.controller');

// Get dashboard stats
const getDashboardStats = (req, res) => {
  try {
    const totalUsers = users.filter(u => u.isActive).length;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalPrice, 0);
    const activeCrops = cropListings.filter(c => c.status === 'active').length;

    const usersByRole = {
      farmers: users.filter(u => u.role === 'farmer' && u.isActive).length,
      buyers: users.filter(u => u.role === 'buyer' && u.isActive).length,
      transporters: users.filter(u => u.role === 'transporter' && u.isActive).length,
    };

    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      inTransit: orders.filter(o => o.status === 'in-transit').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Monthly revenue data (for charts)
    const monthlyRevenue = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((month, idx) => {
      const monthOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === idx;
      });
      monthlyRevenue.push({
        month,
        revenue: monthOrders.reduce((s, o) => s + o.totalPrice, 0),
        orders: monthOrders.length,
      });
    });

    // Recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      activeCrops,
      usersByRole,
      ordersByStatus,
      monthlyRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin)
const getAllUsers = (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    let filtered = [...users];

    if (role && role !== 'all') {
      filtered = filtered.filter(u => u.role === role);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + parseInt(limit)).map(sanitizeUser);

    res.json({
      users: paginated,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: parseInt(page),
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle user status
const toggleUserStatus = (req, res) => {
  try {
    const userIndex = users.findIndex(u => u._id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    users[userIndex].isActive = !users[userIndex].isActive;

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${users[userIndex]._id}`).emit('account-status-changed', {
        isActive: users[userIndex].isActive,
      });
    }

    res.json(sanitizeUser(users[userIndex]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics data
const getAnalytics = (req, res) => {
  try {
    const { period = '6months' } = req.query;

    // Revenue analytics
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalPrice, 0);
    const platformFee = totalRevenue * 0.05; // 5% platform fee

    // User growth
    const userGrowth = [
      { month: 'Oct', farmers: 2, buyers: 1, transporters: 1 },
      { month: 'Nov', farmers: 3, buyers: 2, transporters: 1 },
      { month: 'Dec', farmers: 4, buyers: 2, transporters: 2 },
      { month: 'Jan', farmers: 5, buyers: 3, transporters: 2 },
      { month: 'Feb', farmers: 6, buyers: 4, transporters: 3 },
      { month: 'Mar', farmers: 7, buyers: 5, transporters: 3 },
    ];

    // Crop performance
    const cropPerformance = {};
    orders.forEach(o => {
      if (!cropPerformance[o.cropName]) {
        cropPerformance[o.cropName] = { name: o.cropName, orders: 0, revenue: 0, quantity: 0 };
      }
      cropPerformance[o.cropName].orders++;
      cropPerformance[o.cropName].revenue += o.totalPrice;
      cropPerformance[o.cropName].quantity += o.quantity;
    });

    // Top performing crops
    const topCrops = Object.values(cropPerformance).sort((a, b) => b.revenue - a.revenue);

    res.json({
      revenue: { total: totalRevenue, platformFee, profit: platformFee },
      users: {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        growth: userGrowth,
      },
      orders: {
        total: orders.length,
        avgValue: deliveredOrders.length > 0 ? Math.round(totalRevenue / deliveredOrders.length) : 0,
      },
      cropPerformance: topCrops,
      transport: {
        totalDeliveries: deliveries.length,
        avgDeliveryTime: deliveries.filter(d => d.actualTime).reduce((s, d) => s + d.actualTime, 0) / (deliveries.filter(d => d.actualTime).length || 1),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all crops and orders for admin
const getCropsAndOrders = (req, res) => {
  try {
    const { tab = 'crops', search } = req.query;

    if (tab === 'crops') {
      let crops = [...cropListings];
      if (search) {
        const s = search.toLowerCase();
        crops = crops.filter(c => c.cropName.toLowerCase().includes(s) || c.farmerName.toLowerCase().includes(s));
      }
      res.json({ crops, total: crops.length });
    } else {
      let orderList = [...orders];
      if (search) {
        const s = search.toLowerCase();
        orderList = orderList.filter(o =>
          o.cropName.toLowerCase().includes(s) ||
          o.farmerName.toLowerCase().includes(s) ||
          o.buyerName.toLowerCase().includes(s)
        );
      }
      res.json({ orders: orderList, total: orderList.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate report data
const getReportData = (req, res) => {
  try {
    const { type = 'financial', period = 'monthly' } = req.query;

    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalPrice, 0);

    const report = {
      type,
      period,
      generatedAt: new Date(),
      data: {},
    };

    switch (type) {
      case 'financial':
        report.data = {
          totalRevenue,
          totalOrders: orders.length,
          platformFees: totalRevenue * 0.05,
          payoutToFarmers: totalRevenue * 0.90,
          transportCosts: deliveries.filter(d => d.status === 'delivered').reduce((s, d) => s + d.earnings, 0),
          avgOrderValue: deliveredOrders.length > 0 ? Math.round(totalRevenue / deliveredOrders.length) : 0,
        };
        break;
      case 'user-activity':
        report.data = {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          newUsers: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
          byRole: {
            farmers: users.filter(u => u.role === 'farmer').length,
            buyers: users.filter(u => u.role === 'buyer').length,
            transporters: users.filter(u => u.role === 'transporter').length,
          },
        };
        break;
      case 'market':
        report.data = {
          activeCrops: cropListings.filter(c => c.status === 'active').length,
          totalListings: cropListings.length,
          topCrops: cropListings.slice(0, 5).map(c => ({ name: c.cropName, price: c.pricePerUnit, views: c.views })),
          avgPrice: cropListings.reduce((s, c) => s + c.pricePerUnit, 0) / (cropListings.length || 1),
        };
        break;
      case 'operations':
        report.data = {
          totalDeliveries: deliveries.length,
          completedDeliveries: deliveries.filter(d => d.status === 'delivered').length,
          openTransportRequests: transportRequests.filter(tr => tr.status === 'open').length,
          avgDeliveryTime: deliveries.filter(d => d.actualTime).reduce((s, d) => s + d.actualTime, 0) / (deliveries.filter(d => d.actualTime).length || 1),
        };
        break;
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAnalytics,
  getCropsAndOrders,
  getReportData,
};
