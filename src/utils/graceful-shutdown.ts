import type { Server } from 'node:http';

import { logger } from './logger.js';

const shutdownTimeoutMs = 10_000;

type CleanupTask = () => Promise<void>;

export const registerGracefulShutdown = (server: Server, cleanupTasks: CleanupTask[] = []) => {
  let isShuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals | 'uncaughtException' | 'unhandledRejection') => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`Received ${signal}. Closing HTTP server.`);

    const forceExitTimer = setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing process exit.');
      process.exit(1);
    }, shutdownTimeoutMs);
    forceExitTimer.unref();

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      await Promise.all(cleanupTasks.map((task) => task()));
      logger.info('Graceful shutdown complete.');
      process.exit(0);
    } catch (error) {
      logger.error('Graceful shutdown failed.', { error });
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection.', { reason });
    void shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception.', { error });
    void shutdown('uncaughtException');
  });
};
