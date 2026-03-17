import { createCandidate, DuplicateEmailError } from '../application/services/candidateService';

const mockCreate = jest.fn();
jest.mock('../infrastructure/prismaClient', () => ({
  prisma: {
    candidate: {
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

describe('createCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns candidate when create succeeds', async () => {
    const input = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
    };
    const created = {
      id: 1,
      firstName: input.firstName,
      lastName: input.lastName,
      email: 'jane@example.com',
      phone: null,
      address: null,
      education: null,
      workExperience: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreate.mockResolvedValue(created);

    const result = await createCandidate(input);

    expect(result).toMatchObject({
      id: 1,
      firstName: input.firstName,
      lastName: input.lastName,
      email: 'jane@example.com',
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: input.firstName,
        lastName: input.lastName,
        email: 'jane@example.com',
        phone: null,
        address: null,
      }),
    });
  });

  it('throws DuplicateEmailError when Prisma throws P2002', async () => {
    const input = { firstName: 'A', lastName: 'B', email: 'dup@example.com' };
    const { Prisma } = require('@prisma/client');
    const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: '5.0.0',
    });
    mockCreate.mockRejectedValue(prismaError);

    await expect(createCandidate(input)).rejects.toMatchObject({
      name: 'DuplicateEmailError',
      code: 'DUPLICATE_EMAIL',
    });
  });
});
