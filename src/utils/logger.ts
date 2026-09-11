import winston from 'winston';

import { env } from '../config/env.config.js';
import { getRequestContext } from './request-context.js';

const appendRequestContext = winston.format((info) => {
  const context = getRequestContext();

  if (context) {
    info.correlationId = context.correlationId;
    info.requestMethod = context.method;
    info.requestPath = context.path;
  }

  return info;
});

const devFormat = winston.format.combine(
  appendRequestContext(),
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf((info) => {
    const correlationId = typeof info.correlationId === 'string' ? ` [${info.correlationId}]` : '';
    return `${String(info.timestamp)} ${String(info.level)}${correlationId}: ${String(
      info.message,
    )}`;
  }),
);

const productionFormat = winston.format.combine(
  appendRequestContext(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL === 'silent' ? 'error' : env.LOG_LEVEL,
  silent: env.LOG_LEVEL === 'silent' || env.isTest,
  format: env.isProduction ? productionFormat : devFormat,
  transports: [new winston.transports.Console()],
});
