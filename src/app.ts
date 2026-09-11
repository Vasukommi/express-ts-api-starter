import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { corsOptions } from './config/cors.config.js';
import { env } from './config/env.config.js';
import { helmetOptions } from './config/security.config.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { apiRateLimiter } from './middlewares/rate-limit.middleware.js';
import { requestContextMiddleware } from './middlewares/request-context.middleware.js';
import { healthRouter } from './modules/health/health.routes.js';
import { apiRouter } from './routes.js';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestContextMiddleware);
  app.use(httpLoggerMiddleware);
  app.use(helmet(helmetOptions));
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(apiRateLimiter);
  app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: env.REQUEST_BODY_LIMIT }));

  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'express-ts-enterprise-template',
      status: 'ok',
      version: '1.0.0',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
