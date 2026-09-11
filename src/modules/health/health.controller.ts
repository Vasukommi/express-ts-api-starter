import { env } from '../../config/env.config.js';
import { HttpStatus } from '../../constants/http-status.js';
import { getDatabaseHealth } from '../../database/client.js';
import { catchAsync } from '../../utils/catch-async.js';
import { getCorrelationId } from '../../utils/request-context.js';

const startedAt = new Date();

export const healthCheck = catchAsync((_req, res) => {
  res.status(HttpStatus.OK).json({
    status: 'ok',
    correlationId: getCorrelationId(),
    environment: env.NODE_ENV,
    startedAt: startedAt.toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});

export const readinessCheck = catchAsync((_req, res) => {
  const database = getDatabaseHealth();
  const ready = database.connected;

  res.status(ready ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).json({
    status: ready ? 'ready' : 'not_ready',
    correlationId: getCorrelationId(),
    checks: {
      database,
    },
  });
});
