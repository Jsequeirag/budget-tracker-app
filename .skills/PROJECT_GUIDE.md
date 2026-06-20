# 📘 Project Quick Guide

Executive summary of the stack, structure, and workflow of the base project.

---

## 🧱 General Stack

| Layer | Technology |
|------|------------|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Backend | Express.js + TypeScript + ESM |
| Global state | Zustand |
| HTTP requests | Axios + TanStack Query (React Query) |
| Validation | Zod |
| Forms | React Hook Form + `@hookform/resolvers/zod` |
| Routing | React Router v7 |
| Database | Prisma + MongoDB (with in-memory fallback) |
| Auth | JWT (`jsonwebtoken`) + bcryptjs |
| Logger | Pino |
| Testing | Vitest + Testing Library (frontend) / Supertest (backend) |
| Quality | ESLint 9 + Prettier |

---

## 📁 Repository Structure

```
D-Ruta-2026-Proyecto-Base-Nest-React-Tailwind-Skills/
├── backend-express/          # Active backend (Express + TS)
│   ├── src/
│   │   ├── app.ts            # createApp() factory
│   │   ├── server.ts         # Entry point
│   │   ├── config/           # Env, logger, CORS, security, repositories
│   │   ├── modules/          # Business features (auth, items)
│   │   ├── routes/           # Router mounting
│   │   ├── shared/           # Middlewares, errors, utilities
│   │   └── types/            # Shared contracts
│   ├── tests/                # Unit and integration tests
│   ├── prisma/
│   ├── package.json
│   └── nodemon.json
├── frontend/                 # Active frontend (React + Vite)
│   ├── src/
│   │   ├── api/              # Axios, hooks, urls, dtos
│   │   ├── components/       # ui, common, layout, demo
│   │   ├── lib/              # Utilities and Zod schemas
│   │   ├── pages/            # Pages by feature
│   │   ├── routes/           # React Router v7 router
│   │   ├── store/            # Zustand stores
│   │   └── styles/           # Global CSS and Tailwind tokens
│   ├── package.json
│   └── vite.config.ts
├── .skills/                  # Development guides
│   ├── PROJECT_GUIDE.md
│   ├── BACKEND_SKILL_GUIDE.md
│   └── FRONTEND_SKILL_GUIDE.md
└── backend/                  # Original NestJS backend (unused)
```

---

## 🚀 Most Used Scripts

### Backend (`cd backend-express`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Development with `tsx watch` (recommended) |
| `npm run dev:nodemon` | Development with nodemon + tsx |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run `dist/server.js` |
| `npm test` | Run tests with Vitest |
| `npm run db:push` | Sync Prisma schema with the DB |

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite development server |
| `npm run build` | Type check + production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests with Vitest |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## 🛤️ Typical Development Flow

### Adding a new resource (e.g., `courses`)

#### Backend

1. Create `src/modules/courses/` with:
   - `courses.schema.ts` (Zod)
   - `courses.service.ts`
   - `courses.controller.ts`
   - `courses.routes.ts`
   - `courses.memory-repository.ts`
   - `courses.prisma-repository.ts`
2. Define interfaces in `src/types/index.ts`.
3. Add the router in `src/routes/index.ts`.
4. Add the implementation in `src/config/repositories.ts`.
5. Write tests in `tests/integration/courses.test.ts` and `tests/unit/courses.service.test.ts`.

#### Frontend

1. Create DTOs/endpoints in `src/api/urls/courses.ts`.
2. Create the schema in `src/lib/schemas/course.schema.ts`.
3. Create the page in `src/pages/Courses/CoursesPage.tsx`.
4. Add the route in `src/routes/Routes.tsx`.
5. Use `useApiGet` / `useApiSend` in components.

---

## 🔐 Authentication

- The backend issues JWTs at `/api/auth/login` and `/api/auth/register`.
- The frontend stores the token in `localStorage` via `useAuthStore` (Zustand + persist).
- Axios automatically injects `Authorization: Bearer <token>`.
- On `401`, the frontend logs out and redirects to `/login`.
- Protected routes use `ProtectedRoute`.

> ⚠️ **Production note:** `localStorage` is vulnerable to XSS. Evaluate `HttpOnly` cookies for real projects.

---

## 🧪 Testing

- **Backend:** Vitest + Supertest. In-memory repositories are injected into `createApp()`.
- **Frontend:** Vitest + Testing Library + jsdom.
- Both projects use `strict: true` in TypeScript.

---

## ⚠️ Key Architectural Decisions

| Decision | Reason |
|----------|--------|
| Express instead of NestJS | Greater simplicity and control for a base template. |
| Dual repositories (Prisma + memory) | Allows running the project and tests without a real database. |
| Zod instead of `class-validator` | Type-safe validation with native type inference. |
| Pino instead of `morgan`/`console.log` | Structured, configurable, and test-friendly logging. |
| TanStack Query + Axios | Caching, loading/error states without boilerplate. |
| Zustand instead of Context | Simple global state with devtools and persistence. |
| Pure Tailwind (no CSS Modules) | Fast development with centralized tokens in `tailwind.config.js`. |

---

## 📚 Additional Documentation

- For detailed backend rules: `.skills/BACKEND_SKILL_GUIDE.md`
- For detailed frontend rules: `.skills/FRONTEND_SKILL_GUIDE.md`

---

## 💡 Quick Command to Start Everything

```bash
# Terminal 1
cd backend-express && npm run dev

# Terminal 2
cd frontend && npm run dev
```

By default, the backend runs at `http://localhost:3000` and the frontend at `http://localhost:5173`.
