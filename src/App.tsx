import { lazy, Suspense, useEffect, useState } from "react";
// import { AnnouncementStrip } from "./components/layout/AnnouncementStrip";
import { DesktopHeader } from "./components/layout/DesktopHeader";
import { LeftNavRail } from "./components/layout/LeftNavRail";
import { MainWorkspace } from "./components/layout/MainWorkspace";
import { RightSidebar } from "./components/layout/RightSidebar";
import { MobileTopBar } from "./components/layout/MobileTopBar";
import { MobileDrawer } from "./components/layout/MobileDrawer";
import { CompareTray } from "./components/workspace/CompareTray";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { useShellState } from "./hooks/useShellState";
import { useIconFilters } from "./hooks/useIconFilters";
import { ICON_PACKS } from "./data/iconPacks";
import { getIconCatalogItems, loadIconSvgsFor } from "./data/iconCatalog";
import type { RightSidebarPanel, IconItem } from "./types";
import { cn } from "./utils/cn";
import { AnalyticsConsent } from "./components/common/AnalyticsConsent";

const CompareModal = lazy(() => import("./components/workspace/CompareModal").then((module) => ({ default: module.CompareModal })));
const IconDetailModal = lazy(() => import("./components/detail/IconDetailModal").then((module) => ({ default: module.IconDetailModal })));

export default function App({ theme, onThemeChange, catalogReady }: { theme: 'light' | 'dark'; onThemeChange: (theme: 'light' | 'dark') => void; catalogReady: boolean }) {
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

  const {
    state,
    setActiveRailTab,
    toggleRightSidebar,
    setRightSidebarOpen,
    setMobileDrawerOpen,
    setSelectedIcon,
    setActiveColor,
  } = useShellState(breakpoint);

  const {
    filters,
    filteredIcons,
    totalCount,
    catalogCount,
    sourceCounts,
    licenseCounts,
    topicCounts,
    savedIconIds,
    collections,
    compareIconIds,
    detailIconId,
    setSearchQuery,
    setCategory,
    setTopic,
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
  } = useIconFilters(catalogReady);

  // Active right sidebar panel
  const [activePanel, setActivePanel] = useState<RightSidebarPanel>("filters");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSidebarFloating, setIsSidebarFloating] = useState(false);
  const [, setCatalogRevision] = useState(0);
  const themedActiveColor = theme === 'dark' && state.activeColor === '#0F1116' ? '#F4F4F5' : state.activeColor;

  useEffect(() => {
    if (!catalogReady) return;
    const requiredIds = new Set([
      ...savedIconIds,
      ...collections.flatMap((collection) => collection.iconIds),
      ...(detailIconId ? [detailIconId] : []),
    ]);
    const requiredIcons = getIconCatalogItems(requiredIds).filter((icon) => !icon.svg);
    if (requiredIcons.length) {
      void loadIconSvgsFor(requiredIcons)
        .then(() => setCatalogRevision((revision) => revision + 1))
        .catch(() => undefined);
    }
  }, [catalogReady, savedIconIds, collections, detailIconId]);

  const handleCloseSidebar = () => {
    setRightSidebarOpen(false);
    setIsSidebarFloating(false);
  };

  const handleOpenFilters = () => {
    setActivePanel("filters");
    setRightSidebarOpen(true);
  };

  const handleSelectRailItem = (tabId: string) => {
    setActiveRailTab(tabId);
    const panelMap: Record<string, RightSidebarPanel> = {
      discover: "filters",
      collections: "packs",
      saved: "saved",
      extensions: "extensions",
      help: "help",
    };
    const panel = panelMap[tabId];
    if (panel) {
      setActivePanel(panel);
      setRightSidebarOpen(true);
    }
  };
  const handleMobileNavigation = (destination: string) => {
    setMobileDrawerOpen(false);
    if (destination === "discover") {
      setActiveRailTab("discover");
      setRightSidebarOpen(false);
      return;
    }
    handleSelectRailItem(destination);
  };

  // Handle icon selection from the grid: opens deep-linked detail modal
  const handleSelectIcon = (icon: IconItem) => {
    setSelectedIcon(icon);
    if (isMobile) setRightSidebarOpen(false);
    openDetailIcon(icon.id);
  };

  const handleDownloadZip = (iconIds: string[]) => {
    void import("./utils/downloadIconsZip").then(({ downloadIconsZip }) => downloadIconsZip(iconIds));
  };

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
          theme={theme}
          onThemeChange={onThemeChange}
          activeCategory={filters.category}
          onSelectCategory={setCategory}
          onToggleSidebar={toggleRightSidebar}
          isSidebarOpen={state.isRightSidebarOpen}
          totalIconsCount={catalogCount}
        />
      )}
      {isMobile && (
        <MobileTopBar
          theme={theme}
          onThemeChange={onThemeChange}
          activeCategory={filters.category}
          onSelectCategory={setCategory}
          onOpenMenu={() => {
            setRightSidebarOpen(false);
            setMobileDrawerOpen(true);
          }}
        />
      )}

      {/* Responsive Shell Layout Area */}
      <div
        className={cn(
          "app-grid-shell",
          isDesktop &&
            (!state.isRightSidebarOpen || isSidebarFloating) &&
            "!grid-cols-[var(--rail-width)_1fr]",
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
          isLoading={!catalogReady}
          icons={filteredIcons}
          totalCount={totalCount}
          onSelectColor={setActiveColor}
          searchQuery={filters.searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={filters.category}
          activeTopic={filters.topic}
          onSelectCategory={setCategory}
          onSelectTopic={setTopic}
          topicCounts={topicCounts}
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
          onOpenCompare={() => setIsCompareModalOpen(true)}
          onResetFilters={resetFilters}
          onToggleSidebar={handleOpenFilters}
          isSidebarOpen={state.isRightSidebarOpen}
          breakpoint={breakpoint}
          activeColor={themedActiveColor}
          onSelectIcon={handleSelectIcon}
          selectedIcon={state.selectedIcon}
        />

        {/* 5. Right Contextual Sidebar */}
        {/* On Desktop (>=1280px): embedded 360px grid column */}
        {isDesktop && (
          <RightSidebar
            isOpen={state.isRightSidebarOpen}
            onClose={handleCloseSidebar}
            isOverlay={false}
            isFloating={isSidebarFloating}
            onToggleFloating={() => setIsSidebarFloating((isFloating) => !isFloating)}
            activePanel={activePanel}
            activeCategory={filters.category}
            onSelectPanel={setActivePanel}
            activeColor={themedActiveColor}
            onSelectColor={setActiveColor}
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
          onClose={handleCloseSidebar}
          isOverlay={true}
          isMobile={isMobile}
          activePanel={activePanel}
          activeCategory={filters.category}
          onSelectPanel={setActivePanel}
          activeColor={themedActiveColor}
          onSelectColor={setActiveColor}
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
        onSelectNav={handleMobileNavigation}
      />

      {/* Bottom Floating Comparison Tray (Appears when >= 2 icons are selected) */}
      <CompareTray
        compareIconIds={compareIconIds}
        onRemoveCompare={toggleCompare}
        onClearCompare={clearCompare}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        activeColor={themedActiveColor}
      />

      {/* Side-by-Side Comparison Preview Modal */}
      {isCompareModalOpen && (
        <Suspense fallback={null}>
          <CompareModal
            isOpen={isCompareModalOpen}
            onClose={() => setIsCompareModalOpen(false)}
            compareIconIds={compareIconIds}
            activeColor={themedActiveColor}
          />
        </Suspense>
      )}

      {/* Deep-linkable Icon Detail Modal (?icon=<id>) */}
      {detailIconId && (
        <Suspense fallback={null}>
          <IconDetailModal
            iconId={detailIconId}
            onClose={closeDetailIcon}
            onSelectIcon={openDetailIcon}
            savedIconIds={savedIconIds}
            onToggleSave={toggleSave}
            isDark={theme === 'dark'}
            onFindSimilar={(cat) => {
              setCategory(cat);
              closeDetailIcon();
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
