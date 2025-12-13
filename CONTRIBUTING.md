# Contributing to EduNexus Frontend

Development guide covering architecture, testing, and best practices.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Development Setup](#development-setup)
3. [Component Guide](#component-guide)
4. [Testing Guide](#testing-guide)
5. [Code Standards](#code-standards)
6. [Git Workflow](#git-workflow)

---

## Architecture Overview

### Application Structure

```
App.jsx (with AuthProvider)
    ↓
MainRouter (Route definitions)
    ↓
Layout (Navbar, footer)
    ↓
Pages/Components
    ↓
Services (API calls)
    ↓
API Backend
```

### State Management

- **AuthContext**: Global authentication state
- **Local State**: Component-level forms, loading, errors
- **localStorage**: JWT tokens and user data

### Data Flow

```
User Action → Component Handler → Service Call → API Request
                                                      ↓
UI Update ← State Update ← Response Processing ← Backend Response
```

---

## Development Setup

### Prerequisites

```bash
# Required
node -v  # v16+
npm -v   # v7+
```

### Quick Start

```bash
git clone <repository-url>
cd EduNexusFrontEnd
npm install
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env
npm run dev
```

### Adding New Features

1. **Create component structure**
```bash
mkdir -p src/components/NewFeature
touch src/components/NewFeature/NewFeature.jsx
touch src/components/NewFeature/NewFeature.test.jsx
```

2. **Create service (if needed)**
```bash
touch src/services/newFeatureService.js
```

3. **Add route to MainRouter.jsx**
```javascript
import NewFeature from './components/NewFeature/NewFeature';

<Route path="/new-feature" element={<NewFeature />} />
```

4. **Write tests** (see Testing Guide below)

---

## Component Guide

### Component Categories

| Category | Location | Purpose |
|----------|----------|---------|
| Layout | `src/components/` | App structure (Layout, Home, NotFound) |
| Auth | `src/components/auth/` | Authentication (Signin, Signup, AuthContext) |
| CRUD | `src/components/[Entity]/` | Entity management (List, Add, Edit) |
| Shared | MUI components | Buttons, Cards (standardized sizes), Forms |

### CRUD Component Pattern

Each entity follows this structure:

```
Entity/
├── ListEntity.jsx      # Grid view of all items
├── ListItemEntity.jsx  # Individual item card (standardized styles)
├── AddEntity.jsx       # Create form
└── EditEntity.jsx      # Update form
```

### Using AuthContext

```javascript
import { useAuth } from './auth/AuthContext';

function MyComponent() {
  const { isAuth, user, loading, signin, signup, logout } = useAuth();

  if (loading) return <CircularProgress />;
  if (!isAuth) return <Navigate to="/users/signin" />;

  return <div>Welcome, {user.displayName}!</div>;
}
```

### Protected Routes Pattern

```javascript
function ProtectedComponent() {
  const { isAuth, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuth) {
      navigate('/users/signin', { state: { from: location.pathname } });
    }
  }, [isAuth, loading]);

  if (loading) return <CircularProgress />;
  if (!isAuth) return null;

  return <div>Protected content</div>;
}
```

### Role-Based UI

```javascript
const { user } = useAuth();

const isInstructor = user?.role === 'instructor';
const isAdmin = user?.role === 'admin';
const isOwner = resource?.uid === user?.uid;

// Conditionally render
{(isInstructor || isAdmin) && <Button>Add Course</Button>}
{(isOwner || isAdmin) && <Button>Edit</Button>}
```

---

## Testing Guide

### Unit Tests (Vitest + React Testing Library)

#### Running Tests

```bash
npm test              # Watch mode
npm test -- --run     # Single run
npm test -- --coverage # With coverage
npm test -- --ui      # Interactive UI
```

#### Test Structure

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthContext';
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
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

#### Mocking Services

```javascript
import { vi } from 'vitest';
import coursesService from '../services/coursesService';

vi.mock('../services/coursesService');

beforeEach(() => {
  coursesService.list.mockResolvedValue([
    { id: '1', title: 'Test Course' }
  ]);
});
```

### E2E Tests (Cypress)

#### Running E2E Tests

```bash
npm run cypress:open   # Interactive mode
npm run cypress:run    # Headless mode
npm run cypress:run -- --spec "cypress/e2e/auth.cy.js"
```

#### Test Structure

```javascript
describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should sign in successfully', () => {
    cy.visit('/users/signin');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('not.include', '/signin');
    cy.window().its('localStorage.token').should('exist');
  });
});
```

#### Best Practices

- Use `data-cy` attributes for reliable selection
- Clear state between tests (`cy.clearLocalStorage()`)
- Use `cy.intercept()` for API mocking
- Test user flows, not implementation details

### Test Coverage Goals

| Category | Target |
|----------|--------|
| Components | 80%+ |
| Services | 90%+ |
| Utilities | 100% |
| E2E | All critical paths |

---

## Code Standards

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ListCourse.jsx` |
| Functions | camelCase | `handleSubmit` |
| Variables | camelCase | `courseList` |
| Constants | SCREAMING_SNAKE | `API_BASE_URL` |
| CSS classes | kebab-case | `card-container` |

### File Organization

```javascript
// 1. External imports
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@mui/material';

// 2. Internal imports
import { useAuth } from '../auth/AuthContext';
import coursesService from '../../services/coursesService';

// 3. Component definition
const MyComponent = () => {
  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Effects
  useEffect(() => {
    loadData();
  }, []);
  
  // Handlers
  const handleSubmit = async () => { };
  
  // Render
  return <div />;
};

export default MyComponent;
```

### Error Handling Pattern

```javascript
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setError('');
  setLoading(true);

  try {
    const result = await service.create(data);
    if (result.success) {
      navigate('/success');
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError(err.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Comments

```javascript
/**
 * Fetches and displays course list with search/filter.
 * @component
 */
const ListCourse = () => {
  // Search with 500ms debounce to reduce API calls
  const debouncedSearch = useMemo(() => 
    debounce((term) => fetchCourses(term), 500),
    []
  );

  return <div />;
};
```

---

## Git Workflow

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-search` |
| Bugfix | `fix/description` | `fix/login-redirect` |
| Hotfix | `hotfix/description` | `hotfix/token-expiry` |

### Commit Messages

```bash
# Format: type(scope): description

feat(auth): add password reset flow
fix(courses): resolve search debounce issue
docs(readme): update installation steps
test(feedback): add unit tests for FeedbackForm
refactor(services): extract common API helper
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with meaningful commits
3. Write/update tests
4. Run `npm test -- --run` and `npm run lint`
5. Push and create PR
6. Address review feedback
7. Merge after approval

---

## Documentation

For detailed documentation, see:

| Document | Description |
|----------|-------------|
| [docs/api.md](docs/api.md) | API endpoints and integration |
| [docs/design.md](docs/design.md) | UI/UX design and components |
| [docs/project_requirements.md](docs/project_requirements.md) | Full requirements |

---

## Known Limitations

1. **Token Expiration**: 7-day tokens, no refresh mechanism
2. **Offline Support**: No service worker
3. **Real-time Updates**: Manual refresh required
4. **File Uploads**: Text-only content

---

## Resources

- [React Documentation](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [Vite Documentation](https://vitejs.dev)
- [Vitest Documentation](https://vitest.dev)
- [Cypress Documentation](https://cypress.io)

---

**Questions?** Open an issue on GitHub.
