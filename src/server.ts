import { env } from './config/env.config.js';
import { closeDatabase, connectDatabase } from './database/client.js';
import { app } from './app.js';
import { registerGracefulShutdown } from './utils/graceful-shutdown.js';
import { logger } from './utils/logger.js';

await connectDatabase();

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on port ${env.PORT}.`);
});

registerGracefulShutdown(server, [closeDatabase]);
