# Patterns Discovered

This file captures reusable problem-solution patterns that have been learned during development. It should accumulate over time and help future work avoid repeating mistakes.

## Pattern template

### Pattern name
- Name: [Short, memorable name]

### Context
- [When this pattern is relevant]
- [What situation triggered the need]

### Problem
- [Describe the issue or failure mode]
- [Explain why the default approach is risky or fragile]

### Solution
- [Describe the recommended fix or approach]
- [Mention the rule or principle that should guide future work]

### Example
```js
// Example snippet showing the pattern
```

### Related files
- [path/to/file.js]
- [path/to/test.js]

---

## Example pattern: Service initialization (empty array vs null)

### Pattern name
- Name: Service initialization with empty collections

### Context
- When initializing a list-like data store for a service or controller.
- When logic expects to iterate, filter, or map without checking for null repeatedly.

### Problem
- Initializing the collection as null forces downstream code to guard against null everywhere.
- This increases error risk and makes the service harder to reason about.
- In some cases, null leads to crashes or inconsistent behavior when list operations are attempted.

### Solution
- Initialize list-based state as an empty array instead of null.
- Keep downstream logic focused on actual data behavior, not null checks.
- Use validation only when data is truly missing or invalid in a business sense.

### Example
```js
// Preferred approach
const todos = [];

// Avoid
const todos = null;
```

### Related files
- src/services/todoService.js
- src/__tests__/todoService.test.js

---

## Accumulated learnings

Add recurring patterns here as they are discovered during active work. Each entry should be small, specific, and practical so future sessions can reference it quickly.
