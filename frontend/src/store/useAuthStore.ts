import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type User = {
  id: string
  name: string | null
  email: string
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setCredentials: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        setCredentials: (user, token) =>
          set(
            { user, token, isAuthenticated: true, isLoading: false },
            false,
            'auth/setCredentials',
          ),
        logout: () =>
          set(
            { user: null, token: null, isAuthenticated: false, isLoading: false },
            false,
            'auth/logout',
          ),
        setLoading: (loading) => set({ isLoading: loading }, false, 'auth/setLoading'),
      }),
      { name: 'auth-storage' },
    ),
    { name: 'AuthStore' },
  ),
)
