import { useState } from 'react'
import { AnnouncementStrip } from './components/layout/AnnouncementStrip'
import { DesktopHeader } from './components/layout/DesktopHeader'
import { LeftNavRail } from './components/layout/LeftNavRail'
import { MainWorkspace } from './components/layout/MainWorkspace'
import { RightSidebar } from './components/layout/RightSidebar'
import { MobileTopBar } from './components/layout/MobileTopBar'
import { MobileDrawer } from './components/layout/MobileDrawer'
import { CompareTray } from './components/workspace/CompareTray'
import { CompareModal } from './components/workspace/CompareModal'
import { IconDetailModal } from './components/detail/IconDetailModal'
import { useBreakpoint } from './hooks/useBreakpoint'
import { useShellState } from './hooks/useShellState'
import { useIconFilters } from './hooks/useIconFilters'
import { MOCK_CATEGORIES } from './data/mockIcons'
import { MOCK_PACKS } from './data/mockPacks'
import type { RightSidebarPanel, IconItem } from './types'
import { cn } from './utils/cn'

export default function App() {
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

  const {
    state,
    setActiveRailTab,
    toggleRightSidebar,
    setRightSidebarOpen,
    toggleMobileDrawer,
    setMobileDrawerOpen,
    setSelectedIcon,
  } = useShellState(breakpoint)

  const {
    filters,
    filteredIcons,
    totalCount,
    savedIconIds,
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
    toggleCompare,
    clearCompare,
    resetFilters,
    openDetailIcon,
    closeDetailIcon,
  } = useIconFilters()

  // Active right sidebar panel ('filters' | 'inspector' | 'packs' | 'saved')
  const [activePanel, setActivePanel] = useState<RightSidebarPanel>('filters')
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)

  // Handle left navigation rail clicks
  const handleSelectRailItem = (tabId: string) => {
    setActiveRailTab(tabId)
    if (tabId === 'discover') {
      setActivePanel('filters')
      setRightSidebarOpen(true)
    } else if (tabId === 'collections') {
      setActivePanel('packs')
      setRightSidebarOpen(true)
    } else if (tabId === 'saved') {
      setActivePanel('saved')
      setRightSidebarOpen(true)
    }
  }

  // Handle icon selection from the grid: opens deep-linked detail modal
  const handleSelectIcon = (icon: IconItem) => {
    setSelectedIcon(icon)
    openDetailIcon(icon.id)
  }

  const handleFocusSearch = () => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder*="Search 32,000+"]')
    input?.focus()
  }

  return (
    <div className="app-root min-h-screen flex flex-col bg-white text-[#0F1116]">
      {/* 1. 44px Announcement Strip */}
      <AnnouncementStrip
        message="The Iconora beta is live — discover thousands of icons in one workspace."
        actionText="Sign in"
        actionHref="#signin"
      />

      {/* 2. Desktop Header (Visible on Desktop and Tablet >= 768px) */}
      {!isMobile && (
        <DesktopHeader
          onToggleSidebar={toggleRightSidebar}
          isSidebarOpen={state.isRightSidebarOpen}
          totalIconsCount={totalCount}
        />
      )}

      {/* 6a. Mobile Top Bar (Visible on Mobile < 768px) */}
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
          'app-grid-shell',
          // If on desktop and sidebar is closed, adjust grid template to 2 columns
          isDesktop && !state.isRightSidebarOpen && '!grid-cols-[var(--rail-width)_1fr]'
        )}
      >
        {/* 3. Left Navigation Rail (Visible on Desktop >= 1280px and Tablet 768px-1279px) */}
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
            selectedSources={filters.selectedSources}
            onToggleSource={toggleSource}
            selectedStyles={filters.selectedStyles}
            onToggleStyle={toggleStyle}
            selectedLicenses={filters.selectedLicenses}
            onToggleLicense={toggleLicense}
            iconSize={filters.iconSize}
            onChangeIconSize={setIconSize}
            onResetFilters={resetFilters}
            activePackId={filters.activePackId}
            onSelectPack={setActivePackId}
            packs={MOCK_PACKS}
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
          selectedSources={filters.selectedSources}
          onToggleSource={toggleSource}
          selectedStyles={filters.selectedStyles}
          onToggleStyle={toggleStyle}
          selectedLicenses={filters.selectedLicenses}
          onToggleLicense={toggleLicense}
          iconSize={filters.iconSize}
          onChangeIconSize={setIconSize}
          onResetFilters={resetFilters}
          activePackId={filters.activePackId}
          onSelectPack={setActivePackId}
          packs={MOCK_PACKS}
        />
      )}

      {/* 6b. Mobile Drawer (Slide-in menu for < 768px) */}
      <MobileDrawer
        isOpen={state.isMobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeNavId={state.activeRailTab}
        onSelectNav={handleSelectRailItem}
        categories={MOCK_CATEGORIES}
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
          setCategory(cat)
          closeDetailIcon()
        }}
      />
    </div>
  )
}
