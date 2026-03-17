import { prisma } from '../../infrastructure/prismaClient';
import type { CreateCandidateInput, CandidateResponse } from '../../domain/types/candidate';
import { Prisma } from '@prisma/client';

const DUPLICATE_EMAIL_CODE = 'DUPLICATE_EMAIL';

export class DuplicateEmailError extends Error {
  readonly code = DUPLICATE_EMAIL_CODE;
  constructor() {
    super('A candidate with this email already exists');
    this.name = 'DuplicateEmailError';
  }
}

function toCandidateResponse(row: {
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
}): CandidateResponse {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    education: row.education,
    workExperience: row.workExperience,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createCandidate(input: CreateCandidateInput): Promise<CandidateResponse> {
  try {
    const candidate = await prisma.candidate.create({
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
    return toCandidateResponse(candidate);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new DuplicateEmailError();
    }
    throw err;
  }
}
