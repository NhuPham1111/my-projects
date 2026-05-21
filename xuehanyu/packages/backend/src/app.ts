import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// ============================================
// Middleware Stack
// ============================================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================
app.use('/api', router);

// ============================================
// Error Handling
// ============================================
app.use(errorHandler);

export { app };
