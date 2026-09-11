import { env } from '../config/env.config.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

export const connectDatabase = (): Promise<void> => {
  if (!env.DATABASE_URL) {
    logger.warn('DATABASE_URL is not configured. Skipping database connection.');
    return Promise.resolve();
  }

  isConnected = true;
  logger.info('Database connection placeholder initialized.');
  return Promise.resolve();
};

export const closeDatabase = (): Promise<void> => {
  if (!isConnected) return Promise.resolve();

  isConnected = false;
  logger.info('Database connection placeholder closed.');
  return Promise.resolve();
};

export const getDatabaseHealth = () => {
  return {
    configured: Boolean(env.DATABASE_URL),
    connected: isConnected || !env.DATABASE_URL,
  };
};
