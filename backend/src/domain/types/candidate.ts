/**
 * Domain types for Candidate entity and create input.
 * No Prisma or framework coupling.
 */

/** Education record for a candidate. */
export interface EducationEntry {
  institution?: string;
  degree?: string;
  startYear?: number;
  endYear?: number;
}

/** Work experience record for a candidate. */
export interface WorkExperienceEntry {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
}

/** Input DTO for creating a new candidate. */
export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: EducationEntry[];
  workExperience?: WorkExperienceEntry[];
}

/** Resume/CV document metadata as returned in API responses. */
export interface ResumeInfo {
  fileName: string;
  path: string;
  contentType: string;
  size: number;
  createdAt: Date;
}

/** API response shape for a candidate. */
export interface CandidateResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: unknown;
  workExperience: unknown;
  resume?: ResumeInfo | null;
  createdAt: Date;
  updatedAt: Date;
}
