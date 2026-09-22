# Project Tracker POC

<div align="center">
  <img src="packages/frontend/public/PT1.png" alt="Project Tracker logo" width="360" />
</div>

A lightweight project management prototype built with a React frontend and an Express backend. It is designed as a simple tracker for managing project status, owners, and delivery tasks.

## Overview

This application provides a practical project dashboard for:

- creating new projects
- assigning an owner
- tracking status as Not Started, In Progress, Postponed, or Completed
- selecting a project to view details and tasks
- adding, deleting, and updating task status
- starting, postponing, or completing a project

## Features

- Project list with live status summary cards
- Project detail panel for editing and lifecycle actions
- Task management linked to each project
- In-memory backend data for quick demo setup
- Frontend and backend validation through Jest and Playwright

## Tech Stack

- React 18
- Material UI
- TanStack Query
- Express.js
- Node.js
- Jest
- Playwright

## Project Structure

- `packages/frontend` — React dashboard and UI tests
- `packages/backend` — Express API and backend tests
- `docs/` — project and workflow documentation

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open the frontend in the browser at http://localhost:3000

The frontend is proxied to the backend API at http://localhost:3001.

## Available scripts

```bash
npm start
npm run test
npm run test:frontend
npm run test:backend
npm run test:ui
```

## Validation

The project includes:

- backend API tests via Jest
- frontend component tests via React Testing Library
- UI workflow tests via Playwright

## Notes

This repository is intentionally a compact POC and uses in-memory storage instead of a database so it can be demonstrated quickly and iterated on without setup overhead.
