import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  Columns2,
  Copy,
  Check,
} from 'lucide-react'
import { MOCK_ICONS } from '../../data/mockIcons'
import type { IconItem } from '../../types'
import { cn } from '../../utils/cn'

export interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
  compareIconIds: string[]
  activeColor?: string
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareIconIds,
  activeColor = '#0F1116',
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const icons = MOCK_ICONS.filter((icon) => compareIconIds.includes(icon.id))

  // Escape listener and focus trapping
  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Focus close button initially
    const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close comparison modal"]')
    closeBtn?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement.current?.focus?.()
    }
  }, [isOpen, onClose])

  const handleCopySvg = (icon: IconItem) => {
    const code = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><desc>${icon.name}</desc></svg>`
    navigator.clipboard?.writeText(code)
    setCopiedId(icon.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F1116]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-modal-title"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-4xl bg-white rounded-[24px] shadow-2xl border border-[#E7E7EA] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="h-16 px-4 sm:px-6 border-b border-[#E7E7EA] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#7141E8]/10 text-[#7141E8] flex items-center justify-center shrink-0">
                  <Columns2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="compare-modal-title" className="text-sm font-bold text-[#0F1116] m-0">
                    Side-by-Side Icon Comparison
                  </h3>
                  <p className="text-[11px] text-[#8E8E93] m-0">
                    Comparing {icons.length} vector glyphs across optical sizes and source sets
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close comparison modal"
                className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comparison Columns */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className={cn(
                'grid gap-4',
                icons.length === 2 && 'grid-cols-1 sm:grid-cols-2',
                icons.length === 3 && 'grid-cols-1 sm:grid-cols-3',
                icons.length >= 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              )}>
                {icons.map((icon) => {
                  const IconComp = icon.component
                  const isCopied = copiedId === icon.id

                  return (
                    <div
                      key={icon.id}
                      className="flex flex-col p-5 rounded-[18px] bg-[#F7F7F8] border border-[#E7E7EA] gap-4"
                    >
                      {/* Big Preview at 48px */}
                      <div className="h-28 rounded-[14px] bg-white border border-[#E7E7EA] flex items-center justify-center relative shadow-2xs">
                        <IconComp
                          className="w-12 h-12 transition-all"
                          style={{ color: activeColor }}
                          strokeWidth={2}
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#8E8E93] bg-[#F7F7F8] px-1 rounded">
                          48px
                        </span>
                      </div>

                      {/* Optical Scales: 32px, 24px, 16px */}
                      <div className="flex items-center justify-around py-2 px-3 rounded-[12px] bg-white border border-[#E7E7EA]">
                        <div className="flex flex-col items-center gap-1">
                          <IconComp className="w-8 h-8" style={{ color: activeColor }} />
                          <span className="text-[9px] font-mono text-[#8E8E93]">32px</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <IconComp className="w-6 h-6" style={{ color: activeColor }} />
                          <span className="text-[9px] font-mono text-[#8E8E93]">24px</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <IconComp className="w-4 h-4" style={{ color: activeColor }} />
                          <span className="text-[9px] font-mono text-[#8E8E93]">16px</span>
                        </div>
                      </div>

                      {/* Info & Metadata */}
                      <div className="flex flex-col gap-1 text-left">
                        <h4 className="text-xs font-bold text-[#0F1116] truncate m-0">
                          {icon.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-[#8E8E93] pt-1">
                          <span>Source</span>
                          <span className="font-semibold text-[#0F1116]">{icon.source}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                          <span>Category</span>
                          <span>{icon.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                          <span>License</span>
                          <span className="font-mono">{icon.license}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                          <span>Popularity</span>
                          <span className="text-[#2EA45B] font-semibold">★ {icon.popularity}</span>
                        </div>
                      </div>

                      {/* Copy Action */}
                      <button
                        type="button"
                        onClick={() => handleCopySvg(icon)}
                        className="mt-auto w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] bg-white hover:bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-all shadow-2xs"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#2EA45B]" />
                            <span className="text-[#2EA45B]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />
                            <span>Copy SVG</span>
                          </>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
