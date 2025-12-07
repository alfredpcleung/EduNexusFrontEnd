# React Testing Library Tests Documentation

## Overview
This test suite provides comprehensive coverage for the EduNexus frontend components using React Testing Library and Vitest.

## Test Files

### 1. ListCourse Component Tests (`src/components/Course/ListCourse.test.jsx`)
Tests for the courses list component including:
- **Loading State**: Verifies CircularProgress displays during data fetch
- **Data Rendering**: Confirms all course data renders correctly (title, instructor, credits, status)
- **Error Handling**: Tests error message display when API fails
- **Empty State**: Verifies "No courses found" message when list is empty
- **API Integration**: Confirms list() service is called on mount
- **Table Headers**: Validates all table column headers display
- **Edge Cases**: Handles both `id` and `_id` fields from API
- **Status Badges**: Verifies status badges display with correct styling

**Run**: `npm test -- ListCourse.test.jsx`

### 2. ListItemCourse Component Tests (`src/components/Course/ListItemCourse.test.jsx`)
Tests for individual course row component including:
- **Data Display**: Verifies course information renders correctly
- **Delete Button**: Tests delete functionality with confirmation
- **Confirmation Dialog**: Ensures delete shows confirmation before removal
- **Cancel Delete**: Verifies nothing happens when delete is cancelled
- **Error Handling**: Tests error display when delete fails
- **ID Handling**: Supports both `id` and `_id` fields
- **Missing Fields**: Displays "N/A" for missing data
- **Edit Link**: Verifies edit link points to correct route
- **Callback Execution**: Confirms onRemoved callback is called after successful delete

**Run**: `npm test -- ListItemCourse.test.jsx`

### 3. ListUser Component Tests (`src/components/User/ListUser.test.jsx`)
Tests for the users list component including:
- **Loading State**: Verifies CircularProgress displays
- **User Rendering**: Confirms all user data displays (displayName, email, role, bio)
- **Error Handling**: Tests error message display
- **Empty State**: Verifies "No users found" message
- **API Integration**: Confirms list() service is called
- **Table Headers**: Validates all column headers
- **ID Handling**: Supports both `uid` and `_id` fields
- **Role Badges**: Verifies role badges display correctly
- **Nested Data**: Handles nested API response structure { data: [...] }
- **Missing Fields**: Displays "N/A" for incomplete user data

**Run**: `npm test -- ListUser.test.jsx`

### 4. ListItemUser Component Tests (`src/components/User/ListItemUser.test.jsx`)
Tests for individual user row component including:
- **Data Display**: Verifies user information renders
- **Delete Button**: Tests delete functionality
- **Confirmation**: Ensures delete confirmation dialog appears
- **Cancel Delete**: Verifies onRemoved is not called when cancelled
- **ID Handling**: Supports both `uid` and `_id` fields
- **Missing Fields**: Displays "N/A" for missing data
- **Role Display**: Verifies different role colors/styles
- **Edit Button**: Confirms edit button exists (currently disabled)
- **Default Role**: Displays "student" when role is missing

**Run**: `npm test -- ListItemUser.test.jsx`

## Setup and Configuration

### Vitest Configuration (`vitest.config.js`)
```javascript
- Environment: jsdom (for DOM testing)
- Globals: Enabled (no need to import describe, it, expect)
- Setup Files: src/test/setup.js
- CSS: Enabled
```

### Test Setup File (`src/test/setup.js`)
- Imports @testing-library/jest-dom for DOM matchers
- Configures cleanup after each test
- Mocks localStorage
- Mocks window.matchMedia

### Test Utilities (`src/test/test-utils.js`)
Helper functions for testing:
- `renderWithRouter`: Renders component with BrowserRouter
- `createMockCourse`: Creates mock course data
- `createMockUser`: Creates mock user data
- `mockFetch`: Mocks fetch API
- `waitForLoadingToFinish`: Waits for loading states

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npm test -- ListCourse.test.jsx
```

### With UI (Vitest Dashboard)
```bash
npm test:ui
```

### Coverage Report
```bash
npm test:coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Mock Strategy

### Service Mocks
All service calls are mocked using `vi.mock()`:
```javascript
import { vi } from 'vitest';
vi.mock('../../services/coursesService');
```

### API Response Mocks
Services are mocked to return:
- Success: `mockResolvedValue(data)`
- Error: `mockRejectedValue(new Error(message))`

### Window Mocks
Global mocks for:
- `window.confirm()`: For delete confirmations
- `window.alert()`: For error alerts
- `localStorage`: For token storage
- `matchMedia()`: For responsive design

## Test Data Fixtures

### Mock Courses
```javascript
{
  id: '1',
  title: 'React Fundamentals',
  description: 'Learn React basics',
  credits: 3,
  status: 'active',
  instructor: 'John Doe'
}
```

### Mock Users
```javascript
{
  uid: '1',
  displayName: 'John Doe',
  email: 'john@example.com',
  role: 'student',
  bio: 'I love learning'
}
```

## Key Testing Patterns

### 1. Async Data Loading
```javascript
coursesService.list.mockResolvedValue(mockCourses);

render(<ListCourse />);

await waitFor(() => {
  expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
});
```

### 2. Error Handling
```javascript
coursesService.list.mockRejectedValue(new Error('Failed to load'));

render(<ListCourse />);

await waitFor(() => {
  expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
});
```

### 3. User Interactions
```javascript
const user = userEvent.setup();
const deleteButton = screen.getAllByRole('button').pop();
await user.click(deleteButton);

expect(window.confirm).toHaveBeenCalled();
```

### 4. Empty State
```javascript
coursesService.list.mockResolvedValue([]);

render(<ListCourse />);

await waitFor(() => {
  expect(screen.getByText('No courses found')).toBeInTheDocument();
});
```

## Coverage Goals

| Component | Current Coverage | Target |
|-----------|------------------|--------|
| ListCourse | ~85% | 90%+ |
| ListItemCourse | ~80% | 90%+ |
| ListUser | ~85% | 90%+ |
| ListItemUser | ~80% | 90%+ |

## Common Issues and Solutions

### Issue: Tests timeout
**Solution**: Increase timeout or check if mocks are properly resolved

### Issue: Component not found
**Solution**: Ensure component is wrapped with BrowserRouter

### Issue: Mock not working
**Solution**: Clear mocks with `vi.clearAllMocks()` in beforeEach

### Issue: Role/capabilities not found
**Solution**: Use `screen.getByRole()` with specific role and options

## Best Practices

1. **Use semantic queries**: Prefer `getByRole()` over `getByTestId()`
2. **Test user behavior**: Test what users do, not implementation details
3. **Clear mocks**: Call `vi.clearAllMocks()` in beforeEach
4. **Wait for async**: Always use `waitFor()` for async operations
5. **Mock services**: Mock external API calls consistently
6. **Test edge cases**: Include tests for empty, error, and loading states

## Dependencies

- `vitest`: Testing framework
- `@testing-library/react`: React component testing
- `@testing-library/jest-dom`: DOM matchers
- `@testing-library/user-event`: User interaction simulation
- `jsdom`: DOM implementation for Node.js

## Future Improvements

1. Add integration tests for forms
2. Add visual regression testing
3. Add performance benchmarks
4. Increase overall coverage to 95%+
5. Add E2E tests with Playwright or Cypress
6. Add accessibility testing with axe-core
