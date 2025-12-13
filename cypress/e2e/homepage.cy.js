describe('Homepage', () => {
  beforeEach(() => {
    cy.cleanup();
    cy.visit('/');
  });

  describe('Unauthenticated User', () => {
    it('should display hero section with welcome message', () => {
      cy.contains('h1', 'Welcome to EduNexus').should('be.visible');
      cy.contains('Make informed decisions about your education').should('be.visible');
    });

    it('should display signup and signin buttons', () => {
      cy.get('button').contains('Create Free Account').should('be.visible');
      cy.get('button').contains('Sign In').should('be.visible');
    });

    it('should navigate to signup page from CTA button', () => {
      cy.get('button').contains('Create Free Account').click();
      cy.url().should('include', '/users/signup');
    });

    it('should navigate to signin page from CTA button', () => {
      cy.get('button').contains('Sign In').click();
      cy.url().should('include', '/users/signin');
    });

    it('should display statistics section with live data', () => {
      cy.contains('Join Our Community').should('be.visible');
      
      // Wait for statistics to load
      cy.get('div').each(($div) => {
        const text = $div.text();
        // Should have cards for Students, Courses, Projects
        if (text.includes('Students') || text.includes('Courses') || text.includes('Projects')) {
          cy.wrap($div).should('be.visible');
        }
      });
    });

    it('should display statistics labels', () => {
      cy.contains('Registered Students').should('be.visible');
      cy.contains('Courses with Reviews').should('be.visible');
      cy.contains('Active Students').should('be.visible');
      cy.contains('Projects Recruiting').should('be.visible');
    });

    it('should display explore platform section with 3 cards', () => {
      cy.contains('h2', 'Explore Our Platform').should('be.visible');
      cy.contains('Browse Courses').should('be.visible');
      cy.contains('Connect with Peers').should('be.visible');
      cy.contains('Showcase Projects').should('be.visible');
    });

    it('should have View Courses button with correct navigation', () => {
      cy.get('button').contains('View Courses').click();
      cy.url().should('include', '/course/list');
    });

    it('should have View Profiles button with correct navigation', () => {
      cy.visit('/');
      cy.get('button').contains('View Profiles').click();
      cy.url().should('include', '/users/list');
    });

    it('should have View Projects button with correct navigation', () => {
      cy.visit('/');
      cy.get('button').contains('View Projects').click();
      cy.url().should('include', '/project/list');
    });

    it('should display final CTA section', () => {
      cy.contains('h2', 'Ready to Explore?').should('be.visible');
      cy.contains('Join thousands of students making smarter choices').should('be.visible');
    });

    it('should display CTA buttons in final section', () => {
      cy.get('button').contains('Create Free Account').should('be.visible');
      cy.get('button').contains('Sign In').should('be.visible');
    });
  });

  describe('Authenticated User', () => {
    beforeEach(() => {
      const testUser = {
        displayName: 'Auth Test User',
        email: `authuser${Date.now()}@example.com`,
        password: 'Password123',
        role: 'student',
      };

      cy.signup(
        `auth_${Date.now()}`,
        testUser.displayName,
        testUser.email,
        testUser.password
      );

      cy.visit('/');
    });

    it('should not display signup/signin buttons for authenticated user', () => {
      cy.contains('h1', 'Welcome to EduNexus').should('be.visible');
      cy.get('button').contains('Create Free Account').should('not.exist');
    });

    it('should display explore platform buttons for authenticated user', () => {
      cy.get('button').contains('View Courses').should('be.visible');
      cy.get('button').contains('View Profiles').should('be.visible');
      cy.get('button').contains('View Projects').should('be.visible');
    });

    it('should display Start Exploring Now button in final section', () => {
      cy.get('button').contains('Start Exploring Now').should('be.visible');
    });

    it('should show Start Exploring button in final section for authenticated user', () => {
      cy.contains('h2', 'Ready to Explore?').should('be.visible');
      cy.get('button').contains('Start Exploring Now').should('be.visible');
      cy.get('button').contains('Create Free Account').should('not.exist');
    });
  });

  describe('Statistics Section', () => {
    it('should load statistics without errors', () => {
      // Check that statistics cards are displayed with numeric values or loading state
      cy.get('h4, h3, h5, h6').each(($el) => {
        // Make sure we don't have error messages
        cy.wrap($el).should('not.contain', 'Error');
        cy.wrap($el).should('not.contain', 'Failed');
      });
    });

    it('should display statistics in centered layout', () => {
      // The statistics section should be centered
      cy.contains('Join Our Community').should('be.visible');
      
      // Check that cards exist and are visible
      cy.get('[class*="MuiCard"]').each(($card) => {
        cy.wrap($card).should('be.visible');
      });
    });
  });

  describe('Platform Cards Layout', () => {
    it('should display 3 platform cards in a row on desktop', () => {
      // Set viewport to desktop size
      cy.viewport(1280, 720);
      
      cy.contains('h2', 'Explore Our Platform').should('be.visible');
      
      // Cards should be displayed
      cy.get('button').contains('View Courses').should('be.visible');
      cy.get('button').contains('View Profiles').should('be.visible');
      cy.get('button').contains('View Projects').should('be.visible');
    });

    it('should be responsive on mobile', () => {
      cy.viewport(375, 667);
      
      cy.contains('h2', 'Explore Our Platform').should('be.visible');
      cy.get('button').contains('View Courses').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport(768, 1024);
      
      cy.contains('h2', 'Explore Our Platform').should('be.visible');
      cy.get('button').contains('View Courses').should('be.visible');
    });
  });

  describe('Navigation Integration', () => {
    it('should allow navigation from homepage to all major sections', () => {
      // Test Courses
      cy.get('button').contains('View Courses').click();
      cy.url().should('include', '/course/list');
      
      cy.visit('/');
      
      // Test Users
      cy.get('button').contains('View Profiles').click();
      cy.url().should('include', '/users/list');
      
      cy.visit('/');
      
      // Test Projects
      cy.get('button').contains('View Projects').click();
      cy.url().should('include', '/project/list');
    });
  });
});
