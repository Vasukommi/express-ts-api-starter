import morgan from 'morgan';

import { env } from '../config/env.config.js';
import { getCorrelationId } from '../utils/request-context.js';
import { logger } from '../utils/logger.js';

morgan.token('correlation-id', () => getCorrelationId() ?? '-');

export const httpLoggerMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms :correlation-id',
  {
    skip: () => env.isTest,
    stream: {
      write: (message) => {
        logger.http(message.trim());
      },
    },
  },
);
