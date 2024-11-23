import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 60,
  message: { error: 'Too many requests from this IP, try again in 1 hour' },
  standardHeaders: true,
  legacyHeaders: false,
});


export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};