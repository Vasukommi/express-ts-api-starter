import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate-request.middleware.js';
import { createUser, getCurrentUser, getUser, listUsers } from './user.controller.js';
import { createUserSchema, getUserSchema } from './user.validation.js';

export const userRouter = Router();

userRouter.get('/', listUsers);
userRouter.post('/', validateRequest(createUserSchema), createUser);
userRouter.get('/me', authenticate, getCurrentUser);
userRouter.get('/:id', validateRequest(getUserSchema), getUser);
