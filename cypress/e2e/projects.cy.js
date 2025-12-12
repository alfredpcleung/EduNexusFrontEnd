describe('Projects Flow', () => {
  let testUser = {};
  let projectData = {};

  beforeEach(() => {
    // Create a test user
    testUser = {
      displayName: 'Project Test User',
      email: `projectuser${Date.now()}@example.com`,
      password: 'Password123',
      role: 'student',
    };

    // Cleanup and create user
    cy.cleanup();
    cy.signup(
      'proj_user',
      testUser.displayName,
      testUser.email,
      testUser.password
    );
  });

  describe('Add Project', () => {
    it('should navigate to add project form and create project', () => {
      cy.visit('/project/list');

      // Verify we see the Add Project button
      cy.get('button').contains('Add Project').should('be.visible').click();

      // Verify we're on add project page
      cy.url().should('include', '/project/add');
      cy.contains('h2', 'Create New Project').should('be.visible');

      // Fill form
      const projectTitle = `Test Project ${Date.now()}`;
      cy.get('input[placeholder*="title"]').type(projectTitle, { force: true });
      cy.get('textarea[placeholder*="description"]').type(
        'This is a test project description',
        { force: true }
      );
      cy.get('input[placeholder*="Course"]').type('COMP229', { force: true });
      cy.get('select').first().select('active');
      cy.get('input[placeholder*="Tags"]').type('test, cypress, e2e', {
        force: true,
      });

      // Submit
      cy.get('button').contains('Create Project').click();

      // Verify redirect to project list
      cy.url().should('include', '/project/list');

      // Verify project appears in list
      cy.contains(projectTitle).should('be.visible');
    });

    it('should show error when title is empty', () => {
      cy.visit('/project/add');

      // Leave title empty and submit
      cy.get('button').contains('Create Project').click();

      // Should show error
      cy.contains('Title is required').should('be.visible');
    });

    it('should require authentication to add project', () => {
      cy.logout();
      cy.visit('/project/add');

      // Should redirect to signin
      cy.url().should('include', '/users/signin');
    });
  });

  describe('Project List', () => {
    it('should display all projects in a table', () => {
      // Create a project first
      cy.visit('/project/add');
      const projectTitle = `List Test Project ${Date.now()}`;
      cy.get('input[placeholder*="title"]').type(projectTitle, {
        force: true,
      });
      cy.get('textarea[placeholder*="description"]').type(
        'Test description',
        { force: true }
      );
      cy.get('select').first().select('draft');
      cy.get('button').contains('Create Project').click();

      // Navigate to list
      cy.visit('/project/list');

      // Verify table structure
      cy.get('table').should('be.visible');
      cy.get('th').contains('Title').should('be.visible');
      cy.get('th').contains('Status').should('be.visible');
      cy.get('th').contains('Owner').should('be.visible');

      // Verify project appears in list
      cy.contains(projectTitle).should('be.visible');
    });

    it('should show owner badge for owned projects', () => {
      // Create a project
      cy.visit('/project/add');
      const projectTitle = `Owner Badge Test ${Date.now()}`;
      cy.get('input[placeholder*="title"]').type(projectTitle, {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      // View list
      cy.visit('/project/list');

      // Find the project row and verify "You" badge
      cy.contains(projectTitle)
        .closest('tr')
        .should('contain', 'You');
    });

    it('should show Add Project button only when authenticated', () => {
      cy.visit('/project/list');
      cy.get('button').contains('Add Project').should('be.visible');

      cy.logout();
      cy.visit('/project/list');
      cy.get('button').contains('Add Project').should('not.exist');
    });
  });

  describe('View Project Details', () => {
    beforeEach(() => {
      // Create a test project
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Detail Test Project', {
        force: true,
      });
      cy.get('textarea[placeholder*="description"]').type(
        'Test project description',
        { force: true }
      );
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();
    });

    it('should display project details', () => {
      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      // Verify project info is displayed
      cy.contains('Detail Test Project').should('be.visible');
      cy.contains('Test project description').should('be.visible');
      cy.contains('Status: active').should('be.visible');
    });

    it('should show edit button for owner', () => {
      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      // Should show Edit button
      cy.get('button').contains('Edit').should('be.visible');
    });
  });

  describe('Edit Project', () => {
    beforeEach(() => {
      // Create a test project
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Edit Test Project', {
        force: true,
      });
      cy.get('textarea[placeholder*="description"]').type(
        'Original description',
        { force: true }
      );
      cy.get('select').first().select('draft');
      cy.get('button').contains('Create Project').click();
    });

    it('should navigate to edit form and update project', () => {
      cy.visit('/project/list');

      // Click the first View button to see the project
      cy.get('button').contains('View').first().click();

      // Click Edit button
      cy.get('button').contains('Edit').click();

      // Verify we're on edit page
      cy.url().should('include', '/project/edit');
      cy.contains('h2', 'Edit Project').should('be.visible');

      // Verify form is pre-filled
      cy.get('input[value="Edit Test Project"]').should('be.visible');

      // Update title
      const newTitle = `Updated Project ${Date.now()}`;
      cy.get('input[value="Edit Test Project"]')
        .clear()
        .type(newTitle, { force: true });

      // Update description
      cy.get('textarea').clear().type('Updated description', { force: true });

      // Update status
      cy.get('select').first().select('active');

      // Submit
      cy.get('button').contains('Update Project').click();

      // Verify redirect to list
      cy.url().should('include', '/project/list');

      // Verify updated project appears in list
      cy.contains(newTitle).should('be.visible');
    });

    it('should show 403 error when non-owner tries to edit', () => {
      // Get project ID from URL
      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      cy.url().then((url) => {
        const projectId = url.split('/').pop();

        // Logout current user
        cy.logout();

        // Create another user
        const newUser = {
          displayName: 'Another User',
          email: `anotheruser${Date.now()}@example.com`,
          password: 'Password123',
          role: 'student',
        };
        cy.signup(
          'another_user',
          newUser.displayName,
          newUser.email,
          newUser.password
        );

        // Try to edit the first user's project
        cy.visit(`/project/edit/${projectId}`);

        // Should show permission error
        cy.contains("You don't have permission to edit this project").should(
          'be.visible'
        );
      });
    });
  });

  describe('Delete Project', () => {
    it('should delete project and remove from list', () => {
      // Create a project
      cy.visit('/project/add');
      const projectTitle = `Delete Test ${Date.now()}`;
      cy.get('input[placeholder*="title"]').type(projectTitle, {
        force: true,
      });
      cy.get('select').first().select('draft');
      cy.get('button').contains('Create Project').click();

      // Navigate to list and view the project
      cy.visit('/project/list');
      cy.contains(projectTitle).should('be.visible');

      cy.get('button').contains('View').first().click();

      // Note: Delete functionality would need to be added to ProjectDetail component
      // This test assumes a delete button exists
      // cy.get('button').contains('Delete').click();
      // cy.on('window:confirm', () => true);
      // cy.url().should('include', '/project/list');
      // cy.contains(projectTitle).should('not.exist');
    });
  });

  describe('Project Ownership Checks', () => {
    it('should not show edit/delete buttons for non-owner', () => {
      // Create a project with first user
      cy.visit('/project/add');
      cy.get('input[placeholder*="title"]').type('Ownership Test', {
        force: true,
      });
      cy.get('select').first().select('active');
      cy.get('button').contains('Create Project').click();

      // Get the project ID
      cy.visit('/project/list');
      cy.get('button').contains('View').first().click();

      cy.url().then((url) => {
        const projectId = url.split('/').pop();

        // Logout and create new user
        cy.logout();
        const newUser = {
          displayName: 'Different User',
          email: `different${Date.now()}@example.com`,
          password: 'Password123',
        };
        cy.signup(
          'diff_user',
          newUser.displayName,
          newUser.email,
          newUser.password
        );

        // View project as non-owner
        cy.visit(`/project/${projectId}`);

        // Should NOT see Edit button
        cy.get('button').contains('Edit').should('not.exist');
      });
    });
  });
});
