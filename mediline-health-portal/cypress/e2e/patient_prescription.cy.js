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

describe('Patient views past prescriptions', () => {
   beforeEach(() => {
    cy.loginAsPatient(); // custom command
    cy.contains('button', 'Prescriptions').click();
    cy.url().should('include', '/patient/prescriptions');
  });


  it('should navigate to the prescription list and view details', () => {
    // Step 3: Assert at least one prescription is listed
    cy.contains('Prescription #').should('exist');

    // Step 4: Get the first prescription card's data
    cy.get('[class*=space-y-1]').first().within(() => {
      cy.get('h4').invoke('text').as('prescriptionId');
      cy.get('p').eq(0).invoke('text').as('doctorAndDate');
      cy.get('p').eq(1).invoke('text').as('summary');
    });

    // Step 5: Click the "View" button for the first prescription
    cy.contains('button', 'View').first().click();

    // Step 6: Assert that the prescription detail is visible
    cy.url().should('include', '/patient/prescriptions/details');
    cy.contains('My Prescriptions').should('exist');

    cy.get('@doctorAndDate').then(info => {
      cy.contains(info.trim()).should('exist');
    });

    cy.get('@summary').then(disease => {
      cy.contains(disease.trim()).should('exist');
    });
  });

  it('should filter by doctor', () => {
    // 1. Open doctor dropdown
    cy.contains('label', 'Doctor')
      .parent()
      .find('button[role="combobox"]')
      .click();

    // 2. Select 2nd doctor (skipping "All") and store its name
    cy.get('[role="option"]').eq(1).then(($el) => {
      const doctorName = $el.text().trim();
      cy.wrap(doctorName).as('doctorName'); // Save for later
      cy.wrap($el).click(); // Click the doctor
    });

    // 3. Click Search button
    cy.contains('button', 'Search').click();

    // 4. Verify all prescriptions show that doctor
    cy.get('[data-testid="prescription-meta"]').each(($el) => {
      cy.get('@doctorName').then((doctor) => {
        expect($el.text().trim()).to.include(doctor);
      });
    });
  });


  it('should filter by disease', () => {
    // Step 1: Count total prescriptions before filtering
    cy.get('h4').then($all => {
      const totalPrescriptions = $all.length;

        cy.contains('label', 'Disease')
        .parent()
        .find('button[role="combobox"]')
        .click();

        // 2. Select 2nd doctor (skipping "All") and store its name
        cy.get('[role="option"]').eq(1).then(($el) => {
          const diseaseName = $el.text().trim();
          cy.wrap(diseaseName).as('diseaseName'); // Save for later
          cy.wrap($el).click(); // Click the doctor
        });

      // Step 3: Click Search
      cy.contains('button', 'Search').click();

      // Optional: Check that list is shorter than original
      cy.get('h4').should('have.length.lte', totalPrescriptions);
    });
  });

  it('should filter by date range', () => {
    const fromDate = '2024-10-01';
    const toDate = '2024-11-01';

    // Step 1: Fill "From" and "To" date inputs
    cy.get('input[type="date"]').eq(0).type(fromDate); // From
    cy.get('input[type="date"]').eq(1).type(toDate); // To

    // Step 2: Click Search
    cy.contains('button', 'Search').click();

    // Step 3: Validate each prescription falls within range
    cy.get('[data-testid="prescription-meta"]').each($el => {
      const text = $el.text();
      const dateMatch = text.match(/\w+\s\d{1,2},\s\d{4}/); // e.g., May 12, 2025
      if (dateMatch) {
        const dateStr = dateMatch[0];
        const date = new Date(dateStr);
        expect(date >= new Date(fromDate)).to.be.true;
        expect(date <= new Date(toDate)).to.be.true;
      }
    });
  });

});
