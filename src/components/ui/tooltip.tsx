import React, { useState } from 'react'
import { cn } from '../../utils/cn'

export interface TooltipProps {
  content: React.ReactNode
  shortcut?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
  className?: string
}

const sidePositionClasses: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  side = 'top',
  children,
  className,
}) => {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 inline-flex items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-white/12 bg-[#0F1116] px-2.5 py-1 text-[11px] font-medium text-white shadow-lg',
            sidePositionClasses[side],
            className,
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="rounded bg-white/15 px-1 py-0.2 font-mono text-[10px] font-semibold text-white/90">
              {shortcut}
            </kbd>
          )}
        </span>
      )}
    </span>
  )
}
