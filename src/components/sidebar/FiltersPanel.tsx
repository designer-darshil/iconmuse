import React, { useState } from 'react'
import {
  Search,
  RotateCcw,
  ChevronDown,
  Check,
} from 'lucide-react'
import { cn } from '../../utils/cn'

export interface FiltersPanelProps {
  selectedSources: string[]
  onToggleSource: (source: string) => void
  selectedStyles: string[]
  onToggleStyle: (style: string) => void
  selectedLicenses: string[]
  onToggleLicense: (license: string) => void
  iconSize: number
  onChangeIconSize: (size: number) => void
  onResetFilters: () => void
  sourceCounts?: Record<string, number>
  licenseCounts?: Record<string, number>
  totalIconsCount?: number
}

const PRIMARY_SOURCES = [
  { name: 'Lucide', tag: 'Lu', color: '#EDE9FE', textColor: '#7141E8' },
  { name: 'Phosphor', tag: 'Ph', color: '#E0F2FE', textColor: '#0369A1' },
  { name: 'Tabler', tag: 'Tb', color: '#DCFCE7', textColor: '#15803D' },
  { name: 'Heroicons', tag: 'Hi', color: '#FEF3C7', textColor: '#B45309' },
  { name: 'Simple Icons', tag: 'Si', color: '#F1F1F3', textColor: '#0F1116' },
]

const EXTRA_SOURCES = [
  { name: 'Feather Icons', tag: 'Fi', color: '#FCE7F3', textColor: '#BE185D' },
  { name: 'Remix Icon', tag: 'Ri', color: '#E0E7FF', textColor: '#4338CA' },
  { name: 'Lineicons', tag: 'Li', color: '#ECFCCB', textColor: '#4D7C0F' },
]

const STYLE_OPTIONS = ['Outline', 'Solid', 'Duotone', 'Thin', '3D']

const LICENSE_OPTIONS = [
  { name: 'MIT', desc: 'Permissive commercial & personal use' },
  { name: 'Apache 2.0', desc: 'Commercial use with patent grant' },
  { name: 'CC BY 4.0', desc: 'Attribution required' },
]

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  selectedSources,
  onToggleSource,
  selectedStyles,
  onToggleStyle,
  selectedLicenses,
  onToggleLicense,
  iconSize,
  onChangeIconSize,
  onResetFilters,
  sourceCounts = {},
  licenseCounts = {},
  totalIconsCount = 96,
}) => {
  const [sourceSearch, setSourceSearch] = useState('')
  const [showMoreSources, setShowMoreSources] = useState(false)

  const allAvailableSources = showMoreSources
    ? [...PRIMARY_SOURCES, ...EXTRA_SOURCES]
    : PRIMARY_SOURCES

  const filteredSources = allAvailableSources.filter((s) =>
    s.name.toLowerCase().includes(sourceSearch.toLowerCase())
  )

  const isAllSourcesSelected = selectedSources.length === 0

  return (
    <div className="p-5 flex flex-col gap-6 select-none bg-white">
      {/* 1. Sources Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0F1116]">
            Icon Sources
          </label>

          {/* 1. All Sources Pill with Total Count */}
          <button
            type="button"
            onClick={() => {
              // Clear selected sources to show all
              if (!isAllSourcesSelected) {
                selectedSources.forEach((s) => onToggleSource(s))
              }
            }}
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all border',
              isAllSourcesSelected
                ? 'bg-[#0F1116] text-white border-[#0F1116]'
                : 'bg-[#F7F7F8] text-[#8E8E93] border-[#E7E7EA] hover:text-[#0F1116]'
            )}
          >
            All Sources ({totalIconsCount})
          </button>
        </div>

        {/* 2. Source Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={sourceSearch}
            onChange={(e) => setSourceSearch(e.target.value)}
            placeholder="Search sources..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-full bg-[#F7F7F8] border border-[#E7E7EA] focus:outline-none focus:border-[#7141E8] focus:bg-white transition-all text-[#0F1116] placeholder-[#8E8E93]"
          />
        </div>

        {/* 3. Source Checkbox Rows */}
        <div className="flex flex-col gap-1.5 mt-1">
          {filteredSources.map((source) => {
            const isChecked = selectedSources.includes(source.name)
            const count = sourceCounts[source.name] || 0

            return (
              <label
                key={source.name}
                className={cn(
                  'flex items-center justify-between p-2 rounded-[12px] border cursor-pointer transition-all',
                  isChecked
                    ? 'bg-[#F7F7F8] border-[#7141E8]/30 shadow-2xs'
                    : 'bg-white border-transparent hover:bg-[#F7F7F8]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-[5px] border flex items-center justify-center transition-colors',
                      isChecked
                        ? 'bg-[#7141E8] border-[#7141E8] text-white'
                        : 'border-[#D8D8DC] bg-white'
                    )}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  {/* Hidden native input for keyboard/a11y */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSource(source.name)}
                    className="sr-only"
                  />

                  {/* Source Icon / Tag Badge */}
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs shrink-0"
                    style={{ backgroundColor: source.color, color: source.textColor }}
                  >
                    {source.tag}
                  </span>

                  <span className="text-xs font-medium text-[#0F1116]">
                    {source.name}
                  </span>
                </div>

                {/* Result-count pill */}
                <span className="text-[10px] font-mono font-medium text-[#8E8E93] bg-[#F7F7F8] px-1.5 py-0.2 rounded border border-[#E7E7EA]">
                  {count}
                </span>
              </label>
            )
          })}
        </div>

        {/* 4. Show More Sources Control */}
        <button
          type="button"
          aria-expanded={showMoreSources}
          onClick={() => setShowMoreSources(!showMoreSources)}
          className="flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-[#7141E8] hover:text-[#5B2FD4] transition-colors mt-0.5"
        >
          <span>{showMoreSources ? 'Show fewer sources' : '+ Show more sources'}</span>
          <ChevronDown
            className={cn('w-3.5 h-3.5 transition-transform duration-200', showMoreSources && 'rotate-180')}
          />
        </button>
      </div>

      <div className="h-[1px] bg-[#E7E7EA] w-full" />

      {/* 5. Style Selector */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F1116] flex items-center justify-between">
          <span>Icon Style</span>
          {selectedStyles.length > 0 && (
            <span className="text-[10px] text-[#7141E8] font-semibold">
              {selectedStyles.length} active
            </span>
          )}
        </label>

        <div className="grid grid-cols-3 gap-1.5">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = selectedStyles.includes(style)
            return (
              <button
                key={style}
                type="button"
                onClick={() => onToggleStyle(style)}
                className={cn(
                  'py-2 px-2.5 text-center text-xs font-medium rounded-[10px] border transition-all',
                  isSelected
                    ? 'bg-[#0F1116] text-white border-[#0F1116] shadow-xs'
                    : 'bg-[#F7F7F8] hover:bg-[#F1F1F3] text-[#0F1116] border-[#E7E7EA]'
                )}
              >
                {style}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#E7E7EA] w-full" />

      {/* 6. Icon Size Slider & Presets */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F1116]">
          <span>Optical Size</span>
          <span className="font-mono text-[#7141E8] normal-case font-semibold text-[13px]">
            {iconSize} px
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="16"
          max="48"
          step="2"
          value={iconSize}
          onChange={(e) => onChangeIconSize(parseInt(e.target.value, 10))}
          className="w-full accent-[#7141E8] cursor-pointer"
          aria-label="Icon optical size slider"
        />

        {/* Presets: 16, 20, 24, 32 */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#F7F7F8] p-1 rounded-full border border-[#E7E7EA]">
          {[16, 20, 24, 32].map((preset) => {
            const isCurrent = iconSize === preset
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeIconSize(preset)}
                className={cn(
                  'py-1 text-center text-xs font-semibold rounded-full transition-all',
                  isCurrent
                    ? 'bg-white text-[#0F1116] shadow-xs'
                    : 'text-[#8E8E93] hover:text-[#0F1116]'
                )}
              >
                {preset}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#E7E7EA] w-full" />

      {/* 7. License Filter Rows */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F1116]">
          License
        </label>

        <div className="flex flex-col gap-1.5">
          {LICENSE_OPTIONS.map((lic) => {
            const isChecked = selectedLicenses.includes(lic.name)
            const count = licenseCounts[lic.name] || 0

            return (
              <label
                key={lic.name}
                className={cn(
                  'flex items-center justify-between p-2 rounded-[12px] border cursor-pointer transition-all',
                  isChecked
                    ? 'bg-[#F7F7F8] border-[#7141E8]/30 shadow-2xs'
                    : 'bg-white border-transparent hover:bg-[#F7F7F8]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-[5px] border flex items-center justify-center transition-colors',
                      isChecked
                        ? 'bg-[#7141E8] border-[#7141E8] text-white'
                        : 'border-[#D8D8DC] bg-white'
                    )}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleLicense(lic.name)}
                    className="sr-only"
                  />

                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#0F1116]">
                      {lic.name}
                    </span>
                    <span className="text-[10px] text-[#8E8E93]">
                      {lic.desc}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-medium text-[#8E8E93] bg-[#F7F7F8] px-1.5 py-0.2 rounded border border-[#E7E7EA]">
                  {count}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#E7E7EA] w-full" />

      {/* 8. Reset Filters Action Button */}
      <button
        type="button"
        onClick={onResetFilters}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[12px] bg-[#F7F7F8] hover:bg-[#F1F1F3] border border-[#E7E7EA] hover:border-[#D8D8DC] text-xs font-semibold text-[#0F1116] transition-all shadow-xs"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#8E8E93]" />
        <span>Reset all filters</span>
      </button>
    </div>
  )
}
