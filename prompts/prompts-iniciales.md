## Prompt 1 — Full-stack codebase analysis

You are a senior full-stack codebase analysis agent.

Your task is to analyze the `frontend` and `backend` folders of this monorepo.

STRICT SCOPE
This is a full-stack analysis task covering both frontend and backend.

You must:
- inspect `frontend/**` and `backend/**`
- document frontend and backend separately within each section
- avoid speculative recommendations

The goal is not to create a full plan yet.
The goal is to produce a compact analysis that captures only:
1. code graph (frontend + backend)
2. coding standards (frontend + backend)
3. styling standards (frontend only)
4. API / data layer standards (backend only)
5. what is currently implemented (frontend + backend)

MANDATORY OUTPUT SPLIT
Split the output into two documentation tracks:
1. AI agent documentation
2. human-readable documentation

REQUIRED FILE OUTPUTS
Create or update exactly these files:
- `frontend/AGENTS.md`
- `backend/AGENTS.md`
- `docs/fullstack-analysis.md`

Do not create other files.

PURPOSE OF EACH FILE

1. `frontend/AGENTS.md`
This file is for coding agents working on the frontend.
It should be operational, explicit, and compact.
It should help another agent quickly understand the frontend structure and conventions.

2. `backend/AGENTS.md`
This file is for coding agents working on the backend.
It should be operational, explicit, and compact.
It should help another agent quickly understand the backend structure, API conventions, and data layer.

3. `docs/fullstack-analysis.md`
This file is for humans.
It should be concise, high-signal, and easy to scan.
It should contain sections for both frontend and backend, describing only what exists today.

ANALYSIS FOCUS

A. Code graph (frontend)
Identify:
- main apps or packages inside `frontend`
- major modules and folders
- dependency relationships between them
- important shared components or utility layers

B. Code graph (backend)
Identify:
- main apps or packages inside `backend`
- major modules and folders
- dependency relationships between them
- shared middleware, utilities, or configuration layers
- Prisma schema models and their relationships

C. Coding standards (frontend)
Identify the standards already used in the frontend codebase, such as:
- naming conventions
- file organization patterns
- component structure conventions
- hooks/query/state patterns
- TypeScript usage patterns
- linting and formatting setup if present

D. Coding standards (backend)
Identify the standards already used in the backend codebase, such as:
- framework and routing conventions
- controller/service/repository patterns
- middleware patterns
- validation approach
- error handling conventions
- TypeScript usage patterns
- linting and formatting setup if present
- testing patterns

E. Styling standards (frontend only)
Identify the styling approach already used, such as:
- CSS modules
- Tailwind
- styled-components
- design system usage
- spacing, layout, color, and component styling patterns
- UI composition conventions

F. API / data layer standards (backend)
Identify:
- REST or GraphQL conventions
- request/response format
- authentication/authorization approach
- database access patterns (Prisma raw vs ORM)
- migration strategy

G. Current implementation (frontend)
Describe only what is already implemented now, including:
- existing pages and routes
- candidate-related UI if present
- detail/list/table/board patterns
- filters/search/tabs/modals/drawers if present
- reusable feature patterns already in the frontend

H. Current implementation (backend)
Describe only what is already implemented now, including:
- existing API endpoints and their purposes
- database models and relationships
- background jobs or scheduled tasks if present
- file upload handling if present
- seed data or demo data setup

DO NOT
- do not create an implementation plan
- do not suggest new features or endpoints
- do not propose schema changes
- do not write a product spec
- do not include low-value repo dumps
- do not describe code that does not exist

REQUIRED OUTPUTS

1. Full-Stack Overview
A short summary of the monorepo structure — what the frontend and backend each contain and how they connect.

2. Relevant Structure
Trimmed trees of the important folders only — one for `frontend/` and one for `backend/`.

3. Dependency Graph
Provide Mermaid graphs for:
- high-level frontend package/module relationships
- major folder/module relationships in the frontend main app
- high-level backend package/module relationships
- major folder/module relationships in the backend main app
- frontend-to-backend API relationship (which frontend modules call which backend endpoints)

4. AI Agent Documentation
Write this into `frontend/AGENTS.md` and `backend/AGENTS.md`

Use these exact sections for `frontend/AGENTS.md`:
# Frontend Agent Guide
## Scope
## Frontend Structure
## Dependency Graph
## Coding Standards
## Styling Standards
## Current Implementation
## Validation Commands

Use these exact sections for `backend/AGENTS.md`:
# Backend Agent Guide
## Scope
## Backend Structure
## Dependency Graph
## Coding Standards
## API Conventions
## Data Layer
## Current Implementation
## Validation Commands

Requirements for both:
- concise
- operational
- scoped to their respective folder
- based only on observed code

5. Human Documentation
Write this into `docs/fullstack-analysis.md`

Use these exact sections:
# Full-Stack Analysis
## Overview
## Frontend Structure
## Backend Structure
## Frontend Code Graph
## Backend Code Graph
## Frontend Coding Standards
## Backend Coding Standards
## Frontend Styling Standards
## Backend API / Data Standards
## Frontend — What Exists Today
## Backend — What Exists Today
## Integration Points

Requirements:
- very high signal-to-noise ratio
- concise
- human-readable
- no unnecessary repetition
- only observed facts

COMPLETION CHECKLIST
Your task is complete only if all are true:
- `frontend/` and `backend/` were both analyzed
- `frontend/AGENTS.md` was created or updated
- `backend/AGENTS.md` was created or updated
- `docs/fullstack-analysis.md` was created or updated
- all three files contain the required sections
- the final response includes exact file paths and status

## Prompt 2 — E2E tests for Position Detail interface

You are a senior QA automation engineer.

Your task is to produce an E2E test plan and implementation for the **Position Detail interface** (`/positions/:id` kanban board) using Cypress.

STRICT SCOPE
This task covers only the Position Detail page at route `/positions/:id`.
- the kanban board with columns per interview step
- candidate cards with name and average score
- drag-and-drop to move candidates between stages
- the offcanvas candidate detail panel
- back-navigation to `/positions`

Do NOT test:
- the Positions listing page
- the Add Candidate form
- the Dashboard
- backend API behavior in isolation (test through the UI)

INPUT DOCUMENTS
Read these existing files before planning:
- `docs/fullstack-analysis.md` — for architecture, component relationships, and API integration points
- `frontend/AGENTS.md` — for frontend structure, component details, and styling patterns

OUTPUT FILES
Create these files:

1. `docs/e2e-plan-position-detail.md`
A human-readable E2E test plan document.

2. `cypress/e2e/position-detail.cy.ts` (or appropriate subfolder)
The actual Cypress test file(s).

Do not create other files.

OUTPUT 1 — E2E Test Plan (`docs/e2e-plan-position-detail.md`)

Use these exact sections:

# E2E Test Plan — Position Detail

## Scope
## Test Environment & Prerequisites
## Test Data Setup
## Test Scenarios

### SCENARIO 1 — Position Page Load

Verify that:
- the position title is displayed correctly
- columns for each hiring phase are rendered
- candidate cards appear in the correct column matching their current stage

Sub-scenarios:
- **Happy path:** Page loads with valid data — title visible, N columns rendered, candidates in correct column.
- **Loading state:** Loading indicator is shown while APIs are pending.
- **Error state (interview flow):** `GET /positions/:id/interviewflow` fails — error is handled without breaking the UI.
- **Error state (candidates):** `GET /positions/:id/candidates` fails — error is handled without breaking the UI.
- **Empty state:** Position has 0 candidates — columns render empty.

### SCENARIO 2 — Candidate Stage Change

Simulate dragging a candidate card from one column to another. Verify that:
- the candidate card visually moves to the new column
- the candidate's stage is correctly updated in the backend via `PUT /candidates/:id`
- the PUT request body contains `{ applicationId, currentInterviewStep }`

Sub-scenarios:
- **Happy path:** Valid drag from source column to target column — card appears in target, disappears from source, PUT is called.
- **API error on drop:** `PUT /candidates/:id` fails (400/500) — card reverts to original column (optimistic rollback).
- **Drop outside board:** Card does not move when dropped outside any column.
- **Drop on same column:** Dragging and dropping on the same column does not change state.

## Test Matrix
## Page Object / Selectors Plan
## Risks & Assumptions

Requirements:
- human-readable
- covers exactly the 2 mandatory scenarios (Position Page Load + Candidate Stage Change)
- sub-scenarios for happy path, edge cases, and error states
- only the Position Detail page components

Key components under test (from `frontend/AGENTS.md` and `docs/fullstack-analysis.md`):

| Route | Component | Key elements |
|---|---|---|
| `/positions/:id` | PositionDetails.js | Kanban board, stage columns, candidate cards, back button |
| — | StageColumn.js | Droppable columns per interview step |
| — | CandidateCard.js | Draggable cards with name + rating |
| — | CandidateDetails.js | Offcanvas panel with candidate profile, education, experience, interviews |

API dependencies (from `docs/fullstack-analysis.md` Integration Points):

| Frontend Component | Backend Endpoint | Method |
|---|---|---|
| PositionDetails.js | `/positions/:id/interviewflow` | GET |
| PositionDetails.js | `/positions/:id/candidates` | GET |
| PositionDetails.js (drag) | `/candidates/:id` | PUT |
| CandidateDetails.js | `/candidates/:id` | GET |
| CandidateDetails.js (new interview) | `/candidates/:id/interviews` | POST (missing — see Risks) |

OUTPUT 2 — Cypress Tests (`cypress/e2e/position-detail.cy.ts`)

Use these exact `describe` blocks in the test file. Each maps to one of the two mandatory scenarios:

```typescript
// File: cypress/e2e/position-detail.cy.ts

describe('Position Detail Page', () => {

  describe('Scenario 1: Position Page Load', () => {

    it('displays the position title correctly', () => {
      // Stub GET /positions/:id/interviewflow → { positionName, interviewFlow }
      // Stub GET /positions/:id/candidates → [{ fullName, currentInterviewStep, candidateId, applicationId, averageScore }]
      // Visit /positions/1
      // Assert heading contains positionName
    });

    it('renders a column for each hiring phase', () => {
      // Same stubs
      // Assert N stage columns rendered (one per interviewStep)
      // Column headers match step names (e.g., "Initial Screening", "Technical Interview")
    });

    it('places candidate cards in the correct column matching their current stage', () => {
      // Candidates with different currentInterviewStep values
      // Assert each card renders inside the column matching its step
      // Card shows fullName and averageScore (rating)
    });

    it('shows a loading indicator while data is being fetched', () => {
      // Delay intercept responses
      // Assert loading indicator or skeleton is visible
    });

    it('handles interview flow API error gracefully', () => {
      // Stub GET /positions/:id/interviewflow → 500
      // Assert error message or fallback UI
    });

    it('handles candidates API error gracefully', () => {
      // Stub GET /positions/:id/candidates → 500
      // Assert error message or fallback UI (columns still render)
    });

    it('renders empty columns when there are no candidates', () => {
      // Stub GET /positions/:id/candidates → []
      // Assert columns render with zero cards
    });

  });

  describe('Scenario 2: Candidate Stage Change', () => {

    it('moves the card to the target column on drag and drop', () => {
      // Stub GET endpoints with known data (candidate in step A)
      // Stub PUT /candidates/:id → 200
      // Trigger drag from column A → column B
      // Assert card is now in column B
      // Assert card is no longer in column A
    });

    it('calls PUT /candidates/:id with the correct request body', () => {
      // Stub GET endpoints
      // cy.intercept('PUT', '/candidates/*').as('updateStage')
      // Trigger drag from column A → column B
      // cy.wait('@updateStage')
      // Assert request body has { applicationId, currentInterviewStep }
    });

    it('reverts the card to the original column when PUT fails with 500', () => {
      // Stub GET endpoints
      // Stub PUT /candidates/:id → 500
      // Trigger drag from column A → column B
      // Assert card remains in column A (optimistic rollback)
    });

    it('does not move the card when dropped outside any column', () => {
      // Stub GET endpoints
      // Trigger drag and drop outside droppable area
      // Assert card stays in original column
    });

    it('does not change state when dropped on the same column', () => {
      // Stub GET endpoints
      // Trigger drag and drop within same column
      // Assert card stays in same column, no PUT called
    });

  });

});
```

Requirements:
- Cypress with TypeScript
- stub API responses for deterministic tests (use `cy.intercept`)
- cover both mandatory scenarios with all listed sub-scenarios
- test loading, empty, error, and success states for every API call
- test drag-and-drop with `cy.get(element).trigger('dragstart')` + `cy.get(target).trigger('drop')` or Cypress plugin
- assert UI updates (cards move between columns)
- assert API call on drag-drop (`PUT /candidates/:id`)
- assert request body contains `applicationId` and `currentInterviewStep` on PUT
- clean test data via `beforeEach` with `cy.intercept`
- no test-to-test state leakage

APPROACH

Read the analysis docs first. Then work in three phases:

**Phase 1 — Plan**
Write `docs/e2e-plan-position-detail.md` first. Define all scenarios, selectors, and test data.

**Phase 2 — Implement**
Write `cypress/e2e/position-detail.cy.ts`. Use `cy.intercept` for all API stubs. Map selectors to the actual Bootstrap components used (from `frontend/AGENTS.md` — react-bootstrap `Card`, `Form`, `Button`, `Offcanvas`, etc.).

**Phase 3 — Verify**
Run the tests and confirm they pass. Fix any failures.

COMPLETION CHECKLIST
Your task is complete only if all are true:
- `docs/e2e-plan-position-detail.md` was created with all required sections
- `cypress/e2e/position-detail.cy.ts` was created
- tests stub all API calls with `cy.intercept`
- **Scenario 1 (Position Page Load):** all sub-scenarios implemented — title, columns, candidates in correct column, loading, error flow, error candidates, empty
- **Scenario 2 (Candidate Stage Change):** all sub-scenarios implemented — card moves to target column, PUT body verified, rollback on 500, drop outside, drop same column
- drag-and-drop interaction is tested with UI assertions + API assertion
- tests pass when executed
- the final response includes exact file paths and status

## Prompt 3 — Implement E2E tests for Position Detail (execution mode)

This prompt is the refined execution version of Prompt 2. It incorporates all findings from the codebase analysis and the E2E plan. Use this when you are ready to write and run the actual Cypress tests.

You are a senior QA automation engineer. Your task is to implement and run E2E Cypress tests for the Position Detail page (`/positions/:id`).

### Input Documents

Read these before starting:
- `docs/e2e-plan-position-detail.md` — test scenarios, matrix, selectors, risks
- `docs/fullstack-analysis.md` — architecture, API integration points
- `frontend/AGENTS.md` — component structure, styling patterns

### Files to Create

1. `frontend/cypress.config.ts` — Cypress configuration
2. `frontend/cypress/tsconfig.json` — TypeScript config for Cypress
3. `frontend/cypress/fixtures/position-detail.json` — mock data
4. `frontend/cypress/support/commands.ts` — custom commands
5. `frontend/cypress/e2e/position-detail.cy.ts` — the test file

Do not create other files. Do not modify source components.

### Step 1 — Install & Configure

Install Cypress in `frontend/`:
```bash
cd frontend && npm install --save-dev cypress @types/node
```

Create `frontend/cypress.config.ts`:
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/commands.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});
```

Create `frontend/cypress/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress", "node"],
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["**/*.ts"]
}
```

Add scripts to `frontend/package.json`:
```json
"cypress:open": "cypress open",
"cypress:run": "cypress run"
```

### Step 2 — Create Fixtures

Create `frontend/cypress/fixtures/position-detail.json` with these exact shapes:

**interviewFlow:**
```json
{
  "interviewFlow": {
    "positionName": "Senior Full-Stack Engineer",
    "interviewFlow": {
      "id": 1,
      "description": "Standard process",
      "interviewSteps": [
        { "id": 1, "interviewFlowId": 1, "interviewTypeId": 1, "name": "Initial Screening", "orderIndex": 1 },
        { "id": 2, "interviewFlowId": 1, "interviewTypeId": 2, "name": "Technical Interview", "orderIndex": 2 },
        { "id": 3, "interviewFlowId": 1, "interviewTypeId": 3, "name": "Manager Interview", "orderIndex": 3 }
      ]
    }
  }
}
```

**candidates:**
```json
[
  { "fullName": "John Doe", "currentInterviewStep": "Initial Screening", "candidateId": 1, "applicationId": 1, "averageScore": 4 },
  { "fullName": "Jane Smith", "currentInterviewStep": "Technical Interview", "candidateId": 2, "applicationId": 2, "averageScore": 5 }
]
```

**candidateDetail:**
```json
{
  "id": 1, "firstName": "John", "lastName": "Doe", "email": "john@example.com",
  "phone": "123456789", "address": "123 Main St",
  "educations": [{ "id": 1, "institution": "University A", "title": "BSc CS", "startDate": "2015-09-01T00:00:00.000Z", "endDate": "2019-06-01T00:00:00.000Z" }],
  "workExperiences": [{ "id": 1, "company": "Company A", "position": "Dev", "description": "Worked", "startDate": "2019-07-01T00:00:00.000Z", "endDate": "2021-08-01T00:00:00.000Z" }],
  "resumes": [{ "id": 1, "filePath": "/resumes/john.pdf", "fileType": "application/pdf", "uploadDate": "2024-01-01T00:00:00.000Z" }],
  "applications": [{ "id": 1, "position": { "id": 1, "title": "Senior Full-Stack Engineer" }, "applicationDate": "2024-01-15T00:00:00.000Z", "interviews": [] }]
}
```

### Step 3 — Write the Test File

Create `frontend/cypress/e2e/position-detail.cy.ts` with the following structure. Key details from the actual source code:

**API stubs (beforeEach):**
```typescript
cy.intercept('GET', '/positions/1/interviewflow', { fixture: 'position-detail/interviewFlow' }).as('getInterviewFlow');
cy.intercept('GET', '/positions/1/candidates', { fixture: 'position-detail/candidates' }).as('getCandidates');
```

**Warning about nested response path:** The component reads `data.interviewFlow.interviewFlow.interviewSteps` — the fixture response must wrap in `{ interviewFlow: { ... } }`. See the fixture above.

**Selectors (from actual component markup):**
- Position title: `cy.get('h2')`
- Column headers (step names): `cy.get('.card-header.text-center')` — one per column
- Candidate card name: `.card-title`
- Candidate rating emoji: `span[role="img"][aria-label="rating"]`
- Back button: `button:contains("Volver a Posiciones")`
- Offcanvas: `.offcanvas`, `.offcanvas-body`
- Offcanvas close button: `.offcanvas-header .btn-close`

**Loading state:** PositionDetails.js has no explicit loading skeleton/spinner. It renders with empty `<h2>{positionName}</h2>` before data loads. Test by delaying the `cy.intercept` response with `delay: 2000` and asserting `h2` is empty (or a null check). If no loading indicator exists, note this and skip or document.

**Error state:** The component catches errors and logs them with `console.error`. It does NOT render an error message to the DOM. Columns will not render if interview flow fails (state remains `[]`). Test by asserting that no columns render when the flow fails.

**Drag-and-drop (critical implementation detail):**

The component uses `react-beautiful-dnd`. Cypress does not natively support HTML5 drag-and-drop. Use this approach:

```typescript
// Simulate drag by firing native drag events on the draggable element
const dragAndDrop = (sourceSelector: string, targetSelector: string) => {
  const dataTransfer = new DataTransfer();

  cy.get(sourceSelector).should('exist').then((sourceEl) => {
    const source = sourceEl[0];
    source.dispatchEvent(new DragEvent('dragstart', { dataTransfer, bubbles: true }));
  });

  cy.get(targetSelector).should('exist').then((targetEl) => {
    const target = targetEl[0];
    target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true }));
  });
};
```

**Important:** react-beautiful-dnd uses `dragHandleProps`. The `draggableId` is `candidate.id` (which is `candidateId.toString()`). The `droppableId` is the column index as a string. The source and destination indices matter for the `onDragEnd` result.

**Known issue — no optimistic rollback:** The current `onDragEnd` mutates state immediately via `splice()` and calls `updateCandidateStep()`. If PUT fails, the error is silently logged — the card stays in the new column. The "revert on error" test will fail. This is a real bug. Decide: (a) skip that sub-test and document, or (b) add rollback logic to the component.

**Tests to implement:**

1. **Scenario 1 — Position Page Load (7 tests)**
   - Title renders from `interviewFlow.positionName`
   - 3 columns rendered with correct headers
   - "John Doe" card in column 1 (Initial Screening), "Jane Smith" in column 2 (Technical Interview)
   - Loading state (h2 empty or placeholder)
   - Interview flow 500 error → error state
   - Candidates 500 error → columns still render (empty)
   - Empty candidates → columns render, 0 cards

2. **Scenario 2 — Candidate Stage Change (5 tests)**
   - Drag "John Doe" from column 1 to column 2 → card moves
   - Drag triggers `PUT /candidates/1` with body `{ applicationId: 1, currentInterviewStep: <targetStepId> }`
   - PUT fails 500 → card stays in new column (known limitation, document)
   - Drop outside board → card stays
   - Drop same column → card stays, no PUT

3. **Scenario 3 — Candidate Detail Panel (2 tests)**
   - Click "John Doe" card → offcanvas opens with "John Doe" heading
   - Close offcanvas → offcanvas hidden

4. **Scenario 4 — Navigation (1 test)**
   - Click "Volver a Posiciones" → URL becomes `/positions`

### Step 4 — Run & Fix

```bash
cd frontend
./node_modules/.bin/cypress run  # headless
# or
npm run cypress:open              # interactive
```

Fix failures:
- If drag-and-drop does not trigger events, try `cypress-real-events` or `@4tw/cypress-drag-drop` plugin
- If tests fail due to async timing, add `cy.wait('@getInterviewFlow')` and `cy.wait('@getCandidates')` before assertions
- If the `h2` is empty during loading, there is no explicit loading indicator — skip loading test

### Completion Checklist

- [ ] Cypress installed and configured in `frontend/`
- [ ] Fixtures created with exact response shapes
- [ ] All 4 scenarios implemented (15 total sub-tests)
- [ ] `cy.intercept` used for all API stubs
- [ ] Drag-and-drop uses native DOM events (no plugin)
- [ ] Tests pass with `npx cypress run` or documented known failures
- [ ] No modifications to source components

