import React from 'react'
import {
  BookmarkX,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { MOCK_ICONS } from '../../data/mockIcons'
import type { IconItem } from '../../types'

export interface SavedPanelProps {
  savedIconIds: string[]
  onToggleSave: (id: string) => void
  onSelectIcon: (icon: IconItem) => void
  activeColor?: string
}

export const SavedPanel: React.FC<SavedPanelProps> = ({
  savedIconIds,
  onToggleSave,
  onSelectIcon,
  activeColor = '#0F1116',
}) => {
  const savedIcons = MOCK_ICONS.filter((icon) => savedIconIds.includes(icon.id))

  // Polished Empty State
  if (savedIcons.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center min-h-[360px] select-none bg-white">
        <div className="w-14 h-14 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center text-[#8E8E93] mb-4 shadow-xs">
          <BookmarkX className="w-6 h-6 text-[#7141E8]" />
        </div>

        <h3 className="text-sm font-bold text-[#0F1116] mb-1">
          No saved icons yet
        </h3>
        <p className="text-xs text-[#8E8E93] max-w-[240px] mb-6 leading-relaxed">
          Click the bookmark icon on any icon tile across the workspace to save it for quick access here.
        </p>

        <div className="p-3 rounded-[12px] bg-[#F7F7F8] border border-[#E7E7EA] text-[11px] text-[#8E8E93] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#7141E8]" />
          <span>Saved icons persist in your browser's local storage</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 flex flex-col gap-4 select-none bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1116] m-0">
            Saved Favorites ({savedIcons.length})
          </h3>
          <p className="text-[11px] text-[#8E8E93] mt-0.5">
            Persisted locally in your workspace
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            savedIconIds.forEach((id) => onToggleSave(id))
          }}
          className="text-[11px] font-semibold text-[#8E8E93] hover:text-[#E11D48] transition-colors"
          title="Clear all saved"
        >
          Clear all
        </button>
      </div>

      {/* Saved Icons List */}
      <div className="flex flex-col gap-2">
        {savedIcons.map((icon) => {
          const IconComp = icon.component

          return (
            <div
              key={icon.id}
              onClick={() => onSelectIcon(icon)}
              className="group flex items-center justify-between p-2.5 rounded-[12px] bg-[#F7F7F8] hover:bg-white border border-[#E7E7EA] hover:border-[#D8D8DC] hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon Preview */}
                <div className="w-9 h-9 rounded-[8px] bg-white border border-[#E7E7EA] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <IconComp className="w-5 h-5" style={{ color: activeColor }} />
                </div>

                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-bold text-[#0F1116] truncate">
                    {icon.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93]">
                    <span>{icon.source}</span>
                    <span>·</span>
                    <span>{icon.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Remove & Inspect */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSave(icon.id)
                  }}
                  className="p-1.5 rounded-full text-[#8E8E93] hover:text-[#E11D48] hover:bg-white transition-colors"
                  title="Remove from saved"
                  aria-label={`Remove ${icon.name} from saved`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
