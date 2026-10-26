declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function enableGoogleAnalytics(measurementId: string) {
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args))

  if (!document.getElementById('google-tag-script')) {
    const script = document.createElement('script')
    script.id = 'google-tag-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
  window.gtag('event', 'page_view', {
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  })
}
