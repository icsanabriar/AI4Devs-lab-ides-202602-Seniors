# Backend plan: Add candidate

## Problem understanding

The ticket **add-candidate** (from `ai-specs/tickets/add-candidate/refined.md`) requires the backend to support **registering a new candidate** in the ATS with:

- **Data:** first name, last name, email, phone, address, education, work experience (required fields indicated; email must be valid).
- **Optional CV:** upload in PDF or DOCX, associated with the candidate.

**Acceptance criteria relevant to backend:**

- When the client sends valid data, the server processes the request and the candidate is stored; the API responds with success so the client can show a confirmation message.
- When the client sends invalid data (e.g. missing required fields, invalid email), the server responds with validation errors so the client can show messages next to the fields.
- When the server fails (e.g. DB or internal error), the API returns a clear, safe error message without exposing internal details.

**Out of scope for this plan:** Accessible UI, button visibility, keyboard navigation (frontend). This plan focuses on API, persistence, validation, and error handling.

---

## Proposed solution

### High-level approach

1. **Data model:** Introduce `Candidate` and related entities in Prisma (education and work experience as separate tables or embedded; one place to store CV reference).
2. **API:** Add `POST /candidates` to create a candidate. Support either:
   - **Option A (recommended for MVP):** JSON body for candidate data + optional separate `POST /candidates/:id/documents` (or `POST /candidates/:id/resume`) for file upload, or
   - **Option B:** Single `multipart/form-data` request with fields + file.
3. **Layers (align with backend-standards):**
   - **Presentation:** Controller + route; parse request, call application service, return status and JSON.
   - **Application:** Service orchestrates validation and persistence; validation for required fields and email format (and possibly file type/size when handling upload).
   - **Domain:** Types/DTOs for create candidate input and API responses; no Prisma in domain.
   - **Infrastructure:** Prisma used from a single place (existing pattern or new `prismaClient` in infrastructure); file storage (e.g. local `uploads/` with unique filename, path stored in DB).
4. **Validation:** Validate all inputs (body, and file if applicable). Recommend adding a validation library (e.g. **zod**) for request body and reuse in tests.
5. **Error handling:** Centralized error middleware; consistent JSON shape (`success`, `data` / `error` with `message` and `code`); HTTP 201 on success, 400 for validation, 409 for duplicate email if applicable, 500 for server errors with a generic message.

### Main components and flow

- **POST /candidates** (body: JSON)
  - Controller receives request → validate body (required fields, email format) → call `CandidateService.create(input)` → return 201 + created candidate (or id + message).
- **POST /candidates/:id/resume** (or similar) – optional in same ticket or follow-up
  - Controller receives multipart file → validate type (PDF/DOCX) and size → save file in infrastructure → store path in DB (e.g. `CandidateDocument` or `resumePath` on `Candidate`) → return 201/200.

If the team prefers a single multipart endpoint for “add candidate with optional CV”, the same validation and storage logic applies; the controller would parse multipart and then call the service with parsed fields + file.

---

## Affected files

| Path | Purpose |
|------|--------|
| `backend/prisma/schema.prisma` | Add `Candidate`; add `Education`, `WorkExperience` (or JSON on Candidate); add CV storage (e.g. `CandidateDocument` or `resumePath` on Candidate). |
| `backend/prisma/migrations/` | New migration for new models. |
| `backend/src/domain/` (or `types/`) | DTOs: `CreateCandidateInput`, `CandidateResponse`; optional value types for email. |
| `backend/src/application/services/candidateService.ts` | `create(input)`: validate business rules (e.g. duplicate email), create candidate (and education/experience if normalized), return created entity. |
| `backend/src/application/validation/` or `validator.ts` | Validate request body (required fields, email format); optionally validate file type/size for resume. |
| `backend/src/presentation/controllers/candidateController.ts` | Handle `POST /candidates` (and optionally resume upload); call service; set status and JSON. |
| `backend/src/routes/candidates.ts` (or under `presentation/routes/`) | Mount `POST /candidates` (and optionally resume route). |
| `backend/src/index.ts` | Use `express.json()`, mount candidate routes, mount centralized error middleware. |
| `backend/src/middleware/errorHandler.ts` (or similar) | Map errors to status and consistent `{ success, error: { message, code } }`. |
| `backend/src/tests/` | Integration: `POST /candidates` success, validation failure (missing/invalid), duplicate email (if applicable), server error handling. Unit: service create, validator. |

**New dependencies:** Add a validation library (e.g. `zod`) for request validation.

---

## Database impact

- **Schema changes:**
  - **Candidate:** id, firstName, lastName, email (unique), phone (optional), address (optional), createdAt, updatedAt. Optionally resumePath or resumeFileName if storing a single CV on the entity.
  - **Education:** id, candidateId (FK), institution, degree, startYear, endYear (or similar); or store as JSON on Candidate for a smaller first version.
  - **WorkExperience:** id, candidateId (FK), company, role, startDate, endDate (or similar); or JSON on Candidate.
  - **CV storage:** Either a `CandidateDocument` table (candidateId, type='resume', filePath, originalName, mimeType) or a `resumePath` (and optionally `resumeFileName`) on `Candidate`. The former is better if multiple documents per candidate are expected later.

- **Migrations:** One new migration after schema update. No changes to existing `User` table; no data migration required.

- **Risks:** Ensure unique constraint on `Candidate.email` and handle duplicate-email attempts with a clear API response (e.g. 409 Conflict).

---

## Risks and edge cases

- **Duplicate email:** Reject with 409 (or 400) and a clear message (e.g. “A candidate with this email already exists”); do not expose DB errors.
- **Validation:** Required fields (at least firstName, lastName, email); email format; optional phone, address, education, experience. Return 400 with field-level or list of errors so the frontend can show them next to fields.
- **File upload (if in scope):** Accept only PDF and DOCX; enforce max file size (e.g. 5–10 MB); store with safe, unique filenames; do not execute or trust client-provided paths.
- **Security:** No raw SQL; use Prisma. Validate and sanitize input; avoid mass assignment by mapping only allowed fields into the service. Do not log or return sensitive data.
- **Performance:** Single create with optional nested creates (education, experience) in one transaction; avoid N+1 when returning the created candidate with relations.
- **Errors:** Catch DB and unexpected errors in middleware; respond with a generic 500 message; log details server-side only.

---

## Acceptance criteria → API behaviour

| Criterion | Backend behaviour |
|-----------|-------------------|
| Valid data submitted | 201 Created; body includes created candidate (or id + success message). |
| Invalid data (missing required, invalid email) | 400 Bad Request; body includes error code (e.g. VALIDATION_ERROR) and message/fields. |
| Duplicate email | 409 Conflict (or 400) with clear message. |
| Server/DB error | 500 Internal Server Error; generic message; no stack or internal details. |
| CV upload (if implemented) | Accept PDF/DOCX only; validate size; store file and path; return success or 400 for invalid type/size. |

---

## Test strategy

- **Integration (API):** Use supertest against the Express app. Tests: POST with valid body → 201 and stored data; POST with missing required field → 400; POST with invalid email → 400; POST with duplicate email → 409; simulate DB failure if feasible → 500 and safe message.
- **Unit:** Service: `create` with valid input returns candidate; duplicate email throws or returns error that controller maps to 409. Validator: valid input passes; invalid email or missing fields fail with structured errors.
- **Coverage:** Aim for coverage of new code (validation, service, controller) per project guidelines.

---

## Optional: CV in a second step

If the ticket is split so that “add candidate” is delivered first without file upload, then:

- Implement only `POST /candidates` with JSON and the fields above (education/experience as JSON or normalized tables).
- Add `POST /candidates/:id/resume` (or similar) in a follow-up ticket, with the same validation and storage approach described above.
