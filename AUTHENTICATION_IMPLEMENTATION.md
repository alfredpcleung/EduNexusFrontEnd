# Frontend Authentication Implementation

## Overview
This document outlines the authentication and authorization implementation for the EduNexus frontend application. The implementation follows the backend API specifications and uses JWT tokens for secure authentication.

## Files Modified/Created

### 1. **src/components/auth/auth-helper.js** (Updated)
- **Functions Added:**
  - `setToken(token)` - Store JWT token in localStorage
  - `getToken()` - Retrieve JWT token from localStorage
  - `removeToken()` - Clear token and user data from localStorage
  - `isAuthenticated()` - Check if user has valid, non-expired token
  - `setUser(user)` - Store user object in localStorage
  - `getUser()` - Retrieve user object from localStorage
  - `signup(uid, displayName, email, password, role)` - Call backend signup endpoint
  - `signin(email, password)` - Call backend signin endpoint
  - `logout()` - Clear authentication state
  - `authenticatedFetch(url, options)` - Wrapper fetch that automatically adds Authorization header with Bearer token

**Key Features:**
- Token expiration checking using JWT decode
- Automatic token attachment to authenticated requests
- Auto-logout on token expiration with redirect to signin
- Changed storage from sessionStorage to localStorage for persistence across refreshes

---

### 2. **src/components/auth/AuthContext.jsx** (New)
- **Context & Hooks:**
  - `AuthContext` - Global context for authentication state
  - `AuthProvider` - Provider component to wrap the app
  - `useAuth()` - Custom hook to access auth state and methods

**State Management:**
- `user` - Current authenticated user object (displayName, email, role)
- `isAuth` - Boolean indicating if user is authenticated
- `loading` - Boolean for loading state during auth operations
- `error` - Error message from auth operations
- Methods: `signup()`, `signin()`, `logout()`

---

### 3. **src/components/auth/Signup.jsx** (Updated)
- Replaced Firebase authentication with backend API authentication
- Form fields: uid, displayName, email, role, password, confirmPassword
- Integrated with `useAuth()` hook
- Form validation:
  - Checks if uid is provided
  - Validates password confirmation match
  - Minimum password length (6 characters)
- On successful signup: stores token & user, redirects to home page
- Error handling with user-friendly messages

---

### 4. **src/components/auth/Signin.jsx** (Updated)
- Replaced Firebase authentication with backend API authentication
- Form fields: email, password
- Integrated with `useAuth()` hook
- Redirects to the page user was attempting to access (or home)
- Error handling with user-friendly messages
- Loading state during signin

---

### 5. **src/services/coursesService.js** (Updated)
- **Public Endpoints:**
  - `list()` - GET /courses (public)
  - `read(id)` - GET /courses/:id (public)

- **Protected Endpoints (using authenticatedFetch):**
  - `create(course)` - POST /courses (auth required)
  - `update(id, course)` - PUT /courses/:id (auth + ownership required)
  - `remove(id)` - DELETE /courses/:id (auth + ownership required)

---

### 6. **src/services/usersService.js** (Updated)
- **Public Endpoints:**
  - `list()` - GET /users (public)
  - `read(uid)` - GET /users/:id (public)

- **Protected Endpoints (using authenticatedFetch):**
  - `update(uid, user)` - PUT /users/:uid (auth required)
  - `remove(uid)` - DELETE /users/:uid (auth required)

---

### 7. **src/components/Layout.jsx** (Updated)
- Replaced `isAuthenticated()` & `getUsername()` calls with `useAuth()` hook
- Displays user displayName and role in navbar dropdown
- "Sign In/Sign Up" buttons shown for non-authenticated users
- User profile menu with logout option shown for authenticated users
- Logout handler clears token and redirects to home

---

### 8. **src/components/Course/AddCourse.jsx** (Updated)
- **Authentication Protection:**
  - Checks if user is authenticated using `useAuth()`
  - If not authenticated, redirects to signin page with return path
  - Displays loading state while auth status is being determined

---

### 9. **src/components/Course/EditICourse.jsx** (Updated)
- **Authentication Protection:**
  - Checks if user is authenticated
  - Redirects to signin if not authenticated, with return path
  - Waits for auth status before loading course data

---

### 10. **src/components/Course/ListItemCourse.jsx** (Updated)
- **UI Conditional Rendering:**
  - Edit and Delete buttons only visible to authenticated users
  - Buttons disabled for non-authenticated users
- Error handling for 403 Forbidden responses (ownership violations)

---

### 11. **src/components/User/ListItemUser.jsx** (Updated)
- **Authentication & Authorization:**
  - Edit and Delete buttons only visible to authenticated users
  - Buttons only enabled for users editing their own profile
  - Checks if current user's email/uid matches the user being edited
- Delete functionality implemented with `remove()` from usersService

---

### 12. **src/App.jsx** (Updated)
- Wrapped entire application with `<AuthProvider>`
- Ensures auth context is available to all components

---

## Authentication Flow

### Sign Up
1. User navigates to `/users/signup`
2. Fills form with uid, displayName, email, role, password
3. Frontend validates form
4. Calls `signup()` from AuthContext
5. Backend endpoint: `POST /auth/signup`
6. Token stored in localStorage
7. User data stored in localStorage
8. Redirects to home page

### Sign In
1. User navigates to `/users/signin`
2. Fills form with email and password
3. Calls `signin()` from AuthContext
4. Backend endpoint: `POST /auth/signin`
5. Token stored in localStorage
6. User data stored in localStorage
7. Redirects to previously visited page or home

### Token Management
- **Storage:** localStorage (persists across page refreshes)
- **Format:** Bearer token in Authorization header
- **Expiration:** Checked on app load and periodically
- **Auto-logout:** If token expired, user redirected to signin

### Protected Routes
- Course creation (`/course/add`) - Auth required
- Course editing (`/course/edit/:id`) - Auth required
- User editing/deletion - Auth + self-ownership required
- Course deletion - Auth + ownership required

---

## Environment Configuration

The API base URL is configured in `auth-helper.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
```

To set a different API URL in development, create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, update it in `.env.production`:

```
VITE_API_BASE_URL=https://your-render-url/api
```

---

## Testing Checklist

- [ ] Sign up with new user account
- [ ] Sign in with created account
- [ ] Token stored in localStorage
- [ ] User info displayed in navbar
- [ ] Sign out clears token and user data
- [ ] Non-authenticated users cannot access `/course/add`
- [ ] Non-authenticated users see redirects to signin
- [ ] Authenticated users can create courses
- [ ] Authenticated users can edit own courses
- [ ] Authenticated users can delete own courses
- [ ] Authenticated users can update own profile
- [ ] Authenticated users can delete own profile
- [ ] Token is automatically sent in Authorization header for protected requests
- [ ] Token expiration redirects to signin page
- [ ] Error messages display correctly for invalid credentials
- [ ] Form validation works (password match, required fields, etc.)

---

## Known Limitations

1. **Edit User Component:** The edit user component (`/users/edit/:id`) route exists in protection but component not yet created
2. **Ownership Verification:** Backend handles ownership verification; frontend shows UI conditionally based on auth status
3. **Role-based Access:** Currently no role-based UI restrictions (student vs instructor vs admin) - backend enforces
4. **Email Verification:** No email verification implemented yet
5. **Password Reset:** No password reset flow implemented

---

## Security Notes

- Passwords are never stored or transmitted in plain text
- JWT tokens are used for stateless authentication
- Token includes expiration (7 days from backend)
- Authorization header is automatically attached by `authenticatedFetch`
- localStorage used instead of sessionStorage for better UX
- Token validation includes expiration checks
- All sensitive operations require token verification

---

## Integration Points

The frontend now integrates with the backend authentication system:

1. **Sign Up Endpoint:** `POST /auth/signup`
   - Request: { uid, displayName, email, password, role }
   - Response: { success, message, token, user { displayName, email, role } }

2. **Sign In Endpoint:** `POST /auth/signin`
   - Request: { email, password }
   - Response: { success, message, token, user { displayName, email, role } }

3. **Protected Endpoints:**
   - All require `Authorization: Bearer <token>` header
   - Backend validates token and returns appropriate error codes

---

## Next Steps

1. Test authentication flow end-to-end with backend
2. Create Edit User component at `/users/edit/:id`
3. Implement role-based access control in UI
4. Add email verification (optional)
5. Add password reset flow (optional)
6. Implement refresh token mechanism (optional)
