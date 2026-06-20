import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Theme = 'light' | 'dark'

type UIState = {
  isSidebarOpen: boolean
  theme: Theme
  toggleSidebar: () => void
  setTheme: (theme: Theme) => void
}

const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isSidebarOpen: false,
      theme: 'light',
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'ui/toggleSidebar'),
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme }, false, 'ui/setTheme')
      },
    }),
    { name: 'UIStore' },
  ),
)
