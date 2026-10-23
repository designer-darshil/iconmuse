import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  SearchX,
  RotateCcw,
  Check,
  ChevronDown,
} from 'lucide-react'
import { IconTile } from './IconTile'
import type { IconItem, ViewDensity } from '../../types'
import { cn } from '../../utils/cn'

export interface IconGridProps {
  icons: IconItem[]
  isLoading?: boolean
  searchQuery: string
  activeColor: string
  iconSize?: number
  savedIconIds: string[]
  compareIconIds: string[]
  onToggleSave: (id: string) => void
  onToggleCompare: (id: string) => void
  onSelectIcon: (icon: IconItem) => void
  selectedIcon: IconItem | null
  onResetFilters: () => void
  viewDensity: ViewDensity
}

const BATCH_SIZE = 72

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  isLoading = false,
  searchQuery,
  activeColor,
  iconSize = 24,
  savedIconIds,
  compareIconIds,
  onToggleSave,
  onToggleCompare,
  onSelectIcon,
  selectedIcon,
  onResetFilters,
  viewDensity,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE)
  const shouldReduceMotion = useReducedMotion()

  // Reset pagination batch when filters or search change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE)
  }, [icons.length, searchQuery])

  const visibleIcons = icons.slice(0, visibleCount)
  const hasMore = visibleCount < icons.length

  const handleCopySvg = (icon: IconItem) => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${activeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${icon.id}"><desc>${icon.name} from ${icon.source}</desc></svg>`

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(svgCode).catch(() => {})
    }

    setToastMessage(`Copied SVG: ${icon.name}`)
    setTimeout(() => {
      setToastMessage(null)
    }, 2000)
  }

  // 1. Loading Skeletons State
  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full p-4 md:p-6 grid gap-3',
          viewDensity === 'normal'
            ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8'
            : 'grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10'
        )}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] flex flex-col items-center justify-between p-3 rounded-[14px] bg-[#F7F7F8]/50 animate-pulse"
          >
            <div className="w-8 h-8 rounded-full bg-[#E7E7EA] mt-2" />
            <div className="w-16 h-3 rounded bg-[#E7E7EA]" />
            <div className="w-10 h-3 rounded-full bg-[#E7E7EA]" />
          </div>
        ))}
      </div>
    )
  }

  // 2. Empty Search State
  if (icons.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[380px]">
        <div className="w-14 h-14 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center text-[#8E8E93] mb-4 shadow-subtle">
          <SearchX className="w-6 h-6 text-[#7141E8]" />
        </div>

        <h3 className="text-base md:text-lg font-semibold text-[#0F1116] mb-1">
          No matching icons found
        </h3>
        <p className="text-xs md:text-sm text-[#8E8E93] max-w-sm mb-6 leading-relaxed">
          {searchQuery
            ? `We couldn't find anything matching "${searchQuery}". Try selecting fewer filters or searching for broader terms.`
            : 'There are no icons matching the currently selected filters.'}
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1116] hover:bg-[#1E2028] text-white text-xs font-semibold transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset search & filters</span>
        </button>
      </div>
    )
  }

  // 3. Staggered reveal & layout animations
  // Stagger 30ms between items, subtle opacity + y translation only
  const tileVariants: { hidden: { opacity: number; y: number }; visible: (i: number) => { opacity: number; y: number; transition: { delay: number; duration: number; ease: 'easeOut' } } } = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : Math.min(i * 0.03, 0.45), // 30ms stagger, capped at 450ms
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: 'easeOut' as const,
      },
    }),
  }

  return (
    <div className="w-full p-4 md:p-6 pb-32 relative">
      <motion.div
        layout
        className={cn(
          'grid gap-x-3 gap-y-4',
          viewDensity === 'normal'
            ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8'
            : 'grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10'
        )}
      >
        <AnimatePresence mode="popLayout">
          {visibleIcons.map((icon, index) => (
            <motion.div
              layout
              key={icon.id}
              custom={index}
              variants={tileVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <IconTile
                icon={icon}
                activeColor={activeColor}
                isSaved={savedIconIds.includes(icon.id)}
                isCompared={compareIconIds.includes(icon.id)}
                onToggleSave={onToggleSave}
                onToggleCompare={onToggleCompare}
                onCopySvg={handleCopySvg}
                onSelectIcon={onSelectIcon}
                isSelected={selectedIcon?.id === icon.id}
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination / Virtual Batching abstraction for large sets */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center mt-10 mb-4 gap-2">
          <p className="text-xs text-[#8E8E93]">
            Showing {visibleIcons.length} of {icons.length} glyphs
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
          >
            <span>Load more icons</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        </div>
      )}

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F1116] text-white text-xs font-semibold shadow-2xl border border-white/10"
            role="status"
            aria-live="polite"
          >
            <div className="w-4 h-4 rounded-full bg-[#2EA45B] flex items-center justify-center text-white shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
