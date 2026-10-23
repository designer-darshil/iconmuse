import React from 'react'
import {
  Grid3X3,
  LayoutGrid,
  Columns2,
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
  viewDensity: ViewDensity
  onChangeViewDensity: (density: ViewDensity) => void
}

export const SortRow: React.FC<SortRowProps> = ({
  totalCount,
  activeSort,
  onSelectSort,
  compareCount,
  onClearCompare,
  viewDensity,
  onChangeViewDensity,
}) => {
  const tabs: { id: SortOption; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'relevant', label: 'Relevant' },
    { id: 'popular', label: 'Popular' },
    { id: 'trending', label: 'Trending' },
    { id: 'name-asc', label: 'Name A–Z' },
    { id: 'name-desc', label: 'Name Z–A' },
  ]

  return (
    <div className="w-full bg-white border-b border-[#E7E7EA] px-4 md:px-6 flex items-center justify-between gap-4 select-none">
      {/* Horizontally scrollable tabs list on mobile */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1">
        {tabs.map((tab) => {
          const isActive = activeSort === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectSort(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-3 text-xs tracking-tight transition-all whitespace-nowrap',
                isActive
                  ? 'border-b-2 border-[#0F1116] -mb-[1px] font-semibold text-[#0F1116]'
                  : 'text-[#8E8E93] hover:text-[#0F1116] font-medium border-b-2 border-transparent'
              )}
            >
              <span>{tab.label}</span>
              {/* Black result-count pill on active tab */}
              {isActive && (
                <span className="bg-[#0F1116] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {totalCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right side: Compare button with selection count & detailed/compact view toggle */}
      <div className="flex items-center gap-2 shrink-0 py-2">
        {/* Compare Button */}
        <div className="flex items-center">
          <button
            type="button"
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
    </div>
  )
}
