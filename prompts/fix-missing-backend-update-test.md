# Fix Missing E2E Test: Verify Candidate Phase Backend Update

## Requirement

> Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id.

## What Is Missing

The current test suite verifies that the frontend **sends** a PUT request with the correct body (test `2b`), and that the card visually moves to the new column (test `2a`). However, it does **not** verify that the backend actually persists the update and that a subsequent page load reflects the new phase.

## What to Add

Add a new test (or extend test `2b`) that performs a full round-trip verification:

1. **Initial state:** Load `/positions/1` with John Doe in "Initial Screening".
2. **Action:** Drag John Doe to "Technical Interview".
3. **Assert PUT:** Verify `PUT /candidates/1` (or `/candidate/1` per requirement) is called with:
   ```json
   { "applicationId": 1, "currentInterviewStep": 2 }
   ```
4. **Simulate backend persistence:** The PUT intercept should return `200`. Then **re-stub** `GET /positions/1/candidates` to return John Doe with `"currentInterviewStep": "Technical Interview"`.
5. **Reload / refetch:** Reload the page (or trigger a refetch if the component supports it).
6. **Assert persisted state:** Verify John Doe is rendered in the "Technical Interview" column — proving the backend update was persisted.

## Endpoint Discrepancy Note

The original requirement states `PUT /candidate/:id` (singular), but the frontend source (`PositionDetails.js` line 61) calls `PUT /candidates/:id` (plural). 

- If the **requirement is correct**, the frontend has a bug — the test should stub `PUT /candidate/1` and document the mismatch.
- If the **code is correct**, the test should use `PUT /candidates/1` and document the requirement typo.

**Decision needed:** Align the test with whichever source of truth is canonical, and document the discrepancy in a code comment.

## Implementation Hints

```typescript
it('verifies candidate phase is persisted in backend after drag-and-drop', () => {
  // Stub PUT to return success
  cy.intercept('PUT', '**/candidates/1', { statusCode: 200 }).as('putCandidate');

  // Load page with initial data
  cy.visit('/positions/1');
  cy.wait('@getInterviewFlow');
  cy.wait('@getCandidates');

  // Drag card
  cy.dragCardToColumn('John Doe', 'Technical Interview');

  // Assert PUT was called with correct step
  cy.wait('@putCandidate').its('request.body').should('deep.equal', {
    applicationId: 1,
    currentInterviewStep: 2,
  });

  // Re-stub candidates to simulate backend persistence
  cy.intercept('GET', '**/positions/1/candidates', {
    body: [
      { fullName: 'John Doe', currentInterviewStep: 'Technical Interview', candidateId: 1, applicationId: 1, averageScore: 4 },
      { fullName: 'Jane Smith', currentInterviewStep: 'Technical Interview', candidateId: 2, applicationId: 2, averageScore: 5 }
    ]
  }).as('getCandidatesUpdated');

  // Reload page to fetch fresh data
  cy.reload();
  cy.wait('@getInterviewFlow');
  cy.wait('@getCandidatesUpdated');

  // Assert John Doe is now in Technical Interview after reload
  cy.contains('.card-header', 'Technical Interview')
    .closest('.card')
    .find('.card-title')
    .should('contain', 'John Doe');

  // Assert John Doe is NOT in Initial Screening anymore
  cy.contains('.card-header', 'Initial Screening')
    .closest('.card')
    .find('.card-title')
    .should('not.exist');
});
```

## Acceptance Criteria

- [ ] New or updated test verifies PUT is called with correct body and correct endpoint URL.
- [ ] New or updated test simulates a page reload after PUT success.
- [ ] After reload, the candidate is rendered in the updated column.
- [ ] Endpoint discrepancy (`/candidate/` vs `/candidates/`) is resolved and documented.
- [ ] All existing tests continue to pass.
- [ ] No source components under `frontend/src/` are modified.
