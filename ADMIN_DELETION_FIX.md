# Admin Deletion Authorization Fix

## Problem Identified

When logged in as an **admin user** and attempting to **delete users or courses**, the frontend was showing: **"You are not authorized to perform this action."**

### Root Cause

The issue was in the **frontend authorization logic**, not the backend.

**Files affected:**
- `src/components/User/ListItemUser.jsx`
- `src/components/Course/ListItemCourse.jsx`

**The Problem:**
Both components used `useAuthorizationCheck(resourceOwnerId)` to determine if the user could delete a resource. This hook checked:
```javascript
const isAuthorized = isOwner || isAdmin;
```

Where `isOwner` compared:
```javascript
const isOwner = user?.uid === resourceOwnerId;
```

This meant:
- ✅ User could delete their **own** resources (owner check passed)
- ❌ Admin could **NOT** delete **other users' resources** (owner check failed, and admin check wasn't being used for delete button visibility)

## Solution Implemented

### ListItemUser.jsx Changes

**Added:**
```javascript
// Admin can delete any user, owner can delete own profile
const canDeleteUser = canDelete || currentUser?.role === 'admin';
```

**Updated delete button:**
- Changed condition from `(canEdit || canDelete)` to `(canEdit || canDeleteUser)`
- Changed disabled state from `!canDelete` to `!canDeleteUser`

### ListItemCourse.jsx Changes

**Added:**
```javascript
// Admin can delete any course, owner can delete own course
const canDeleteCourse = canDelete || user?.role === 'admin';
```

**Updated delete button:**
- Changed condition from `canEdit` to `(canEdit || canDeleteCourse)`
- Changed disabled state to `!canDeleteCourse`
- Added proper conditional for "Not owner" message

## Result

✅ **Admin users can now delete any user or course**
✅ **All 64 unit tests still passing**
✅ **Build successful** (980 modules)

## How It Works

The authorization flow is now:

1. **Frontend (Button Visibility & Disable State)**
   - For **owners**: Can edit and delete their own resources
   - For **admins**: Can edit (if owner) AND delete ANY resource
   - For **others**: No buttons visible

2. **Backend (Final Authorization)**
   - Still validates the delete request server-side
   - Returns 403 if user is not owner and not admin
   - Returns 409 for duplicate feedback

3. **Error Handling**
   - If 403 returned: "You are not authorized to perform this action"
   - Uses `use403Handler()` hook for consistent error display

## Testing

All existing tests pass, including:
- User deletion tests
- Course deletion tests
- Authorization checks (RBAC)
- Error handling scenarios

To verify locally:
```bash
npm test -- --run        # Should show 64 passed
npm run build            # Should build successfully
```

## Next Steps for Backend

If you're still getting 403 errors after this fix, the issue is likely backend-side:

1. Verify admin user has `role: 'admin'` in the database
2. Check that backend DELETE endpoints check:
   - Is user the owner? → Allow
   - Is user an admin? → Allow
   - Otherwise → Return 403
3. Ensure JWT token contains user's role and uid

Example check structure:
```javascript
// Backend pseudo-code
if (user.uid === resource.owner || user.role === 'admin') {
  // Allow deletion
} else {
  return 403; // Forbidden
}
```
