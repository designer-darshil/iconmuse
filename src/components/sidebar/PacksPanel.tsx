import React from 'react'
import {
  Boxes,
  Check,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { MOCK_PACKS, type IconPack } from '../../data/mockPacks'
import { cn } from '../../utils/cn'

export interface PacksPanelProps {
  activePackId: string | null
  onSelectPack: (packId: string | null) => void
  packs?: IconPack[]
}

export const PacksPanel: React.FC<PacksPanelProps> = ({
  activePackId,
  onSelectPack,
  packs = MOCK_PACKS,
}) => {
  return (
    <div className="p-5 flex flex-col gap-4 select-none bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1116] m-0">
            Curated Packs ({packs.length})
          </h3>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            Thematic vector kits curated for production products
          </p>
        </div>

        {activePackId && (
          <button
            type="button"
            onClick={() => onSelectPack(null)}
            className="text-[11px] font-semibold text-[#7141E8] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Show all</span>
          </button>
        )}
      </div>

      {/* Packs List */}
      <div className="flex flex-col gap-3">
        {packs.map((pack) => {
          const isActive = activePackId === pack.id

          return (
            <div
              key={pack.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectPack(isActive ? null : pack.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectPack(isActive ? null : pack.id)}
              className={cn(
                'group p-3 rounded-[14px] border cursor-pointer transition-all duration-150 relative overflow-hidden',
                isActive
                  ? 'bg-[#F7F7F8] border-[#7141E8] ring-1 ring-[#7141E8]/30 shadow-xs'
                  : 'bg-white border-[#E7E7EA] hover:border-[#D8D8DC] hover:shadow-xs'
              )}
            >
              {/* Top Row: Cover Gradient Block + Count Badge */}
              <div className="flex items-start gap-3">
                {/* Visual Cover-Color Block */}
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105"
                  style={{ background: pack.coverGradient }}
                >
                  <Boxes className="w-6 h-6 drop-shadow-xs" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-[#0F1116] truncate m-0">
                      {pack.title}
                    </h4>

                    {/* Icon count pill */}
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#F1F1F3] text-[#0F1116] shrink-0 border border-[#E7E7EA]">
                      {pack.count} glyphs
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8E8E93] line-clamp-2 mt-1 leading-snug">
                    {pack.description}
                  </p>
                </div>
              </div>

              {/* Bottom Row / Status */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E7E7EA]/60 text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pack.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] text-[#8E8E93] bg-[#F7F7F8] px-1.5 py-0.2 rounded border border-[#E7E7EA]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <span
                  className={cn(
                    'font-semibold inline-flex items-center gap-1',
                    isActive ? 'text-[#7141E8]' : 'text-[#8E8E93] group-hover:text-[#0F1116]'
                  )}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3 h-3 text-[#7141E8]" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
