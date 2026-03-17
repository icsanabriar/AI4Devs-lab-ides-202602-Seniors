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

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: unknown;
  workExperience: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateSuccessResponse {
  success: true;
  data: Candidate;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    fields?: Array<{ path: string; message: string }>;
  };
}
