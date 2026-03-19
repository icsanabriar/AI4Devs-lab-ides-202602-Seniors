/**
 * Frontend types for candidate and API request/response shapes.
 */

/** Education entry for a candidate. */
export interface EducationEntry {
  institution?: string;
  degree?: string;
  startYear?: number;
  endYear?: number;
}

/** Work experience entry for a candidate. */
export interface WorkExperienceEntry {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
}

/** Payload for creating a candidate. */
export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: EducationEntry[];
  workExperience?: WorkExperienceEntry[];
}

/** Resume/CV document metadata as returned by the API. */
export interface ResumeInfo {
  fileName: string;
  path: string;
  contentType: string;
  size: number;
  createdAt: string;
}

/** Candidate as returned by the API. */
export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: unknown;
  workExperience: unknown;
  resume?: ResumeInfo | null;
  createdAt: string;
  updatedAt: string;
}

/** Successful create-candidate API response. */
export interface CreateCandidateSuccessResponse {
  success: true;
  data: Candidate;
  message: string;
}

/** Error shape from the API. */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    fields?: Array<{ path: string; message: string }>;
  };
}
