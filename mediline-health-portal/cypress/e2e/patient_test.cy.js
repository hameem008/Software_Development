/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

describe('Patient views past tests', () => {
    beforeEach(() => {
        cy.loginAsPatient(); // custom command
        cy.contains('button', 'Tests & Results').click();
        cy.url().should('include', '/patient/tests');
    });

    it('should navigate to the test list and view details', () => {
        cy.get('[data-testid^="test-card-"]').first().as('firstCard');

        // Click the header inside the card
        cy.get('@firstCard').contains('button', 'View Report').click();

        // Step 6: Assert that the prescription detail is visible
        cy.url().should('include', '/patient/tests');
        cy.contains('Doctor Information').should('exist');
        cy.contains('Test Parameters').should('exist');
        cy.contains('Test Result Notes').should('exist');
    });

    it('should filter by test name', () => {
        // 1. Open doctor dropdown
        cy.contains('label', 'Test Name')
          .parent()
          .find('button[role="combobox"]')
          .click();

        // 2. Select 2nd doctor (skipping "All") and store its name
        cy.get('[role="option"]').eq(1).then(($el) => {
          const testName = $el.text().trim();
          cy.wrap(testName).as('testName');
          cy.wrap($el).click();
        });


        // 4. Verify all prescriptions show that doctor
        cy.get('[data-testid^="test-card-"]').each(($el) => {
          cy.get('@testName').then((test) => {
            expect($el.text().trim()).to.include(test);
          });
        });
    });


    it('should filter by date range', () => {
        const fromDate = '2024-12-01';
        const toDate = '2024-12-31';

        // Step 1: Fill "From" and "To" date inputs
        cy.get('input[type="date"]').eq(0).type(fromDate); // From
        cy.get('input[type="date"]').eq(1).type(toDate); // To

        // Step 3: Validate each prescription falls within range
        cy.get('[data-testid="test-date"]').each($el => {
            const text = $el.text();
            const date = new Date(text);
            expect(date >= new Date(fromDate)).to.be.true;
            expect(date <= new Date(toDate)).to.be.true;
        });
    });

    it('should handle empty test list', () => {
        const fromDate = '2026-12-01';
        const toDate = '2026-12-31';

        // Step 1: Fill "From" and "To" date inputs
        cy.get('input[type="date"]').eq(0).type(fromDate); // From
        cy.get('input[type="date"]').eq(1).type(toDate); // To

        cy.contains('No test results yet').should('exist');
        cy.contains('Your test results will appear here when available').should('exist');
    });

});
