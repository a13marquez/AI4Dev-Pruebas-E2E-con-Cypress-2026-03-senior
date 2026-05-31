# Full-Stack Analysis

## Overview

Monorepo for a candidate/position tracking system ("AI4Devs recruitment"). Two independent apps:

- **Frontend (React 18 + CRA):** SPA with Bootstrap UI, drag-and-drop kanban, candidate forms, and position listings. Communicates with backend via inline `fetch()` to `localhost:3010`.
- **Backend (Express 4 + Prisma 5):** REST API with PostgreSQL, file upload, manual validation, and domain model classes wrapping Prisma operations.

No authentication, no state management library, no shared types between frontend and backend.

## Frontend Structure

```text
frontend/src/
├── components/
│   ├── AddCandidateForm.js
│   ├── CandidateCard.js
│   ├── CandidateDetails.js
│   ├── FileUploader.js
│   ├── PositionDetails.js
│   ├── Positions.tsx
│   ├── RecruiterDashboard.js
│   └── StageColumn.js
├── services/
│   └── candidateService.js
├── App.js
├── index.tsx
└── index.css
```

## Backend Structure

```text
backend/src/
├── index.ts
├── routes/
│   ├── candidateRoutes.ts
│   └── positionRoutes.ts
├── presentation/controllers/
│   ├── candidateController.ts
│   └── positionController.ts
├── application/
│   ├── services/
│   │   ├── candidateService.ts
│   │   ├── fileUploadService.ts
│   │   └── positionService.ts
│   └── validator.ts
└── domain/models/
    ├── Application.ts
    ├── Candidate.ts
    ├── Company.ts
    ├── Education.ts
    ├── Employee.ts
    ├── Interview.ts
    ├── InterviewFlow.ts
    ├── InterviewStep.ts
    ├── InterviewType.ts
    ├── Position.ts
    ├── Resume.ts
    └── WorkExperience.ts
```

## Frontend Code Graph

```mermaid
graph TD
    A[App.js / BrowserRouter] --> B[/]
    A --> C[/add-candidate]
    A --> D[/positions]
    A --> E[/positions/:id]
    B --> F[RecruiterDashboard.js]
    C --> G[AddCandidateForm.js]
    G --> H[FileUploader.js]
    D --> I[Positions.tsx]
    E --> J[PositionDetails.js]
    J --> K[StageColumn.js]
    K --> L[CandidateCard.js]
    J --> M[CandidateDetails.js]
```

- `Positions.tsx` fetches `/positions` and renders a filter UI (filters are not wired to the backend).
- `PositionDetails.js` fetches `/positions/:id/interviewFlow` and `/positions/:id/candidates`, then renders a kanban with `react-beautiful-dnd`. Moving a card triggers `PUT /candidates/:id`.
- `CandidateDetails.js` fetches `GET /candidates/:id` and renders an offcanvas panel. It also contains a "new interview" form that POSTs to `/candidates/:id/interviews` — this endpoint does not exist on the backend.

## Backend Code Graph

```mermaid
graph TD
    A[index.ts] --> B[/candidates]
    A --> C[/positions]
    A --> D[/upload]
    B --> E[candidateRoutes.ts]
    C --> F[positionRoutes.ts]
    E --> G[candidateController.ts]
    F --> H[positionController.ts]
    G --> I[candidateService.ts]
    H --> J[positionService.ts]
    I --> K[domain/models/Candidate.ts]
    I --> L[domain/models/Application.ts]
    J --> M[Prisma Client]
    K --> M
    L --> M
    I --> N[validator.ts]
```

- Domain model classes (e.g., `Candidate`, `Application`) encapsulate Prisma CRUD and have their own `PrismaClient` instances.
- `positionService.ts` formats aggregated data (e.g., candidate average score from interviews).

## Frontend Coding Standards

- **Mixed JS/TS:** `Positions.tsx` is TypeScript with an inline `Position` interface; all other components are `.js`.
- **Inline fetch:** Components call `fetch()` directly with hardcoded `http://localhost:3010` URLs.
- **Local state only:** `useState` and `useEffect`. No Redux, no Context.
- **Default exports:** All components are default-export function components.
- **Bootstrap components:** Heavy use of `react-bootstrap` (`Container`, `Row`, `Col`, `Card`, `Form`, `Button`, `Offcanvas`).
- **Error handling:** `console.error` in catch blocks; no global boundary.

## Backend Coding Standards

- **TypeScript strict:** `tsconfig.json` with `"strict": true`, CommonJS output, ES5 target.
- **Layered architecture:** Express routes → controllers → application services → domain models → Prisma.
- **Class-based domain models:** Each model has `save()`, `findOne()`, and sometimes static factory methods. Models instantiate their own `PrismaClient`.
- **Manual validation:** `validator.ts` with regex checks. No schema library.
- **Controller error patterns:** Try/catch, return `{ message, error }` with status 400/404/500.
- **Testing:** Jest 29 + ts-jest. Controllers and services have `.test.ts` files.
- **Linting:** ESLint with `prettier/recommended` only.

## Frontend Styling Standards

- **Bootstrap 5** via `react-bootstrap` and imported `bootstrap/dist/css/bootstrap.min.css`.
- **Utility classes:** `shadow-sm`, `mb-4`, `text-center`, `bg-success`, `d-flex`, `justify-content-between`.
- **No CSS Modules, Tailwind, or styled-components.**
- **Global CSS:** `index.css` is a minimal reset (body margin + font-family).
- **Inline styles:** Used only for small dynamic values (logo width, star color).
- **Responsive layout:** Bootstrap grid system (`md={4}`, `md={6}`). No custom media queries.

## Backend API / Data Standards

- **REST over JSON.** No GraphQL, no versioning in URL.
- **OpenAPI spec:** `api-spec.yaml` documents the candidate endpoints.
- **Database:** PostgreSQL via Prisma ORM. 11 models with proper relations.
- **Migrations:** Prisma SQL migrations in `prisma/migrations/`.
- **Seeding:** `prisma/seed.ts` for demo data.
- **File upload:** Multer with disk storage (`../uploads/`), PDF/DOCX only, 10MB limit.
- **CORS:** Origin restricted to `http://localhost:3000`.
- **No auth, no rate limiting, no request logging middleware before routes.**

## Frontend — What Exists Today

**Pages/Routes:**
- `/` — Dashboard with logo and two navigation cards.
- `/add-candidate` — Form for candidate info, educations, work experiences, and CV upload.
- `/positions` — Card grid of visible positions. Filter UI present but not wired.
- `/positions/:id` — Kanban board: columns = interview steps, cards = candidates with average score. Drag-and-drop to move stages.

**UI Patterns:**
- Kanban board (`react-beautiful-dnd`)
- Offcanvas detail panel (`CandidateDetails`)
- Dynamic add/remove form sections (educations, experiences)
- File upload with spinner feedback

**Not implemented:**
- Working filters/search on Positions page.
- Backend endpoint for interview creation (frontend has the UI).

## Backend — What Exists Today

**API Endpoints:**
- `GET /positions` — list visible positions.
- `GET /positions/:id/candidates` — candidates per position with `fullName`, `currentInterviewStep`, `averageScore`.
- `GET /positions/:id/interviewflow` — position name + interview steps ordered by `orderIndex`.
- `POST /candidates` — create candidate with nested educations, work experiences, resume.
- `GET /candidates/:id` — full candidate profile with educations, experiences, resumes, applications, interviews.
- `PUT /candidates/:id` — update `currentInterviewStep` on the candidate's application.
- `POST /upload` — file upload (PDF/DOCX).

**Database (Prisma models):**
- Candidate, Education, WorkExperience, Resume
- Company, Employee
- InterviewType, InterviewFlow, InterviewStep
- Position, Application, Interview

**Seed data includes:** 1 company, 2 interview flows, 2 positions, 3 candidates, 3 applications, 3 interviews, 2 employees, 3 interview steps.

**Not implemented:**
- Interview creation endpoint.
- Authentication or authorization.
- Pagination.

## Integration Points

| Frontend Component | Backend Endpoint | Method |
|---|---|---|
| Positions.tsx | `/positions` | GET |
| PositionDetails.js | `/positions/:id/interviewflow` | GET |
| PositionDetails.js | `/positions/:id/candidates` | GET |
| PositionDetails.js (drag) | `/candidates/:id` | PUT |
| AddCandidateForm.js | `/candidates` | POST |
| FileUploader.js | `/upload` | POST |
| CandidateDetails.js | `/candidates/:id` | GET |
| CandidateDetails.js (new interview) | `/candidates/:id/interviews` | POST (missing) |
