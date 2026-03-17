/**
 * Zod schema and inferred type for the create-candidate request body.
 */
import { z } from 'zod';

/** Zod schema for a single education entry in the request body. */
const educationEntrySchema = z.object({
  institution: z.string().optional(),
  degree: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
});

/** Zod schema for a single work experience entry in the request body. */
const workExperienceEntrySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/** Zod schema for validating POST /candidates request body. */
export const createCandidateSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().optional(),
  address: z.string().optional(),
  education: z.array(educationEntrySchema).optional(),
  workExperience: z.array(workExperienceEntrySchema).optional(),
});

/** Inferred TypeScript type from createCandidateSchema. */
export type CreateCandidateRequestBody = z.infer<typeof createCandidateSchema>;
