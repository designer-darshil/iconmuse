import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  Compass,
  Layers,
  Sliders,
  FolderHeart,
  Bookmark,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import type { MobileDrawerProps } from '../../types'
import { MOCK_CATEGORIES } from '../../data/mockIcons'
import { cn } from '../../utils/cn'

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeNavId,
  onSelectNav,
  categories = MOCK_CATEGORIES,
  activeCategory,
  onSelectCategory,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
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
    const closeBtn = drawerRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close menu"]')
    closeBtn?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement.current?.focus?.()
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F1116]/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-in Navigation Sheet */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
            className="relative z-10 w-[84%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Top Navigation */}
            <div className="flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="h-14 px-4 border-b border-[#E7E7EA] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-[#0F1116]">Menu</span>
                  <span className="text-[11px] font-semibold text-[#7141E8] bg-[#7141E8]/10 px-2 py-0.5 rounded-full">
                    Iconora
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Rail Links */}
              <div className="p-3 flex flex-col gap-1">
                {[
                  { id: 'discover', label: 'Discover Icons', icon: Compass },
                  { id: 'categories', label: 'Categories', icon: Layers, badge: '13' },
                  { id: 'customizer', label: 'Customizer Lab', icon: Sliders },
                  { id: 'collections', label: 'Collections', icon: FolderHeart },
                  { id: 'saved', label: 'Saved Favorites', icon: Bookmark },
                  { id: 'history', label: 'Recently Used', icon: Clock },
                ].map((item) => {
                  const Icon = item.icon
                  const isActive = activeNavId === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectNav(item.id)
                        onClose()
                      }}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-[12px] text-xs font-medium transition-colors text-left',
                        isActive
                          ? 'bg-[#F7F7F8] text-[#7141E8] font-semibold'
                          : 'text-[#0F1116]/80 hover:bg-[#F7F7F8]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('w-4 h-4', isActive ? 'text-[#7141E8]' : 'text-[#8E8E93]')} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-[#7141E8] text-white px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Categories Preview */}
              <div className="px-4 py-2 border-t border-[#E7E7EA]/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
                  Browse Categories
                </span>
                <div className="flex flex-col gap-0.5 mt-2">
                  {categories.slice(0, 8).map((cat) => {
                    const isCatActive = activeCategory === cat.slug
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (onSelectCategory) {
                            onSelectCategory(cat.slug)
                          }
                          onClose()
                        }}
                        className={cn(
                          'flex items-center justify-between px-2.5 py-2 min-h-[40px] rounded-[8px] text-xs transition-colors text-left',
                          isCatActive
                            ? 'bg-[#7141E8]/10 text-[#7141E8] font-semibold'
                            : 'text-[#0F1116]/75 hover:text-[#0F1116] hover:bg-[#F7F7F8]'
                        )}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-[#8E8E93] font-mono">
                          {cat.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#E7E7EA] bg-[#F7F7F8] flex flex-col gap-2.5 shrink-0">
              <button
                type="button"
                className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#0F1116] text-white text-xs font-semibold shadow-xs hover:-translate-y-[1px] active:translate-y-0 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B89AFF]" />
                <span>Get Pro Access</span>
              </button>

              <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
                <a href="#docs" className="hover:text-[#0F1116] flex items-center gap-1 min-h-[44px] py-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Documentation</span>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0F1116] flex items-center gap-1 min-h-[44px] py-2"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
