import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createLogger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import contractRoutes from './routes/contracts.js';
import deploymentRoutes from './routes/deployments.js';
import analyticsRoutes from './routes/analytics.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const logger = createLogger();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());

// CORS configuration for Vercel deployment
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://createx.vercel.app',
  'https://createx-interface.vercel.app',
  'https://createx.rocks'
];

// Add dynamic Vercel preview URLs
if (process.env.VERCEL_URL) {
  corsOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? corsOrigins
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CreateX Backend API',
    version: '1.0.0',
    description: 'Backend API for CreateX smart contract factory',
    endpoints: {
      health: '/api/health',
      contracts: '/api/contracts',
      deployments: '/api/deployments',
      analytics: '/api/analytics'
    },
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server (only in non-serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`CreateX Backend API listening on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Export for Vercel serverless functions
export default app;
