import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { z } from 'zod';

import { ErrorCode } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

type RequestParts = {
  body?: unknown;
  params?: Request['params'];
  query?: Record<string, unknown>;
};

type RequestSchema = z.ZodType<RequestParts>;

export const validateRequest = (schema: RequestSchema): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const requestData: RequestParts = {
      body: req.body as unknown,
      params: req.params,
      query: req.query,
    };

    const result = schema.safeParse(requestData);

    if (!result.success) {
      next(
        new AppError(
          'Request validation failed.',
          HttpStatus.BAD_REQUEST,
          true,
          ErrorCode.VALIDATION_ERROR,
          result.error.flatten(),
        ),
      );
      return;
    }

    if ('body' in result.data) {
      req.body = result.data.body;
    }

    if (result.data.params) {
      req.params = result.data.params;
    }

    if (result.data.query) {
      Object.assign(req.query, result.data.query);
    }

    next();
  };
};
