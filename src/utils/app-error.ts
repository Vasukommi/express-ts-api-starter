import type { ErrorCode } from '../constants/error-codes.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    code: ErrorCode,
    details?: unknown,
  ) {
    super(message);

    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
