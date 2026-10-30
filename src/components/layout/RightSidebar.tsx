import React, { lazy, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  SlidersHorizontal,
  ExternalLink,
  Boxes,
  Bookmark,
} from "lucide-react";
import { FiltersPanel } from "../sidebar/FiltersPanel";
import type { RightSidebarProps, RightSidebarPanel } from "../../types";
import { cn } from "../../utils/cn";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

const PacksPanel = lazy(() => import("../sidebar/PacksPanel").then((module) => ({ default: module.PacksPanel })));
const SavedPanel = lazy(() => import("../sidebar/SavedPanel").then((module) => ({ default: module.SavedPanel })));
const ExtensionsPanel = lazy(() => import("../sidebar/ExtensionsPanel").then((module) => ({ default: module.ExtensionsPanel })));
const HelpPanel = lazy(() => import("../sidebar/HelpPanel").then((module) => ({ default: module.HelpPanel })));

const PanelLoading = () => (
  <div className="flex min-h-40 items-center justify-center text-sm text-[var(--muted)]" role="status">
    Loading section…
  </div>
);

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  isOverlay = false,
  isMobile = false,
  isFloating = false,
  onToggleFloating,
  activePanel,
  activeCategory,
  onSelectPanel,
  activeColor = "#0F1116",
  onSelectColor,
  savedIconIds,
  onToggleSave,
  onSelectIcon,
  sourceCounts,
  selectedSources,
  onToggleSource,
  collections,
  onCreateCollection,
  onDeleteCollection,
  onToggleCollectionIcon,
  onDownloadZip,
  selectedStyles,
  onToggleStyle,
  selectedLicenses,
  onToggleLicense,
  licenseCounts,
  iconSize,
  onChangeIconSize,
  onResetFilters,
  activePackId,
  onSelectPack,
  packs,
}) => {
  useOverlayScrollLock(isOverlay && isOpen);
  const shouldReduceMotion = useReducedMotion();

  const panelTitles: Record<RightSidebarPanel, string> = {
    filters: "Filters & Customization",
    packs: "Curated Icon Packs",
    saved: "Saved Favorites",
    extensions: "Icon Libraries",
    help: "Help & Docs",
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case "filters":
        return (
          <FiltersPanel
            selectedStyles={selectedStyles}
            onToggleStyle={onToggleStyle}
            selectedLicenses={selectedLicenses}
            onToggleLicense={onToggleLicense}
            iconSize={iconSize}
            onChangeIconSize={onChangeIconSize}
            onResetFilters={onResetFilters}
            licenseCounts={licenseCounts}
            sourceCounts={sourceCounts}
            selectedSources={selectedSources}
            onToggleSource={onToggleSource}
            activeCategory={activeCategory}
            activeColor={activeColor}
            onSelectColor={onSelectColor}
          />
        );
      case "extensions":
        return (
          <Suspense fallback={<PanelLoading />}>
          <ExtensionsPanel
            sourceCounts={sourceCounts}
            selectedSources={selectedSources}
            onToggleSource={onToggleSource}
          />
          </Suspense>
        );
      case "help":
        return <Suspense fallback={<PanelLoading />}><HelpPanel /></Suspense>;
      case "packs":
        return (
          <Suspense fallback={<PanelLoading />}>
          <PacksPanel
            activePackId={activePackId}
            onSelectPack={onSelectPack}
            packs={packs}
          />
          </Suspense>
        );
      case "saved":
        return (
          <Suspense fallback={<PanelLoading />}>
          <SavedPanel
            savedIconIds={savedIconIds}
            onToggleSave={onToggleSave}
            onSelectIcon={onSelectIcon}
            activeColor={activeColor}
            collections={collections}
            onCreateCollection={onCreateCollection}
            onDeleteCollection={onDeleteCollection}
            onToggleCollectionIcon={onToggleCollectionIcon}
            onDownloadZip={onDownloadZip}
          />
          </Suspense>
        );
      default:
        return null;
    }
  };

  const sidebarHeader = (
    <div className="h-14 px-4 border-b border-[#E7E7EA] flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-xs font-bold text-[#0F1116] tracking-tight truncate m-0">
          {panelTitles[activePanel]}
        </h2>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!isOverlay && onToggleFloating && (
          <button
            type="button"
            onClick={onToggleFloating}
            aria-label={isFloating ? "Dock sidebar" : "Float sidebar"}
            title={isFloating ? "Dock sidebar" : "Float sidebar"}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-all hover:-translate-y-[1px] active:translate-y-0"
          >
            <ExternalLink
              className={cn("w-3.5 h-3.5", isFloating && "rotate-180")}
            />
          </button>
        )}

        {/* Close Button on overlay mode */}
        {isOverlay && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-all hover:-translate-y-[1px] active:translate-y-0 ml-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  const sectionTabs = (
    <div className="mobile-sidebar-section-tabs flex items-center justify-between px-3 py-1.5 border-b border-[#E7E7EA] bg-[#F7F7F8] shrink-0">
      {[
        {
          id: "filters" as RightSidebarPanel,
          label: "Filters",
          icon: SlidersHorizontal,
        },
        { id: "packs" as RightSidebarPanel, label: "Packs", icon: Boxes },
        {
          id: "saved" as RightSidebarPanel,
          label: "Saved",
          icon: Bookmark,
          badge: savedIconIds.length,
        },
      ].map((tab) => {
        const isActive = activePanel === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectPanel(tab.id)}
            className={cn(
              "mobile-sidebar-tab flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all hover:-translate-y-px active:translate-y-0",
              isActive
                ? "bg-white text-[#0F1116] shadow-xs"
                : "text-[#8E8E93] hover:text-[#0F1116]",
            )}
          >
            <Icon
              className={cn(
                "mobile-sidebar-tab-icon",
                "w-3 h-3",
                isActive ? "text-[#7141E8]" : "text-[#8E8E93]",
              )}
            />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="text-[9px] font-bold bg-[#7141E8] text-white px-1 rounded-full min-w-3 text-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Horizontal slide + fade animation variant
  const slideVariants = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -12 },
  };

  // Overlay Mode (Tablet / Mobile)
  if (isOverlay) {
    return (
      <AnimatePresence>
        {isOpen && (
        <div className="mobile-sidebar-overlay fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#0F1116]/30 backdrop-blur-xs"
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.22,
                ease: "easeOut",
              }}
              className={cn(
                "relative z-10 w-full max-w-[360px] h-full bg-white border-l border-[#E7E7EA] shadow-2xl flex flex-col",
                isMobile && "mobile-sidebar-drawer",
              )}
              aria-label="Contextual Right Panel"
            >
              {sidebarHeader}
              {sectionTabs}

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    className="min-h-full"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    {renderPanelContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Static Column
  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "right-sidebar w-[360px] border-l border-[#E7E7EA] bg-white flex flex-col h-full overflow-hidden",
        isFloating &&
          "fixed right-4 top-[84px] bottom-4 z-40 h-auto rounded-[18px] border shadow-[0_18px_48px_rgba(15,17,22,0.16)]",
      )}
      aria-label="Contextual Right Panel"
    >
      {sidebarHeader}
      {sectionTabs}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            className="min-h-full"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {renderPanelContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
};
