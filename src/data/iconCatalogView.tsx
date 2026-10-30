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

type CatalogMetadata = Omit<IconItem, 'component' | 'svg'> & { svgShard: string }
type CatalogManifest = {
  version: string
  count: number
  metadataFile: string
  shards: { file: string; source: string; count: number }[]
}

const EmptyCatalogIcon: React.ComponentType<SVGProps<SVGSVGElement>> = () => null

function catalogItemFor(metadata: CatalogMetadata): IconItem {
  // Use one placeholder component until the item's shard arrives. Creating a
  // closure for every catalog entry was expensive at startup (over 63k funcs).
  return { ...metadata, svg: '', component: EmptyCatalogIcon as IconItem['component'] }
}

export const ICON_CATALOG: IconItem[] = []

let loadPromise: Promise<void> | null = null
let catalogManifest: CatalogManifest | null = null
const iconsById = new Map<string, IconItem>()
const loadedSvgShards = new Set<string>()
const svgShardPromises = new Map<string, Promise<void>>()

export function getIconCatalogItems(ids: Iterable<string>) {
  const items: IconItem[] = []
  for (const id of ids) {
    const icon = iconsById.get(id)
    if (icon) items.push(icon)
  }
  return items
}

async function readCompressedJson<T>(file: string): Promise<T> {
  const response = await fetch(`/${file}`, { cache: 'force-cache' })
  if (!response.ok || !response.body) throw new Error(`Icon catalog asset failed (${response.status}): ${file}`)
  if (response.headers.get('content-encoding')?.includes('gzip')) return await response.json() as T
  if (!('DecompressionStream' in window)) throw new Error('This browser cannot open the compressed icon catalog')
  const decompressed = response.body.pipeThrough(new DecompressionStream('gzip'))
  return await new Response(decompressed).json() as T
}

export function loadIconCatalog() {
  if (loadPromise) return loadPromise
  const readCatalog = async () => {
    const manifestResponse = await fetch('/icon-catalog-manifest.json', { cache: 'no-cache' })
    if (!manifestResponse.ok) throw new Error(`Icon catalog manifest failed (${manifestResponse.status})`)
    catalogManifest = await manifestResponse.json() as CatalogManifest
    if (!catalogManifest.metadataFile || !Array.isArray(catalogManifest.shards)) {
      throw new Error('Icon catalog manifest is incomplete')
    }
    const metadata = await readCompressedJson<CatalogMetadata[]>(catalogManifest.metadataFile)
    if (metadata.length !== catalogManifest.count) {
      throw new Error(`Icon catalog metadata is incomplete (${metadata.length} of ${catalogManifest.count})`)
    }
    return metadata
  }

  loadPromise = readCatalog()
    .then((metadata) => {
      ICON_CATALOG.push(...metadata.map(catalogItemFor))
      ICON_CATALOG.forEach((icon) => iconsById.set(icon.id, icon))
      syncIconPacks(ICON_CATALOG)
    })
    .catch((error) => {
      loadPromise = null
      throw error
    })
  return loadPromise
}

/** Load only the compressed SVG shards required by the supplied icons. */
export async function loadIconSvgsFor(icons: readonly IconItem[]) {
  await loadIconCatalog()
  const needed = new Set<string>()
  for (const icon of icons) {
    const shard = icon.svgShard
    if (shard && !icon.svg && !loadedSvgShards.has(shard)) needed.add(shard)
  }

  await Promise.all([...needed].map((file) => {
    const pending = svgShardPromises.get(file)
    if (pending) return pending
    const request = readCompressedJson<Record<string, string>>(file)
      .then((svgById) => {
        for (const [id, svg] of Object.entries(svgById)) {
          const icon = iconsById.get(id)
          if (icon) {
            icon.svg = svg
            icon.component = componentFor(svg) as IconItem['component']
          }
        }
        loadedSvgShards.add(file)
      })
      .catch((error) => {
        svgShardPromises.delete(file)
        throw error
      })
    svgShardPromises.set(file, request)
    return request
  }))
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
