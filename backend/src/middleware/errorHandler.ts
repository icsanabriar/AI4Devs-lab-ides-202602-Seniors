/**
 * Central error-handling middleware: maps known errors to HTTP status and JSON body.
 */
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { DuplicateEmailError, InvalidResumeError, ResumeStorageError, CandidateNotFoundError } from '../application/services/candidateService';

/** Shape of the error object in validation error responses. */
export interface ValidationErrorBody {
  message: string;
  code: string;
  fields?: Array< { path: string; message: string } >;
}

/** Error class for validation failures (400). */
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

/** Type guard for Zod validation errors. */
function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}

/**
 * Express error handler. Sends appropriate status and JSON for ValidationError,
 * ZodError, DuplicateEmailError, and unknown errors.
 * @param err - Caught error (ValidationError, ZodError, or domain errors)
 * @param _req - Express request (unused)
 * @param res - Express response used to send status and JSON
 * @param _next - Express next function (unused)
 */
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

  if (err instanceof InvalidResumeError) {
    res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  if (err instanceof ResumeStorageError) {
    console.error('Resume storage failed:', err.cause ?? err);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to store resume file. Please try again later.',
        code: err.code,
      },
    });
    return;
  }

  if (err instanceof CandidateNotFoundError) {
    res.status(404).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON in request field',
        code: 'VALIDATION_ERROR',
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
