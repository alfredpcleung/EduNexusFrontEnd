# Contributing to EduNexus Frontend

A comprehensive development guide covering architecture, API integration, authentication, testing, and best practices.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Integration](#api-integration)
3. [Authentication Implementation](#authentication-implementation)
4. [Component Guide](#component-guide)
5. [Services Layer](#services-layer)
6. [Testing Guide](#testing-guide)
7. [Authorization & RBAC](#authorization--rbac)
8. [Error Handling](#error-handling)
9. [Development Workflow](#development-workflow)
10. [Known Issues & Limitations](#known-issues--limitations)

---

## Architecture Overview

### Application Structure

```
App.jsx (with AuthProvider)
    ↓
MainRouter (Route definitions)
    ↓
Layout (Navbar, footer, layout)
    ↓
Pages/Components
    ↓
Services (API calls)
    ↓
API Backend
```

### State Management

EduNexus uses **React Context API** for global state management:

- **AuthContext**: Manages authentication state, user info, login/logout
- **Local State**: Component-level state for forms, modals, loading states
- **localStorage**: Persistent storage for JWT tokens and user data

### Data Flow

```
User Action (button click)
    ↓
Component event handler
    ↓
Service call (e.g., coursesService.create())
    ↓
API request with JWT token
    ↓
Backend validates & responds
    ↓
Component updates state
    ↓
UI re-renders with new data
```

---

## API Integration

### Base URL Configuration

API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
```

### Available Services

#### 1. **Authentication Service** (`auth-helper.js`)

```javascript
// Sign up
const result = await signup(uid, displayName, email, password, role);
// Returns: { success: boolean, user?: object, message?: string, token?: string }

// Sign in
const result = await signin(email, password);
// Returns: { success: boolean, user?: object, message?: string, token?: string }

// Sign out
logout();  // Clears localStorage

// Check authentication
const isAuth = isAuthenticated();  // Returns: boolean

// Get stored token
const token = getToken();  // Returns: string | null

// Get stored user
const user = getUser();  // Returns: object | null
```

#### 2. **Courses Service** (`coursesService.js`)

```javascript
// List all courses
const courses = await list();
// GET /courses

// Get single course
const course = await read(id);
// GET /courses/:id

// Create course (protected)
const newCourse = await create(courseData);
// POST /courses
// Headers: Authorization: Bearer <token>

// Update course (protected)
const updated = await update(id, courseData);
// PUT /courses/:id
// Headers: Authorization: Bearer <token>

// Delete course (protected)
await remove(id);
// DELETE /courses/:id
// Headers: Authorization: Bearer <token>
```

#### 3. **Projects Service** (`projectsService.js`)

```javascript
// List all projects
const projects = await list();
// GET /projects

// Get single project
const project = await read(id);
// GET /projects/:id

// Create project (protected)
const newProject = await create(projectData);
// POST /projects
// Headers: Authorization: Bearer <token>

// Update project (protected)
const updated = await update(id, projectData);
// PUT /projects/:id
// Headers: Authorization: Bearer <token>

// Delete project (protected)
await remove(id);
// DELETE /projects/:id
// Headers: Authorization: Bearer <token>
```

#### 4. **Users Service** (`usersService.js`)

```javascript
// List all users
const users = await list();
// GET /users

// Get single user
const user = await read(uid);
// GET /users/:uid

// Update user (protected)
const updated = await update(uid, userData);
// PUT /users/:uid
// Headers: Authorization: Bearer <token>

// Delete user (protected)
await remove(uid);
// DELETE /users/:uid
// Headers: Authorization: Bearer <token>
```

#### 5. **Feedback Service** (`feedbackService.js`)

```javascript
// List feedback for project
const feedback = await listForProject(projectId);
// GET /feedback?projectId=:projectId

// Create feedback (protected)
const newFeedback = await create(feedbackData);
// POST /feedback
// Headers: Authorization: Bearer <token>
// Body: { projectId, rating, comment, labels }

// Update feedback (protected)
const updated = await update(feedbackId, feedbackData);
// PUT /feedback/:feedbackId
// Headers: Authorization: Bearer <token>

// Delete feedback (protected)
await remove(feedbackId);
// DELETE /feedback/:feedbackId
// Headers: Authorization: Bearer <token>
```

### Making Authenticated Requests

Use `authenticatedFetch()` helper for protected endpoints:

```javascript
// From auth-helper.js
const response = await authenticatedFetch('/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(courseData)
});

const data = await response.json();
```

**Key features:**
- Automatically adds `Authorization: Bearer <token>` header
- Handles 401 responses (expired token)
- Auto-logout and redirect to signin on 401
- Standard fetch API interface

---

## Authentication Implementation

### Overview

JWT-based authentication with localStorage persistence and automatic token refresh.

### User Flow

```
1. User signs up/in
2. Backend validates credentials
3. Backend returns JWT token (7-day expiration)
4. Frontend stores token in localStorage
5. All future requests include token in Authorization header
6. On token expiration: Backend returns 401
7. Frontend auto-logout and redirect to signin
```

### Token Storage

**Keys:**
- `token` - JWT string
- `user` - JSON stringified user object

**Example:**
```javascript
// In localStorage
localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
localStorage.user = '{"uid":"john_doe","displayName":"John Doe","email":"john@example.com","role":"student"}'
```

### AuthContext Usage

```javascript
import { useAuth } from './auth/AuthContext';

function MyComponent() {
  const { isAuth, user, loading, signin, signup, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuth) {
    return <div>Please sign in first</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

Components that require authentication should check `isAuth`:

```javascript
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProtectedComponent() {
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate('/users/signin', { state: { from: location.pathname } });
    }
  }, [isAuth, loading]);

  if (loading) return <div>Loading...</div>;
  if (!isAuth) return null;

  return <div>Protected content</div>;
}
```

### Token Expiration Handling

**During API Request:**
```javascript
// authenticatedFetch detects 401 response
// Calls logout() to clear token
// Redirects to /users/signin
// User must sign in again
```

**On Page Reload:**
```javascript
// AuthProvider checks stored token
// Decodes JWT and checks expiration
// If expired: removes token and sets isAuth = false
// If valid: loads user and sets isAuth = true
```

---

## Component Guide

### Authentication Components

#### SignUp.jsx
- Form fields: Full Name, Email, Role (optional), Password, Confirm Password
- Validation: Name, email format, password length ≥ 6, password match
- API call: `signup()` from AuthContext
- Success: Stores token + user, redirects to home
- Error: Displays error message, stays on page

#### SignIn.jsx
- Form fields: Email, Password
- Validation: Email required, password required
- API call: `signin()` from AuthContext
- Success: Stores token + user, redirects to previous page or home
- Error: Displays error message, stays on page

### Course Components

#### ListCourse.jsx
- Features: List all courses, search, filter by status, pagination
- Search: Real-time with 500ms debounce
- Filter: Active/Draft/Archived status
- Auth-aware: "Add Course" button only for instructors
- Displays: Course title, instructor, status, average rating, top labels

#### AddCourse.jsx
- Protection: Requires authentication + instructor role
- Form: Title, description, credits, status, instructor
- Labels: Select up to 3 feedback labels
- Validation: Title, description, credits required
- Success: Redirects to course list
- Error: Displays error message

#### EditCourse.jsx
- Protection: Requires authentication + course ownership
- Form: Pre-populated with existing course data
- Labels: Update selected feedback labels
- Success: Redirects to course list
- Error: 403 if not owner, displays error message

### Project Components

#### ListProject.jsx
- Features: List all projects, search, filter by status
- Search: Real-time with 500ms debounce
- Filter: Active/Draft/Archived status
- Displays: Project title, category, status, average rating, top labels
- Action: "Add Project" button for authenticated users

#### AddProject.jsx
- Protection: Requires authentication
- Form: Title, description, category, start/end dates, github link
- Labels: Select up to 3 feedback labels
- Success: Redirects to project list
- Error: Displays error message

#### EditProject.jsx
- Protection: Requires authentication + project ownership
- Form: Pre-populated with existing project data
- Labels: Update selected feedback labels
- Success: Redirects to project list
- Error: 403 if not owner

#### ProjectDetail.jsx
- Display: Project info + all feedback
- Feedback form: Only visible to authenticated users
- Each user can submit one feedback per project (409 if duplicate)
- Display user's own feedback with edit/delete buttons (if authorized)
- Shows: Rating, comment, labels, timestamp, author

### User Components

#### ListUser.jsx
- Display: All registered users with profiles
- Fields: Avatar, name, email, role
- Action: Edit/delete buttons (if authorized)
- Search & filter: Optional features

#### EditUser.jsx
- Protection: Requires authentication
- Form: Full name, email, role, password (optional)
- Success: Redirects to user list
- Error: Displays error message

### Dashboard.jsx
- Protection: Requires authentication
- Displays:
  - User's owned courses (with edit/delete)
  - User's owned projects (with edit/delete)
  - User's submitted feedback (with edit/delete)
- API: `authenticatedFetch('/dashboard/me')`

---

## Services Layer

### Adding a New Service

Example: Create `articlesService.js`

```javascript
import api from './api';

const articlesService = {
  list: () => api.get('/articles'),
  
  read: (id) => api.get(`/articles/${id}`),
  
  create: (data) => api.post('/articles', data),
  
  update: (id, data) => api.put(`/articles/${id}`, data),
  
  remove: (id) => api.delete(`/articles/${id}`)
};

export default articlesService;
```

### API Helper Methods

Located in `src/services/api.js`:

```javascript
const api = {
  get: (endpoint) => authenticatedFetch(`${API_BASE_URL}${endpoint}`),
  
  post: (endpoint, data) => authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  put: (endpoint, data) => authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint) => authenticatedFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE'
  })
};
```

---

## Testing Guide

### Unit Tests (Vitest + React Testing Library)

#### Running Tests

```bash
# Watch mode
npm test

# Single run
npm test -- --run

# With coverage
npm test -- --coverage

# Specific file
npm test ListCourse

# UI dashboard
npm test -- --ui
```

#### Test Structure

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from './auth/AuthContext';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(
      <AuthProvider>
        <MyComponent />
      </AuthProvider>
    );
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle button click', async () => {
    render(
      <AuthProvider>
        <MyComponent />
      </AuthProvider>
    );
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('After click')).toBeInTheDocument();
    });
  });
});
```

#### Best Practices

1. **Wrap in AuthProvider**: Components using `useAuth()` need AuthProvider
2. **Semantic queries**: Use `getByRole`, `getByText`, `getByPlaceholderText`
3. **Avoid implementation details**: Test behavior, not internal state
4. **Use waitFor for async**: Wait for DOM updates from async operations
5. **Mock API calls**: Use `jest.mock()` for service calls
6. **Clean up**: Tests auto-cleanup with React Testing Library

### E2E Tests (Cypress)

#### Running E2E Tests

```bash
# Interactive mode
npm run cypress:open

# Headless mode
npm run cypress:run

# Specific file
npm run cypress:run -- --spec "cypress/e2e/auth.cy.js"

# Against production
npm run cypress:run -- --baseUrl https://your-domain.com
```

#### Test Structure

```javascript
describe('Authentication', () => {
  it('should sign up successfully', () => {
    cy.visit('/users/signup');
    cy.get('input[placeholder="Full Name"]').type('John Doe');
    cy.get('input[placeholder="Email"]').type('john@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/');
    cy.contains('Welcome').should('be.visible');
  });
});
```

#### Test Suites

- **auth.cy.js**: Sign up, sign in, sign out, protected routes
- **dashboard.cy.js**: Dashboard load, course/project display
- **projects.cy.js**: Project CRUD, feedback submission
- **feedback.cy.js**: Feedback creation, 409 Conflict, deletion, RBAC

#### Best Practices

1. **Use data-cy attributes**: Add `data-cy="unique-id"` to components for reliable selection
2. **Test user flows**: Test what users actually do
3. **Wait for API**: Use `cy.intercept()` to wait for API responses
4. **Clear state**: Clear localStorage/cookies between tests
5. **Avoid waits**: Use `cy.intercept()` instead of `cy.wait()`
6. **Test errors**: Include error scenarios and edge cases

### Test Coverage Goals

- **Components**: 80%+ line coverage
- **Services**: 90%+ coverage
- **Utilities**: 100% coverage
- **Hooks**: 85%+ coverage
- **E2E**: All critical user paths

---

## Authorization & RBAC

### Role Definitions

| Role | Capabilities |
|------|-----------|
| **Student** | View all courses/projects, submit feedback, create projects, edit own profile |
| **Instructor** | All student capabilities + create/edit/delete own courses |
| **Admin** | All capabilities including editing/deleting any course/project |

### Authorization Checks

#### Frontend Checks

```javascript
// Check if user is instructor
const isInstructor = user?.role === 'instructor';

// Check if user is admin
const isAdmin = user?.role === 'admin';

// Check ownership
const isOwner = course?.uid === user?.uid;
```

#### Backend Validation

Always validate authorization server-side! Frontend checks are for UX only.

```javascript
// Example course creation
if (!isInstructor && !isAdmin) {
  return response.status(403).json({ message: 'Only instructors can create courses' });
}
```

### Common Errors

**403 Forbidden**: User not authorized for this action
```javascript
// Frontend handling
try {
  await createCourse(courseData);
} catch (error) {
  if (error.status === 403) {
    setErrorMsg('You are not authorized to create courses');
  }
}
```

**409 Conflict**: User already submitted feedback for this project
```javascript
// Frontend handling
try {
  await createFeedback(feedbackData);
} catch (error) {
  if (error.status === 409) {
    setErrorMsg('You have already submitted feedback for this project');
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Process response |
| 400 | Bad Request | Show validation error |
| 401 | Unauthorized | Auto-logout, redirect to signin |
| 403 | Forbidden | Show "Not authorized" error |
| 404 | Not Found | Show "Resource not found" error |
| 409 | Conflict | Show "Already exists" error (e.g., duplicate feedback) |
| 500 | Server Error | Show "Server error" message |

### Error Component Pattern

```javascript
const [errorMsg, setErrorMsg] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setErrorMsg('');
  setLoading(true);

  try {
    const result = await create(data);
    if (result.success) {
      navigate('/list');
    } else {
      setErrorMsg(result.message);
    }
  } catch (error) {
    setErrorMsg(error.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};

return (
  <>
    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  </>
);
```

---

## Development Workflow

### Setting Up Development Environment

1. **Clone repository**
```bash
git clone <repository-url>
cd EduNexusFrontEnd
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env
```

4. **Start development server**
```bash
npm run dev
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review: Merge to main
```

### Adding New Features

1. **Create component structure**
```bash
mkdir -p src/components/NewFeature
touch src/components/NewFeature/NewFeature.jsx
touch src/components/NewFeature/NewFeature.test.jsx
```

2. **Create service layer**
```bash
touch src/services/newFeatureService.js
```

3. **Add route to MainRouter.jsx**
```javascript
import NewFeature from './components/NewFeature/NewFeature';

// In route definition
<Route path="/new-feature" element={<NewFeature />} />
```

4. **Write tests**
```javascript
// NewFeature.test.jsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthContext';
import NewFeature from './NewFeature';

describe('NewFeature', () => {
  it('should render', () => {
    render(
      <AuthProvider>
        <NewFeature />
      </AuthProvider>
    );
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

5. **Write E2E tests**
```javascript
// cypress/e2e/new-feature.cy.js
describe('New Feature', () => {
  it('should work correctly', () => {
    cy.visit('/new-feature');
    // Test user interactions
  });
});
```

### Code Style

- **Naming**: camelCase for variables/functions, PascalCase for components
- **Formatting**: ESLint enforced, run `npm run lint`
- **Comments**: Use JSDoc for functions, inline comments for complex logic
- **Imports**: Organize by external, internal, and relative imports

---

## Known Issues & Limitations

### Current Limitations

1. **Token Expiration**: Users must re-login after 7 days (no refresh token)
2. **Offline Support**: No offline mode or service worker
3. **Real-time Updates**: No WebSocket support; manual page refresh needed
4. **File Uploads**: Not supported (comments are text-only)
5. **Pagination**: Limited pagination on list pages

### Workarounds

**Frequent Token Expiration**: Implement refresh token endpoint on backend
```javascript
// Future enhancement
const { token, refreshToken } = await refreshAuth(oldToken);
localStorage.setItem('token', token);
localStorage.setItem('refreshToken', refreshToken);
```

**Real-time Updates**: Add polling or WebSocket listener
```javascript
// Future enhancement
useEffect(() => {
  const interval = setInterval(() => {
    fetchLatestData();
  }, 5000); // Poll every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

### Reporting Issues

Include:
- Browser/version
- Error message and stack trace
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## Performance Tips

### Optimization Techniques

1. **Code Splitting**: Use React.lazy() for route-based splitting
```javascript
const Dashboard = lazy(() => import('./components/Dashboard'));
```

2. **Memoization**: Use `useMemo()` for expensive calculations
```javascript
const filteredCourses = useMemo(
  () => courses.filter(c => c.status === filter),
  [courses, filter]
);
```

3. **useCallback**: Memoize callback functions
```javascript
const handleDelete = useCallback((id) => {
  deleteCourse(id);
}, []);
```

4. **Lazy Load Images**: Use `loading="lazy"` on images
```jsx
<img src="course.jpg" loading="lazy" />
```

---

## Resources

- **React Documentation**: https://react.dev
- **Material-UI Docs**: https://mui.com
- **Vite Documentation**: https://vitejs.dev
- **Vitest Documentation**: https://vitest.dev
- **Cypress Documentation**: https://cypress.io
- **JWT Guide**: https://jwt.io/introduction

---

## License

MIT

---

**Questions?** Open an issue on GitHub or check [README.md](./README.md) for quick start guide.
