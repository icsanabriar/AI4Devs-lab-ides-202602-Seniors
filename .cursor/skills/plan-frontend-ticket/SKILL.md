---
name: plan-frontend-ticket
description: Creates a frontend implementation plan for a ticket following AGENTS.md and frontend-developer agent. Use when planning frontend work for a ticket, before implementing a feature, or when the user asks for a frontend plan.
---

# Plan Frontend Ticket

When the user asks to plan frontend work for a ticket (or to create a frontend plan), produce an implementation plan and save it as specified below. This skill aligns with [AGENTS.md](../../../AGENTS.md) and [.cursor/agents/frontend-developer.md](../../agents/frontend-developer.md).

## When to Apply

- User says they want to "plan the frontend" for a ticket or feature
- User references a ticket folder (e.g. `ticket/add-candidate`) and asks for a frontend plan
- Before implementing a non-trivial frontend change (plan first, then implement)

## Context to Use

Before writing the plan:

1. **AGENTS.md** (repo root): project structure, frontend commands, testing guidelines, definition of done
2. **.cursor/agents/frontend-developer.md**: workflow, plan structure, save location, React/TypeScript/accessibility rules
3. **ai-specs/specs/frontend-standards.mdc**: pages/components/services layout, styling, state, testing, accessibility

If a ticket folder exists (e.g. `ticket/add-candidate`), read the user story and acceptance criteria there to align the plan.

## Plan Contents (Required)

The plan must include:

1. **Problem understanding** – What the ticket asks for; acceptance criteria and expected UI behavior summarized
2. **Proposed UI and technical approach** – Screens/components to add or change; state and data flow; key interactions
3. **Affected files** – New or modified files (pages, components, services, hooks, tests)
4. **State/data flow impact** – Where state lives; API calls; loading, error, empty states
5. **Risks, edge cases, and accessibility considerations** – Failure scenarios, validation, a11y (keyboard, labels, focus, semantics)

Optionally add: mapping of acceptance criteria to UI behavior, test strategy (component vs integration), and references to frontend-standards (e.g. existing patterns to reuse).

## Save Location

- **Path:** `ai-specs/changes/{feature_name}/frontend.md`
- **feature_name:** Use a short, kebab-case name (e.g. `add-candidate`, `list-candidates`, `export-csv`)
- Create the folder `ai-specs/changes/{feature_name}/` if it does not exist
- **Do NOT overwrite** an existing plan carelessly; update or append when appropriate

## Workflow

1. Identify the feature/ticket name and read ticket content if present (e.g. `ticket/add-candidate/*.md`).
2. Quickly explore frontend: `frontend/src/` (pages, components, services), routing, existing patterns.
3. Write the plan using the required sections above. Keep language and style consistent with AGENTS.md (English).
4. Save to `ai-specs/changes/{feature_name}/frontend.md`.
5. Confirm to the user the path and a one-line summary of the plan.
6. Append an entry to [prompts.md](../../../prompts.md) with: date (YYYY-MM-DD), context/source `plan-frontend-ticket`, and the user's prompt or request. See AGENTS.md for the project rule.

## Plan Template

Use this structure in `frontend.md`:

```markdown
# Frontend plan: {Feature name}

## Problem understanding
{What the ticket requires; key acceptance criteria and expected UI}

## Proposed UI and technical approach
{Screens/components; state and data flow; main interactions}

## Affected files
- path/to/file – purpose
- ...

## State/data flow impact
{Where state lives; API usage; loading, error, empty states}

## Risks, edge cases, and accessibility
{Validation, errors, a11y: keyboard, labels, focus, semantics}
```

## Alignment with AGENTS.md and Frontend Developer

- **Small steps:** Plan one feature/ticket at a time; split large scope into smaller plans if needed.
- **Testing:** Plan should mention tests (component and interaction tests; Jest + React Testing Library); see AGENTS.md and frontend-developer for behavior-driven testing.
- **Definition of done:** Plan should be implementable so that after implementation, frontend build and tests pass and manual verification confirms expected behavior.

## Additional resources

- For quick pointers to AGENTS.md, frontend-developer, and frontend-standards, see [reference.md](reference.md).
