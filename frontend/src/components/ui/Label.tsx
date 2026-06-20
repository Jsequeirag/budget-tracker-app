import { type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-text mb-1', className)} {...props}>
      {children}
    </label>
  )
}
