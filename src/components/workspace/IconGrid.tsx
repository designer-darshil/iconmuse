import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SearchX, RotateCcw, Check, ChevronDown } from "lucide-react";
import { IconTile } from "./IconTile";
import type { IconItem, SortOption, ViewDensity } from "../../types";
import { cn } from "../../utils/cn";
import { getIconSvg, loadIconSvgsFor } from "../../data/iconCatalog";
import { copyToClipboard } from "../../utils/copyToClipboard";

export interface IconGridProps {
  icons: IconItem[];
  activeSort: SortOption;
  isLoading?: boolean;
  searchQuery: string;
  activeColor: string;
  iconSize?: number;
  savedIconIds: string[];
  compareIconIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectIcon: (icon: IconItem) => void;
  selectedIcon: IconItem | null;
  onResetFilters: () => void;
  viewDensity: ViewDensity;
}

const BATCH_SIZE = 72;

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  activeSort,
  isLoading = false,
  searchQuery,
  activeColor,
  iconSize = 32,
  savedIconIds,
  compareIconIds,
  onToggleSave,
  onToggleCompare,
  onSelectIcon,
  selectedIcon,
  onResetFilters,
  viewDensity,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [, setSvgRevision] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Reset pagination batch when filters or search change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [icons.length, searchQuery]);

  useEffect(() => {
    if (isLoading) return;
    const visibleIcons = icons.slice(0, visibleCount);
    if (!visibleIcons.some((icon) => !icon.svg)) return;
    let active = true;
    loadIconSvgsFor(visibleIcons)
      .then(() => { if (active) setSvgRevision((revision) => revision + 1) })
      .catch(() => { if (active) setSvgRevision((revision) => revision + 1) });
    return () => { active = false };
  }, [icons, visibleCount, isLoading]);

  const visibleIcons = icons.slice(0, visibleCount);
  const hasMore = visibleCount < icons.length;

  const handleCopySvg = async (icon: IconItem) => {
    const svgCode = getIconSvg(icon, activeColor, iconSize);
    try {
      await copyToClipboard(svgCode);
      setToastMessage(`Copied SVG: ${icon.name}`);
    } catch {
      setToastMessage(
        "Could not copy SVG. Check clipboard permissions and try again.",
      );
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  // 1. Loading Skeletons State
  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full p-4 md:p-6 grid gap-3",
          viewDensity === "normal"
            ? "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
            : "grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10",
        )}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[168px] flex-col items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 animate-pulse"
          >
            <div className="flex w-full justify-end"><div className="h-7 w-7 rounded-full bg-[var(--surface-strong)]" /></div>
            <div className="h-8 w-8 rounded-md bg-[var(--surface-strong)]" />
            <div className="h-3 w-16 rounded bg-[var(--surface-strong)]" />
            <div className="flex w-full items-center justify-between"><div className="h-5 w-12 rounded-full bg-[var(--surface-strong)]" /><div className="h-6 w-14 rounded-md bg-[var(--surface-strong)]" /></div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty Search State
  if (icons.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center min-h-[380px]">
        <div className="w-14 h-14 rounded-full bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-center text-[#8E8E93] mb-4 shadow-subtle">
          <SearchX className="w-6 h-6 text-[#7141E8]" />
        </div>

        <h3 className="text-base md:text-lg font-semibold text-[#0F1116] mb-1">
          No matching icons found
        </h3>
        <p className="text-xs md:text-sm text-[#8E8E93] max-w-sm mb-6 leading-relaxed">
          {searchQuery
            ? `We couldn't find anything matching "${searchQuery}". Try selecting fewer filters or searching for broader terms.`
            : "There are no icons matching the currently selected filters."}
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1116] hover:bg-[#1E2028] text-white text-xs font-semibold transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset search & filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-3 md:p-6 pb-14 md:pb-32 relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSort}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -3 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.14,
            ease: "easeOut",
          }}
        >
          <div
            className={cn(
              "grid gap-x-3 gap-y-4",
              viewDensity === "normal"
                ? "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
                : "grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10",
            )}
          >
            {visibleIcons.map((icon) => (
              <IconTile
                key={icon.id}
                icon={icon}
                activeColor={activeColor}
                iconSize={iconSize}
                isSaved={savedIconIds.includes(icon.id)}
                isCompared={compareIconIds.includes(icon.id)}
                onToggleSave={onToggleSave}
                onToggleCompare={onToggleCompare}
                onCopySvg={handleCopySvg}
                onSelectIcon={onSelectIcon}
                isSelected={selectedIcon?.id === icon.id}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination / Virtual Batching abstraction for large sets */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center mt-10 mb-4 gap-2">
          <p className="text-xs text-[#8E8E93]">
            Showing {visibleIcons.length} of {icons.length} glyphs
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
          >
            <span>Load more icons</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F1116] text-white text-xs font-semibold shadow-2xl border border-white/10"
          role="status"
          aria-live="polite"
        >
          <div className="w-4 h-4 rounded-full bg-[#2EA45B] flex items-center justify-center text-white shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
