import React from 'react'
import type { SVGProps } from 'react'
import type { IconItem } from '../types'
import { applyPrecomputedPackCounts } from './iconPacks'

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

const EmptyCatalogIcon: React.ComponentType<SVGProps<SVGSVGElement>> = () => null

function attachLazyComponent(item: IconItem) {
  let cachedSvg = ''
  let cachedComponent: IconItem['component'] = EmptyCatalogIcon as IconItem['component']
  Object.defineProperty(item, 'component', {
    configurable: true,
    enumerable: true,
    get() {
      if (!item.svg) return EmptyCatalogIcon as IconItem['component']
      if (cachedSvg !== item.svg) {
        cachedSvg = item.svg
        cachedComponent = componentFor(item.svg) as IconItem['component']
      }
      return cachedComponent
    },
    set(value: IconItem['component']) {
      cachedSvg = item.svg
      cachedComponent = value
    },
  })
}

type CatalogMetadata = Omit<IconItem, 'component' | 'svg'> & { svgShard: string; svg?: string }
type CatalogManifest = {
  version: string
  count: number
  metadataFile: string
  sourceCounts?: Record<string, number>
  licenseCounts?: Record<string, number>
  topicCounts?: Record<string, number>
  packCounts?: Record<string, number>
  shards?: { file: string; source: string; count: number }[]
}
type CatalogBootPayload = CatalogManifest & {
  initialIcons: (CatalogMetadata & { svg: string })[]
}

export interface CatalogSummary {
  totalCount: number
  sourceCounts: Record<string, number> | null
  licenseCounts: Record<string, number> | null
  topicCounts: Record<string, number> | null
  packCounts: Record<string, number> | null
  isFullCatalogLoaded: boolean
}

export const CATALOG_SUMMARY: CatalogSummary = {
  totalCount: 0,
  sourceCounts: null,
  licenseCounts: null,
  topicCounts: null,
  packCounts: null,
  isFullCatalogLoaded: false,
}

export const ICON_CATALOG: IconItem[] = []

let bootPromise: Promise<void> | null = null
let loadPromise: Promise<void> | null = null
let catalogManifest: CatalogManifest | null = null
const iconsById = new Map<string, IconItem>()
const loadedSvgShards = new Set<string>()
const svgShardPromises = new Map<string, Promise<void>>()
const catalogSubscribers = new Set<() => void>()

export function subscribeCatalogUpdates(listener: () => void) {
  catalogSubscribers.add(listener)
  return () => {
    catalogSubscribers.delete(listener)
  }
}

function notifyCatalogSubscribers() {
  for (const listener of catalogSubscribers) {
    listener()
  }
}

function applyManifestCounts(manifest: CatalogManifest) {
  CATALOG_SUMMARY.totalCount = manifest.count
  if (manifest.sourceCounts) CATALOG_SUMMARY.sourceCounts = manifest.sourceCounts
  if (manifest.licenseCounts) CATALOG_SUMMARY.licenseCounts = manifest.licenseCounts
  if (manifest.topicCounts) CATALOG_SUMMARY.topicCounts = manifest.topicCounts
  if (manifest.packCounts) {
    CATALOG_SUMMARY.packCounts = manifest.packCounts
    applyPrecomputedPackCounts(manifest.packCounts)
  }
}

export function hasIconCatalogItem(id: string): boolean {
  return iconsById.has(id)
}

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

/**
 * Fast-path initial boot loader: fetches the lightweight pre-rendered initial 72
 * icons + precomputed counts (~5 KB gzipped) so the initial viewport renders
 * immediately without waiting for the full metadata catalog.
 */
export function loadInitialIconCatalog() {
  if (CATALOG_SUMMARY.isFullCatalogLoaded) return Promise.resolve()
  if (bootPromise) return bootPromise

  bootPromise = fetch('/icon-catalog-boot.json')
    .then(async (response) => {
      if (!response.ok) throw new Error(`Boot catalog failed (${response.status})`)
      const boot = await response.json() as CatalogBootPayload
      if (!boot.metadataFile || !Array.isArray(boot.initialIcons)) {
        throw new Error('Boot catalog payload is incomplete')
      }
      catalogManifest = boot
      applyManifestCounts(boot)
      if (!CATALOG_SUMMARY.isFullCatalogLoaded && ICON_CATALOG.length === 0) {
        for (let i = 0; i < boot.initialIcons.length; i++) {
          const item = boot.initialIcons[i] as unknown as IconItem
          attachLazyComponent(item)
          ICON_CATALOG.push(item)
          iconsById.set(item.id, item)
        }
      }
    })
    .catch(() => {
      bootPromise = null
      return loadIconCatalog()
    })

  return bootPromise
}

export function loadIconCatalog() {
  if (loadPromise) return loadPromise
  const readCatalog = async () => {
    if (!catalogManifest) {
      const manifestResponse = await fetch('/icon-catalog-manifest.json', { cache: 'no-cache' })
      if (!manifestResponse.ok) throw new Error(`Icon catalog manifest failed (${manifestResponse.status})`)
      catalogManifest = await manifestResponse.json() as CatalogManifest
    }
    if (!catalogManifest.metadataFile) {
      throw new Error('Icon catalog manifest is incomplete')
    }
    applyManifestCounts(catalogManifest)
    const metadata = await readCompressedJson<CatalogMetadata[]>(catalogManifest.metadataFile)
    if (metadata.length !== catalogManifest.count) {
      throw new Error(`Icon catalog metadata is incomplete (${metadata.length} of ${catalogManifest.count})`)
    }
    return metadata
  }

  loadPromise = readCatalog()
    .then((metadata) => {
      // Mutate parsed metadata records in-place and preserve any SVGs already
      // hydrated during initial boot so we avoid 63k object spreads & GC pauses.
      const fullItems = metadata as unknown as IconItem[]
      for (let i = 0; i < fullItems.length; i++) {
        const record = fullItems[i]
        const existing = iconsById.get(record.id)
        if (existing && existing.svg) {
          fullItems[i] = existing
        } else {
          record.svg = ''
          attachLazyComponent(record)
          iconsById.set(record.id, record)
        }
      }
      ICON_CATALOG.length = 0
      for (let i = 0; i < fullItems.length; i += 8192) {
        ICON_CATALOG.push(...fullItems.slice(i, i + 8192))
      }
      CATALOG_SUMMARY.isFullCatalogLoaded = true
      notifyCatalogSubscribers()
    })
    .catch((error) => {
      loadPromise = null
      throw error
    })
  return loadPromise
}

/** Load only the compressed SVG shards required by the supplied icons. */
export async function loadIconSvgsFor(icons: readonly IconItem[], onShardLoaded?: () => void) {
  const needed = new Set<string>()
  for (const icon of icons) {
    const shard = icon.svgShard
    if (shard && !icon.svg && !loadedSvgShards.has(shard)) needed.add(shard)
  }
  if (needed.size === 0) return

  await Promise.all([...needed].map((file) => {
    const pending = svgShardPromises.get(file)
    if (pending) {
      return onShardLoaded ? pending.then(onShardLoaded) : pending
    }
    const request = readCompressedJson<Record<string, string>>(file)
      .then((svgById) => {
        for (const [id, svg] of Object.entries(svgById)) {
          const icon = iconsById.get(id)
          if (icon && !icon.svg) {
            icon.svg = svg
          }
        }
        loadedSvgShards.add(file)
      })
      .catch((error) => {
        svgShardPromises.delete(file)
        throw error
      })
    svgShardPromises.set(file, request)
    return onShardLoaded ? request.then(onShardLoaded) : request
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
