/**
 * Candidate application service: creates candidates and maps persistence to domain response.
 */
import { prisma } from '../../infrastructure/prismaClient';
import { saveResume, deleteResumeFile, ALLOWED_RESUME_CONTENT_TYPES, MAX_RESUME_SIZE_BYTES } from '../../infrastructure/fileStorage';
import type { CreateCandidateInput, CandidateResponse, ResumeInfo } from '../../domain/types/candidate';
import { Prisma } from '@prisma/client';

/** Error code when candidate email already exists. */
const DUPLICATE_EMAIL_CODE = 'DUPLICATE_EMAIL';
/** Error code when resume file validation or storage fails. */
const INVALID_RESUME_CODE = 'INVALID_RESUME';

/** Thrown when attempting to create a candidate with an email that already exists. */
export class DuplicateEmailError extends Error {
  readonly code = DUPLICATE_EMAIL_CODE;
  constructor() {
    super('A candidate with this email already exists');
    this.name = 'DuplicateEmailError';
  }
}

/** Thrown when resume file validation fails (type, size, or storage). */
export class InvalidResumeError extends Error {
  readonly code = INVALID_RESUME_CODE;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidResumeError';
  }
}

/** Error code when candidate id is not found. */
const CANDIDATE_NOT_FOUND_CODE = 'CANDIDATE_NOT_FOUND';

/** Thrown when a candidate by id is not found. */
export class CandidateNotFoundError extends Error {
  readonly code = CANDIDATE_NOT_FOUND_CODE;
  constructor(candidateId: number) {
    super(`Candidate with id ${candidateId} not found`);
    this.name = 'CandidateNotFoundError';
  }
}

/**
 * Maps a Prisma candidate row (with optional documents) to the API response shape.
 * @param row - Raw candidate from the database
 * @param document - Optional first resume document
 * @returns CandidateResponse for the API
 */
function toCandidateResponse(
  row: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    address: string | null;
    education: unknown;
    workExperience: unknown;
    createdAt: Date;
    updatedAt: Date;
  },
  document?: { fileName: string; path: string; contentType: string; size: number; createdAt: Date } | null
): CandidateResponse {
  const resume: ResumeInfo | null | undefined = document
    ? {
        fileName: document.fileName,
        path: document.path,
        contentType: document.contentType,
        size: document.size,
        createdAt: document.createdAt,
      }
    : undefined;
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    education: row.education,
    workExperience: row.workExperience,
    resume: resume ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Validates resume file contentType and size. Throws InvalidResumeError if invalid. */
function validateResumeFile(contentType: string, size: number): void {
  if (!ALLOWED_RESUME_CONTENT_TYPES.includes(contentType as (typeof ALLOWED_RESUME_CONTENT_TYPES)[number])) {
    throw new InvalidResumeError(
      'Resume must be PDF or DOCX (application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document)'
    );
  }
  if (size > MAX_RESUME_SIZE_BYTES) {
    throw new InvalidResumeError(`Resume size must not exceed ${MAX_RESUME_SIZE_BYTES / (1024 * 1024)}MB`);
  }
}

export interface CreateCandidateFileInput {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Creates a new candidate, optionally with a resume file. Uses a transaction so candidate and
 * document are created together. Throws DuplicateEmailError if email exists, InvalidResumeError
 * if file validation fails.
 * @param input - Validated create candidate input
 * @param file - Optional uploaded resume (validated and stored)
 * @returns The created candidate as API response
 */
export async function createCandidate(
  input: CreateCandidateInput,
  file?: CreateCandidateFileInput
): Promise<CandidateResponse> {
  let savedPath: string | null = null;

  if (file) {
    validateResumeFile(file.mimetype, file.size);
    try {
      savedPath = await saveResume(file.buffer, file.mimetype, file.originalname);
    } catch (err) {
      throw new InvalidResumeError('Failed to store resume file. Please try again.');
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const c = await tx.candidate.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email.trim().toLowerCase(),
          phone: input.phone ?? null,
          address: input.address ?? null,
          education: input.education ? (input.education as object) : undefined,
          workExperience: input.workExperience ? (input.workExperience as object) : undefined,
        },
      });

      if (file && savedPath) {
        await tx.candidateDocument.create({
          data: {
            candidateId: c.id,
            fileName: file.originalname,
            path: savedPath,
            contentType: file.mimetype,
            size: file.size,
          },
        });
        const withDoc = await tx.candidate.findUnique({
          where: { id: c.id },
          include: { documents: { take: 1, orderBy: { createdAt: 'desc' } } },
        });
        return { candidate: withDoc ?? c, doc: (withDoc?.documents ?? [])[0] };
      }
      return { candidate: c, doc: undefined };
    });

    return toCandidateResponse(result.candidate, result.doc);
  } catch (err) {
    if (savedPath) {
      await deleteResumeFile(savedPath).catch(() => {});
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new DuplicateEmailError();
    }
    throw err;
  }
}

/**
 * Uploads a resume for an existing candidate. Throws CandidateNotFoundError if candidate
 * does not exist, InvalidResumeError if file validation or storage fails.
 * @param candidateId - Existing candidate id
 * @param file - Resume file (validated and stored)
 */
export async function uploadResume(
  candidateId: number,
  file: CreateCandidateFileInput
): Promise<void> {
  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) {
    throw new CandidateNotFoundError(candidateId);
  }
  validateResumeFile(file.mimetype, file.size);
  let savedPath: string | null = null;
  try {
    savedPath = await saveResume(file.buffer, file.mimetype, file.originalname);
    await prisma.candidateDocument.create({
      data: {
        candidateId,
        fileName: file.originalname,
        path: savedPath,
        contentType: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    if (savedPath) {
      await deleteResumeFile(savedPath).catch(() => {});
    }
    if (err instanceof InvalidResumeError) {
      throw err;
    }
    throw new InvalidResumeError('Failed to store resume file. Please try again.');
  }
}
