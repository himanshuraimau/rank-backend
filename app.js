import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/ranking', userRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

// Default route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the LeetCode User Ranking API',
    version: '1.0.0',
    endpoints: {
      ranking: '/ranking/:username - Get user ranking',
      health: '/health - Check API health'
    }
  });
});

app.use(errorHandler);
app.use(notFound);

export { app };