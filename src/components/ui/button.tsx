import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'subtle'
  | 'destructive'
  | 'link'

export type ButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'pill' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  default:
    'bg-[var(--violet)] text-white border border-transparent shadow-[var(--shadow-subtle)] hover:bg-[var(--violet-hover)] active:translate-y-0',
  secondary:
    'bg-[var(--ink)] text-[var(--canvas)] border border-transparent shadow-[var(--shadow-subtle)] hover:opacity-92',
  outline:
    'border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] shadow-[var(--shadow-2xs)] hover:bg-[var(--surface)] hover:border-[var(--line-strong)]',
  subtle:
    'border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)] hover:border-[var(--line-strong)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]',
  destructive:
    'bg-[var(--danger)] text-white border border-transparent shadow-[var(--shadow-subtle)] hover:opacity-92',
  link: 'border-0 bg-transparent text-[var(--accent-text)] underline-offset-4 hover:underline p-0 h-auto',
}

const sizes: Record<ButtonSize, string> = {
  xs: 'h-7 rounded-[var(--radius-xs)] px-2.5 text-[11px] gap-1.5',
  sm: 'h-9 rounded-[var(--radius-sm)] px-3 text-xs gap-1.5',
  default: 'h-10 rounded-[var(--radius-sm)] px-4 py-2 text-xs gap-2',
  lg: 'h-11 rounded-[var(--radius-md)] px-5 text-sm gap-2',
  pill: 'h-10 rounded-full px-4 text-xs gap-2',
  icon: 'h-9 w-9 rounded-[var(--radius-sm)] p-0',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      type = 'button',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--violet)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45',
        variant !== 'link' && 'hover:-translate-y-[0.5px] active:translate-y-0',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  ),
)
Button.displayName = 'Button'
