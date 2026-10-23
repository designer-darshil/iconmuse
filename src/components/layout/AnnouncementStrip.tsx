import React, { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import type { AnnouncementStripProps } from '../../types'

export const AnnouncementStrip: React.FC<AnnouncementStripProps> = ({
  message = 'The Iconora beta is live — discover thousands of icons in one workspace.',
  actionText = 'Sign in',
  actionHref = '#signin',
  onDismiss,
  showDismiss = true,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <aside
      className="announcement-strip select-none"
      aria-label="Product announcement"
      role="banner"
    >
      <div className="relative z-10 flex items-center justify-center gap-2 text-center px-4 w-full max-w-7xl mx-auto">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7141E8]/25 text-[#B89AFF] shrink-0">
          <Sparkles className="w-3 h-3" />
        </span>

        <p className="text-[13px] md:text-sm font-medium tracking-tight text-white/95 truncate">
          <span>{message}</span>
          <a
            href={actionHref}
            className="strip-link group inline-flex items-center ml-1.5 focus:outline-none focus:ring-1 focus:ring-[#7141E8] rounded-sm"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </p>

        {showDismiss && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors duration-150 rounded-md hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  )
}
