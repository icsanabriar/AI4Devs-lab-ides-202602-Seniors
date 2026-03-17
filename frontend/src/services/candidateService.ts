import type {
  CreateCandidateInput,
  CreateCandidateSuccessResponse,
  ApiErrorResponse,
} from '../types/candidate';

export class CandidateApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fields?: Array<{ path: string; message: string }>;

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

const getApiBaseUrl = (): string => {
  return process.env.REACT_APP_API_URL ?? 'http://localhost:3010';
};

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
