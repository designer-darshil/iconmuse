import { useState, useMemo, useEffect, useCallback } from 'react'
import { ICON_CATALOG } from '../data/iconCatalog'
import { ICON_PACKS } from '../data/iconPacks'
import { iconSearchScore } from '../utils/iconSearch'
import type { IconCollection, IconFilterState, SortOption } from '../types'

const LOCAL_STORAGE_SAVED_KEY = 'iconmuse_saved_icons'
const LOCAL_STORAGE_COLLECTIONS_KEY = 'iconmuse_icon_collections'

export function useIconFilters() {
  // Read initial values from URL query parameters if present
  const getInitialUrlState = (): IconFilterState => {
    if (typeof window === 'undefined') {
      return {
        category: 'all',
        searchQuery: '',
        selectedSources: [],
        selectedStyles: [],
        selectedLicenses: [],
        iconSize: 24,
        sort: 'all',
        activePackId: null,
      }
    }

    const params = new URLSearchParams(window.location.search)
    const q = params.get('q') || ''
    const category = params.get('category') || 'all'
    const sort = (params.get('sort') as SortOption) || 'all'
    const sourcesParam = params.get('sources')
    const selectedSources = sourcesParam ? sourcesParam.split(',').filter(Boolean) : []
    const pack = params.get('pack') || null

    return {
      category,
      searchQuery: q,
      selectedSources,
      selectedStyles: [],
      selectedLicenses: [],
      iconSize: 24,
      sort,
      activePackId: pack,
    }
  }

  const [filters, setFilters] = useState<IconFilterState>(getInitialUrlState)

  // Deep-linkable Icon Detail ID
  const [detailIconId, setDetailIconId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('icon') || null
  })

  // Saved Icons in LocalStorage
  const [savedIconIds, setSavedIconIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY)
      if (stored) {
        const availableIds = new Set(ICON_CATALOG.map((icon) => icon.id))
        return (JSON.parse(stored) as string[]).filter((id) => availableIds.has(id))
      }
    } catch {
      // fallback
    }
    return []
  })
  const [collections, setCollections] = useState<IconCollection[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const parsed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COLLECTIONS_KEY) || '[]') as IconCollection[]
      const validIds = new Set(ICON_CATALOG.map((icon) => icon.id))
      return parsed
        .filter((collection) => collection && typeof collection.id === 'string' && typeof collection.name === 'string' && Array.isArray(collection.iconIds))
        .map((collection) => ({ ...collection, iconIds: collection.iconIds.filter((id) => validIds.has(id)) }))
    } catch {
      return []
    }
  })

  // Sync Saved Icons to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedIconIds))
    } catch {
      // ignore storage errors
    }
  }, [savedIconIds])

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_COLLECTIONS_KEY, JSON.stringify(collections))
    } catch {
      // Ignore storage errors.
    }
  }, [collections])

  // Compare State (Up to 4 icons)
  const [compareIconIds, setCompareIconIds] = useState<string[]>([])

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const iconParam = params.get('icon') || null
      setDetailIconId(iconParam)

      // Also sync filters on popstate if needed
      const q = params.get('q') || ''
      const category = params.get('category') || 'all'
      const sort = (params.get('sort') as SortOption) || 'all'
      const sourcesParam = params.get('sources')
      const selectedSources = sourcesParam ? sourcesParam.split(',').filter(Boolean) : []
      const pack = params.get('pack') || null

      setFilters((prev) => ({
        ...prev,
        searchQuery: q,
        category,
        sort,
        selectedSources,
        activePackId: pack,
      }))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Sync URL search params when key filters change or detailIconId changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()
    if (filters.searchQuery.trim()) {
      params.set('q', filters.searchQuery.trim())
    }
    if (filters.category && filters.category !== 'all') {
      params.set('category', filters.category)
    }
    if (filters.sort && filters.sort !== 'all') {
      params.set('sort', filters.sort)
    }
    if (filters.selectedSources.length > 0) {
      params.set('sources', filters.selectedSources.join(','))
    }
    if (filters.activePackId) {
      params.set('pack', filters.activePackId)
    }
    if (detailIconId) {
      params.set('icon', detailIconId)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname

    // If detail modal opened or closed, pushState allows browser Back to close it
    if (detailIconId) {
      const currentParam = new URLSearchParams(window.location.search).get('icon')
      if (currentParam !== detailIconId) {
        window.history.pushState({}, '', newUrl)
        return
      }
    }

    window.history.replaceState({}, '', newUrl)
  }, [filters.searchQuery, filters.category, filters.sort, filters.selectedSources, filters.activePackId, detailIconId])

  // Open and close detail modal
  const openDetailIcon = useCallback((id: string) => {
    setDetailIconId(id)
  }, [])

  const closeDetailIcon = useCallback(() => {
    setDetailIconId(null)
  }, [])

  // Toggle Save Icon
  const toggleSave = useCallback((id: string) => {
    const isSaved = savedIconIds.includes(id)
    setSavedIconIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
    if (isSaved) {
      setCollections((prev) => prev.map((collection) => ({
        ...collection,
        iconIds: collection.iconIds.filter((iconId) => iconId !== id),
      })))
    }
  }, [savedIconIds])

  const createCollection = useCallback((name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    const id = `collection-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36)}`
    setCollections((prev) => [...prev, { id, name: trimmedName, iconIds: [] }])
  }, [])

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id))
  }, [])

  const toggleCollectionIcon = useCallback((collectionId: string, iconId: string) => {
    setCollections((prev) => prev.map((collection) => {
      if (collection.id !== collectionId) return collection
      const hasIcon = collection.iconIds.includes(iconId)
      return { ...collection, iconIds: hasIcon ? collection.iconIds.filter((id) => id !== iconId) : [...collection.iconIds, iconId] }
    }))
  }, [])

  // Toggle Compare Icon (max 4)
  const toggleCompare = useCallback((id: string) => {
    setCompareIconIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      if (prev.length >= 4) {
        return prev // limit to 4
      }
      return [...prev, id]
    })
  }, [])

  const clearCompare = useCallback(() => {
    setCompareIconIds([])
  }, [])

  // Setters
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }))
  }, [])

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category, activePackId: null }))
  }, [])

  const setSort = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }))
  }, [])

  const setIconSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, iconSize: size }))
  }, [])

  const setActivePackId = useCallback((packId: string | null) => {
    setFilters((prev) => ({ ...prev, activePackId: packId, category: 'all' }))
  }, [])

  const toggleSource = useCallback((source: string) => {
    setFilters((prev) => {
      const exists = prev.selectedSources.includes(source)
      return {
        ...prev,
        selectedSources: exists
          ? prev.selectedSources.filter((s) => s !== source)
          : [...prev.selectedSources, source],
      }
    })
  }, [])

  const toggleStyle = useCallback((style: string) => {
    setFilters((prev) => {
      const exists = prev.selectedStyles.includes(style)
      return {
        ...prev,
        selectedStyles: exists
          ? prev.selectedStyles.filter((s) => s !== style)
          : [...prev.selectedStyles, style],
      }
    })
  }, [])

  const toggleLicense = useCallback((license: string) => {
    setFilters((prev) => {
      const exists = prev.selectedLicenses.includes(license)
      return {
        ...prev,
        selectedLicenses: exists
          ? prev.selectedLicenses.filter((l) => l !== license)
          : [...prev.selectedLicenses, license],
      }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      category: 'all',
      searchQuery: '',
      selectedSources: [],
      selectedStyles: [],
      selectedLicenses: [],
      iconSize: 24,
      sort: 'all',
      activePackId: null,
    })
  }, [])

  // Filtering Calculation
  const filteredIcons = useMemo(() => {
    let result = [...ICON_CATALOG]

    // 1. Pack Filter (if active pack)
    if (filters.activePackId) {
      const pack = ICON_PACKS.find((p) => p.id === filters.activePackId)
      if (pack) {
        result = result.filter((icon) => pack.iconIds.includes(icon.id))
      }
    }

    // 2. Category Filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(
        (icon) => icon.category.toLowerCase() === filters.category.toLowerCase()
      )
    }

    // 3. Sources Filter
    if (filters.selectedSources.length > 0) {
      result = result.filter((icon) => filters.selectedSources.includes(icon.source))
    }

    // 4. Styles Filter
    if (filters.selectedStyles.length > 0) {
      result = result.filter((icon) => {
        const normStyle = icon.style.toLowerCase()
        return filters.selectedStyles.some((st) => {
          const s = st.toLowerCase()
          if (s === 'outline') return normStyle === 'stroke'
          return normStyle === s
        })
      })
    }

    // 5. Licenses Filter
    if (filters.selectedLicenses.length > 0) {
      result = result.filter((icon) => filters.selectedLicenses.includes(icon.license))
    }

    // 6. Search Query
    if (filters.searchQuery.trim()) {
      result = result
        .map((icon) => ({ icon, score: iconSearchScore(icon, filters.searchQuery) }))
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score || a.icon.name.localeCompare(b.icon.name))
        .map((match) => match.icon)
    }

    // 7. Sort
    switch (filters.sort) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return result
  }, [filters])

  // Dynamic counts for filter badges
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Lucide: 0,
      Phosphor: 0,
      Tabler: 0,
      Heroicons: 0,
      'Simple Icons': 0,
      'Feather Icons': 0,
      'Remix Icon': 0,
      Lineicons: 0,
      'Open Doodles': 0,
      'Open Peeps': 0,
      'Fluent Emoji': 0,
      'Flowbite Illustrations': 0,
      Bioicons: 0,
      'IRA Design': 0,
    }
    ICON_CATALOG.forEach((icon) => {
      if (counts[icon.source] !== undefined) {
        counts[icon.source]++
      } else {
        counts[icon.source] = 1
      }
    })
    return counts
  }, [])

  const licenseCounts = useMemo(() => {
    const counts: Record<string, number> = { MIT: 0, ISC: 0, 'Apache-2.0': 0, 'CC0-1.0': 0, BSD: 0 }
    ICON_CATALOG.forEach((icon) => {
      if (counts[icon.license] !== undefined) {
        counts[icon.license]++
      }
    })
    return counts
  }, [])

  return {
    filters,
    filteredIcons,
    totalCount: filteredIcons.length,
    catalogCount: ICON_CATALOG.length,
    savedIconIds,
    collections,
    compareIconIds,
    detailIconId,
    sourceCounts,
    licenseCounts,
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
  }
}
