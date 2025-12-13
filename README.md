# EduNexus Frontend

A modern React application for peer learning and course management.

**Version:** 1.0.2 | **Status:** ✅ Production Ready

---

## Quick Start

### Prerequisites

- Node.js v16+ and npm v7+
- Backend API running (see [Backend Repository](../EduNexusAPI))

### Installation

```bash
# Clone repository
git clone <repository-url>
cd EduNexusFrontEnd

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API URL
```

### Environment Variables

Create `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Running Locally

```bash
# Start development server
npm run dev

# App runs at http://localhost:5173
```

---

## Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests (watch mode) |
| `npm test -- --run` | Run unit tests (single run) |
| `npm test -- --coverage` | Run with coverage report |
| `npm run cypress:open` | Open Cypress E2E UI |
| `npm run cypress:run` | Run Cypress headless |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |

---

## Project Structure

```
EduNexusFrontEnd/
├── docs/                   # Documentation
│   ├── project_requirements.md
│   ├── api.md
│   └── design.md
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication
│   │   ├── Course/        # Course CRUD
│   │   ├── Project/       # Project CRUD
│   │   ├── User/          # User management
│   │   └── Feedback/      # Feedback system
│   ├── services/          # API integration
│   └── utils/             # Utilities
├── cypress/               # E2E tests
└── package.json
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_BASE_URL`
4. Deploy

### Netlify

1. Connect GitHub at [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables
5. Deploy

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/project_requirements.md](docs/project_requirements.md) | Full requirements and user stories |
| [docs/api.md](docs/api.md) | API endpoints and integration |
| [docs/design.md](docs/design.md) | UI/UX design and components |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development guide and best practices |

---

## Tech Stack

- **React** 19.1.1
- **Vite** 7.2.4
- **Material-UI** 7.3.6
- **React Router** 7.9.1
- **Vitest** + React Testing Library
- **Cypress** 15.7.1

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails | Delete `package-lock.json`, retry |
| Port 5173 in use | Kill process or use `--port 3000` |
| Blank page | Check `VITE_API_BASE_URL` in `.env` |
| 401 errors | Token expired, sign in again |
| 403 errors | Check user role permissions |

---

## License

MIT
