import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  widthClassName?: string
  menuClassName?: string
  containerClassName?: string
  dataMenuId?: string
  ariaLabel?: string
}

/**
 * Reusable, accessible DropdownMenu container with Framer Motion popover transition,
 * outside pointerdown dismissal, Escape handling, and arrow-key item navigation.
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  trigger,
  children,
  align = 'left',
  widthClassName = 'w-64',
  menuClassName,
  containerClassName,
  dataMenuId,
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (dataMenuId) {
        const insideMatchingMenu = Array.from(
          document.querySelectorAll(`[data-iconmuse-menu="${dataMenuId}"]`),
        ).some((node) => node.contains(target))
        if (!insideMatchingMenu) onClose()
        return
      }
      if (!containerRef.current?.contains(target)) {
        onClose()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        const triggerBtn = containerRef.current?.querySelector<HTMLElement>('button')
        triggerBtn?.focus()
        return
      }

      if (!menuRef.current) return
      const items = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [role="menuitem"]:not([aria-disabled="true"])',
        ),
      )
      if (items.length === 0) return

      const currentIndex = items.indexOf(document.activeElement as HTMLElement)
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex]?.focus()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prevIndex]?.focus()
      } else if (event.key === 'Home') {
        event.preventDefault()
        items[0]?.focus()
      } else if (event.key === 'End') {
        event.preventDefault()
        items[items.length - 1]?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, dataMenuId])

  return (
    <div
      ref={containerRef}
      data-iconmuse-menu={dataMenuId}
      className={cn('relative inline-block', containerClassName)}
    >
      {trigger}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 6,
              scale: shouldReduceMotion ? 1 : 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 4,
              scale: shouldReduceMotion ? 1 : 0.985,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              ' absolute z-50 mt-2 max-h-[min(72vh,34rem)] overflow-y-auto rounded-[16px] border border-[#E7E7EA] bg-white p-1.5 shadow-[var(--shadow-dropdown)]',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              widthClassName,
              menuClassName,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export interface DropdownTriggerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
  size?: 'sm' | 'default' | 'lg'
  variant?: 'pill' | 'rounded' | 'ghost'
  leftSlot?: React.ReactNode
}

export const DropdownTriggerButton = React.forwardRef<
  HTMLButtonElement,
  DropdownTriggerButtonProps
>(
  (
    {
      isOpen = false,
      size = 'default',
      variant = 'pill',
      leftSlot,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const sizeStyles = {
      sm: 'h-9 px-3 text-xs gap-2',
      default: 'h-10 px-3.5 text-xs gap-2',
      lg: 'h-12 px-4 text-xs gap-2.5',
    }
    const shapeStyles = {
      pill: 'rounded-full bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] hover:border-[#D8D8DC] shadow-2xs',
      rounded:
        'rounded-[10px] bg-white hover:bg-[#F7F7F8] border border-[#E7E7EA] hover:border-[#D8D8DC] shadow-2xs',
      ghost: 'rounded-[10px] bg-transparent hover:bg-[#F7F7F8] border border-transparent',
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          'inline-flex items-center justify-between font-semibold text-[#0F1116] transition-all duration-150',
          sizeStyles[size],
          shapeStyles[variant],
          isOpen && 'border-[#7141E8]/50 ring-2 ring-[#7141E8]/12',
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 items-center gap-2">
          {leftSlot}
          <span className="truncate">{children}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[#8E8E93] transition-transform duration-150',
            isOpen && 'rotate-180 text-[#7141E8]',
          )}
          aria-hidden="true"
        />
      </button>
    )
  },
)
DropdownTriggerButton.displayName = 'DropdownTriggerButton'

export const DropdownSectionLabel: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div
    className={cn(
      'px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[#8E8E93] select-none',
      className,
    )}
  >
    {children}
  </div>
)

export const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('my-1 h-px bg-[#E7E7EA]', className)} role="separator" />
)

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  icon?: React.ReactNode
  meta?: React.ReactNode
  description?: string
  showCheck?: boolean
  destructive?: boolean
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  selected = false,
  icon,
  meta,
  description,
  showCheck = true,
  destructive = false,
  children,
  className,
  ...props
}) => (
  <button
    type="button"
    role="menuitem"
    aria-pressed={selected}
    className={cn(
      'group flex min-h-9 w-full items-center justify-between gap-2.5 rounded-[10px] px-2.5 py-1.5 text-left text-xs transition-colors duration-100',
      destructive
        ? 'text-[#B42332] hover:bg-[#FFF5F5]'
        : selected
          ? 'bg-[var(--selection-soft)] font-semibold text-[var(--accent-text)]'
          : 'font-medium text-[#303038] hover:bg-[#F7F7F8] hover:text-[#0F1116]',
      className,
    )}
    {...props}
  >
    <span className="flex min-w-0 flex-1 items-center gap-2.5">
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{children}</span>
        {description && (
          <span className="mt-0.5 block truncate text-[11px] font-normal text-[#8E8E93]">
            {description}
          </span>
        )}
      </span>
    </span>

    <span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums text-[#8E8E93]">
      {meta}
      {showCheck && selected && (
        <Check className="h-3.5 w-3.5 shrink-0 text-[#7141E8]" aria-hidden="true" />
      )}
    </span>
  </button>
)

export interface DropdownSelectOption {
  value: string
  label: string
  meta?: string
  description?: string
}

export interface DropdownSelectProps {
  id?: string
  value: string
  options: DropdownSelectOption[]
  onChange: (value: string) => void
  ariaLabel?: string
  size?: 'sm' | 'default'
  align?: 'left' | 'right'
  className?: string
  menuWidthClassName?: string
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  size = 'sm',
  align = 'left',
  className,
  menuWidthClassName = 'w-48',
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const activeOption = options.find((opt) => opt.value === value) ?? options[0]

  return (
    <DropdownMenu
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      align={align}
      widthClassName={menuWidthClassName}
      ariaLabel={ariaLabel}
      containerClassName={className}
      trigger={
        <DropdownTriggerButton
          id={id}
          isOpen={isOpen}
          size={size}
          variant="rounded"
          aria-label={ariaLabel}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full"
        >
          {activeOption?.label ?? value}
        </DropdownTriggerButton>
      }
    >
      {options.map((opt) => (
        <DropdownItem
          key={opt.value}
          selected={opt.value === value}
          meta={opt.meta}
          description={opt.description}
          onClick={() => {
            onChange(opt.value)
            setIsOpen(false)
          }}
        >
          {opt.label}
        </DropdownItem>
      ))}
    </DropdownMenu>
  )
}
