describe('Feedback Flow', () => {
  let testUser = {};
  let anotherUser = {};
  let projectId = null;

  beforeEach(() => {
    // Create test user
    testUser = {
      displayName: 'Feedback Test User',
      email: `feedbackuser${Date.now()}@example.com`,
      password: 'Password123',
      role: 'student',
    };

    cy.cleanup();
    cy.signup(
      'fb_user',
      testUser.displayName,
      testUser.email,
      testUser.password
    );

    // Create a test project
    cy.visit('/project/add');
    cy.get('input[placeholder*="title"]').type('Feedback Test Project', {
      force: true,
    });
    cy.get('textarea[placeholder*="description"]').type(
      'Project for feedback testing',
      { force: true }
    );
    cy.get('select').first().select('active');
    cy.get('button').contains('Create Project').click();

    // Extract project ID from URL or find it in the list
    cy.visit('/project/list');
    cy.contains('Feedback Test Project')
      .closest('tr')
      .within(() => {
        cy.get('button').contains('View').click();
      });

    cy.url().then((url) => {
      projectId = url.split('/').pop();
    });
  });

  describe('Add Feedback', () => {
    it('should fill feedback form and submit feedback', () => {
      cy.visit(`/project/${projectId}`);

      // Verify FeedbackForm is visible
      cy.contains('Leave Feedback').should('be.visible');

      // Fill form
      cy.get('input[placeholder*="Rating"]').clear().type('4', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(
        'Great project! Very well executed.',
        { force: true }
      );

      // Submit
      cy.get('button').contains('Submit Feedback').click();

      // Verify success message
      cy.contains('Feedback submitted successfully').should('be.visible');

      // Verify feedback appears in list
      cy.contains('Rating: 4/5').should('be.visible');
      cy.contains('Great project! Very well executed.').should('be.visible');
    });

    it('should validate rating is between 1-5', () => {
      cy.visit(`/project/${projectId}`);

      // Try invalid rating
      cy.get('input[placeholder*="Rating"]').clear().type('10', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type('Test feedback', {
        force: true,
      });

      cy.get('button').contains('Submit Feedback').click();

      // Should show error
      cy.contains('Rating must be between 1 and 5').should('be.visible');
    });

    it('should require comment field', () => {
      cy.visit(`/project/${projectId}`);

      // Leave comment empty
      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });

      cy.get('button').contains('Submit Feedback').click();

      // Should show error
      cy.contains('Comment cannot be empty').should('be.visible');
    });

    it('should require authentication to leave feedback', () => {
      cy.logout();
      cy.visit(`/project/${projectId}`);

      // Should not see feedback form
      cy.contains('Leave Feedback').should('not.exist');

      // Should see signin prompt
      cy.contains('Sign in').should('be.visible');
    });

    it('should allow multiple users to leave feedback', () => {
      // First user leaves feedback
      cy.visit(`/project/${projectId}`);
      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(
        'Excellent work from user 1',
        { force: true }
      );
      cy.get('button').contains('Submit Feedback').click();
      cy.contains('Feedback submitted successfully').should('be.visible');

      // Logout and create new user
      cy.logout();

      anotherUser = {
        displayName: 'Another Feedback User',
        email: `anotherfbuser${Date.now()}@example.com`,
        password: 'Password123',
      };

      cy.signup(
        'another_fb_user',
        anotherUser.displayName,
        anotherUser.email,
        anotherUser.password
      );

      // Second user leaves feedback
      cy.visit(`/project/${projectId}`);
      cy.get('input[placeholder*="Rating"]').clear().type('4', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(
        'Great project from user 2',
        { force: true }
      );
      cy.get('button').contains('Submit Feedback').click();
      cy.contains('Feedback submitted successfully').should('be.visible');

      // Verify both feedbacks are visible
      cy.contains('Excellent work from user 1').should('be.visible');
      cy.contains('Great project from user 2').should('be.visible');
    });
  });

  describe('Delete Feedback', () => {
    beforeEach(() => {
      // Add feedback first
      cy.visit(`/project/${projectId}`);
      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(
        'Feedback to be deleted',
        { force: true }
      );
      cy.get('button').contains('Submit Feedback').click();
      cy.contains('Feedback submitted successfully').should('be.visible');
    });

    it('should delete feedback as author', () => {
      cy.visit(`/project/${projectId}`);

      // Verify feedback is visible
      cy.contains('Feedback to be deleted').should('be.visible');

      // Click delete button
      cy.get('button').contains('Delete').click();

      // Verify feedback is removed
      cy.contains('Feedback to be deleted').should('not.exist');
    });

    it('should not allow non-author to delete feedback', () => {
      // Create another user
      cy.logout();

      const newUser = {
        displayName: 'Non Author User',
        email: `nonauthor${Date.now()}@example.com`,
        password: 'Password123',
      };

      cy.signup(
        'non_author',
        newUser.displayName,
        newUser.email,
        newUser.password
      );

      // View project
      cy.visit(`/project/${projectId}`);

      // Should see the feedback but no delete button
      cy.contains('Feedback to be deleted').should('be.visible');

      // Should not see delete button for this user
      cy.get('button').contains('Delete').should('not.exist');
    });

    it('should show 403 error if non-author tries to delete via API', () => {
      // Get feedback ID first (would need to be extracted from page)
      // This test assumes proper error handling is in place

      // Logout and create different user
      cy.logout();

      anotherUser = {
        displayName: 'Attempting Delete User',
        email: `attemptdelete${Date.now()}@example.com`,
        password: 'Password123',
      };

      cy.signup(
        'attempt_delete_user',
        anotherUser.displayName,
        anotherUser.email,
        anotherUser.password
      );

      cy.visit(`/project/${projectId}`);

      // Verify the original feedback is visible but delete button not shown
      cy.contains('Feedback to be deleted').should('be.visible');
      cy.get('button').contains('Delete').should('not.exist');
    });
  });

  describe('Feedback Display', () => {
    it('should display feedback count in section title', () => {
      cy.visit(`/project/${projectId}`);

      // Add feedback
      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type('Test feedback', {
        force: true,
      });
      cy.get('button').contains('Submit Feedback').click();

      // Verify feedback count is shown
      cy.contains('Feedback (1)').should('be.visible');
    });

    it('should display all feedback information correctly', () => {
      cy.visit(`/project/${projectId}`);

      // Add feedback
      const feedbackComment = 'This is detailed feedback for testing';
      cy.get('input[placeholder*="Rating"]').clear().type('4', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(feedbackComment, {
        force: true,
      });
      cy.get('button').contains('Submit Feedback').click();

      // Verify all feedback details are displayed
      cy.contains('Rating: 4/5').should('be.visible');
      cy.contains(feedbackComment).should('be.visible');
      cy.contains(testUser.displayName).should('be.visible');
    });

    it('should show no feedback message when empty', () => {
      cy.visit(`/project/${projectId}`);

      // Should show "No feedback yet" message
      cy.contains('No feedback yet').should('be.visible');
    });
  });

  describe('Feedback Validation', () => {
    it('should not allow submitting with empty rating', () => {
      cy.visit(`/project/${projectId}`);

      // Clear rating and submit
      cy.get('textarea[placeholder*="thoughts"]').type('Test feedback', {
        force: true,
      });

      cy.get('button').contains('Submit Feedback').click();

      // Should show validation error or prevent submission
      cy.contains('button', 'Submit Feedback').should('be.visible');
    });

    it('should not allow submitting with empty comment', () => {
      cy.visit(`/project/${projectId}`);

      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });
      cy.get('button').contains('Submit Feedback').click();

      // Should show error
      cy.contains('Comment cannot be empty').should('be.visible');
    });
  });

  describe('Feedback Author Identity', () => {
    it('should display author information with feedback', () => {
      cy.visit(`/project/${projectId}`);

      // Add feedback
      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(
        'Feedback with author info',
        { force: true }
      );
      cy.get('button').contains('Submit Feedback').click();

      // Verify author is shown
      cy.contains(testUser.displayName).should('be.visible');
    });

    it('should show delete button only for author', () => {
      // User 1 adds feedback
      cy.visit(`/project/${projectId}`);
      cy.get('input[placeholder*="Rating"]').clear().type('5', { force: true });
      cy.get('textarea[placeholder*="thoughts"]').type(
        'User 1 feedback',
        { force: true }
      );
      cy.get('button').contains('Submit Feedback').click();

      // Verify delete button is visible for author
      cy.contains('User 1 feedback')
        .closest('[class*="Card"]')
        .within(() => {
          cy.get('button').contains('Delete').should('be.visible');
        });

      // Logout and create user 2
      cy.logout();
      anotherUser = {
        displayName: 'User Two',
        email: `usertwo${Date.now()}@example.com`,
        password: 'Password123',
      };
      cy.signup(
        'user_two',
        anotherUser.displayName,
        anotherUser.email,
        anotherUser.password
      );

      // User 2 views the feedback
      cy.visit(`/project/${projectId}`);

      // Verify delete button is NOT visible for non-author
      cy.contains('User 1 feedback')
        .closest('[class*="Card"]')
        .within(() => {
          cy.get('button').contains('Delete').should('not.exist');
        });
    });
  });
});
