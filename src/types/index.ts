import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import type { IconPack } from '../data/iconPacks'

export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop'

export type IconStyle = 'stroke' | 'solid' | 'duotone' | 'thin' | '3d' | 'regular' | 'bold' | 'light' | 'fill' | 'outline' | 'filled' | 'line' | 'sharp' | 'illustration'

export type IconSource = 'Lucide' | 'Phosphor' | 'Tabler' | 'Heroicons' | 'Simple Icons' | 'Feather Icons' | 'Remix Icon' | 'Lineicons' | 'Open Doodles' | 'Open Peeps' | 'Fluent Emoji' | 'Flowbite Illustrations' | 'Bioicons' | 'IRA Design'

export interface IconItem {
  id: string
  name: string
  category: string
  source: IconSource
  style: IconStyle
  license: string
  author?: string
  component: ComponentType<LucideProps>
  svg: string
  tags: string[]
  viewBox?: string
  isNew?: boolean
  strokeWidth?: number
  popularity: number
  isPopular?: boolean
}

export interface CategoryItem {
  id: string
  name: string
  count: number
  slug: string
  iconName?: string
}

export interface NavRailItem {
  id: string
  label: string
  iconName: 'discover' | 'collections' | 'saved' | 'extensions' | 'help'
  badge?: string | number
}

export type RightSidebarPanel = 'filters' | 'inspector' | 'packs' | 'saved' | 'extensions' | 'help'

export type SortOption = 'all' | 'relevant' | 'popular' | 'trending' | 'name-asc' | 'name-desc'

export type ViewDensity = 'normal' | 'compact'

export interface ShellState {
  activeRailTab: string
  isRightSidebarOpen: boolean
  isMobileDrawerOpen: boolean
  selectedIcon: IconItem | null
  activeCategory: string
  searchQuery: string
  activeSort: SortOption
  viewDensity: ViewDensity
  activeColor: string
  savedIconIds: string[]
  compareIconIds: string[]
}

export interface IconFilterState {
  category: string
  searchQuery: string
  selectedSources: string[]
  selectedStyles: string[]
  selectedLicenses: string[]
  iconSize: number
  sort: SortOption
  activePackId: string | null
}

export interface AnnouncementStripProps {
  message?: string
  actionText?: string
  actionHref?: string
  onDismiss?: () => void
  showDismiss?: boolean
}

export interface DesktopHeaderProps {
  onOpenSearch?: () => void
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
  totalIconsCount?: number
}

export interface LeftNavRailProps {
  activeItemId: string
  onSelectItem: (id: string) => void
}

export interface MainWorkspaceProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
  breakpoint?: DeviceBreakpoint
  activeColor?: string
  onSelectIcon?: (icon: IconItem) => void
  selectedIcon?: IconItem | null
  activePanel?: RightSidebarPanel
  onSelectPanel?: (panel: RightSidebarPanel) => void
}

export interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
  isOverlay?: boolean
  activePanel: RightSidebarPanel
  onSelectPanel: (panel: RightSidebarPanel) => void
  selectedIcon?: IconItem | null
  activeColor?: string
  savedIconIds: string[]
  onToggleSave: (id: string) => void
  onSelectIcon: (icon: IconItem) => void
  sourceCounts: Record<string, number>
  selectedSources: string[]
  onToggleSource: (source: string) => void
  collections: IconCollection[]
  onCreateCollection: (name: string) => void
  onDeleteCollection: (id: string) => void
  onToggleCollectionIcon: (collectionId: string, iconId: string) => void
  onDownloadZip: (iconIds: string[]) => void
  // Filter controls
  selectedStyles: string[]
  onToggleStyle: (style: string) => void
  selectedLicenses: string[]
  onToggleLicense: (license: string) => void
  licenseCounts?: Record<string, number>
  iconSize: number
  onChangeIconSize: (size: number) => void
  onResetFilters: () => void
  activePackId: string | null
  onSelectPack: (packId: string | null) => void
  packs?: IconPack[]
}

export interface IconCollection {
  id: string
  name: string
  iconIds: string[]
}

export interface MobileTopBarProps {
  onOpenMobileDrawer: () => void
  onOpenSidebar: () => void
  onFocusSearch?: () => void
  totalIconsCount?: number
}

export interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeNavId: string
  onSelectNav: (id: string) => void
  categories?: CategoryItem[]
  activeCategory?: string
  onSelectCategory?: (slug: string) => void
}

