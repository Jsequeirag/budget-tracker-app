# Backend Express.js Template

Professional backend template with **TypeScript + Express.js**, **JWT**, **Prisma + MongoDB**, and security middleware. Ready to start projects from scratch with best practices and scalable architecture.

## Stack

- **Express.js 4** — Web framework.
- **TypeScript 5** — Static typing.
- **Prisma + MongoDB** — ORM and NoSQL database.
- **JWT** — Token-based authentication.
- **bcryptjs** — Password hashing.
- **Zod** — Schema validation.
- **Pino** — Structured logging.
- **Helmet + Rate Limit + Compression** — Security and performance.
- **envalid** — Environment variable validation.
- **Vitest + Supertest** — Unit and integration tests.
- **tsx** — TypeScript execution in development.

## Requirements

- Node.js 18 or higher.
- MongoDB local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) account.

## Installation

```bash
cd backend-express
npm install
```

## Configuration

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (`development`, `test`, `production`) | `development` |
| `CORS_ORIGIN` | Origin allowed by CORS | `*` |
| `LOG_LEVEL` | Log level | `info` |
| `JWT_SECRET` | Secret key for signing JWT | change in production |
| `JWT_EXPIRES_IN` | Token expiration time | `1d` |
| `BCRYPT_ROUNDS` | bcrypt rounds | `10` |
| `DATABASE_URL` | MongoDB URL | empty |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

### No-database mode

If you leave `DATABASE_URL` empty, the server will use in-memory repositories. Useful for:
- Rapid development.
- Running tests (`npm test`).
- Trying the template without configuring MongoDB.

### MongoDB mode

1. Create a cluster in MongoDB Atlas (or use local MongoDB).
2. Copy the connection URL and paste it into `DATABASE_URL`.
3. Run:

```bash
npm run db:push
```

This syncs the Prisma schema with your MongoDB database.

## Scripts

```bash
npm run dev              # Development with tsx watch (reloads on changes)
npm run dev:node         # Development with node --watch on dist/
npm start                # Production (requires previous build)
npm run build            # Compile TypeScript to dist/
npm test                 # Run tests once
npm run test:watch       # Tests in watch mode
npm run test:coverage    # Coverage
npm run db:generate      # Generate Prisma client
npm run db:push          # Sync schema with MongoDB
npm run db:studio        # Prisma visual interface
```

## Structure

```
src/
├── config/               # env, logger, cors, security, database, repositories
├── modules/
│   ├── auth/             # Login, register, profile
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.memory-repository.ts
│   │   ├── auth.prisma-repository.ts
│   │   ├── auth.routes.ts
│   │   └── auth.schema.ts
│   └── items/            # Example CRUD
│       ├── items.controller.ts
│       ├── items.service.ts
│       ├── items.memory-repository.ts
│       ├── items.prisma-repository.ts
│       ├── items.routes.ts
│       └── items.schema.ts
├── shared/
│   ├── errors/AppError.ts
│   └── middlewares/      # asyncHandler, auth, errorHandler, requestLogger, validate
├── types/                # Shared types and interfaces
├── routes/
│   └── index.ts          # Module mounting
├── app.ts                # createApp({ itemsRepository, usersRepository })
└── server.ts             # Entry point
```

## Endpoints

### Auth

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Sign in | ❌ |
| GET | `/api/auth/me` | User profile | ✅ |

### Items

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/items` | List resources | ❌ |
| GET | `/api/items/:id` | Get resource | ❌ |
| POST | `/api/items` | Create resource | ✅ |
| PUT | `/api/items/:id` | Replace resource | ✅ |
| PATCH | `/api/items/:id` | Partial update | ✅ |
| DELETE | `/api/items/:id` | Delete resource | ✅ |

### System

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Server health |
| GET | `/api` | Hello World |

## Included Middlewares

- **helmet()**: HTTP security headers.
- **express-rate-limit**: Basic abuse protection.
- **compression()**: Response compression.
- **requestLogger**: Logs every request with Pino.
- **errorHandler**: Consistent error responses.
- **validate**: Zod validation.
- **authenticate**: JWT route protection.

## Repositories

Each entity has two implementations:

- `*.memory-repository.ts` — For tests and development without a DB.
- `*.prisma-repository.ts` — For production with MongoDB.

The app chooses automatically:
- If `DATABASE_URL` is set → uses Prisma.
- If empty → uses memory.

For tests, in-memory repositories are always injected.

## Conventions for Adding a New Module

Copy `src/modules/items/` or `src/modules/auth/` and rename. Then:

1. Define Zod schemas and infer types.
2. Create memory-repository and prisma-repository.
3. Implement service and controller.
4. Define routes with `createXxxRouter(repository)`.
5. Mount the router in `src/routes/index.ts`.
6. Add unit and integration tests.

## Usage Example

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456","name":"User"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

### Create item (requires token)

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"New item","description":"Description"}'
```

## Tests

```bash
npm test
```

Tests use in-memory repositories, so they **do not require MongoDB**.

## Important Notes

- **IDs in MongoDB**: Prisma generates `ObjectId` IDs (strings). The in-memory `items` module uses numeric IDs to maintain temporary compatibility with the demo frontend.
- **JWT_SECRET**: In production, use a long, random key. Never commit `.env` to the repository.
- **Security**: This template includes basic measures. For production, consider refresh tokens, roles, strict CSP, per-user rate limiting, etc.
