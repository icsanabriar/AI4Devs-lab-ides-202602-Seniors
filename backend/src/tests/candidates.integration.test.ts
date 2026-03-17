import request from 'supertest';
import { app } from '../app';
import { prisma } from '../infrastructure/prismaClient';

// Integration tests require a running PostgreSQL (e.g. docker-compose up -d).
const validCandidate = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '+1234567890',
  address: '123 Main St',
  education: [{ institution: 'University', degree: 'BS' }],
  workExperience: [{ company: 'Acme', role: 'Engineer' }],
};

let dbConnected = false;

describe('POST /candidates', () => {
  beforeAll(async () => {
    try {
      await prisma.$connect();
      dbConnected = true;
    } catch {
      dbConnected = false;
    }
  });

  beforeEach(async () => {
    if (!dbConnected) return;
    await prisma.candidate.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns 201 and created candidate when body is valid', async () => {
    if (!dbConnected) return;
    const response = await request(app)
      .post('/candidates')
      .send(validCandidate)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      firstName: validCandidate.firstName,
      lastName: validCandidate.lastName,
      email: validCandidate.email,
      phone: validCandidate.phone,
      address: validCandidate.address,
    });
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.createdAt).toBeDefined();
    expect(response.body.message).toContain('added successfully');
  });

  it('returns 400 when firstName is missing', async () => {
    if (!dbConnected) return;
    const response = await request(app)
      .post('/candidates')
      .send({
        lastName: 'Doe',
        email: 'a@b.com',
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.message).toBeDefined();
  });

  it('returns 400 when email is invalid', async () => {
    if (!dbConnected) return;
    const response = await request(app)
      .post('/candidates')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'not-an-email',
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 409 when email already exists', async () => {
    if (!dbConnected) return;
    await request(app).post('/candidates').send(validCandidate).set('Content-Type', 'application/json');

    const response = await request(app)
      .post('/candidates')
      .send({
        firstName: 'Other',
        lastName: 'User',
        email: validCandidate.email,
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
    expect(response.body.error.message).toContain('already exists');
  });

  it('accepts minimal valid body (required fields only)', async () => {
    if (!dbConnected) return;
    const response = await request(app)
      .post('/candidates')
      .send({
        firstName: 'Min',
        lastName: 'Only',
        email: 'min.only@example.com',
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.data.firstName).toBe('Min');
    expect(response.body.data.lastName).toBe('Only');
    expect(response.body.data.email).toBe('min.only@example.com');
    expect(response.body.data.phone).toBeNull();
    expect(response.body.data.address).toBeNull();
  });

  it('returns 201 and candidate with resume when multipart includes valid PDF', async () => {
    if (!dbConnected) return;
    const pdfBuffer = Buffer.from('%PDF-1.4 minimal', 'utf-8');
    const response = await request(app)
      .post('/candidates')
      .field('firstName', 'With')
      .field('lastName', 'Resume')
      .field('email', 'with.resume@example.com')
      .attach('resume', pdfBuffer, { filename: 'resume.pdf', contentType: 'application/pdf' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      firstName: 'With',
      lastName: 'Resume',
      email: 'with.resume@example.com',
    });
    expect(response.body.data.resume).toBeDefined();
    expect(response.body.data.resume.fileName).toBe('resume.pdf');
    expect(response.body.data.resume.contentType).toBe('application/pdf');
    expect(response.body.data.resume.size).toBe(pdfBuffer.length);
  });

  it('returns 400 INVALID_RESUME when resume has disallowed content type', async () => {
    if (!dbConnected) return;
    const textBuffer = Buffer.from('not a pdf', 'utf-8');
    const response = await request(app)
      .post('/candidates')
      .field('firstName', 'Bad')
      .field('lastName', 'File')
      .field('email', 'bad.file@example.com')
      .attach('resume', textBuffer, { filename: 'file.txt', contentType: 'text/plain' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_RESUME');
  });
});
