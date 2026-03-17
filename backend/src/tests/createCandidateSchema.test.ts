import { createCandidateSchema } from '../application/validation/createCandidateSchema';

describe('createCandidateSchema', () => {
  it('accepts valid minimal input', () => {
    const result = createCandidateSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts full input with optional fields', () => {
    const result = createCandidateSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '+123',
      address: 'Somewhere',
      education: [{ institution: 'U', degree: 'BS' }],
      workExperience: [{ company: 'C', role: 'R' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty firstName', () => {
    const result = createCandidateSchema.safeParse({
      firstName: '',
      lastName: 'Doe',
      email: 'j@x.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = createCandidateSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = createCandidateSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });
});
