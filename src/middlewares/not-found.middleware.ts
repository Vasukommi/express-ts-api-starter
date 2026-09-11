import type { RequestHandler } from 'express';

import { ErrorCode } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found.`,
      HttpStatus.NOT_FOUND,
      true,
      ErrorCode.NOT_FOUND,
    ),
  );
};
