# Cypress E2E Tests

Comprehensive end-to-end tests for EduNexus frontend using Cypress. Tests cover authentication, projects, feedback, and dashboard features.

## Setup

### 1. Install Cypress

```bash
npm install --save-dev cypress
```

### 2. Update package.json scripts (optional)

Add to `package.json`:
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:headed": "cypress run --headed",
    "cypress:debug": "cypress run --debug"
  }
}
```

### 3. Configure Environment

Create or update `.env` for API base URL (optional):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

In `cypress.config.js`, the API URL is configured as:
```javascript
env: {
  API_BASE_URL: 'http://localhost:3000/api',
}
```

## Running Tests

### Open Cypress UI (Interactive Mode)

```bash
npm run cypress:open
# or
npx cypress open
```

This opens the Cypress Test Runner where you can:
- View all test files
- Run individual tests
- Watch tests run in real-time
- Debug failures

### Run Tests Headless (CI/CD Mode)

Run all tests:
```bash
npm run cypress:run
# or
npx cypress run
```

Run with browser visible:
```bash
npm run cypress:run:headed
```

Run specific test file:
```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

### Debug Tests

```bash
npm run cypress:debug
# or
npx cypress run --debug
```

## Test Structure

```
cypress/
├── e2e/                          # End-to-end tests
│   ├── auth.cy.js               # Authentication flows (signup, signin, logout)
│   ├── projects.cy.js           # Project CRUD operations
│   ├── feedback.cy.js           # Feedback CRUD and validation
│   └── dashboard.cy.js          # Dashboard display and data
├── support/
│   ├── commands.js              # Custom Cypress commands
│   └── e2e.js                   # Global test configuration
└── fixtures/                     # Test data (if needed)
```

## Test Files Overview

### auth.cy.js
Tests authentication flows:
- **Signup**: Form validation, duplicate email handling, password matching
- **Signin**: Valid/invalid credentials, token storage
- **Logout**: Token removal, navbar update, redirect
- **Protected Routes**: Verify auth requirement
- **Token Expiration**: 401 handling

**Test Count**: ~12 tests

### projects.cy.js
Tests project management:
- **Add Project**: Form validation, project creation, redirect
- **Project List**: Display, filter, owner badge
- **View Details**: Project information display
- **Edit Project**: Pre-fill, update, ownership verification
- **Delete Project**: Remove from list (if implemented)
- **Ownership Checks**: Non-owner restrictions

**Test Count**: ~15 tests

### feedback.cy.js
Tests feedback system:
- **Add Feedback**: Form submission, validation, rating 1-5
- **Display**: Feedback listing, author information
- **Delete**: Author-only deletion
- **Validation**: Required fields, comment/rating validation
- **Authorization**: Non-author restrictions
- **Multiple Users**: Multi-user feedback scenarios

**Test Count**: ~15 tests

### dashboard.cy.js
Tests dashboard display:
- **Access Control**: Authentication requirement
- **My Courses**: Display owned courses, edit links
- **My Projects**: Display owned projects, edit links
- **My Feedback**: Display authored feedback, filtering
- **Layout**: MUI components, responsiveness
- **Data Refresh**: Updated content after actions

**Test Count**: ~18 tests

## Custom Commands

### Authentication Commands

```javascript
// Login a user
cy.login(email, password);

// Register and login
cy.signup(uid, displayName, email, password, role);

// Logout
cy.logout();

// Clear state
cy.cleanup();
```

### Data Commands

```javascript
// Create project via API
cy.createProject(token, projectData);

// Create feedback via API
cy.createFeedback(token, feedbackData);

// Get dashboard data
cy.getDashboard(token);

// Get user from localStorage
cy.getUser();

// Get token from localStorage
cy.getToken();
```

## Prerequisites

### Running Tests Locally

1. **Development Server Running**
   ```bash
   npm start
   # Should be running at http://localhost:5173
   ```

2. **Backend API Running**
   ```bash
   # Backend should be running at http://localhost:3000/api
   # or configure VITE_API_BASE_URL in cypress.config.js
   ```

3. **Database Seeded** (optional)
   - Tests create their own test users and data
   - No pre-existing data required

## Test Execution Flow

### Before Each Test
1. Clear localStorage
2. Navigate to home page
3. Setup test-specific data if needed

### During Test
1. Interact with UI
2. Assert on DOM elements
3. Verify state changes
4. Check localStorage/API responses

### After Test
1. Cleanup test data (automatic via `cy.cleanup()`)
2. Generate screenshots on failure
3. Clear session

## Debugging

### View Network Requests
In Cypress, use the Network tab to:
- Monitor API calls
- Check request/response headers
- Verify Authorization headers

### Check Console Logs
- JavaScript errors appear in Cypress console
- Custom logs from tests visible in real-time

### Use cy.debug()
```javascript
cy.get('button').debug().click();
```

### Pause Execution
```javascript
cy.pause(); // Manual step through tests
cy.then(() => { debugger; }); // Use browser debugger
```

## Common Issues

### Tests Fail with "Element not found"
- Check if selectors are correct
- Use `cy.get('[data-testid="..."]')` for better reliability
- Add waits: `cy.wait(1000)`

### API Requests Fail (401/403)
- Verify backend is running
- Check API_BASE_URL in cypress.config.js
- Ensure token is stored correctly in localStorage

### Timeout Errors
- Increase timeout: `cy.get('button', { timeout: 15000 })`
- Check network speed and API response time
- Verify backend is responsive

### Tests Pass Locally but Fail in CI
- Ensure backend URL is correct for CI environment
- Add environment variable configuration
- Check for race conditions with proper waits

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Cypress E2E Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run build
      
      - name: Start backend
        run: cd ../backend && npm start &
        
      - name: Run Cypress tests
        run: npm run cypress:run
        
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

## Best Practices

1. **Use data-testid attributes**: More reliable than class selectors
2. **Avoid hardcoded waits**: Use cy.wait() with network requests
3. **Test user workflows**: Not individual components
4. **Keep tests independent**: Each test should setup its own data
5. **Use custom commands**: Reduce code duplication
6. **Name tests descriptively**: Clear test purposes
7. **Test happy path and edge cases**: Both success and error scenarios
8. **Check accessibility**: Use ARIA attributes where possible

## Maintenance

### Updating Tests
- When UI changes, update selectors
- When API changes, update request/response handling
- Add tests for new features
- Remove tests for deprecated features

### Test Data
- Tests create their own test data
- No fixtures required
- Cleanup happens automatically

### Flaky Tests
- Increase waits if timing is an issue
- Use explicit waits instead of implicit
- Check for race conditions
- Verify backend is stable

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Debugging Guide](https://docs.cypress.io/guides/guides/debugging)

## Troubleshooting

Run tests with verbose output:
```bash
npx cypress run --verbose
```

View network activity:
1. Open DevTools in Cypress (F12)
2. Go to Network tab
3. Run tests

Generate detailed logs:
```bash
npx cypress run --config trashAssetsBeforeRuns=false
```

Check Cypress logs:
```bash
npx cypress run --record --key YOUR_RECORD_KEY
```

---

**Last Updated**: December 2024
**Test Framework**: Cypress v13+
**Frontend**: React 19 + Vite
**Test Count**: ~60 tests
