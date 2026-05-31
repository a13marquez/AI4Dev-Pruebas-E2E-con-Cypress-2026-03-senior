/// <reference types="cypress" />
import 'cypress-real-events';

Cypress.Commands.add('dragCardToColumn', (cardName: string, columnName: string) => {
  cy.contains('.card-title', cardName)
    .closest('.card.mb-2')
    .as('sourceCard');

  cy.contains('.card-header', columnName)
    .closest('.card.mb-4')
    .as('targetColumn');

  cy.get('@sourceCard').then(($source) => {
    const sourceRect = $source[0].getBoundingClientRect();
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;

    cy.get('@targetColumn').then(($target) => {
      const targetRect = $target[0].getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      cy.wrap($source).realMouseDown();

      // Multi-step drag to give RBD time to register droppable intersection
      const steps = 5;
      const stepX = (targetX - sourceX) / steps;
      const stepY = (targetY - sourceY) / steps;

      for (let i = 1; i <= steps; i++) {
        cy.get('body').realMouseMove(stepX * i, stepY * i);
        cy.wait(100);
      }

      cy.get('body').realMouseUp();
    });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      dragAndDrop(sourceSelector: string, targetSelector: string): Chainable<void>;
      dragCardToColumn(cardName: string, columnName: string): Chainable<void>;
    }
  }
}