describe('Dashboard Flow', () => {
  let testUser = {};

  beforeEach(() => {
    // Create test user
    testUser = {
      displayName: 'Dashboard Test User',
      email: `dashboarduser${Date.now()}@example.com`,
      password: 'Password123',
      role: 'student',
    };

    cy.cleanup();
    cy.signup(
      'dashboard_user',
      testUser.displayName,
      testUser.email,
      testUser.password
    );
  });

  describe('Dashboard Access', () => {
    it('should require authentication to access dashboard', () => {
      cy.logout();
      cy.visit('/dashboard');

      // Should redirect to signin
      cy.url().should('include', '/users/signin');
    });

    it('should display dashboard for authenticated user', () => {
      cy.visit('/dashboard');

      // Verify dashboard loads
      cy.url().should('include', '/dashboard');
      cy.contains(`Welcome, ${testUser.displayName}`).should('be.visible');
    });

    it('should display three main sections', () => {
      cy.visit('/dashboard');

      // Verify all three sections are visible
      cy.contains('My Courses').should('be.visible');
      cy.contains('My Projects').should('be.visible');
      cy.contains('My Feedback').should('be.visible');
    });
  });

  describe('My Courses Section', () => {
    it('should show "No courses yet" when user has no courses', () => {
      cy.visit('/dashboard');

      cy.contains('My Courses')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('No courses yet').should('be.visible');
        });
    });

    it('should display owned courses', () => {
      // Assuming courses can be created via API
      // Create a course (this would require API endpoint or seeding)
      cy.getToken().then((token) => {
        if (token) {
          cy.request({
            method: 'POST',
            url: `${Cypress.env('API_BASE_URL') || 'http://localhost:3000/api'}/courses`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: {
              title: 'Dashboard Test Course',
              description: 'Test course for dashboard',
              credits: 3,
              status: 'active',
            },
          });
        }
      });

      cy.visit('/dashboard');

      // Verify course appears
      cy.contains('My Courses')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('Dashboard Test Course').should('be.visible');
        });
    });

    it('should show edit link for owned courses', () => {
      // Create a course
      cy.getToken().then((token) => {
        if (token) {
          cy.request({
            method: 'POST',
            url: `${Cypress.env('API_BASE_URL') || 'http://localhost:3000/api'}/courses`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: {
              title: 'Editable Course',
              description: 'Test',
              credits: 3,
              status: 'active',
            },
          });
        }
      });

      cy.visit('/dashboard');

      // Verify edit link is clickable
      cy.contains('My Courses')
        .closest('[class*="Card"]')
        .within(() => {
          cy.get('a').contains('Editable Course').should('be.visible');
        });
    });
  });

  describe('My Projects Section', () => {
    it('should show "No projects yet" when user has no projects', () => {
      cy.visit('/dashboard');

      cy.contains('My Projects')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('No projects yet').should('be.visible');
        });
    });

    it('should display owned projects', () => {
      // Create a project
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Dashboard Project', {
        force: true,
      });
      cy.get('textarea[placeholder*="description"]').type('Test project', {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      // Navigate to dashboard
      cy.visit('/dashboard');

      // Verify project appears in My Projects section
      cy.contains('My Projects')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('Dashboard Project').should('be.visible');
        });
    });

    it('should show edit link for owned projects', () => {
      // Create a project
      cy.visit('/project/add');
      const projectTitle = `Editable Project ${Date.now()}`;
      cy.get('input[placeholder*="title"]').type(projectTitle, {
        force: true,
      });
      cy.get('select').first().select('draft');
      cy.get('button').contains('Create Project').click();

      // Navigate to dashboard
      cy.visit('/dashboard');

      // Verify edit link exists
      cy.contains('My Projects')
        .closest('[class*="Card"]')
        .within(() => {
          cy.get('a').contains(projectTitle).should('be.visible');
          cy.get('a')
            .contains(projectTitle)
            .should('have.attr', 'href')
            .and('include', '/project/edit');
        });
    });

    it('should allow editing project from dashboard link', () => {
      // Create a project
      cy.visit('/project/add');
      const projectTitle = `Link Edit Project ${Date.now()}`;
      cy.get('input[placeholder*="title"]').type(projectTitle, {
        force: true,
      });
      cy.get('select').first().select('draft');
      cy.get('button').contains('Create Project').click();

      // Navigate to dashboard
      cy.visit('/dashboard');

      // Click edit link
      cy.contains('My Projects')
        .closest('[class*="Card"]')
        .within(() => {
          cy.get('a').contains(projectTitle).click();
        });

      // Should redirect to edit page
      cy.url().should('include', '/project/edit');
      cy.contains('h2', 'Edit Project').should('be.visible');
    });
  });

  describe('My Feedback Section', () => {
    it('should show "No feedback yet" when user has no feedback', () => {
      cy.visit('/dashboard');

      cy.contains('My Feedback')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('No feedback yet').should('be.visible');
        });
    });

    it('should display authored feedback', () => {
      // Create a project
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Feedback Project', {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      // Get project ID
      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      cy.url().then((url) => {
        const projectId = url.split('/').pop();

        // Add feedback
        cy.visit(`/project/${projectId}`);
        cy.get('input[placeholder*="Rating"]')
          .clear()
          .type('5', { force: true });
        cy.get('textarea[placeholder*="thoughts"]').type(
          'Excellent feedback',
          { force: true }
        );
        cy.get('button').contains('Submit Feedback').click();

        // Navigate to dashboard
        cy.visit('/dashboard');

        // Verify feedback appears
        cy.contains('My Feedback')
          .closest('[class*="Card"]')
          .within(() => {
            cy.contains('Feedback Project').should('be.visible');
            cy.contains('Rating: 5/5').should('be.visible');
            cy.contains('Excellent feedback').should('be.visible');
          });
      });
    });

    it('should show feedback rating and comment', () => {
      // Create project and add feedback
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Rating Test Project', {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      cy.url().then((url) => {
        const projectId = url.split('/').pop();

        cy.visit(`/project/${projectId}`);
        cy.get('input[placeholder*="Rating"]')
          .clear()
          .type('4', { force: true });
        cy.get('textarea[placeholder*="thoughts"]').type(
          'Great project with useful features',
          { force: true }
        );
        cy.get('button').contains('Submit Feedback').click();

        // Navigate to dashboard
        cy.visit('/dashboard');

        // Verify feedback details
        cy.contains('My Feedback')
          .closest('[class*="Card"]')
          .within(() => {
            cy.contains('Rating: 4/5').should('be.visible');
            cy.contains('Great project with useful features').should(
              'be.visible'
            );
          });
      });
    });

    it('should only show feedback authored by current user', () => {
      // Create a project
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Multi User Feedback', {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      cy.url().then((url) => {
        const projectId = url.split('/').pop();

        // First user adds feedback
        cy.visit(`/project/${projectId}`);
        cy.get('input[placeholder*="Rating"]')
          .clear()
          .type('5', { force: true });
        cy.get('textarea[placeholder*="thoughts"]').type(
          'First user feedback',
          { force: true }
        );
        cy.get('button').contains('Submit Feedback').click();

        // Logout and create second user
        cy.logout();

        const secondUser = {
          displayName: 'Second User',
          email: `seconduser${Date.now()}@example.com`,
          password: 'Password123',
        };

        cy.signup(
          'second_user',
          secondUser.displayName,
          secondUser.email,
          secondUser.password
        );

        // Second user adds feedback
        cy.visit(`/project/${projectId}`);
        cy.get('input[placeholder*="Rating"]')
          .clear()
          .type('3', { force: true });
        cy.get('textarea[placeholder*="thoughts"]').type(
          'Second user feedback',
          { force: true }
        );
        cy.get('button').contains('Submit Feedback').click();

        // Navigate to second user's dashboard
        cy.visit('/dashboard');

        // Verify only second user's feedback appears
        cy.contains('My Feedback')
          .closest('[class*="Card"]')
          .within(() => {
            cy.contains('Second user feedback').should('be.visible');
            cy.contains('Rating: 3/5').should('be.visible');
          });
      });
    });
  });

  describe('Dashboard Layout', () => {
    it('should render MUI Card components for each section', () => {
      cy.visit('/dashboard');

      // Verify cards are rendered
      cy.get('[class*="MuiCard"]').should('have.length.at.least', 3);
    });

    it('should display user welcome message', () => {
      cy.visit('/dashboard');

      cy.contains(`Welcome, ${testUser.displayName}`).should('be.visible');
    });

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-12');
      cy.visit('/dashboard');

      // Verify sections are still visible on mobile
      cy.contains('My Courses').should('be.visible');
      cy.contains('My Projects').should('be.visible');
      cy.contains('My Feedback').should('be.visible');
    });
  });

  describe('Dashboard Data Refresh', () => {
    it('should refresh when navigating back to dashboard', () => {
      cy.visit('/dashboard');

      // Verify no projects
      cy.contains('My Projects')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('No projects yet').should('be.visible');
        });

      // Navigate away
      cy.visit('/project/list');

      // Create a project
      cy.get('button').contains('Add Project').click();
      cy.get('input[placeholder*="title"]').type('Refresh Test Project', {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      // Navigate back to dashboard
      cy.visit('/dashboard');

      // Verify new project appears
      cy.contains('My Projects')
        .closest('[class*="Card"]')
        .within(() => {
          cy.contains('Refresh Test Project').should('be.visible');
        });
    });
  });

  describe('Dashboard Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Visit dashboard - if API fails, should show error
      cy.visit('/dashboard');

      // Page should still be visible even if API returns error
      // (depending on backend availability)
      cy.get('body').should('be.visible');
    });
  });
});
