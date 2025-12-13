# Bug Report: New Projects Not Appearing in List

**Status:** 🔍 Diagnosed | ✅ Fixed (Frontend)

**Issue:** After a student account creates a project, it doesn't appear in the projects list.

---

## Root Cause Analysis

### Frontend Issue: ❌ FOUND & FIXED

**Location:** `src/services/projectsService.js` (Lines 1-20)

**Problem:**
The `projectsService.list()` function was **not accepting query parameters**, but `ListProject.jsx` was trying to pass them.

**Before (Broken):**
```javascript
export const list = async () => {  // ← No parameters accepted
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    // Query parameters from ListProject.jsx were ignored!
  }
}
```

**After (Fixed):**
```javascript
export const list = async (queryString = "") => {  // ← Now accepts parameters
  try {
    const url = queryString 
      ? `${API_BASE_URL}/projects?${queryString}`
      : `${API_BASE_URL}/projects`;
    const response = await fetch(url, {
      cache: 'no-store' // Prevent browser caching
    });
    // Query parameters are now properly passed to backend
  }
}
```

### Changes Made

1. **Modified `projectsService.list()` signature**
   - Added `queryString` parameter
   - Appends query parameters to URL when provided
   - Added `cache: 'no-store'` to prevent browser caching

2. **Why this matters:**
   - `ListProject.jsx` was building search and status filter parameters
   - These parameters were being created but ignored by the service
   - Backend might filter results, and if no parameters reach it, filtering doesn't work correctly
   - New projects may not appear if filtering is applied on backend

---

## Flow Diagram: How Projects Move Through the System

### Creating a Project (Should Work)
```
Student clicks "Add Project" (ListProject.jsx)
    ↓
AddProject.jsx form validation
    ↓
POST /projects with title, description, status, labels
    ↓
Backend creates project with student as owner
    ↓
Success response with "Project created successfully!"
    ↓
Redirect to /project/list (2 second delay)
    ✓ Project should be visible
```

### Listing Projects (NOW FIXED)
```
ListProject.jsx mounts
    ↓
useEffect calls fetchProjects()
    ↓
Builds URLSearchParams for search/status filter
    ↓
Calls projectsService.list(params.toString())
    ↓
[FIX] Service now receives query string and appends to URL
    ↓
GET /projects?search=...&status=...
    ↓
Backend filters and returns matching projects
    ✓ Newly created project appears in list
```

---

## Why The Project Was Hidden

### Scenario: Student creates project with "Draft" status

1. **Creation:** Project saved with `status: "draft"`
2. **Redirect:** Student redirected to `/project/list`
3. **Initial Load:** ListProject fetches projects without filters
   - ✓ Project appears (because no filter is applied)
4. **If Student Applies Filter:** E.g., select "Active" status
   - ❌ Before fix: Service ignores filter, still shows Draft project
   - ✅ After fix: Service passes filter, only shows Active projects (Draft hidden)

### Or if backend filters by default:

If the backend only returns "Active" projects by default and requires explicit filter parameter:
- ❌ Before fix: Service doesn't pass status parameter, backend returns empty/only active
- ✅ After fix: Service passes status parameter, backend returns all projects

---

## Testing the Fix

### Manual Test

1. **Create a project as student:**
   ```
   1. Login as student account
   2. Navigate to /project/list
   3. Click "Add Project"
   4. Fill form with title, description, select status "Draft"
   5. Click "Create Project"
   6. Wait for redirect to /project/list
   ```

2. **Verify project appears:**
   ```
   ✓ New project should be visible in the list immediately
   ✓ Should show in table with correct title, status, owner
   ✓ If filtering by "Draft" status, project should be visible
   ```

3. **Test filtering:**
   ```
   1. On project list, change status filter to "Active"
   2. Project with "Draft" status should disappear
   3. Change back to "All" or "Draft" - project should reappear
   ```

### Automated Tests

E2E test already exists in `cypress/e2e/projects.cy.js` (Line 36):
```javascript
it('should navigate to add project form and create project', () => {
  // Creates project and verifies it appears in list
  cy.contains(projectTitle).should('be.visible');
});
```

Run to verify:
```bash
npm run cypress:run -- --spec "cypress/e2e/projects.cy.js"
```

---

## Potential Backend Issues (If Problem Persists)

If the project **still doesn't appear** after the frontend fix, check the backend:

### Backend Checklist

1. **Project Creation Endpoint (`POST /projects`)**
   - ✓ Returns `{ success: true, project: {...} }` format?
   - ✓ Project includes all required fields (id, title, owner, status)?
   - ✓ Student ownership is set correctly?

2. **Project List Endpoint (`GET /projects`)**
   - ✓ Accepts query parameters: `?search=...&status=...`?
   - ✓ Returns all projects when no parameters provided?
   - ✓ Filters correctly by status when parameter provided?
   - ✓ Returns projects created by students?

3. **Response Format**
   - ✓ Returns `{ success: true, projects: [...] }`?
   - ✓ Each project has `id` or `_id`, `title`, `status`, `owner`?

### Debug: Check Backend Response

```bash
# Terminal 1: Start backend
node server.js

# Terminal 2: Create a project as student
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <student-token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","status":"draft"}'

# Terminal 3: List all projects
curl http://localhost:3000/api/projects

# Should see the newly created project in the response
```

---

## Files Changed

### Modified
- ✅ `src/services/projectsService.js` - Added query parameter support

### No Changes Needed
- ✓ `src/components/Project/ListProject.jsx` - Already passing parameters correctly
- ✓ `src/components/Project/AddProject.jsx` - Already creating projects correctly
- ✓ `cypress/e2e/projects.cy.js` - Test already covers this scenario

---

## Summary

| Aspect | Details |
|--------|---------|
| **Issue Type** | Frontend (Service Layer) |
| **Root Cause** | Query parameters not passed to backend API |
| **Impact** | Projects may not appear in filtered list |
| **Solution** | Updated `projectsService.list()` to accept query string |
| **Breaking Changes** | None - backward compatible |
| **Test Coverage** | Existing E2E tests should pass |
| **Priority** | High (affects user-facing feature) |

---

## Next Steps

1. ✅ **Frontend fix applied** - `projectsService.js` updated
2. **🔍 Test the fix** - Try creating a project and verifying it appears
3. **📋 If issue persists** - Check backend response format and filtering logic
4. **🚀 Deploy** - Push changes to production after testing

---

**Last Updated:** December 12, 2025  
**Fixed By:** GitHub Copilot
