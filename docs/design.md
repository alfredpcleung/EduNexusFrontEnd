# EduNexus Frontend Design Documentation

> UI/UX design decisions, component architecture, and styling conventions.

---

## Table of Contents

1. [Design System](#design-system)
2. [Component Architecture](#component-architecture)
3. [Layout Structure](#layout-structure)
4. [Page Designs](#page-designs)
5. [Responsive Design](#responsive-design)
6. [Accessibility](#accessibility)

---

## Design System

### Color Palette

EduNexus uses Material-UI's default theme with custom accents:

| Color | Usage | Hex |
|-------|-------|-----|
| Primary | Buttons, links, nav | `#1976d2` |
| Secondary | Accents, icons | `#9c27b0` |
| Success | Positive feedback | `#2e7d32` |
| Warning | Alerts, cautions | `#ed6c02` |
| Error | Errors, delete | `#d32f2f` |
| Background | Page background | `#fafafa` |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Roboto | 2.5rem | 700 |
| H2 | Roboto | 2rem | 600 |
| H3 | Roboto | 1.75rem | 600 |
| H4 | Roboto | 1.5rem | 600 |
| H5 | Roboto | 1.25rem | 500 |
| Body | Roboto | 1rem | 400 |
| Caption | Roboto | 0.875rem | 400 |

### Spacing Scale

Based on 8px grid system:

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Small gaps |
| md | 16px | Default spacing |
| lg | 24px | Section padding |
| xl | 32px | Large sections |
| xxl | 48px | Hero sections |

---

## Component Architecture

### Hierarchy

```
App.jsx
├── AuthProvider (Context)
│   └── MainRouter
│       └── Layout (Navbar + Footer)
│           ├── Home (public)
│           ├── Dashboard (protected)
│           ├── Course/ (CRUD pages)
│           ├── Project/ (CRUD pages)
│           ├── User/ (CRUD pages)
│           └── Feedback/ (embedded in ProjectDetail)
```

### Component Categories

#### Layout Components
- `Layout.jsx` - Main layout wrapper with Navbar
- `Home.jsx` - Landing page with hero and feature cards

#### Authentication Components
- `AuthContext.jsx` - Global auth state provider
- `Signin.jsx` - Login form
- `Signup.jsx` - Registration form

#### Entity Components (CRUD Pattern)
Each entity follows the same structure:

```
Entity/
├── ListEntity.jsx      # Grid/list view of all items
├── ListItemEntity.jsx  # Individual item card
├── AddEntity.jsx       # Create form
└── EditEntity.jsx      # Update form
```

#### Shared Components
- Cards (MUI Card)
- Forms (MUI TextField, Select)
- Buttons (MUI Button)
- Alerts (MUI Alert)
- Loading states (MUI CircularProgress)

---

## Layout Structure

### Navbar Design

```
┌─────────────────────────────────────────────────────────────────┐
│ EDUNEXUS    [Home] [Courses] [Projects] [Users]                │
│             ┌─────────────────────────┐                        │
│             │ 🔍 Search...      [▼]   │   [Dashboard] [Logout] │
│             └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Logo/brand on left
- Navigation links centered
- Search dropdown (150px width) - searches courses, projects, users
- Auth buttons on right

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVBAR                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    PAGE CONTENT                         │   │
│   │                                                         │   │
│   │   Container (maxWidth: lg)                              │   │
│   │   Padding: 24px                                         │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         FOOTER                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page Designs

### Homepage

#### Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Welcome to EduNexus                                │
│     Connect • Collaborate • Learn Together                      │
│                                                                 │
│     [Get Started]  [Learn More]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Benefits Cards (4 cards, semitransparent)
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   📚        │ │   🎯        │ │   🤝        │ │   💬        │
│  Discover   │ │   Showcase  │ │   Connect   │ │   Benefit   │
│   Courses   │ │    Your     │ │    With     │ │  from Peer  │
│             │ │   Projects  │ │   Peers     │ │  Feedback   │
│  Browse...  │ │  Submit...  │ │  Find...    │ │  Give and..│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

Styling:
- Background: rgba(255, 255, 255, 0.85)
- Min Height: 220px
- Icon Size: 52px
- Centered content
```

#### Statistics Section (Join Our Community)
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    150      │ │     45      │ │    320      │ │     12      │
│  Students   │ │  Projects   │ │  Feedback   │ │   Courses   │
│  Learning   │ │  Submitted  │ │    Given    │ │   Offered   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

Styling:
- Min Height: 180px
- Icon Size: 48px
- Vertical center alignment
- Data from /api/stats/homepage
```

#### Explore Platform Cards (4 cards)
```
┌─────────────────┐ ┌─────────────────┐
│     Courses     │ │     Projects    │
│                 │ │                 │
│  Browse and     │ │  Discover       │
│  enroll in      │ │  student        │
│  available      │ │  projects and   │
│  courses        │ │  provide        │
│                 │ │  feedback       │
│  [View Courses] │ │  [View Projects]│
└─────────────────┘ └─────────────────┘

Styling:
- Min Height: 280px
- Icon Size: 52px
- Centered content
```

### List Pages (Courses, Projects, Users)

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Title                                      [+ Add New]    │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Search...                    Filter: [All ▼]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │  Item 1   │  │  Item 2   │  │  Item 3   │  │  Item 4   │    │
│  │           │  │           │  │           │  │           │    │
│  │  Details  │  │  Details  │  │  Details  │  │  Details  │    │
│  │           │  │           │  │           │  │           │    │
│  │ [Actions] │  │ [Actions] │  │ [Actions] │  │ [Actions] │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │  Item 5   │  │  Item 6   │  │  Item 7   │  │  Item 8   │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Grid: 4 columns on desktop, 2 on tablet, 1 on mobile
```

### Form Pages (Add/Edit)

```
┌─────────────────────────────────────────────────────────────────┐
│  Form Title                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Title *                                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │                                                     │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │  Description *                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │                                                     │ │   │
│  │  │                                                     │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │  [Cancel]                              [Submit]         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Max width: 600px, centered
```

### Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Welcome, [User Name]!                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your Courses                                      [+ Add]      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│  │  Course 1 │  │  Course 2 │  │  Course 3 │                   │
│  └───────────┘  └───────────┘  └───────────┘                   │
│                                                                 │
│  Your Projects                                     [+ Add]      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│  │ Project 1 │  │ Project 2 │  │ Project 3 │                   │
│  └───────────┘  └───────────┘  └───────────┘                   │
│                                                                 │
│  Recent Feedback                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Feedback item 1                                        │   │
│  │  Feedback item 2                                        │   │
│  │  Feedback item 3                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| xs | 0-599px | 1 |
| sm | 600-899px | 2 |
| md | 900-1199px | 3 |
| lg | 1200-1535px | 4 |
| xl | 1536px+ | 4 |

### Grid System

Using MUI Grid2 for responsive layouts:

```jsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
    <Card />
  </Grid>
</Grid>
```

### Mobile Considerations

1. **Navigation**: Hamburger menu on mobile
2. **Cards**: Full width on mobile (1 column)
3. **Forms**: Full width inputs
4. **Tables**: Horizontal scroll or card view
5. **Touch targets**: Minimum 44x44px

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

#### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip links for main content

#### Screen Reader Support
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Form labels associated with inputs

### Implementation Examples

```jsx
// Accessible button
<Button
  aria-label="Delete course"
  onClick={handleDelete}
>
  <DeleteIcon />
</Button>

// Accessible form field
<TextField
  id="course-title"
  label="Course Title"
  required
  aria-describedby="title-helper-text"
/>
<FormHelperText id="title-helper-text">
  Enter a descriptive title
</FormHelperText>

// Skip link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

---

## Icon Usage

### Icon Library

Using Material Icons via `@mui/icons-material`:

| Context | Icon | Component |
|---------|------|-----------|
| Courses | SchoolIcon | `<SchoolIcon />` |
| Projects | AssignmentIcon | `<AssignmentIcon />` |
| Users | PeopleIcon | `<PeopleIcon />` |
| Feedback | CommentIcon | `<CommentIcon />` |
| Add | AddIcon | `<AddIcon />` |
| Edit | EditIcon | `<EditIcon />` |
| Delete | DeleteIcon | `<DeleteIcon />` |
| Search | SearchIcon | `<SearchIcon />` |

### Icon Sizing

| Context | Size | CSS |
|---------|------|-----|
| Card icons | 52px | `fontSize: 52` |
| Stat icons | 48px | `fontSize: 48` |
| Button icons | 24px | Default |
| Nav icons | 20px | `fontSize: "small"` |

---

## Animation & Transitions

### Hover Effects

```css
/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

/* Button hover */
.button:hover {
  background-color: rgba(25, 118, 210, 0.08);
  transition: background-color 0.2s;
}
```

### Loading States

- Use `CircularProgress` for async operations
- Skeleton loading for list items
- Disable buttons during submission

---

## Future Enhancements

### Planned Features
- [ ] Dark mode toggle
- [ ] Custom theme builder
- [ ] Drag-and-drop reordering
- [ ] Rich text editor for descriptions
- [ ] Image upload for projects

### Design Tokens
Consider migrating to CSS custom properties for easier theming:

```css
:root {
  --color-primary: #1976d2;
  --color-secondary: #9c27b0;
  --spacing-md: 16px;
  --radius-card: 8px;
}
```

---

**See Also:**
- [api.md](./api.md) - API documentation
- [project_requirements.md](./project_requirements.md) - Full requirements
