describe('Authentication Flows', () => {
  const testUser = {
    displayName: 'Test User',
    email: `testuser${Date.now()}@example.com`,
    password: 'Password123',
    role: 'student',
  };

  beforeEach(() => {
    cy.cleanup();
  });

  describe('Signup Flow', () => {
    it('should fill signup form and create account', () => {
      cy.visit('/users/signup');

      // Verify signup page loads
      cy.contains('h2', 'Sign Up').should('be.visible');

      // Fill form
      cy.get('input[placeholder*="Full"]').type(testUser.displayName, {
        force: true,
      });
      cy.get('input[placeholder*="Email"]').type(testUser.email, {
        force: true,
      });

      // Select role
      cy.get('select').first().select(testUser.role);

      // Fill password fields
      cy.get('input[placeholder*="Password"]')
        .first()
        .type(testUser.password, { force: true });
      cy.get('input[placeholder*="Confirm"]').type(testUser.password, {
        force: true,
      });

      // Submit
      cy.get('button').contains('Sign Up').click();

      // Wait for redirect and verify
      cy.url().should('include', '/');

      // Verify token is stored
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token');
        const user = win.localStorage.getItem('user');
        expect(token).to.exist;
        expect(user).to.exist;
        const userData = JSON.parse(user);
        expect(userData.email).to.equal(testUser.email);
        expect(userData.displayName).to.equal(testUser.displayName);
      });
    });

    it('should show error for duplicate email', () => {
      // First signup
      cy.signup(
        'user1',
        testUser.displayName,
        testUser.email,
        testUser.password
      );

      // Logout
      cy.logout();

      // Try to signup with same email
      cy.visit('/users/signup');
      cy.get('input[placeholder*="Full"]').type('Another User', {
        force: true,
      });
      cy.get('input[placeholder*="Email"]').type(testUser.email, {
        force: true,
      });
      cy.get('select').first().select('student');
      cy.get('input[placeholder*="Password"]')
        .first()
        .type(testUser.password, { force: true });
      cy.get('input[placeholder*="Confirm"]').type(testUser.password, {
        force: true,
      });

      cy.get('button').contains('Sign Up').click();

      // Should show error message
      cy.contains('User with this uid or email already exists').should(
        'be.visible'
      );

      // Should remain on signup page
      cy.url().should('include', '/users/signup');
    });

    it('should validate password match', () => {
      cy.visit('/users/signup');

      cy.get('input[placeholder*="Full"]').type(testUser.displayName, {
        force: true,
      });
      cy.get('input[placeholder*="Email"]').type(testUser.email, {
        force: true,
      });
      cy.get('select').first().select(testUser.role);
      cy.get('input[placeholder*="Password"]')
        .first()
        .type(testUser.password, { force: true });
      cy.get('input[placeholder*="Confirm"]').type('DifferentPassword123', {
        force: true,
      });

      cy.get('button').contains('Sign Up').click();

      // Should show error
      cy.contains('Passwords do not match').should('be.visible');
      cy.url().should('include', '/users/signup');
    });
  });

  describe('Signin Flow', () => {
    beforeEach(() => {
      // Create a test user
      cy.signup(
        'signin_test',
        'Signin Test User',
        testUser.email,
        testUser.password
      );

      // Logout for signin test
      cy.logout();
    });

    it('should login with valid credentials', () => {
      cy.visit('/users/signin');

      // Verify signin page
      cy.contains('h2', 'Sign In').should('be.visible');

      // Fill form
      cy.get('input[placeholder*="Email"]').type(testUser.email, {
        force: true,
      });
      cy.get('input[placeholder*="Password"]').type(testUser.password, {
        force: true,
      });

      // Submit
      cy.get('button').contains('Sign In').click();

      // Verify redirect to home
      cy.url().should('include', '/');

      // Verify token is stored
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token');
        const user = win.localStorage.getItem('user');
        expect(token).to.exist;
        expect(user).to.exist;
      });

      // Verify navbar shows user displayName
      cy.get('[data-testid="user-menu"]')
        .should('be.visible')
        .should('contain', 'Signin Test User');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/users/signin');

      cy.get('input[placeholder*="Email"]').type(testUser.email, {
        force: true,
      });
      cy.get('input[placeholder*="Password"]').type('WrongPassword123', {
        force: true,
      });

      cy.get('button').contains('Sign In').click();

      // Should show error
      cy.contains('Invalid email or password').should('be.visible');

      // Should remain on signin page
      cy.url().should('include', '/users/signin');
    });

    it('should show error for invalid email', () => {
      cy.visit('/users/signin');

      cy.get('input[placeholder*="Email"]').type('nonexistent@example.com', {
        force: true,
      });
      cy.get('input[placeholder*="Password"]').type(testUser.password, {
        force: true,
      });

      cy.get('button').contains('Sign In').click();

      // Should show error
      cy.contains('Invalid email or password').should('be.visible');
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      // Create and login a test user
      cy.signup(
        'logout_test',
        'Logout Test User',
        testUser.email,
        testUser.password
      );
    });

    it('should logout and clear authentication', () => {
      // Verify we are logged in
      cy.get('[data-testid="user-menu"]')
        .should('be.visible')
        .should('contain', 'Logout Test User');

      // Click logout
      cy.logout();

      // Verify navbar shows Sign In/Sign Up buttons
      cy.get('a').contains('Sign In').should('be.visible');
      cy.get('a').contains('Sign Up').should('be.visible');

      // Verify we cannot access protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/users/signin');
    });

    it('should remove token from localStorage on logout', () => {
      // Verify token exists
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.exist;
      });

      // Logout
      cy.logout();

      // Verify token removed
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
      });
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to signin when accessing protected route without auth', () => {
      cy.cleanup();
      cy.visit('/dashboard');
      cy.url().should('include', '/users/signin');
    });

    it('should redirect to signin when accessing /project/add without auth', () => {
      cy.cleanup();
      cy.visit('/project/add');
      cy.url().should('include', '/users/signin');
    });

    it('should allow access to protected route after login', () => {
      cy.signup(
        'protected_test',
        'Protected Test User',
        testUser.email,
        testUser.password
      );

      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
      cy.contains('My Courses').should('be.visible');
    });
  });

  describe('Token Expiration Handling', () => {
    it('should handle 401 response by redirecting to signin', () => {
      // Login
      cy.signup(
        'token_test',
        'Token Test User',
        testUser.email,
        testUser.password
      );

      // Manually clear token to simulate expiration
      cy.window().then((win) => {
        win.localStorage.removeItem('token');
      });

      // Try to access protected route
      cy.visit('/dashboard');

      // Should redirect to signin
      cy.url().should('include', '/users/signin');
    });
  });
});
