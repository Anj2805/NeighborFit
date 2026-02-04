import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userPreferencesRoutes from './routes/userPreferencesRoutes.js';
import neighborhoodRoutes from './routes/neighborhoodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const buildCorsOptions = (allowedOrigins = []) => ({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export const createApp = ({ allowedOrigins = [] } = {}) => {
  const app = express();

  const corsOptions = buildCorsOptions(allowedOrigins);
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/preferences', userPreferencesRoutes);
  app.use('/api/neighborhoods', neighborhoodRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/', (req, res) => {
    res.json({
      message: 'NeighborFit API running ✅',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        preferences: '/api/preferences',
        neighborhoods: '/api/neighborhoods',
        admin: '/api/admin'
      }
    });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  return app;
};

export default createApp;
