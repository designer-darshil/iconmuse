import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import './styles/main.scss'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import { loadIconCatalog } from './data/iconCatalog'
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
        if (isCurrent) setCatalogReady(true)
      })
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
