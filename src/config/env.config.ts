import 'dotenv/config';

import { z } from 'zod';

const developmentJwtSecret = 'development-only-secret-change-me-before-production-32chars';

const booleanFromEnv = z.preprocess((value) => {
  if (value === undefined) return false;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
  return value;
}, z.boolean());

const csv = z
  .string()
  .default('*')
  .transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

const rawEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().url().optional(),
    CORS_ORIGIN: csv,
    CORS_CREDENTIALS: booleanFromEnv.default(false),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long').optional(),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug', 'silent']).default('info'),
    TRUST_PROXY: booleanFromEnv.default(false),
    REQUEST_BODY_LIMIT: z.string().default('1mb'),
    RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(15 * 60 * 1000),
    RATE_LIMIT_LIMIT: z.coerce.number().int().positive().default(100),
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV !== 'production') return;

    if (!value.DATABASE_URL) {
      context.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL is required in production.',
      });
    }

    if (!value.JWT_SECRET) {
      context.addIssue({
        code: 'custom',
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET is required in production.',
      });
    }

    if (value.CORS_ORIGIN.includes('*')) {
      context.addIssue({
        code: 'custom',
        path: ['CORS_ORIGIN'],
        message: 'Wildcard CORS is not allowed in production.',
      });
    }
  });

const parsedEnv = rawEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  JWT_SECRET: parsedEnv.data.JWT_SECRET ?? developmentJwtSecret,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isTest: parsedEnv.data.NODE_ENV === 'test',
};

export type Env = typeof env;
