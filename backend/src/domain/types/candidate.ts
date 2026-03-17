/**
 * Domain types for Candidate entity and create input.
 * No Prisma or framework coupling.
 */

export interface EducationEntry {
  institution?: string;
  degree?: string;
  startYear?: number;
  endYear?: number;
}

export interface WorkExperienceEntry {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: EducationEntry[];
  workExperience?: WorkExperienceEntry[];
}

export interface CandidateResponse {
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
}
