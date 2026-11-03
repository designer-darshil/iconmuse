import React, { useState, useEffect, useMemo } from "react";
import { SearchX, RotateCcw, Check, ChevronDown } from "lucide-react";
import { IconTile } from "./IconTile";
import type { IconItem, SortOption, ViewDensity } from "../../types";
import { cn } from "../../utils/cn";
import {
  CATALOG_SUMMARY,
  getIconSvg,
  loadIconCatalog,
  loadIconSvgsFor,
} from "../../data/iconCatalog";
import { copyToClipboard } from "../../utils/copyToClipboard";

export interface IconGridProps {
  icons: IconItem[];
  totalCount?: number;
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
  totalCount,
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

  const savedSet = useMemo(() => new Set(savedIconIds), [savedIconIds]);
  const compareSet = useMemo(() => new Set(compareIconIds), [compareIconIds]);

  // Reset pagination batch when filters or search change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [totalCount, searchQuery]);

  useEffect(() => {
    if (isLoading) return;
    const visibleIcons = icons.slice(0, visibleCount);
    if (!visibleIcons.some((icon) => !icon.svg)) return;
    let active = true;
    const notify = () => {
      if (active) setSvgRevision((revision) => revision + 1);
    };
    loadIconSvgsFor(visibleIcons, notify)
      .then(notify)
      .catch(notify);
    return () => { active = false };
  }, [icons, visibleCount, isLoading]);

  const effectiveTotal = Math.max(icons.length, totalCount ?? icons.length);
  const visibleIcons = icons.slice(0, visibleCount);
  const hasMore = visibleCount < effectiveTotal;

  const handleLoadMore = () => {
    const nextCount = visibleCount + BATCH_SIZE;
    setVisibleCount(nextCount);
    if (!CATALOG_SUMMARY.isFullCatalogLoaded) {
      void loadIconCatalog().catch(() => undefined);
    }
  };

  const handleCopySvg = React.useCallback(async (icon: IconItem) => {
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
  }, [activeColor, iconSize]);

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
          No icons found
        </h3>
        <p className="text-xs md:text-sm text-[#8E8E93] max-w-sm mb-6 leading-relaxed">
          {searchQuery
            ? `No results for "${searchQuery}". Try another search or clear your filters.`
            : "No icons match the selected filters."}
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1116] hover:bg-[#1E2028] text-white text-xs font-semibold transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-3 md:p-6 pb-14 md:pb-32 relative">
      <div key={activeSort}>
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
              hasSvg={Boolean(icon.svg)}
              activeColor={activeColor}
              iconSize={iconSize}
              isSaved={savedSet.has(icon.id)}
              isCompared={compareSet.has(icon.id)}
              onToggleSave={onToggleSave}
              onToggleCompare={onToggleCompare}
              onCopySvg={handleCopySvg}
              onSelectIcon={onSelectIcon}
              isSelected={selectedIcon?.id === icon.id}
            />
          ))}
        </div>
      </div>

      {/* Pagination / Virtual Batching abstraction for large sets */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center mt-10 mb-4 gap-2">
          <p className="text-xs text-[#8E8E93]">
            Showing {visibleIcons.length.toLocaleString()} of {effectiveTotal.toLocaleString()} icons
          </p>
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F7F7F8] border border-[#E7E7EA] text-xs font-semibold text-[#0F1116] transition-all shadow-subtle hover:-translate-y-[1px] active:translate-y-0"
          >
            <span>Load more</span>
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
