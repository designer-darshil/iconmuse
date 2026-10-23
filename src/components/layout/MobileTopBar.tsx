import React from 'react'
import { Menu, Search, SlidersHorizontal } from 'lucide-react'
import type { MobileTopBarProps } from '../../types'

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onOpenMobileDrawer,
  onOpenSidebar,
  onFocusSearch,
}) => {
  return (
    <header className="h-14 px-4 bg-white border-b border-[#E7E7EA] flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Logo & Wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[8px] bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center shadow-2xs">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.5 19L11 5" stroke="#7141E8" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M10 20L16.5 6" stroke="#0F1116" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M15.5 20.5L20.5 10" stroke="#0F1116" strokeWidth="2.8" strokeLinecap="round" opacity="0.35" />
          </svg>
        </div>

        <span className="font-bold text-base tracking-tight text-[#0F1116] lowercase">
          iconora
        </span>
        <span className="text-[10px] font-bold text-[#7141E8] bg-[#7141E8]/10 px-1.5 py-0.2 rounded-full uppercase">
          Beta
        </span>
      </div>

      {/* Mobile Actions: Search Trigger, Filter Trigger, Menu Button */}
      <div className="flex items-center gap-1">
        {/* Search Trigger */}
        <button
          type="button"
          onClick={onFocusSearch}
          aria-label="Search icons"
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#0F1116] hover:bg-[#F7F7F8] transition-colors"
        >
          <Search className="w-4 h-4 text-[#8E8E93]" />
        </button>

        {/* Filter Trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open inspector and filters"
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#0F1116] hover:bg-[#F7F7F8] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#8E8E93]" />
        </button>

        {/* Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#0F1116] hover:bg-[#F7F7F8] transition-colors"
        >
          <Menu className="w-5 h-5 text-[#0F1116]" />
        </button>
      </div>
    </header>
  )
}
