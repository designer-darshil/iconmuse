import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Command,
  ChevronDown,
  X,
  Check,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { Input } from '../ui/input'
import { ICON_TOPICS } from '../../data/iconTopics'

export interface MainToolbarProps {
  activeCategory: string
  activeTopic: string | null
  onSelectCategory: (category: string) => void
  onSelectTopic: (topic: string | null) => void
  topicCounts: Record<string, number>
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
  activeCategory,
  activeTopic,
  onSelectCategory,
  onSelectTopic,
  topicCounts,
  searchQuery,
  onSearchChange,
  activeColor,
  onSelectColor,
}) => {
  const [isTopicOpen, setIsTopicOpen] = useState(false)
  const [isColorOpen, setIsColorOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isIllustrationView = activeCategory === 'illustrations'
  const selectedTopic = ICON_TOPICS.find((topic) => topic.id === activeTopic)
  const categoryLabel = isIllustrationView ? 'All Illustrations' : selectedTopic?.label ?? 'All Icons'

  const renderTopicOptions = () => (
    <>
      {isIllustrationView ? (
        <button
          type="button"
          aria-pressed="true"
          onClick={() => { onSelectCategory('illustrations'); setIsTopicOpen(false) }}
          className="flex min-h-10 w-full items-center justify-between gap-3 bg-[var(--selection-soft)] px-3 text-left text-sm font-semibold text-[var(--accent-text)]"
        >
          <span>All Illustrations</span>
          <span className="text-xs tabular-nums text-[#8E8E93]">{(topicCounts.illustrations ?? 0).toLocaleString()}</span>
        </button>
      ) : (
        <>
          <button
            type="button"
            aria-pressed={activeTopic === null}
            onClick={() => { onSelectTopic(null); setIsTopicOpen(false) }}
            className={cn('flex min-h-10 w-full items-center justify-between gap-3 px-3 text-left text-sm transition-colors', activeTopic === null ? 'bg-[var(--selection-soft)] font-semibold text-[var(--accent-text)]' : 'text-[#303038] hover:bg-[#F7F7F8]')}
          >
            <span>All Icons</span>
            <span className="text-xs tabular-nums text-[#8E8E93]">{(topicCounts.all ?? 0).toLocaleString()}</span>
          </button>
          {ICON_TOPICS.map((topic) => {
            const count = topicCounts[topic.id] ?? 0
            if (!count) return null
            const selected = activeTopic === topic.id
            return (
              <button
                key={topic.id}
                type="button"
                aria-pressed={selected}
                onClick={() => { onSelectTopic(selected ? null : topic.id); setIsTopicOpen(false) }}
                className={cn('flex min-h-10 w-full items-center justify-between gap-3 px-3 text-left text-sm transition-colors', selected ? 'bg-[var(--selection-soft)] font-semibold text-[var(--accent-text)]' : 'text-[#303038] hover:bg-[#F7F7F8]')}
              >
                <span>{topic.label}</span>
                <span className="text-xs tabular-nums text-[#8E8E93]">{count.toLocaleString()}</span>
              </button>
            )
          })}
        </>
      )}
    </>
  )

  const renderMobileTopicChips = () => (
    <nav className="mobile-category-chips" aria-label="Icon categories">
      {isIllustrationView ? (
        <button type="button" aria-pressed="true" onClick={() => onSelectCategory('illustrations')} className="mobile-category-chip is-active">
          All illustrations
        </button>
      ) : (
        <>
          <button type="button" aria-pressed={activeTopic === null} onClick={() => onSelectTopic(null)} className={cn('mobile-category-chip', activeTopic === null && 'is-active')}>
            All icons
          </button>
          {ICON_TOPICS.map((topic) => {
            if (!(topicCounts[topic.id] ?? 0)) return null
            const selected = activeTopic === topic.id
            return <button key={topic.id} type="button" aria-pressed={selected} onClick={() => onSelectTopic(selected ? null : topic.id)} className={cn('mobile-category-chip', selected && 'is-active')}>{topic.label}</button>
          })}
        </>
      )}
    </nav>
  )

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

  useEffect(() => {
    if (!isColorOpen && !isTopicOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const isInsideTopic = Array.from(
        document.querySelectorAll('[data-iconmuse-menu="topic"]'),
      ).some((menu) => menu.contains(target))
      const isInsideColor = Array.from(
        document.querySelectorAll('[data-iconmuse-menu="color"]'),
      ).some((menu) => menu.contains(target))

      if (!isInsideTopic) setIsTopicOpen(false)
      if (!isInsideColor) setIsColorOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isColorOpen, isTopicOpen])

  return (
      <div className="main-toolbar w-full shrink-0 bg-white px-3 md:px-6 pt-3 md:pt-5 pb-2 md:pb-3 flex flex-col gap-2 md:gap-3 select-none">
      {/* Desktop / Responsive row: Search Input + Recolor */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative hidden shrink-0 md:block" data-iconmuse-menu="topic">
          <button type="button" aria-expanded={isTopicOpen} onClick={() => { setIsTopicOpen((open) => !open); setIsColorOpen(false) }} className="flex h-12 min-w-[156px] items-center justify-between gap-3 rounded-full border border-[#E7E7EA] bg-[#F7F7F8] px-4 text-xs font-semibold text-[#0F1116] shadow-xs transition-colors hover:bg-[#F1F1F3]">
            <span className="max-w-48 truncate">{categoryLabel}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-[#8E8E93] transition-transform', isTopicOpen && 'rotate-180')} />
          </button>
          {isTopicOpen && <div className="absolute left-0 z-50 mt-2 max-h-[min(70vh,34rem)] w-64 overflow-y-auto rounded-2xl border border-[#E7E7EA] bg-white py-2 shadow-xl"><div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93]">Browse by category</div>{renderTopicOptions()}</div>}
        </div>
        {/* 2. Large Visually Elevated Search Input (16px radius, soft shadow) */}
        <div className="flex-1 relative">
          <div className="flex items-center w-full h-12 bg-white border border-[#E7E7EA] hover:border-[#D8D8DC] focus-within:border-[#7141E8] focus-within:ring-3 focus-within:ring-[#7141E8]/10 rounded-[16px] px-4 shadow-[0_4px_16px_rgba(15,17,22,0.06)] transition-all">
            <Search className="w-4 h-4 text-[#8E8E93] shrink-0 mr-3" />

            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search icons by name, source, or tag…"
              className="h-auto min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-[13px] font-medium text-[#0F1116] shadow-none placeholder:text-[#8E8E93] focus-visible:!ring-0 focus-visible:!outline-none focus-visible:!ring-offset-0 md:text-sm"
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
        <div className="relative shrink-0 hidden md:block" data-iconmuse-menu="color">
          <button
            type="button"
            onClick={() => {
              setIsColorOpen((isOpen) => !isOpen)
            }}
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
                    aria-pressed={isSelected}
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

      <div className="md:hidden">{renderMobileTopicChips()}</div>
    </div>
  )
}
