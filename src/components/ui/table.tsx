import * as React from 'react'
import { cn } from '../../utils/cn'

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--canvas)]">
      <table
        className={cn('w-full border-collapse text-left text-xs text-[var(--ink)]', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'border-b border-[var(--line)] bg-[var(--surface)] text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]',
        className,
      )}
      {...props}
    />
  )
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('divide-y divide-[var(--line)] bg-[var(--canvas)]', className)}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('transition-colors hover:bg-[var(--surface)]/70', className)}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-4 py-3 font-semibold whitespace-nowrap', className)} {...props} />
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 align-middle', className)} {...props} />
}
