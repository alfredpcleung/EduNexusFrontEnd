# Testing Guide

## Overview

EduNexus Frontend has comprehensive test coverage with **64+ unit tests** and **E2E test suites** covering all critical user flows, authorization scenarios, and error handling.

## Unit Tests (Vitest + React Testing Library)

### Test Summary

- **Total Tests**: 64+
- **All Passing**: ✅
- **Coverage**: Core components, services, hooks, utilities

### Test Files (7 total)

| File | Tests | Focus |
|------|-------|-------|
| `ListUser.test.jsx` | 8 | User list rendering, filtering |
| `ListItemUser.test.jsx` | 7 | User card display, deletion |
| `ListCourse.test.jsx` | 8 | Course list, search, status filter |
| `ListItemCourse.test.jsx` | 7 | Course card, aggregate ratings |
| `FeedbackItem.test.jsx` | 10 | Feedback display, delete auth, error handling |
| `FeedbackList.test.jsx` | 7 | Feedback list, empty state, errors |
| `FeedbackForm.test.jsx` | 9 | Form submission, 409 Conflict, validation |

### Run Unit Tests

```bash
# Run once
npm test -- --run

# Watch mode
npm test

# With coverage
npm test -- --coverage
```

## E2E Tests (Cypress)

### Test Suites

| Suite | Coverage |
|-------|----------|
| `auth.cy.js` | Sign up, sign in, sign out, protected routes |
| `dashboard.cy.js` | Dashboard load, course/project display |
| `projects.cy.js` | Project CRUD, feedback submission |
| `feedback.cy.js` | Feedback creation, deletion, 409 Conflict, RBAC |

### Authorization Tests

- ✅ Delete feedback only visible to owner/admin
- ✅ 403 Forbidden when unauthorized
- ✅ 409 Conflict for duplicate feedback
- ✅ Role-based access (student/instructor/admin)

### Run E2E Tests

```bash
# Open Cypress UI
npm run cypress:open

# Run headless
npm run cypress:run
```

## Testing Commands

```bash
# Unit tests
npm test              # Watch mode
npm test -- --run     # Single run
npm test -- --ui      # UI dashboard

# E2E tests
npm run cypress:open  # Interactive mode
npm run cypress:run   # Headless mode

# Build verification
npm run build         # Production build
npm run preview       # Preview build
npm run lint          # Code quality
```

## Test Structure

### Unit Test Example (FeedbackItem)

```javascript
describe('FeedbackItem', () => {
  it('should render feedback with rating', () => {
    render(
      <AuthProvider>
        <FeedbackItem feedback={mockFeedback} />
      </AuthProvider>
    );
    expect(screen.getByText('5/5')).toBeInTheDocument();
  });
  
  it('should show delete button for owner', () => {
    // Authorization check with mock user
  });
});
```

### E2E Test Example (Feedback)

```javascript
describe('Project Feedback', () => {
  it('should submit feedback successfully', () => {
    cy.visit('/projects/1');
    cy.get('[data-cy=feedback-rating]').select('5');
    cy.get('[data-cy=feedback-comment]').type('Great project!');
    cy.get('[data-cy=submit-feedback]').click();
    cy.get('[data-cy=feedback-item]').should('contain', 'Great project!');
  });
});
```

## Authorization Testing

### RBAC Scenarios Covered

- Student can create feedback but only delete own
- Instructor can view/delete any feedback
- Admin can perform all operations
- 403 errors caught and displayed
- 409 Conflict handled gracefully

### Test Fixtures

Mock users and data:
```javascript
const mockStudent = { role: 'student', id: 1 };
const mockFeedback = { rating: 5, comment: 'Good', author: 'user1' };
```

## Error Handling Tests

- ✅ Network errors display toast
- ✅ 400 Bad Request validation messages
- ✅ 403 Forbidden with helpful message
- ✅ 409 Conflict (duplicate feedback) with warning
- ✅ 500 Server error with retry option

## CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Pre-deployment verification

## Adding New Tests

### Step 1: Create test file
```bash
touch src/components/MyComponent.test.jsx
```

### Step 2: Import test utilities
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthContext';
```

### Step 3: Write test with AuthProvider
```javascript
it('should do something', () => {
  render(
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
  // assertions
});
```

### Step 4: Run and verify
```bash
npm test -- MyComponent.test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase timeout in vitest.config.js |
| AuthProvider not working | Wrap component in `<AuthProvider>` |
| Mock data issues | Check mock user has required properties |
| E2E tests flaky | Add cy.wait() or cy.intercept() for API calls |
| Build fails tests | Run `npm test -- --run` to see errors |

## Coverage Goals

- **Components**: 80%+ line coverage
- **Services**: 90%+ coverage
- **Utilities**: 100% coverage
- **Hooks**: 85%+ coverage
- **E2E**: All critical user paths

## Test Best Practices

1. ✅ Use semantic queries (`getByRole`, `getByText`)
2. ✅ Avoid testing implementation details
3. ✅ Mock external API calls
4. ✅ Test user behavior, not component internals
5. ✅ Use `waitFor` for async operations
6. ✅ Wrap components in required providers
7. ✅ Keep tests focused and independent
8. ✅ Name tests descriptively