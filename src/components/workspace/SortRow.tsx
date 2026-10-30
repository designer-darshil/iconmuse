import React from 'react'
import {
  Grid3X3,
  LayoutGrid,
  Columns2,
  ArrowDownAZ,
  ChevronDown,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import type { SortOption, ViewDensity } from '../../types'
import { cn } from '../../utils/cn'

export interface SortRowProps {
  totalCount: number
  activeSort: SortOption
  onSelectSort: (sort: SortOption) => void
  compareCount: number
  onClearCompare?: () => void
  onOpenCompare?: () => void
  onOpenFilters?: () => void
  viewDensity: ViewDensity
  onChangeViewDensity: (density: ViewDensity) => void
}

export const SortRow: React.FC<SortRowProps> = ({
  totalCount,
  activeSort,
  onSelectSort,
  compareCount,
  onClearCompare,
  onOpenCompare,
  onOpenFilters,
  viewDensity,
  onChangeViewDensity,
}) => {
  const tabs: { id: SortOption; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'name-asc', label: 'Name A–Z' },
    { id: 'name-desc', label: 'Name Z–A' },
  ]

  return (
    <div className="mobile-sort-row w-full shrink-0 bg-white border-b border-[#E7E7EA] px-3 md:px-6 flex items-center justify-between gap-4 select-none">
      {/* Horizontally scrollable tabs list on mobile */}
      <div className="desktop-sort-controls flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1">
        {tabs.map((tab) => {
          const isActive = activeSort === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              aria-label={tab.id === 'all' ? `All ${totalCount} icons` : tab.label}
              onClick={() => onSelectSort(tab.id)}
              className={cn(
                'flex h-[48px] flex-none items-center justify-center gap-2 border-b-2 px-3 text-xs tracking-tight whitespace-nowrap transition-colors',
                tab.id === 'all' ? 'w-[88px]' : 'w-[96px]',
                isActive
                  ? 'border-[#0F1116] font-semibold text-[#0F1116]'
                  : 'border-transparent font-medium text-[#8E8E93] hover:text-[#0F1116]'
              )}
            >
              <span>{tab.label}</span>
              {/* Keep the count slot on All at all times so tabs never reflow. */}
              {tab.id === 'all' && (
                <span className={cn(
                  'min-w-4 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none tabular-nums',
                  isActive ? 'bg-[#0F1116] text-white' : 'bg-[#F1F1F3] text-[#6B6B73]'
                )}>
                  {totalCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right side: Compare button with selection count & detailed/compact view toggle */}
      <div className="desktop-sort-actions flex items-center gap-2 shrink-0 py-2">
        {/* Compare Button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onOpenCompare}
            disabled={compareCount < 2}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
              compareCount > 0
                ? 'bg-[#7141E8] text-white border-[#7141E8] shadow-xs hover:bg-[#6031D4]'
                : 'bg-[#F7F7F8] text-[#8E8E93] border-[#E7E7EA] hover:text-[#0F1116]'
            )}
            title={compareCount > 0 ? `${compareCount} icons selected for comparison` : 'Select icons to compare'}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Compare ({compareCount})</span>
          </button>

          {compareCount > 0 && onClearCompare && (
            <button
              type="button"
              onClick={onClearCompare}
              className="p-1 text-[#8E8E93] hover:text-[#0F1116] rounded-full ml-1"
              title="Clear comparison"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Detailed / Compact View Toggle */}
        <div className="flex items-center bg-[#F7F7F8] p-1 rounded-full border border-[#E7E7EA]">
          <button
            type="button"
            onClick={() => onChangeViewDensity('normal')}
            aria-label="Normal view"
            title="Spacious grid view"
            className={cn(
              'p-1.5 rounded-full transition-colors',
              viewDensity === 'normal'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeViewDensity('compact')}
            aria-label="Compact view"
            title="Dense grid view"
            className={cn(
              'p-1.5 rounded-full transition-colors',
              viewDensity === 'compact'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mobile-sort-controls" aria-label="Result controls">
        <span className="mobile-result-count"><strong>{totalCount.toLocaleString()}</strong> results</span>
        <div className="mobile-sort-select-wrap">
          <ArrowDownAZ className="mobile-sort-select-icon" aria-hidden="true" />
          <label className="sr-only" htmlFor="mobile-sort-select">Sort results</label>
          <select
            id="mobile-sort-select"
            value={activeSort}
            onChange={(event) => onSelectSort(event.target.value as SortOption)}
            className="mobile-sort-select"
          >
            <option value="all">Default</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
          <ChevronDown className="mobile-sort-select-chevron" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onOpenFilters} aria-label="Open filters" className="mobile-sort-filter-button">
            <SlidersHorizontal aria-hidden="true" />
            <span>Filters</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewDensity(viewDensity === "normal" ? "compact" : "normal")}
            aria-label={`Switch to ${viewDensity === "normal" ? "compact" : "spacious"} grid`}
            className="mobile-sort-icon-button"
          >
            {viewDensity === "normal" ? <LayoutGrid aria-hidden="true" /> : <Grid3X3 aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  )
}
