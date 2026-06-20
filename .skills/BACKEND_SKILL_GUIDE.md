# SKILL: Modern and Scalable Architecture for Express + TypeScript

This SKILL defines the strict rules and guidelines that any AI assistant or developer must follow when working on this backend base (**Express.js + TypeScript + ESM**), adding new libraries, or integrating third-party services — regardless of the final project's business domain.

> **Note:** The original backend was NestJS, but the active stack is `backend-express` (Express + TypeScript). This document reflects the current stack.

---

## 1. Current Tech Stack

- **Runtime:** Node.js with native ESM (`"type": "module"`).
- **Framework:** Express.js.
- **Language:** TypeScript 5.7+ with `strict: true`.
- **Dev transpilation:** `tsx` (recommended) or `nodemon` + `tsx`.
- **Production build:** `tsc -p tsconfig.build.json` → `dist/`.
- **Validation:** Zod.
- **Logging:** Pino.
- **Database:** Prisma + MongoDB (with in-memory repositories for dev/tests without a DB).
- **Testing:** Vitest + Supertest.
- **Security:** Helmet, CORS, compression, express-rate-limit, JWT (`jsonwebtoken`), bcryptjs.

---

## 2. Core Structure Rules

All logic must be encapsulated and modularized. Mixing logic from different domains is not allowed.

```
src/
├── app.ts                  # createApp() factory — assembles Express
├── server.ts               # Entry point: loads env and listens on port
├── config/                 # Strict, typed application configuration
│   ├── cors.ts
│   ├── database.ts
│   ├── env.ts
│   ├── logger.ts
│   ├── repositories.ts
│   └── security.ts
├── modules/                # Self-contained business features
│   ├── auth/
│   └── items/
├── routes/
│   └── index.ts            # Mounts all routers under /api
├── shared/                 # Cross-cutting code (not business logic)
│   ├── errors/
│   ├── middlewares/
│   └── utils/
└── types/
    └── index.ts            # Shared contracts (DTOs, repository interfaces)
```

- **`config/`:** Environment variables, logger, CORS, security, repository factory.
- **`modules/<feature>/`:** Each feature contains its own routes, controller, service, schema, and repositories.
- **`shared/`:** Reusable errors, generic middlewares, and utilities.
- **`types/`:** Domain interfaces and repository contracts.

---

## 3. Layered Pattern per Feature

Each business module follows this strict flow:

```
Routes → Controller → Service → Repository
```

### Responsibilities

| Layer | Responsibility | What it must NOT do |
|------|-----------------|---------------------|
| **Routes** | Define endpoints, HTTP verbs, specific middlewares. | No business logic. |
| **Controller** | Receive request/response, extract data, call service, send response. | No business logic or DB access. |
| **Service** | Contain all business logic, rules, and domain validations. | No direct SDK, third-party library, or ORM calls. |
| **Repository** | Abstract persistence (Prisma, memory, etc.). | No business logic. |

### Standard files for a feature

```
modules/<feature>/
├── <feature>.routes.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.schema.ts        # Zod schemas + inferred types
├── <feature>.prisma-repository.ts
└── <feature>.memory-repository.ts
```

Example minimal structure for a new `courses` resource:

```ts
// modules/courses/courses.schema.ts
import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>
```

```ts
// modules/courses/courses.service.ts
import { AppError } from '../../shared/errors/AppError.js'
import type { CoursesRepository, CreateCourseInput } from '../../types/index.js'

export const createCoursesService = (repository: CoursesRepository) => ({
  async create(data: CreateCourseInput) {
    if (!data.title.trim()) {
      throw new AppError('Title is required', 400, 'VALIDATION_ERROR')
    }
    return repository.create(data)
  },
})
```

---

## 4. Repositories and Dependency Injection

### Rules

1. **Never use Prisma/ORM directly in controllers or services.** Always go through a repository.
2. **Define the contract in `src/types/index.ts`** as a `*Repository` interface.
3. **Implement at least two versions:**
   - `*.prisma-repository.ts` → real persistence.
   - `*.memory-repository.ts` → development/tests without a database.
4. **The repository factory** (`config/repositories.ts`) decides which one to use based on `DATABASE_URL`.
5. **`createApp(options?)`** accepts injected repositories to facilitate testing.

```ts
// config/repositories.ts (pattern)
export const createCoursesRepository = () => {
  return env.DATABASE_URL
    ? createPrismaCoursesRepository()
    : createMemoryCoursesRepository()
}
```

```ts
// tests/integration/courses.test.ts
const itemsRepo = createMemoryItemsRepository()
const usersRepo = createMemoryUsersRepository()
const app = createApp({ itemsRepository: itemsRepo, usersRepository: usersRepo })
```

---

## 5. Validation with Zod

### Rules

1. **All user input must be validated** (`body`, `params`, `query`).
2. **Create schemas in `modules/<feature>/<feature>.schema.ts`** using Zod.
3. **Use the `validate` middleware** (`shared/middlewares/validate.ts`) in routes.
4. **Infer types from Zod** and use them in services/controllers. Do not redefine DTOs manually.

```ts
// modules/items/items.routes.ts
import { validate } from '../../shared/middlewares/validate.js'
import { createItemSchema, updateItemSchema } from './items.schema.js'

router.post('/', authenticate, validate({ body: createItemSchema }), controller.create)
router.patch('/:id', authenticate, validate({ params: idParamSchema, body: updateItemSchema }), controller.update)
```

---

## 6. Error Handling

### Rules

1. **Use `AppError`** for predictable operational errors.
2. **Never throw generic errors (`throw new Error(...)`)** from business logic.
3. **Async controllers must be wrapped with `asyncHandler`** so Express can call `next(err)`.
4. **The `errorHandler` middleware** centralizes all error responses.

```ts
// shared/errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public isOperational = true,
  ) {
    super(message)
  }
}
```

```ts
// modules/items/items.controller.ts
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'

export const createItem = asyncHandler(async (req, res) => {
  const item = await service.create(req.body)
  res.status(201).json({ success: true, data: item })
})
```

---

## 7. Logging

- **Default logger:** Pino (`config/logger.ts`).
- **Configurable level** via `LOG_LEVEL`.
- **Request logging:** `requestLogger` middleware (Pino) logs method, URL, status, duration, and IP.
- **Do not use `console.log` in production.** Use `logger.info`, `logger.warn`, `logger.error`.
- **`morgan` is not connected** and is unnecessary; Pino covers request logging.

---

## 8. Security

- **Helmet**, **compression**, **express-rate-limit** applied globally in `config/security.ts`.
- **CORS** configurable via `CORS_ORIGIN`.
- **JWT authentication** via `authenticate` middleware (`shared/middlewares/auth.ts`).
- **Password hashing** with `bcryptjs`.
- **Never expose `JWT_SECRET` in code.** Use environment variables.

---

## 9. Environment Variables

- Validated with `envalid` in `config/env.ts`.
- Key variables: `NODE_ENV`, `PORT`, `CORS_ORIGIN`, `LOG_LEVEL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`, `DATABASE_URL`.
- Never access `process.env` directly from business modules. Use `env.*`.

---

## 10. Testing

- Framework: **Vitest**.
- Integration tests: use `supertest` + `createApp()` with injected in-memory repositories.
- Unit tests: test services with fake repositories.
- Run with `npm test` or `npm run test:coverage`.

```ts
// tests/integration/feature.test.ts
import request from 'supertest'
import { createApp } from '../src/app.js'
import { createMemoryItemsRepository, createMemoryUsersRepository } from '../src/config/repositories.js'

const app = createApp({
  itemsRepository: createMemoryItemsRepository(),
  usersRepository: createMemoryUsersRepository(),
})
```

---

## 11. Imports and ESM

- The project uses native ESM.
- **No path aliases are currently configured.** Imports are relative and end with `.js` for `NodeNext` compatibility.
- Correct example:
  ```ts
  import { AppError } from '../../shared/errors/AppError.js'
  import type { ItemsRepository } from '../../types/index.js'
  ```

---

## 12. Rules for Integrating Third-Party Libraries or Services

When integrating an external service (AWS, Stripe, SendGrid, Firebase, etc.), follow these rules:

1. **Never couple:** Do not make direct SDK calls inside business services.
2. **Create a Wrapper (Adapter Pattern):**
   - If the service is global, create a module in `src/config/` or `src/shared/` (e.g., `src/config/email.ts`).
   - If it is domain-specific, integrate it into a sub-service within `modules/<feature>/`.
3. **Injection via repositories/options:** The wrapper must be injectable through `createApp()` or the service constructor/factory.
4. **Error Handling:** Every external service must wrap errors in `AppError` so `errorHandler` responds correctly.

---

## Instruction for the AI Model

> "When starting any task in this repository, you must read and apply these guidelines. If the task involves adding a new endpoint, you must create its Zod schema, service, repository (Prisma + memory), and controller, respecting the Routes → Controller → Service → Repository flow. If it involves integrating a new service, you must create its wrapper and not pollute the core business logic."
