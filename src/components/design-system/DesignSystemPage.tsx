import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  Palette,
  Sliders,
  Box,
  Activity,
  LayoutGrid,
  Sparkles,
  ArrowLeft,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
} from "lucide-react";
import { BrandLogo } from "../common/BrandLogo";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { Badge } from "../ui/badge";
import { DropdownSelect } from "../ui/dropdown";
import { Tooltip } from "../ui/tooltip";
import { FoundationsSection } from "./FoundationsSection";
import { ComponentsSection } from "./ComponentsSection";
import { PatternsAndAssetsSection } from "./PatternsAndAssetsSection";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import { cn } from "../../utils/cn";

export interface DesignSystemPageProps {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export interface NavSectionItem {
  id: string;
  number: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: NavSectionItem[] = [
  {
    id: "overview",
    number: "01",
    label: "Overview",
    shortLabel: "Overview",
    description: "Principles, visual direction & guidelines",
    icon: Compass,
  },
  {
    id: "foundations",
    number: "02",
    label: "Foundations",
    shortLabel: "Foundations",
    description: "Colors, typography, spacing & elevation",
    icon: Palette,
  },
  {
    id: "tokens",
    number: "03",
    label: "Design Tokens",
    shortLabel: "Tokens",
    description: "CSS variables, naming & live explorer",
    icon: Sliders,
  },
  {
    id: "components",
    number: "04",
    label: "Components",
    shortLabel: "Components",
    description: "Buttons, dropdowns, modals, inputs & cards",
    icon: Box,
  },
  {
    id: "states",
    number: "05",
    label: "Component States",
    shortLabel: "States",
    description: "Default, hover, focus, active & error",
    icon: Activity,
  },
  {
    id: "patterns",
    number: "06",
    label: "Patterns & Layouts",
    shortLabel: "Patterns",
    description: "Shell grid, overlays & breakpoints",
    icon: LayoutGrid,
  },
  {
    id: "icons",
    number: "07",
    label: "Icons & Assets",
    shortLabel: "Icons & Assets",
    description: "Stroke weights, optical grid & providers",
    icon: Sparkles,
  },
];

export const DesignSystemPage: React.FC<DesignSystemPageProps> = ({
  theme,
  onThemeChange,
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const shouldReduceMotion = useReducedMotion();

  const [activeSection, setActiveSection] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, "");
    return SECTIONS.some((s) => s.id === hash) ? hash : "overview";
  });

  // Tablet collapsible sidebar state (compact icon-rail by default on tablet to maximize content space)
  const [isTabletSidebarExpanded, setIsTabletSidebarExpanded] = useState(false);

  // Mobile slide-out drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  useOverlayScrollLock(isMobile && isMobileDrawerOpen);

  useEffect(() => {
    document.title = "Design System — IconMuse Visual Reference & Tokens";
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 2200);
  };

  // Navigate smoothly to a section and automatically close mobile drawer
  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileDrawerOpen(false);

    try {
      window.history.replaceState(null, "", `#${sectionId}`);
    } catch {
      // Ignore history errors in restricted environments
    }

    const target = document.getElementById(sectionId);
    if (target) {
      isProgrammaticScroll.current = true;
      target.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 650);
    }
  };

  // Scroll-spy to highlight currently visible section during scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      const containerTop = container.getBoundingClientRect().top;
      let currentId = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const offset = el.getBoundingClientRect().top - containerTop;
        if (offset <= 140) {
          currentId = section.id;
        }
      }
      setActiveSection(currentId);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile drawer Escape & Tab focus trap
  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileDrawerOpen(false);
        return;
      }
      if (event.key === "Tab" && mobileDrawerRef.current) {
        const focusables = mobileDrawerRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawerOpen]);

  return (
    <div className="app-root flex flex-col bg-[var(--canvas)] text-[var(--ink)]">
      {/* Top Header */}
      <header className="h-16 shrink-0 border-b border-[var(--line)] bg-[var(--canvas)] px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open design system navigation drawer"
              aria-expanded={isMobileDrawerOpen}
              aria-haspopup="dialog"
              className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Tablet Sidebar Collapse/Expand Toggle */}
          {isTablet && (
            <button
              type="button"
              onClick={() => setIsTabletSidebarExpanded((prev) => !prev)}
              aria-label={
                isTabletSidebarExpanded
                  ? "Collapse section sidebar"
                  : "Expand section sidebar"
              }
              title={
                isTabletSidebarExpanded
                  ? "Collapse section sidebar"
                  : "Expand section sidebar"
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]"
            >
              {isTabletSidebarExpanded ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>
          )}

          <a
            href="/"
            aria-label="IconMuse home"
            className="inline-flex items-center gap-2.5 text-[var(--ink)] no-underline min-w-0"
          >
            <span className="desktop-header__mark">
              <BrandLogo className="h-5 w-5 sm:h-6 sm:w-6 object-contain" />
            </span>
            <span className="desktop-header__wordmark uppercase">iconmuse</span>
          </a>

          <span className="hidden xs:inline-block h-4 w-px bg-[var(--line)] mx-1" />
          <Badge variant="violet" className="hidden xs:inline-flex">
            Design System
          </Badge>
        </div>

        {/* Right Actions: Back to Workspace + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 sm:px-4 text-xs font-semibold text-[var(--ink)] no-underline transition-colors hover:bg-[var(--surface-strong)]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[var(--violet)]" />
            <span className="hidden sm:inline">Back to Workspace</span>
            <span className="sm:hidden">Catalog</span>
          </a>

          <AnimatedThemeToggler
            theme={theme}
            onThemeChange={onThemeChange}
            className="desktop-header__action-button"
          />
        </div>
      </header>

      {/* Mobile Compact Section Bar (Quick dropdown navigation + active section badge) */}
      {isMobile && (
        <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] bg-[var(--surface)] px-3 py-2 shrink-0 z-30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Section
          </span>
          <DropdownSelect
            ariaLabel="Jump to design system section"
            value={activeSection}
            onChange={handleSelectSection}
            size="sm"
            align="right"
            className="w-56"
            menuWidthClassName="w-64"
            options={SECTIONS.map((s) => ({
              value: s.id,
              label: `${s.number}. ${s.label}`,
              description: s.description,
            }))}
          />
        </div>
      )}

      {/* Main Layout Area: Sidebar + Scrollable Documentation Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Desktop Persistent Left Sidebar (>= 1280px) */}
        {isDesktop && (
          <aside
            aria-label="Design system sections"
            className="w-[272px] shrink-0 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between overflow-y-auto p-4 select-none"
          >
            <div className="flex flex-col gap-1.5">
              <div className="px-2.5 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Documentation Hub
                </span>
              </div>

              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isSelected = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    aria-current={isSelected ? "location" : undefined}
                    onClick={() => handleSelectSection(section.id)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-[12px] px-3 py-2.5 text-left transition-all duration-150",
                      isSelected
                        ? "bg-[var(--selection-soft)] text-[var(--accent-text)] shadow-[var(--shadow-2xs)] outline-1 outline-[color-mix(in_srgb,var(--selection)_34%,transparent)]"
                        : "text-[var(--ink)] hover:bg-[var(--surface-strong)]",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-xs font-bold transition-colors",
                        isSelected
                          ? "bg-[var(--selection)] text-white"
                          : "bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)] group-hover:text-[var(--ink)]",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-bold">
                          {section.label}
                        </span>
                        <span className="font-mono text-[10px] opacity-65">
                          {section.number}
                        </span>
                      </div>
                      <span className="mt-0.5 block truncate text-[11px] text-[var(--muted)]">
                        {section.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[12px] border border-[var(--line)] bg-[var(--canvas)] p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--ink)]">Active Theme</span>
                <Badge variant="violet" size="sm">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </Badge>
              </div>
              <p className="m-0 mt-1.5 text-[11px] leading-relaxed text-[var(--muted)]">
                Toggle the theme in the top bar to inspect live dark-mode token mappings and
                contrast ratios.
              </p>
            </div>
          </aside>
        )}

        {/* Tablet Collapsible / Compact Sidebar (768px - 1279px) */}
        {isTablet && (
          <aside
            aria-label="Design system sections"
            className={cn(
              "shrink-0 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col justify-between overflow-y-auto py-3 transition-all duration-150 select-none",
              isTabletSidebarExpanded ? "w-64 px-3" : "w-[68px] items-center px-2",
            )}
          >
            <div className="flex flex-col gap-1.5 w-full">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isSelected = activeSection === section.id;

                const buttonNode = (
                  <button
                    key={section.id}
                    type="button"
                    aria-current={isSelected ? "location" : undefined}
                    aria-label={`${section.number}. ${section.label}`}
                    onClick={() => handleSelectSection(section.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[12px] text-left transition-colors w-full",
                      isTabletSidebarExpanded
                        ? "px-3 py-2.5"
                        : "h-11 w-11 justify-center mx-auto",
                      isSelected
                        ? "bg-[var(--selection-soft)] text-[var(--accent-text)] font-bold"
                        : "text-[var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {isTabletSidebarExpanded && (
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-[var(--ink)]">
                          {section.label}
                        </span>
                        <span className="block truncate text-[10px] text-[var(--muted)]">
                          {section.description}
                        </span>
                      </div>
                    )}
                  </button>
                );

                return isTabletSidebarExpanded ? (
                  buttonNode
                ) : (
                  <Tooltip
                    key={section.id}
                    content={`${section.number}. ${section.label}`}
                    side="right"
                  >
                    {buttonNode}
                  </Tooltip>
                );
              })}
            </div>
          </aside>
        )}

        {/* Scrollable Documentation Main Content */}
        <main
          ref={scrollContainerRef}
          id="design-system-content"
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10 pb-24 flex flex-col gap-16">
            <FoundationsSection
              theme={theme}
              onCopyToken={(val, label) =>
                showToast(`Copied ${label}: ${val}`)
              }
            />
            <ComponentsSection onShowToast={showToast} />
            <PatternsAndAssetsSection />
          </div>
        </main>
      </div>

      {/* Mobile Slide-Out Navigation Drawer (Auto-closes on section select) */}
      <AnimatePresence>
        {isMobile && isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-[#0F1116]/50 backdrop-blur-xs"
            />

            <motion.aside
              ref={mobileDrawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Design system navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
              className="relative z-10 flex h-full w-[min(86vw,320px)] flex-col overflow-y-auto border-r border-[var(--line)] bg-[var(--canvas)] p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <BrandLogo className="h-6 w-6 object-contain" />
                  <span className="text-sm font-bold text-[var(--ink)]">
                    Design System
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                  className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Sections" className="flex flex-col gap-1.5">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isSelected = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      aria-current={isSelected ? "location" : undefined}
                      onClick={() => handleSelectSection(section.id)}
                      className={cn(
                        "flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                        isSelected
                          ? "bg-[var(--selection-soft)] text-[var(--accent-text)] font-bold"
                          : "text-[var(--ink)] hover:bg-[var(--surface)]",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[var(--violet)]" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold">
                          {section.number}. {section.label}
                        </span>
                        <span className="block truncate text-[11px] text-[var(--muted)]">
                          {section.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/12 bg-[#0F1116] px-4 py-2.5 text-xs font-semibold text-white shadow-2xl"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2EA45B] text-white">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
