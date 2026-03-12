const { v4: uuidv4 } = require('uuid');

// In-memory notifications store
const notifications = [
  {
    id: 'n1',
    userId: 'f1',
    type: 'order',
    title: 'New Order Received',
    message: 'Amit Singh placed an order for 100 quintals of Organic Wheat',
    read: false,
    actionUrl: '/farmer/orders',
    createdAt: new Date('2026-03-01'),
  },
  {
    id: 'n2',
    userId: 'f1',
    type: 'market',
    title: 'Price Alert: Wheat',
    message: 'Wheat prices have increased by 5% in the last 24 hours',
    read: true,
    actionUrl: '/farmer/market-insights',
    createdAt: new Date('2026-02-28'),
  },
  {
    id: 'n3',
    userId: 'b1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order for Fresh Tomatoes has been confirmed by the farmer',
    read: false,
    actionUrl: '/buyer/my-orders',
    createdAt: new Date('2026-02-11'),
  },
  {
    id: 'n4',
    userId: 't1',
    type: 'transport',
    title: 'New Transport Job',
    message: 'New delivery job available: Basmati Rice from Delhi to Mumbai',
    read: false,
    actionUrl: '/transporter/available-jobs',
    createdAt: new Date('2026-03-05'),
  },
  {
    id: 'n5',
    userId: 'f1',
    type: 'weather',
    title: 'Weather Alert',
    message: 'Heavy rainfall expected in Delhi region. Protect your crops.',
    read: false,
    actionUrl: '/farmer/dashboard',
    createdAt: new Date('2026-03-10'),
  },
  {
    id: 'n6',
    userId: 'b1',
    type: 'delivery',
    title: 'Delivery Update',
    message: 'Your order for Basmati Rice is now in transit',
    read: false,
    actionUrl: '/buyer/my-orders',
    createdAt: new Date('2026-03-08'),
  },
  {
    id: 'n7',
    userId: 'f2',
    type: 'ai',
    title: 'AI Disease Alert',
    message: 'Early signs of leaf blight detected in your region. Check disease detection tool.',
    read: false,
    actionUrl: '/farmer/disease-detection',
    createdAt: new Date('2026-03-09'),
  },
];

// Get user notifications
const getNotifications = (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    let userNotifications = notifications
      .filter(n => n.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (unreadOnly === 'true') {
      userNotifications = userNotifications.filter(n => !n.read);
    }

    const startIndex = (page - 1) * limit;
    const paginated = userNotifications.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      notifications: paginated,
      total: userNotifications.length,
      unreadCount: userNotifications.filter(n => !n.read).length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
const markAsRead = (req, res) => {
  try {
    const notification = notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    notification.read = true;
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all as read
const markAllAsRead = (req, res) => {
  try {
    notifications
      .filter(n => n.userId === req.user.id && !n.read)
      .forEach(n => { n.read = true; });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create notification (internal use)
const createNotification = (userId, type, title, message, actionUrl) => {
  const notification = {
    id: uuidv4(),
    userId,
    type,
    title,
    message,
    read: false,
    actionUrl,
    createdAt: new Date(),
  };
  notifications.push(notification);
  return notification;
};

// Delete notification
const deleteNotification = (req, res) => {
  try {
    const idx = notifications.findIndex(n => n.id === req.params.id && n.userId === req.user.id);
    if (idx === -1) return res.status(404).json({ error: 'Notification not found' });

    notifications.splice(idx, 1);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
};
