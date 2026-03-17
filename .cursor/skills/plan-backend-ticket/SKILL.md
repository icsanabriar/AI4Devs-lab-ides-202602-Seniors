---
name: plan-backend-ticket
description: Creates a backend implementation plan for a ticket following AGENTS.md and backend-developer agent. Use when planning backend work for a ticket, before implementing a feature, or when the user asks for a backend plan.
---

# Plan Backend Ticket

When the user asks to plan backend work for a ticket (or to create a backend plan), produce an implementation plan and save it as specified below. This skill aligns with [AGENTS.md](../../AGENTS.md) and [.cursor/agents/backend-developer.md](../../.cursor/agents/backend-developer.md).

## When to Apply

- User says they want to "plan the backend" for a ticket or feature
- User references a ticket folder (e.g. `ticket/add-candidate`) and asks for a backend plan
- Before implementing a non-trivial backend change (plan first, then implement)

## Context to Use

Before writing the plan:

1. **AGENTS.md** (repo root): project structure, backend commands, testing guidelines, definition of done
2. **.cursor/agents/backend-developer.md**: workflow, plan structure, save location, TypeScript/Prisma/API rules
3. **ai-specs/specs/backend-standards.mdc**: layered architecture (presentation, application, domain, infrastructure), DDD-inspired design, API and Prisma conventions

If a ticket folder exists (e.g. `ticket/add-candidate`), read the user story and acceptance criteria there to align the plan.

## Plan Contents (Required)

The plan must include:

1. **Problem understanding** – What the ticket asks for; acceptance criteria summarized
2. **Proposed solution** – High-level approach; main components and flow
3. **Affected files** – New or modified files (routes, services, domain, infrastructure, tests)
4. **Database impact** – Schema changes (if any), migrations, risks to data
5. **Risks and edge cases** – Failure scenarios, validation, security, performance considerations

Optionally add: mapping of acceptance criteria to API/behavior, test strategy (unit vs integration), and references to backend-standards (e.g. layer where logic lives).

## Save Location

- **Path:** `ai-specs/changes/{feature_name}/backend.md`
- **feature_name:** Use a short, kebab-case name (e.g. `add-candidate`, `list-candidates`, `export-csv`)
- Create the folder `ai-specs/changes/{feature_name}/` if it does not exist
- **Do NOT overwrite** an existing plan; update or append to it if the plan already exists

## Workflow

1. Identify the feature/ticket name and read ticket content if present (e.g. `ticket/add-candidate/*.md`).
2. Quickly explore backend: `backend/src/`, `backend/prisma/schema.prisma`, existing routes and services.
3. Write the plan using the required sections above. Keep language and style consistent with AGENTS.md (English).
4. Save to `ai-specs/changes/{feature_name}/backend.md`.
5. Confirm to the user the path and a one-line summary of the plan.
6. Append an entry to [prompts.md](../../../prompts.md) with: date (YYYY-MM-DD), context/source `plan-backend-ticket`, and the user's prompt or request. See AGENTS.md for the project rule.

## Plan Template

Use this structure in `backend.md`:

```markdown
# Backend plan: {Feature name}

## Problem understanding
{What the ticket requires; key acceptance criteria}

## Proposed solution
{Approach; layers and main components}

## Affected files
- path/to/file – purpose
- ...

## Database impact
{Schema changes, migrations, data risks or "None"}

## Risks and edge cases
{Validation, errors, security, performance}
```

## Alignment with AGENTS.md and Backend Developer

- **Small steps:** Plan one feature/ticket at a time; split large scope into smaller plans if needed.
- **Testing:** Plan should mention tests (integration/API and unit where appropriate); see AGENTS.md and backend-developer for Jest/supertest.
- **Definition of done:** Plan should be implementable so that after implementation, backend build and tests pass and API changes are reflected in Swagger if applicable.

## Additional resources

- For quick pointers to AGENTS.md, backend-developer, and backend-standards, see [reference.md](reference.md).
