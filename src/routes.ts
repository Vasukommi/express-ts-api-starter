import { Router } from 'express';

import { healthRouter } from './modules/health/health.routes.js';
import { userRouter } from './modules/user/user.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', userRouter);
