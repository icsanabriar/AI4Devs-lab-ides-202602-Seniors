# Plan Frontend Ticket – Reference

Quick pointers to project configuration used by this skill.

## Must Read When Planning

| Document | Location | Use for |
|----------|----------|--------|
| Repository guidelines | [AGENTS.md](../../AGENTS.md) | Structure, frontend commands, testing, DoD |
| Frontend developer agent | [.cursor/agents/frontend-developer.md](../../.cursor/agents/frontend-developer.md) | Workflow, plan format, save path, React/TS/a11y rules |
| Frontend standards | [ai-specs/specs/frontend-standards.mdc](../../ai-specs/specs/frontend-standards.mdc) | Pages/components/services, styling, state, testing, a11y |

## From AGENTS.md (frontend)

- **Structure:** `frontend/src/` (pages, components, services), `frontend/public/`, tests in `frontend/src/tests/`
- **Commands:** `npm install`, `npm start` (port 3000), `npm run build`, `npm test`
- **Style:** Functional components and hooks; prefer TypeScript; follow project conventions and ai-specs
- **Testing:** Jest + React Testing Library; prefer behavior-driven testing (user interactions); run `npm test` before done
- **Definition of done:** Frontend builds and tests pass; manual verification confirms expected behavior

## From frontend-developer.md

- **Plan location:** `ai-specs/changes/{feature_name}/frontend.md`
- **Plan sections:** Problem understanding, Proposed UI and technical approach, Affected files, State/data flow impact, Risks and edge cases and accessibility considerations
- **Do not overwrite** existing plans carelessly; update or append when appropriate
- **Architecture:** pages, components, hooks, services, routing; follow existing folder and naming conventions

## From frontend-standards.mdc

- **Layout:** `src/pages/` (route-level), `src/components/` (reusable UI), `src/services/` (API), `src/assets/`
- **React:** Functional components only; hooks; composition; small and cohesive components
- **Planning rule:** Non-trivial changes → plan in `ai-specs/changes/{feature_name}/frontend.md` with problem, approach, affected files, state impact, risks and a11y
