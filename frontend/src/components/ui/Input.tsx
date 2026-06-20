import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 rounded-lg border bg-surface text-text',
          'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
          'focus-visible:outline-none transition-all',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
