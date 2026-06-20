import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      toasts: [],
      addToast: (message, type) =>
        set(
          (state) => ({
            toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
          }),
          false,
          'toast/add',
        ),
      removeToast: (id) =>
        set(
          (state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }),
          false,
          'toast/remove',
        ),
    }),
    { name: 'ToastStore' },
  ),
)
