/// <reference types="cypress" />

describe('Doctor Profile Tabs', () => {
  beforeEach(() => {
    cy.goToFirstDoctorProfile();
  });

  it('should switch between all tabs and show correct content', () => {
    // Tab: Availability
    cy.contains('button', 'Availability & Locations').click();
    cy.contains('Schedule & Locations').should('exist');

    // Tab: Reviews
    cy.contains('button', 'Reviews').click();
    cy.contains('Patient Reviews').should('exist');

    // Tab: Overview
    cy.contains('button', 'Overview').click();
    cy.contains('About').should('exist');
  });

    it('should navigate to the book appointment page on button click', () => {
      cy.contains('button', 'Book Appointment').click();

      cy.url().should('include', 'patient/book-appointment');

      cy.contains('Booking Appointment With').should('exist');
    });
});
