---
description: "Create UI tests for required critical user journeys"
mode: "agent"
agent: "test-engineer"
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests

Create or update Playwright UI tests for the critical user journeys required by the project workflow.

## Goal

Add a small, high-value set of UI tests that cover the most important user flows and the key error states, while keeping the total number of Playwright tests within the required limit.

## Required behavior

1. Determine the journey set:
   - If the user provides `journeys`, use the supplied list.
   - Otherwise, use the default set: create, edit, toggle, delete, and core error-state handling.

2. Keep the scope bounded:
   - Hard limit: create a maximum of 5 Playwright tests for this run.
   - Target 3-5 total tests.
   - Include at least 1 error-path test inside that range.
   - If more than 5 candidate scenarios exist, select the highest-risk 5 and list deferred scenarios instead of creating more tests.

3. Generate or update UI tests:
   - Use the project UI test framework.
   - Prefer stable selectors and state-based waits.
   - Apply Page Object Model (POM) patterns: put reusable interactions/selectors in page objects or helpers, and keep test files focused on scenario intent and assertions.

4. Validate the final authored count:
   - Before finishing, count the created or updated Playwright test cases using `test(...)` or `it(...)`.
   - Reduce the total to 5 or fewer if the final count exceeds the limit.
   - Do not claim a small scope if the final authored count is greater than 5.

5. Report results:
   - State which files changed.
   - State which scenarios were covered.
   - List deferred scenarios that were intentionally not included in this run.

## Important constraints

- Keep tests deterministic, isolated, readable, and easy to debug.
- Avoid shared state across tests.
- Do not create broad test suites beyond the 5-test cap.
- Keep the work aligned with the user journeys most likely to fail or matter to business behavior.

## Output expectations

Provide:
- the files changed
- the scenarios covered
- the total number of tests created/updated
- any scenarios deferred for a future run
