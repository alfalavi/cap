---
description: "Execute instructions from the current GitHub Issue step"
mode: "agent"
agent: "tdd-developer"
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Step

Use the project instructions in [.github/copilot-instructions.md](../copilot-instructions.md) and the GitHub CLI workflow utilities described there.

## Goal

Execute the latest step instructions from the active exercise issue, following the TDD workflow and the project’s testing scope boundaries.

## Required behavior

1. Determine the exercise issue:
   - If an issue number is provided, use it.
   - If no issue number is provided, run `gh issue list --state open` and identify the issue with "Exercise:" in the title.

2. Retrieve the issue details and comments:
   - Run `gh issue view <issue-number> --comments`.
   - Read the full issue content.

3. Parse the latest step instructions from the issue:
   - Find the newest step section in the issue description/comments.
   - Extract the instructions under the relevant step.

4. Execute each `:keyboard: Activity:` section systematically:
   - Work through the step in order.
   - Keep the implementation small and test-focused.
   - Follow TDD: write/fix tests first when adding behavior, then implement the minimal fix.
   - Respect the testing scope from [.github/copilot-instructions.md](../copilot-instructions.md):
     - Backend changes: write Jest + Supertest tests first
     - Frontend changes: write React Testing Library tests first
     - Do not create or run Playwright UI tests in this prompt

5. Scope boundary:
   - Do NOT create or run Playwright UI tests in this prompt.
   - Use `/create-ui-tests` and `/run-ui-tests` for UI work, which automatically switch to the `test-engineer` agent.

6. Do not commit or push:
   - This prompt is for step execution only.
   - Do not run commit or push commands.
   - The job of `/commit-and-push` is separate.

7. Stop after completing the step activities and provide next commands in this exact order:
   - If the current step requires UI workflow: `/create-ui-tests` → `/run-ui-tests` → `/validate-step {step-number}`
   - If the current step does not require UI workflow: `/validate-step {step-number}`
   - Never recommend `/validate-step` before any required UI prompts.

## Important constraints

- Follow testing scope constraints from [.github/copilot-instructions.md](../copilot-instructions.md).
- Do not broaden the task beyond the current issue step.
- Keep the work incremental and verifiable.
- If the step specifically requires UI validation, hand off to the UI prompts instead of doing Playwright work here.

## Output expectations

Provide:
- the issue/step identified
- a concise summary of the work completed
- what was validated
- the exact next command sequence, in the required order
