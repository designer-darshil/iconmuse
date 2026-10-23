import React from 'react'
import {
  Grid3X3,
  List,
  ArrowUpDown,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export interface FilterBarPlaceholderProps {
  categoryName?: string
  totalCount?: number
  activeStyle?: 'stroke' | 'solid' | 'duotone'
  viewMode?: 'grid' | 'list'
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export const FilterBarPlaceholder: React.FC<FilterBarPlaceholderProps> = ({
  categoryName = 'All Icons',
  totalCount = 4280,
  activeStyle = 'stroke',
  viewMode = 'grid',
  onToggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#E7E7EA] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Category & Status Indicator */}
      <div className="flex items-center gap-3">
        <h1 className="text-base md:text-lg font-semibold text-[#0F1116] tracking-tight m-0">
          {categoryName}
        </h1>
        <span className="text-xs font-medium text-[#8E8E93] bg-[#F7F7F8] border border-[#E7E7EA] px-2.5 py-0.5 rounded-full">
          {totalCount.toLocaleString()} items
        </span>
      </div>

      {/* Control Pills Placeholder (Style, Customizer, View Mode) */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Style Segmented Pill */}
        <div className="flex items-center bg-[#F7F7F8] p-1 rounded-full border border-[#E7E7EA]">
          <button
            type="button"
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              activeStyle === 'stroke'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            Line Stroke
          </button>
          <button
            type="button"
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              activeStyle === 'solid'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            Solid
          </button>
          <button
            type="button"
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              activeStyle === 'duotone'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            Duotone
          </button>
        </div>

        {/* Sort Pill Placeholder */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-medium text-[#0F1116] transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-[#8E8E93]" />
          <span>Sort: Featured</span>
        </button>

        {/* View Mode Placeholder */}
        <div className="flex items-center bg-[#F7F7F8] p-1 rounded-full border border-[#E7E7EA]">
          <button
            type="button"
            aria-label="Grid view"
            className={cn(
              'p-1 rounded-full transition-colors',
              viewMode === 'grid'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="List view"
            className={cn(
              'p-1 rounded-full transition-colors',
              viewMode === 'list'
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Sidebar Trigger on Tablet/Desktop if provided */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Hide inspector' : 'Show inspector'}
            title={isSidebarOpen ? 'Hide inspector' : 'Show inspector'}
            className="hidden md:flex xl:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-medium text-[#0F1116] transition-colors"
          >
            {isSidebarOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-[#7141E8]" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-[#8E8E93]" />
            )}
            <span>Inspector</span>
          </button>
        )}
      </div>
    </div>
  )
}
