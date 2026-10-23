import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Command,
  ChevronDown,
  X,
  Check,
} from 'lucide-react'
import type { CategoryItem } from '../../types'
import { cn } from '../../utils/cn'

export interface MainToolbarProps {
  categories: CategoryItem[]
  activeCategory: string
  onSelectCategory: (slug: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  activeColor: string
  onSelectColor: (color: string) => void
}

export const COLOR_OPTIONS = [
  { name: 'Default Ink', hex: '#0F1116' },
  { name: 'Violet Accent', hex: '#7141E8' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Slate Gray', hex: '#64748B' },
]

export const MainToolbar: React.FC<MainToolbarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeColor,
  onSelectColor,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isColorOpen, setIsColorOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory) || categories[0]

  // Global ⌘K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="w-full bg-white px-4 md:px-6 pt-5 pb-3 flex flex-col gap-3 select-none">
      {/* Desktop / Responsive row: Category + Search Input + Recolor */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* 1. Category Dropdown Pill */}
        <div className="relative shrink-0 hidden md:block">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="h-12 px-4 rounded-full bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] hover:border-[#D8D8DC] text-xs font-semibold text-[#0F1116] flex items-center gap-2 transition-all shadow-xs"
          >
            <span>Category: {activeCategoryObj?.name || 'All Icons'}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-[#8E8E93] transition-transform duration-150', isCategoryOpen && 'rotate-180')} />
          </button>

          {isCategoryOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-[#E7E7EA] rounded-[16px] shadow-xl py-2 z-50 max-h-72 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                Filter by Category
              </div>
              {categories.map((cat) => {
                const isSelected = cat.slug === activeCategory
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.slug)
                      setIsCategoryOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors',
                      isSelected
                        ? 'bg-[#F7F7F8] text-[#7141E8] font-semibold'
                        : 'text-[#0F1116] hover:bg-[#F7F7F8]'
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
          )}
        </div>

        {/* 2. Large Visually Elevated Search Input (16px radius, soft shadow) */}
        <div className="flex-1 relative">
          <div className="flex items-center w-full h-12 bg-white border border-[#E7E7EA] hover:border-[#D8D8DC] focus-within:border-[#7141E8] focus-within:ring-3 focus-within:ring-[#7141E8]/10 rounded-[16px] px-4 shadow-[0_4px_16px_rgba(15,17,22,0.06)] transition-all">
            <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-3" />

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 32,000+ icons…"
              className="flex-1 bg-transparent border-none outline-none focus-visible:outline-none! text-[13px] md:text-sm text-[#0F1116] placeholder-[#8E8E93] font-medium"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-colors mr-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Keyboard Shortcut Visual: ⌘ K */}
            <div className="hidden sm:flex items-center gap-1 shrink-0 ml-2">
              <kbd className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-[#8E8E93] bg-[#F7F7F8] border border-[#E7E7EA] rounded-[6px] shadow-2xs">
                <Command className="w-3 h-3" />
                <span>K</span>
              </kbd>
            </div>
          </div>
        </div>

        {/* 3. Recolor Dropdown with Circular Multicolor Mark (Desktop) */}
        <div className="relative shrink-0 hidden md:block">
          <button
            type="button"
            onClick={() => setIsColorOpen(!isColorOpen)}
            className="h-12 px-4 rounded-full bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] hover:border-[#D8D8DC] text-xs font-semibold text-[#0F1116] flex items-center gap-2 transition-all shadow-xs"
          >
            {/* Circular multicolor mark */}
            <span
              className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
              style={{
                background:
                  activeColor === '#0F1116'
                    ? 'conic-gradient(from 180deg at 50% 50%, #FF5F56 0deg, #FFBD2E 72deg, #27C93F 144deg, #7141E8 216deg, #007AFF 288deg, #FF5F56 360deg)'
                    : activeColor,
              }}
            />
            <span>Recolor</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-[#8E8E93] transition-transform duration-150', isColorOpen && 'rotate-180')} />
          </button>

          {isColorOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E7E7EA] rounded-[16px] shadow-xl py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                Workspace Palette
              </div>
              {COLOR_OPTIONS.map((c) => {
                const isSelected = activeColor === c.hex
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      onSelectColor(c.hex)
                      setIsColorOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors',
                      isSelected ? 'bg-[#F7F7F8] font-semibold' : 'hover:bg-[#F7F7F8]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[#0F1116]">{c.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#7141E8]" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Compact Toolbar Row: Category and Recolor */}
      <div className="flex md:hidden items-center justify-between gap-2 pt-1">
        {/* Mobile Category Dropdown */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full h-10 px-3 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] flex items-center justify-between"
          >
            <span className="truncate">Category: {activeCategoryObj?.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93] shrink-0 ml-1" />
          </button>

          {isCategoryOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-[#E7E7EA] rounded-[14px] shadow-xl py-2 z-50 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.slug)
                    setIsCategoryOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#0F1116] hover:bg-[#F7F7F8]"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-[#8E8E93]">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Recolor Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsColorOpen(!isColorOpen)}
            className="h-10 px-3 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] flex items-center gap-2"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
              style={{
                background:
                  activeColor === '#0F1116'
                    ? 'conic-gradient(from 180deg at 50% 50%, #FF5F56 0deg, #FFBD2E 72deg, #27C93F 144deg, #7141E8 216deg, #007AFF 288deg, #FF5F56 360deg)'
                    : activeColor,
              }}
            />
            <span>Color</span>
          </button>

          {isColorOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E7E7EA] rounded-[14px] shadow-xl py-2 z-50">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    onSelectColor(c.hex)
                    setIsColorOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#0F1116] hover:bg-[#F7F7F8]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
