// ========== Authentication Commands ==========

/**
 * Custom command to login a user
 * Usage: cy.login(email, password)
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/users/signin');
  cy.get('input[name="email"]').type(email, { force: true });
  cy.get('input[name="password"]').type(password, { force: true });
  cy.get('button').contains('Sign In').click();
  // Wait for redirect to home
  cy.url().should('include', '/');
  // Verify token is stored
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.exist;
    expect(win.localStorage.getItem('user')).to.exist;
  });
});

/**
 * Custom command to logout user
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  // Click on user dropdown menu
  cy.get('[data-testid="user-menu"]').click({ force: true });
  
  // Click logout button
  cy.get('button').contains('Sign Out').click({ force: true });
  
  // Verify redirect to home
  cy.url().should('include', '/');
  
  cy.window().then((win) => {
    expect(win.localStorage.getItem('token')).to.be.null;
    expect(win.localStorage.getItem('user')).to.be.null;
  });
});

/**
 * Custom command to cleanup (clear localStorage and sign in fresh)
 * Usage: cy.cleanup()
 */
Cypress.Commands.add('cleanup', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.visit('/');
});

/**
 * Custom command to register a new user
 * Usage: cy.signup(uid, displayName, email, password, role)
 */
/**
 * Custom command to register a new user (firstName/lastName version, no role dropdown)
 * Usage: cy.signup(uid, firstName, lastName, email, password)
 */
Cypress.Commands.add('signup', (uid, firstName, lastName, email, password) => {
  cy.visit('/users/signup');
  cy.screenshot('signup-page-loaded');
  cy.url().should('include', '/users/signup');
  cy.get('form').first().should('be.visible');
  cy.get('input[name="firstName"]').should('be.visible').type(firstName, { force: true });
  cy.get('input[name="lastName"]').should('be.visible').type(lastName, { force: true });
  cy.get('input[name="school"]').should('be.visible').type('Test University', { force: true });
  cy.get('input[name="fieldOfStudy"]').should('be.visible').type('Testing', { force: true });
  cy.get('input[name="email"]').should('be.visible').type(email, { force: true });
  cy.get('input[name="password"]').should('be.visible').type(password, { force: true });
  cy.get('input[name="confirmPassword"]').should('be.visible').type(password, { force: true });
  cy.screenshot('signup-form-filled');
  cy.get('button').contains('Sign Up').should('be.visible').click();
  cy.wait(1000);
  cy.screenshot('after-signup-submit');
  // Wait for redirect to home
  cy.url({ timeout: 10000 }).should('include', '/');
});

/**
 * Custom command to create a project via API
 * Usage: cy.createProject(token, projectData)
 */
Cypress.Commands.add('createProject', (token, projectData) => {
  const apiUrl = Cypress.env('API_BASE_URL') || 'http://localhost:3000/api';
  
  cy.request({
    method: 'POST',
    url: `${apiUrl}/projects`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: projectData,
  }).then((response) => {
    expect(response.status).to.equal(200);
    return response.body.project;
  });
});

/**
 * Custom command to create feedback via API
 * Usage: cy.createFeedback(token, feedbackData)
 */
Cypress.Commands.add('createFeedback', (token, feedbackData) => {
  const apiUrl = Cypress.env('API_BASE_URL') || 'http://localhost:3000/api';
  
  cy.request({
    method: 'POST',
    url: `${apiUrl}/feedback`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: feedbackData,
  }).then((response) => {
    expect(response.status).to.equal(200);
    return response.body.feedback;
  });
});

/**
 * Custom command to get dashboard data via API
 * Usage: cy.getDashboard(token)
 */
Cypress.Commands.add('getDashboard', (token) => {
  const apiUrl = Cypress.env('API_BASE_URL') || 'http://localhost:3000/api';
  
  cy.request({
    method: 'GET',
    url: `${apiUrl}/dashboard/me`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    return response.body;
  });
});

// ========== Utility Commands ==========

/**
 * Custom command to get user from localStorage
 * Usage: cy.getUser()
 */
Cypress.Commands.add('getUser', () => {
  cy.window().then((win) => {
    const user = win.localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });
});

/**
 * Custom command to get token from localStorage
 * Usage: cy.getToken()
 */
Cypress.Commands.add('getToken', () => {
  cy.window().then((win) => {
    return win.localStorage.getItem('token');
  });
});
