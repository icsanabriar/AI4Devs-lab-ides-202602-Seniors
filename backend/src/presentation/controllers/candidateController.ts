/**
 * HTTP controller for candidate-related endpoints.
 */
import { Request, Response, NextFunction } from 'express';
import { createCandidateSchema } from '../../application/validation/createCandidateSchema';
import { createCandidate, uploadResume as uploadResumeService } from '../../application/services/candidateService';
import type { CreateCandidateInput } from '../../domain/types/candidate';

/**
 * Parses a value as JSON if it is a non-empty string; otherwise returns undefined. Throws on parse error.
 * @param value - Raw value (string, object, or undefined)
 * @returns Parsed object or undefined
 */
function parseOptionalJson(value: unknown): unknown {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value) as unknown;
  } catch (err) {
    throw err;
  }
}

/**
 * Normalizes request body for validation. For multipart, fields are strings and
 * education/workExperience may be JSON strings.
 * @param body - Raw request body
 * @returns Normalized body with parsed education/workExperience when present
 */
function normalizeBody(body: Record<string, unknown>): Record<string, unknown> {
  return {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    address: body.address,
    education: parseOptionalJson(body.education),
    workExperience: parseOptionalJson(body.workExperience),
  };
}

/**
 * Handles POST /candidates: accepts JSON or multipart/form-data. Validates body (and optional
 * resume file), creates candidate (and document when file present), returns 201 or error.
 * @param req - Express request (body and optional req.file)
 * @param res - Express response
 * @param next - Express next (for error handling)
 */
export async function createCandidateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const rawBody = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const body = normalizeBody(rawBody as Record<string, unknown>);
    const parsed = createCandidateSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          fields: parsed.error.flatten().fieldErrors
            ? Object.entries(parsed.error.flatten().fieldErrors).flatMap(([path, messages]) =>
                (messages ?? []).map((message) => ({ path, message }))
              )
            : [],
        },
      });
      return;
    }

    const input: CreateCandidateInput = {
      firstName: parsed.data.firstName.trim(),
      lastName: parsed.data.lastName.trim(),
      email: parsed.data.email.trim(),
      phone: parsed.data.phone?.trim() || undefined,
      address: parsed.data.address?.trim() || undefined,
      education: parsed.data.education,
      workExperience: parsed.data.workExperience,
    };

    const file =
      req.file &&
      req.file.buffer &&
      req.file.mimetype &&
      typeof req.file.size === 'number'
        ? {
            buffer: req.file.buffer,
            originalname: req.file.originalname ?? 'resume',
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : undefined;

    const candidate = await createCandidate(input, file);
    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Candidate has been added successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles POST /candidates/:id/resume: accepts multipart with "resume" file. Validates and stores
 * the file, creates CandidateDocument for the candidate. Returns 200 or error.
 * @param req - Express request (params.id and req.file)
 * @param res - Express response
 * @param next - Express next (for error handling)
 */
export async function uploadResumeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid candidate id', code: 'VALIDATION_ERROR' },
      });
      return;
    }
    if (!req.file?.buffer || !req.file.mimetype || typeof req.file.size !== 'number') {
      res.status(400).json({
        success: false,
        error: { message: 'Resume file is required', code: 'VALIDATION_ERROR' },
      });
      return;
    }
    const file = {
      buffer: req.file.buffer,
      originalname: req.file.originalname ?? 'resume',
      mimetype: req.file.mimetype,
      size: req.file.size,
    };
    await uploadResumeService(id, file);
    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
}
