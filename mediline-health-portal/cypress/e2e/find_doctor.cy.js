/// <reference types="cypress" />

describe('Find Doctor Flow', () => {
    beforeEach(() => {
        cy.loginAsPatient();
    });


  it('should navigate to doctor profile after filtering', () => {

    cy.visit('/patient');

    cy.contains('button', 'Find Doctors').click();

    cy.url().should('include', '/patient/doctors');

    cy.get('button[role="combobox"]').eq(0).click();
    cy.get('[role="option"]').contains('Medicine').click();

    cy.get('button[role="combobox"]').eq(1).click();
    cy.get('[role="option"]').contains('All Locations').click();

    cy.contains('button', 'View Profile', { timeout: 10000 }).should('be.visible');

    cy.get('button').contains('View Profile').first().click();

    cy.url().should('include', '/patient/doctors/2');

  });


  it('should show no doctor when filtering result is empty', () => {

    cy.visit('/patient');

    cy.contains('button', 'Find Doctors').click();

    cy.url().should('include', '/patient/doctors');

    cy.get('button[role="combobox"]').eq(0).click();
    cy.get('[role="option"]').contains('Plastic Surgery').click();

    cy.get('button[role="combobox"]').eq(1).click();
    cy.get('[role="option"]').contains('28 Mirzapul Rd, Chittagong-4212').click();

    cy.contains('No doctors found', { timeout: 10000 }).should('be.visible');

    cy.url().should('include', '/patient/doctors');

  });




});
