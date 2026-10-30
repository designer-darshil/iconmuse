import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import './styles/main.scss'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import { ICON_CATALOG, loadIconCatalog, loadIconSvgsFor } from './data/iconCatalog'
import { CatalogLoadError } from './components/common/AppLoader'
import { NotFoundPage } from './components/common/NotFoundPage'
import { applyHomeSeo } from './utils/seo'

function ApplicationRoot() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isNotFound = pathname !== '/' && pathname !== '/index.html'
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
    if (!isNotFound) applyHomeSeo()
  }, [isNotFound])

  useEffect(() => {
    if (isNotFound) return
    let isCurrent = true
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
  }, [attempt, isNotFound])

  if (isNotFound) return <NotFoundPage />
  if (loadFailed) {
    return <CatalogLoadError onRetry={() => { setLoadFailed(false); setAttempt((value) => value + 1) }} />
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
