# Plan Backend Ticket – Reference

Quick pointers to project configuration used by this skill.

## Must Read When Planning

| Document | Location | Use for |
|----------|----------|--------|
| Repository guidelines | [AGENTS.md](../../AGENTS.md) | Structure, backend commands, testing, DoD |
| Backend developer agent | [.cursor/agents/backend-developer.md](../../.cursor/agents/backend-developer.md) | Workflow, plan format, save path, TS/Prisma/API rules |
| Backend standards | [ai-specs/specs/backend-standards.mdc](../../ai-specs/specs/backend-standards.mdc) | Layers, DDD, REST, Prisma, validation |

## From AGENTS.md (backend)

- **Structure:** `backend/src/`, `backend/prisma/`, tests in `backend/src/tests/`
- **Commands:** `npm run prisma:generate`, `npm run build`, `npm test`, `npx eslint .`, `npx prettier --check .`
- **Style:** TypeScript strict, business logic in services (not controllers), English only
- **Testing:** Jest; prefer integration (API) and unit tests; run `npm test` before done
- **Definition of done:** Backend builds and tests pass; API changes in Swagger if applicable

## From backend-developer.md

- **Plan location:** `ai-specs/changes/{feature_name}/backend.md`
- **Plan sections:** Problem understanding, Proposed solution, Affected files, Database impact, Risks and edge cases
- **Do not overwrite** existing plans; update or append
- **Architecture:** routes/controllers, services, repositories (optional), prisma, middlewares, types, tests

## From backend-standards.mdc

- **Layers:** presentation (controllers), application (services, validation), domain (entities, repository contracts), infrastructure (Prisma, repositories)
- **API:** REST resource-style; consistent success/error JSON; 200, 201, 400, 401, 403, 404, 409, 500
- **Prisma:** migrations for schema changes; avoid N+1; use select/include appropriately
