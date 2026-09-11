import type { RequestHandler } from 'express';
import { jwtVerify } from 'jose';

import { env } from '../config/env.config.js';
import { ErrorCode } from '../constants/error-codes.js';
import { HttpStatus } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';
import { catchAsync } from '../utils/catch-async.js';

const secret = new TextEncoder().encode(env.JWT_SECRET);

const getBearerToken = (authorizationHeader: string | undefined): string | undefined => {
  if (!authorizationHeader?.startsWith('Bearer ')) return undefined;
  return authorizationHeader.slice('Bearer '.length).trim();
};

export const authenticate: RequestHandler = catchAsync(async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    throw new AppError(
      'Authentication required.',
      HttpStatus.UNAUTHORIZED,
      true,
      ErrorCode.AUTHENTICATION_REQUIRED,
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    req.user = {
      id: String(payload.sub),
      email: typeof payload.email === 'string' ? payload.email : undefined,
      roles: Array.isArray(payload.roles) ? payload.roles.map(String) : [],
    };

    next();
  } catch {
    throw new AppError(
      'Invalid or expired token.',
      HttpStatus.UNAUTHORIZED,
      true,
      ErrorCode.TOKEN_INVALID,
    );
  }
});
