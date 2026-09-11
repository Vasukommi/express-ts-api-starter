import { Router } from 'express';

import { healthCheck, readinessCheck } from './health.controller.js';

export const healthRouter = Router();

healthRouter.get('/', healthCheck);
healthRouter.get('/ready', readinessCheck);
