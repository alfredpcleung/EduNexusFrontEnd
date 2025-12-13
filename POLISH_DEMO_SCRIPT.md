# EduNexus Frontend Polish Demo Script

## Overview
This demo script highlights the **Tier 1 Polish Task** refinements implemented for final submission. Each step showcases UX improvements in error handling, success messaging, and ownership enforcement.

---

## Demo Scenario 1: Ownership Enforcement & Permission Errors

### Step 1A: View Course List (Ownership Visibility)
1. **Login as User A** (e.g., alice@example.com)
2. Navigate to **Courses → List Courses**
3. **Observe**: 
   - Courses owned by User A show **Edit** and **Delete** buttons
   - Courses owned by other users show **"Not owner"** label, no action buttons
4. **Result**: Secure access control is visually clear

### Step 1B: Attempt Unauthorized Edit (403 Error Handling)
1. **Still logged in as User A**
2. Manually navigate to `/course/edit/:courseIdOwnedByUserB`
3. **Observe**:
   - Page loads with course details visible
   - Red **Alert at top** displays: `"You don't have permission to perform this action."`
   - **Form fields are visible but disabled/grayed out** (opacity 0.6, no pointer events)
   - User can see what they're being denied access to
4. **Expected UX**: Clear, informative error without blocking the UI
5. **Result**: ✅ Option A implemented (Alert + disabled form)

### Step 1C: Project Ownership (List View)
1. Navigate to **Projects → List Projects**
2. **Observe**:
   - Projects owned by current user show **Edit** and **Delete** buttons
   - Projects owned by others show **View** button only
   - Owner is displayed as **"You"** chip or project owner name
3. **Result**: Consistent ownership enforcement across all lists

### Step 1D: Attempt Project Deletion (Non-Owner)
1. View a project you don't own
2. **Observe**: Edit/Delete buttons not visible
3. Try direct navigation to `/project/edit/:projectIdNotOwnedByYou`
4. **Same behavior**: Alert + disabled form

---

## Demo Scenario 2: Success Messaging (Snackbar)

### Step 2A: Create a Course
1. **Login as User A**
2. Navigate to **Courses → Add Course**
3. Fill form: Title, Instructor, Credits, Status
4. Click **"Create Course"**
5. **Observe**:
   - ✅ **Snackbar appears at bottom-center** with message: `"Course 'Math 101' added successfully!"`
   - Snackbar automatically dismisses after **3 seconds**
   - After dismissal, page **redirects to /course/list** showing the new course
6. **Result**: Lightweight, professional success feedback

### Step 2B: Create a Project
1. Navigate to **Projects → Add Project**
2. Fill form: Title, Description, Status, Tags
3. Click **"Create Project"**
4. **Observe**:
   - ✅ **Snackbar at bottom-center**: `"Project created successfully!"`
   - Auto-dismiss after 3 seconds
   - Redirect to project list
5. **Result**: Consistent Snackbar pattern across all create forms

### Step 2C: Leave Feedback (Snackbar)
1. Navigate to **Projects → View Project**
2. Scroll to feedback section
3. Fill rating (1-5) and comment
4. Click **"Submit Feedback"**
5. **Observe**:
   - ✅ **Snackbar**: `"Feedback submitted successfully!"`
   - Auto-dismiss, form clears, returns to project view
6. **Result**: Instant positive feedback without intrusive alert

---

## Demo Scenario 3: Error Handling (Persistent Alerts)

### Step 3A: Submit Form with Validation Error
1. **Login as User A**
2. Navigate to **Courses → Add Course**
3. Leave **Title** blank
4. Click **"Create Course"**
5. **Observe**:
   - ❌ **Red Alert at top**: `"Title is required"`
   - Alert has **dismiss (X) button**
   - Form remains visible and editable
   - Form does NOT redirect (user can fix and resubmit)
6. **Result**: Clear error stays visible until acknowledged

### Step 3B: Server Error (403 on Edit Submit)
1. **Login as User A**
2. Navigate to edit a course you own
3. Successfully load the form
4. **Simulate server denial**: Backend responds with 403 Forbidden
5. **Observe**:
   - ❌ **Red Alert at top**: `"You don't have permission to perform this action."`
   - Alert has **dismiss button**
   - Form remains visible (not hidden)
   - User can go back or try again
6. **Result**: Error is clear, UX not broken

### Step 3C: Try Editing Someone Else's User Profile
1. **Login as User A**
2. Navigate to **Users → Edit User** (select a user you don't own)
3. If access allowed, page loads with user data
4. **Observe**:
   - ❌ **Red Alert at top**: `"You don't have permission to perform this action."`
   - **Form is visible but disabled/grayed out**
   - All fields have reduced opacity and no pointer events
5. **Result**: Clear enforcement, user understands why they can't edit

---

## Demo Scenario 4: Authentication Flow (Auto-Logout)

### Step 4A: Token Expiration Auto-Logout
1. **Login as User A**
2. Navigate to **Dashboard** (requires auth)
3. **Simulate token expiration**: Wait or manually expire token in localStorage
4. **Attempt any authenticated action** (click Edit, Create, etc.)
5. **Observe**:
   - 401 response detected by `authenticatedFetch()`
   - ✅ **Auto-logout triggered**: User redirected to `/users/signin`
   - **Navbar updates**: Login/Signup buttons visible, user dropdown gone
   - No error dialog, seamless redirect
6. **Result**: Secure token management with transparent UX

### Step 4B: Logout Button
1. **Login as User A**
2. **Navbar top-right**: Click user dropdown (shows displayName + role)
3. Click **"Logout"**
4. **Observe**:
   - ✅ Token cleared from localStorage
   - Redirected to `/`
   - Navbar shows **"Sign In" and "Sign Up"** buttons
   - Protected routes (Dashboard, etc.) redirect to signin
5. **Result**: Clean logout flow

### Step 4C: Login Seamlessness
1. Navigate to `/users/signin`
2. Enter credentials for User B (different from User A)
3. Click **"Sign In"**
4. **Observe**:
   - ✅ **Snackbar or success feedback** (if implemented)
   - Redirect to `/dashboard` (or home)
   - **Navbar updates immediately** with User B's displayName and role
   - All subsequent calls use User B's token
5. **Result**: Transparent auth flow, navbar reflects correct user

---

## Demo Scenario 5: Dashboard Polish

### Step 5A: Dashboard Counts & Sections
1. **Login as User A**
2. Navigate to **Dashboard** (`/dashboard`)
3. **Observe three cards**:
   - **📚 My Courses**: Shows count chip (e.g., "3"), list of owned courses
   - **🚀 My Projects**: Shows count chip (e.g., "2"), list of owned projects
   - **💬 My Feedback**: Shows count chip (e.g., "4"), list of **authored** feedback
4. **Expected behavior**:
   - If count = 0, message: `"No feedback authored yet."`
   - Section always visible (not hidden)
   - Counts and lists are accurate
5. **Result**: Professional dashboard with real-time aggregation

### Step 5B: Empty State
1. **Login as new User C** (no courses/projects/feedback yet)
2. Navigate to **Dashboard**
3. **Observe**:
   - All three sections visible
   - Counts show 0
   - Messages: `"You own 0 courses..."`, `"No feedback authored yet."`
   - **"Add Course" and "Add Project" buttons** present
4. **Result**: Friendly empty state, actionable CTAs

---

## Demo Scenario 6: List Item Ownership (Interactive)

### Step 6A: Delete Course as Owner
1. **Login as User A** (owner of a course)
2. Navigate to **Courses → List Courses**
3. Find a course you own
4. Click **Delete** button (trash icon)
5. **Observe**:
   - ✅ **Material-UI Dialog** appears: "Are you sure you want to delete..."
   - Dialog shows course title
   - **"Delete" button confirms**, **"Cancel" button exits**
6. Click **"Delete"**
7. **Observe**:
   - Course removed from list
   - ✅ **Snackbar or silent success** (depending on implementation)
8. **Result**: Safe, confirmable deletion

### Step 6B: Attempt Delete as Non-Owner
1. You own a course, but try to delete another user's course
2. **If delete button is hidden**: ✅ Correct behavior (no button shown)
3. **If somehow delete is triggered**: 
   - Dialog appears: "Are you sure..."
   - Click "Delete"
   - **Error Alert in Dialog**: `"You don't have permission to delete this course. Only the course owner can delete it."`
   - Dialog stays open (no auto-close)
   - User can click "Cancel" to exit
4. **Result**: Clear permission error without deletion

---

## Demo Scenario 7: Project Feedback (Authored Only)

### Step 7A: Create Feedback on Project
1. **Login as User A**
2. Navigate to **Projects → View Project** (any project)
3. Scroll to **Feedback Form**
4. Submit feedback (rating + comment)
5. **Observe**: ✅ Snackbar success
6. Navigate to **Dashboard**
7. **Observe**: 
   - **💬 My Feedback** section incremented
   - Your feedback appears in the list
8. **Result**: Dashboard reflects authored feedback

### Step 7B: Dashboard Shows Authored, Not Received
1. **Login as User B** (instructor with student feedback on their projects)
2. Navigate to **Dashboard**
3. **Observe**:
   - **💬 My Feedback** shows feedback **authored by User B** (on others' projects)
   - Does **NOT** show feedback from students on **User B's projects**
4. **Result**: Dashboard displays authored feedback only, as intended

---

## Summary: Polish Checklist

### ✅ Implemented & Demo-Ready
- [x] **Ownership Enforcement**: Buttons hidden/form disabled for non-owners
- [x] **Success Messaging**: Snackbar (3s auto-dismiss) on all creates
- [x] **Error Messaging**: Red Alerts with dismiss buttons
- [x] **403 Error Handling**: Clear message, form visible but disabled
- [x] **401 Auto-Logout**: Token expiration redirects to signin
- [x] **Navbar Updates**: Reflects login/logout state correctly
- [x] **ListItemProject**: Added with ownership checks like ListItemCourse
- [x] **Dashboard**: Shows authored feedback only, all sections with counts
- [x] **Dialog Confirmations**: Safe delete with Material-UI Dialog
- [x] **Consistent UX**: Pattern applied across courses, projects, feedback, users

### 🎯 Key Refinement Points to Highlight
1. **Option A Implementation**: Form visible + disabled (not hidden) on 403
2. **Snackbar vs Alert**: Success = lightweight snackbar, Error = persistent alert
3. **Ownership Enforcement**: Both form pages AND list items
4. **Dashboard Feedback**: Authored only (backend /dashboard/me with authoredFeedback)
5. **Auto-Logout**: Seamless, no intrusive errors on token expiration

---

## Testing Checklist

- [ ] Login as User A, attempt to edit User B's course (see disabled form + alert)
- [ ] Create a course, see snackbar success
- [ ] Logout, see navbar update
- [ ] Login as new user, see dashboard with counts
- [ ] Create feedback, see snackbar
- [ ] Delete own project, see dialog confirmation
- [ ] Try to delete someone else's project (see error or hidden button)
- [ ] Expire token, see auto-redirect to signin
- [ ] Edit form with blank required field (see error alert)
- [ ] Verify ownership checks on: EditCourse, EditUser, EditProject

---

**End of Demo Script**

For presentation: Walk through Scenarios 1, 2, 4 in live browser to showcase ownership enforcement, success messaging, and auth flow seamlessly working together.
