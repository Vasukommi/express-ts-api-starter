import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { runWithRequestContext } from '../utils/request-context.js';

const safeCorrelationIdPattern = /^[a-zA-Z0-9._:-]{1,128}$/;

const getHeaderValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incomingCorrelationId = getHeaderValue(req.headers['x-correlation-id']);
  const correlationId =
    incomingCorrelationId && safeCorrelationIdPattern.test(incomingCorrelationId)
      ? incomingCorrelationId
      : uuidv4();

  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  runWithRequestContext(
    {
      correlationId,
      method: req.method,
      path: req.originalUrl,
      startedAt: Date.now(),
    },
    next,
  );
};
