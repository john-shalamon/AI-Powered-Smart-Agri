const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Mock data for MVP (replace with database later)
const mockUsers = [
  {
    _id: 'f1',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@gmail.com',
    role: 'farmer',
    phone: '+91 98765 43210',
    address: {
      street: 'Village Khera, Delhi Road',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    rating: 4.8,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-15')
  },
  {
    _id: 'f2',
    name: 'Suresh Patel',
    email: 'suresh.patel@gmail.com',
    role: 'farmer',
    phone: '+91 98765 43211',
    address: {
      street: 'Village Narol, SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India'
    },
    rating: 4.6,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-02-20')
  },
  {
    _id: 'b1',
    name: 'Amit Singh',
    email: 'amit.singh@gmail.com',
    role: 'buyer',
    phone: '+91 98765 43212',
    address: {
      street: 'Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    rating: 4.9,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-10')
  },
  {
    _id: 't1',
    name: 'Rajesh Transport',
    email: 'rajesh.transport@gmail.com',
    role: 'transporter',
    phone: '+91 98765 43213',
    address: {
      street: 'Transport Nagar',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    rating: 4.7,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-03-05')
  },
  {
    _id: 'a1',
    name: 'Admin User',
    email: 'admin@agriai.com',
    role: 'admin',
    phone: '+91 98765 43214',
    address: {
      street: 'Corporate Office',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    rating: 5.0,
    isVerified: true,
    isActive: true,
    createdAt: new Date('2023-01-01')
  }
];

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    let filteredUsers = [...mockUsers];

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      users: paginatedUsers,
      totalPages: Math.ceil(filteredUsers.length / limit),
      currentPage: parseInt(page),
      total: filteredUsers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = mockUsers.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Create new user (simplified for MVP)
    const newUser = {
      _id: `u${Date.now()}`,
      name,
      email,
      role,
      phone,
      address,
      rating: 0,
      isVerified: false,
      isActive: true,
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    // Emit real-time notification
    const io = req.app.get('io');
    io.to('role_admin').emit('user-created', { user: newUser });

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't update password here

    const userIndex = mockUsers.findIndex(u => u._id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Update user
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`user_${mockUsers[userIndex]._id}`).emit('profile-updated', mockUsers[userIndex]);
    io.to('role_admin').emit('user-updated', mockUsers[userIndex]);

    res.json(mockUsers[userIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const userIndex = mockUsers.findIndex(u => u._id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Soft delete
    mockUsers[userIndex].isActive = false;

    // Emit real-time notification
    const io = req.app.get('io');
    io.to('role_admin').emit('user-deleted', { userId: req.params.id });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword
};