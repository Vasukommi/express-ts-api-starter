import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env.config.js';
import { ErrorCode } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';
import { getCorrelationId } from '../utils/request-context.js';
import { logger } from '../utils/logger.js';

const normalizeUnknownError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error(String(error));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const correlationId = getCorrelationId();

  if (error instanceof AppError) {
    logger.warn(error.message, {
      code: error.code,
      correlationId,
      details: error.details,
      statusCode: error.statusCode,
    });

    res.status(error.statusCode).json({
      status: error.statusCode >= 500 ? 'error' : 'fail',
      code: error.code,
      correlationId,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(HttpStatus.BAD_REQUEST).json({
      status: 'fail',
      code: ErrorCode.VALIDATION_ERROR,
      correlationId,
      message: 'Request validation failed.',
      details: error.flatten(),
    });
    return;
  }

  const normalizedError = normalizeUnknownError(error);

  logger.error('Unhandled error.', {
    correlationId,
    error: normalizedError,
    stack: normalizedError.stack,
  });

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    correlationId,
    message: env.isProduction ? 'Internal server error.' : normalizedError.message,
    stack: env.isProduction ? undefined : normalizedError.stack,
  });
};
