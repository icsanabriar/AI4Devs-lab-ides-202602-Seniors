# User Story Examples

Reference for the improve-user-story skill. Use when the user needs more examples or templates.

## Template (copy-paste)

```markdown
## Story
As a [role], I want [action] so that [benefit].

## Acceptance criteria
- Given [context], when [action], then [outcome].
- [Optional: edge case or error behavior]
```

## Good vs weak examples

| Weak | Strong |
|------|--------|
| As a user I want to login | As a **recruiter** I want to **log in with email and password** so that **my session is secure and only I can see my data** |
| I want to see a list | As a **talent manager** I want to **see candidates sorted by last update** so that **I can prioritize recent applications** |
| So that it works | So that **I can share the report in the Monday standup** |

## Splitting stories

**Too big:** "As a recruiter I want to manage candidates (add, edit, delete, filter, export) so that I can run hiring."

**Split into:**
1. … filter candidates by skill and seniority … find matches for open positions
2. … export the candidate list to CSV … share with stakeholders
3. … add a new candidate with name, email, and skills … grow the talent pool
4. … edit an existing candidate's details … keep data up to date
5. … delete a candidate … remove duplicates or withdrawn applications

One clear "I want" and one "so that" per story.

## Acceptance criteria styles

**Given/When/Then (scenario):**
- Given I am on the candidate detail page, when I click "Edit", then I see a form with current values and can change name, email, and skills.
- Given I changed the email, when I save, then the candidate is updated and I see a success message.

**Bullet (checklist):**
- Filter dropdown includes all skills present in the database.
- Empty filter result shows "No candidates match" and does not show the table.
- Export includes at least: name, email, skills, last updated date.

Use the style that fits the story; mix if needed.
