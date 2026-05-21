import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';

const router = Router();

// Health check
router.get('/health', healthCheck);

// ============================================
// Register feature routes below
// ============================================
// Example:
// import { userRouter } from './user.routes.js';
// router.use('/users', userRouter);

export { router };
