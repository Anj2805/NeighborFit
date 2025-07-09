import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userPreferencesRoutes from './routes/userPreferencesRoutes.js';
import neighborhoodRoutes from './routes/neighborhoodRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NeighborFit API running ✅',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      preferences: '/api/preferences',
      neighborhoods: '/api/neighborhoods'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 NeighborFit Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
