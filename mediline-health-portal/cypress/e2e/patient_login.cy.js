/// <reference types="cypress" />


describe('Patient Login Flow', () => {
  it('should log in as patient successfully', () => {
    // 1. Visit the login page
    cy.visit('/'); // or '/auth/login' if that's your route

    // 2. Select Account Type: 'Patient'
    // Assumes Patient is already default; otherwise you can force-select:
    // cy.get('select').select('patient'); // fallback for hidden dropdown

    // 3. Enter Email
    cy.get('#email').type('rafi.hossain258@gmail.com');

    // 4. Enter Password
    cy.get('#password').type('123');

    // 5. Click Sign In button (first submit button in form)
    cy.get('form').find('button[type=submit]').contains('Sign In').click();

    // 6. Check redirected to dashboard or some success behavior
    cy.url().should('include', '/patient/'); // or /patient/dashboard
    cy.contains('Welcome back'); // optional content check
  });

  it('shows error toast when email is not found', () => {

    cy.visit('/');

    cy.get('#email').type('invalid@example.com');
    cy.get('#password').type('wrongpassword');

    cy.get('form').find('button[type=submit]').contains('Sign In').click();

    cy.url().should('include', '/');

    // Check toast shows correct error message
    cy.contains('Login Failed', );
    cy.contains('No patient found with this email.');

  });

  it('shows error toast when password is wrong', () => {

    cy.visit('/');

    cy.get('#email').type('rafi.hossain258@gmail.com');
    cy.get('#password').type('wrongpassword');

    cy.get('form').find('button[type=submit]').contains('Sign In').click();

    cy.url().should('include', '/');

    // Check toast shows correct error message
    cy.contains('Login Failed', );
    cy.contains('Invalid password');

  });
});
