import { z } from 'zod';

const educationEntrySchema = z.object({
  institution: z.string().optional(),
  degree: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
});

const workExperienceEntrySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().optional(),
  address: z.string().optional(),
  education: z.array(educationEntrySchema).optional(),
  workExperience: z.array(workExperienceEntrySchema).optional(),
});

export type CreateCandidateRequestBody = z.infer<typeof createCandidateSchema>;
