import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Columns2,
  X,
} from 'lucide-react'
import { MOCK_ICONS } from '../../data/mockIcons'

export interface CompareTrayProps {
  compareIconIds: string[]
  onRemoveCompare: (id: string) => void
  onClearCompare: () => void
  onOpenCompareModal: () => void
  activeColor?: string
}

export const CompareTray: React.FC<CompareTrayProps> = ({
  compareIconIds,
  onRemoveCompare,
  onClearCompare,
  onOpenCompareModal,
  activeColor = '#0F1116',
}) => {
  const shouldReduceMotion = useReducedMotion()
  const isVisible = compareIconIds.length >= 2
  const selectedIcons = MOCK_ICONS.filter((icon) => compareIconIds.includes(icon.id))

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-[#0F1116] text-white p-3 md:px-5 md:py-3.5 rounded-[20px] shadow-[0_16px_40px_rgba(15,17,22,0.32)] border border-white/10 flex items-center justify-between gap-4 select-none"
        >
          {/* Left: Selected Icons with Source Labels & Remove controls */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
            {selectedIcons.map((icon) => {
              const IconComp = icon.component
              return (
                <div
                  key={icon.id}
                  className="group relative flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full bg-white/10 border border-white/10 hover:border-white/20 transition-all shrink-0"
                >
                  <IconComp className="w-4 h-4 text-white" style={{ color: activeColor === '#0F1116' ? '#FFFFFF' : activeColor }} />

                  <span className="text-xs font-medium text-white/90 max-w-[80px] sm:max-w-[100px] truncate">
                    {icon.name}
                  </span>

                  <span className="text-[9px] font-mono text-[#B89AFF] bg-[#7141E8]/30 px-1 py-0.2 rounded-full">
                    {icon.source.slice(0, 3)}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemoveCompare(icon.id)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                    title={`Remove ${icon.name}`}
                    aria-label={`Remove ${icon.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}

            {selectedIcons.length < 4 && (
              <span className="text-[11px] text-white/40 hidden sm:inline whitespace-nowrap pl-1">
                + Add up to {4 - selectedIcons.length} more
              </span>
            )}
          </div>

          {/* Right: Clear All & Compare Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClearCompare}
              className="text-xs font-medium text-white/60 hover:text-white transition-colors px-2 py-1 rounded-md"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onOpenCompareModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7141E8] hover:bg-[#6031D4] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Compare ({selectedIcons.length})</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
