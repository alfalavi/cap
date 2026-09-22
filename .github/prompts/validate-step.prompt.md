---
description: "Validate that all success criteria for the current step are met"
mode: "agent"
agent: "code-reviewer"
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step

Use the workflow utilities in [.github/copilot-instructions.md](../copilot-instructions.md) to find the current exercise issue and validate the requested step against the workspace state.

## Goal

Confirm whether all success criteria for the specified step are complete and report any remaining gaps with concrete guidance.

## Required behavior

1. Require a step number:
   - The user must provide a step number in the form `5-0`, `5-1`, etc.
   - This prompt will not proceed without it.

2. Find the exercise issue:
   - Use `gh issue list --state open`.
   - Identify the main exercise issue with "Exercise:" in the title.

3. Retrieve issue details:
   - Run `gh issue view <issue-number> --comments`.
   - Read the full issue content and comments.

4. Find the relevant step:
   - Search the issue for `# Step {step-number}:`.
   - Extract the `Success Criteria` section from that step.

5. Check the workspace against each criterion:
   - Compare the current implementation and tests to the stated success criteria.
   - Determine which items are complete, partial, or missing.

6. Report results clearly:
   - Mark each criterion as complete, incomplete, or not verifiable.
   - Provide specific guidance for any remaining work.
   - Call out evidence from the code or tests where relevant.

## Important constraints

- Step number is required.
- Do not validate a different step than the one provided.
- Use the issue content as the source of truth for acceptance criteria.
- Keep the result grounded in observable workspace state, not assumptions.

## Output expectations

Provide:
- the issue and step being validated
- a pass/fail assessment for each success criterion
- a concise summary of remaining work, if any
- recommended next action(s)
