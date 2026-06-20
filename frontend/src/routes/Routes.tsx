import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'))
const IncomePage = lazy(() => import('@/pages/Income/IncomePage'))
const ExpensesPage = lazy(() => import('@/pages/Expenses/ExpensesPage'))
const CategoriesPage = lazy(() => import('@/pages/Categories/CategoriesPage'))
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/Register/RegisterPage'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
  </div>
)

const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
    <p className="text-gray-500">La página que buscas no existe.</p>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </LazyWrapper>
        ),
      },
      {
        path: 'income',
        element: (
          <LazyWrapper>
            <ProtectedRoute>
              <IncomePage />
            </ProtectedRoute>
          </LazyWrapper>
        ),
      },
      {
        path: 'expenses',
        element: (
          <LazyWrapper>
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          </LazyWrapper>
        ),
      },
      {
        path: 'categories',
        element: (
          <LazyWrapper>
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          </LazyWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <LazyWrapper>
            <LoginPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <LazyWrapper>
            <RegisterPage />
          </LazyWrapper>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
