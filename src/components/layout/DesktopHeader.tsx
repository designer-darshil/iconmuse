import React, { useState } from 'react'
import {
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  Check,
} from 'lucide-react'
import type { DesktopHeaderProps } from '../../types'

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen = true,
  totalIconsCount = 96,
}) => {
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState('All Libraries')

  const libraries = [
    { name: 'All Libraries', count: totalIconsCount },
    { name: 'Lucide Icons', count: 24 },
    { name: 'Phosphor Icons', count: 20 },
    { name: 'Tabler Icons', count: 20 },
    { name: 'Heroicons', count: 18 },
    { name: 'Simple Icons', count: 14 },
  ]

  return (
    <header className="desktop-header select-none">
      {/* Left: 3-Stroke Iconora Logo, Wordmark, Beta Pill, Community, Release Notes */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2.5 group">
          {/* Abstract 3-Stroke Iconora Logo */}
          <div className="w-8 h-8 rounded-[10px] bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stroke 1 (Purple accent) */}
              <path d="M4.5 19L11 5" stroke="#7141E8" strokeWidth="2.8" strokeLinecap="round" />
              {/* Stroke 2 (Solid Ink) */}
              <path d="M10 20L16.5 6" stroke="#0F1116" strokeWidth="2.8" strokeLinecap="round" />
              {/* Stroke 3 (Soft Muted Ink) */}
              <path d="M15.5 20.5L20.5 10" stroke="#0F1116" strokeWidth="2.8" strokeLinecap="round" opacity="0.35" />
            </svg>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-bold text-[18px] tracking-tight text-[#0F1116] lowercase font-sans">
              iconora
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7141E8] bg-[#7141E8]/10 px-1.5 py-0.5 rounded-full border border-[#7141E8]/20">
              Beta
            </span>
          </div>
        </a>

        {/* Links hidden first on Tablet (< 1280px) */}
        <div className="hidden xl:flex items-center h-4 w-[1px] bg-[#E7E7EA] mx-1" />

        <nav className="hidden xl:flex items-center gap-1">
          <a
            href="#community"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#F7F7F8] text-[13px] font-medium text-[#0F1116]/80 hover:text-[#0F1116] transition-colors"
          >
            <span>Community</span>
            <span className="text-[10px] font-bold text-[#854D0E] bg-[#FEF08A] px-1.5 py-0.2 rounded-full border border-[#FDE047]">
              New
            </span>
          </a>

          <a
            href="#release-notes"
            className="px-3 py-1.5 rounded-full hover:bg-[#F7F7F8] text-[13px] font-medium text-[#0F1116]/80 hover:text-[#0F1116] transition-colors"
          >
            Release Notes
          </a>
        </nav>
      </div>

      {/* Right: Stacked Source Avatars, "Icon Library" Dropdown, Avatar, Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Small Stacked Source Avatars */}
        <div
          className="hidden sm:flex items-center pl-2 pr-1 py-1 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] cursor-pointer hover:border-[#D8D8DC] transition-colors"
          title="Aggregated from 5 major open-source icon sets"
        >
          <div className="flex -space-x-1.5 overflow-hidden">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EDE9FE] text-[#7141E8] font-bold text-[9px] ring-2 ring-white">
              Lu
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-[9px] ring-2 ring-white">
              Ph
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[9px] ring-2 ring-white">
              Tb
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FEF3C7] text-[#B45309] font-bold text-[9px] ring-2 ring-white">
              Hi
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F1F1F3] text-[#0F1116] font-bold text-[9px] ring-2 ring-white">
              Si
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#8E8E93] ml-2 pr-1">
            5 Sets
          </span>
        </div>

        {/* "Icon Library" Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLibraryMenuOpen(!isLibraryMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-colors shadow-2xs"
          >
            <span>{selectedLibrary}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>

          {isLibraryMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E7E7EA] rounded-[14px] shadow-lg py-1.5 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                Select Library
              </div>
              {libraries.map((lib) => (
                <button
                  key={lib.name}
                  type="button"
                  onClick={() => {
                    setSelectedLibrary(lib.name)
                    setIsLibraryMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#0F1116] hover:bg-[#F7F7F8] text-left transition-colors"
                >
                  <span className={selectedLibrary === lib.name ? 'font-semibold text-[#7141E8]' : ''}>
                    {lib.name}
                  </span>
                  {selectedLibrary === lib.name && (
                    <Check className="w-3.5 h-3.5 text-[#7141E8]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Circular User/Avatar Button */}
        <button
          type="button"
          aria-label="User account profile"
          className="w-8 h-8 rounded-full bg-[#0F1116] text-white flex items-center justify-center text-xs font-bold ring-2 ring-transparent hover:ring-[#7141E8]/40 transition-all shadow-xs"
        >
          JD
        </button>

        {/* Toggle Right Inspector Sidebar Button on tablet / desktop */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse inspector panel' : 'Expand inspector panel'}
            title={isSidebarOpen ? 'Collapse inspector' : 'Open inspector'}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#E7E7EA] hover:bg-[#F7F7F8] text-[#0F1116] transition-colors"
          >
            {isSidebarOpen ? (
              <PanelRightClose className="w-4 h-4 text-[#8E8E93] hover:text-[#0F1116]" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-[#8E8E93] hover:text-[#0F1116]" />
            )}
          </button>
        )}
      </div>
    </header>
  )
}
