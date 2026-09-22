---
description: "Analyze changes, generate commit message, and push to feature branch"
mode: "agent"
tools: ['read', 'execute', 'todo']
---

# Commit and Push

Use the project workflow rules from [.github/copilot-instructions.md](../copilot-instructions.md), especially the Git Workflow and testing guidance.

## Goal

Review the current repository changes, create a conventional-commit message, and push the changes to the user-specified branch.

## Required behavior

1. Require a branch name:
   - The user must provide `branch-name`.
   - If no branch name is provided, ask the user for it before continuing.

2. Check whether a UI workflow is required in the current step:
   - If the current step includes required UI workflow, run `npm run test:ui` or require that successful `/run-ui-tests` was already completed in the current chat.
   - Do not proceed with commit/push if the UI validation requirement is still unmet.

3. Inspect the working tree:
   - Run `git diff --stat` and inspect the actual diff to understand the changes.
   - Summarize the major changes before committing.

4. Generate a descriptive commit message:
   - Use conventional commit format from the project instructions, such as `feat:`, `fix:`, `docs:`, `chore:`, etc.
   - Keep it specific to the change.

5. Handle the branch:
   - If the branch does not exist, run `git checkout -b <branch-name>`.
   - If the branch exists, switch to it with `git checkout <branch-name>`.
   - Do not commit to `main` or any other branch.

6. Stage and commit:
   - Run `git add .`
   - Commit with the generated message.

7. Push the branch:
   - Run `git push origin <branch-name>`.

## Hard constraints

- DO NOT commit to main or any other branch.
- ONLY use the user-provided branch name.
- Do not push a different or inferred branch.
- Do not skip the UI requirement when the current step requires it.

## Output expectations

Provide:
- the branch being used
- the generated commit message
- the verification that the UI requirement was satisfied, if applicable
- the final push result
