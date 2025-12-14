// Cypress E2E tests for Profile and Account Settings flows
// Covers: profile view/edit, autosave, validation, email/password change, account deletion

describe('Profile & Account Settings Flows', () => {
  const uniqueId = Date.now() + '-' + Math.floor(Math.random() * 10000);
  const testUser = {
    displayName: 'Profile Test User',
    email: `profileuser${uniqueId}@example.com`,
    password: 'Password123',
    firstName: 'Profile',
    lastName: 'User',
  };

  before(() => {
    cy.cleanup();
    cy.intercept('POST', '/api/users').as('signupRequest');
    cy.signup(
      'profile_user',
      testUser.firstName,
      testUser.lastName,
      testUser.email,
      testUser.password
    );
    // Cleaned up for production
    cy.get('form').first().within(() => {
      cy.get('input[name="firstName"]').invoke('val').then(val => cy.log('firstName:', val));
      cy.get('input[name="lastName"]').invoke('val').then(val => cy.log('lastName:', val));
      cy.get('input[name="email"]').invoke('val').then(val => cy.log('email:', val));
      cy.get('input[name="school"]').invoke('val').then(val => cy.log('school:', val));
      cy.get('input[name="fieldOfStudy"]').invoke('val').then(val => cy.log('fieldOfStudy:', val));
      cy.get('input[name="password"]').invoke('val').then(val => cy.log('password:', val));
      cy.get('input[name="confirmPassword"]').invoke('val').then(val => cy.log('confirmPassword:', val));
    });
    cy.screenshot('after-signup-attempt');
    cy.wait(2000); // Wait for any UI updates
    cy.get('body').then($body => {
      if ($body.find('.MuiAlert-message, .alert, [role="alert"]').length) {
        cy.log('Signup error:', $body.find('.MuiAlert-message, .alert, [role="alert"]').text());
      }
    });
    cy.wait('@signupRequest', { timeout: 10000 }).then((interception) => {
      cy.log('Signup response:', JSON.stringify(interception.response?.body));
    });
  });

  beforeEach(() => {
    cy.intercept('POST', '/auth/signin').as('signinRequest');
    cy.login(testUser.email, testUser.password);
    cy.wait('@signinRequest').then((interception) => {
      cy.log('Signin response:', JSON.stringify(interception.response?.body));
    });
    cy.wait(1000); // Wait for backend to process login
    cy.get('body').then($body => {
      if ($body.find('.MuiAlert-message, .alert, [role="alert"]').length) {
        cy.log('Login error:', $body.find('.MuiAlert-message, .alert, [role="alert"]').text());
      }
    });
  });

  it('should display and edit profile fields', () => {
    cy.visit('/profile');
    cy.contains('Profile').should('be.visible');
    cy.get('input[name="firstName"]').should('have.value', testUser.firstName);
    cy.get('input[name="lastName"]').should('have.value', testUser.lastName);
    cy.get('input[name="email"]').should('have.value', testUser.email);

    // Edit bio and save
    cy.get('textarea[name="bio"]').clear().type('This is my new bio!');
    cy.get('button').contains(/save/i).click();
    cy.contains('Profile updated').should('be.visible');
    cy.reload();
    cy.get('textarea[name="bio"]').should('have.value', 'This is my new bio!');
  });

  it('should validate LinkedIn and website URLs', () => {
    cy.visit('/profile');
    cy.get('input[name="linkedin"]').clear().type('invalid-linkedin');
    cy.get('button').contains(/save/i).click();
    cy.contains('valid LinkedIn URL').should('be.visible');
    cy.get('input[name="linkedin"]').clear().type('https://linkedin.com/in/testuser/');
    cy.get('button').contains(/save/i).click();
    cy.contains('Profile updated').should('be.visible');
  });

  it('should autosave on field blur', () => {
    cy.visit('/profile');
    cy.get('input[name="school"]').clear().type('Test University').blur();
    cy.contains('Profile updated').should('be.visible');
    cy.reload();
    cy.get('input[name="school"]').should('have.value', 'Test University');
  });

  it('should change email with confirmation', () => {
    cy.visit('/account/settings');
    cy.get('button').contains(/edit/i).click();
    cy.get('input[name="newEmail"]').type('new' + testUser.email);
    cy.get('input[name="confirmNewEmail"]').type('new' + testUser.email);
    cy.get('input[name="currentPassword"]').type(testUser.password);
    cy.get('button').contains(/save/i).click();
    cy.contains('Email updated').should('be.visible');
  });

  it('should change password with confirmation', () => {
    cy.visit('/account/settings');
    cy.get('button').contains(/edit/i).click();
    cy.get('input[name="newPassword"]').type('NewPassword123!');
    cy.get('input[name="confirmNewPassword"]').type('NewPassword123!');
    cy.get('input[name="currentPassword"]').type(testUser.password);
    cy.get('button').contains(/save/i).click();
    cy.contains('Password updated').should('be.visible');
    // Login with new password
    cy.logout();
    cy.login(testUser.email, 'NewPassword123!');
    cy.visit('/profile');
    cy.contains('Profile').should('be.visible');
  });

  it('should require confirmation to delete account', () => {
    cy.visit('/account/settings');
    cy.get('button').contains(/delete account/i).click();
    cy.get('input[name="deletePassword"]').type('NewPassword123!');
    cy.get('button').contains(/confirm delete/i).click();
    cy.contains('Account deleted').should('be.visible');
    cy.url().should('include', '/users/signup');
  });
});
