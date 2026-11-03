import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Command,
  X,
  RotateCcw,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownTriggerButton,
  DropdownItem,
  DropdownSectionLabel,
  DropdownSeparator,
} from '../ui/dropdown'
import { ICON_TOPICS } from '../../data/iconTopics'
import { ProviderLogo } from '../common/ProviderLogo'

export interface MainToolbarProps {
  activeCategory: string
  activeTopic: string | null
  onSelectCategory: (category: string) => void
  onSelectTopic: (topic: string | null) => void
  topicCounts: Record<string, number>
  sourceCounts?: Record<string, number>
  selectedSources?: string[]
  onToggleSource?: (source: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  activeColor: string
  onSelectColor: (color: string) => void
}

const ILLUSTRATION_SOURCES = new Set([
  'Open Doodles',
  'Open Peeps',
  'Fluent Emoji',
  'Flowbite Illustrations',
  'Bioicons',
])

export const COLOR_OPTIONS = [
  { name: 'Default', hex: '#0F1116' },
  { name: 'Violet', hex: '#7141E8' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#D97706' },
  { name: 'Slate', hex: '#64748B' },
]

export const MainToolbar: React.FC<MainToolbarProps> = ({
  activeCategory,
  activeTopic,
  onSelectCategory,
  onSelectTopic,
  topicCounts,
  sourceCounts = {},
  selectedSources = [],
  onToggleSource,
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

  const primarySource = selectedSources[0] ?? null
  const sourceLabel =
    selectedSources.length === 1
      ? selectedSources[0]
      : selectedSources.length > 1
        ? `${selectedSources[0]} +${selectedSources.length - 1}`
        : null

  const categoryLabel = sourceLabel
    ? selectedTopic
      ? `${sourceLabel} · ${selectedTopic.label}`
      : sourceLabel
    : isIllustrationView
      ? 'All Illustrations'
      : selectedTopic?.label ?? 'All Icons'

  const libraries = Object.entries(sourceCounts)
    .filter(
      ([source, count]) =>
        count > 0 &&
        (ILLUSTRATION_SOURCES.has(source) === isIllustrationView ||
          selectedSources.includes(source)),
    )
    .sort(([a], [b]) => {
      const aSelected = selectedSources.includes(a)
      const bSelected = selectedSources.includes(b)
      if (aSelected !== bSelected) return aSelected ? -1 : 1
      return a.localeCompare(b)
    })

  const isAllSelected = activeTopic === null && selectedSources.length === 0
  const activeColorObj =
    COLOR_OPTIONS.find((c) => c.hex.toLowerCase() === activeColor.toLowerCase()) ??
    COLOR_OPTIONS[0]

  const renderTopicOptions = () => (
    <>
      <div className="flex items-center justify-between px-2.5 pt-1 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#8E8E93]">
          Scope
        </span>
        {!isAllSelected && (
          <button
            type="button"
            onClick={() => {
              onSelectTopic(null)
              if (onToggleSource && selectedSources.length > 0) {
                selectedSources.forEach((s) => onToggleSource(s))
              }
              setIsTopicOpen(false)
            }}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7141E8] hover:underline"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Reset
          </button>
        )}
      </div>

      {isIllustrationView ? (
        <DropdownItem
          selected={isAllSelected}
          meta={(topicCounts.illustrations ?? 0).toLocaleString()}
          onClick={() => {
            onSelectCategory('illustrations')
            setIsTopicOpen(false)
          }}
        >
          All Illustrations
        </DropdownItem>
      ) : (
        <DropdownItem
          selected={isAllSelected}
          meta={(topicCounts.all ?? 0).toLocaleString()}
          onClick={() => {
            onSelectTopic(null)
            setIsTopicOpen(false)
          }}
        >
          All Icons
        </DropdownItem>
      )}

      {libraries.length > 0 && onToggleSource && (
        <>
          <DropdownSeparator />
          <DropdownSectionLabel>Libraries</DropdownSectionLabel>
          {libraries.map(([source, count]) => {
            const selected = selectedSources.includes(source)
            return (
              <DropdownItem
                key={source}
                selected={selected}
                icon={
                  <ProviderLogo
                    source={source}
                    className="size-6 shrink-0 rounded-md"
                    size={14}
                  />
                }
                meta={count.toLocaleString()}
                onClick={() => {
                  onToggleSource(source)
                  setIsTopicOpen(false)
                }}
              >
                {source}
              </DropdownItem>
            )
          })}
        </>
      )}

      {!isIllustrationView && (
        <>
          <DropdownSeparator />
          <DropdownSectionLabel>Categories</DropdownSectionLabel>
          {ICON_TOPICS.map((topic) => {
            const count = topicCounts[topic.id] ?? 0
            if (!count) return null
            const selected = activeTopic === topic.id
            return (
              <DropdownItem
                key={topic.id}
                selected={selected}
                meta={count.toLocaleString()}
                onClick={() => {
                  onSelectTopic(selected ? null : topic.id)
                  setIsTopicOpen(false)
                }}
              >
                {topic.label}
              </DropdownItem>
            )
          })}
        </>
      )}
    </>
  )

  const renderMobileTopicChips = () => (
    <nav className="mobile-category-chips" aria-label="Icon categories">
      {isIllustrationView ? (
        <button
          type="button"
          aria-pressed={isAllSelected}
          onClick={() => onSelectCategory('illustrations')}
          className={cn('mobile-category-chip', isAllSelected && 'is-active')}
        >
          All illustrations
        </button>
      ) : (
        <button
          type="button"
          aria-pressed={isAllSelected}
          onClick={() => onSelectTopic(null)}
          className={cn('mobile-category-chip', isAllSelected && 'is-active')}
        >
          All icons
        </button>
      )}
      {onToggleSource &&
        selectedSources.map((source) => (
          <button
            key={source}
            type="button"
            aria-pressed="true"
            onClick={() => onToggleSource(source)}
            className="mobile-category-chip is-active"
          >
            {source}
          </button>
        ))}
      {!isIllustrationView &&
        ICON_TOPICS.map((topic) => {
          if (!(topicCounts[topic.id] ?? 0)) return null
          const selected = activeTopic === topic.id
          return (
            <button
              key={topic.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectTopic(selected ? null : topic.id)}
              className={cn('mobile-category-chip', selected && 'is-active')}
            >
              {topic.label}
            </button>
          )
        })}
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

  return (
    <div className="main-toolbar w-full shrink-0 bg-white px-3 md:px-6 pt-3 md:pt-5 pb-2 md:pb-3 flex flex-col gap-2 md:gap-3 select-none">
      {/* Desktop / Responsive row: Category Dropdown + Search Input + Recolor Dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <DropdownMenu
          isOpen={isTopicOpen}
          onClose={() => setIsTopicOpen(false)}
          align="left"
          widthClassName="w-68"
          dataMenuId="topic"
          ariaLabel="Filter by library or category"
          containerClassName="hidden shrink-0 md:block"
          trigger={
            <DropdownTriggerButton
              isOpen={isTopicOpen}
              size="lg"
              variant="pill"
              onClick={() => {
                setIsTopicOpen((open) => !open)
                setIsColorOpen(false)
              }}
              leftSlot={
                primarySource ? (
                  <ProviderLogo
                    source={primarySource}
                    className="size-5 shrink-0 rounded"
                    size={12}
                  />
                ) : undefined
              }
              className="min-w-[162px] max-w-[240px]"
            >
              {categoryLabel}
            </DropdownTriggerButton>
          }
        >
          {renderTopicOptions()}
        </DropdownMenu>

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
        <DropdownMenu
          isOpen={isColorOpen}
          onClose={() => setIsColorOpen(false)}
          align="right"
          widthClassName="w-54"
          dataMenuId="color"
          ariaLabel="Recolor icons"
          containerClassName="hidden shrink-0 md:block"
          trigger={
            <DropdownTriggerButton
              isOpen={isColorOpen}
              size="lg"
              variant="pill"
              onClick={() => {
                setIsColorOpen((open) => !open)
                setIsTopicOpen(false)
              }}
              leftSlot={
                <span
                  className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                  style={{
                    background:
                      activeColor === '#0F1116' || activeColor === '#F4F4F5'
                        ? 'conic-gradient(from 180deg at 50% 50%, #FF5F56 0deg, #FFBD2E 72deg, #27C93F 144deg, #7141E8 216deg, #007AFF 288deg, #FF5F56 360deg)'
                        : activeColor,
                  }}
                />
              }
            >
              {activeColorObj.name === 'Default' ? 'Recolor' : activeColorObj.name}
            </DropdownTriggerButton>
          }
        >
          <DropdownSectionLabel>Icon Color Preset</DropdownSectionLabel>
          {COLOR_OPTIONS.map((c) => {
            const isSelected =
              activeColor.toLowerCase() === c.hex.toLowerCase() ||
              (c.name === 'Default' && activeColor === '#F4F4F5')
            return (
              <DropdownItem
                key={c.name}
                selected={isSelected}
                icon={
                  <span
                    className="block w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                }
                meta={<span className="font-mono text-[10px] uppercase">{c.hex}</span>}
                onClick={() => {
                  onSelectColor(c.hex)
                  setIsColorOpen(false)
                }}
              >
                {c.name}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </div>

      <div className="md:hidden">{renderMobileTopicChips()}</div>
    </div>
  )
}
