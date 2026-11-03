import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useOverlayScrollLock } from '../../hooks/useOverlayScrollLock'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
  headerActions?: React.ReactNode
  footer?: React.ReactNode
  size?: ModalSize
  children: React.ReactNode
  ariaLabelledBy?: string
  closeLabel?: string
  className?: string
  bodyClassName?: string
  showEscHint?: boolean
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[1680px] h-[100dvh] md:h-[90vh]',
}

/**
 * Reusable, accessible Modal dialog component with backdrop blur, focus trapping,
 * Escape dismissal, scroll locking, and consistent surface elevation tokens.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerActions,
  footer,
  size = 'lg',
  children,
  ariaLabelledBy = 'modal-dialog-title',
  closeLabel = 'Close modal',
  className,
  bodyClassName,
  showEscHint = true,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  useOverlayScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>(
      `button[aria-label="${closeLabel}"]`,
    )
    closeBtn?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement.current?.focus?.()
    }
  }, [isOpen, onClose, closeLabel])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F1116]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.975,
              y: shouldReduceMotion ? 0 : 10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.98,
              y: shouldReduceMotion ? 0 : 8,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              'relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[22px] border border-[#E7E7EA] bg-white shadow-[var(--shadow-modal)]',
              sizeClasses[size],
              className,
            )}
          >
            {(title || headerActions) && (
              <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-[#E7E7EA] bg-white px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  {icon && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7141E8]/20 bg-[var(--selection-soft)] text-[var(--accent-text)]">
                      {icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    {title && (
                      <h3
                        id={ariaLabelledBy}
                        className="m-0 truncate text-sm font-bold tracking-tight text-[#0F1116]"
                      >
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p className="m-0 mt-0.5 truncate text-[11px] text-[#8E8E93]">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {headerActions}
                  {showEscHint && (
                    <kbd className="hidden sm:inline-flex items-center rounded-[6px] border border-[#E7E7EA] bg-[#F7F7F8] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#8E8E93]">
                      Esc
                    </kbd>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={closeLabel}
                    className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-transparent text-[#8E8E93] transition-colors hover:border-[#E7E7EA] hover:bg-[#F7F7F8] hover:text-[#0F1116]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </header>
            )}

            <div className={cn('min-h-0 flex-1 overflow-y-auto p-4 sm:p-6', bodyClassName)}>
              {children}
            </div>

            {footer && (
              <footer className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[#E7E7EA] bg-[#F7F7F8] px-4 py-3.5 sm:px-6">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
