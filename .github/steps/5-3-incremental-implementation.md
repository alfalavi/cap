# Step 5-3: Incremental Implementation

## Goal

Complete the frontend functionality using incremental feature implementation. Plan, build step-by-step, test continuously, and integrate with confidence using your custom agents.

## Background

The frontend is built with **Material-UI (MUI)** components and **React Query** for API state management, giving it a modern, professional look and feel. However, several features are incomplete or buggy:

- Delete functionality doesn't work (mutation not implemented)
- Edit functionality needs to be implemented
- Stats always show 0 (need to calculate from todos array)
- No empty state message when todos.length === 0
- API URL is hardcoded (should use relative URL)
- No error handling in React Query

**Tech Stack Used**:

- **Material-UI (MUI)**: Modern React component library for UI
- **React Query**: Data fetching and state management for API calls
- **MUI Components**: Container, Card, TextField, Button, Checkbox, IconButton, Chip, etc.
- **React Query Hooks**: useQuery for fetching, useMutation for creating/updating/deleting

Your goal is to complete these features incrementally, testing each before moving to the next.

> **Continuing from Step 5-2**: You're still on the `feature/agentic-workflow` branch with all backend tests passing and lint errors fixed. Now, let's complete the frontend implementation incrementally, testing as we go.

## Instructions

> 🔄 **Fresh Start**: Before beginning, **start a new chat** (click the **+** button in Copilot Chat panel). This gives you a clean context for this step while still leveraging your project instructions and agents.

### :keyboard: Activity: Complete Frontend Implementation

> 💡 **How `/execute-step` works**: It reads the instructions from this GitHub Issue comment (including the Background section above that lists incomplete features), auto-switches to `tdd-developer` agent, and implements each feature incrementally. The documented requirements become the execution plan!

> 🧪 **TDD Approach for Frontend Features**: The AI should write **React Testing Library tests FIRST** for component logic (rendering, user interactions, state changes), then implement the features. This is true Test-Driven Development! The workflow:
>
> - **RED**: Write a React Testing Library test that fails (feature doesn't exist yet)
> - **GREEN**: Implement the feature to make the test pass
> - **REFACTOR**: Clean up the code while keeping tests green
> - **UI Validate**: Hand off Playwright UI tests to `test-engineer` via `/create-ui-tests` and `/run-ui-tests`, then verify manually in the browser
>
> This is realistic! React Testing Library covers component behavior and UI tests provide required end-to-end journey validation.

Use `/execute-step` to autonomously implement all frontend features:

1. **Run** `/execute-step 5-3` in Copilot Chat

2. **Watch the AI work!** It will:
   - Auto-switch to `tdd-developer` agent
   - Navigate to `packages/frontend/src/App.test.js` (or create it)
   - **Write React Testing Library tests FIRST** for each feature (RED phase):
     - Test delete functionality
     - Test stats calculation
     - Test empty state rendering
     - Test error handling
   - Watch tests fail (RED ✓)
   - Navigate to `packages/frontend/src/App.js`
   - Implement features to make tests pass (GREEN phase)
   - Refactor code while keeping tests green (REFACTOR phase)
   - Run lint to verify code quality

3. **Review the changes** it made in `packages/frontend/src/App.js`

4. **Test manually** in the browser:

   **Start both frontend and backend**:
   - In the terminal, run: `npm start` (from root directory)
   - This starts both the backend (port 3001) and frontend (port 3000) simultaneously
   - Wait for both to start (you'll see "Server running on port 3001" and "webpack compiled successfully")

   **Access the application**:
   - **Important**: When both servers start, you may only see one notification - often for port 3001 (the API)
   - **To access the frontend**: Click the **"Ports"** tab at the bottom of VS Code (next to the terminal tab)
   - Find port **3000** in the list (the frontend)
   - Click the **globe icon** (🌐) next to port 3000 to open in browser
   - You should see the TODO application in your browser

   > 💡 **Tip**: Port 3001 (backend) shows `Cannot GET /` if opened - that's expected! The backend is an API server, not a web app. Always use port 3000 for the frontend UI.

   **Test all features**:
   - Create new todos
   - Mark todos as complete
   - Delete todos (test the delete button)
   - Edit a todo and save
   - Verify stats update correctly (incomplete and completed counts)
   - Delete all todos to see empty state message

   **Test error handling**:
   - Stop the backend: Press `Ctrl+C` in terminal, then restart only frontend: `npm run start:frontend`
   - Refresh the browser - you should see error handling UI
   - Stop the frontend (`Ctrl+C`) when done testing

> 💡 **What's happening?** The AI uses incremental development: Plan → Build → Test → Fix for each feature, ensuring each works before moving to the next. It automatically documents patterns (React Query, MUI, error handling) to memory as it discovers them!

> 💡 **Pattern library**: AI naturally builds a library of frontend patterns that it can reference and apply in future development work - check `.github/memory/patterns-discovered.md` after this step!

### :keyboard: Activity: Validate and Progress

Now verify your work and push to trigger the next step:

1. **Run required UI test workflow prompts**
   - Required order: 1) `npm run test:ui:install --workspace=frontend` (mandatory in Ubuntu/Linux and runs `playwright install --with-deps chromium`), 2) `npm start` from repo root, 3) `/create-ui-tests`, 4) `/run-ui-tests`
   - These prompts auto-switch to `test-engineer` for Playwright authoring and execution
   - Enforce scope: keep Playwright UI coverage to 3-5 tests total for this step; if more than 5 are generated, prune to highest-value journeys and list deferred cases
   - Execution guardrail: if `test:ui:install` fails, rely on its built-in automatic Ubuntu remediation + one retry; do not run ad-hoc manual apt/repo/key troubleshooting in this workflow.
   - If `test:ui:install` still fails after retry, treat the step as environment-blocked and stop before `/run-ui-tests`.
   - Confirm required UI journeys are covered and passing

2. **Validate completion** using `/validate-step`
   - Run: `/validate-step 5-3` in Copilot Chat
   - Checks that all features work
   - Verifies tests pass and no lint errors

3. **Commit and push** using `/commit-and-push`
   - Run: `/commit-and-push` in Copilot Chat
   - Provide branch: `feature/agentic-workflow`
   - AI analyzes changes and creates commit message
   - Pushes to trigger Step 5-4 workflow automatically

## Success Criteria

To complete this exercise successfully:

- ✅ Delete functionality works
- ✅ Stats show correct numbers (incomplete and completed counts)
- ✅ Empty state message displays when no todos
- ✅ Error handling provides user feedback
- ✅ All tests pass (`npm test`)
- ✅ Required UI tests pass (`npm run test:ui`)
- ✅ Required UI journeys are covered and validated
- ✅ No lint errors (`npm run lint`)
- ✅ Changes are committed and pushed to `feature/agentic-workflow` using `/commit-and-push`

## Key Workflow Patterns

✨ **Incremental Development**: Build features one at a time with continuous testing

✨ **Plan-Build-Test-Fix Cycle**: Break down features → implement → verify → debug → repeat

✨ **Continuous Testing**: Component tests + required UI tests + manual browser checks catch issues early

✨ **Error Handling**: Graceful error states and user feedback improve UX

✨ **AI-Assisted Implementation**: Using `tdd-developer` agent for systematic feature building

✨ **Workflow Automation**: Using `/validate-step` and `/commit-and-push` prompts to progress through steps

✨ **Required UI Validation**: Use `/create-ui-tests` and `/run-ui-tests` to enforce critical journey quality gates

---

Wait for the review step to appear below...