# Working Memory System

## Purpose

This directory captures the working knowledge we accumulate while building the project. It helps preserve patterns, decisions, debugging discoveries, and useful lessons so they can be reused in future work instead of being forgotten between sessions.

There are two related memory layers:

- Persistent memory: [.github/copilot-instructions.md](../copilot-instructions.md)
  - Holds the project’s foundational rules, workflow expectations, and global guidance.
  - This is the long-lived reference that sets the standard for how we work.

- Working memory: [.github/memory/](.)
  - Holds ongoing discoveries, session summaries, and reusable patterns.
  - This is the working record for learning during development.

## Directory structure

```text
.github/memory/
├── README.md
├── session-notes.md
├── patterns-discovered.md
└── scratch/
    ├── .gitignore
    └── working-notes.md
```

## When to use each file

### 1) Persistent memory: [.github/copilot-instructions.md](../copilot-instructions.md)
Use this file for:
- Core principles and project expectations
- Testing workflow guidance
- TDD rules and validation requirements
- Project-wide standards and conventions

This file should remain stable and should not hold session-specific details that change frequently.

### 2) Historical memory: [session-notes.md](session-notes.md)
Use this file after a development session is complete.

Document:
- What was accomplished
- What changed
- Key decisions
- Important findings
- Regression notes or edge cases

This file is committed to git as a historical record for future context.

### 3) Pattern library: [patterns-discovered.md](patterns-discovered.md)
Use this file to capture recurring solutions and technical learnings.

Examples include:
- Initialization choices (empty array vs null)
- Repeated API handling patterns
- State management conventions
- Error-handling approaches
- UI test stabilization patterns

This file is committed to git because it should accumulate over time and help future work.

### 4) Active session memory: [scratch/working-notes.md](scratch/working-notes.md)
Use this file during active development.

It is for:
- Current task notes
- Immediate findings
- Temporary debugging observations
- Working hypotheses
- Blockers and next steps

This file is intentionally not committed to git. It is meant to be lightweight, ephemeral, and easy to overwrite as a task evolves.

## How AI reads and applies memory

AI assistance works best when it can see the context that has already been learned.

Before proposing a fix or implementation, the assistant should review:
- The project instructions in [.github/copilot-instructions.md](../copilot-instructions.md)
- Recent session notes in [session-notes.md](session-notes.md)
- Reusable patterns in [patterns-discovered.md](patterns-discovered.md)
- Current scratch notes in [scratch/working-notes.md](scratch/working-notes.md) when continuing an active task

This improves context-aware suggestions by helping the AI:
- avoid repeating mistakes
- apply established patterns consistently
- understand what has already been tried
- preserve design decisions across sessions

## TDD workflow usage

During TDD:
- start with a failing test
- note the requirement in scratch notes if the task is still in progress
- when the test is fixed and the code is validated, summarize the outcome in session notes
- if the fix reveals a recurring pattern, add it to patterns-discovered.md

## Linting workflow usage

During linting or quality checks:
- capture the issue and fix direction in scratch notes
- record any recurring rule or code smell in patterns-discovered.md if it is likely to return
- keep scratch notes ephemeral while the lint fixes are being made
- once the cleanup is complete, summarize the outcome in session-notes.md

## Debugging workflow usage

During debugging:
- use scratch notes to track reproduction steps, root cause hypotheses, and attempted fixes
- keep notes updated as the investigation narrows
- once the issue is resolved, move the meaningful learnings into session notes and patterns
- preserve the final cause and fix in historical memory so future debugging is faster

## Important distinction

- [session-notes.md](session-notes.md) is for completed session summaries and is committed to git as a historical record.
- [scratch/working-notes.md](scratch/working-notes.md) is for active work and is intentionally not committed to git.

This separation keeps active work flexible while preserving the useful knowledge that should survive into future work.

## Best practices

- Keep scratch notes specific and short-lived.
- Promote useful findings into session notes when a task is finished.
- Add recurring patterns to patterns-discovered.md when they are reusable.
- Update memory as work progresses, not only at the end.
- Use memory to guide future suggestions, not as a dumping ground for unrelated notes.

The goal is simple: capture the lessons that matter, keep the active work focused, and preserve patterns that help the project improve over time.
