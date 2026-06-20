# 🏛️ Frontend Architecture and Standards

This document is the **Skill/Development Guide** for the Frontend of this base project (**React 19 + Vite + TypeScript + Tailwind CSS**). It establishes the architectural rules and best practices that **must always be followed** when adding new features, libraries, or code — regardless of the final project's business domain.

> **Note:** The associated backend is `backend-express` (Express + TypeScript), not NestJS. This guide reflects the current frontend.

---

## 1. 🌐 HTTP Request Handling (TanStack Query + Axios)

**Golden Rule:** NEVER use `axios` or `fetch` directly inside a React component. Also, do NOT use `useEffect` to load basic data.

### A. Creating Endpoints (`src/api/urls/`)

All endpoints must be abstracted into their own file inside `src/api/urls/`.

- They must export the interfaces/DTOs for the data they send or receive.
- They must use the generic `request` function from `src/api/config/network.ts`.

```typescript
// src/api/urls/courses.ts
import { request } from '../config/network';

export interface CourseDto {
  id: string;
  title: string;
  description?: string | null;
}

export interface CreateCourseDto {
  title: string;
  description?: string | null;
}

export const coursesApi = {
  getAll: () => request<CourseDto[]>({ url: '/courses', method: 'GET' }),
  create: (data: CreateCourseDto) => request<CourseDto>({ url: '/courses', method: 'POST', data }),
};
```

### B. Using in Components (`useApiGet` and `useApiSend`)

Only import the base Custom Hooks located in `src/api/config/customHooks.ts`.

- **For reading data (GET):** Use `useApiGet`.

  ```tsx
  const { data, isPending, isError } = useApiGet(['courses'], coursesApi.getAll);
  ```

- **For mutating data (POST, PUT, DELETE, PATCH):** Use `useApiSend`.
  - **Mandatory:** pass an array with the cache keys (`invalidateKey`) to update after success.
  - The current signature is: `useApiSend(fn, invalidateKey?, options?, onSuccess?)`.

  ```tsx
  const { mutate: createCourse, isPending } = useApiSend(
    coursesApi.create,
    [['courses']],              // Automatically refreshes the associated GET
    {
      onError: (err) => console.error('Error:', err),
    },
    (data) => console.log('Success:', data)
  );
  ```

---

## 2. 🧠 Global State Management (Zustand)

**Golden Rule:** Avoid creating complex Contexts (`React.Context`). Use **Zustand** for any global state that transcends the local hierarchy of a component.

### Zustand Rules:

1. **Slices Pattern:** Create a separate store file for each logical domain (e.g., `useAuthStore.ts`, `useToastStore.ts`, `useUIStore.ts`).
2. **Location:** All stores must be kept in `src/store/`.
3. **Middlewares:**
   - Always use `devtools` to audit state with Redux DevTools.
   - Use `persist` for state that should survive a page reload (e.g., authentication tokens or theme preferences).

```typescript
// src/store/useDomainStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DomainState {
  value: string;
  setValue: (val: string) => void;
}

export const useDomainStore = create<DomainState>()(
  devtools(
    persist(
      (set) => ({
        value: '',
        setValue: (val) => set({ value: val }, false, 'domain/setValue'),
      }),
      { name: 'domain-storage' }
    ),
    { name: 'DomainStore' }
  )
);
```

### Current Reference Stores

| Store | Purpose | Middleware |
|-------|---------|------------|
| `useAuthStore.ts` | User, token, authentication, logout | `devtools` + `persist` |
| `useToastStore.ts` | Toast list, add/remove | `devtools` |
| `useUIStore.ts` | Sidebar, light/dark theme | `devtools` |

---

## 3. ⚙️ Library Integration and Configurations

**Golden Rule:** Any external library (UI, Routing, Authentication) must be configured in a scalable, "Enterprise" way.

1. **Abstraction:** If a library requires global configuration, it should not pollute component logic. It must be initialized in a dedicated file (like `network.ts` for Axios) and provided in `App.tsx` (like `QueryClientProvider`).
2. **Routing:** We use **React Router v7** with the `createBrowserRouter` and `RouterProvider` architecture, supporting Layouts (like `MainLayout.tsx`).
3. **Lazy loading:** Pages are loaded with `React.lazy` + `Suspense`.

---

## 4. 🎨 Styles and Visual Design

1. **Tailwind CSS:** This is the primary styling system. Design tokens (colors, shadows, radii, fonts) live in `tailwind.config.js`.
2. **We do not use CSS Modules** in this project. Component-specific styles are handled with Tailwind classes directly in components.
3. **CSS Variables:** The file `src/styles/variables.css` is deprecated and no longer used. Do not add new variables there; extend `tailwind.config.js` if you need new tokens.
4. **Utilities:** Use `cn()` (`src/lib/utils/cn.ts`) to combine Tailwind classes conditionally.
5. **Visual Quality:** Always aim for a modern design, using interactive hover states (`transform`, `box-shadow`) and vibrant colors over clean schemes (`#f8fafc`).

---

## 5. 🛡️ Error Handling

**Golden Rule:** The user must always receive clear feedback on any failure — network, logic, or rendering.

### A. Error Boundary (rendering crashes)

Wrap `App.tsx` with the `ErrorBoundary` component from `src/components/common/ErrorBoundary.tsx`. This catches JavaScript errors in the component tree and shows a recovery screen instead of a blank screen.

```tsx
// App.tsx
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toast />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

### B. Global toasts for network errors

Errors from `useApiGet` and `useApiSend` are automatically captured via `QueryCache` and `MutationCache` in `App.tsx` and shown as notifications using `useToastStore` (`src/store/useToastStore.ts`). The `Toast` component (`src/components/common/Toast.tsx`) is mounted once in `App.tsx`.

- **It is not necessary** to show individual error messages in each component for network errors — the toast covers them.
- For form validation errors, show the error inline next to the field.

### C. Loading and error states in components

- Loading state: use `role="status"` with `aria-live="polite"`.
- Error state: use `role="alert"` with `aria-live="assertive"`.

```tsx
if (isPending) return <div role="status" aria-live="polite">Loading...</div>;
if (isError) return <div role="alert" aria-live="assertive">Could not connect to the server.</div>;
```

---

## 6. 📝 Forms

1. **React Hook Form + Zod:** All forms must use `react-hook-form` with schema resolution via `@hookform/resolvers/zod`.
2. **Schemas in `src/lib/schemas/`:** Define form Zod schemas in dedicated files (`auth.schema.ts`, `item.schema.ts`, etc.).
3. **Base components:** Use UI components (`Input`, `Button`, `Label`, `FormError`) to maintain consistency.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/schemas/auth.schema';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    // call mutate
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <FormError>{errors.email.message}</FormError>}
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

---

## 7. ♿ Accessibility (A11y)

**Golden Rule:** Every interface must be keyboard-navigable and understandable for screen readers.

### Mandatory Rules:

1. **`lang` in HTML:** The `index.html` file must have `<html lang="en">` (or the correct project language).

2. **Semantic HTML:** Use the correct tags:
   - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` instead of generic `<div>` where appropriate.
   - `<ul>/<li>` for dynamic item lists.
   - A single `<h1>` per page; pages use `<h2>`, components use `<h3>`.

3. **Skip link:** Every layout must include a "Skip to main content" link visible when focused with Tab:

   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only ...">
     Skip to main content
   </a>
   <main id="main-content">...</main>
   ```

4. **`aria-label` on contextual action buttons:** Buttons that operate on a specific item must identify it:

   ```tsx
   <button aria-label={`Delete "${resource.name}"`}>Delete</button>
   ```

5. **`aria-label` on `<nav>`:** Always name navigation regions:

   ```tsx
   <nav aria-label="Main navigation">...</nav>
   ```

6. **Dynamic regions (`aria-live`):** Containers whose content changes in response to user actions must use `aria-live`:
   - `aria-live="polite"` — non-urgent updates (lists, results).
   - `aria-live="assertive"` — critical errors requiring immediate attention.

7. **`aria-busy` and `aria-pressed`:** Add `aria-busy={isPending}` on action buttons during processing. Use `aria-pressed` on toggle buttons.

---

## 8. 🔐 Authentication

1. The JWT is stored in `localStorage` via Zustand `persist` (`useAuthStore`).
2. The Axios interceptor in `network.ts` automatically injects the `Authorization: Bearer <token>` header.
3. On `401`, the interceptor executes `logout()` and redirects to `/login`.
4. Protected routes use `ProtectedRoute` (`src/components/common/ProtectedRoute.tsx`).

> **Production warning:** storing JWT in `localStorage` exposes you to XSS. For real projects, evaluate `HttpOnly` cookies.

---

## Instruction for the AI Model

> "When starting any task in this repository, you must read and apply these guidelines. If the task involves creating a new page or feature, you must use TanStack Query + Axios through `useApiGet`/`useApiSend`, Zustand for global state, Tailwind for styles, React Hook Form + Zod for forms, and React Router v7 for routing. Do not use `fetch`/`axios` directly in components, do not use CSS Modules, and do not add CSS variables to `src/styles/variables.css`."
