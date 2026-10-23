import React, { useState } from 'react'
import {
  Download,
  Copy,
  Sliders,
  Code,
  Sparkles,
  Check,
} from 'lucide-react'
import type { IconItem } from '../../types'

export interface InspectorPlaceholderProps {
  selectedIcon?: IconItem | null
  activeColor?: string
}

export const InspectorPlaceholder: React.FC<InspectorPlaceholderProps> = ({
  selectedIcon,
  activeColor = '#0F1116',
}) => {
  const [hasCopiedSvg, setHasCopiedSvg] = useState(false)
  const [hasCopiedJsx, setHasCopiedJsx] = useState(false)
  const [strokeWeight, setStrokeWeight] = useState(2.0)
  const [iconSize, setIconSize] = useState(24)

  const IconComponent = selectedIcon?.component || Sparkles

  const handleCopySvg = () => {
    const code = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${activeColor}" stroke-width="${strokeWeight}" stroke-linecap="round" stroke-linejoin="round"><desc>${selectedIcon?.name || 'Iconora Icon'}</desc></svg>`
    navigator.clipboard?.writeText(code)
    setHasCopiedSvg(true)
    setTimeout(() => setHasCopiedSvg(false), 1500)
  }

  const handleCopyJsx = () => {
    const code = `<${selectedIcon?.name?.replace(/\s+/g, '') || 'Icon'} size={${iconSize}} color="${activeColor}" strokeWidth={${strokeWeight}} />`
    navigator.clipboard?.writeText(code)
    setHasCopiedJsx(true)
    setTimeout(() => setHasCopiedJsx(false), 1500)
  }

  return (
    <div className="p-5 flex flex-col gap-5 select-none">
      {/* Icon Preview Box */}
      <div className="w-full aspect-square max-h-[200px] rounded-[16px] bg-white border border-[#E7E7EA] flex flex-col items-center justify-center p-6 relative shadow-xs">
        {/* Optical grid lines */}
        <div className="absolute inset-4 border border-dashed border-[#E7E7EA] rounded-[10px] pointer-events-none flex items-center justify-center">
          <div className="w-full h-[1px] bg-[#E7E7EA]/60" />
          <div className="h-full w-[1px] bg-[#E7E7EA]/60 absolute" />
        </div>

        {/* Vector Display Icon Preview */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2.5">
          <div className="w-16 h-16 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center shadow-xs">
            <IconComponent
              className="w-8 h-8 transition-all"
              style={{ color: activeColor }}
              strokeWidth={strokeWeight}
            />
          </div>
          <span className="text-xs font-semibold text-[#0F1116] tracking-tight">
            {selectedIcon?.name || 'Sparkles Clean'}
          </span>
        </div>

        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#8E8E93] bg-[#F7F7F8] px-1.5 py-0.5 rounded border border-[#E7E7EA]">
          {iconSize} × {iconSize} px
        </div>
      </div>

      {/* Metadata Badges */}
      {selectedIcon && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold text-[#7141E8] bg-[#7141E8]/10 px-2 py-0.5 rounded-full border border-[#7141E8]/20">
            {selectedIcon.category}
          </span>
          <span className="text-[10px] font-medium text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA]">
            {selectedIcon.source}
          </span>
          <span className="text-[10px] font-medium text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA]">
            {selectedIcon.license}
          </span>
          <span className="text-[10px] font-medium text-[#2EA45B] bg-[#2EA45B]/10 px-2 py-0.5 rounded-full">
            ★ {selectedIcon.popularity} Popularity
          </span>
        </div>
      )}

      {/* Optical Customizer Controls */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-[#0F1116]">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#8E8E93]" />
            Stroke Weight
          </span>
          <span className="font-mono text-[#7141E8]">{strokeWeight.toFixed(1)} px</span>
        </div>

        <input
          type="range"
          min="1"
          max="3"
          step="0.5"
          value={strokeWeight}
          onChange={(e) => setStrokeWeight(parseFloat(e.target.value))}
          className="w-full accent-[#7141E8] cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-[#8E8E93] font-medium">
          <span>1.0 px</span>
          <span>1.5 px</span>
          <span>2.0 px</span>
          <span>2.5 px</span>
          <span>3.0 px</span>
        </div>
      </div>

      {/* Size Presets Pill Group */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#0F1116]">Size Scale</label>
        <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-full border border-[#E7E7EA]">
          {[16, 24, 32, 48].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setIconSize(size)}
              className={iconSize === size
                ? 'py-1 text-center text-xs font-semibold bg-[#0F1116] text-white rounded-full shadow-xs'
                : 'py-1 text-center text-xs font-medium text-[#8E8E93] hover:text-[#0F1116] rounded-full'}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E7E7EA]">
        <label className="text-xs font-semibold text-[#0F1116]">Quick Export</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopySvg}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] bg-white border border-[#E7E7EA] hover:border-[#D8D8DC] text-xs font-semibold text-[#0F1116] transition-all shadow-xs"
          >
            {hasCopiedSvg ? <Check className="w-3.5 h-3.5 text-[#2EA45B]" /> : <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />}
            <span>{hasCopiedSvg ? 'Copied!' : 'Copy SVG'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyJsx}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] bg-white border border-[#E7E7EA] hover:border-[#D8D8DC] text-xs font-semibold text-[#0F1116] transition-all shadow-xs"
          >
            {hasCopiedJsx ? <Check className="w-3.5 h-3.5 text-[#2EA45B]" /> : <Code className="w-3.5 h-3.5 text-[#8E8E93]" />}
            <span>{hasCopiedJsx ? 'Copied!' : 'Copy JSX'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopySvg}
          className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[12px] bg-[#0F1116] hover:bg-[#1E2028] text-white text-xs font-semibold transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download SVG Asset</span>
        </button>
      </div>
    </div>
  )
}
