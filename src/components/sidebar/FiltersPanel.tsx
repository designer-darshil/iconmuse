import React from "react";
import { cn } from "../../utils/cn";

export interface FiltersPanelProps {
  selectedStyles: string[];
  onToggleStyle: (style: string) => void;
  selectedLicenses: string[];
  onToggleLicense: (license: string) => void;
  iconSize: number;
  onChangeIconSize: (size: number) => void;
  onResetFilters: () => void;
  licenseCounts?: Record<string, number>;
  sourceCounts: Record<string, number>;
  selectedSources: string[];
  onToggleSource: (source: string) => void;
  activeCategory: string;
  activeColor: string;
  onSelectColor: (color: string) => void;
}

const STYLE_OPTIONS = ["Outline", "Solid", "Duotone", "Thin", "3D", "Gradient", "Illustration"];
const LICENSE_OPTIONS = ["MIT", "ISC", "Apache-2.0", "CC0-1.0", "BSD"];
const COLOR_OPTIONS = [
  { name: "Default", hex: "#0F1116" }, { name: "Violet", hex: "#7141E8" },
  { name: "Emerald", hex: "#10B981" }, { name: "Blue", hex: "#2563EB" },
  { name: "Rose", hex: "#E11D48" }, { name: "Amber", hex: "#D97706" },
  { name: "Slate", hex: "#64748B" },
];
const ILLUSTRATION_SOURCES = new Set([
  "Open Doodles", "Open Peeps", "Fluent Emoji", "Flowbite Illustrations", "Bioicons", "IRA Design",
]);
const SOURCE_MARKS: Record<string, { label: string; color: string; bg: string }> = {
  "Lucide": { label: "L", color: "#111827", bg: "#F3F4F6" },
  "Phosphor": { label: "P", color: "#4F46E5", bg: "#EEF2FF" },
  "Tabler": { label: "T", color: "#2563EB", bg: "#EFF6FF" },
  "Heroicons": { label: "H", color: "#111827", bg: "#F3F4F6" },
  "Simple Icons": { label: "Si", color: "#111827", bg: "#F3F4F6" },
  "Feather Icons": { label: "F", color: "#0F766E", bg: "#ECFDF5" },
  "Remix Icon": { label: "Ri", color: "#E11D48", bg: "#FFF1F2" },
  "Lineicons": { label: "Li", color: "#2563EB", bg: "#EFF6FF" },
  "Open Doodles": { label: "OD", color: "#7C3AED", bg: "#F5F3FF" },
  "Open Peeps": { label: "OP", color: "#C2410C", bg: "#FFF7ED" },
  "Fluent Emoji": { label: "FE", color: "#B45309", bg: "#FFFBEB" },
  "Flowbite Illustrations": { label: "FI", color: "#0284C7", bg: "#F0F9FF" },
  "Bioicons": { label: "B", color: "#059669", bg: "#ECFDF5" },
  "IRA Design": { label: "IRA", color: "#DB2777", bg: "#FDF2F8" },
};

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  selectedStyles, onToggleStyle, selectedLicenses, onToggleLicense,
  iconSize, onChangeIconSize, onResetFilters, licenseCounts = {},
  sourceCounts, selectedSources, onToggleSource, activeCategory, activeColor, onSelectColor,
}) => {
  const isIllustrationView = activeCategory === "illustrations";
  const libraries = Object.entries(sourceCounts)
    .filter(([source, count]) => count > 0 && ILLUSTRATION_SOURCES.has(source) === isIllustrationView)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex min-h-full flex-col gap-7 bg-white px-5 py-5">
      <section aria-labelledby="libraries-heading" className="flex flex-col gap-3" aria-busy={libraries.length === 0}>
        <div>
          <h3 id="libraries-heading" className="m-0 text-sm font-semibold text-[#0F1116]">
            {isIllustrationView ? "Illustration providers" : "Icon library providers"}
          </h3>
          <p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">Select one or more libraries.</p>
        </div>
        <div className="flex flex-col gap-1">
          {libraries.length === 0
            ? Object.keys(SOURCE_MARKS).filter((source) => ILLUSTRATION_SOURCES.has(source) === isIllustrationView).sort().map((source) => (
              <div key={source} aria-hidden="true" className="flex min-h-11 items-center gap-3 rounded-lg px-2.5">
                <span className="size-7 shrink-0 animate-pulse rounded-md bg-[var(--surface-strong)]" />
                <span className="h-3 w-28 animate-pulse rounded bg-[var(--surface-strong)]" />
                <span className="ml-auto h-3 w-8 animate-pulse rounded bg-[var(--surface-strong)]" />
              </div>
            ))
            : libraries.map(([source, count]) => {
            const selected = selectedSources.includes(source);
            const mark = SOURCE_MARKS[source] ?? { label: source.slice(0, 2), color: "#55555D", bg: "#F3F4F6" };
            return (
              <button
                key={source}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleSource(source)}
                className={cn("flex min-h-11 w-full items-center gap-3 rounded-lg px-2.5 text-left transition-colors",
                  selected ? "bg-[var(--selection-soft)] text-[var(--accent-text)]" : "text-[#303038] hover:bg-[#F7F7F8]")}
              >
                <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-md text-[10px] font-bold tracking-tight" style={{ color: mark.color, backgroundColor: mark.bg }}>{mark.label}</span>
                <span className={cn("min-w-0 flex-1 truncate text-sm", selected ? "font-semibold" : "font-medium")}>{source}</span>
                <span className="shrink-0 text-xs tabular-nums text-[#777780]">{count.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="style-heading" className="flex flex-col gap-4 border-t border-[#E7E7EA] pt-6">
        <div>
          <h3 id="style-heading" className="m-0 text-sm font-semibold text-[#0F1116]">Icon style</h3>
          <p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">Choose one or more styles.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_OPTIONS.map((style) => {
            const selected = selectedStyles.includes(style);
            return <button key={style} type="button" aria-pressed={selected} onClick={() => onToggleStyle(style)} className={cn("min-h-10 rounded-lg border px-3 text-left text-sm transition-colors", selected ? "border-[#7141E8] bg-[#F7F4FF] font-medium text-[#5630BD]" : "border-[#E7E7EA] bg-white text-[#55555D] hover:border-[#CFC9DE] hover:bg-[#FAF9FC]")}>{style}</button>;
          })}
        </div>
      </section>

      <section aria-labelledby="recolor-heading" className="mobile-recolor-filter flex flex-col gap-3 border-t border-[#E7E7EA] pt-6">
        <div>
          <h3 id="recolor-heading" className="m-0 text-sm font-semibold text-[#0F1116]">Icon color</h3>
          <p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">Choose the preview and export color.</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((color) => <button key={color.hex} type="button" aria-label={`${color.name} icon color`} aria-pressed={activeColor === color.hex} onClick={() => onSelectColor(color.hex)} className={cn("flex min-h-11 items-center gap-2 rounded-lg border px-2 text-xs font-medium transition-colors", activeColor === color.hex ? "border-[#7141E8] bg-[var(--selection-soft)] text-[var(--accent-text)]" : "border-[#E7E7EA] bg-white text-[#55555D] hover:bg-[#F7F7F8]")}><span className="size-4 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} /><span className="truncate">{color.name}</span></button>)}
        </div>
      </section>

      <section aria-labelledby="size-heading" className="flex flex-col gap-4 border-t border-[#E7E7EA] pt-6">
        <div className="flex items-baseline justify-between gap-3"><h3 id="size-heading" className="m-0 text-sm font-semibold text-[#0F1116]">Optical size</h3><span className="text-sm font-medium tabular-nums text-[#7141E8]">{iconSize} px</span></div>
        <input type="range" min="16" max="48" step="2" value={iconSize} onChange={(event) => onChangeIconSize(Number(event.target.value))} className="w-full accent-[#7141E8]" aria-label="Icon optical size" />
        <div className="flex justify-between text-[11px] text-[#8E8E93]" aria-hidden="true"><span>16 px</span><span>48 px</span></div>
      </section>

      <section aria-labelledby="license-heading" className="flex flex-col gap-3 border-t border-[#E7E7EA] pt-6">
        <div><h3 id="license-heading" className="m-0 text-sm font-semibold text-[#0F1116]">License</h3><p className="mb-0 mt-1 text-xs leading-relaxed text-[#777780]">Filter by asset license.</p></div>
        <div className="divide-y divide-[var(--line)]">
          {LICENSE_OPTIONS.map((license) => {
            const selected = selectedLicenses.includes(license);
            return <label key={license} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 py-2 text-sm"><span className="flex items-center gap-3 text-[#303038]"><input type="checkbox" checked={selected} onChange={() => onToggleLicense(license)} className="size-4 accent-[#7141E8]" />{license}</span><span className="text-xs tabular-nums text-[#8E8E93]">{(licenseCounts[license] ?? 0).toLocaleString()}</span></label>;
          })}
        </div>
      </section>

      <button type="button" onClick={onResetFilters} className="self-start py-1 text-xs font-medium text-[#7141E8] underline-offset-4 hover:underline">Reset filters</button>
    </div>
  );
};
