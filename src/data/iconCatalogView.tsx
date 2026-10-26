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

export const ICON_CATALOG: IconItem[] = []

let loadPromise: Promise<void> | null = null
export function loadIconCatalog() {
  if (loadPromise) return loadPromise
  loadPromise = fetch('/icon-catalog.json')
    .then((response) => {
      if (!response.ok) throw new Error(`Icon catalog load failed (${response.status})`)
      return response.json() as Promise<Omit<IconItem, 'component'>[]>
    })
    .then((icons) => {
      ICON_CATALOG.push(...icons.map((icon) => ({ ...icon, component: componentFor(icon.svg) })))
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
