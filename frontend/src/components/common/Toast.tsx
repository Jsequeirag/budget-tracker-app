import { useEffect } from 'react'
import { useToastStore } from '@/store/useToastStore'

const TOAST_DURATION = 4500

function Toast() {
  const { toasts, removeToast } = useToastStore()

  useEffect(() => {
    if (toasts.length === 0) return
    const latest = toasts[toasts.length - 1]
    if (!latest) return
    const timer = setTimeout(() => removeToast(latest.id), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [toasts, removeToast])

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border text-sm ${
            toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            aria-label="Cerrar notificación"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity leading-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
