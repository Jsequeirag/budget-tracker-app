import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  isLoading?: boolean
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-secondary text-white hover:opacity-90',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-text hover:bg-surface-soft',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        className={cn(
          'inline-flex items-center justify-center px-4 py-2 rounded-full font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Cargando...
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
