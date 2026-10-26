import { useState } from "react";
// import { AnnouncementStrip } from "./components/layout/AnnouncementStrip";
import { DesktopHeader } from "./components/layout/DesktopHeader";
import { LeftNavRail } from "./components/layout/LeftNavRail";
import { MainWorkspace } from "./components/layout/MainWorkspace";
import { RightSidebar } from "./components/layout/RightSidebar";
import { MobileTopBar } from "./components/layout/MobileTopBar";
import { MobileDrawer } from "./components/layout/MobileDrawer";
import { CompareTray } from "./components/workspace/CompareTray";
import { CompareModal } from "./components/workspace/CompareModal";
import { IconDetailModal } from "./components/detail/IconDetailModal";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { useShellState } from "./hooks/useShellState";
import { useIconFilters } from "./hooks/useIconFilters";
import { ICON_PACKS } from "./data/iconPacks";
import { downloadIconsZip } from "./utils/downloadIconsZip";
import { ICON_CATALOG } from "./data/iconCatalog";
import type { RightSidebarPanel, IconItem } from "./types";
import { cn } from "./utils/cn";
import { AnalyticsConsent } from "./components/common/AnalyticsConsent";

export default function App() {
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

  const {
    state,
    setActiveRailTab,
    toggleRightSidebar,
    setRightSidebarOpen,
    toggleMobileDrawer,
    setMobileDrawerOpen,
    setSelectedIcon,
  } = useShellState(breakpoint);

  const {
    filters,
    filteredIcons,
    totalCount,
    catalogCount,
    sourceCounts,
    licenseCounts,
    savedIconIds,
    collections,
    compareIconIds,
    detailIconId,
    setSearchQuery,
    setCategory,
    setSort,
    setIconSize,
    setActivePackId,
    toggleSource,
    toggleStyle,
    toggleLicense,
    toggleSave,
    createCollection,
    deleteCollection,
    toggleCollectionIcon,
    toggleCompare,
    clearCompare,
    resetFilters,
    openDetailIcon,
    closeDetailIcon,
  } = useIconFilters();

  // Active right sidebar panel ('filters' | 'inspector' | 'packs' | 'saved')
  const [activePanel, setActivePanel] = useState<RightSidebarPanel>("filters");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleSelectRailItem = (tabId: string) => {
    setActiveRailTab(tabId);
    const panelMap: Record<string, RightSidebarPanel> = {
      discover: 'filters', collections: 'packs', saved: 'saved', extensions: 'extensions', help: 'help',
    };
    const panel = panelMap[tabId];
    if (panel) {
      setActivePanel(panel);
      setRightSidebarOpen(true);
    }
  };
  const handleFocusSearch = () => {
    document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus();
  };

  // Handle icon selection from the grid: opens deep-linked detail modal
  const handleSelectIcon = (icon: IconItem) => {
    setSelectedIcon(icon);
    openDetailIcon(icon.id);
  };

  const handleDownloadZip = (iconIds: string[]) => { void downloadIconsZip(iconIds); };

  return (
    <div className="app-root flex flex-col bg-white text-[#0F1116]">
      <AnalyticsConsent measurementId={import.meta.env.VITE_GTAG_ID} />
      {/* AnnouncementStrip is temporarily disabled. */}
      {/* <AnnouncementStrip
        message="The Iconmuse beta is live — discover thousands of icons in one workspace."
        actionText="Sign in"
        actionHref="#signin"
      /> */}

      {!isMobile && (
        <DesktopHeader
          onToggleSidebar={toggleRightSidebar}
          isSidebarOpen={state.isRightSidebarOpen}
          totalIconsCount={catalogCount}
        />
      )}
      {isMobile && (
        <MobileTopBar
          onOpenMobileDrawer={toggleMobileDrawer}
          onOpenSidebar={toggleRightSidebar}
          onFocusSearch={handleFocusSearch}
        />
      )}

      {/* Responsive Shell Layout Area */}
      <div
        className={cn(
          "app-grid-shell",
          isDesktop && !state.isRightSidebarOpen && "!grid-cols-[var(--rail-width)_1fr]",
        )}
      >
        {!isMobile && (
          <LeftNavRail
            activeItemId={state.activeRailTab}
            onSelectItem={handleSelectRailItem}
          />
        )}
        {/* 4. Main Workspace Area */}
        <MainWorkspace
          icons={filteredIcons}
          totalCount={totalCount}
          searchQuery={filters.searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={filters.category}
          onSelectCategory={setCategory}
          activeSort={filters.sort}
          onSelectSort={setSort}
          activePackId={filters.activePackId}
          onSelectPack={setActivePackId}
          iconSize={filters.iconSize}
          savedIconIds={savedIconIds}
          compareIconIds={compareIconIds}
          onToggleSave={toggleSave}
          onToggleCompare={toggleCompare}
          onClearCompare={clearCompare}
          onResetFilters={resetFilters}
          onToggleSidebar={toggleRightSidebar}
          isSidebarOpen={state.isRightSidebarOpen}
          breakpoint={breakpoint}
          activeColor={state.activeColor}
          onSelectIcon={handleSelectIcon}
          selectedIcon={state.selectedIcon}
        />

        {/* 5. Right Contextual Sidebar */}
        {/* On Desktop (>=1280px): embedded 360px grid column */}
        {isDesktop && (
          <RightSidebar
            isOpen={state.isRightSidebarOpen}
            onClose={() => setRightSidebarOpen(false)}
            isOverlay={false}
            activePanel={activePanel}
            onSelectPanel={setActivePanel}
            selectedIcon={state.selectedIcon}
            activeColor={state.activeColor}
            savedIconIds={savedIconIds}
            onToggleSave={toggleSave}
            onSelectIcon={handleSelectIcon}
            sourceCounts={sourceCounts}
            selectedSources={filters.selectedSources}
            onToggleSource={toggleSource}
            collections={collections}
            onCreateCollection={createCollection}
            onDeleteCollection={deleteCollection}
            onToggleCollectionIcon={toggleCollectionIcon}
            onDownloadZip={handleDownloadZip}
            selectedStyles={filters.selectedStyles}
            onToggleStyle={toggleStyle}
            selectedLicenses={filters.selectedLicenses}
            onToggleLicense={toggleLicense}
            licenseCounts={licenseCounts}
            iconSize={filters.iconSize}
            onChangeIconSize={setIconSize}
            onResetFilters={resetFilters}
            activePackId={filters.activePackId}
            onSelectPack={setActivePackId}
            packs={ICON_PACKS}
          />
        )}
      </div>

      {/* On Tablet & Mobile: Right Contextual Sidebar as an Overlay Drawer */}
      {(isTablet || isMobile) && (
        <RightSidebar
          isOpen={state.isRightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          isOverlay={true}
          activePanel={activePanel}
          onSelectPanel={setActivePanel}
          selectedIcon={state.selectedIcon}
          activeColor={state.activeColor}
          savedIconIds={savedIconIds}
          onToggleSave={toggleSave}
          onSelectIcon={handleSelectIcon}
          sourceCounts={sourceCounts}
          selectedSources={filters.selectedSources}
          onToggleSource={toggleSource}
          collections={collections}
          onCreateCollection={createCollection}
          onDeleteCollection={deleteCollection}
          onToggleCollectionIcon={toggleCollectionIcon}
          onDownloadZip={handleDownloadZip}
          selectedStyles={filters.selectedStyles}
          onToggleStyle={toggleStyle}
          selectedLicenses={filters.selectedLicenses}
          onToggleLicense={toggleLicense}
          licenseCounts={licenseCounts}
          iconSize={filters.iconSize}
          onChangeIconSize={setIconSize}
          onResetFilters={resetFilters}
          activePackId={filters.activePackId}
          onSelectPack={setActivePackId}
          packs={ICON_PACKS}
        />
      )}

      <MobileDrawer
        isOpen={state.isMobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeNavId={state.activeRailTab}
        onSelectNav={handleSelectRailItem}
        categories={ICON_CATALOG.reduce((items, icon) => {
          if (!items.some((item) => item.slug === icon.category)) {
            items.push({ id: icon.category, slug: icon.category, name: icon.category, count: 0 });
          }
          return items;
        }, [] as Array<{ id: string; slug: string; name: string; count: number }>)}
        activeCategory={filters.category}
        onSelectCategory={setCategory}
      />

      {/* Bottom Floating Comparison Tray (Appears when >= 2 icons are selected) */}
      <CompareTray
        compareIconIds={compareIconIds}
        onRemoveCompare={toggleCompare}
        onClearCompare={clearCompare}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        activeColor={state.activeColor}
      />

      {/* Side-by-Side Comparison Preview Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareIconIds={compareIconIds}
        activeColor={state.activeColor}
      />

      {/* Deep-linkable Icon Detail Modal (?icon=<id>) */}
      <IconDetailModal
        iconId={detailIconId}
        onClose={closeDetailIcon}
        onSelectIcon={openDetailIcon}
        savedIconIds={savedIconIds}
        onToggleSave={toggleSave}
        onFindSimilar={(cat) => {
          setCategory(cat);
          closeDetailIcon();
        }}
      />
    </div>
  );
}
