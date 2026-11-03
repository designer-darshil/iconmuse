import React, { useState } from "react";
import {
  Search,
  Download,
  Copy,
  Check,
  Sparkles,
  Trash2,
  SlidersHorizontal,
  Columns2,
  Bookmark,
  Code2,
  Layers,
  AlertCircle,
  Command,
  Heart,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownTriggerButton,
  DropdownItem,
  DropdownSectionLabel,
  DropdownSeparator,
  DropdownSelect,
} from "../ui/dropdown";
import { Modal } from "../ui/modal";
import { Tooltip } from "../ui/tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { ProviderLogo } from "../common/ProviderLogo";
import { COLOR_OPTIONS } from "../workspace/MainToolbar";
import { cn } from "../../utils/cn";

export interface ComponentsSectionProps {
  onShowToast: (msg: string) => void;
}

export const ComponentsSection: React.FC<ComponentsSectionProps> = ({
  onShowToast,
}) => {
  // Interactive Dropdown Demo States
  const [isLibraryDropdownOpen, setIsLibraryDropdownOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<string>("Lucide");
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("#7141E8");
  const [exportScale, setExportScale] = useState<string>("2x (48px)");
  const [isSplitOpen, setIsSplitOpen] = useState(false);

  // Interactive Modal Demo States
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCompareDemoOpen, setIsCompareDemoOpen] = useState(false);

  // Interactive Input & Tile Demo States
  const [demoSearch, setDemoSearch] = useState("sparkles");
  const [demoSize, setDemoSize] = useState(32);
  const [tileSaved, setTileSaved] = useState(true);
  const [tileCopied, setTileCopied] = useState(false);
  const [tileCompared, setTileCompared] = useState(false);

  return (
    <div className="flex flex-col gap-16">
      {/* ==================== 4. COMPONENTS ==================== */}
      <section id="components" className="scroll-mt-24 flex flex-col gap-10">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-5">
          <Badge variant="violet" dot className="w-fit">
            Section 04 · Components
          </Badge>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            Reusable UI Components & Live Interactive Previews
          </h2>
          <p className="m-0 max-w-3xl text-xs sm:text-sm text-[var(--muted)]">
            Every component below is imported directly from{" "}
            <code className="font-mono">src/components/ui/*</code> and{" "}
            <code className="font-mono">src/components/workspace/*</code>—ensuring a 1:1
            match with the production workspace.
          </p>
        </div>

        {/* 4A. Buttons */}
        <Card variant="default">
          <CardHeader className="border-b border-[var(--line)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Buttons & Action Triggers</CardTitle>
                <CardDescription>
                  Supports 7 semantic variants, 6 size scales (including full-pill toolbar triggers),
                  icon slots, and loading spinners.
                </CardDescription>
              </div>
              <code className="rounded bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--accent-text)]">
                src/components/ui/button.tsx
              </code>
            </div>
          </CardHeader>
          <CardContent className="pt-5 flex flex-col gap-6">
            <div>
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Variants
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="default"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                  onClick={() => onShowToast("Primary Button clicked")}
                >
                  Download SVG
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Bookmark className="h-3.5 w-3.5" />}
                  onClick={() => onShowToast("Secondary Button clicked")}
                >
                  Saved to Collection
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Copy className="h-3.5 w-3.5" />}
                  onClick={() => onShowToast("Outline Button clicked")}
                >
                  Copy Markup
                </Button>
                <Button
                  variant="subtle"
                  leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
                >
                  Filter Icons
                </Button>
                <Button variant="ghost">Reset All</Button>
                <Button
                  variant="destructive"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Delete Pack
                </Button>
                <Button variant="link">View License Docs</Button>
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-5">
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Sizes & Pill Triggers
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button size="xs" variant="outline">
                  Extra Small (28px)
                </Button>
                <Button size="sm" variant="outline">
                  Small (36px)
                </Button>
                <Button size="default" variant="outline">
                  Default (40px)
                </Button>
                <Button size="lg" variant="default">
                  Large (44px)
                </Button>
                <Button
                  size="pill"
                  variant="default"
                  leftIcon={<Columns2 className="h-3.5 w-3.5" />}
                >
                  Compare (3)
                </Button>
                <Button size="icon" variant="outline" aria-label="Favorite icon">
                  <Heart className="h-4 w-4 text-[var(--violet)]" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4B. Reimagined Dropdown Menus */}
        <Card variant="default">
          <CardHeader className="border-b border-[var(--line)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Refined Dropdown Menus & Popovers</CardTitle>
                <CardDescription>
                  Unified popover architecture with Framer Motion entrance, keyboard arrow navigation
                  (Up/Down/Home/End/Esc), section dividers, provider icons, and active checkmarks.
                </CardDescription>
              </div>
              <code className="rounded bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--accent-text)]">
                src/components/ui/dropdown.tsx
              </code>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {/* 1. Library & Category Dropdown */}
              <div className="flex flex-col gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  1. Library Scope Dropdown
                </span>
                <p className="m-0 text-xs text-[var(--muted)]">
                  Used in <code className="font-mono">MainToolbar</code> to filter by icon provider or topic.
                </p>
                <div className="mt-2">
                  <DropdownMenu
                    isOpen={isLibraryDropdownOpen}
                    onClose={() => setIsLibraryDropdownOpen(false)}
                    widthClassName="w-60"
                    ariaLabel="Demo library filter"
                    trigger={
                      <DropdownTriggerButton
                        isOpen={isLibraryDropdownOpen}
                        size="lg"
                        variant="pill"
                        onClick={() => setIsLibraryDropdownOpen((o) => !o)}
                        leftSlot={
                          <ProviderLogo
                            source={selectedLibrary}
                            className="size-5 rounded"
                            size={12}
                          />
                        }
                        className="w-full bg-[var(--canvas)]"
                      >
                        {selectedLibrary}
                      </DropdownTriggerButton>
                    }
                  >
                    <DropdownSectionLabel>Libraries</DropdownSectionLabel>
                    {[
                      { name: "Lucide", count: "1,540" },
                      { name: "Phosphor", count: "9,072" },
                      { name: "Tabler", count: "4,964" },
                      { name: "Heroicons", count: "1,288" },
                    ].map((lib) => (
                      <DropdownItem
                        key={lib.name}
                        selected={selectedLibrary === lib.name}
                        icon={
                          <ProviderLogo
                            source={lib.name}
                            className="size-5 rounded"
                            size={12}
                          />
                        }
                        meta={lib.count}
                        onClick={() => {
                          setSelectedLibrary(lib.name);
                          setIsLibraryDropdownOpen(false);
                          onShowToast(`Selected library: ${lib.name}`);
                        }}
                      >
                        {lib.name}
                      </DropdownItem>
                    ))}
                    <DropdownSeparator />
                    <DropdownSectionLabel>Categories</DropdownSectionLabel>
                    <DropdownItem
                      selected={selectedLibrary === "Interface & UI"}
                      meta="3,420"
                      onClick={() => {
                        setSelectedLibrary("Interface & UI");
                        setIsLibraryDropdownOpen(false);
                      }}
                    >
                      Interface & UI
                    </DropdownItem>
                  </DropdownMenu>
                </div>
              </div>

              {/* 2. Recolor Swatch Dropdown */}
              <div className="flex flex-col gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  2. Recolor Swatch Menu
                </span>
                <p className="m-0 text-xs text-[var(--muted)]">
                  Live color picker with conic gradient indicator and hex readouts.
                </p>
                <div className="mt-2">
                  <DropdownMenu
                    isOpen={isColorDropdownOpen}
                    onClose={() => setIsColorDropdownOpen(false)}
                    widthClassName="w-52"
                    ariaLabel="Demo recolor menu"
                    trigger={
                      <DropdownTriggerButton
                        isOpen={isColorDropdownOpen}
                        size="lg"
                        variant="pill"
                        onClick={() => setIsColorDropdownOpen((o) => !o)}
                        leftSlot={
                          <span
                            className="h-4 w-4 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: selectedColor }}
                          />
                        }
                        className="w-full bg-[var(--canvas)]"
                      >
                        {COLOR_OPTIONS.find((c) => c.hex === selectedColor)?.name ??
                          "Recolor"}
                      </DropdownTriggerButton>
                    }
                  >
                    <DropdownSectionLabel>Icon Color Preset</DropdownSectionLabel>
                    {COLOR_OPTIONS.map((c) => (
                      <DropdownItem
                        key={c.name}
                        selected={selectedColor === c.hex}
                        icon={
                          <span
                            className="block h-3.5 w-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: c.hex }}
                          />
                        }
                        meta={<span className="font-mono text-[10px]">{c.hex}</span>}
                        onClick={() => {
                          setSelectedColor(c.hex);
                          setIsColorDropdownOpen(false);
                          onShowToast(`Applied color: ${c.name} (${c.hex})`);
                        }}
                      >
                        {c.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </div>
              </div>

              {/* 3. PNG Scale DropdownSelect */}
              <div className="flex flex-col gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  3. Select Dropdown
                </span>
                <p className="m-0 text-xs text-[var(--muted)]">
                  Used in <code className="font-mono">IconDetailModal</code> for raster PNG resolution export.
                </p>
                <div className="mt-2">
                  <DropdownSelect
                    ariaLabel="PNG export scale"
                    value={exportScale}
                    onChange={(val) => {
                      setExportScale(val);
                      onShowToast(`Export scale set to ${val}`);
                    }}
                    size="default"
                    className="w-full"
                    options={[
                      { value: "1x (24px)", label: "1x (24px)", meta: "24×24" },
                      { value: "2x (48px)", label: "2x (48px)", meta: "48×48" },
                      { value: "4x (96px)", label: "4x (96px)", meta: "96×96" },
                      { value: "8x (192px)", label: "8x (192px)", meta: "192×192" },
                      { value: "512px (High Res)", label: "512px", meta: "High Res" },
                    ]}
                  />
                </div>
              </div>

              {/* 4. Split-Button Code Copy Menu */}
              <div className="flex flex-col gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  4. Split-Action Menu
                </span>
                <p className="m-0 text-xs text-[var(--muted)]">
                  Combines primary one-click Copy SVG with a secondary format menu.
                </p>
                <div className="mt-2 relative">
                  <DropdownMenu
                    isOpen={isSplitOpen}
                    onClose={() => setIsSplitOpen(false)}
                    align="right"
                    widthClassName="w-60"
                    containerClassName="w-full"
                    trigger={
                      <div className="flex w-full overflow-hidden rounded-[11px] shadow-[var(--shadow-subtle)]">
                        <button
                          type="button"
                          onClick={() => onShowToast("Copied raw SVG to clipboard")}
                          className="flex h-10 flex-1 items-center justify-center gap-2 bg-[var(--violet)] px-3 text-xs font-semibold text-white hover:bg-[var(--violet-hover)]"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy SVG</span>
                        </button>
                        <button
                          type="button"
                          aria-label="Open format menu"
                          aria-expanded={isSplitOpen}
                          onClick={() => setIsSplitOpen((o) => !o)}
                          className="flex h-10 w-9 items-center justify-center border-l border-white/20 bg-[var(--violet)] text-white hover:bg-[var(--violet-hover)]"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    }
                  >
                    <DropdownSectionLabel>Copy Format</DropdownSectionLabel>
                    <DropdownItem
                      icon={<Copy className="h-3.5 w-3.5 text-[#7141E8]" />}
                      description="Inline vector markup with custom attributes"
                      meta={<span className="font-mono text-[10px]">&lt;svg&gt;</span>}
                      onClick={() => {
                        setIsSplitOpen(false);
                        onShowToast("Copied SVG Markup");
                      }}
                    >
                      Copy SVG Markup
                    </DropdownItem>
                    <DropdownItem
                      icon={<Code2 className="h-3.5 w-3.5 text-[#7141E8]" />}
                      description="Ready-to-use React component snippet"
                      meta={<span className="font-mono text-[10px]">JSX</span>}
                      onClick={() => {
                        setIsSplitOpen(false);
                        onShowToast("Copied React JSX Component");
                      }}
                    >
                      Copy React JSX
                    </DropdownItem>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4C. Reimagined Modals & Dialogs */}
        <Card variant="default">
          <CardHeader className="border-b border-[var(--line)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Modal Dialogs & Overlays</CardTitle>
                <CardDescription>
                  Standardized modal container with blurred backdrop, focus trapping, Escape
                  shortcut badge, scroll locking, and responsive mobile sheet adaptation.
                </CardDescription>
              </div>
              <code className="rounded bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--accent-text)]">
                src/components/ui/modal.tsx
              </code>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col justify-between gap-4 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="violet">Standard Dialog</Badge>
                    <span className="font-mono text-[11px] text-[var(--muted)]">
                      max-w-lg · 22px radius
                    </span>
                  </div>
                  <h4 className="m-0 mt-3 text-sm font-bold text-[var(--ink)]">
                    Interactive Export & Attribution Modal
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    Features an icon badge header, subtitle, <code className="font-mono">Esc</code>{" "}
                    key indicator, scrollable content body, and sticky footer action bar.
                  </p>
                </div>
                <Button
                  variant="default"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-fit"
                >
                  Launch Dialog Modal
                </Button>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">Optical Comparison Modal</Badge>
                    <span className="font-mono text-[11px] text-[var(--muted)]">
                      max-w-4xl · Multi-Column
                    </span>
                  </div>
                  <h4 className="m-0 mt-3 text-sm font-bold text-[var(--ink)]">
                    Side-by-Side Optical Scale Inspector
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-relaxed text-[var(--muted)]">
                    Compares icons across 48px, 32px, 24px, and 16px optical scales with source,
                    category, and license metadata rows.
                  </p>
                </div>
                <Button
                  variant="outline"
                  leftIcon={<Columns2 className="h-3.5 w-3.5 text-[var(--violet)]" />}
                  onClick={() => setIsCompareDemoOpen(true)}
                  className="w-fit"
                >
                  Preview Compare Modal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4D. Inputs, Search & Range Controls */}
        <Card variant="default">
          <CardHeader className="border-b border-[var(--line)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Inputs, Search & Range Controls</CardTitle>
                <CardDescription>
                  Form controls engineered for instant filtering, color hex entry, and optical size customization.
                </CardDescription>
              </div>
              <code className="rounded bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--accent-text)]">
                src/components/ui/input.tsx
              </code>
            </div>
          </CardHeader>
          <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[var(--ink)]">
                Elevated Workspace Search Input
              </label>
              <div className="flex h-11 items-center rounded-[14px] border border-[var(--line)] bg-[var(--canvas)] px-3.5 shadow-[var(--shadow-card)] focus-within:border-[var(--violet)]">
                <Search className="mr-2.5 h-4 w-4 text-[var(--muted)] shrink-0" />
                <input
                  type="text"
                  value={demoSearch}
                  onChange={(e) => setDemoSearch(e.target.value)}
                  placeholder="Search icons…"
                  className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-[var(--ink)] outline-none"
                />
                <kbd className="inline-flex items-center gap-0.5 rounded-[5px] border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--muted)]">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </div>
              <span className="text-[11px] text-[var(--muted)]">
                16px radius in toolbar, ⌘K global shortcut focus.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[var(--ink)]">
                Standard & Validation Error Inputs
              </label>
              <Input
                inputSize="default"
                placeholder="New collection name (e.g. FinTech UI)"
                defaultValue="Marketing Launch Icons"
              />
              <Input
                inputSize="sm"
                hasError
                defaultValue="Invalid hex #GGGGGG"
                aria-label="Invalid hex input example"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink)]">
                <label htmlFor="ds-demo-slider">Optical Icon Size Slider</label>
                <span className="font-mono text-[var(--accent-text)]">{demoSize}px</span>
              </div>
              <input
                id="ds-demo-slider"
                type="range"
                min={16}
                max={48}
                step={2}
                value={demoSize}
                onChange={(e) => setDemoSize(Number(e.target.value))}
                className="w-full accent-[#7141E8]"
              />
              <div className="flex justify-between font-mono text-[10px] text-[var(--muted)]">
                <span>16px</span>
                <span>24px</span>
                <span>32px</span>
                <span>48px</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4E. Cards, Badges, Tooltips & Interactive IconTile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Badges & Tooltips */}
          <Card variant="default">
            <CardHeader className="border-b border-[var(--line)]">
              <CardTitle>Badges, Chips & Tooltips</CardTitle>
              <CardDescription>
                Semantic status pills, provider tags, and keyboard-accessible hover/focus tooltips.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 flex flex-col gap-5">
              <div>
                <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Badge Variants
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Primary</Badge>
                  <Badge variant="violet" dot>
                    Active Filter
                  </Badge>
                  <Badge variant="secondary">Lucide · 1,540</Badge>
                  <Badge variant="outline">MIT License</Badge>
                  <Badge variant="success" dot>
                    WCAG AAA Pass
                  </Badge>
                  <Badge variant="info">v2.4 Shard</Badge>
                  <Badge variant="warning">CC-BY Attribution</Badge>
                  <Badge variant="destructive">Deprecated</Badge>
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-4">
                <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Interactive Tooltips (Hover or Focus)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip content="Search all icon libraries" shortcut="⌘K" side="top">
                    <Button variant="outline" size="sm">
                      Top Tooltip (⌘K)
                    </Button>
                  </Tooltip>
                  <Tooltip content="Copy raw SVG code to clipboard" side="bottom">
                    <Button variant="subtle" size="sm">
                      Bottom Tooltip
                    </Button>
                  </Tooltip>
                  <Tooltip content="Add up to 4 icons to side-by-side compare" side="right">
                    <Button variant="outline" size="sm">
                      Right Tooltip
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive IconTile & Pack Card Specimen */}
          <Card variant="default">
            <CardHeader className="border-b border-[var(--line)]">
              <CardTitle>Workspace Icon Tile & Pack Card</CardTitle>
              <CardDescription>
                Live interactive specimen of the production <code className="font-mono">IconTile</code>{" "}
                component synced with the {demoSize}px size slider and {selectedColor} color preset.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Live IconTile */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onShowToast("Opened Sparkles in IconDetailModal")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  onShowToast("Opened Sparkles in IconDetailModal")
                }
                className="icon-tile group relative flex h-[168px] flex-col items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--ink)] cursor-pointer select-none transition-colors hover:border-[var(--selection)]"
              >
                <div className="flex h-6 w-full items-center justify-between">
                  <Badge variant="violet" size="sm">
                    Live Specimen
                  </Badge>
                  <button
                    type="button"
                    aria-pressed={tileSaved}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTileSaved((s) => !s);
                    }}
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface-strong)]",
                      tileSaved && "text-[var(--selection)]",
                    )}
                    aria-label="Toggle save icon"
                  >
                    <Heart className={cn("h-4 w-4", tileSaved && "fill-current")} />
                  </button>
                </div>

                <div className="flex flex-1 items-center justify-center">
                  <Sparkles
                    className="transition-transform duration-150 group-hover:scale-105"
                    style={{
                      width: `${demoSize}px`,
                      height: `${demoSize}px`,
                      color: selectedColor,
                    }}
                  />
                </div>

                <p className="m-0 text-[13px] font-medium text-[var(--ink)]">sparkles</p>

                <div className="mt-1.5 flex w-full items-center justify-between gap-1">
                  <span className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                    Lucide
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTileCopied(true);
                        onShowToast("Copied sparkles.svg");
                        setTimeout(() => setTileCopied(false), 1400);
                      }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
                      aria-label="Copy SVG"
                    >
                      {tileCopied ? (
                        <Check className="h-3.5 w-3.5 text-[var(--success)]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-pressed={tileCompared}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTileCompared((c) => !c);
                      }}
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-strong)]",
                        tileCompared && "bg-[var(--selection-soft)] text-[var(--selection)]",
                      )}
                      aria-label="Toggle compare"
                    >
                      <Columns2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Card Specimen */}
              <Card variant="interactive" onClick={() => onShowToast("Selected AI & Magic Pack")}>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#7141E8]/12 text-[#7141E8]">
                      <Layers className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" size="sm">
                      48 icons
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">Interface Essentials</CardTitle>
                  <CardDescription>
                    Curated navigation, modal, and toolbar icons for modern web apps.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="px-4 py-2.5 text-[11px] font-semibold text-[var(--accent-text)]">
                  <span>Inspect pack</span>
                  <span>→</span>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ==================== 5. COMPONENT STATES ==================== */}
      <section id="states" className="scroll-mt-24 flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-5">
          <Badge variant="violet" dot className="w-fit">
            Section 05 · Component States
          </Badge>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            Interactive State Matrix (Default, Hover, Focus, Active, Disabled, Loading & Error)
          </h2>
          <p className="m-0 max-w-3xl text-xs sm:text-sm text-[var(--muted)]">
            Consistent visual feedback across every interaction state guarantees predictable
            usability for mouse, touch, and keyboard users.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>State</TableHead>
              <TableHead>Visual Specification</TableHead>
              <TableHead>Button Specimen</TableHead>
              <TableHead>Input / Control Specimen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">Default (Resting)</TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                1px border <code className="font-mono">var(--line)</code>, resting surface{" "}
                <code className="font-mono">var(--canvas)</code> or{" "}
                <code className="font-mono">var(--violet)</code>.
              </TableCell>
              <TableCell>
                <Button size="sm" variant="default">
                  Default Action
                </Button>
              </TableCell>
              <TableCell>
                <Input inputSize="sm" defaultValue="Resting input value" className="max-w-[200px]" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">Hover</TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Subtle <code className="font-mono">-0.5px</code> lift, darkened primary{" "}
                <code className="font-mono">var(--violet-hover)</code>, or border contrast increase.
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="default"
                  className="-translate-y-[1px] bg-[var(--violet-hover)] shadow-md"
                >
                  Hovered State
                </Button>
              </TableCell>
              <TableCell>
                <Input
                  inputSize="sm"
                  defaultValue="Hovered border"
                  className="flex h-8 w-full max-w-[200px] rounded-[var(--radius-xs)] border border-[var(--line-strong)] bg-[var(--surface)] px-2.5 text-xs text-[var(--ink)]"
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">Focus-Visible (Keyboard)</TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Global <code className="font-mono">2px solid var(--violet)</code> outline with{" "}
                <code className="font-mono">2px</code> offset for unmistakable keyboard tracking.
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="outline-2 outline-[var(--violet)] outline-offset-2"
                >
                  Focused Control
                </Button>
              </TableCell>
              <TableCell>
                <Input
                  inputSize="sm"
                  defaultValue="Keyboard focus ring"
                  className="flex h-8 w-full max-w-[200px] rounded-[var(--radius-xs)] border border-[var(--violet)] bg-[var(--canvas)] px-2.5 text-xs text-[var(--ink)] outline-2 outline-[var(--violet)] outline-offset-2"
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">
                Active / Selected (<code className="font-mono">aria-pressed</code>)
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Tinted surface <code className="font-mono">var(--selection-soft)</code> with high-contrast{" "}
                <code className="font-mono">var(--accent-text)</code> foreground.
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  aria-pressed="true"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--selection)] bg-[var(--selection-soft)] px-3.5 text-xs font-semibold text-[var(--accent-text)]"
                >
                  <Check className="h-3.5 w-3.5" />
                  Selected Chip
                </button>
              </TableCell>
              <TableCell>
                <Badge variant="violet" dot>
                  aria-selected=&quot;true&quot;
                </Badge>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">Disabled</TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Reduced <code className="font-mono">45%</code> opacity,{" "}
                <code className="font-mono">cursor: not-allowed</code>, pointer events suppressed.
              </TableCell>
              <TableCell>
                <Button size="sm" variant="default" disabled>
                  Disabled Action
                </Button>
              </TableCell>
              <TableCell>
                <Input inputSize="sm" disabled defaultValue="Disabled input" className="max-w-[200px]" />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">Loading / Busy</TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Inline spinning indicator (<code className="font-mono">aria-busy=&quot;true&quot;</code>)
                or pulsing surface skeleton placeholder.
              </TableCell>
              <TableCell>
                <Button size="sm" variant="default" isLoading>
                  Exporting ZIP…
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 animate-pulse rounded-md bg-[var(--surface-strong)]" />
                  <span className="h-3 w-28 animate-pulse rounded bg-[var(--surface-strong)]" />
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">Error / Destructive</TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Semantic crimson <code className="font-mono">var(--danger)</code> border and text
                with <code className="font-mono">var(--danger-subtle)</code> surface tint.
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="destructive"
                  leftIcon={<AlertCircle className="h-3.5 w-3.5" />}
                >
                  Remove Saved
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 max-w-[200px]">
                  <Input inputSize="sm" hasError defaultValue="Invalid SVG viewBox" />
                  <span className="text-[10px] font-medium text-[var(--danger)]">
                    Must contain 4 numeric bounds
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Live Demo Modal 1: Standard Dialog */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        size="md"
        icon={<Sparkles className="h-4 w-4" />}
        title="Export Collection Bundle"
        subtitle="Package 12 customized SVG icons with license metadata"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={() => {
                setIsDemoModalOpen(false);
                onShowToast("Downloaded collection-bundle.zip");
              }}
            >
              Download ZIP Archive
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="m-0 text-xs leading-relaxed text-[var(--muted)]">
            This live modal uses the reusable <code className="font-mono">Modal</code> component
            from <code className="font-mono">src/components/ui/modal.tsx</code>. Press{" "}
            <kbd className="rounded border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            or click the backdrop to dismiss.
          </p>
          <div className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--ink)]">Included Libraries</span>
              <Badge variant="violet" size="sm">
                MIT & ISC
              </Badge>
            </div>
            <p className="m-0 text-[11px] text-[var(--muted)]">
              Includes an <code className="font-mono">ATTRIBUTION.txt</code> manifest alongside
              optimized 24×24 SVG files.
            </p>
          </div>
        </div>
      </Modal>

      {/* Live Demo Modal 2: Side-by-Side Optical Comparison */}
      <Modal
        isOpen={isCompareDemoOpen}
        onClose={() => setIsCompareDemoOpen(false)}
        size="lg"
        icon={<Columns2 className="h-4 w-4" />}
        title="Optical Scale Comparison Preview"
        subtitle="Inspecting stroke balance across 48px, 32px, 24px, and 16px"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "sparkles", source: "Lucide", license: "ISC", Icon: Sparkles },
            { name: "layers", source: "Tabler", license: "MIT", Icon: Layers },
          ].map(({ name, source, license, Icon }) => (
            <div
              key={name}
              className="flex flex-col gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <div className="flex h-24 items-center justify-center rounded-[12px] border border-[var(--line)] bg-[var(--canvas)] relative">
                <Icon className="h-12 w-12" style={{ color: selectedColor }} />
                <span className="absolute bottom-2 right-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                  48px
                </span>
              </div>
              <div className="flex items-center justify-around rounded-[10px] border border-[var(--line)] bg-[var(--canvas)] py-2">
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-8 w-8" style={{ color: selectedColor }} />
                  <span className="font-mono text-[9px] text-[var(--muted)]">32px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-6 w-6" style={{ color: selectedColor }} />
                  <span className="font-mono text-[9px] text-[var(--muted)]">24px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-4 w-4" style={{ color: selectedColor }} />
                  <span className="font-mono text-[9px] text-[var(--muted)]">16px</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--ink)]">{name}</span>
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  {source} · {license}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
