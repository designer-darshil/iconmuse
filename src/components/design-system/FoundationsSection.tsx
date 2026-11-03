import React, { useState } from "react";
import {
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  Layers,
  Eye,
  Sliders,
  Search,
} from "lucide-react";
import {
  COLOR_TOKENS,
  TYPOGRAPHY_SCALE,
  SPACING_SCALE,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  type ColorTokenItem,
} from "../../data/designTokens";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { cn } from "../../utils/cn";

export interface FoundationsSectionProps {
  theme: "light" | "dark";
  onCopyToken: (text: string, label: string) => void;
}

export const FoundationsSection: React.FC<FoundationsSectionProps> = ({
  theme,
  onCopyToken,
}) => {
  const [tokenFilter, setTokenFilter] = useState<
    "all" | "colors" | "typography" | "spacing" | "elevation"
  >("all");
  const [tokenSearch, setTokenSearch] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (value: string, label: string) => {
    try {
      await copyToClipboard(value);
      setCopiedKey(value);
      onCopyToken(value, label);
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // Clipboard fallback handled by parent toast
    }
  };

  const renderSwatchGrid = (items: ColorTokenItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {items.map((item) => {
        const activeHex = theme === "dark" ? item.darkValue : item.lightValue;
        const varRef = `var(${item.cssVar})`;
        const isCopied = copiedKey === varRef || copiedKey === activeHex;

        return (
          <div
            key={item.cssVar}
            className="group flex flex-col rounded-[14px] border border-[var(--line)] bg-[var(--canvas)] overflow-hidden shadow-[var(--shadow-2xs)] transition-all hover:border-[var(--selection)]"
          >
            <div className="flex h-20 w-full items-end justify-between p-3 border-b border-[var(--line)] relative" style={{ backgroundColor: activeHex }}>
              <span className="rounded-md bg-[#0F1116]/75 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-xs">
                {activeHex}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopy(varRef, item.name)}
                  className="inline-flex h-7 items-center gap-1 rounded-md bg-white/90 px-2 text-[10px] font-semibold text-[#0F1116] shadow-xs transition-transform hover:scale-105"
                  title={`Copy ${varRef}`}
                >
                  {isCopied ? (
                    <Check className="h-3 w-3 text-[#18794E]" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#52525B]" />
                  )}
                  <span>{isCopied ? "Copied" : "Token"}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-2 p-3.5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="m-0 text-xs font-bold text-[var(--ink)]">
                    {item.name}
                  </h4>
                  <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent-text)]">
                    {item.cssVar}
                  </code>
                </div>
                <p className="m-0 mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                  {item.role}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] pt-2 text-[10px] text-[var(--muted)]">
                <span className="font-mono">
                  L: {item.lightValue} · D: {item.darkValue}
                </span>
                {item.contrastNote && (
                  <Badge variant="success" size="sm">
                    {item.contrastNote}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const allFlatTokens = [
    ...COLOR_TOKENS.map((c) => ({
      category: "colors" as const,
      token: c.cssVar,
      name: c.name,
      light: c.lightValue,
      dark: c.darkValue,
      usage: c.role,
    })),
    ...TYPOGRAPHY_SCALE.map((t) => ({
      category: "typography" as const,
      token: t.token,
      name: t.name,
      light: `${t.remSize} (${t.pxSize})`,
      dark: `${t.remSize} (${t.pxSize})`,
      usage: t.usage,
    })),
    ...SPACING_SCALE.map((s) => ({
      category: "spacing" as const,
      token: s.token,
      name: `Space ${s.px}px`,
      light: `${s.rem} (${s.px}px)`,
      dark: `${s.rem} (${s.px}px)`,
      usage: s.usage,
    })),
    ...RADIUS_TOKENS.map((r) => ({
      category: "elevation" as const,
      token: r.token,
      name: `Radius · ${r.name}`,
      light: r.value,
      dark: r.value,
      usage: r.usage,
    })),
    ...SHADOW_TOKENS.map((sh) => ({
      category: "elevation" as const,
      token: sh.token,
      name: `Shadow · ${sh.name}`,
      light: sh.lightValue,
      dark: sh.darkValue,
      usage: sh.usage,
    })),
  ].filter((item) => {
    if (tokenFilter !== "all" && item.category !== tokenFilter) return false;
    if (!tokenSearch.trim()) return true;
    const q = tokenSearch.toLowerCase();
    return (
      item.token.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.usage.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-16">
      {/* ==================== 1. OVERVIEW ==================== */}
      <section id="overview" className="scroll-mt-24 flex flex-col gap-6">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="violet" dot>
              Section 01 · Overview
            </Badge>
            <Badge variant="outline">v2.4 Production</Badge>
            <Badge variant="success">WCAG AA / AAA Verified</Badge>
          </div>
          <h1 className="m-0 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
            IconMuse Design System
          </h1>
          <p className="m-0 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            A centralized visual language, token architecture, and reusable component library
            engineered for high-density iconography workflows. Every surface, dropdown, modal,
            and interactive control in the IconMuse workspace is built directly from these
            foundations.
          </p>
        </div>

        {/* Core Design Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              icon: Eye,
              title: "Artwork-First Clarity",
              description:
                "Warm neutral surfaces (--canvas, --surface) recede so monochrome and multicolor vector artwork remains optically crisp at every scale.",
              metric: "19 Libraries · 24px Grid",
            },
            {
              icon: Sparkles,
              title: "Confident Violet Accent",
              description:
                "A focused electric violet (--violet: #7141E8 / #B99AFF) guides primary actions, active filters, and keyboard focus rings without visual clutter.",
              metric: "Single Accent Hierarchy",
            },
            {
              icon: ShieldCheck,
              title: "Accessible by Default",
              description:
                "Automated contrast verification enforces >= 4.5:1 light and >= 7:1 dark text contrast, 44px mobile touch targets, and full keyboard navigation.",
              metric: "100% Contrast Checked",
            },
            {
              icon: Sliders,
              title: "Token-Driven Modularity",
              description:
                "All components consume centralized CSS custom properties (--space-*, --radius-*, --shadow-*), enabling seamless light/dark theme switching.",
              metric: "Zero One-Off Styles",
            },
          ].map((principle) => {
            const Icon = principle.icon;
            return (
              <Card key={principle.title} variant="default" className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--selection-soft)] text-[var(--accent-text)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle>{principle.title}</CardTitle>
                  <CardDescription>{principle.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" size="sm">
                    {principle.metric}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Visual Direction & Guidelines Summary */}
        <Card variant="subtle" className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
                01 · Surface Discipline
              </span>
              <h3 className="m-0 text-sm font-semibold text-[var(--ink)]">
                Layered Depth Without Heavy Chrome
              </h3>
              <p className="m-0 text-xs leading-relaxed text-[var(--muted)]">
                Use 1px hairline borders (<code className="font-mono">var(--line)</code>) for
                structural panels and reserve diffused elevation shadows (<code className="font-mono">--shadow-dropdown</code>, <code className="font-mono">--shadow-modal</code>) for floating overlays.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
                02 · Restrained Motion
              </span>
              <h3 className="m-0 text-sm font-semibold text-[var(--ink)]">
                140ms–200ms Precision Transitions
              </h3>
              <p className="m-0 text-xs leading-relaxed text-[var(--muted)]">
                Interactive controls lift by at most <code className="font-mono">-1px</code> on hover,
                dropdowns enter with a <code className="font-mono">6px</code> ease-out curve, and all
                animations respect <code className="font-mono">prefers-reduced-motion</code>.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
                03 · Layout Preservation
              </span>
              <h3 className="m-0 text-sm font-semibold text-[var(--ink)]">
                Consistent 3-Zone Workspace Shell
              </h3>
              <p className="m-0 text-xs leading-relaxed text-[var(--muted)]">
                Maintain the signature 64px top header, 72px navigation rail, fluid icon grid,
                and 360px contextual right inspector across all desktop views.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ==================== 2. FOUNDATIONS ==================== */}
      <section id="foundations" className="scroll-mt-24 flex flex-col gap-10">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-5">
          <Badge variant="violet" dot className="w-fit">
            Section 02 · Foundations
          </Badge>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            Color Palette, Typography, Spacing & Elevation
          </h2>
          <p className="m-0 max-w-3xl text-xs sm:text-sm text-[var(--muted)]">
            Click any color swatch or token pill to copy its CSS variable directly to your clipboard.
            Swatches automatically reflect the active <strong>{theme}</strong> theme.
          </p>
        </div>

        {/* 2A. Color Palette */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Primary & Selection Palette
            </h3>
            <p className="m-0 text-xs text-[var(--muted)]">
              Brand violet tokens used for primary CTAs, active tabs, selected icon tiles, and focus rings.
            </p>
          </div>
          {renderSwatchGrid(COLOR_TOKENS.filter((c) => c.category === "primary"))}

          <div className="flex flex-col gap-1 pt-2">
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Neutral Surfaces, Ink & Structural Borders
            </h3>
            <p className="m-0 text-xs text-[var(--muted)]">
              High-contrast carbon ink and warm-white / slate-dark surfaces calibrated for prolonged icon browsing.
            </p>
          </div>
          {renderSwatchGrid(COLOR_TOKENS.filter((c) => c.category === "neutral"))}

          <div className="flex flex-col gap-1 pt-2">
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Secondary & Recolor Accents
            </h3>
            <p className="m-0 text-xs text-[var(--muted)]">
              Curated live-recolor presets available in the workspace toolbar and icon customizer.
            </p>
          </div>
          {renderSwatchGrid(COLOR_TOKENS.filter((c) => c.category === "secondary"))}

          <div className="flex flex-col gap-1 pt-2">
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Semantic Status Colors
            </h3>
            <p className="m-0 text-xs text-[var(--muted)]">
              Paired foreground and subtle surface tokens for confirmations, license badges, warnings, and destructive actions.
            </p>
          </div>
          {renderSwatchGrid(COLOR_TOKENS.filter((c) => c.category === "semantic"))}
        </div>

        {/* 2B. Typography */}
        <div className="flex flex-col gap-4 pt-4 border-t border-[var(--line)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h3 className="m-0 text-base font-bold text-[var(--ink)]">
                Typography & Type Scale
              </h3>
              <p className="m-0 mt-1 text-xs text-[var(--muted)]">
                <strong>General Sans</strong> provides geometric clarity for UI controls, paired with{" "}
                <strong>JetBrains Mono</strong> for SVG code, hex values, and pixel dimensions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">400 Regular</Badge>
              <Badge variant="secondary">500 Medium</Badge>
              <Badge variant="secondary">600 Semibold</Badge>
              <Badge variant="secondary">700 Bold</Badge>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scale Level</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Size / Line Height</TableHead>
                <TableHead>Weight & Tracking</TableHead>
                <TableHead>Live Specimen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TYPOGRAPHY_SCALE.map((item) => (
                <TableRow key={item.token}>
                  <TableCell className="font-semibold text-[var(--ink)] whitespace-nowrap">
                    {item.name}
                    <span className="block text-[11px] font-normal text-[var(--muted)]">
                      {item.usage}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleCopy(`var(${item.token})`, item.name)}
                      className="rounded bg-[var(--surface)] px-2 py-1 font-mono text-[11px] font-semibold text-[var(--accent-text)] hover:bg-[var(--selection-soft)]"
                    >
                      {item.token}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-[var(--muted)] whitespace-nowrap">
                    {item.remSize} ({item.pxSize}) · LH {item.lineHeight}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-[var(--muted)] whitespace-nowrap">
                    {item.weight} · {item.tracking}
                  </TableCell>
                  <TableCell className="min-w-[220px]">
                    <span
                      className="block truncate text-[var(--ink)]"
                      style={{
                        fontSize: item.remSize,
                        lineHeight: item.lineHeight,
                        fontWeight: item.weight.includes("700")
                          ? 700
                          : item.weight.includes("600")
                            ? 600
                            : 500,
                      }}
                    >
                      {item.sampleText}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 2C. Spacing & Sizing Scale */}
        <div className="flex flex-col gap-4 pt-4 border-t border-[var(--line)]">
          <div>
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Spacing & Control Sizing Scale
            </h3>
            <p className="m-0 mt-1 text-xs text-[var(--muted)]">
              Built on a 4px spatial grid. Mobile interactive controls enforce a minimum{" "}
              <code className="font-mono">44px × 44px</code> touch target.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SPACING_SCALE.map((s) => (
              <div
                key={s.token}
                className="flex items-center gap-3 rounded-[12px] border border-[var(--line)] bg-[var(--canvas)] p-3"
              >
                <button
                  type="button"
                  onClick={() => handleCopy(`var(${s.token})`, s.token)}
                  className="w-24 shrink-0 rounded bg-[var(--surface)] px-2 py-1 text-left font-mono text-[11px] font-semibold text-[var(--accent-text)] hover:bg-[var(--selection-soft)]"
                >
                  {s.token}
                </button>
                <div className="w-20 shrink-0 font-mono text-[11px] text-[var(--muted)]">
                  {s.px}px ({s.rem})
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-2.5 rounded-full bg-[var(--selection-soft)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--violet)]"
                      style={{ width: `${Math.min(100, (s.px / 64) * 100)}%` }}
                    />
                  </div>
                  <p className="m-0 mt-1 truncate text-[11px] text-[var(--muted)]">
                    {s.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2D. Border Radius & Shadows / Elevation */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-[var(--line)]">
          {/* Border Radius */}
          <div className="flex flex-col gap-3">
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Border Radius Scale
            </h3>
            <p className="m-0 text-xs text-[var(--muted)]">
              Concentric corner radii scale from 6px inline badges up to 24px modal containers and full pills.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RADIUS_TOKENS.map((r) => (
                <button
                  key={r.token}
                  type="button"
                  onClick={() => handleCopy(`var(${r.token})`, r.name)}
                  className="flex flex-col items-start justify-between gap-3 rounded-[14px] border border-[var(--line)] bg-[var(--canvas)] p-3.5 text-left transition-colors hover:border-[var(--selection)]"
                >
                  <div
                    className="h-12 w-16 border-2 border-[var(--violet)] bg-[var(--selection-soft)]"
                    style={{ borderRadius: r.value }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[var(--ink)]">{r.name}</span>
                      <span className="font-mono text-[10px] text-[var(--accent-text)]">
                        {r.value}
                      </span>
                    </div>
                    <code className="block font-mono text-[10px] text-[var(--muted)]">
                      {r.token}
                    </code>
                    <p className="m-0 mt-1 text-[10px] leading-snug text-[var(--muted)]">
                      {r.usage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shadows & Elevation */}
          <div className="flex flex-col gap-3">
            <h3 className="m-0 text-base font-bold text-[var(--ink)]">
              Shadows & Surface Elevation
            </h3>
            <p className="m-0 text-xs text-[var(--muted)]">
              Standardized z-depth hierarchy from resting cards to floating dropdowns and top-layer modals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHADOW_TOKENS.map((sh) => (
                <button
                  key={sh.token}
                  type="button"
                  onClick={() => handleCopy(`var(${sh.token})`, sh.name)}
                  className="flex flex-col justify-between gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--canvas)] p-4 text-left transition-transform hover:-translate-y-0.5"
                  style={{
                    boxShadow: theme === "dark" ? sh.darkValue : sh.lightValue,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="violet" size="sm">
                      {sh.level}
                    </Badge>
                    <code className="font-mono text-[10px] text-[var(--muted)]">
                      {sh.token}
                    </code>
                  </div>
                  <div>
                    <h4 className="m-0 text-xs font-bold text-[var(--ink)]">{sh.name}</h4>
                    <p className="m-0 mt-1 text-[11px] leading-snug text-[var(--muted)]">
                      {sh.usage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. DESIGN TOKENS ==================== */}
      <section id="tokens" className="scroll-mt-24 flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-5">
          <Badge variant="violet" dot className="w-fit">
            Section 03 · Design Tokens
          </Badge>
          <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            Centralized Token Reference & Naming Conventions
          </h2>
          <p className="m-0 max-w-3xl text-xs sm:text-sm text-[var(--muted)]">
            All tokens are declared in <code className="font-mono">src/styles/_tokens.scss</code>{" "}
            and bridged to Tailwind v4 utilities in{" "}
            <code className="font-mono">src/styles/tailwind.css</code>.
          </p>
        </div>

        {/* Naming convention & code usage cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="subtle" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-[var(--violet)]" />
              <h3 className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                Token Naming Architecture
              </h3>
            </div>
            <p className="m-0 text-xs text-[var(--muted)] leading-relaxed">
              Tokens follow a predictable semantic convention:{" "}
              <code className="rounded bg-[var(--canvas)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--accent-text)]">
                --&#123;domain&#125;-&#123;role&#125;-&#123;modifier&#125;
              </code>
              . Semantic tokens (e.g. <code className="font-mono">--surface-strong</code>,{" "}
              <code className="font-mono">--selection-soft</code>,{" "}
              <code className="font-mono">--shadow-dropdown</code>) automatically adapt between
              light and dark themes without requiring component-level overrides.
            </p>
          </Card>

          <Card variant="subtle" className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                CSS & Tailwind Usage Example
              </span>
              <Badge variant="outline" size="sm">
                _tokens.scss
              </Badge>
            </div>
            <pre className="m-0 rounded-[10px] bg-[#0F1116] p-3 font-mono text-[11px] text-[#F1F1F3] overflow-x-auto">
              <code>{`.dropdown-popover {\n  background: var(--canvas);\n  border: 1px solid var(--line);\n  border-radius: var(--radius-md);\n  box-shadow: var(--shadow-dropdown);\n}`}</code>
            </pre>
          </Card>
        </div>

        {/* Interactive Filterable Token Explorer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(
              [
                { id: "all", label: "All Tokens" },
                { id: "colors", label: "Colors" },
                { id: "typography", label: "Typography" },
                { id: "spacing", label: "Spacing" },
                { id: "elevation", label: "Radius & Elevation" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={tokenFilter === tab.id}
                onClick={() => setTokenFilter(tab.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                  tokenFilter === tab.id
                    ? "border-[var(--selection)] bg-[var(--selection-soft)] text-[var(--accent-text)]"
                    : "border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)] hover:text-[var(--ink)]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              inputSize="sm"
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
              placeholder="Filter tokens by name or role…"
              className="flex h-9 w-full rounded-full border border-[var(--line)] bg-[var(--canvas)] pl-8 pr-3 text-xs text-[var(--ink)] placeholder:text-[var(--muted)]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CSS Variable</TableHead>
              <TableHead>Token Name</TableHead>
              <TableHead>Light Value</TableHead>
              <TableHead>Dark Value</TableHead>
              <TableHead>Semantic Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allFlatTokens.map((item) => (
              <TableRow key={item.token}>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleCopy(`var(${item.token})`, item.name)}
                    className="inline-flex items-center gap-1.5 rounded bg-[var(--surface)] px-2 py-1 font-mono text-[11px] font-semibold text-[var(--accent-text)] hover:bg-[var(--selection-soft)]"
                    title="Click to copy CSS variable"
                  >
                    <span>{item.token}</span>
                    <Copy className="h-3 w-3 opacity-60" />
                  </button>
                </TableCell>
                <TableCell className="font-semibold text-[var(--ink)] whitespace-nowrap">
                  {item.name}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    {item.light.startsWith("#") && (
                      <span
                        className="h-3 w-3 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: item.light }}
                      />
                    )}
                    <span className="truncate max-w-[180px]">{item.light}</span>
                  </span>
                </TableCell>
                <TableCell className="font-mono text-[11px] text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    {item.dark.startsWith("#") && (
                      <span
                        className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: item.dark }}
                      />
                    )}
                    <span className="truncate max-w-[180px]">{item.dark}</span>
                  </span>
                </TableCell>
                <TableCell className="text-xs text-[var(--muted)] min-w-[220px]">
                  {item.usage}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};
