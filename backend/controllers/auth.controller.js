const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// Generate hash synchronously at startup for pre-seeded users
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

// In-memory user store for MVP (replace with MongoDB in production)
const users = [
  {
    _id: 'f1',
    name: 'Ravi Kumar',
    email: 'ravi@farmer.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'farmer',
    phone: '+91 98765 43210',
    address: { street: 'Village Khera, Delhi Road', city: 'Delhi', state: 'Delhi', country: 'India' },
    farmLocation: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    cropTypes: ['Wheat', 'Rice', 'Tomato'],
    farmSize: 15,
    rating: 4.8,
    totalSales: 156,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-15'),
    avatar: '',
  },
  {
    _id: 'f2',
    name: 'Suresh Patel',
    email: 'suresh@farmer.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'farmer',
    phone: '+91 98765 43211',
    address: { street: 'Village Narol, SG Highway', city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
    farmLocation: { lat: 23.0225, lng: 72.5714, address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat' },
    cropTypes: ['Cotton', 'Groundnut', 'Wheat'],
    farmSize: 25,
    rating: 4.6,
    totalSales: 89,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-02-20'),
    avatar: '',
  },
  {
    _id: 'b1',
    name: 'Amit Singh',
    email: 'amit@buyer.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'buyer',
    phone: '+91 98765 43212',
    address: { street: 'Connaught Place', city: 'Delhi', state: 'Delhi', country: 'India' },
    businessName: 'Singh Agro Traders',
    businessType: 'wholesaler',
    location: { lat: 28.6315, lng: 77.2167, address: 'Connaught Place', city: 'Delhi', state: 'Delhi' },
    rating: 4.9,
    totalPurchases: 234,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-10'),
    avatar: '',
  },
  {
    _id: 'b2',
    name: 'Priya Sharma',
    email: 'priya@buyer.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'buyer',
    phone: '+91 98765 43218',
    address: { street: 'MG Road', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    businessName: 'Sharma Fresh Foods',
    businessType: 'retailer',
    location: { lat: 19.0760, lng: 72.8777, address: 'MG Road', city: 'Mumbai', state: 'Maharashtra' },
    rating: 4.7,
    totalPurchases: 178,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-03-15'),
    avatar: '',
  },
  {
    _id: 't1',
    name: 'Rajesh Transport',
    email: 'rajesh@transport.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'transporter',
    phone: '+91 98765 43213',
    address: { street: 'Transport Nagar', city: 'Delhi', state: 'Delhi', country: 'India' },
    vehicleType: 'truck',
    vehicleNumber: 'DL-01-AB-1234',
    capacity: 10,
    licenseNumber: 'DL-0420110012345',
    rating: 4.7,
    totalDeliveries: 312,
    currentLocation: { lat: 28.6139, lng: 77.2090 },
    availability: true,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-03-05'),
    avatar: '',
  },
  {
    _id: 't2',
    name: 'Vikram Logistics',
    email: 'vikram@transport.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'transporter',
    phone: '+91 98765 43219',
    address: { street: 'Industrial Area', city: 'Pune', state: 'Maharashtra', country: 'India' },
    vehicleType: 'mini-truck',
    vehicleNumber: 'MH-12-CD-5678',
    capacity: 5,
    licenseNumber: 'MH-0420110067890',
    rating: 4.5,
    totalDeliveries: 198,
    currentLocation: { lat: 18.5204, lng: 73.8567 },
    availability: true,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-04-10'),
    avatar: '',
  },
  {
    _id: 'a1',
    name: 'Admin User',
    email: 'admin@agriai.com',
    password: DEFAULT_PASSWORD_HASH,
    role: 'admin',
    phone: '+91 98765 43214',
    address: { street: 'Corporate Office', city: 'Delhi', state: 'Delhi', country: 'India' },
    permissions: ['manage_users', 'manage_orders', 'manage_crops', 'view_analytics', 'manage_settings'],
    rating: 5.0,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    avatar: '',
  },
];

// Helper to sanitize user data (remove password)
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      address: {},
      rating: 0,
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      avatar: '',
    };

    // Add role-specific fields
    if (role === 'farmer') {
      newUser.farmLocation = {};
      newUser.cropTypes = [];
      newUser.farmSize = 0;
      newUser.totalSales = 0;
    } else if (role === 'buyer') {
      newUser.businessName = '';
      newUser.businessType = 'retailer';
      newUser.location = {};
      newUser.totalPurchases = 0;
    } else if (role === 'transporter') {
      newUser.vehicleType = 'truck';
      newUser.vehicleNumber = '';
      newUser.capacity = 0;
      newUser.licenseNumber = '';
      newUser.totalDeliveries = 0;
      newUser.availability = true;
    }

    users.push(newUser);

    const token = generateToken(newUser);

    // Emit real-time notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('role_admin').emit('user-created', { user: sanitizeUser(newUser) });
    }

    res.status(201).json({
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    // For demo: accept "password123" for pre-seeded users
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch {
      // If bcrypt fails (e.g., mock hash), check plaintext for demo
      isMatch = password === 'password123';
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();

    const token = generateToken(user);

    res.json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = users.find(u => u._id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update current user profile
const updateProfile = async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u._id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = req.body;
    // Prevent updating sensitive fields
    delete updates.password;
    delete updates._id;
    delete updates.role;
    delete updates.email;

    users[userIndex] = { ...users[userIndex], ...updates };

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${users[userIndex]._id}`).emit('profile-updated', sanitizeUser(users[userIndex]));
    }

    res.json(sanitizeUser(users[userIndex]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = users.find(u => u._id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(currentPassword, user.password);
    } catch {
      isMatch = currentPassword === 'password123';
    }

    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (for admin and internal use)
const getUsers = () => users;

// Get user by ID (internal helper)
const getUserById = (id) => users.find(u => u._id === id);

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  sanitizeUser,
  users,
};
