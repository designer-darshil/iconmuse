import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  Copy,
  Download,
  Check,
  Bookmark,
  ChevronDown,
  ChevronRight,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sparkles,
  Shield,
  Search,
  Code2,
} from 'lucide-react'
import { MOCK_ICONS } from '../../data/mockIcons'
import { cn } from '../../utils/cn'

export interface IconDetailModalProps {
  iconId: string | null
  onClose: () => void
  onSelectIcon: (id: string) => void
  savedIconIds: string[]
  onToggleSave: (id: string) => void
  onFindSimilar?: (category: string) => void
}

const COLOR_SWATCHES = [
  '#0F1116',
  '#7141E8',
  '#2563EB',
  '#059669',
  '#E11D48',
  '#D97706',
  '#475569',
  '#FFFFFF',
]

const BG_SWATCHES = [
  'transparent',
  '#FFFFFF',
  '#F7F7F8',
  '#F1F1F3',
  '#0F1116',
  '#EDE9FE',
  '#DCFCE7',
  '#FEF3C7',
]

export const IconDetailModal: React.FC<IconDetailModalProps> = ({
  iconId,
  onClose,
  onSelectIcon,
  savedIconIds,
  onToggleSave,
  onFindSimilar,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const icon = useMemo(() => {
    if (!iconId) return null
    return MOCK_ICONS.find((i) => i.id === iconId) || null
  }, [iconId])

  // Customization State
  const [size, setSize] = useState<number>(36)
  const [strokeWidth, setStrokeWidth] = useState<number>(2.0)
  const [fgColor, setFgColor] = useState<string>('#0F1116')
  const [bgColor, setBgColor] = useState<string>('transparent')
  const [bgShape, setBgShape] = useState<'none' | 'rounded-square' | 'circle'>('none')
  const [rotation, setRotation] = useState<number>(0)
  const [flipH, setFlipH] = useState<boolean>(false)
  const [flipV, setFlipV] = useState<boolean>(false)
  const [opacity, setOpacity] = useState<number>(100)
  const [shadow, setShadow] = useState<'none' | 'subtle' | 'float' | 'glow'>('none')

  // Collapsible Sections
  const [isTransformOpen, setIsTransformOpen] = useState(false)
  const [isEffectsOpen, setIsEffectsOpen] = useState(false)
  const [isBgShapeOpen, setIsBgShapeOpen] = useState(false)

  // Export State
  const [pngScale, setPngScale] = useState<string>('2x (48px)')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSvgSplitOpen, setIsSvgSplitOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Reset customizer defaults when icon changes
  useEffect(() => {
    if (icon) {
      setSize(36)
      setStrokeWidth(2.0)
      setFgColor('#0F1116')
      setBgColor('transparent')
      setBgShape('none')
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
      setOpacity(100)
      setShadow('none')
    }
  }, [icon?.id])

  // Focus trapping & Escape key listener
  useEffect(() => {
    if (!iconId) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Focus close button initially
    const closeBtn = modalRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close icon detail"]')
    closeBtn?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement.current?.focus?.()
    }
  }, [iconId, onClose])

  if (!icon) return null

  const IconComponent = icon.component
  const isSaved = savedIconIds.includes(icon.id)

  const similarIcons = MOCK_ICONS.filter(
    (i) => i.category === icon.category && i.id !== icon.id
  ).slice(0, 5)

  const matchingIcons = MOCK_ICONS.filter(
    (i) =>
      i.id !== icon.id &&
      (i.tags.some((t) => icon.tags.includes(t)) || i.source === icon.source)
  ).slice(0, 6)

  // Generate SVG Code
  const generatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${fgColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${icon.name.toLowerCase().replace(/\s+/g, '-')}">\n  <!-- ${icon.name} from ${icon.source} (${icon.license}) -->\n  <path d="M..."/>\n</svg>`

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2000)
  }

  const handleCopySvg = () => {
    navigator.clipboard?.writeText(generatedSvg)
    showToast('SVG Copied to clipboard!')
  }

  const handleCopyJsx = () => {
    const jsxCode = `<${icon.name.replace(/\s+/g, '')} size={${size}} color="${fgColor}" strokeWidth={${strokeWidth}} />`
    navigator.clipboard?.writeText(jsxCode)
    showToast('React JSX Component copied!')
    setIsSvgSplitOpen(false)
  }

  const handleDownloadSvg = () => {
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${icon.name.toLowerCase().replace(/\s+/g, '-')}.svg`
    link.click()
    URL.revokeObjectURL(url)
    showToast(`Downloaded ${icon.name}.svg`)
  }

  const handleCopyPng = () => {
    showToast(`Rendered ${pngScale} PNG copied!`)
  }

  const getShadowStyle = () => {
    switch (shadow) {
      case 'subtle':
        return '0 2px 8px rgba(15,17,22,0.08)'
      case 'float':
        return '0 8px 24px rgba(15,17,22,0.16)'
      case 'glow':
        return `0 0 20px ${fgColor}55`
      default:
        return 'none'
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-8 select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="icon-detail-title"
      >
        {/* Full-screen dimmed backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F1116]/65 backdrop-blur-xs"
        />

        {/* Modal Window: max-w-[1680px], 16px radius, professional quick transition */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, y: shouldReduceMotion ? 0 : 6 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[1680px] h-full md:h-[90vh] bg-white md:rounded-[16px] shadow-2xl border border-[#E7E7EA] overflow-hidden flex flex-col"
        >
          {/* Top Bar for Mobile & Desktop Close */}
          <div className="h-14 px-5 border-b border-[#E7E7EA] flex items-center justify-between bg-white shrink-0 sticky top-0 z-30">
            {/* Breadcrumb: Icons / Category / Icon Name */}
            <nav className="flex items-center gap-1.5 text-xs text-[#8E8E93] overflow-x-auto no-scrollbar font-medium" aria-label="Breadcrumb">
              <span className="hover:text-[#0F1116] cursor-pointer" onClick={onClose}>
                Icons
              </span>
              <span>/</span>
              <span
                className="hover:text-[#0F1116] cursor-pointer"
                onClick={() => {
                  onFindSimilar?.(icon.category)
                  onClose()
                }}
              >
                {icon.category}
              </span>
              <span>/</span>
              <span id="icon-detail-title" className="font-bold text-[#0F1116] truncate max-w-[180px]">
                {icon.name}
              </span>
            </nav>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close icon detail"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-all hover:-translate-y-[1px] active:translate-y-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Layout: 3 Columns on Desktop >= 1280px, Stacked on Tablet & Mobile */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-[360px_1fr_360px] xl:grid-cols-[380px_1fr_380px]">
            {/* -------------------- 1. LEFT PANEL: CUSTOMIZATION -------------------- */}
            <div className="border-b lg:border-b-0 lg:border-r border-[#E7E7EA] bg-white overflow-y-auto p-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1116] m-0">
                  Customize Glyph
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSize(36)
                    setStrokeWidth(2.0)
                    setFgColor('#0F1116')
                    setBgColor('transparent')
                    setBgShape('none')
                    setRotation(0)
                    setFlipH(false)
                    setFlipV(false)
                    setOpacity(100)
                    setShadow('none')
                  }}
                  className="text-[11px] font-semibold text-[#7141E8] hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Icon Size Slider */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="custom-size-slider">Size</label>
                  <span className="font-mono text-[#7141E8]">{size}px</span>
                </div>

                <input
                  id="custom-size-slider"
                  type="range"
                  min="16"
                  max="96"
                  step="2"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value, 10))}
                  className="w-full accent-[#7141E8] cursor-pointer"
                />

                <div className="grid grid-cols-4 gap-1.5 bg-[#F7F7F8] p-1 rounded-full border border-[#E7E7EA]">
                  {[16, 20, 24, 32].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSize(preset)}
                      className={cn(
                        'py-1 text-center text-xs font-semibold rounded-full transition-all hover:-translate-y-[1px] active:translate-y-0',
                        size === preset
                          ? 'bg-white text-[#0F1116] shadow-2xs'
                          : 'text-[#8E8E93] hover:text-[#0F1116]'
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stroke Weight */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="custom-stroke-slider">Stroke Width</label>
                  <span className="font-mono text-[#7141E8]">{strokeWidth.toFixed(1)}px</span>
                </div>
                <input
                  id="custom-stroke-slider"
                  type="range"
                  min="1"
                  max="3"
                  step="0.5"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                  className="w-full accent-[#7141E8] cursor-pointer"
                />
              </div>

              {/* Foreground Color Input & Swatches */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="fg-color-input">Icon Color</label>
                  <span className="font-mono text-xs text-[#8E8E93] uppercase">{fgColor}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full border border-black/10 shrink-0 shadow-2xs"
                    style={{ backgroundColor: fgColor }}
                  />
                  <input
                    id="fg-color-input"
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-mono text-[#0F1116] focus:outline-none focus:border-[#7141E8]"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFgColor(color)}
                      className={cn(
                        'w-7 h-7 rounded-full border transition-transform hover:scale-110 shrink-0',
                        fgColor === color ? 'ring-2 ring-[#7141E8] ring-offset-1' : 'border-black/10'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color Input & Swatches */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="bg-color-input">Background Color</label>
                  <span className="font-mono text-xs text-[#8E8E93] uppercase">
                    {bgColor === 'transparent' ? 'None' : bgColor}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full border border-black/10 shrink-0 shadow-2xs relative overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                  >
                    {bgColor === 'transparent' && (
                      <div className="absolute inset-0 bg-red-400 rotate-45 h-[1.5px] top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <input
                    id="bg-color-input"
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-mono text-[#0F1116] focus:outline-none focus:border-[#7141E8]"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {BG_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBgColor(color)}
                      className={cn(
                        'w-7 h-7 rounded-full border transition-transform hover:scale-110 shrink-0 relative overflow-hidden',
                        bgColor === color ? 'ring-2 ring-[#7141E8] ring-offset-1' : 'border-black/10'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={color === 'transparent' ? 'Transparent background' : `Background color ${color}`}
                    >
                      {color === 'transparent' && (
                        <div className="absolute inset-0 bg-red-400 rotate-45 h-[1.5px] top-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-[#E7E7EA]" />

              {/* Collapsible: Background Shape */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isBgShapeOpen}
                  onClick={() => setIsBgShapeOpen(!isBgShapeOpen)}
                  className="flex items-center justify-between py-2 text-xs font-bold text-[#0F1116] hover:text-[#7141E8] transition-colors"
                >
                  <span>Background Shape</span>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-[#8E8E93] transition-transform duration-150',
                      isBgShapeOpen && 'rotate-90'
                    )}
                  />
                </button>

                {isBgShapeOpen && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'rounded-square', label: 'Rounded' },
                      { id: 'circle', label: 'Circle' },
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => setBgShape(shape.id as any)}
                        className={cn(
                          'py-2 text-xs font-semibold rounded-[10px] border transition-all hover:-translate-y-[1px] active:translate-y-0',
                          bgShape === shape.id
                            ? 'bg-[#0F1116] text-white border-[#0F1116]'
                            : 'bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116]'
                        )}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible: Transform */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isTransformOpen}
                  onClick={() => setIsTransformOpen(!isTransformOpen)}
                  className="flex items-center justify-between py-2 text-xs font-bold text-[#0F1116] hover:text-[#7141E8] transition-colors"
                >
                  <span>Transform & Alignment</span>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-[#8E8E93] transition-transform duration-150',
                      isTransformOpen && 'rotate-90'
                    )}
                  />
                </button>

                {isTransformOpen && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] hover:bg-[#F1F1F3] hover:-translate-y-[1px] active:translate-y-0"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{rotation}°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipH((prev) => !prev)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border text-xs font-semibold transition-all hover:-translate-y-[1px] active:translate-y-0',
                        flipH
                          ? 'bg-[#0F1116] text-white border-[#0F1116]'
                          : 'bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116] hover:bg-[#F1F1F3]'
                      )}
                      title="Flip horizontal"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip H</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipV((prev) => !prev)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border text-xs font-semibold transition-all hover:-translate-y-[1px] active:translate-y-0',
                        flipV
                          ? 'bg-[#0F1116] text-white border-[#0F1116]'
                          : 'bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116] hover:bg-[#F1F1F3]'
                      )}
                      title="Flip vertical"
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span>Flip V</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Collapsible: Effects */}
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isEffectsOpen}
                  onClick={() => setIsEffectsOpen(!isEffectsOpen)}
                  className="flex items-center justify-between py-2 text-xs font-bold text-[#0F1116] hover:text-[#7141E8] transition-colors"
                >
                  <span>Effects & Opacity</span>
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-[#8E8E93] transition-transform duration-150',
                      isEffectsOpen && 'rotate-90'
                    )}
                  />
                </button>

                {isEffectsOpen && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-[#0F1116]">
                      <span className="font-medium">Opacity</span>
                      <span className="font-mono text-[#7141E8]">{opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                      className="w-full accent-[#7141E8] cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-xs text-[#0F1116] pt-1">
                      <span className="font-medium">Shadow</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'none', label: 'None' },
                        { id: 'subtle', label: 'Subtle' },
                        { id: 'float', label: 'Float' },
                        { id: 'glow', label: 'Glow' },
                      ].map((sh) => (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => setShadow(sh.id as any)}
                          className={cn(
                            'py-1.5 text-[11px] font-semibold rounded-[8px] border text-center transition-all hover:-translate-y-[1px] active:translate-y-0',
                            shadow === sh.id
                              ? 'bg-[#0F1116] text-white border-[#0F1116]'
                              : 'bg-[#F7F7F8] border-[#E7E7EA] text-[#0F1116]'
                          )}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* -------------------- 2. CENTRAL PANEL: PREVIEW & SIMILAR -------------------- */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center bg-[#FAFAFA]">
              {/* Large Preview Stage using CSS Grid-Paper Background */}
              <div
                className="w-full max-w-xl aspect-4/3 rounded-[20px] border border-[#E7E7EA] relative flex items-center justify-center shadow-xs overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  backgroundImage:
                    'radial-gradient(circle, #E7E7EA 1.25px, transparent 1.25px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {/* Visual optical crosshair lines */}
                <div className="absolute inset-8 border border-dashed border-[#E7E7EA]/70 pointer-events-none rounded-[14px]" />
                <div className="absolute inset-y-0 w-[1px] bg-[#E7E7EA]/40 pointer-events-none" />
                <div className="absolute inset-x-0 h-[1px] bg-[#E7E7EA]/40 pointer-events-none" />

                {/* Rendered Icon Stage with applied transformations */}
                <div
                  className={cn(
                    'flex items-center justify-center p-6 transition-all duration-150',
                    bgShape === 'rounded-square' && 'rounded-[24px]',
                    bgShape === 'circle' && 'rounded-full'
                  )}
                  style={{
                    backgroundColor: bgColor,
                    boxShadow: getShadowStyle(),
                    opacity: opacity / 100,
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  }}
                >
                  <IconComponent
                    style={{
                      width: `${size * 2}px`,
                      height: `${size * 2}px`,
                      color: fgColor,
                    }}
                    strokeWidth={strokeWidth}
                  />
                </div>

                {/* Dimension Pill Badge */}
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA] shadow-2xs">
                  {size} × {size} px
                </span>
              </div>

              {/* Icon Info & Under-Preview Actions */}
              <div className="w-full max-w-xl flex flex-col gap-3 mt-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F1116] tracking-tight m-0">
                      {icon.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-[#7141E8] bg-[#7141E8]/10 px-2 py-0.5 rounded-full border border-[#7141E8]/20">
                        {icon.source}
                      </span>
                      <span className="text-[11px] font-medium text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA]">
                        {icon.license}
                      </span>
                      <span className="text-[11px] font-medium text-[#8E8E93] bg-white px-2 py-0.5 rounded-full border border-[#E7E7EA]">
                        {icon.category}
                      </span>
                    </div>
                  </div>

                  {/* Save Button & Find Similar */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleSave(icon.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0',
                        isSaved
                          ? 'bg-[#0F1116] text-white border-[#0F1116]'
                          : 'bg-white hover:bg-[#F7F7F8] text-[#0F1116] border-[#E7E7EA]'
                      )}
                    >
                      <Bookmark className={cn('w-3.5 h-3.5', isSaved && 'fill-current text-[#B89AFF]')} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onFindSimilar?.(icon.category)
                        onClose()
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F7F7F8] text-xs font-semibold text-[#0F1116] border border-[#E7E7EA] transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
                    >
                      <Search className="w-3.5 h-3.5 text-[#7141E8]" />
                      <span>Find Similar</span>
                    </button>
                  </div>
                </div>

                {/* Similar Icons Row */}
                {similarIcons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E7E7EA]">
                    <span className="text-xs font-bold text-[#0F1116] uppercase tracking-wider">
                      Similar in {icon.category}
                    </span>
                    <div className="grid grid-cols-5 gap-2.5 mt-2.5">
                      {similarIcons.map((sim) => {
                        const SimComp = sim.component
                        return (
                          <button
                            key={sim.id}
                            type="button"
                            onClick={() => onSelectIcon(sim.id)}
                            className="group flex flex-col items-center justify-center p-3 rounded-[12px] bg-white border border-[#E7E7EA] hover:border-[#7141E8]/40 hover:shadow-xs transition-all hover:-translate-y-[1px] active:translate-y-0"
                          >
                            <SimComp className="w-5 h-5 text-[#0F1116] group-hover:scale-105 transition-transform" />
                            <span className="text-[10px] text-[#8E8E93] group-hover:text-[#0F1116] truncate max-w-full mt-1.5 font-medium">
                              {sim.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* “More icons matching [name]” Mini-Grid */}
                {matchingIcons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E7E7EA]">
                    <span className="text-xs font-bold text-[#0F1116] uppercase tracking-wider">
                      More Icons Matching {icon.name.split(' ')[0]}
                    </span>
                    <div className="grid grid-cols-6 gap-2 mt-2.5">
                      {matchingIcons.map((mat) => {
                        const MatComp = mat.component
                        return (
                          <button
                            key={mat.id}
                            type="button"
                            onClick={() => onSelectIcon(mat.id)}
                            className="group flex flex-col items-center justify-center p-2.5 rounded-[12px] bg-white border border-[#E7E7EA] hover:border-[#7141E8]/40 hover:shadow-xs transition-all hover:-translate-y-[1px] active:translate-y-0"
                            title={mat.name}
                          >
                            <MatComp className="w-5 h-5 text-[#0F1116] group-hover:scale-105 transition-transform" />
                            <span className="text-[9px] text-[#8E8E93] group-hover:text-[#0F1116] truncate max-w-full mt-1 font-medium">
                              {mat.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* -------------------- 3. RIGHT PANEL: EXPORT & CODE -------------------- */}
            <div className="border-t lg:border-t-0 lg:border-l border-[#E7E7EA] bg-white overflow-y-auto p-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F1116] m-0">
                  Export Settings
                </h3>
                <span className="text-[10px] font-mono text-[#2EA45B] bg-[#2EA45B]/10 px-2 py-0.5 rounded-full font-bold">
                  Vector Ready
                </span>
              </div>

              {/* Green Copy SVG Split-Button Appearance */}
              <div className="flex items-center w-full relative">
                <button
                  type="button"
                  onClick={handleCopySvg}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-l-[12px] bg-[#2EA45B] hover:bg-[#279250] text-white text-xs font-bold transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy SVG Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSvgSplitOpen(!isSvgSplitOpen)}
                  aria-label="More copy options"
                  aria-expanded={isSvgSplitOpen}
                  className="px-2.5 py-2.5 bg-[#279250] hover:bg-[#227E45] text-white rounded-r-[12px] border-l border-white/20 transition-all flex items-center justify-center"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isSvgSplitOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-[#E7E7EA] rounded-[14px] shadow-xl py-1.5 z-40">
                    <button
                      type="button"
                      onClick={handleCopyJsx}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0F1116] hover:bg-[#F7F7F8] text-left"
                    >
                      <Code2 className="w-3.5 h-3.5 text-[#7141E8]" />
                      <span>Copy React JSX</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopySvg}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0F1116] hover:bg-[#F7F7F8] text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />
                      <span>Copy Raw SVG</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Download SVG Button */}
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[12px] bg-[#0F1116] hover:bg-[#1E2028] text-white text-xs font-semibold transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
              >
                <Download className="w-4 h-4" />
                <span>Download SVG Asset</span>
              </button>

              {/* PNG Format Control & Size Dropdown */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA]">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <label htmlFor="png-scale-select">Raster PNG Format</label>
                  <span className="text-[10px] text-[#8E8E93] font-mono">Lossless</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    id="png-scale-select"
                    value={pngScale}
                    onChange={(e) => setPngScale(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-[10px] bg-white border border-[#E7E7EA] text-xs font-medium text-[#0F1116] focus:outline-none focus:border-[#7141E8]"
                  >
                    <option value="1x (24px)">1x (24px)</option>
                    <option value="2x (48px)">2x (48px)</option>
                    <option value="4x (96px)">4x (96px)</option>
                    <option value="8x (192px)">8x (192px)</option>
                    <option value="512px (High Res)">512px (High Res)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleCopyPng}
                    className="px-3.5 h-9 rounded-[10px] bg-white hover:bg-[#F1F1F3] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-all hover:-translate-y-[1px] active:translate-y-0 shadow-2xs"
                  >
                    Copy PNG
                  </button>
                </div>
              </div>

              {/* Syntax-Styled Read-Only SVG Code Preview */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F1116]">
                  <span>SVG Markup Code</span>
                  <button
                    type="button"
                    onClick={handleCopySvg}
                    className="text-[11px] font-semibold text-[#7141E8] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy code</span>
                  </button>
                </div>

                <div className="relative rounded-[12px] bg-[#0F1116] text-[#F1F1F3] p-3 text-[11px] font-mono overflow-x-auto max-h-36 no-scrollbar border border-black/10">
                  <pre className="m-0 leading-relaxed">
                    <span className="text-[#B89AFF]">&lt;svg</span> <span className="text-[#38BDF8]">xmlns</span>=<span className="text-[#A7F3D0]">"http://www.w3.org/2000/svg"</span>{'\n'}
                    {'  '}<span className="text-[#38BDF8]">width</span>=<span className="text-[#A7F3D0]">"{size}"</span> <span className="text-[#38BDF8]">height</span>=<span className="text-[#A7F3D0]">"{size}"</span>{'\n'}
                    {'  '}<span className="text-[#38BDF8]">stroke</span>=<span className="text-[#A7F3D0]">"{fgColor}"</span> <span className="text-[#38BDF8]">stroke-width</span>=<span className="text-[#A7F3D0]">"{strokeWidth}"</span>{'\n'}
                    {'  '}<span className="text-[#38BDF8]">fill</span>=<span className="text-[#A7F3D0]">"none"</span><span className="text-[#B89AFF]">&gt;</span>{'\n'}
                    {'  '}<span className="text-[#64748B]">&lt;!-- {icon.name} from {icon.source} --&gt;</span>{'\n'}
                    {'  '}<span className="text-[#B89AFF]">&lt;path</span> <span className="text-[#38BDF8]">d</span>=<span className="text-[#A7F3D0]">"M..."</span><span className="text-[#B89AFF]">&gt;&lt;/path&gt;</span>{'\n'}
                    <span className="text-[#B89AFF]">&lt;/svg&gt;</span>
                  </pre>
                </div>
              </div>

              {/* License & Attribution Block */}
              <div className="p-3.5 rounded-[12px] bg-[#F7F7F8] border border-[#E7E7EA] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F1116] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#2EA45B]" />
                    <span>License Rights</span>
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#0F1116]">
                    {icon.license}
                  </span>
                </div>

                <p className="text-[11px] text-[#8E8E93] m-0 leading-normal">
                  Permitted for use in commercial, personal, open-source, and client design projects.
                  Redistribution and modifications are allowed under open license terms.
                </p>
              </div>

              {/* Pale Violet Informational Notice about Source Attribution */}
              <div className="p-3.5 rounded-[12px] bg-[#7141E8]/8 border border-[#7141E8]/20 flex items-start gap-2.5 text-xs text-[#0F1116]">
                <Sparkles className="w-4 h-4 text-[#7141E8] shrink-0 mt-0.5" />
                <p className="m-0 leading-relaxed text-[11px]">
                  <strong>Attribution Notice:</strong> Originally crafted by the{' '}
                  <span className="font-semibold text-[#7141E8]">{icon.source}</span> core library team.
                  Keeping source citations in code comments is recommended for community recognition.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Toast Feedback */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-6 right-6 z-60 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F1116] text-white text-xs font-semibold shadow-2xl border border-white/10"
              role="status"
              aria-live="polite"
            >
              <div className="w-4 h-4 rounded-full bg-[#2EA45B] flex items-center justify-center text-white shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  )
}
