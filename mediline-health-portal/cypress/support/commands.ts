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

Cypress.Commands.add('loginAsPatient', () => {
    cy.visit('/');

    cy.get('#email').type('rafi.hossain258@gmail.com');
    cy.get('#password').type('123');

    cy.get('form').find('button[type=submit]').contains('Sign In').click();

    cy.url().should('include', '/patient/');
    cy.contains('Welcome back');

    cy.contains('.text-sm.font-semibold', 'Login Successful', { timeout: 10000 }).should('not.exist');
});

Cypress.Commands.add('goToFirstDoctorProfile', () => {
  cy.loginAsPatient();

  cy.contains('button', 'Find Doctors').click();

  cy.url().should('include', '/patient/doctors');

    cy.get('button[role="combobox"]').eq(0).click();
    cy.get('[role="option"]').contains('Medicine').click();

    cy.get('button[role="combobox"]').eq(1).click();
    cy.get('[role="option"]').contains('All Locations').click();

    cy.contains('button', 'View Profile', { timeout: 10000 }).should('be.visible');

  // Wait and click first doctor's profile
  cy.contains('button', 'View Profile', { timeout: 10000 }).first().click();

  // Confirm we're on doctor profile page
  cy.url().should('include', '/patient/doctors/2');
});


declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in as a test patient
       */
      loginAsPatient(): Chainable<void>;
      goToFirstDoctorProfile(): Chainable<void>;
    }
  }
}

// This is necessary to make the file a module
export {};