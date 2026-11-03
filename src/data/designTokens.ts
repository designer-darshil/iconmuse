export interface ColorTokenItem {
  name: string;
  cssVar: string;
  lightValue: string;
  darkValue: string;
  category: "primary" | "secondary" | "neutral" | "semantic";
  role: string;
  contrastNote?: string;
}

export interface TypographyScaleItem {
  name: string;
  token: string;
  remSize: string;
  pxSize: string;
  lineHeight: string;
  weight: string;
  tracking: string;
  usage: string;
  sampleText: string;
}

export interface SpacingScaleItem {
  token: string;
  rem: string;
  px: number;
  usage: string;
}

export interface RadiusTokenItem {
  name: string;
  token: string;
  value: string;
  usage: string;
}

export interface ShadowTokenItem {
  name: string;
  token: string;
  level: string;
  lightValue: string;
  darkValue: string;
  usage: string;
}

export const COLOR_TOKENS: ColorTokenItem[] = [
  // Primary & Accent
  {
    name: "Primary Accent (Violet)",
    cssVar: "--violet",
    lightValue: "#7141E8",
    darkValue: "#B99AFF",
    category: "primary",
    role: "Primary actions, active indicators, focus rings, and interactive highlights",
    contrastNote: "5.7:1 on white / 8.4:1 on dark canvas",
  },
  {
    name: "Primary Hover",
    cssVar: "--violet-hover",
    lightValue: "#6031D4",
    darkValue: "#C9B2FF",
    category: "primary",
    role: "Hover and active state for primary buttons and interactive badges",
  },
  {
    name: "Accent Foreground Text",
    cssVar: "--accent-text",
    lightValue: "#5932C0",
    darkValue: "#E0D4FF",
    category: "primary",
    role: "High-contrast violet text on selected surfaces and subtle accent pills",
    contrastNote: "7.1:1 on selection-soft",
  },
  {
    name: "Selection Border / Ring",
    cssVar: "--selection",
    lightValue: "#7141E8",
    darkValue: "#B99AFF",
    category: "primary",
    role: "Active tile borders, selected rail pills, and keyboard focus outlines",
  },
  {
    name: "Selection Soft Surface",
    cssVar: "--selection-soft",
    lightValue: "#F3F0FC",
    darkValue: "#49396A",
    category: "primary",
    role: "Selected menu items, active category tabs, and active filter chips",
  },

  // Secondary & Recolor Accents
  {
    name: "Secondary Blue",
    cssVar: "--secondary-accent",
    lightValue: "#2563EB",
    darkValue: "#60A5FA",
    category: "secondary",
    role: "Secondary interactive accents, links, and icon recolor preset",
  },
  {
    name: "Accent Emerald",
    cssVar: "--accent-emerald",
    lightValue: "#10B981",
    darkValue: "#34D399",
    category: "secondary",
    role: "Emerald icon recolor preset and botanical/nature pack accents",
  },
  {
    name: "Accent Rose",
    cssVar: "--accent-rose",
    lightValue: "#E11D48",
    darkValue: "#FB7185",
    category: "secondary",
    role: "Rose icon recolor preset and expressive badge highlights",
  },
  {
    name: "Accent Amber",
    cssVar: "--accent-amber",
    lightValue: "#D97706",
    darkValue: "#FBBF24",
    category: "secondary",
    role: "Warm amber icon recolor preset and highlight indicators",
  },

  // Neutral & Surfaces
  {
    name: "Canvas Background",
    cssVar: "--canvas",
    lightValue: "#FFFFFF",
    darkValue: "#141519",
    category: "neutral",
    role: "Primary application background, headers, sidebars, and modal surfaces",
  },
  {
    name: "Subtle Surface",
    cssVar: "--surface",
    lightValue: "#F7F7F8",
    darkValue: "#1C1D22",
    category: "neutral",
    role: "Icon tiles, navigation rail, secondary buttons, and segmented controls",
  },
  {
    name: "Strong Surface",
    cssVar: "--surface-strong",
    lightValue: "#F1F1F3",
    darkValue: "#25262C",
    category: "neutral",
    role: "Hover states on subtle surfaces, skeleton loaders, and source pills",
  },
  {
    name: "Primary Ink",
    cssVar: "--ink",
    lightValue: "#0F1116",
    darkValue: "#F4F4F5",
    category: "neutral",
    role: "Primary headings, body copy, active labels, and default icon stroke color",
    contrastNote: "18.8:1 light / 15.6:1 dark",
  },
  {
    name: "Muted Foreground",
    cssVar: "--muted",
    lightValue: "#52525B",
    darkValue: "#B6B6C2",
    category: "neutral",
    role: "Secondary descriptions, metadata counts, inactive tabs, and helper text",
    contrastNote: "7.0:1 light / 8.2:1 dark",
  },
  {
    name: "Hairline Border",
    cssVar: "--line",
    lightValue: "#E7E7EA",
    darkValue: "#34353A",
    category: "neutral",
    role: "Structural dividers, card borders, modal frames, and table rules",
  },
  {
    name: "Control Line",
    cssVar: "--control-line",
    lightValue: "#8A8A94",
    darkValue: "#747985",
    category: "neutral",
    role: "Form control borders and interactive boundary contrast",
    contrastNote: ">= 3.1:1 non-text WCAG contrast",
  },

  // Semantic Colors
  {
    name: "Success Text / Icon",
    cssVar: "--success",
    lightValue: "#18794E",
    darkValue: "#72D9A0",
    category: "semantic",
    role: "Copy confirmation checkmarks, verified license indicators, positive states",
  },
  {
    name: "Success Subtle Surface",
    cssVar: "--success-subtle",
    lightValue: "#DCFCE7",
    darkValue: "#1B3828",
    category: "semantic",
    role: "Background for positive status badges and confirmation callouts",
  },
  {
    name: "Info Text / Icon",
    cssVar: "--info",
    lightValue: "#0369A1",
    darkValue: "#7DD3FC",
    category: "semantic",
    role: "Informational tips, documentation callouts, and metadata badges",
  },
  {
    name: "Info Subtle Surface",
    cssVar: "--info-subtle",
    lightValue: "#E0F2FE",
    darkValue: "#1D3543",
    category: "semantic",
    role: "Background for informational banners and neutral-info tags",
  },
  {
    name: "Warning Text / Icon",
    cssVar: "--warning",
    lightValue: "#854D0E",
    darkValue: "#FCD34D",
    category: "semantic",
    role: "Caution indicators, attribution notices, and rate-limit warnings",
  },
  {
    name: "Warning Subtle Surface",
    cssVar: "--warning-subtle",
    lightValue: "#FEF08A",
    darkValue: "#41351C",
    category: "semantic",
    role: "Background for caution badges and notice cards",
  },
  {
    name: "Danger / Destructive",
    cssVar: "--danger",
    lightValue: "#B42332",
    darkValue: "#FF9FA8",
    category: "semantic",
    role: "Delete collection actions, clear-all triggers, and validation errors",
  },
  {
    name: "Danger Subtle Surface",
    cssVar: "--danger-subtle",
    lightValue: "#FFF5F5",
    darkValue: "#3A2426",
    category: "semantic",
    role: "Hover surface for destructive icon buttons and error banners",
  },
];

export const TYPOGRAPHY_SCALE: TypographyScaleItem[] = [
  {
    name: "Display / Page Title",
    token: "--text-3xl",
    remSize: "1.875rem",
    pxSize: "30px",
    lineHeight: "1.2",
    weight: "700 (Bold)",
    tracking: "-0.04em",
    usage: "Hero headers, documentation titles, and 404 display headings",
    sampleText: "Precision Iconography at Scale",
  },
  {
    name: "Heading 1 (H1)",
    token: "--text-2xl",
    remSize: "1.5rem",
    pxSize: "24px",
    lineHeight: "1.25",
    weight: "600 (Semibold)",
    tracking: "-0.025em",
    usage: "Primary modal titles and top-level documentation section headers",
    sampleText: "IconMuse Design System",
  },
  {
    name: "Heading 2 (H2)",
    token: "--text-xl",
    remSize: "1.25rem",
    pxSize: "20px",
    lineHeight: "1.3",
    weight: "600 (Semibold)",
    tracking: "-0.025em",
    usage: "Major section headings, icon detail names, and modal group headers",
    sampleText: "Foundations & Visual Language",
  },
  {
    name: "Heading 3 (H3)",
    token: "--text-lg",
    remSize: "1.125rem",
    pxSize: "18px",
    lineHeight: "1.35",
    weight: "600 (Semibold)",
    tracking: "-0.02em",
    usage: "Card titles, Brand wordmark, and component group subheadings",
    sampleText: "Interactive Dropdown Menus",
  },
  {
    name: "Compact Title",
    token: "--text-base",
    remSize: "0.9375rem",
    pxSize: "15px",
    lineHeight: "1.4",
    weight: "600 (Semibold)",
    tracking: "-0.015em",
    usage: "Sidebar section titles, mobile drawer navigation items, and dialog headers",
    sampleText: "Customize Artwork & Export",
  },
  {
    name: "Body Default",
    token: "--text-sm",
    remSize: "0.875rem",
    pxSize: "14px",
    lineHeight: "1.5",
    weight: "400 / 500",
    tracking: "0em",
    usage: "Default application UI text, search inputs, filter items, and descriptions",
    sampleText: "Search, compare, customize, and export open-source SVG icons.",
  },
  {
    name: "Caption / Control Label",
    token: "--text-xs",
    remSize: "0.75rem",
    pxSize: "12px",
    lineHeight: "1.4",
    weight: "500 / 600",
    tracking: "0em",
    usage: "Toolbar buttons, sort tabs, dropdown items, and metadata labels",
    sampleText: "Showing 72 of 18,420 icons · MIT License",
  },
  {
    name: "Micro / Badge Label",
    token: "--text-2xs",
    remSize: "0.6875rem",
    pxSize: "11px",
    lineHeight: "1.2",
    weight: "600 (Semibold)",
    tracking: "0.02em",
    usage: "Source badges, keyboard shortcut kbd pills, and uppercase section eyebrows",
    sampleText: "LUCIDE · 24×24 PX · STROKE 2.0",
  },
];

export const SPACING_SCALE: SpacingScaleItem[] = [
  { token: "--space-1", rem: "0.25rem", px: 4, usage: "Tight inline icon-to-badge gaps and segmented control padding" },
  { token: "--space-1-5", rem: "0.375rem", px: 6, usage: "Compact chip gaps, swatch grids, and icon tile action spacing" },
  { token: "--space-2", rem: "0.5rem", px: 8, usage: "Standard button icon gap, dropdown item spacing, and input padding" },
  { token: "--space-3", rem: "0.75rem", px: 12, usage: "Icon grid gap, card internal padding (compact), and toolbar gaps" },
  { token: "--space-4", rem: "1rem", px: 16, usage: "Standard container padding, modal header padding, and form group spacing" },
  { token: "--space-5", rem: "1.25rem", px: 20, usage: "Sidebar panel padding (`px-5 py-5`) and modal column padding" },
  { token: "--space-6", rem: "1.5rem", px: 24, usage: "Desktop workspace horizontal padding (`px-6`) and section dividers" },
  { token: "--space-8", rem: "2rem", px: 32, usage: "Major documentation section spacing and empty-state padding" },
  { token: "--space-12", rem: "3rem", px: 48, usage: "Toolbar search height (`h-12`) and large section vertical rhythm" },
  { token: "--space-16", rem: "4rem", px: 64, usage: "Desktop header height (`64px`) and hero block separation" },
];

export const RADIUS_TOKENS: RadiusTokenItem[] = [
  {
    name: "Extra Small",
    token: "--radius-xs",
    value: "6px",
    usage: "Keyboard shortcut `<kbd>` tags, mini checkboxes, and provider logo badges",
  },
  {
    name: "Small",
    token: "--radius-sm",
    value: "10px",
    usage: "Standard buttons, form inputs, select controls, and brand mark frame",
  },
  {
    name: "Medium",
    token: "--radius-md",
    value: "14px",
    usage: "Icon tiles, sidebar cards, dropdown menus, and code preview blocks",
  },
  {
    name: "Large",
    token: "--radius-lg",
    value: "20px",
    usage: "Floating comparison tray, icon detail modal window, and preview stage",
  },
  {
    name: "Extra Large",
    token: "--radius-xl",
    value: "24px",
    usage: "Comparison modal container and large feature showcase surfaces",
  },
  {
    name: "Full Pill",
    token: "--radius-pill",
    value: "9999px",
    usage: "Toolbar filter triggers, category chips, status badges, and action pills",
  },
];

export const SHADOW_TOKENS: ShadowTokenItem[] = [
  {
    name: "Micro Elevation (2XS)",
    token: "--shadow-2xs",
    level: "Level 1 · Inline Control",
    lightValue: "0 1px 2px rgba(15, 17, 22, 0.03)",
    darkValue: "0 1px 2px rgba(0, 0, 0, 0.22)",
    usage: "Keyboard `<kbd>` badges, active segmented tabs, and color swatches",
  },
  {
    name: "Subtle Surface",
    token: "--shadow-subtle",
    level: "Level 1 · Resting Surface",
    lightValue: "0 1px 3px rgba(15, 17, 22, 0.05)",
    darkValue: "0 1px 3px rgba(0, 0, 0, 0.28)",
    usage: "Buttons, active header tabs, and resting interactive cards",
  },
  {
    name: "Elevated Card",
    token: "--shadow-card",
    level: "Level 2 · Elevated Container",
    lightValue: "0 4px 12px rgba(15, 17, 22, 0.06)",
    darkValue: "0 4px 14px rgba(0, 0, 0, 0.34)",
    usage: "Main search bar (`h-12`), interactive feature cards, and hover states",
  },
  {
    name: "Dropdown Popover",
    token: "--shadow-dropdown",
    level: "Level 3 · Floating Menu",
    lightValue: "0 14px 34px -4px rgba(15, 17, 22, 0.12)",
    darkValue: "0 16px 38px -4px rgba(0, 0, 0, 0.52)",
    usage: "Topic/Library dropdown, Recolor popover, and Split-button export menus",
  },
  {
    name: "Floating Panel",
    token: "--shadow-panel",
    level: "Level 4 · Detached Panel",
    lightValue: "0 14px 36px rgba(15, 17, 22, 0.14)",
    darkValue: "0 14px 36px rgba(0, 0, 0, 0.48)",
    usage: "Undocked floating right sidebar, toast notifications, and consent dialog",
  },
  {
    name: "Modal Dialog",
    token: "--shadow-modal",
    level: "Level 5 · Top-Layer Modal",
    lightValue: "0 24px 64px -12px rgba(15, 17, 22, 0.22)",
    darkValue: "0 28px 72px -12px rgba(0, 0, 0, 0.68)",
    usage: "Icon Detail Modal, Illustration Studio Modal, and Side-by-Side Compare Modal",
  },
];
