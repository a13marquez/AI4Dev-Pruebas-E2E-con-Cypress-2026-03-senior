# E2E Test Plan — Position Detail

## Scope

Test the Position Detail page at route `/positions/:id` — a kanban board showing interview steps as columns and candidate cards within each column. Users can drag cards between columns to update candidate stage.

**In scope:**
- Kanban board rendering (columns per interview step, candidate cards with name + rating)
- Drag-and-drop to move candidates between stages
- API calls triggered by drag (PUT candidate stage)
- Candidate detail offcanvas panel
- Back-navigation to `/positions`

**Out of scope:**
- Positions listing page (`/positions`)
- Add Candidate form (`/add-candidate`)
- Dashboard (`/`)
- Backend API behavior in isolation

## Test Environment & Prerequisites

- **Frontend:** React 18 + CRA dev server at `http://localhost:3000`
- **Backend:** Not required — all API calls are stubbed via `cy.intercept`
- **Cypress:** Installed in `frontend/` with TypeScript support
- **Cypress config:** `baseUrl: http://localhost:3000`, test files in `cypress/e2e/`
- **No authentication:** App has no auth, all routes are public

## Test Data Setup

All API responses are stubbed in `beforeEach` using `cy.intercept`. No real backend or database is needed.

### Interview Flow Response (`GET /positions/:id/interviewflow`)

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

### Candidates Response (`GET /positions/:id/candidates`)

```json
[
  { "fullName": "John Doe", "currentInterviewStep": "Initial Screening", "candidateId": 1, "applicationId": 1, "averageScore": 4 },
  { "fullName": "Jane Smith", "currentInterviewStep": "Technical Interview", "candidateId": 2, "applicationId": 2, "averageScore": 5 }
]
```

### Candidate Detail Response (`GET /candidates/:id`)

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "123456789",
  "address": "123 Main St",
  "educations": [
    { "id": 1, "institution": "University A", "title": "BSc CS", "startDate": "2015-09-01T00:00:00.000Z", "endDate": "2019-06-01T00:00:00.000Z" }
  ],
  "workExperiences": [
    { "id": 1, "company": "Company A", "position": "Dev", "description": "Worked", "startDate": "2019-07-01T00:00:00.000Z", "endDate": "2021-08-01T00:00:00.000Z" }
  ],
  "resumes": [
    { "id": 1, "filePath": "/resumes/john.pdf", "fileType": "application/pdf", "uploadDate": "2024-01-01T00:00:00.000Z" }
  ],
  "applications": [
    { "id": 1, "position": { "id": 1, "title": "Senior Full-Stack Engineer" }, "applicationDate": "2024-01-15T00:00:00.000Z", "interviews": [] }
  ]
}
```

## Test Scenarios

### Scenario 1 — Position Page Load

| # | Sub-scenario | Precondition | Expected result |
|---|---|---|---|
| 1a | **Happy path** | Both APIs return valid data | Position title in `<h2>`, 3 columns with headers, 2 cards in correct columns |
| 1b | **Loading state** | Delay intercept responses by 2s | Loading indicator visible while APIs pending |
| 1c | **Error — interview flow** | `GET /positions/:id/interviewflow` → 500 | Error handled gracefully, console.error logged, UI does not crash |
| 1d | **Error — candidates** | `GET /positions/:id/candidates` → 500 | Error handled gracefully, columns still render (empty), UI does not crash |
| 1e | **Empty state** | `GET /positions/:id/candidates` → [] | Columns render with zero cards |

### Scenario 2 — Candidate Stage Change

| # | Sub-scenario | Precondition | Expected result |
|---|---|---|---|
| 2a | **Happy path** | Card in column A, `PUT /candidates/:id` → 200 | Card appears in column B, disappears from column A |
| 2b | **PUT body verification** | Same as 2a | `PUT /candidates/:id` called with `{ applicationId, currentInterviewStep }` |
| 2c | **API error** | `PUT /candidates/:id` → 500 | Card stays in original column (note: no explicit rollback in code — error is silently logged) |
| 2d | **Drop outside board** | Start drag but release outside droppable | Card stays in original column |
| 2e | **Drop on same column** | Drag within same column and release | Card stays in same column, no PUT called |

### Scenario 3 — Candidate Detail Panel (Bonus)

| # | Sub-scenario | Precondition | Expected result |
|---|---|---|---|
| 3a | **Open offcanvas** | Click on a candidate card | Offcanvas panel opens with candidate name, email, education, experience, resumes, applications |
| 3b | **Close offcanvas** | Offcanvas open | Clicking close or backdrop hides the offcanvas |

### Scenario 4 — Navigation

| # | Sub-scenario | Precondition | Expected result |
|---|---|---|---|
| 4a | **Back to positions** | Page loaded | Clicking "Volver a Posiciones" navigates to `/positions` |

## Test Matrix

| Scenario | Sub-scenarios | APIs stubbed | UI asserts | API asserts | Priority |
|---|---|---|---|---|---|
| 1. Page Load | 5 | 2 GETs | Title, columns, cards, loading, error | — | High |
| 2. Stage Change | 5 | 2 GETs + 1 PUT | Card position moves | PUT body | High |
| 3. Detail Panel | 2 | 1 GET | Offcanvas visibility, candidate data | — | Medium |
| 4. Navigation | 1 | 2 GETs | URL change to `/positions` | — | Medium |

## Page Object / Selectors Plan

Selectors are based on the actual Bootstrap/react-beautiful-dnd component structure observed in the source code.

| Element | React structure | CSS/HTML selector strategy |
|---|---|---|
| Position title | `<h2 className="text-center mb-4">` | `cy.get('h2')` |
| Stage columns | `<Col md={3}><Card>` | `cy.get('.card-header')` for headers; `cy.get('.card').eq(N)` for column cards |
| Column header | `<Card.Header className="text-center">` | `.card-header.text-center` |
| Candidate card | `<Card className="mb-2">` inside `<Card.Body>` | `.card-body > .card.mb-2` |
| Card name | `<Card.Title>` | `.card-title` |
| Rating | `<span role="img" aria-label="rating">` | `span[role="img"]` |
| Candidate detail | `<Offcanvas>` | `.offcanvas`, `.offcanvas-header`, `.offcanvas-body` |
| Back button | `<Button variant="link">` | `button:contains("Volver a Posiciones")` |
| Droppable | `<Droppable droppableId={index}>` | N/A — triggered via drag on draggable |
| Draggable | `<Draggable draggableId={candidate.id}>` | Drag source: card element inside column |
| Error state | N/A (console.error only) | Check window console or assert no crash |

## Risks & Assumptions

**Risks:**
1. **No optimistic rollback in current code.** `onDragEnd` calls `updateCandidateStep` which logs errors but does NOT revert the visual card move on failure. The test for "revert on error" will fail unless the code is fixed first. This is a real bug.
2. **react-beautiful-dnd HTML5 drag simulation** is unreliable in Cypress without a plugin. The test uses manual `trigger('dragstart')` + `trigger('drop')` on DOM elements. This may not trigger react-beautiful-dnd synthetic events correctly. Fallback: use `@4tw/cypress-drag-drop` plugin.
3. **`POST /candidates/:id/interviews` endpoint is missing** from the backend. The CandidateDetails component has a UI for this but it will fail on real API. Not in scope for these tests — stubbed or skipped.
4. **Concurrent fetch pattern.** `fetchInterviewFlow` and `fetchCandidates` run in parallel with no coordination. If interview flow fails, no columns render and candidates never load. Tests should stub both.
5. **Stale state after drag.** The component uses `stages[source.droppableId]` and `stages[destination.droppableId]` — the `droppableId` is the array `index` as a string, not the step ID. This works as long as the API returns steps in correct order.

**Assumptions:**
- Position ID `1` exists and is used for all tests
- Interview steps are returned in order by `orderIndex`
- Candidate `currentInterviewStep` matches the step `name` string (not the step ID)
- The frontend dev server runs on `http://localhost:3000`

**Out of scope for this plan:**
- Drag-and-drop with keyboard
- Multi-select or bulk operations
- Real backend integration testing
- Performance or visual regression testing
