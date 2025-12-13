# EduNexus Frontend API Documentation

> API integration reference for the EduNexus frontend application.

---

## Table of Contents

1. [Configuration](#configuration)
2. [Authentication](#authentication)
3. [Services Overview](#services-overview)
4. [Endpoint Reference](#endpoint-reference)
5. [Error Handling](#error-handling)

---

## Configuration

### Base URL

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

---

## Authentication

### Token Management

EduNexus uses JWT-based authentication with localStorage persistence.

**Storage Keys:**
- `token` - JWT string
- `user` - JSON stringified user object

### authenticatedFetch Helper

All protected endpoints use `authenticatedFetch()` from `src/components/auth/auth-helper.js`:

```javascript
const response = await authenticatedFetch('/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(courseData)
});
```

**Features:**
- Auto-injects `Authorization: Bearer <token>` header
- Handles 401 responses (expired token)
- Auto-logout and redirect on authentication failure

### Authorization Header Format

```
Authorization: Bearer <jwt-token>
```

---

## Services Overview

### Service Location

All services are in `src/services/`:

| Service | File | Purpose |
|---------|------|---------|
| API Base | `api.js` | Base URL, helper methods |
| Courses | `coursesService.js` | Course CRUD operations |
| Projects | `projectsService.js` | Project CRUD operations |
| Users | `usersService.js` | User management |
| Feedback | `feedbackService.js` | Peer feedback operations |

### Common Service Pattern

```javascript
import { getApiUrl } from './api';
import { authenticatedFetch } from '../components/auth/auth-helper';

const service = {
  // Public endpoint (no auth required)
  list: async () => {
    const response = await fetch(`${getApiUrl()}/endpoint`);
    return response.json();
  },
  
  // Protected endpoint (auth required)
  create: async (data) => {
    const response = await authenticatedFetch(`${getApiUrl()}/endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export default service;
```

---

## Endpoint Reference

### Authentication Endpoints

#### Sign Up
```
POST /api/users/signup
Content-Type: application/json

Request:
{
  "uid": "john_doe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

Response (201):
{
  "success": true,
  "user": { "uid", "displayName", "email", "role" },
  "token": "<jwt-token>"
}
```

#### Sign In
```
POST /api/users/signin
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "user": { "uid", "displayName", "email", "role" },
  "token": "<jwt-token>"
}
```

---

### Users Endpoints

#### List All Users
```
GET /api/users

Response (200):
[
  { "uid", "displayName", "email", "role", "createdAt" },
  ...
]
```

#### Get User by UID
```
GET /api/users/:uid

Response (200):
{ "uid", "displayName", "email", "role", "createdAt" }
```

#### Update User (Protected)
```
PUT /api/users/:uid
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "displayName": "John Updated",
  "email": "john.updated@example.com"
}

Response (200):
{ "success": true, "user": { ... } }
```

#### Delete User (Protected)
```
DELETE /api/users/:uid
Authorization: Bearer <token>

Response (200):
{ "success": true, "message": "User deleted" }
```

---

### Courses Endpoints

#### List All Courses
```
GET /api/courses

Response (200):
[
  {
    "id", "title", "description", "credits",
    "status", "instructor", "averageRating", "topLabels"
  },
  ...
]
```

#### Get Course by ID
```
GET /api/courses/:id

Response (200):
{ "id", "title", "description", "credits", "status", "instructor", ... }
```

#### Create Course (Protected)
```
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "credits": 3,
  "status": "active"
}

Response (201):
{ "success": true, "course": { ... } }
```

#### Update Course (Protected)
```
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

Request:
{ "title": "Updated Title", ... }

Response (200):
{ "success": true, "course": { ... } }
```

#### Delete Course (Protected)
```
DELETE /api/courses/:id
Authorization: Bearer <token>

Response (200):
{ "success": true, "message": "Course deleted" }
```

---

### Projects Endpoints

#### List All Projects
```
GET /api/projects

Response (200):
[
  {
    "id", "title", "description", "category",
    "status", "averageRating", "topLabels", "owner"
  },
  ...
]
```

#### Get Project by ID
```
GET /api/projects/:id

Response (200):
{ "id", "title", "description", "category", "status", "owner", ... }
```

#### Create Project (Protected)
```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "title": "My Portfolio",
  "description": "Personal portfolio website",
  "category": "Web Development",
  "githubLink": "https://github.com/user/repo"
}

Response (201):
{ "success": true, "project": { ... } }
```

#### Update Project (Protected)
```
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

Request:
{ "title": "Updated Title", ... }

Response (200):
{ "success": true, "project": { ... } }
```

#### Delete Project (Protected)
```
DELETE /api/projects/:id
Authorization: Bearer <token>

Response (200):
{ "success": true, "message": "Project deleted" }
```

---

### Feedback Endpoints

#### List Feedback for Project
```
GET /api/feedback?projectId=:projectId

Response (200):
[
  {
    "id", "projectId", "rating", "comment",
    "labels", "author", "createdAt"
  },
  ...
]
```

#### Create Feedback (Protected)
```
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "projectId": "project_123",
  "rating": 4,
  "comment": "Great work!",
  "labels": ["well-documented", "clean-code"]
}

Response (201):
{ "success": true, "feedback": { ... } }

Response (409 - Duplicate):
{ "success": false, "message": "You have already submitted feedback for this project" }
```

#### Update Feedback (Protected)
```
PUT /api/feedback/:id
Authorization: Bearer <token>
Content-Type: application/json

Request:
{ "rating": 5, "comment": "Updated comment" }

Response (200):
{ "success": true, "feedback": { ... } }
```

#### Delete Feedback (Protected)
```
DELETE /api/feedback/:id
Authorization: Bearer <token>

Response (200):
{ "success": true, "message": "Feedback deleted" }
```

---

### Statistics Endpoints

#### Homepage Statistics
```
GET /api/stats/homepage

Response (200):
{
  "totalStudents": 150,
  "activeProjects": 45,
  "feedbackGiven": 320,
  "coursesOffered": 12
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Process response |
| 201 | Created | Process response, redirect |
| 400 | Bad Request | Show validation error |
| 401 | Unauthorized | Auto-logout, redirect to signin |
| 403 | Forbidden | Show "Not authorized" message |
| 404 | Not Found | Show "Not found" message |
| 409 | Conflict | Show "Already exists" message |
| 500 | Server Error | Show generic error message |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Frontend Error Handling Pattern

```javascript
const [error, setError] = useState('');

try {
  const result = await service.create(data);
  if (result.success) {
    // Handle success
  } else {
    setError(result.message);
  }
} catch (err) {
  if (err.status === 401) {
    // Handled by authenticatedFetch
  } else if (err.status === 403) {
    setError('You are not authorized for this action');
  } else if (err.status === 409) {
    setError('This resource already exists');
  } else {
    setError('An unexpected error occurred');
  }
}
```

---

## Role-Based Access Control (RBAC)

### Roles

| Role | Create Course | Edit Own | Delete Own | Admin Actions |
|------|---------------|----------|------------|---------------|
| Student | ❌ | ✅ | ✅ | ❌ |
| Instructor | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

### Frontend Authorization Check

```javascript
const { user } = useAuth();

// Check role
const isInstructor = user?.role === 'instructor';
const isAdmin = user?.role === 'admin';
const canCreateCourse = isInstructor || isAdmin;

// Check ownership
const isOwner = resource?.uid === user?.uid;
const canEdit = isOwner || isAdmin;
```

---

## Adding New Endpoints

### 1. Create Service File

```javascript
// src/services/newService.js
import { getApiUrl } from './api';
import { authenticatedFetch } from '../components/auth/auth-helper';

const newService = {
  list: async () => {
    const response = await fetch(`${getApiUrl()}/new-endpoint`);
    return response.json();
  },
  
  create: async (data) => {
    const response = await authenticatedFetch(`${getApiUrl()}/new-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export default newService;
```

### 2. Use in Component

```javascript
import newService from '../services/newService';

const MyComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    newService.list().then(setData);
  }, []);
  
  return <div>{/* render data */}</div>;
};
```

---

**See Also:**
- [project_requirements.md](./project_requirements.md) - Full requirements
- [design.md](./design.md) - UI/UX design documentation
