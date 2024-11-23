import express from 'express';
import { getUserRanking } from '../controllers/userController.js';
import { limiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/:username', limiter, getUserRanking);

export default router;