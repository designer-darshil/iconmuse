const SITE_TITLE = 'IconMuse — Search Free SVG Icons & Illustrations'
const SITE_DESCRIPTION =
  'Search, compare, customize, and download open-source SVG icons and illustrations from leading libraries.'

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  const meta = document.head.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta')
  meta.setAttribute(attribute, key)
  meta.content = content
  if (!meta.parentNode) document.head.append(meta)
}

/**
 * Keeps the canonical and share URL correct across preview, staging, and production.
 * Set VITE_SITE_URL in production when the public domain differs from the current origin.
 */
export function applyHomeSeo() {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim()
  const siteUrl = new URL(configuredSiteUrl || window.location.origin)
  const canonicalUrl = new URL('/', siteUrl).toString()

  document.title = SITE_TITLE
  upsertMeta('name', 'description', SITE_DESCRIPTION)
  upsertMeta('property', 'og:url', canonicalUrl)
  upsertMeta('property', 'og:title', SITE_TITLE)
  upsertMeta('property', 'og:description', SITE_DESCRIPTION)
  upsertMeta('name', 'twitter:title', SITE_TITLE)
  upsertMeta('name', 'twitter:description', SITE_DESCRIPTION)

  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link')
  canonical.rel = 'canonical'
  canonical.href = canonicalUrl
  if (!canonical.parentNode) document.head.append(canonical)
}
