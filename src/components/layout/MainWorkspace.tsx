import React, { useState } from "react";
import { Boxes, X } from "lucide-react";
import { MainToolbar } from "../workspace/MainToolbar";
import { SortRow } from "../workspace/SortRow";
import { IconGrid } from "../workspace/IconGrid";
import { ICON_PACKS } from "../../data/iconPacks";
import type {
  MainWorkspaceProps,
  SortOption,
  ViewDensity,
  IconItem,
} from "../../types";

export interface MainWorkspaceFullProps extends MainWorkspaceProps {
  icons: IconItem[];
  totalCount: number;
  onSelectColor: (color: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  activeTopic: string | null;
  onSelectCategory: (category: string) => void;
  onSelectTopic: (topic: string | null) => void;
  topicCounts: Record<string, number>;
  activeSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  activePackId: string | null;
  onSelectPack: (packId: string | null) => void;
  iconSize: number;
  savedIconIds: string[];
  compareIconIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onClearCompare: () => void;
  onResetFilters: () => void;
}

export const MainWorkspace: React.FC<MainWorkspaceFullProps> = ({
  isLoading = false,
  icons,
  totalCount,
  onSelectColor,
  searchQuery,
  onSearchChange,
  activeCategory,
  activeTopic,
  onSelectCategory,
  onSelectTopic,
  topicCounts,
  activeSort,
  onSelectSort,
  activePackId,
  onSelectPack,
  iconSize,
  savedIconIds,
  compareIconIds,
  onToggleSave,
  onToggleCompare,
  onClearCompare,
  onOpenCompare,
  onResetFilters,
  onToggleSidebar,
  breakpoint,
  isSidebarOpen,
  activeColor = "#0F1116",
  onSelectIcon,
  selectedIcon,
}) => {
  const [viewDensity, setViewDensity] = useState<ViewDensity>("normal");
  const activePack = ICON_PACKS.find((p) => p.id === activePackId);

  return (
    <main
      className="main-workspace flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-white"
      id="main-content"
      data-breakpoint={breakpoint}
      data-sidebar-open={isSidebarOpen}
    >
      {/* 1. Main Toolbar: Library, Search, and Recolor Controls */}
      <MainToolbar
        activeCategory={activeCategory}
        activeTopic={activeTopic}
        onSelectCategory={onSelectCategory}
        onSelectTopic={onSelectTopic}
        topicCounts={topicCounts}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeColor={activeColor}
        onSelectColor={onSelectColor}
      />

      {/* Active Pack Contextual Banner if a pack is active */}
      {activePack && (
        <div className="mx-4 md:mx-6 mt-1 mb-2 p-3 rounded-[14px] bg-[#F7F7F8] border border-[#E7E7EA] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-white shrink-0 shadow-2xs"
              style={{ background: activePack.accentColor }}
            >
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0F1116]">
                  Pack: {activePack.title}
                </span>
                <span className="text-[10px] font-mono text-[#7141E8] bg-[#7141E8]/10 px-1.5 py-0.2 rounded-full font-semibold">
                  {icons.length} glyphs
                </span>
              </div>
              <p className="text-[11px] text-[#8E8E93] m-0">
                {activePack.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPack(null)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-[#8E8E93] hover:text-[#0F1116] hover:bg-white border border-transparent hover:border-[#E7E7EA] transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear pack</span>
          </button>
        </div>
      )}

      {/* 2. Sort Row: Tabs with active 2px bottom border & black count pill, Compare & Density toggles */}
      <SortRow
        totalCount={totalCount}
        activeSort={activeSort}
        onSelectSort={onSelectSort}
        compareCount={compareIconIds.length}
        onClearCompare={onClearCompare}
        onOpenCompare={onOpenCompare}
        onOpenFilters={onToggleSidebar}
        viewDensity={viewDensity}
        onChangeViewDensity={setViewDensity}
      />

      {/* 3. Icon Grid Canvas with Layout Transitions & Size slider sync */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <IconGrid
          isLoading={isLoading}
          icons={icons}
          activeSort={activeSort}
          searchQuery={searchQuery}
          activeColor={activeColor}
          iconSize={iconSize}
          savedIconIds={savedIconIds}
          compareIconIds={compareIconIds}
          onToggleSave={onToggleSave}
          onToggleCompare={onToggleCompare}
          onSelectIcon={onSelectIcon || (() => {})}
          selectedIcon={selectedIcon || null}
          onResetFilters={onResetFilters}
          viewDensity={viewDensity}
        />
      </div>
    </main>
  );
};
