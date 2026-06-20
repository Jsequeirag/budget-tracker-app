# 💰 Budget Tracker App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

> Full-stack personal finance tracker — log income, categorize expenses, and visualize monthly reports with interactive charts. Built with React 19, Express.js, TypeScript, and MongoDB Atlas.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Summary cards, annual bar chart, category pie chart, recent transactions |
| 💵 **Income tracking** | CRUD with month/year filter and income source field |
| 💸 **Expense tracking** | CRUD with category filter and colored badges |
| 🏷️ **Categories** | Custom color picker (12) + Lucide icon selector (18) |
| 🔐 **Auth** | JWT login with persistent session via Zustand |

---

## 🛠️ Tech Stack

**Frontend**
- React 19 · Vite · TypeScript · Tailwind CSS
- Zustand · TanStack Query · Axios · React Hook Form · Zod
- Recharts · Lucide React · React Router v7

**Backend**
- Express.js · TypeScript · Native ESM
- Prisma · MongoDB Atlas · JWT · bcryptjs · Pino · Zod

---

## ⚙️ Requirements

- Node.js **20+**
- npm **10+**
- A **MongoDB Atlas** cluster (free tier works fine) — [create one here](https://www.mongodb.com/cloud/atlas/register)

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/Jsequeirag/budget-tracker-app.git
cd budget-tracker-app

cd backend-express && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Copy the example file and fill in your values:

```bash
cp backend-express/.env.example backend-express/.env
```

```env
# backend-express/.env

PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

JWT_SECRET=your-strong-random-secret-here
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

# Your MongoDB Atlas connection string
# Format: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
DATABASE_URL=mongodb+srv://...
```

> **MongoDB Atlas setup:**
> 1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
> 2. Create a database user with read/write permissions
> 3. Whitelist your IP address (or use `0.0.0.0/0` for development)
> 4. Copy the connection string into `DATABASE_URL`

### 3. Initialize the database

```bash
cd backend-express
npm run db:push   # creates collections in MongoDB
npm run seed      # creates the default user and 9 expense categories
```

### 4. Create your account

Once the app is running you have two options:

- **Use the seeded account** — credentials are defined in `src/scripts/seed.ts` (not exposed here for security)
- **Register a new account** — open `http://localhost:5173/register` and sign up

### 5. Run

```bash
# Terminal 1 — API server  →  http://localhost:3000
cd backend-express && npm run dev

# Terminal 2 — Web app     →  http://localhost:5173
cd frontend && npm run dev
```

---

## 📁 Project Structure

```
budget-tracker-app/
├── backend-express/
│   ├── prisma/schema.prisma       # User, Category, Expense, Income
│   ├── .env.example               # environment variable template
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── categories/
│       │   ├── expenses/
│       │   ├── income/
│       │   └── reports/           # summary · monthly · by-category
│       ├── config/                # env, cors, logger, repositories
│       ├── shared/                # middlewares, errors, utils
│       ├── scripts/seed.ts        # database seeder
│       └── types/
│
└── frontend/
    └── src/
        ├── api/                   # Axios client + TanStack Query hooks
        ├── pages/                 # Dashboard · Income · Expenses · Categories
        ├── store/                 # Zustand stores
        └── lib/schemas/           # Zod form schemas
```

---

## 🔌 API Endpoints

All routes (except `/auth/*`) require `Authorization: Bearer <token>`.

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id

GET    /api/expenses?month=&year=&categoryId=
POST   /api/expenses
PATCH  /api/expenses/:id
DELETE /api/expenses/:id

GET    /api/income?month=&year=
POST   /api/income
PATCH  /api/income/:id
DELETE /api/income/:id

GET    /api/reports/summary?month=&year=
GET    /api/reports/monthly?year=
GET    /api/reports/by-category?month=&year=
```

---

## 🧪 Testing

```bash
cd backend-express && npm test
cd frontend && npm test
```

---

## 📜 License

[MIT](./LICENSE) — free to use, modify, and distribute with attribution.

---

## 🏗️ Architecture

Backend follows a strict **Routes → Controller → Service → Repository** layered pattern.
Each module contains its own schema, service, controller, Prisma repository, and in-memory repository for tests.

> Development guides: [`.skills/`](./.skills/)
