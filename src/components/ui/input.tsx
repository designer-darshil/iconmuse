import * as React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: 'sm' | 'default' | 'lg'
  hasError?: boolean
}

const sizeClasses: Record<'sm' | 'default' | 'lg', string> = {
  sm: 'h-8 rounded-[var(--radius-xs)] px-2.5 text-xs',
  default: 'h-10 rounded-[var(--radius-sm)] px-3.5 py-2 text-sm',
  lg: 'h-12 rounded-[var(--radius-md)] px-4 text-sm',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', inputSize = 'default', hasError = false, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={hasError || props['aria-invalid']}
      className={
        className
          ? cn('flex w-full disabled:cursor-not-allowed disabled:opacity-50', className)
          : cn(
              'flex w-full border bg-[var(--canvas)] text-[var(--ink)] shadow-[var(--shadow-2xs)] transition-all duration-150 placeholder:text-[var(--muted)] focus-visible:outline-2 focus-visible:outline-[var(--violet)] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError
                ? 'border-[var(--danger)] bg-[var(--danger-subtle)]/30 focus-visible:outline-[var(--danger)]'
                : 'border-[var(--line)] hover:border-[var(--line-strong)] focus-visible:border-[var(--violet)]',
              sizeClasses[inputSize],
            )
      }
      {...props}
    />
  ),
)
Input.displayName = 'Input'
