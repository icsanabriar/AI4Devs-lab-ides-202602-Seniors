/**
 * Client for the candidates API. Handles create candidate and maps errors to CandidateApiError.
 */
import type {
  CreateCandidateInput,
  CreateCandidateSuccessResponse,
  ApiErrorResponse,
} from '../types/candidate';

/** Error thrown when the candidates API returns a non-2xx response. */
export class CandidateApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fields?: Array<{ path: string; message: string }>;

  /**
   * @param message - Error message
   * @param status - HTTP status code
   * @param code - Optional error code from API
   * @param fields - Optional validation field errors
   */
  constructor(
    message: string,
    status: number,
    code?: string,
    fields?: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'CandidateApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

/**
 * Returns the base URL for the backend API from env or default.
 * @returns Base URL (e.g. http://localhost:3010)
 */
const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_URL ?? 'http://localhost:3010';
};

/**
 * Creates a candidate via POST /candidates. Throws CandidateApiError on failure.
 * @param data - Create candidate payload
 * @returns The created candidate from the API
 */
export async function createCandidate(
  data: CreateCandidateInput
): Promise<CreateCandidateSuccessResponse['data']> {
  const url = `${getApiBaseUrl()}/candidates`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = body as ApiErrorResponse;
    throw new CandidateApiError(
      error?.error?.message ?? 'Something went wrong. Please try again.',
      response.status,
      error?.error?.code,
      error?.error?.fields
    );
  }

  const success = body as CreateCandidateSuccessResponse;
  return success.data;
}

/**
 * Uploads a resume for an existing candidate via POST /candidates/:id/resume (multipart/form-data).
 * Throws CandidateApiError on failure.
 * @param candidateId - Created candidate id
 * @param file - File object (e.g. from input type="file")
 * @returns Promise that resolves when the upload succeeds
 */
export async function uploadResume(candidateId: number, file: File): Promise<void> {
  const url = `${getApiBaseUrl()}/candidates/${candidateId}/resume`;
  const formData = new FormData();
  formData.append('resume', file, file.name);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = body as ApiErrorResponse;
    throw new CandidateApiError(
      error?.error?.message ?? 'Resume upload failed. Please try again.',
      response.status,
      error?.error?.code,
      error?.error?.fields
    );
  }
}
