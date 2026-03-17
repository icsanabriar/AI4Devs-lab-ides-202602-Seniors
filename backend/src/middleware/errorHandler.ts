import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { DuplicateEmailError } from '../application/services/candidateService';

export interface ValidationErrorBody {
  message: string;
  code: string;
  fields?: Array< { path: string; message: string } >;
}

export class ValidationError extends Error {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly fields: Array<{ path: string; message: string }>;

  constructor(message: string, fields: Array<{ path: string; message: string }> = []) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err.fields.length > 0 && { fields: err.fields }),
      },
    });
    return;
  }

  if (isZodError(err)) {
    const fields = err.flatten().fieldErrors;
    const fieldList = Object.entries(fields).flatMap(([path, messages]) =>
      (messages ?? []).map((message) => ({ path, message }))
    );
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fields: fieldList,
      },
    });
    return;
  }

  if (err instanceof DuplicateEmailError) {
    res.status(409).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      message: 'An unexpected error occurred. Please try again later.',
      code: 'INTERNAL_ERROR',
    },
  });
}
