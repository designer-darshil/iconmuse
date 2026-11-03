import { lazy, Suspense, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import './styles/main.scss'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import {
  ICON_CATALOG,
  loadIconCatalog,
  loadIconSvgsFor,
  loadInitialIconCatalog,
} from './data/iconCatalog'
import { applyHomeSeo } from './utils/seo'

const CatalogLoadError = lazy(() =>
  import('./components/common/AppLoader').then((m) => ({ default: m.CatalogLoadError })),
)
const NotFoundPage = lazy(() =>
  import('./components/common/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
const DesignSystemPage = lazy(() =>
  import('./components/design-system/DesignSystemPage').then((m) => ({
    default: m.DesignSystemPage,
  })),
)

function hasInitialUrlFilters(search: string) {
  if (!search) return false
  const params = new URLSearchParams(search)
  return Boolean(
    params.get('q')?.trim() ||
    params.get('sources') ||
    (params.get('category') && params.get('category') !== 'all') ||
    params.get('topic') ||
    (params.get('sort') && params.get('sort') !== 'all') ||
    params.get('pack') ||
    params.get('icon'),
  )
}

function ApplicationRoot() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isDesignSystem = pathname === '/design-system'
  const isNotFound =
    pathname !== '/' && pathname !== '/index.html' && !isDesignSystem
  const [catalogReady, setCatalogReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem('iconmuse-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#111318' : '#ffffff',
    )
    try { localStorage.setItem('iconmuse-theme', theme) } catch { /* storage may be disabled */ }
  }, [theme])

  useEffect(() => {
    if (!isNotFound && !isDesignSystem) applyHomeSeo()
  }, [isNotFound, isDesignSystem])

  useEffect(() => {
    if (isNotFound || isDesignSystem) return
    let isCurrent = true

    if (!hasInitialUrlFilters(window.location.search)) {
      let timerId: number | undefined
      loadInitialIconCatalog()
        .then(() => {
          if (!isCurrent) return
          setCatalogReady(true)
          timerId = window.setTimeout(() => {
            void loadIconCatalog().catch(() => undefined)
          }, 50)
        })
        .catch(() => {
          if (isCurrent) setLoadFailed(true)
        })

      return () => {
        isCurrent = false
        if (timerId !== undefined) window.clearTimeout(timerId)
      }
    }

    loadIconCatalog()
      .then(() => {
        const params = new URLSearchParams(window.location.search)
        const selectedSources = (params.get('sources') ?? '').split(',').filter(Boolean)
        const category = params.get('category')
        let initialIcons = ICON_CATALOG
        if (selectedSources.length) initialIcons = initialIcons.filter((icon) => selectedSources.includes(icon.source))
        else if (category === 'illustrations') initialIcons = initialIcons.filter((icon) => icon.category.toLowerCase() === 'illustrations')

        const searchQuery = params.get('q')?.trim()
        if (searchQuery) {
          const normalized = searchQuery.toLowerCase()
          initialIcons = initialIcons.filter((icon) => `${icon.name} ${icon.source} ${icon.tags.join(' ')}`.toLowerCase().includes(normalized))
        }
        const sort = params.get('sort')
        if (sort === 'name-asc') initialIcons = [...initialIcons].sort((a, b) => a.name.localeCompare(b.name))
        else if (sort === 'name-desc') initialIcons = [...initialIcons].sort((a, b) => b.name.localeCompare(a.name))

        const needed = initialIcons.slice(0, 72)
        const detailIconId = params.get('icon')
        const detailIcon = detailIconId ? ICON_CATALOG.find((icon) => icon.id === detailIconId) : undefined
        if (detailIcon) needed.push(detailIcon)
        return loadIconSvgsFor(needed)
      })
      .then(() => { if (isCurrent) setCatalogReady(true) })
      .catch(() => {
        if (isCurrent) setLoadFailed(true)
      })
    return () => { isCurrent = false }
  }, [attempt, isNotFound, isDesignSystem])

  if (isDesignSystem) {
    return (
      <Suspense fallback={null}>
        <DesignSystemPage theme={theme} onThemeChange={setTheme} />
      </Suspense>
    )
  }
  if (isNotFound) return <Suspense fallback={null}><NotFoundPage /></Suspense>
  if (loadFailed) {
    return (
      <Suspense fallback={null}>
        <CatalogLoadError onRetry={() => { setLoadFailed(false); setAttempt((value) => value + 1) }} />
      </Suspense>
    )
  }
  return <App theme={theme} onThemeChange={setTheme} catalogReady={catalogReady} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ApplicationRoot />
    </ErrorBoundary>
  </StrictMode>,
)
