import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Copy,
  Bookmark,
  Columns2,
  Check,
} from 'lucide-react'
import type { IconItem } from '../../types'
import { cn } from '../../utils/cn'

export interface IconTileProps {
  icon: IconItem
  activeColor: string
  isSaved: boolean
  isCompared: boolean
  onToggleSave: (id: string) => void
  onToggleCompare: (id: string) => void
  onCopySvg: (icon: IconItem) => void
  onSelectIcon: (icon: IconItem) => void
  isSelected: boolean
  index?: number
}

export const IconTile: React.FC<IconTileProps> = ({
  icon,
  activeColor,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onCopySvg,
  onSelectIcon,
  isSelected,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const IconComponent = icon.component

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopySvg(icon)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 1400)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSave(icon.id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleCompare(icon.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectIcon(icon)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectIcon(icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={`${icon.name} icon from ${icon.source}`}
      className={cn(
        'group relative flex flex-col items-center justify-between h-[120px] p-2.5 rounded-[14px] cursor-pointer select-none transition-colors duration-150',
        // Generous white space: icons float directly on the canvas without boxy card borders
        'bg-transparent hover:bg-[#F7F7F8]/80 focus-visible:bg-[#F7F7F8]',
        isSelected && 'bg-[#F7F7F8] ring-1 ring-[#7141E8]/40'
      )}
    >
      {/* Centered Icon Preview */}
      <div className="flex-1 flex items-center justify-center w-full pt-1">
        <IconComponent
          className="w-7 h-7 transition-transform duration-150 group-hover:scale-105"
          style={{ color: activeColor }}
          strokeWidth={icon.strokeWidth || 1.8}
        />
      </div>

      {/* Ellipsized Name */}
      <div className="w-full text-center px-1">
        <p className="text-[12px] font-medium text-[#0F1116] truncate leading-tight">
          {icon.name}
        </p>
      </div>

      {/* Small Neutral Source Pill */}
      <div className="mt-1">
        <span className="text-[10px] font-medium text-[#8E8E93] bg-[#F7F7F8] border border-[#E7E7EA] px-2 py-0.5 rounded-full transition-colors group-hover:border-[#D8D8DC]">
          {icon.source}
        </span>
      </div>

      {/* Hover Quick-Action Layer: fade in softly with 1px hover lift */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 2 }}
            transition={{ duration: 0.12 }}
            className="absolute inset-x-2 -bottom-2 z-20 flex items-center justify-center gap-1 p-1 bg-[#0F1116] text-white rounded-full shadow-[0_4px_16px_rgba(15,17,22,0.18)]"
          >
            {/* Copy SVG Action */}
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'p-1.5 rounded-full hover:bg-white/20 transition-all hover:-translate-y-[1px] active:translate-y-0',
                hasCopied && 'text-[#2EA45B]'
              )}
              title="Copy SVG"
              aria-label={`Copy SVG code for ${icon.name}`}
            >
              {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Save / Favorite Action */}
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                'p-1.5 rounded-full hover:bg-white/20 transition-all hover:-translate-y-[1px] active:translate-y-0',
                isSaved ? 'text-[#B89AFF]' : 'text-white/80'
              )}
              title={isSaved ? 'Remove from Saved' : 'Save icon'}
              aria-label={isSaved ? `Remove ${icon.name} from saved` : `Save ${icon.name}`}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isSaved && 'fill-current')} />
            </button>

            {/* Add to Compare Action */}
            <button
              type="button"
              onClick={handleCompare}
              className={cn(
                'p-1.5 rounded-full hover:bg-white/20 transition-all hover:-translate-y-[1px] active:translate-y-0',
                isCompared ? 'text-[#2EA45B]' : 'text-white/80'
              )}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
              aria-label={isCompared ? `Remove ${icon.name} from compare` : `Add ${icon.name} to compare`}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
