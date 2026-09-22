# Step 5-0: Bootstrap Your Agentic Workflow System

## Goal

Before you can practice agentic development, you need to **bootstrap your workflow system** - the foundational infrastructure that enables AI to work autonomously. This step sets up memory, specialized modes, and automation tools that you'll use throughout Session 5.

Think of this as **setting up your development environment**, but for agentic AI:

1. **Memory System** - Configure persistent and working memory (already provided in `.github/memory/`)
2. **Project Instructions** - Connect AI to existing project documentation and workflow principles
3. **Specialized Agents** - Create autonomous agents for TDD, code review, and workflow orchestration
4. **Prompt Files** - Build user-friendly slash commands that trigger complex workflows

By the end of this bootstrap step, you'll have a **complete agentic infrastructure** ready to use in Steps 5-1 through 5-5.

## Why Bootstrap First?

Earlier sessions taught you to provide context to AI through documentation. Session 5 teaches you to build **autonomous workflow systems** - but autonomous systems need infrastructure.

This bootstrap step creates:

- **Memory System**: Where AI stores and retrieves knowledge
  - **Persistent Memory**: Foundational principles that survive across all sessions
  - **Working Memory**: Session discoveries and patterns that evolve as you work
- **Specialized Agents**: Task-optimized modes that work autonomously within defined workflows
- **Orchestration Layer**: Higher-level coordination between specialized agents
- **User Interfaces**: Simple commands that trigger complex autonomous workflows

**Analogy**: Just like you need to install development tools (Node.js, npm, Git) before you can code, AI needs this infrastructure before it can work autonomously.

Once bootstrapped, Steps 5-1 through 5-5 will use this system to demonstrate **AI-assisted development at scale**.

---

## Instructions

### :keyboard: Activity: Launch Codespace

1. Click the below button to open the **Create Codespace** page in a new tab. Use the default configuration.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

2. Confirm the **Repository** field is your copy of the exercise, then click the green **Create Codespace** button.

3. Wait for the Codespace to fully load (you'll see the workspace file tree).

4. **Complete Copilot Setup** (if prompted):
   - Click **"Finish Setup"** (bottom right)
   - Then click **"Set up Copilot"** to enable AI features
   - Wait for setup to complete before proceeding

5. **Wait for workspace initialization**:
   - Look for `npm install` running in the terminal (may happen automatically)
   - Wait until you see "Postinstall complete" or the terminal shows a prompt
   - This ensures the agent can properly detect the project model

   > ⚠️ **Important**: If you switch to `copilot-customization` agent before npm install completes, the agent may not select the correct model. Wait for installation to finish first!

### :keyboard: Activity: Create Project Instructions File

Set up **project-level instructions** that give AI context about your codebase, workflows, and standards.

1. Open **GitHub Copilot Chat** panel (icon in the upper navbar or `Ctrl+Alt+I` / `Cmd+Shift+I`)

2. **Switch to the `copilot-customization` agent** (Agent control at the bottom of the chat pane)
   - Click the **Agent** button at the bottom-left of the Copilot Chat pane
   - Select `copilot-customization` from the dropdown list
   - 💡 **About this agent**: `copilot-customization` is the **bootstrap agent** - pre-provided in this repository to help you create other agents!
   - This agent specializes in creating agents, prompt files, and instructions
   - You'll use it throughout this step to build your automation infrastructure
   - If you don't see agents, ensure you completed the Copilot setup in the previous step

3. Ask Copilot to create project instructions:

   ```text
   Create a .github/copilot-instructions.md file for this TODO application.

   Structure it with these sections:

   ## Project Context
   - Full-stack TODO application with React frontend and Express backend
   - Focus on iterative, feedback-driven development
   - Current phase: Backend stabilization and frontend feature completion

   ## Documentation References
   Link to existing documentation (helps AI navigate the project):
   - docs/project-overview.md - Architecture, tech stack, and structure
   - docs/testing-guidelines.md - Test patterns and standards
   - docs/workflow-patterns.md - Development workflow guidance

   ## Development Principles
   - Test-Driven Development: Red-Green-Refactor cycle
   - Incremental Changes: Small, testable modifications
   - Systematic Debugging: Use test failures as guides
   - Validation Before Commit: All tests pass, no lint errors

   ## Testing Scope
   This project uses unit tests, integration tests, and UI end-to-end tests:
   - Backend: Jest + Supertest for API testing
   - Frontend: React Testing Library for component unit/integration tests
   - UI testing: Playwright for critical user journey automation
   - Manual browser testing for exploratory validation and visual checks
   - Reason: Combine fast feedback (unit/integration) with end-to-end quality confidence (UI tests)

   **Testing Approach by Context**:
   - Backend API changes: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
   - Frontend component features: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.
   - This is true TDD: Test first, then code to pass the test

   ## Workflow Patterns
   Describe the development workflows to follow:
   1. TDD Workflow: Write/fix tests → Run → Fail → Implement → Pass → Refactor
   2. Code Quality Workflow: Run lint → Categorize issues → Fix systematically → Re-validate
   3. Integration Workflow: Identify issue → Debug → Test → Fix → Verify end-to-end
   4. UI Testing Workflow: Define critical journeys → Create UI tests → Run → Debug failures → Validate coverage

   ## Agent Usage
   Explain when to use each specialized agent:
   - tdd-developer: For implementation and unit/integration TDD cycles; do NOT create or run Playwright UI tests in this mode
   - code-reviewer: For addressing lint errors and code quality improvements
   - test-engineer: Owns all Playwright UI test authoring/execution, failure triage, and isolation checks

   ## Workflow Utilities
   Explain GitHub CLI commands for workflow automation (available to all modes):
   - List open issues: gh issue list --state open
   - Get issue details: gh issue view <issue-number>
   - Get issue with comments: gh issue view <issue-number> --comments
   - The main exercise issue will have "Exercise:" in the title
   - Steps are posted as comments on the main issue
   - Use these commands when /execute-step or /validate-step prompts are invoked

   ## Git Workflow
   Explain conventional commit format and branch strategies:
   - Use conventional commits: feat:, fix:, chore:, docs:, etc.
   - Feature branches: feature/<descriptive-name>
   - Always stage all changes before committing: git add .
   - Push to the correct branch: git push origin <branch-name>

   Format as clean markdown with clear headers.
   ```

4. Copilot will generate and create the file. **Review `.github/copilot-instructions.md`** - this provides AI with foundational project context.

5. **Test it works**: Start a new chat, then ask "What workflow patterns should I follow?" - notice how AI knows the answer even in a fresh session!

### :keyboard: Activity: Create the Working Memory System

Now create the **working memory infrastructure** - where AI will track discoveries, patterns, and decisions during your development sessions.

1. **Use AI to create the memory system AND update project instructions**:

   In Copilot Chat (still in `copilot-customization` mode), ask:

   ```text
   Create a working memory system in .github/memory/ for tracking development discoveries, then update .github/copilot-instructions.md to reference it.

   PART 1: Create these files in .github/memory/:

   1. README.md - Explain the memory system:
      - Purpose: Track patterns, decisions, and lessons during development
      - Two types of memory: Persistent (.github/copilot-instructions.md) vs Working (.github/memory/)
      - Directory structure: session-notes.md (historical summaries), patterns-discovered.md (accumulated patterns), scratch/working-notes.md (active session)
      - When to use each file during TDD, linting, and debugging workflows
      - How AI reads and applies these patterns in future work
      - Explain the difference: session-notes.md is for completed session summaries (committed), scratch/working-notes.md is for active work (not committed)

   2. session-notes.md - Template for historical session summaries:
      - Purpose: Document completed sessions for future reference
      - Template with sections:
        * Session name and date
        * What was accomplished
        * Key findings and decisions
        * Outcomes
      - Include one example session summary
      - This file is committed to git as a historical record

   3. patterns-discovered.md - Template for documenting code patterns:
      - Pattern template (name, context, problem, solution, example, related files)
      - Include one example pattern: Service initialization (empty array vs null)
      - Accumulated learnings over time

   4. scratch/ directory - For active session work (not committed to git)
      - Create .gitignore file inside scratch/ that ignores all files: *
      - Create working-notes.md template for active session notes with sections:
        * Current Task
        * Approach
        * Key Findings
        * Decisions Made
        * Blockers
        * Next Steps
        * Notes
      - At end of session, summarize key findings into session-notes.md
      - This keeps active work ephemeral while preserving historical learnings

   PART 2: Update .github/copilot-instructions.md:

   Add a new "Memory System" section after the "Agent Usage" section:

   ## Memory System
   - Persistent Memory: This file (.github/copilot-instructions.md) contains foundational principles and workflows
   - Working Memory: .github/memory/ directory contains discoveries and patterns
   - During active development, take notes in .github/memory/scratch/working-notes.md (not committed)
   - At end of session, summarize key findings into .github/memory/session-notes.md (committed)
   - Document recurring code patterns in .github/memory/patterns-discovered.md (committed)
   - Reference these files when providing context-aware suggestions

   Make the README.md comprehensive and instructional - it teaches how to use the memory system!
   ```

2. Copilot will generate and create all the files, **and** update your project instructions. **Review `.github/memory/README.md`** to understand the memory system architecture.

3. **Understand your memory architecture**:

   | Type | File | Purpose | When to Use |
   |------|------|---------|-------------|
   | **Persistent** | `.github/copilot-instructions.md` | Foundational principles | Created once, referenced always |
   | **Historical** | `.github/memory/session-notes.md` | Completed session summaries | After each session (committed) |
   | **Accumulated** | `.github/memory/patterns-discovered.md` | Code patterns learned over time | When pattern emerges (committed) |
   | **Active** | `.github/memory/scratch/working-notes.md` | Current session work | During active development (not committed) |

4. **Verify the bootstrap**:

   Start a new chat, then ask:

   ```text
   Explain the memory system in .github/memory/ and how I should use it during TDD workflows
   ```

   AI should describe the files you just created - this confirms the bootstrap worked!

5. **Key insight - The Learning Loop**:
   - **Persistent memory** (copilot-instructions.md) provides foundational knowledge
   - **Active memory** (scratch/working-notes.md) captures real-time session work (ephemeral)
   - **Historical memory** (session-notes.md) documents completed sessions (committed)
   - **Accumulated patterns** (patterns-discovered.md) preserves learnings over time (committed)
   - AI reads all committed files and applies learnings to future work
   - **Result**: The system learns and improves as you work through Steps 5-1 to 5-5

**You've now built the memory infrastructure!** In later steps, you'll actively capture discoveries in these files.

### :keyboard: Activity: Create TDD Developer Agent

Now create a specialized agent for test-driven development workflows.

1. In the same **Copilot Chat** (still using `copilot-customization` agent)

2. Ask Copilot to create the TDD agent:

   ```text
   Create a custom Copilot agent for Test-Driven Development workflows.

   The mode should handle TWO TDD scenarios:

   **Scenario 1: Implementing New Features (PRIMARY WORKFLOW - ALWAYS Write Tests First)**
   - **CRITICAL**: ALWAYS start by writing tests BEFORE any implementation code
   - Write tests that describe the desired behavior (RED phase - test fails)
   - Run tests to verify they fail for the right reason
   - Explain what the test verifies and why it fails
   - Implement MINIMAL code to make tests pass (GREEN phase)
   - Run tests to verify they pass
   - Refactor while keeping tests green (REFACTOR phase)
   - **Never implement features without writing tests first - this is the core TDD principle**

   **Scenario 2: Fixing Failing Tests (Tests Already Exist)**
   - Analyze existing test failures and understand root causes
   - Explain what the test expects and why it's failing
   - Suggest minimal code changes to make tests pass (GREEN phase)
   - Refactor after tests pass (REFACTOR phase)
   - Run tests to verify the fix
   - **CRITICAL SCOPE BOUNDARY**: In this scenario, ONLY fix code to make tests pass
   - **DO NOT fix linting errors** (no-console, no-unused-vars, etc.) unless they cause test failures
   - **DO NOT remove console.log statements** that are not breaking tests
   - **DO NOT fix unused variables** unless they prevent tests from passing
   - Linting is a separate workflow that will be addressed in dedicated lint resolution steps

   **General TDD Principles (Both Scenarios)**
   - **PRIMARY RULE**: Test first, code second - never reverse this order for new features
   - Guide through complete Red-Green-Refactor cycles systematically
   - Break solutions into small, incremental changes
   - Encourage running tests after each change
   - Remind to refactor after tests pass
   - Focus on unit tests, integration tests, and critical-path UI tests
   - **Default assumption**: When implementing new features, ALWAYS write the test first
   - When automated tests aren't available (rare case), apply TDD thinking:
     * Plan expected behavior first (like writing a test)
     * Implement incrementally
     * Verify manually in browser after each change
     * Refactor and verify again

   **IMPORTANT Testing Constraints**
   - Use the project test infrastructure: Jest + Supertest (backend), React Testing Library (frontend), Playwright (UI tests)
   - Prefer accessibility-first selectors (`getByRole`/`getByLabel`), then `data-testid`; avoid brittle CSS selectors and use state-based waits
   - Use Page Object Model (POM) patterns for Playwright tests to separate page interactions from test assertions
   - For full UI confidence, run automated UI tests and follow with focused manual validation
   - Keep testing simple and focused on TDD principles
   - **TDD Workflow**: Write tests FIRST (RED), implement to pass (GREEN), then refactor (REFACTOR)
   - **Backend changes**: Write Jest + Supertest tests FIRST, then implement
   - **Frontend changes**: Write React Testing Library tests FIRST for component behavior (rendering, user interactions, conditional logic), then implement.
   - **Critical UI journeys**: Add Playwright tests for create/edit/toggle/delete and key error-state flows.

   Available tools: "search" , "read", "edit", "execute", "web", "todo"

   Preferred model: Claude Sonnet 4.5 (copilot)

   Format as a .agent.md file ready to save in .github/agents/
   ```

3. Copilot will generate and create the file at `.github/agents/tdd-developer.agent.md`. The agent will be available immediately in the agent dropdown.

   > 💡 **Quality Check**: The GitHub Actions workflow for Step 5-1 will automatically validate that this file exists before allowing you to proceed. No manual verification needed!

### :keyboard: Activity: Create Code Reviewer Agent

Create a specialized agent for code quality and linting workflows.

1. In the same **Copilot Chat** (still using `copilot-customization` agent)

2. Ask Copilot to create the Code Reviewer agent:

   ```text
   Create a custom Copilot agent for systematic code review and quality improvement.

   The mode should:
   - Analyze ESLint/compilation errors systematically
   - Categorize similar issues for efficient batch fixing
   - Suggest idiomatic JavaScript/React patterns
   - Explain rationale for code quality rules
   - Recommend fixes that maintain test coverage
   - Identify code smells and anti-patterns
   - Guide toward clean, maintainable code

   Available tools: "search" , "read", "edit", "execute", "web", "todo"

   Preferred model: Claude Sonnet 4.5 (copilot)

   Format as a .agent.md file ready to save in .github/agents/
   ```

3. Copilot will generate and create the file at `.github/agents/code-reviewer.agent.md`. The agent will be available immediately in the agent dropdown.

### :keyboard: Activity: Create Test Engineer Agent

Create a specialized agent for integration and UI test workflows.

1. In the same **Copilot Chat** (still using `copilot-customization` agent)

2. Ask Copilot to create the Test Engineer agent:

   ```text
   Create a custom Copilot agent for integration and UI test workflows.

   The mode should:
   - Create and maintain integration and UI tests for critical user journeys
   - Run test suites and summarize pass/fail outcomes clearly
   - Classify failures into likely root causes: application code, test code, or environment
   - Validate required journey coverage and report concrete gaps
   - Prefer stable selectors and state-based waits for UI tests
    - Use Page Object Model (POM) best practices for Playwright tests:
       * Put reusable UI interactions in page object classes/helpers
       * Keep test files focused on scenario intent and assertions
       * Avoid duplicating selectors and interaction flows across tests
   - Keep tests deterministic, isolated, readable, and easy to debug (no shared state across tests)

   Testing scope:
   - Backend/API: Jest + Supertest
   - Frontend component behavior: React Testing Library
   - UI journeys: Playwright

   Frontmatter requirements (MANDATORY):
   - Include a `tools` array in the generated `.agent.md` frontmatter
   - `tools` MUST include `edit` explicitly to allow file modifications
   - Required set: `['search', 'read', 'edit', 'execute', 'web', 'todo']`

   Available tools: "search" , "read", "edit", "execute", "web", "todo"

   Preferred model: Claude Sonnet 4.5 (copilot)

   Format as a .agent.md file ready to save in .github/agents/
   ```

3. Copilot will generate and create the file at `.github/agents/test-engineer.agent.md`. The agent will be available immediately in the agent dropdown.
   - Verify the frontmatter includes a `tools` line with `edit` before proceeding.
   - If `edit` is missing, ask Copilot to regenerate/update the agent file and include it explicitly.

### :keyboard: Activity: Create Workflow Prompt Files

Now create five **slash commands** that will use the gh CLI and Git knowledge from your project instructions.

1. In the same **Copilot Chat** (still using `copilot-customization` agent)

2. Ask Copilot to create the five prompt files:

   ```text
   Create five prompt files for workflow automation. These prompts will inherit gh CLI and Git knowledge from .github/copilot-instructions.md:

   1. execute-step.prompt.md
      - Description: "Execute instructions from the current GitHub Issue step"
      - Agent: tdd-developer (AUTOMATICALLY SWITCHES to tdd-developer agent)
      - User input: issue-number (optional)
      - Instructions:
        * If issue number not provided, use gh CLI to find the exercise issue (see Workflow Utilities in project instructions)
        * Get the issue content with comments
        * Parse the latest step instructions from the issue
        * Execute each :keyboard: Activity: section systematically
            * Scope boundary: Do NOT create or run Playwright UI tests in this prompt
            * Handoff rule: Use `/create-ui-tests` and `/run-ui-tests` for Playwright UI work (auto-switches to `test-engineer`)
        * DO NOT commit or push changes - that's the job of /commit-and-push
         * Stop after completing activities and provide next commands in this order:
            * If the current step requires UI workflow: `/create-ui-tests` → `/run-ui-tests` → `/validate-step {step-number}`
            * If UI workflow is not required: `/validate-step {step-number}`
            * Never recommend `/validate-step` before required UI prompts
            * IMPORTANT: Follow testing scope constraints from project instructions
      - Tools: "search" , "read", "edit", "execute", "web", "todo"

   2. commit-and-push.prompt.md
      - Description: "Analyze changes, generate commit message, and push to feature branch"
      - Agent: NO AGENT SPECIFIED (uses current active agent)
      - User input: branch-name (REQUIRED)
      - If no branch name is provided, ask the user for it
      - Instructions:
        * If the current step includes required UI workflow, also run `npm run test:ui` (or require successful `/run-ui-tests` in the current chat) before committing
        * Analyze changes using git diff
        * Generate a descriptive commit message using conventional commit format (see Git Workflow in project instructions)
        * Create the specified branch if it doesn't exist (git checkout -b <branch-name>)
        * If the branch exists, switch to it (git checkout <branch-name>)
        * Stage all changes (git add .)
        * Commit with the generated message
        * Push to the specified branch (git push origin <branch-name>)
        * DO NOT commit to main or any other branch - ONLY use the user-provided branch name
      - Tools: "read", "execute", "todo"

   3. validate-step.prompt.md
      - Description: "Validate that all success criteria for the current step are met"
      - Agent: code-reviewer (AUTOMATICALLY SWITCHES to code-reviewer agent)
      - User input: step-number (REQUIRED, e.g., "5-0", "5-1")
      - Instructions:
        * Use gh CLI to find the main exercise issue (see Workflow Utilities in project instructions)
        * Get the issue with comments
        * Search through the issue to find "# Step {step-number}:"
        * Extract the "Success Criteria" section from that step
        * Check each criterion against the current workspace state
        * Report completion status with specific guidance for any incomplete items
      - The step number is required
      - Tools: "search" , "read", "execute", "web", "todo"

    4. create-ui-tests.prompt.md
         - Description: "Create UI tests for required critical user journeys"
          - Agent: test-engineer (AUTOMATICALLY SWITCHES to test-engineer agent)
         - User input: journeys (optional)
         - Instructions:
            * If journeys are not provided, use the default set: create, edit, toggle, delete, and core error-state handling
            * HARD LIMIT: create a maximum of 5 Playwright tests for this run (target 3-5 total)
            * Include at least 1 error-path test within the 3-5 total
            * If more than 5 candidate scenarios exist, select the highest-risk 5 and list deferred scenarios instead of creating more tests
            * Generate or update UI tests using the project UI test framework
            * Prefer stable selectors and state-based waits
            * Apply Page Object Model (POM): place reusable interactions/selectors in page objects and keep tests scenario-focused
            * Before finishing, verify the count of created/updated Playwright test cases (`test(...)` / `it(...)`) and reduce to <= 5 if over the limit
            * Do not claim "small scope" if the final authored count is greater than 5
            * Report files changed and scenarios covered
         - Tools: "search" , "read", "edit", "execute", "todo"

    5. run-ui-tests.prompt.md
         - Description: "Run UI tests and summarize failures"
          - Agent: test-engineer (AUTOMATICALLY SWITCHES to test-engineer agent)
         - User input: none
         - Instructions:
          * REQUIRED first step before `/run-ui-tests`: run `npm run test:ui:install --workspace=frontend` (repeat after container rebuild)
          * In Ubuntu/Linux environments, `test:ui:install` is mandatory and must perform `playwright install --with-deps chromium` before running tests
                      * `test:ui:install` now includes automatic bounded Ubuntu repo remediation for the common Yarn key issue, plus one retry
                      * Do NOT perform ad-hoc package hunting or broad OS troubleshooting beyond that automated remediation
                      * If install still fails, stop immediately and report an environment blocker with the failing command and key error lines
                      * Do not continue to run Playwright tests after a failed dependency install
            * Ensure both backend and frontend are running before executing UI tests (start from repo root with `npm start` if needed)
            * Run UI tests using the project command
            * Summarize pass/fail results
            * For failures, provide likely root cause categories (application code, test code, or environment)
         - Tools: "read", "execute", "todo"

   Agent specifications:
   - execute-step specifies agent: tdd-developer (auto-switches for execution context)
   - validate-step specifies agent: code-reviewer (auto-switches for review context)
   - create-ui-tests specifies agent: test-engineer (auto-switches for UI test creation)
   - run-ui-tests specifies agent: test-engineer (auto-switches for UI failure analysis)
   - commit-and-push does NOT specify an agent (works in any context)

   Format as .prompt.md files ready to save in .github/prompts/

   These prompts rely on the Workflow Utilities and Git Workflow sections in .github/copilot-instructions.md for gh CLI and Git knowledge.
   ```

3. Copilot will generate and create all five files:
   - `.github/prompts/execute-step.prompt.md`
   - `.github/prompts/commit-and-push.prompt.md`
   - `.github/prompts/validate-step.prompt.md`
   - `.github/prompts/create-ui-tests.prompt.md`
   - `.github/prompts/run-ui-tests.prompt.md`

4. **Key Learning**: This demonstrates BOTH prompt patterns:
   - **Auto-switching prompts** (`/execute-step`, `/validate-step`): Automatically select the right agent for their specific task
   - **Universal prompts** (`/commit-and-push`): Work with any agent because they're context-independent

   You'll use auto-switching for workflow stages (execution, validation) and universal prompts for utilities (commit)!

   **Note on Memory**: The AI automatically documents patterns and discoveries in `.github/memory/patterns-discovered.md` as it works - no separate prompt needed! The Memory System section in your project instructions tells AI to do this naturally.

5. The prompt slash commands will be available immediately. You can start using them right away!

### Understanding Agent Specification in Prompts

You just created five prompts with **different agent strategies**:

#### Pattern 1: Auto-Switching Prompts (Agent Specified)

**`/execute-step`** and **`/validate-step`**:

- **Specify an agent** in their YAML frontmatter
- **Automatically switch** to the appropriate agent when invoked
- **Why?**
  - `/execute-step` → `tdd-developer`: Most step work involves iterative development using TDD principles - whether fixing existing tests (Step 5-1) or implementing features with TDD thinking (Step 5-3). The agent handles both scenarios.
  - `/validate-step` → `code-reviewer`: Validation is ALWAYS a review task - checking criteria, analyzing state
- **Teaching**: The prompt knows the best context and switches automatically - reducing cognitive load

#### Pattern 2: Universal Utility Prompts (No Agent Specified)

**`/commit-and-push`**:

- Does NOT specify an agent in YAML frontmatter
- Works with whatever agent you're currently using
- **Why?** Git operations are context-independent - committing works the same whether you're using the TDD agent, review agent, or any other agent
- **Teaching**: Some utilities are truly universal and don't need specialized context

#### When to Use Each Pattern?

**Specify AGENT (Auto-Switch) when:**

- The task always needs the same specialized context
- You want to reduce cognitive load (no manual agent switching)
- The agent choice is obvious and unchanging
- Example: execution → TDD, validation → review

**Use NO AGENT (Universal) when:**

- The task is context-independent
- It works the same way regardless of agent
- Multiple agents would provide identical behavior
- Example: Git operations, file management

**Key Insight**: This is the power of prompt files! Most prompts should be "smart" about context (auto-switch), but truly universal utilities don't need agent specification. You'll use auto-switching far more often!

---

### :keyboard: Activity: Test Your Workflow System (Optional)

Want to explore your new workflow system before moving forward? Try these:

1. **Test Agents:**
   - Switch to `tdd-developer` agent and ask: `What's the first step in fixing a failing test?`
   - Switch to `code-reviewer` agent and ask: `How should I approach fixing multiple lint errors?`
   - Switch to `test-engineer` agent and ask: `Create UI tests for create/edit/toggle/delete and error-state handling.`

2. **Test Prompt Auto-Switching:**
   - With ANY agent, type `/validate-step 5-0`
   - Watch it automatically switch to `code-reviewer` agent and check your success criteria!

3. **Test Required UI Testing Prompts:**
   - First run `npm run test:ui:install --workspace=frontend` (required)
   - In Ubuntu/Linux environments, this install step must include system dependencies (`--with-deps`) before any Playwright run
   - Run `/create-ui-tests`
   - Run `/run-ui-tests`
   - Confirm required UI journeys are covered and passing

> 💡 **Skip this if you want**: The GitHub Actions workflow will validate everything automatically when you push. You'll know if anything is missing!

### :keyboard: Activity: Commit and Push Your Customizations

1. Now use the agentic workflow you just built! In Copilot Chat, type:

   ```text
   /commit-and-push
   ```

2. When prompted for the branch name, provide:

   ```text
   feature/agentic-workflow
   ```

3. Watch as Copilot (using project instructions):
   - Analyzes your changes with `git diff`
   - Generates a descriptive commit message
   - Creates and commits to the feature branch
   - Pushes to GitHub

4. **Wait for the workflow to complete** - GitHub Actions will post Step 5-1 instructions to this issue!

---

## What You Just Did

🎉 **You bootstrapped a complete agentic workflow system!**

You've set up the foundational infrastructure for **autonomous AI development**:

### Memory Layer

- **Project Instructions** (`.github/copilot-instructions.md`): AI can now access project documentation, patterns, and workflow principles across all conversations - this is the **persistent memory** that connects AI to your existing context from Sessions 2-4

### Agent Layer

- **TDD Developer Mode**: Specialized mode for Red-Green-Refactor cycles
- **Code Reviewer Mode**: Specialized mode for systematic code quality workflows
- **Workflow Utilities**: Shared gh CLI and Git knowledge available to all modes

### Interface Layer

- **Five Prompt Files**: User-friendly slash commands (`/execute-step`, `/commit-and-push`, `/validate-step`, `/create-ui-tests`, `/run-ui-tests`) that trigger autonomous workflows with simple commands

### The Bootstrap Pattern

You used **AI to build AI infrastructure** (`copilot-customization` → everything else):

- **Memory System** (persistent + working) enables knowledge persistence and learning
- **Specialized Agents** focus on specific workflow stages (TDD, code review)
- **Shared Utilities** (gh CLI, Git workflows) available to all modes via project instructions
- **User Interfaces** (prompt files) provide accessible entry points

**You created infrastructure-as-code for AI workflows** - version controlled, shareable, and reusable across your team!

### Ready for Agentic Development

With this system bootstrapped, you're now ready to:

- **Step 5-1**: Use TDD Developer mode for Red-Green-Refactor cycles
- **Step 5-2**: Use Code Reviewer mode for systematic lint fixes
- **Step 5-3**: Use both modes for frontend implementation
- **Throughout**: Capture discoveries in working memory

The infrastructure you just created will support all of these workflows!

---

## Pro Tips for Real-World Usage

### When to Use Each Agent

Throughout Session 5 (and in your real projects), switch agents based on your task:

- **`tdd-developer`**: When applying TDD principles - whether writing tests first for new features, fixing failing tests, or implementing incrementally with test-driven thinking (even manual testing)
- **`code-reviewer`**: When addressing lint errors, refactoring, improving code quality
- **`copilot-customization`**: When creating more custom agents or instructions
- **Default agent (no custom)**: When you need general help or a fresh perspective
- **All agents** have access to workflow utilities (gh CLI, Git workflows) from project instructions

### Team Collaboration

Since these are files in `.github/`, they're:

- **Version controlled**: Track changes, review updates
- **Shared automatically**: Everyone on the team gets the same AI context
- **Customizable per project**: Different standards for different codebases
- **Discoverable**: New team members instantly get AI assistance aligned with team practices

### Expanding Your Customization

After this session, consider creating:

- **More agents**: Security review, performance analysis, accessibility auditing
- **Instructions files**: Specific to file types (`.instructions.md` with `applyTo` patterns)
- **Prompt files**: Reusable prompts for common tasks (`.prompt.md`)
- **MCP integrations**: Connect to databases, APIs, custom tools

### Workflow Automation with Prompt Files

This repository includes **three powerful prompt files** that demonstrate agentic workflows:

#### `/execute-step` - Autonomous Step Execution

Run this prompt to have Copilot **read instructions from a GitHub Issue and execute them autonomously**:

1. Open Copilot Chat in Agent mode
2. Type `/execute-step 5-0` and press Enter
3. Watch as Copilot reads the instructions and executes each activity
4. Review the results and proceed to validation

**Why this matters**: This showcases how AI can follow documented procedures autonomously, a key pattern in DevOps and automation workflows.

#### `/commit-and-push` - Smart Git Workflow

Run this prompt to have Copilot **analyze your changes and push to your specified branch**:

1. After completing work on a step
2. Type `/commit-and-push` in Copilot Chat
3. When prompted, provide the branch name (e.g., "feature/agentic-workflow")
   - 💡 **Important**: The prompt will **automatically create the branch** if it doesn't exist yet!
   - You don't need to run `git checkout -b` manually
4. Copilot will:
   - Check if the branch exists; create it if needed
   - Analyze your changes with `git diff`
   - Generate a meaningful commit message using conventional commit format
   - Stage all changes with `git add .`
   - Commit the changes to the specified branch
   - Push to GitHub (triggering the next step's workflow)

**Why this matters**: Demonstrates AI understanding of Git workflows, commit conventions, and branch strategies. The prompt handles the entire Git workflow for you!

#### `/validate-step` - Completion Verification

Run this prompt to **check if you've met all success criteria**:

1. When you think you've completed a step
2. Type `/validate-step 5-0`
3. Copilot will systematically check each criterion
4. Get a clear ✅/❌ report with specific guidance for any issues

**Why this matters**: Shows how AI can validate work against documented requirements, a crucial skill for CI/CD and quality assurance.

---

### 🚀 Try the Agentic Workflow (Optional Challenge)

**After creating your workflow automation mode and prompt files** (Activities 4 & 5), try completing this entire step using ONLY the slash commands:

1. **Read and execute**: `/execute-step 5-0`
2. **Validate completion**: `/validate-step 5-0`
3. **Create UI tests**: `/create-ui-tests`
4. **Run UI tests**: `/run-ui-tests`
5. **Commit and push**: `/commit-and-push` → provide `feature/agentic-workflow`
   - 💡 The prompt will create this branch automatically if it doesn't exist!
7. **Wait for automation**: GitHub Actions posts Step 5-1 to this issue

This demonstrates **true agentic development** - AI autonomously following documented procedures with human oversight! 🤖

> **Note**: If you skipped Activities 4 & 5, that's fine! You can complete the step manually and explore workflow automation in later steps.

---

## Success Criteria

To complete this step successfully:

- ✅ Created `.github/copilot-instructions.md` with workflow principles and doc links
- ✅ Created `.github/memory/README.md` explaining the memory system
- ✅ Created `.github/memory/session-notes.md` as historical session template
- ✅ Created `.github/memory/patterns-discovered.md` with pattern template
- ✅ Created `.github/memory/scratch/` directory with `.gitignore` (for ephemeral files)
- ✅ Created `.github/memory/scratch/working-notes.md` template for active session notes
- ✅ Created `.github/agents/tdd-developer.agent.md`
- ✅ Created `.github/agents/code-reviewer.agent.md`
- ✅ Created `.github/agents/test-engineer.agent.md`
- ✅ Created `.github/prompts/execute-step.prompt.md`
- ✅ Created `.github/prompts/commit-and-push.prompt.md`
- ✅ Created `.github/prompts/validate-step.prompt.md`
- ✅ Created `.github/prompts/create-ui-tests.prompt.md`
- ✅ Created `.github/prompts/run-ui-tests.prompt.md`
- ✅ Committed and pushed all customizations (including `package-lock.json`) to `feature/agentic-workflow` branch
- ✅ **GitHub Actions workflow automatically validates all required files and posts Step 5-1**

> 💡 **Automated Validation**: You don't need to manually verify file creation! The Step 5-1 workflow will check for all required files and notify you if anything is missing. If Step 5-1 appears in this issue, everything passed! ✨

---

## Key Takeaways

✨ **Agentic Architecture**: You built a multi-layered system (Memory → Modes → Prompts) where AI can work effectively within defined workflows

✨ **Persistent Memory**: `.github/copilot-instructions.md` acts as AI's memory, connecting it to your existing documentation, workflow patterns, and utilities

✨ **Specialized Agents**: Different agents optimized for specific workflow stages (TDD cycles, code quality loops)

✨ **Shared Knowledge**: Workflow utilities (gh CLI, Git workflows) are available to all modes through project instructions - no duplication needed

✨ **Meta-Development**: You used AI (`copilot-customization`) to build AI tools - a key pattern in agentic development

---

## Next Steps

Now that Copilot understands your TODO app and you have specialized workflow modes, let's put them to work!

In **Step 5-1**, you'll use your **`tdd-developer`** mode to systematically fix failing backend tests through Red-Green-Refactor cycles.

**Ready?** Once you see Step 5-1 instructions posted to this issue, you're ready to start iterative test-driven development! 🚀

---

> 💡 **Key Pattern**: Configure tools once, benefit throughout the project lifecycle.