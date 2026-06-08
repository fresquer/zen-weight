import { useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { ResetPassword } from '@/pages/ResetPassword'
import { Dashboard } from '@/pages/Dashboard'
import { History } from '@/pages/History'
import { Settings } from '@/pages/Settings'

function RequireAuth({ children }) {
  const { isAuthenticated, isReady } = useAuthStore()
  if (!isReady) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function RequireGuest({ children }) {
  const { isAuthenticated, isReady } = useAuthStore()
  if (!isReady) return null
  if (isAuthenticated) return <Navigate to="/app" replace />
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: (
      <RequireGuest>
        <AuthLayout />
      </RequireGuest>
    ),
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/reset-password',
    element: (
      <AuthLayout />
    ),
    children: [{ index: true, element: <ResetPassword /> }],
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'history', element: <History /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

export function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  return <RouterProvider router={router} />
}
