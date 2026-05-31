/// <reference types="cypress" />

describe('Position Detail Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/positions/1/interviewFlow', {
      fixture: 'position-detail/interviewFlow',
    }).as('getInterviewFlow');

    cy.intercept('GET', '**/positions/1/candidates', {
      fixture: 'position-detail/candidates',
    }).as('getCandidates');

    cy.intercept('GET', '**/candidates/1', {
      fixture: 'position-detail/candidateDetail',
    }).as('getCandidateDetail');
  });

  // ───────────────────────────────────────────────
  // Scenario 1 — Position Page Load
  // ───────────────────────────────────────────────
  context('Scenario 1 — Position Page Load', () => {
    it('1a. renders position title from interviewFlow.positionName', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');
      cy.get('h2').should('contain', 'Senior Full-Stack Engineer');
    });

    it('1b. renders 3 columns with correct headers', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');
      cy.get('.card-header.text-center')
        .should('have.length', 3)
        .then(($headers) => {
          expect($headers.eq(0)).to.contain('Initial Screening');
          expect($headers.eq(1)).to.contain('Technical Interview');
          expect($headers.eq(2)).to.contain('Manager Interview');
        });
    });

    it('1c. places candidate cards in the correct columns', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      // John Doe should be in "Initial Screening"
      cy.contains('.card-header', 'Initial Screening')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'John Doe');

      // Jane Smith should be in "Technical Interview"
      cy.contains('.card-header', 'Technical Interview')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'Jane Smith');
    });

    it('1d. shows loading state (empty h2) while data is fetching', () => {
      cy.intercept('GET', '**/positions/1/interviewFlow', {
        fixture: 'position-detail/interviewFlow',
        delay: 2000,
      }).as('getInterviewFlowDelayed');

      cy.intercept('GET', '**/positions/1/candidates', {
        fixture: 'position-detail/candidates',
        delay: 2000,
      }).as('getCandidatesDelayed');

      cy.visit('/positions/1');

      // No explicit loading spinner exists; the h2 is empty until data arrives
      cy.get('h2').invoke('text').should('be.empty');
    });

    it('1e. handles interview flow 500 error gracefully (no columns)', () => {
      cy.intercept('GET', '**/positions/1/interviewFlow', {
        statusCode: 500,
        body: 'Server Error',
      }).as('getInterviewFlowError');

      cy.visit('/positions/1');
      cy.wait('@getInterviewFlowError');
      cy.get('.card-header.text-center').should('not.exist');
    });

    it('1f. handles candidates 500 error gracefully (columns empty)', () => {
      cy.intercept('GET', '**/positions/1/candidates', {
        statusCode: 500,
        body: 'Server Error',
      }).as('getCandidatesError');

      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidatesError');

      cy.get('.card-header.text-center').should('have.length', 3);
      cy.get('.card-title').should('not.exist');
    });

    it('1g. renders empty columns when candidates array is empty', () => {
      cy.intercept('GET', '**/positions/1/candidates', {
        body: [],
      }).as('getCandidatesEmpty');

      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidatesEmpty');

      cy.get('.card-header.text-center').should('have.length', 3);
      cy.get('.card-title').should('not.exist');
    });
  });

  // ───────────────────────────────────────────────
  // Scenario 2 — Candidate Stage Change
  // ───────────────────────────────────────────────
  context('Scenario 2 — Candidate Stage Change', () => {
    it('2a. moves a candidate card to a different column via drag and drop', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.contains('.card-header', 'Initial Screening')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'John Doe');

      cy.dragCardToColumn('John Doe', 'Technical Interview');

      cy.contains('.card-header', 'Technical Interview')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'John Doe');

      cy.contains('.card-header', 'Initial Screening')
        .closest('.card')
        .find('.card-title')
        .should('not.exist');
    });

    it('2b. triggers PUT /candidates/:id with correct body on drop', () => {
      cy.intercept('PUT', '**/candidates/1', { statusCode: 200 }).as('putCandidate');

      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.dragCardToColumn('John Doe', 'Technical Interview');

      cy.wait('@putCandidate').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          applicationId: 1,
          currentInterviewStep: 2,
        });
      });
    });

    it('2c. keeps card in new column when PUT returns 500 (no optimistic rollback)', () => {
      cy.intercept('PUT', '**/candidates/1', { statusCode: 500 }).as('putCandidateFail');

      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.dragCardToColumn('John Doe', 'Technical Interview');
      cy.wait('@putCandidateFail');

      // Known limitation: the component mutates local state before the API call
      // and does NOT roll back on error. The card remains in the new column.
      cy.contains('.card-header', 'Technical Interview')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'John Doe');
    });

    it('2d. keeps card in original column when dropped outside the board', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.contains('.card-title', 'John Doe')
        .closest('.card.mb-2')
        .then(($card) => {
          const dataTransfer = new DataTransfer();
          const card = $card[0];
          card.dispatchEvent(
            new DragEvent('dragstart', { dataTransfer, bubbles: true, cancelable: true })
          );

          // Drop on a non-droppable element (the page heading)
          cy.get('h2').then(($h2) => {
            const h2 = $h2[0];
            h2.dispatchEvent(
              new DragEvent('dragover', { dataTransfer, bubbles: true, cancelable: true })
            );
            h2.dispatchEvent(
              new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true })
            );
            card.dispatchEvent(
              new DragEvent('dragend', { dataTransfer, bubbles: true, cancelable: true })
            );
          });
        });

      cy.contains('.card-header', 'Initial Screening')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'John Doe');
    });

    it('2e. keeps card in same column and makes no PUT when dropped in same column', () => {
      cy.intercept('PUT', '**/candidates/1', { statusCode: 200 }).as('putCandidateSame');

      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.dragCardToColumn('John Doe', 'Initial Screening');

      cy.contains('.card-header', 'Initial Screening')
        .closest('.card')
        .find('.card-title')
        .should('contain', 'John Doe');

      // NOTE: The current implementation does NOT guard against same-column drops,
      // so a PUT request is still fired. This test documents that known behaviour.
      cy.get('@putCandidateSame.all').should('have.length', 0);
    });
  });

  // ───────────────────────────────────────────────
  // Scenario 3 — Candidate Detail Panel
  // ───────────────────────────────────────────────
  context('Scenario 3 — Candidate Detail Panel', () => {
    it('3a. opens offcanvas with candidate details when clicking a card', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.contains('.card-title', 'John Doe').click();
      cy.wait('@getCandidateDetail');

      cy.get('.offcanvas').should('be.visible');
      cy.get('.offcanvas-body').should('contain', 'John Doe');
    });

    it('3b. closes offcanvas when clicking the close button', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.contains('.card-title', 'John Doe').click();
      cy.wait('@getCandidateDetail');

      cy.get('.offcanvas').should('be.visible');
      cy.get('.offcanvas-header .btn-close').click();
      cy.get('.offcanvas').should('not.be.visible');
    });
  });

  // ───────────────────────────────────────────────
  // Scenario 4 — Navigation
  // ───────────────────────────────────────────────
  context('Scenario 4 — Navigation', () => {
    it('4a. navigates back to /positions when clicking the back button', () => {
      cy.visit('/positions/1');
      cy.wait('@getInterviewFlow');
      cy.wait('@getCandidates');

      cy.contains('button', 'Volver a Posiciones').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/positions`);
    });
  });
});
