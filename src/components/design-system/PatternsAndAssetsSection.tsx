import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  Layers,
  Shield,
  SlidersHorizontal,
  Download,
  Heart,
  Search,
  Columns2,
  Bookmark,
  Box,
  Cpu,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { ProviderLogo } from "../common/ProviderLogo";
import { BrandLogo } from "../common/BrandLogo";
import type { IconSource } from "../../types";
import { cn } from "../../utils/cn";

const INTEGRATED_LIBRARIES: Array<{
  name: IconSource;
  license: string;
  type: "Icons" | "Illustrations";
  defaultGrid: string;
}> = [
  { name: "Lucide", license: "ISC", type: "Icons", defaultGrid: "24×24px" },
  { name: "Phosphor", license: "MIT", type: "Icons", defaultGrid: "256×256px" },
  { name: "Tabler", license: "MIT", type: "Icons", defaultGrid: "24×24px" },
  { name: "Heroicons", license: "MIT", type: "Icons", defaultGrid: "24×24px" },
  { name: "Simple Icons", license: "CC0-1.0", type: "Icons", defaultGrid: "24×24px" },
  { name: "Feather Icons", license: "MIT", type: "Icons", defaultGrid: "24×24px" },
  { name: "Remix Icon", license: "Apache-2.0", type: "Icons", defaultGrid: "24×24px" },
  { name: "Lineicons", license: "MIT", type: "Icons", defaultGrid: "24×24px" },
  { name: "Material Symbols", license: "Apache-2.0", type: "Icons", defaultGrid: "24×24px" },
  { name: "Fluent System Icons", license: "MIT", type: "Icons", defaultGrid: "24×24px" },
  { name: "Carbon Icons", license: "Apache-2.0", type: "Icons", defaultGrid: "32×32px" },
  { name: "Bootstrap Icons", license: "MIT", type: "Icons", defaultGrid: "16×16px" },
  { name: "MingCute Icons", license: "Apache-2.0", type: "Icons", defaultGrid: "24×24px" },
  { name: "Glass Icons", license: "CC-BY-4.0", type: "Icons", defaultGrid: "24×24px" },
  { name: "Open Doodles", license: "CC0-1.0", type: "Illustrations", defaultGrid: "Scalable" },
  { name: "Open Peeps", license: "CC0-1.0", type: "Illustrations", defaultGrid: "Scalable" },
  { name: "Fluent Emoji", license: "MIT", type: "Illustrations", defaultGrid: "32×32px" },
  { name: "Flowbite Illustrations", license: "MIT", type: "Illustrations", defaultGrid: "Scalable" },
  { name: "Bioicons", license: "CC0 / BSD", type: "Illustrations", defaultGrid: "Scalable" },
];

const SPECIMEN_ICONS = [
  { name: "compass", Icon: Compass },
  { name: "sparkles", Icon: Sparkles },
  { name: "layers", Icon: Layers },
  { name: "shield", Icon: Shield },
  { name: "sliders", Icon: SlidersHorizontal },
  { name: "download", Icon: Download },
  { name: "heart", Icon: Heart },
  { name: "search", Icon: Search },
  { name: "columns", Icon: Columns2 },
  { name: "bookmark", Icon: Bookmark },
  { name: "box", Icon: Box },
  { name: "cpu", Icon: Cpu },
];

export const PatternsAndAssetsSection: React.FC = () => {
  const [strokeWeight, setStrokeWeight] = useState<number>(2);
  const [opticalSize, setOpticalSize] = useState<number>(28);

  return (
    <div className="flex flex-col gap-16">
      {/* ==================== 6. PATTERNS & LAYOUTS ==================== */}
      <section id="patterns" className="scroll-mt-24 flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-5">
          <Badge variant="violet" dot className="w-fit">
            Section 06 · Patterns & Layouts
          </Badge>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            Workspace Shell Architecture, Overlays & Responsive Behavior
          </h2>
          <p className="m-0 max-w-3xl text-xs sm:text-sm text-[var(--muted)]">
            IconMuse preserves a fixed, non-scrolling viewport shell (<code className="font-mono">100dvh</code>)
            on the main catalog route, delegating vertical scrolling independently to the
            icon grid and contextual right inspector.
          </p>
        </div>

        {/* Visual Shell Diagram */}
        <Card variant="default">
          <CardHeader className="border-b border-[var(--line)]">
            <CardTitle>3-Column Application Shell Pattern</CardTitle>
            <CardDescription>
              Defined in <code className="font-mono">src/styles/_layout.scss</code> via CSS Grid{" "}
              <code className="font-mono">grid-template-columns: var(--rail-width) 1fr var(--sidebar-width)</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4">
              {/* Mock Header */}
              <div className="mb-2.5 flex h-10 items-center justify-between rounded-[10px] border border-[var(--line)] bg-[var(--canvas)] px-3 text-xs">
                <span className="font-bold text-[var(--ink)]">
                  DesktopHeader · 64px (--header-height)
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="violet" size="sm">
                    Icons / Illustrations
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    Theme Toggle
                  </Badge>
                </div>
              </div>

              {/* Mock 3-column body */}
              <div className="grid grid-cols-1 md:grid-cols-[72px_1fr_220px] gap-2.5">
                <div className="flex flex-row md:flex-col items-center justify-between rounded-[10px] border border-[var(--line)] bg-[var(--canvas)] p-2.5 text-center">
                  <span className="font-mono text-[10px] font-bold text-[var(--accent-text)]">
                    LeftNavRail
                  </span>
                  <span className="font-mono text-[10px] text-[var(--muted)]">72px</span>
                </div>

                <div className="flex flex-col gap-2 rounded-[10px] border border-[var(--selection)]/40 bg-[var(--canvas)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)]">
                      MainWorkspace (1fr Fluid Column)
                    </span>
                    <Badge variant="violet" size="sm">
                      Independent Scroll
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-[11px]">
                      <strong className="block text-[var(--ink)]">1. MainToolbar</strong>
                      <span className="text-[var(--muted)]">
                        Scope dropdown + ⌘K search + Recolor
                      </span>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-[11px]">
                      <strong className="block text-[var(--ink)]">2. SortRow</strong>
                      <span className="text-[var(--muted)]">
                        Sort tabs + Compare trigger + Density
                      </span>
                    </div>
                    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-[11px]">
                      <strong className="block text-[var(--ink)]">3. IconGrid</strong>
                      <span className="text-[var(--muted)]">
                        Batched 72-item responsive SVG grid
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[10px] border border-[var(--line)] bg-[var(--canvas)] p-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[var(--accent-text)]">
                      RightSidebar (360px)
                    </span>
                    <p className="m-0 mt-1 text-[11px] text-[var(--muted)]">
                      Contextual Filters, Packs, Saved Collections & Help panels. Docks on desktop
                      or floats/overlays on tablet & mobile.
                    </p>
                  </div>
                  <span className="mt-2 font-mono text-[10px] text-[var(--muted)]">
                    --sidebar-width: 360px
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Breakpoint Specification Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Breakpoint Tier</TableHead>
              <TableHead>Viewport Range</TableHead>
              <TableHead>Main Workspace Shell</TableHead>
              <TableHead>Design System Navigation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">
                Desktop (<code className="font-mono">desktop</code>)
              </TableCell>
              <TableCell className="font-mono text-xs text-[var(--accent-text)]">
                &gt;= 1280px
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                3-column grid: 72px LeftNavRail + 1fr MainWorkspace + 360px docked RightSidebar.
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Persistent 272px left documentation sidebar with active scroll-spy indicators.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">
                Tablet (<code className="font-mono">tablet</code>)
              </TableCell>
              <TableCell className="font-mono text-xs text-[var(--accent-text)]">
                768px – 1279px
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                2-column grid: 72px LeftNavRail + 1fr MainWorkspace; RightSidebar opens as a
                backdrop overlay drawer.
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Collapsible compact sidebar (expandable from 64px icon rail to 256px) to maximize
                documentation content width.
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-[var(--ink)]">
                Mobile (<code className="font-mono">mobile</code>)
              </TableCell>
              <TableCell className="font-mono text-xs text-[var(--accent-text)]">
                &lt; 768px (xs: 480px)
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Sticky 100px MobileTopBar + horizontal category chip strip + slide-out MobileDrawer
                with 44px minimum touch targets.
              </TableCell>
              <TableCell className="text-xs text-[var(--muted)]">
                Hamburger menu with slide-out navigation drawer (auto-closes on section select) plus
                compact quick-jump dropdown.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* ==================== 7. ICONS & ASSETS ==================== */}
      <section id="icons" className="scroll-mt-24 flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-5">
          <Badge variant="violet" dot className="w-fit">
            Section 07 · Icons & Assets
          </Badge>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            Iconography Guidelines, Optical Grid & Provider Ecosystem
          </h2>
          <p className="m-0 max-w-3xl text-xs sm:text-sm text-[var(--muted)]">
            Standards for stroke weights, optical alignment, brand marks, and the 19 open-source
            libraries integrated into the IconMuse catalog.
          </p>
        </div>

        {/* Interactive Optical Grid & Stroke Weight Lab */}
        <Card variant="default">
          <CardHeader className="border-b border-[var(--line)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Interactive Stroke Weight & Optical Sizing Inspector</CardTitle>
                <CardDescription>
                  Test how 24×24 vector icons render across stroke weights (1.0px–3.0px) and
                  optical canvas sizes (16px–40px).
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { label: "Thin 1.25", value: 1.25 },
                    { label: "Regular 1.75", value: 1.75 },
                    { label: "Default 2.0", value: 2 },
                    { label: "Bold 2.5", value: 2.5 },
                  ] as const
                ).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={strokeWeight === preset.value}
                    onClick={() => setStrokeWeight(preset.value)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                      strokeWeight === preset.value
                        ? "border-[var(--selection)] bg-[var(--selection-soft)] text-[var(--accent-text)]"
                        : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]",
                    )}
                  >
                    {preset.label}px
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[var(--ink)]">Optical Size:</span>
                {[16, 20, 24, 28, 32, 40].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    aria-pressed={opticalSize === sz}
                    onClick={() => setOpticalSize(sz)}
                    className={cn(
                      "rounded-md px-2 py-1 font-mono text-xs font-semibold transition-colors",
                      opticalSize === sz
                        ? "bg-[var(--violet)] text-white"
                        : "text-[var(--muted)] hover:text-[var(--ink)]",
                    )}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
              <span className="font-mono text-xs text-[var(--muted)]">
                viewBox=&quot;0 0 24 24&quot; · stroke-linecap=&quot;round&quot;
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {SPECIMEN_ICONS.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-[12px] border border-[var(--line)] bg-[var(--canvas)] p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-[var(--line)] bg-[var(--surface)]/60">
                    <Icon
                      style={{ width: `${opticalSize}px`, height: `${opticalSize}px` }}
                      strokeWidth={strokeWeight}
                      className="text-[var(--ink)]"
                    />
                  </div>
                  <span className="font-mono text-[11px] text-[var(--muted)]">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Identity & Provider Logos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="default" className="lg:col-span-1">
            <CardHeader className="border-b border-[var(--line)]">
              <CardTitle>Brand Mark & Identity</CardTitle>
              <CardDescription>
                Primary <code className="font-mono">BrandLogo</code> asset and header lockup rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-[11px] border border-[var(--line)] bg-[var(--canvas)]">
                    <BrandLogo className="h-6 w-6 object-contain" />
                  </span>
                  <span className="text-lg font-bold tracking-[-0.055em] uppercase text-[var(--ink)]">
                    iconmuse
                  </span>
                  <Badge variant="violet" size="sm">
                    BETA
                  </Badge>
                </div>
              </div>
              <ul className="m-0 pl-4 text-xs leading-relaxed text-[var(--muted)] space-y-1.5">
                <li>
                  Maintain a <code className="font-mono">34px × 34px</code> rounded container frame
                  (<code className="font-mono">0.7rem</code> radius) on desktop headers.
                </li>
                <li>
                  Wordmark uses <strong>General Sans 700 Bold</strong> with{" "}
                  <code className="font-mono">-0.055em</code> tight tracking.
                </li>
                <li>
                  Exported SVGs automatically embed{" "}
                  <code className="font-mono">&lt;metadata&gt;</code> with icon name, provider, and
                  license.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="default" className="lg:col-span-2">
            <CardHeader className="border-b border-[var(--line)]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle>Integrated Provider Logos & Licenses</CardTitle>
                  <CardDescription>
                    Rendered via <code className="font-mono">src/components/common/ProviderLogo.tsx</code>{" "}
                    across filter dropdowns and library panels.
                  </CardDescription>
                </div>
                <Badge variant="secondary">{INTEGRATED_LIBRARIES.length} Providers</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {INTEGRATED_LIBRARIES.map((lib) => (
                  <div
                    key={lib.name}
                    className="flex items-center justify-between gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <ProviderLogo
                        source={lib.name}
                        className="size-6 shrink-0 rounded-md"
                        size={14}
                      />
                      <div className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-[var(--ink)]">
                          {lib.name}
                        </span>
                        <span className="block font-mono text-[10px] text-[var(--muted)]">
                          {lib.defaultGrid}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" size="sm">
                      {lib.license}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
