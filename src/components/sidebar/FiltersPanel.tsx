import React from 'react'
import { cn } from '../../utils/cn'

export interface FiltersPanelProps {
  selectedStyles: string[]
  onToggleStyle: (style: string) => void
  selectedLicenses: string[]
  onToggleLicense: (license: string) => void
  iconSize: number
  onChangeIconSize: (size: number) => void
  onResetFilters: () => void
  licenseCounts?: Record<string, number>
}

const STYLE_OPTIONS = ['Outline', 'Solid', 'Duotone', 'Thin', '3D', 'Illustration']
const LICENSE_OPTIONS = ['MIT', 'ISC', 'Apache-2.0', 'CC0-1.0', 'BSD']

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  selectedStyles,
  onToggleStyle,
  selectedLicenses,
  onToggleLicense,
  iconSize,
  onChangeIconSize,
  onResetFilters,
  licenseCounts = {},
}) => (
  <div className="flex flex-col gap-8 bg-white px-6 py-6">
    <section aria-labelledby="style-heading" className="flex flex-col gap-4">
      <div>
        <h3 id="style-heading" className="m-0 text-sm font-semibold text-[#0F1116]">Icon style</h3>
        <p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">Choose one or more styles.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selectedStyles.includes(style)
          return (
            <button
              key={style}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleStyle(style)}
              className={cn(
                'min-h-10 rounded-lg border px-3 text-left text-sm transition-colors',
                isSelected
                  ? 'border-[#7141E8] bg-[#F7F4FF] font-medium text-[#5630BD]'
                  : 'border-[#E7E7EA] bg-white text-[#55555D] hover:border-[#CFC9DE] hover:bg-[#FAF9FC]'
              )}
            >
              {style}
            </button>
          )
        })}
      </div>
    </section>

    <section aria-labelledby="size-heading" className="flex flex-col gap-4 border-t border-[#E7E7EA] pt-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="size-heading" className="m-0 text-sm font-semibold text-[#0F1116]">Optical size</h3>
        <span className="text-sm font-medium tabular-nums text-[#7141E8]">{iconSize} px</span>
      </div>
      <input
        type="range"
        min="16"
        max="48"
        step="2"
        value={iconSize}
        onChange={(event) => onChangeIconSize(Number(event.target.value))}
        className="w-full accent-[#7141E8]"
        aria-label="Icon optical size"
      />
      <div className="flex justify-between text-[11px] text-[#8E8E93]" aria-hidden="true">
        <span>16 px</span>
        <span>48 px</span>
      </div>
    </section>

    <section aria-labelledby="license-heading" className="flex flex-col gap-3 border-t border-[#E7E7EA] pt-6">
      <div>
        <h3 id="license-heading" className="m-0 text-sm font-semibold text-[#0F1116]">License</h3>
        <p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">Filter by asset license.</p>
      </div>
      <div className="divide-y divide-[#F0F0F2]">
        {LICENSE_OPTIONS.map((license) => {
          const isSelected = selectedLicenses.includes(license)
          return (
            <label key={license} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 py-2 text-sm">
              <span className="flex items-center gap-3 text-[#303038]">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleLicense(license)}
                  className="h-4 w-4 accent-[#7141E8]"
                />
                {license}
              </span>
              <span className="text-xs tabular-nums text-[#8E8E93]">{(licenseCounts[license] ?? 0).toLocaleString()}</span>
            </label>
          )
        })}
      </div>
    </section>

    <button
      type="button"
      onClick={onResetFilters}
      className="self-start py-1 text-xs font-medium text-[#7141E8] underline-offset-4 hover:underline"
    >
      Reset filters
    </button>
  </div>
)
