import * as React from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'violet'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'

export type BadgeSize = 'sm' | 'default' | 'lg'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-[var(--violet)] text-white',
  secondary: 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]',
  outline: 'border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)]',
  violet:
    'border-[color-mix(in_srgb,var(--selection)_30%,transparent)] bg-[var(--selection-soft)] text-[var(--accent-text)]',
  success: 'border-transparent bg-[var(--success-subtle)] text-[var(--success)]',
  warning: 'border-transparent bg-[var(--warning-subtle)] text-[var(--warning)]',
  destructive: 'border-transparent bg-[var(--danger-subtle)] text-[var(--danger)]',
  info: 'border-transparent bg-[var(--info-subtle)] text-[var(--info)]',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  default: 'px-2.5 py-0.5 text-[11px]',
  lg: 'px-3 py-1 text-xs',
}

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold leading-none tracking-tight transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
