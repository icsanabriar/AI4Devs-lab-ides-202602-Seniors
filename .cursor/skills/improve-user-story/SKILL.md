---
name: improve-user-story
description: Improves and refines a user story for clarity, completeness, and testability. Use when the user writes or asks to improve a user story, acceptance criteria, or when refining product backlog items.
---

# Improve User Story

When the user shares a user story (or asks to create/improve one), apply this skill to refine it.

## Standard Format

User stories should follow:

**As a** [role/persona], **I want** [action/capability] **so that** [benefit/value].

- **Role**: who (user type, not "user" unless unavoidable)
- **Action**: what the system or user does (verb + object, testable)
- **Benefit**: why it matters (value, outcome)

Keep the title short; expand context in the description if needed.

## Checklist for Improvement

1. **Clear role**: Specific persona (e.g. "logged-in recruiter", "talent manager") not vague "user".
2. **Single goal**: One capability per story; split if there are multiple "and" or "so that".
3. **Testable action**: The "I want" part is something that can be verified (e.g. "filter candidates by skill" not "see better data").
4. **Real benefit**: "So that" explains the impact; avoid restating the action.
5. **Acceptance criteria**: Present and written as verifiable conditions (Given/When/Then or bullet list with clear pass/fail).

## Acceptance Criteria Rules

- Each criterion is independently testable.
- Use Given/When/Then when it clarifies flow; otherwise use bullet list.
- Avoid implementation detail; focus on observable behavior and outcomes.
- Include edge cases and error behavior when relevant (e.g. empty list, invalid input).

**Template (optional):**

```markdown
Given [context/precondition]
When [action/trigger]
Then [observable outcome]
```

## INVEST Quick Check

Before finalizing, ensure the story is:

- **I**ndependent: Can be developed and delivered without depending on another story.
- **N**egotiable: Details can be discussed; not a fixed contract.
- **V**aluable: Delivers clear value to the role.
- **E**stimable: Team can size it; scope is clear enough.
- **S**mall: Fits in one iteration; can be split if too large.
- **T**estable: Acceptance criteria allow pass/fail verification.

## Output Format

When improving a user story, respond with:

1. **Refined story** in the standard format (title + optional short description).
2. **Acceptance criteria** (Given/When/Then or bullets).
3. **Notes** (optional): what was changed and why, or suggestions (e.g. split into two stories, clarify role).

Keep the improved story in the same language as the user's input (e.g. Spanish if they wrote in Spanish).

## Save location (this project)

**Save the improved user story under** `ai-specs/tickets/`.

- The output file must be named **`refined.md`**.
- When the ticket or feature has a name (e.g. add-candidate), use a subfolder: `ai-specs/tickets/{ticket_name}/` and write the file there (e.g. `ai-specs/tickets/add-candidate/refined.md`).
- When there is no specific ticket name, save as `ai-specs/tickets/refined.md` or `ai-specs/tickets/{descriptive-name}/refined.md`.
- Create any folder that does not exist.
- Write the refined story, acceptance criteria, and notes into the single markdown file `refined.md`; then confirm the path to the user.

## Prompt logging

After applying this skill, append an entry to [prompts.md](../../../prompts.md) with: date (YYYY-MM-DD), context/source `improve-user-story`, and the user's prompt or request (exact or summarized). See AGENTS.md for the project rule.

## Examples

**Before (vague):**
"As a user I want to manage candidates so that everything works better."

**After:**
- **Title:** As a **recruiter**, I want to **filter candidates by skill and seniority** so that **I can quickly find matches for open positions**.
- **Acceptance criteria:**
  - Given I am on the candidates list, when I set "Skill: React" and "Seniority: Senior", then only candidates with React and Senior level are shown.
  - Given no candidates match the filters, when I apply filters, then I see an empty state message and the filter values remain visible.
- **Notes:** Role and action were made specific; benefit explains the outcome. Two criteria cover happy path and empty result.

## Additional resources

- For more examples and a copy-paste template, see [examples.md](examples.md).

---

**Before (no benefit):**
"As a manager I want to export a report."

**After:**
- **Title:** As a **talent manager**, I want to **export the current candidate list to CSV** so that **I can share it with hiring stakeholders or use it in spreadsheets**.
- **Acceptance criteria:**
  - Given I have the candidate list open, when I click "Export CSV", then a file downloads with columns: name, email, skills, seniority, last update.
  - Given the list is empty, when I click "Export CSV", then I see a message "No data to export" and no file is downloaded.
- **Notes:** Added a clear "so that"; criteria cover content and empty state.
