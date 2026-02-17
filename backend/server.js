require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// AI routes
const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend server running on port ${PORT}`);
});