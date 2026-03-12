const { v4: uuidv4 } = require('uuid');
const { getUserById, sanitizeUser } = require('./auth.controller');

// In-memory crop listings store
const cropListings = [
  {
    id: 'cl1',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    farmerRating: 4.8,
    cropName: 'Organic Wheat',
    category: 'grains',
    quantity: 500,
    unit: 'quintal',
    quality: 'A',
    pricePerUnit: 2200,
    harvestDate: new Date('2026-01-15'),
    location: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    images: ['/uploads/crops/wheat.jpg'],
    description: 'Premium organic wheat, naturally grown without pesticides. High protein content ideal for chapati and bread making.',
    status: 'active',
    views: 245,
    createdAt: new Date('2026-01-20'),
    expiresAt: new Date('2026-04-20'),
  },
  {
    id: 'cl2',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    farmerRating: 4.8,
    cropName: 'Basmati Rice',
    category: 'grains',
    quantity: 300,
    unit: 'quintal',
    quality: 'A',
    pricePerUnit: 3500,
    harvestDate: new Date('2025-12-20'),
    location: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    images: ['/uploads/crops/rice.jpg'],
    description: 'Premium Basmati rice with long grains and aromatic flavor. Aged for 6 months for enhanced taste.',
    status: 'active',
    views: 389,
    createdAt: new Date('2026-01-10'),
    expiresAt: new Date('2026-04-10'),
  },
  {
    id: 'cl3',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    farmerRating: 4.6,
    cropName: 'Fresh Tomatoes',
    category: 'vegetables',
    quantity: 50,
    unit: 'quintal',
    quality: 'A',
    pricePerUnit: 1800,
    harvestDate: new Date('2026-02-28'),
    location: { lat: 23.0225, lng: 72.5714, address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat' },
    images: ['/uploads/crops/tomato.jpg'],
    description: 'Vine-ripened tomatoes, perfect red color and firm texture. Ideal for restaurants and retail.',
    status: 'active',
    views: 167,
    createdAt: new Date('2026-02-25'),
    expiresAt: new Date('2026-03-25'),
  },
  {
    id: 'cl4',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    farmerRating: 4.6,
    cropName: 'Gujarat Cotton',
    category: 'cash-crops',
    quantity: 200,
    unit: 'quintal',
    quality: 'B',
    pricePerUnit: 6000,
    harvestDate: new Date('2026-01-05'),
    location: { lat: 23.0225, lng: 72.5714, address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat' },
    images: ['/uploads/crops/cotton.jpg'],
    description: 'High quality Gujarat cotton, ideal for textile manufacturing. Clean and well-processed.',
    status: 'active',
    views: 198,
    createdAt: new Date('2026-01-08'),
    expiresAt: new Date('2026-04-08'),
  },
  {
    id: 'cl5',
    farmerId: 'f1',
    farmerName: 'Ravi Kumar',
    farmerRating: 4.8,
    cropName: 'Fresh Potatoes',
    category: 'vegetables',
    quantity: 150,
    unit: 'quintal',
    quality: 'A',
    pricePerUnit: 1200,
    harvestDate: new Date('2026-02-10'),
    location: { lat: 28.7041, lng: 77.1025, address: 'Village Khera', city: 'Delhi', state: 'Delhi' },
    images: ['/uploads/crops/potato.jpg'],
    description: 'Fresh farm potatoes, uniform size and great for cooking. No spots or blemishes.',
    status: 'sold',
    views: 312,
    createdAt: new Date('2026-02-12'),
    expiresAt: new Date('2026-05-12'),
  },
  {
    id: 'cl6',
    farmerId: 'f2',
    farmerName: 'Suresh Patel',
    farmerRating: 4.6,
    cropName: 'Organic Onions',
    category: 'vegetables',
    quantity: 80,
    unit: 'quintal',
    quality: 'B',
    pricePerUnit: 1500,
    harvestDate: new Date('2026-03-01'),
    location: { lat: 23.0225, lng: 72.5714, address: 'Village Narol', city: 'Ahmedabad', state: 'Gujarat' },
    images: ['/uploads/crops/onion.jpg'],
    description: 'Organic red onions, pungent flavor and long shelf life. Perfect for wholesale markets.',
    status: 'active',
    views: 145,
    createdAt: new Date('2026-03-02'),
    expiresAt: new Date('2026-06-02'),
  },
];

// Get all crop listings with filters
const getAllCrops = (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, status, quality, minPrice, maxPrice, sortBy } = req.query;

    let filtered = [...cropListings];

    if (category && category !== 'all') {
      filtered = filtered.filter(c => c.category === category);
    }

    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }

    if (quality) {
      filtered = filtered.filter(c => c.quality === quality);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.cropName.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.location.city.toLowerCase().includes(searchLower) ||
        c.location.state.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      filtered = filtered.filter(c => c.pricePerUnit >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(c => c.pricePerUnit <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.views - a.views);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginated = filtered.slice(startIndex, endIndex);

    res.json({
      crops: paginated,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: parseInt(page),
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get crop by ID
const getCropById = (req, res) => {
  try {
    const crop = cropListings.find(c => c.id === req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop listing not found' });

    // Increment views
    crop.views++;

    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get crops by farmer ID
const getCropsByFarmer = (req, res) => {
  try {
    const farmerId = req.params.farmerId || req.user.id;
    const farmerCrops = cropListings.filter(c => c.farmerId === farmerId);

    res.json({
      crops: farmerCrops,
      total: farmerCrops.length,
      stats: {
        active: farmerCrops.filter(c => c.status === 'active').length,
        sold: farmerCrops.filter(c => c.status === 'sold').length,
        reserved: farmerCrops.filter(c => c.status === 'reserved').length,
        expired: farmerCrops.filter(c => c.status === 'expired').length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new crop listing
const createCrop = (req, res) => {
  try {
    const farmer = getUserById(req.user.id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

    const { cropName, category, quantity, unit, quality, pricePerUnit, harvestDate, description, location } = req.body;

    const newCrop = {
      id: uuidv4(),
      farmerId: req.user.id,
      farmerName: farmer.name,
      farmerRating: farmer.rating || 0,
      cropName,
      category,
      quantity: Number(quantity),
      unit: unit || 'quintal',
      quality,
      pricePerUnit: Number(pricePerUnit),
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      location: location || farmer.farmLocation || {},
      images: req.file ? [`/uploads/crops/${req.file.filename}`] : [],
      description: description || '',
      status: 'active',
      views: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    };

    cropListings.push(newCrop);

    // Notify buyers about new listing
    const io = req.app.get('io');
    if (io) {
      io.to('role_buyer').emit('new-crop-listing', {
        message: `New ${cropName} listing by ${farmer.name}`,
        crop: newCrop,
      });
    }

    res.status(201).json(newCrop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update crop listing
const updateCrop = (req, res) => {
  try {
    const cropIndex = cropListings.findIndex(c => c.id === req.params.id);
    if (cropIndex === -1) return res.status(404).json({ error: 'Crop listing not found' });

    const crop = cropListings[cropIndex];

    // Only owner or admin can update
    if (crop.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const updates = req.body;
    delete updates.id;
    delete updates.farmerId;
    delete updates.createdAt;

    if (updates.quantity) updates.quantity = Number(updates.quantity);
    if (updates.pricePerUnit) updates.pricePerUnit = Number(updates.pricePerUnit);

    cropListings[cropIndex] = { ...crop, ...updates };

    res.json(cropListings[cropIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete crop listing
const deleteCrop = (req, res) => {
  try {
    const cropIndex = cropListings.findIndex(c => c.id === req.params.id);
    if (cropIndex === -1) return res.status(404).json({ error: 'Crop listing not found' });

    const crop = cropListings[cropIndex];

    if (crop.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    cropListings.splice(cropIndex, 1);

    res.json({ message: 'Crop listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get crop categories with counts
const getCategories = (req, res) => {
  try {
    const categories = {};
    cropListings.forEach(c => {
      if (!categories[c.category]) categories[c.category] = 0;
      categories[c.category]++;
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all crop listings (internal)
const getCropListings = () => cropListings;

module.exports = {
  getAllCrops,
  getCropById,
  getCropsByFarmer,
  createCrop,
  updateCrop,
  deleteCrop,
  getCategories,
  getCropListings,
  cropListings,
};
