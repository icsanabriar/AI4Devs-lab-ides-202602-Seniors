# Frontend plan: Add candidate

## Problem understanding

The ticket **add-candidate** (from `ai-specs/tickets/add-candidate/refined.md`) requires the frontend to support **recruiters adding a new candidate** to the ATS. Summary of acceptance criteria and expected UI:

1. **Access:** The recruiter dashboard (or main page) must show a clearly visible button or link to add a new candidate.
2. **Form:** When the user chooses to add a candidate, a form is shown with fields: first name, last name, email, phone, address, education, work experience; required fields must be indicated.
3. **Validation:** If the user submits with empty required fields or invalid email, show error messages next to the affected fields and do not send the request. If data is valid, send the request to the server.
4. **CV upload:** The user can optionally attach a file (PDF or DOCX); after selection, the file is shown as attached until submit.
5. **Success:** After a successful server response, show a confirmation message that the candidate was added.
6. **Errors:** If the server returns an error (e.g. connection failure, 500), show a clear, non-technical message to the user.
7. **Accessibility and compatibility:** The add-candidate entry and form must work on common desktop and mobile browsers, with keyboard navigation and labels for form controls.

**Out of scope for this plan:** Backend implementation (see `ai-specs/changes/add-candidate/backend.md`). This plan assumes `POST /candidates` (and optionally resume upload) exists and follows the backend contract.

---

## Proposed UI and technical approach

### Screens and components

- **Recruiter dashboard (or home) page**  
  - Entry point for recruiters. Includes a prominent **“Add candidate”** button or link that navigates to the add-candidate form. This satisfies the “clearly visible” criterion.

- **Add candidate page**  
  - Route (e.g. `/candidates/new` or `/add-candidate`). Renders the add-candidate form and handles submit, loading, success, and error states.

- **Add candidate form**  
  - Controlled form with:
    - **Required:** first name, last name, email (with format validation).
    - **Optional:** phone, address, education, work experience (implementation can use text areas or structured inputs per design; ensure labels and required indicators).
  - Optional **CV upload:** file input accepting PDF/DOCX only; after selection, show the chosen file name (and optionally clear control). File is sent with the candidate (multipart) or in a follow-up request (e.g. after create) depending on backend API.
  - **Submit** button. Disabled or non-submitting when required fields are empty or email is invalid; during submit show loading state (e.g. disabled button + “Saving…”).
  - **Field-level errors:** Inline or next to each invalid field (required missing, invalid email). **Global error:** Display server error or duplicate-email message above or below the form.

- **Success state**  
  - After 201: show a clear confirmation message (e.g. “Candidate has been added successfully”) and optionally redirect to dashboard or candidate list, or reset form for another candidate.

- **Error state**  
  - On 400: map server validation errors to field-level messages when the API returns them; otherwise show a single validation message.
  - On 409: show a dedicated message (e.g. “A candidate with this email already exists”).
  - On 500 / network error: show a generic message (e.g. “Something went wrong. Please try again.”) without technical details.

### State and data flow

- **Form state:** Single object holding all field values (firstName, lastName, email, phone, address, education, workExperience); optional state for the selected CV file (e.g. `File | null` and displayed name).
- **UI state:** `submitting` (boolean), `successMessage` (string | null), `errorMessage` (string | null), and optionally `fieldErrors` (map of field name to message) for server-returned validation.
- **Flow:** User fills form → (optional) selects file → clicks Submit → client-side validation runs; if invalid, set field errors and do not call API. If valid, set `submitting = true`, clear previous errors, call `POST /candidates` (with JSON or multipart per API). On success: set success message, clear form/errors, optionally redirect. On failure: set `errorMessage` or `fieldErrors` from response, set `submitting = false`.

### Key interactions

- **Navigation:** From dashboard, click “Add candidate” → navigate to add-candidate page (e.g. `useNavigate` or `<Link>`).
- **Validation:** On submit (and optionally on blur for email), validate required fields and email format; show errors next to fields; prevent submit if invalid.
- **File:** On file input change, validate type (PDF/DOCX); if invalid, show message and clear selection; if valid, keep file and show name.
- **Submit:** One-shot create (JSON or multipart). If backend uses a two-step flow (create then upload resume), after 201 call the resume endpoint with the returned candidate id and the file.

### Dependencies and stack

- **Routing:** Add **react-router-dom** so the dashboard and add-candidate page have distinct routes.
- **HTTP:** Add **axios** (or use `fetch`) and centralize API base URL (e.g. env); implement a small **candidate service** (e.g. `createCandidate`, optionally `uploadResume`) in `src/services/`.
- **UI:** Use existing CSS or add **React Bootstrap** if the project adopts it for consistency; ensure responsive layout and visible focus states. Follow existing patterns in the repo once they exist.

---

## Affected files

| Path | Purpose |
|------|--------|
| `frontend/src/App.tsx` | Add React Router; define routes for dashboard (e.g. `/`) and add-candidate (e.g. `/candidates/new`). |
| `frontend/src/pages/RecruiterDashboard.tsx` (or `Home.tsx`) | Recruiter main page with visible “Add candidate” button/link linking to add-candidate route. |
| `frontend/src/pages/AddCandidatePage.tsx` | Page that renders the add-candidate form and handles success/error/loading. |
| `frontend/src/components/AddCandidateForm.tsx` | Form UI: fields, required indicators, file input for CV, submit button, field-level and global error display. |
| `frontend/src/services/candidateService.ts` | `createCandidate(data)` (and optionally `uploadResume(candidateId, file)`); call backend; return typed response or throw with status/body for error handling. |
| `frontend/src/types/candidate.ts` (or under `types/`) | Types: `CreateCandidateInput`, `Candidate`, and any shared shapes used by the form and service. |
| `frontend/src/index.tsx` | Wrap app with `BrowserRouter` if router is mounted at root (or keep router inside `App.tsx`). |
| `frontend/src/tests/` | Tests for: RecruiterDashboard (add candidate link visible); AddCandidateForm (validation, submit, success/error messages, file type); AddCandidatePage (integration: submit flow, error display). Use Jest + React Testing Library; prefer behavior and accessibility where relevant. |

**New dependencies (recommended):** `react-router-dom`, `axios` (or rely on `fetch`). Optionally `react-bootstrap` if the team adopts it.

---

## State / data flow impact

- **Where state lives:** Form state and UI state (submitting, success, error, field errors) live in the Add candidate page or in a custom hook (e.g. `useAddCandidateForm`) used by that page. No global store required for this feature unless the project already uses one for similar flows.
- **API usage:** One primary call: `POST /candidates` with JSON body (or multipart with file). Optional second call: `POST /candidates/:id/resume` after create if backend uses two-step upload.
- **Loading:** Show submitting state (disabled submit button, “Saving…” or spinner) so the user cannot double-submit.
- **Error:** Display server validation errors next to fields when the API returns them; otherwise show a single error message. Clear errors when the user edits the form or submits again.
- **Success:** Show confirmation message; optionally clear form and/or redirect. Do not leave success message visible indefinitely (e.g. clear on navigation or after a short delay).

---

## Risks, edge cases, and accessibility

### Validation and errors

- **Client-side:** Validate required fields and email format before submit. Do not send the request if invalid; show which fields are missing or invalid.
- **Server-side:** If the API returns 400 with field-level errors, map them to the form and show next to the right fields. If the API returns a single message, show it as a global error.
- **Duplicate email (409):** Show a clear, user-friendly message (e.g. “A candidate with this email already exists”); do not expose internal codes.
- **Network / 500:** Show a generic message; do not expose stack traces or server details. Consider offering “Try again” (e.g. re-enable form and clear error on retry).

### File upload

- **Type:** Accept only PDF and DOCX; if the user selects another type, show an error and clear the file (or prevent selection via `accept` and still validate).
- **Size:** If the backend enforces a max size, the frontend can optionally validate before submit and show a message to avoid a round-trip.

### Accessibility

- **Labels:** Every form control has an associated visible label (or `aria-label` where appropriate). Required fields are indicated (e.g. “Required” or asterisk) and optionally `aria-required="true"`.
- **Keyboard:** Full keyboard navigation (tab through fields and buttons; submit with Enter in form). Focus management: after success, move focus to the confirmation message or back to the first field if form is reset.
- **Semantics:** Use `<form>`, `<label>`, `<input>`, `<button>`; use `type="submit"` for the submit button. Use `role="alert"` or a live region for success and error messages so screen readers announce them.
- **Focus visibility:** Do not remove focus outlines; ensure focus is visible for all interactive elements.
- **Compatibility:** Test on at least one desktop and one mobile browser; ensure the add-candidate link and form are usable with keyboard only.

### Edge cases

- **Double submit:** Disable submit button and set `submitting` while the request is in flight.
- **Navigate away during submit:** Optionally guard with “Unsaved changes” or allow navigation and abort the request if the component unmounts (e.g. abort controller or ignore setState after unmount).
- **Very long input:** Rely on backend limits; optional client-side max length for text fields to avoid huge payloads.

---

## Acceptance criteria → UI behaviour

| Criterion | UI behaviour |
|-----------|--------------|
| 1. Access to function | Recruiter dashboard (or home) shows a visible “Add candidate” button/link that navigates to the add-candidate form. |
| 2. Form with fields | Add-candidate page shows a form with first name, last name, email, phone, address, education, work experience; required fields are indicated. |
| 3. Validation | On submit with invalid or missing data, show errors next to fields and do not send. With valid data, send the request. |
| 4. CV upload | User can select a PDF or DOCX file; selected file is shown as attached until submit (or until cleared). |
| 5. Success confirmation | After successful response, show a clear success message (e.g. “Candidate has been added successfully”). |
| 6. Error handling | On server/network error, show a clear, non-technical message. |
| 7. Accessibility and compatibility | Form and add-candidate entry are keyboard-navigable, labeled, and work on common desktop and mobile browsers. |

---

## Test strategy

- **Component / page tests (Jest + RTL):**
  - RecruiterDashboard: Renders “Add candidate” link/button; click navigates to add-candidate route (or has correct `href`).
  - AddCandidateForm: Renders all fields and submit button; submit with empty required fields shows errors and does not call API; submit with invalid email shows error; submit with valid data calls service and shows success (or passes success state up); server error shows error message; file input accepts PDF/DOCX and shows file name; optional: reject non-PDF/DOCX and show message.
  - AddCandidatePage: Integrates form and service; mocks service to simulate success and failure; asserts success message and error message display.
- **Accessibility:** Where feasible, assert that fields have labels and that error/success messages are exposed (e.g. by role or text). Prefer behavior-focused tests over implementation details.
- **E2E (optional):** If Cypress (or similar) is in use, add a flow: open dashboard → click Add candidate → fill form → submit → see success (or error) message.

---

## Optional: Split or follow-up

- If the team splits the ticket (e.g. “add candidate” without CV first), implement the form and POST without file upload; add the CV upload in a follow-up when the backend supports it.
- Autocomplete for education/experience from existing data is out of scope for this plan and can be a later improvement.
