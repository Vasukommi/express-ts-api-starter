import type { CorsOptions } from 'cors';

import { env } from './env.config.js';
import { ErrorCode } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

export const corsOptions: CorsOptions = {
  credentials: env.CORS_CREDENTIALS,
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (!env.isProduction && env.CORS_ORIGIN.includes('*')) {
      callback(null, true);
      return;
    }

    if (env.CORS_ORIGIN.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(
      new AppError(
        `Origin ${origin} is not allowed by CORS.`,
        HttpStatus.FORBIDDEN,
        true,
        ErrorCode.CORS_NOT_ALLOWED,
      ),
    );
  },
};
