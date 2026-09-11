import type { HelmetOptions } from 'helmet';

import { env } from './env.config.js';

export const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: env.isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false,
};
