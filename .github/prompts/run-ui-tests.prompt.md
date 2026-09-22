---
description: "Run UI tests and summarize failures"
mode: "agent"
agent: "test-engineer"
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Run the project’s UI test suite and summarize the result with clear failure classification and debugging guidance.

## Required behavior

1. Mandatory install step before UI execution:
   - Run `npm run test:ui:install --workspace=frontend` before Playwright tests.
   - In Ubuntu/Linux environments, this installation step is required and must perform `playwright install --with-deps chromium` before running tests.
   - This automated install includes bounded Ubuntu remediation for the common Yarn key issue, with one retry.
   - Do not do ad-hoc package hunting or general OS troubleshooting beyond that remediation.
   - If the install still fails, stop immediately and report an environment blocker with the failing command and key error lines.
   - Do not continue to Playwright tests after a failed dependency install.

2. Ensure services are running:
   - Ensure both backend and frontend are running before executing UI tests.
   - If needed, start from the repo root with `npm start` before running the UI suite.

3. Run the UI tests using the project command.

4. Summarize pass/fail results clearly:
   - Report which tests passed and which failed.
   - Provide a concise explanation of the failing behavior.

5. Classify the likely root cause:
   - application code
   - test code
   - environment

6. Provide guidance for next steps:
   - For application issues: explain likely implementation problem.
   - For test issues: call out brittle selectors, shared state, timing assumptions, or incorrect assertions.
   - For environment issues: note install, browser, config, or service startup blockers.

## Important constraints

- If the dependency install fails, stop and report the blocker instead of continuing.
- Do not treat flaky or environment-related failures as application code defects without evidence.
- Keep the summary concrete and actionable.

## Output expectations

Provide:
- the UI test command used
- the pass/fail outcome
- the likely root cause category
- the recommended next action
