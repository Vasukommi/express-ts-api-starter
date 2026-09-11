import { rateLimit } from 'express-rate-limit';

import { env } from '../config/env.config.js';
import { ErrorCode } from '../constants/error-codes.js';
import { getCorrelationId } from '../utils/request-context.js';
import { logger } from '../utils/logger.js';

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_LIMIT,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  identifier: 'api',
  skip: (req) => ['/health', '/ready', '/api/v1/health', '/api/v1/health/ready'].includes(req.path),
  message: {
    status: 'fail',
    code: ErrorCode.RATE_LIMITED,
    message: 'Too many requests. Please try again later.',
  },
  handler: (_req, res, _next, options) => {
    const correlationId = getCorrelationId();
    logger.warn('Rate limit exceeded.', { correlationId });

    res.status(options.statusCode).json({
      status: 'fail',
      code: ErrorCode.RATE_LIMITED,
      correlationId,
      message: 'Too many requests. Please try again later.',
    });
  },
});
