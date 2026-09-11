import { z } from 'zod';

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    name: z.string().trim().min(1).max(120),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
