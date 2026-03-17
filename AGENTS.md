# Repository Guidelines

This is a **React + Express (TypeScript) + Prisma** full-stack application for the **LTI Talent Tracking System**.  
The frontend is built with Create React App, and the backend follows a layered architecture with clear separation between API, business logic, and persistence.

---

## Project Structure

- `backend/`: Node.js/Express API written in TypeScript
  - `src/`: Application source code
  - `prisma/`: Prisma schema and migrations
  - `jest.config.js`, `.eslintrc.js`, `.prettierrc`: Testing and linting configuration

- `frontend/`: React (CRA) client application
  - `src/`: Components, pages, services, and application logic
  - `public/`: Static assets and `index.html`
  - `jest.config.js`: Jest configuration for frontend tests

- `docker-compose.yml`: PostgreSQL service for local development
- `README.md`: Setup, run, and usage instructions

---

## Module Organization

- **Backend**  
  Express API implementing the LTI domain. Uses Prisma for PostgreSQL access and exposes API documentation via Swagger.

- **Frontend**  
  React SPA consuming backend APIs. Runs on port `3000` in development.

---

## Build, Test, and Development Commands

### Database

- Start PostgreSQL: `docker-compose up -d`
- Stop PostgreSQL: `docker-compose down`

### Backend (`backend/`)

- `npm install`: Install dependencies
- `npm run prisma:generate`: Generate Prisma client
- `npm run build`: Compile TypeScript
- `npm run dev`: Start dev server (default port `3010`)
- `npm start`: Run compiled application
- `npm test`: Run Jest tests

Linting and formatting:
- `npx eslint .`
- `npx prettier --check .` or `--write .`

### Frontend (`frontend/`)

- `npm install`: Install dependencies
- `npm start`: Start dev server (port `3000`)
- `npm run build`: Production build
- `npm test`: Run Jest tests

---

## Coding Style & Naming Conventions

- All code, comments, documentation, and commit messages must be in **English**
- Use clear, descriptive naming for variables, functions, and components

### Backend
- Use TypeScript with strict typing
- Follow ESLint and Prettier configurations in `backend/`
- Keep business logic out of controllers (use services)

### Frontend
- Use functional components and hooks
- Prefer TypeScript for new code
- Follow project conventions and `ai-specs/specs` when available

---

## Testing Guidelines

### Backend

- Use **Jest**
- Tests located in `backend/src/tests/`
- Prefer:
  - Integration tests (API level, e.g. with supertest)
  - Unit tests for isolated logic

Before completing backend work:
- Run `npm test`

### Frontend

- Use **Jest + React Testing Library**
- Tests located in `frontend/src/tests/`
- Prefer behavior-driven testing (user interactions over implementation details)

Before completing frontend work:
- Run `npm test`

### Test-First Approach

- When possible, write or update a failing test before implementing the solution

---

## Commit & Pull Request Guidelines

- Prefer **Conventional Commits**:
  - `feat(backend): add user list endpoint`
  - `fix(frontend): correct form validation`

Before pushing:

- Backend:
  - `npm run build`
  - `npm test`
  - lint and format checks pass

- Frontend:
  - `npm run build`
  - `npm test`

Pull Requests must:

- Clearly describe the change
- Reference related tickets or specs
- Highlight API or schema changes if applicable

---

## Agent-Specific Instructions

- Work in **small, incremental steps**
- Avoid large, multi-purpose changes
- Clarify ambiguity before proceeding
- Challenge assumptions when necessary
- Identify repeated patterns for refactoring or documentation

---

## Definition of Done

A task is complete when:

1. Backend builds and tests pass
2. Frontend builds and tests pass
3. Manual verification confirms expected behavior
4. API changes are reflected in Swagger/OpenAPI (if applicable)
5. Relevant documentation is updated if needed

---

## Task-Specific Standards

Refer to the following for detailed rules:

- [Backend Standards](./ai-specs/specs/backend-standards.mdc)  
- [Frontend Standards](./ai-specs/specs/frontend-standards.mdc)  
- [Documentation Standards](./ai-specs/specs/documentation-standards.mdc)