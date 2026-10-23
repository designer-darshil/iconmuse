import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X,
  SlidersHorizontal,
  ExternalLink,
  Boxes,
  Bookmark,
  Sparkles,
} from 'lucide-react'
import { FiltersPanel } from '../sidebar/FiltersPanel'
import { PacksPanel } from '../sidebar/PacksPanel'
import { SavedPanel } from '../sidebar/SavedPanel'
import { InspectorPlaceholder } from '../placeholders/InspectorPlaceholder'
import type { RightSidebarProps, RightSidebarPanel } from '../../types'
import { cn } from '../../utils/cn'

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  isOverlay = false,
  activePanel,
  onSelectPanel,
  selectedIcon,
  activeColor = '#0F1116',
  savedIconIds,
  onToggleSave,
  onSelectIcon,
  selectedSources,
  onToggleSource,
  selectedStyles,
  onToggleStyle,
  selectedLicenses,
  onToggleLicense,
  iconSize,
  onChangeIconSize,
  onResetFilters,
  activePackId,
  onSelectPack,
  packs,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const panelTitles: Record<RightSidebarPanel, string> = {
    filters: 'Filters & Customization',
    inspector: 'Icon Inspector',
    packs: 'Curated Icon Packs',
    saved: 'Saved Favorites',
  }

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'filters':
        return (
          <FiltersPanel
            selectedSources={selectedSources}
            onToggleSource={onToggleSource}
            selectedStyles={selectedStyles}
            onToggleStyle={onToggleStyle}
            selectedLicenses={selectedLicenses}
            onToggleLicense={onToggleLicense}
            iconSize={iconSize}
            onChangeIconSize={onChangeIconSize}
            onResetFilters={onResetFilters}
          />
        )
      case 'inspector':
        return (
          <InspectorPlaceholder
            selectedIcon={selectedIcon}
            activeColor={activeColor}
          />
        )
      case 'packs':
        return (
          <PacksPanel
            activePackId={activePackId}
            onSelectPack={onSelectPack}
            packs={packs}
          />
        )
      case 'saved':
        return (
          <SavedPanel
            savedIconIds={savedIconIds}
            onToggleSave={onToggleSave}
            onSelectIcon={onSelectIcon}
            activeColor={activeColor}
          />
        )
      default:
        return null
    }
  }

  const sidebarHeader = (
    <div className="h-14 px-4 border-b border-[#E7E7EA] flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-xs font-bold text-[#0F1116] tracking-tight truncate m-0">
          {panelTitles[activePanel]}
        </h2>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Detach / Open-in-new-panel icon button */}
        <button
          type="button"
          onClick={() => {
            window.open(window.location.href, '_blank')
          }}
          aria-label="Open panel in new window"
          title="Open in new window"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#0F1116] hover:bg-[#F7F7F8] transition-all hover:-translate-y-[1px] active:translate-y-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

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
  )

  const sectionTabs = (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#E7E7EA] bg-[#F7F7F8] shrink-0">
      {[
        { id: 'filters' as RightSidebarPanel, label: 'Filters', icon: SlidersHorizontal },
        { id: 'inspector' as RightSidebarPanel, label: 'Inspector', icon: Sparkles },
        { id: 'packs' as RightSidebarPanel, label: 'Packs', icon: Boxes },
        { id: 'saved' as RightSidebarPanel, label: 'Saved', icon: Bookmark, badge: savedIconIds.length },
      ].map((tab) => {
        const isActive = activePanel === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectPanel(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all hover:-translate-y-[1px] active:translate-y-0',
              isActive
                ? 'bg-white text-[#0F1116] shadow-xs'
                : 'text-[#8E8E93] hover:text-[#0F1116]'
            )}
          >
            <Icon className={cn('w-3 h-3', isActive ? 'text-[#7141E8]' : 'text-[#8E8E93]')} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="text-[9px] font-bold bg-[#7141E8] text-white px-1 rounded-full min-w-3 text-center">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )

  // Horizontal slide + fade animation variant
  const slideVariants = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -12 },
  }

  // Overlay Mode (Tablet / Mobile)
  if (isOverlay) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-[360px] h-full bg-white border-l border-[#E7E7EA] shadow-2xl flex flex-col"
              aria-label="Contextual Right Panel"
            >
              {sidebarHeader}
              {sectionTabs}

              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  >
                    {renderPanelContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    )
  }

  // Desktop Static Column
  if (!isOpen) return null

  return (
    <aside
      className="right-sidebar w-[360px] border-l border-[#E7E7EA] bg-white flex flex-col h-full overflow-hidden"
      aria-label="Contextual Right Panel"
    >
      {sidebarHeader}
      {sectionTabs}

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {renderPanelContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  )
}
