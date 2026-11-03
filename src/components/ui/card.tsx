import * as React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'elevated' | 'interactive'
}

const cardVariants: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'border-[var(--line)] bg-[var(--canvas)] shadow-[var(--shadow-subtle)]',
  subtle: 'border-[var(--line)] bg-[var(--surface)] shadow-none',
  elevated: 'border-[var(--line)] bg-[var(--canvas)] shadow-[var(--shadow-card)]',
  interactive:
    'border-[var(--line)] bg-[var(--canvas)] shadow-[var(--shadow-subtle)] transition-all duration-150 hover:-translate-y-[1px] hover:border-[var(--selection)] hover:shadow-[var(--shadow-card)] cursor-pointer',
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border text-[var(--ink)]',
        cardVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm font-semibold leading-snug tracking-tight text-[var(--ink)] m-0', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-[var(--muted)] leading-relaxed m-0', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between border-t border-[var(--line)] px-5 py-3.5', className)}
      {...props}
    />
  )
}
