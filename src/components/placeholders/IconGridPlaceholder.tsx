import React from 'react'
import {
  Boxes,
  Search,
  Sliders,
  CheckCircle2,
  Code2,
} from 'lucide-react'

export interface IconGridPlaceholderProps {
  categorySlug?: string
  searchQuery?: string
  totalItemsCount?: number
}

export const IconGridPlaceholder: React.FC<IconGridPlaceholderProps> = ({
  categorySlug = 'all',
  searchQuery = '',
  totalItemsCount = 4280,
}) => {
  return (
    <div
      className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center min-h-[460px]"
      data-category={categorySlug}
      data-search={searchQuery}
    >
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Visual Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-medium text-[#0F1116] mb-5 shadow-xs">
          <Boxes className="w-4 h-4 text-[#7141E8]" />
          <span>Core Workspace Mounted · Step 1 Shell Complete</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F1116] mb-3">
          Icon Discovery Workspace
        </h2>
        <p className="text-sm text-[#8E8E93] max-w-lg mx-auto mb-8 leading-relaxed">
          The application shell, navigation rail, responsive grid layout, and contextual
          inspector sidebar are initialized ({totalItemsCount.toLocaleString()} glyphs mapped).
          Next phases will mount the virtualized icon grid, live keyword search, and SVG export engine.
        </p>

        {/* Feature Spec Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
          <div className="p-4 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA] hover:border-[#D8D8DC] transition-colors">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E7E7EA] flex items-center justify-center text-[#7141E8] mb-3 shadow-xs">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#0F1116] mb-1">
              Live Search Engine
            </h3>
            <p className="text-xs text-[#8E8E93] leading-normal">
              Instant multi-tag indexing with keyboard navigation and fuzzy keyword matching.
            </p>
          </div>

          <div className="p-4 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA] hover:border-[#D8D8DC] transition-colors">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E7E7EA] flex items-center justify-center text-[#7141E8] mb-3 shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#0F1116] mb-1">
              Vector Customizer
            </h3>
            <p className="text-xs text-[#8E8E93] leading-normal">
              Dynamic stroke adjustment, optical sizing presets (16, 20, 24, 32px), and color tokens.
            </p>
          </div>

          <div className="p-4 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA] hover:border-[#D8D8DC] transition-colors">
            <div className="w-8 h-8 rounded-[10px] bg-white border border-[#E7E7EA] flex items-center justify-center text-[#7141E8] mb-3 shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#0F1116] mb-1">
              Multi-Format Export
            </h3>
            <p className="text-xs text-[#8E8E93] leading-normal">
              One-click export to raw SVG, React TSX component, Vue 3, or high-res PNG.
            </p>
          </div>
        </div>

        {/* Visual Blueprint Wireframe preview */}
        <div className="p-5 rounded-[16px] border border-dashed border-[#E7E7EA] bg-[#F7F7F8]/50 flex items-center justify-between text-xs text-[#8E8E93]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2EA45B]" />
            <span className="font-medium text-[#0F1116]">
              Shell Architecture Ready
            </span>
            <span className="text-stone-400">·</span>
            <span>CSS Grid Desktop Layout (Rail + Canvas + 360px Sidebar)</span>
          </div>

          <span className="hidden sm:inline-block font-mono text-[11px] bg-white border border-[#E7E7EA] px-2 py-0.5 rounded-md">
            Phase 1 / Shell
          </span>
        </div>
      </div>
    </div>
  )
}
