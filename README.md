# EduNexus Frontend

A modern, responsive React application for course and project management with JWT authentication and feedback systems.

**Version:** 1.0.2 | **Status:** ✅ Production Ready | **Last Updated:** December 12, 2025

## 📖 Quick Links
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Testing Guide](./TESTING.md)
- [API Documentation](./FRONTEND_API_DOCUMENTATION.md)
- [Changelog](./CHANGELOG.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## ✨ Features

- **Authentication**: JWT-based (7-day expiration), signup/signin/logout
- **Course Management**: Full CRUD with ownership validation
- **User Management**: Profiles, registration, account editing
- **Project Management**: Create, edit, view projects with feedback
- **Feedback System**: Rate projects (1-5), add comments and labels
- **Dashboard**: Personal view of owned courses, projects, feedback
- **Search & Filter**: Real-time search with status filtering
- **RBAC**: Role-based access (student, instructor, admin)
- **Responsive Design**: Mobile, tablet, desktop optimized

## 🚀 Quick Start

### Prerequisites
- Node.js v16+, npm v7+

### Installation

```bash
npm install
echo 'VITE_API_BASE_URL=http://localhost:3000/api' > .env
npm run dev
```

## 📁 Project Structure

```
src/
├── components/       # React components (Course, User, Project, Feedback, auth)
├── services/         # API service calls
├── hooks/            # Custom hooks (useAuth, useAuthorizationCheck, use403Handler)
├── utils/            # Utility functions
└── test/             # Test setup

cypress/e2e/          # E2E tests
```

## 🛠️ Commands

```bash
npm run dev           # Start dev server (5173)
npm run build         # Production build
npm test              # Unit tests
npm run cypress:open  # E2E tests
```

## 📦 Tech Stack

- React 19.1.1
- Vite 7.2.4
- Material-UI 7.3.6
- React Router 7.9.1
- Vitest 4.0.15
- Cypress 13.6.0

## 🔐 Authentication

- JWT tokens stored in localStorage
- Auto-injected in API headers
- 7-day expiration
- Protected routes redirect to `/users/signin`

## 🧪 Testing

- **64+ unit tests** - Vitest + React Testing Library
- **E2E test suites** - Cypress
- **Authorization tests** - RBAC, 403 Forbidden, 409 Conflict handling

Run: `npm test` or `npm run cypress:open`

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check backend URL in `.env`, verify backend is running |
| 403 Forbidden | Not authorized - check user role |
| 409 Conflict | Already submitted feedback for this project |
| Tests failing | Run `npm test -- --run` for details |

## 📄 License

MIT
