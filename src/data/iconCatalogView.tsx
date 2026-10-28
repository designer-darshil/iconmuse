import React from 'react'
import type { SVGProps } from 'react'
import type { IconItem } from '../types'
import { syncIconPacks } from './iconPacks'

function componentFor(svg: string): React.ComponentType<SVGProps<SVGSVGElement>> {
  const attr = (name: string) => svg.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]
  const viewBox = attr('viewBox') ?? '0 0 24 24'
  const fill = attr('fill') ?? (svg.includes('stroke="currentColor"') ? 'none' : 'currentColor')
  const stroke = attr('stroke')
  const strokeWidth = attr('stroke-width')
  const strokeLinecap = attr('stroke-linecap')
  const strokeLinejoin = attr('stroke-linejoin')
  const body = svg.replace(/^.*?<svg\b[^>]*>/s, '').replace(/<\/svg>\s*$/s, '')
  const Icon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap as SVGProps<SVGSVGElement>['strokeLinecap']} strokeLinejoin={strokeLinejoin as SVGProps<SVGSVGElement>['strokeLinejoin']} {...props} dangerouslySetInnerHTML={{ __html: body }} />
  )
  Icon.displayName = 'CatalogSvgIcon'
  return Icon
}

function catalogItemFor(icon: Omit<IconItem, 'component'>): IconItem {
  const item = icon as IconItem

  // The catalog contains tens of thousands of SVGs. Creating a React component
  // for every one during startup blocks the main thread for a noticeable time.
  // Define it lazily instead, and cache it after the first screen that needs it.
  Object.defineProperty(item, 'component', {
    configurable: true,
    enumerable: true,
    get() {
      const component = componentFor(item.svg)
      Object.defineProperty(item, 'component', {
        configurable: true,
        enumerable: true,
        value: component,
      })
      return component
    },
  })

  return item
}

export const ICON_CATALOG: IconItem[] = []

let loadPromise: Promise<void> | null = null
export function loadIconCatalog() {
  if (loadPromise) return loadPromise
  const readCatalog = async () => {
    // Catalog SVG markup compresses very well (213 MB is about 31 MB gzipped).
    // Fetch the pre-compressed asset to avoid making every visit transfer the
    // full source JSON. Keep a plain JSON fallback for older browsers/hosts.
    if ('DecompressionStream' in window) {
      try {
        const response = await fetch('/icon-catalog.json.gz')
        if (response.ok && response.body) {
          const decompressed = response.body.pipeThrough(new DecompressionStream('gzip'))
          return await new Response(decompressed).json() as Omit<IconItem, 'component'>[]
        }
      } catch {
        // Fall through to the uncompressed asset if pre-compression is absent.
      }
    }
    const response = await fetch('/icon-catalog.json')
    if (!response.ok) throw new Error(`Icon catalog load failed (${response.status})`)
    return await response.json() as Omit<IconItem, 'component'>[]
  }

  loadPromise = readCatalog()
    .then((icons) => {
      ICON_CATALOG.push(...icons.map(catalogItemFor))
      syncIconPacks(ICON_CATALOG)
    })
    .catch((error) => {
      loadPromise = null
      throw error
    })
  return loadPromise
}

export function getIconSvg(icon: IconItem, color = 'currentColor', size = 24) {
  let svg = icon.svg
  if (!/\bxmlns=/.test(svg)) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  svg = svg.replace(/\s(width|height)="[^"]*"/g, '')
    .replace('<svg', `<svg width="${size}" height="${size}"`)
    .replace(/currentColor/g, color)
  const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!)
  const author = icon.author ? `; Author: ${escapeXml(icon.author)}` : ''
  const attribution = `Icon: ${escapeXml(icon.name)}; Source: ${escapeXml(icon.source)}${author}; License: ${escapeXml(icon.license)}.`
  svg = svg.replace('</svg>', `<metadata>${attribution}</metadata></svg>`)
  return svg
}
