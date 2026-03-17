import { Request, Response, NextFunction } from 'express';
import { createCandidateSchema } from '../../application/validation/createCandidateSchema';
import { createCandidate } from '../../application/services/candidateService';
import type { CreateCandidateInput } from '../../domain/types/candidate';

export async function createCandidateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = createCandidateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          fields: parsed.error.flatten().fieldErrors
            ? Object.entries(parsed.error.flatten().fieldErrors).flatMap(([path, messages]) =>
                (messages ?? []).map((message) => ({ path, message }))
              )
            : [],
        },
      });
      return;
    }

    const input: CreateCandidateInput = {
      firstName: parsed.data.firstName.trim(),
      lastName: parsed.data.lastName.trim(),
      email: parsed.data.email.trim(),
      phone: parsed.data.phone?.trim() || undefined,
      address: parsed.data.address?.trim() || undefined,
      education: parsed.data.education,
      workExperience: parsed.data.workExperience,
    };

    const candidate = await createCandidate(input);
    res.status(201).json({
      success: true,
      data: candidate,
      message: 'Candidate has been added successfully',
    });
  } catch (err) {
    next(err);
  }
}
