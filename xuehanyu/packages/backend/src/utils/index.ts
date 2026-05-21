// ============================================
// Backend Utility Functions
// ============================================

import type { AppError } from '../middlewares/error.middleware.js';

/**
 * Create a standardized application error.
 */
export function createError(message: string, statusCode = 500): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

/**
 * Async route handler wrapper to catch errors.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Re-export Express types for convenience
import type { Request, Response, NextFunction } from 'express';
