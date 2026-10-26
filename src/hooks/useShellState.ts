import { useState, useCallback, useEffect } from 'react'
import type { DeviceBreakpoint, ShellState, IconItem } from '../types'
import { ICON_CATALOG } from '../data/iconCatalog'

export function useShellState(breakpoint: DeviceBreakpoint) {
  const [state, setState] = useState<ShellState>({
    activeRailTab: 'discover',
    isRightSidebarOpen: breakpoint === 'desktop',
    isMobileDrawerOpen: false,
    selectedIcon: ICON_CATALOG[0] || null,
    activeCategory: 'all',
    searchQuery: '',
    activeSort: 'all',
    viewDensity: 'normal',
    activeColor: '#0F1116',
    savedIconIds: [],
    compareIconIds: [],
  })

  // Synchronize sidebar and drawer visibility with screen changes.
  useEffect(() => {
    if (breakpoint === 'desktop') {
      setState((prev: ShellState) => ({ ...prev, isRightSidebarOpen: true, isMobileDrawerOpen: false }))
    } else if (breakpoint === 'tablet') {
      setState((prev: ShellState) => ({ ...prev, isMobileDrawerOpen: false }))
    } else {
      setState((prev: ShellState) => ({ ...prev, isRightSidebarOpen: false }))
    }
  }, [breakpoint])

  const setActiveRailTab = useCallback((tabId: string) => {
    setState((prev: ShellState) => ({ ...prev, activeRailTab: tabId }))
  }, [])

  const toggleRightSidebar = useCallback(() => {
    setState((prev: ShellState) => ({ ...prev, isRightSidebarOpen: !prev.isRightSidebarOpen }))
  }, [])

  const setRightSidebarOpen = useCallback((isOpen: boolean) => {
    setState((prev: ShellState) => ({ ...prev, isRightSidebarOpen: isOpen }))
  }, [])

  const toggleMobileDrawer = useCallback(() => {
    setState((prev: ShellState) => ({ ...prev, isMobileDrawerOpen: !prev.isMobileDrawerOpen }))
  }, [])

  const setMobileDrawerOpen = useCallback((isOpen: boolean) => {
    setState((prev: ShellState) => ({ ...prev, isMobileDrawerOpen: isOpen }))
  }, [])

  const setSelectedIcon = useCallback((icon: IconItem) => {
    setState((prev: ShellState) => ({
      ...prev,
      selectedIcon: icon,
      isRightSidebarOpen: true,
    }))
  }, [])

  return {
    state,
    setActiveRailTab,
    toggleRightSidebar,
    setRightSidebarOpen,
    toggleMobileDrawer,
    setMobileDrawerOpen,
    setSelectedIcon,
  }
}
