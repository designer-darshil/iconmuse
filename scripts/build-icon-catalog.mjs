import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { gzipSync } from 'node:zlib'
import * as lucide from 'lucide-react'
import * as heroOutline from '@heroicons/react/24/outline'
import * as heroSolid from '@heroicons/react/24/solid'
import * as simpleIcons from 'simple-icons'
import { createAvatar } from '@dicebear/core'
import * as openPeeps from '@dicebear/open-peeps'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const records = []
const slugify = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-')

function add(source, name, style, svg, license, preserveColors = false, author, categoryOverride) {
  if (!svg || !svg.includes('<svg')) return
  // Normalize only the root SVG dimensions. Nested SVG content can rely on
  // width/height attributes, such as DiceBear's viewBox clipping mask.
  svg = svg.replace(/<svg\b([^>]*)>/i, (_openingTag, attributes) => {
    const rootAttributes = attributes.replace(/\s(?:width|height)="[^"]*"/gi, '')
    return `<svg${rootAttributes}>`
  })
  if (!preserveColors) {
    svg = svg.replace(/currentColor/gi, 'currentColor')
      .replace(/fill="#[0-9a-f]{3,8}"/gi, 'fill="currentColor"')
      .replace(/stroke="#[0-9a-f]{3,8}"/gi, 'stroke="currentColor"')
  }
  const id = `${source.toLowerCase().replace(/[^a-z]+/g, '-')}-${slugify(name)}-${style}${author ? `-${slugify(author)}` : ''}`
  const svgIds = new Map()
  svg = svg.replace(/\bid="([^"]+)"/g, (_match, localId) => {
    const uniqueId = `${id}-${localId}`
    svgIds.set(localId, uniqueId)
    return `id="${uniqueId}"`
  })
  if (svgIds.size) {
    svg = svg.replace(/url\(#([^)]+)\)|((?:xlink:)?href="#([^"]+)")|(aria-labelledby|aria-describedby)="([^"]+)"/g, (match, urlId, hrefAttribute, hrefId, ariaAttribute, ariaIds) => {
      if (urlId) return `url(#${svgIds.get(urlId) ?? urlId})`
      if (hrefAttribute) return hrefAttribute.replace(`#${hrefId}`, `#${svgIds.get(hrefId) ?? hrefId}`)
      return `${ariaAttribute}="${ariaIds.split(/\s+/).map((localId) => svgIds.get(localId) ?? localId).join(' ')}"`
    })
  }
  const readableName = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/Icon$/, '').replace(/[-_]+/g, ' ').trim()
  const category = categoryOverride ?? (['Open Doodles', 'Open Peeps', 'Fluent Emoji', 'Flowbite Illustrations', 'Bioicons'].includes(source) ? 'Illustrations' : 'Icons')
  const tags = slugify(name).split('-')
  if (style === '3d') tags.push('3d')
  if (style === 'gradient' || /<(?:linear|radial)Gradient\b/i.test(svg)) tags.push('gradient')
  records.push({ id, name: readableName.replace(/\b\w/g, (letter) => letter.toUpperCase()), category, source, style, license, ...(author ? { author } : {}), tags: [...new Set(tags)], svg })
}

function canonicalSvg(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

// Lucide's own component render output contains the complete, original path data.
for (const [name, component] of Object.entries(lucide)) {
  // lucide-react exports `Name` and `NameIcon` for the same glyph. Keep the
  // canonical export so users don't see an identical tile twice.
  if (name.endsWith('Icon') || name.startsWith('Lucide')) continue
  if (!/^[A-Z]/.test(name) || typeof component !== 'object' || !component.render) continue
  try { add('Lucide', name, 'stroke', renderToStaticMarkup(React.createElement(component)), 'ISC') } catch {}
}

const phosphorRoot = path.join(root, 'node_modules/@phosphor-icons/core/assets')
for (const style of fs.readdirSync(phosphorRoot)) {
  const folder = path.join(phosphorRoot, style)
  if (!fs.statSync(folder).isDirectory()) continue
  for (const file of fs.readdirSync(folder).filter((entry) => entry.endsWith('.svg'))) {
    add('Phosphor', path.basename(file, '.svg'), style, fs.readFileSync(path.join(folder, file), 'utf8'), 'MIT')
  }
}

const tablerRoot = path.join(root, 'node_modules/@tabler/icons/icons')
for (const style of ['outline', 'filled']) {
  const folder = path.join(tablerRoot, style)
  for (const file of fs.readdirSync(folder).filter((entry) => entry.endsWith('.svg'))) {
    add('Tabler', path.basename(file, '.svg'), style, fs.readFileSync(path.join(folder, file), 'utf8'), 'MIT')
  }
}

for (const [variant, icons] of [['outline', heroOutline], ['solid', heroSolid]]) {
  for (const [name, component] of Object.entries(icons)) {
    try { add('Heroicons', name, variant, renderToStaticMarkup(React.createElement(component)), 'MIT') } catch {}
  }
}

const featherIcons = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/feather-icons/dist/icons.json'), 'utf8'))
for (const [name, body] of Object.entries(featherIcons)) {
  add('Feather Icons', name, 'stroke', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`, 'MIT')
}

const remixSymbols = fs.readFileSync(path.join(root, 'node_modules/remixicon/fonts/remixicon.symbol.svg'), 'utf8')
for (const [, attrs, body] of remixSymbols.matchAll(/<symbol\b([^>]*)>([\s\S]*?)<\/symbol>/g)) {
  const id = attrs.match(/\bid="([^"]+)"/)?.[1]
  if (!id?.startsWith('ri-')) continue
  const variant = id.endsWith('-line') ? 'line' : 'fill'
  const name = id.slice(3).replace(/-(line|fill)$/, '')
  add('Remix Icon', name, variant, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${body}</svg>`, 'Apache-2.0')
}

const lineiconsSource = fs.readFileSync(path.join(root, 'node_modules/lineicons/src/svg-map.js'), 'utf8')
const lineiconsModule = await import(`data:text/javascript;base64,${Buffer.from(lineiconsSource).toString('base64')}`)
for (const [style, icons] of Object.entries(lineiconsModule.svgMap)) {
  for (const [name, svg] of Object.entries(icons)) add('Lineicons', name, style, svg, 'MIT')
}

for (const value of Object.values(simpleIcons)) {
  if (!value || typeof value !== 'object' || !('slug' in value) || !('path' in value)) continue
  const icon = value
  add('Simple Icons', icon.slug, 'solid', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}" fill="currentColor"/></svg>`, 'CC0-1.0')
}

function addIconifyCollection(packageName, source, license, getStyle = () => 'outline', filter = () => true) {
  const collection = JSON.parse(fs.readFileSync(path.join(root, 'node_modules', packageName, 'icons.json'), 'utf8'))
  const defaultWidth = collection.width ?? 24
  const defaultHeight = collection.height ?? defaultWidth
  for (const [name, icon] of Object.entries(collection.icons)) {
    if (!filter(name, icon)) continue
    const width = icon.width ?? defaultWidth
    const height = icon.height ?? defaultHeight
    const left = icon.left ?? 0
    const top = icon.top ?? 0
    add(source, name, getStyle(name), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${width} ${height}">${icon.body}</svg>`, license)
  }
}

// Each Iconify package is an official, normalized SVG distribution. Keep every
// library as its own catalog source, with its original license and styles.
addIconifyCollection('@iconify-json/material-symbols', 'Material Symbols', 'Apache-2.0', (name) => {
  if (name.endsWith('-rounded')) return 'rounded'
  if (name.endsWith('-sharp')) return 'sharp'
  if (name.endsWith('-filled')) return 'filled'
  return 'outline'
})
addIconifyCollection('@iconify-json/fluent', 'Fluent System Icons', 'MIT', (name) => {
  if (name.endsWith('-filled')) return 'filled'
  if (name.endsWith('-color')) return 'color'
  return 'regular'
}, (name) => /-24-(regular|filled|color)$/.test(name))
addIconifyCollection('@iconify-json/carbon', 'Carbon Icons', 'Apache-2.0', (name) => name.endsWith('-filled') ? 'filled' : 'outline')
addIconifyCollection('@iconify-json/bi', 'Bootstrap Icons', 'MIT', (name) => name.endsWith('-fill') ? 'filled' : 'outline')
addIconifyCollection('@iconify-json/mingcute', 'MingCute Icons', 'Apache-2.0', (name) => name.endsWith('-fill') ? 'filled' : 'line')

const openDoodlesRoot = path.join(root, 'public/illustrations/open-doodles')
for (const file of fs.readdirSync(openDoodlesRoot).filter((entry) => entry.endsWith('.svg'))) {
  const name = path.basename(file, '.svg').replace(/-([a-z0-9])/g, (_, letter) => ` ${letter.toUpperCase()}`).replace(/^\w/, (letter) => letter.toUpperCase())
  add('Open Doodles', name, 'illustration', fs.readFileSync(path.join(openDoodlesRoot, file), 'utf8'), 'CC0-1.0', true)
}

// Open Peeps by Pablo Stanley (CC0), generated as a curated set of distinct,
// reproducible character illustrations using DiceBear's Open Peeps remix.
const openPeepsSeeds = [
  ['Joyful Afro', 'joyful-afro', 'afro', 'smileBig', 'f2c9a5'],
  ['Curious Beanie', 'curious-beanie', 'hatBeanie', 'awe', 'c68642'],
  ['Calm Hijab', 'calm-hijab', 'hijab', 'calm', 'e0ac69'],
  ['Confident Mohawk', 'confident-mohawk', 'mohawk', 'smile', '8d5524'],
  ['Thoughtful Long Hair', 'thoughtful-long-hair', 'long', 'serious', 'f1c27d'],
  ['Happy Bantu Knots', 'happy-bantu-knots', 'bantuKnots', 'smileTeethGap', 'c68642'],
  ['Focused Flat Top', 'focused-flat-top', 'flatTop', 'driven', 'e0ac69'],
  ['Friendly Short Hair', 'friendly-short-hair', 'short2', 'cheeky', '8d5524'],
  ['Surprised Bun', 'surprised-bun', 'bun', 'awe', 'f2c9a5'],
  ['Thoughtful Glasses', 'thoughtful-glasses', 'medium2', 'explaining', 'c68642'],
  ['Relaxed Twists', 'relaxed-twists', 'twists', 'eyesClosed', 'e0ac69'],
  ['Bright Long Afro', 'bright-long-afro', 'longAfro', 'smileLOL', '8d5524'],
  ['Serious Turban', 'serious-turban', 'turban', 'serious', 'f1c27d'],
  ['Playful Curly Hair', 'playful-curly-hair', 'longCurly', 'cute', 'c68642'],
  ['Confident Cornrows', 'confident-cornrows', 'cornrows', 'smile', 'e0ac69'],
  ['Kind Gray Bun', 'kind-gray-bun', 'grayBun', 'smileTeethGap', '8d5524'],
  ['Cool Sunglasses', 'cool-sunglasses', 'short4', 'cheeky', 'f2c9a5'],
  ['Warm Medium Hair', 'warm-medium-hair', 'medium3', 'lovingGrin1', 'c68642'],
  ['Curious Dreads', 'curious-dreads', 'dreads1', 'suspicious', 'e0ac69'],
  ['Gentle Short Hair', 'gentle-short-hair', 'short1', 'solemn', '8d5524'],
  ['Bold Cornrows', 'bold-cornrows', 'cornrows2', 'veryAngry', 'f1c27d'],
  ['Sunny Buns', 'sunny-buns', 'buns', 'smileBig', 'c68642'],
  ['Thoughtful Shaved Head', 'thoughtful-shaved-head', 'shaved2', 'concerned', 'e0ac69'],
  ['Cheerful Beanie', 'cheerful-beanie', 'hatHip', 'smileLOL', '8d5524'],
]
const openPeepsClothing = ['7141E8', '2563EB', '059669', 'E11D48', 'D97706', '475569']
for (const [name, seed, head, face, skinColor] of openPeepsSeeds) {
  const index = openPeepsSeeds.findIndex((entry) => entry[1] === seed)
  const svg = createAvatar(openPeeps, {
    seed,
    head: [head],
    face: [face],
    skinColor: [skinColor],
    clothingColor: [openPeepsClothing[index % openPeepsClothing.length]],
    accessories: index % 4 === 1 ? ['glasses', 'glasses2', 'glasses3', 'glasses4', 'glasses5'] : [],
    accessoriesProbability: index % 4 === 1 ? 100 : 0,
    facialHair: index % 5 === 2 ? ['full', 'full2', 'goatee1', 'moustache1'] : [],
    facialHairProbability: index % 5 === 2 ? 100 : 0,
  }).toString()
  add('Open Peeps', name, 'illustration', svg, 'CC0-1.0', true)
}

// Microsoft Fluent Emoji's flat and modern variants are editable SVGs. The
// modern set uses dimensional shading/gradients and is catalogued as 3D.
const fluentRoot = path.join(root, 'node_modules/@fluentui-emoji/svg')
const fluentMetadata = JSON.parse(fs.readFileSync(path.join(fluentRoot, 'metadata.json'), 'utf8'))
for (const emoji of fluentMetadata.emojis) {
  for (const [emojiStyle, catalogStyle] of [['flat', 'flat'], ['modern', '3d']]) {
    if (!emoji.styles.includes(emojiStyle)) continue
    const svgPath = path.join(fluentRoot, 'icons', emojiStyle, `${emoji.slug}.svg`)
    if (!fs.existsSync(svgPath)) continue
    add('Fluent Emoji', emoji.name, catalogStyle, fs.readFileSync(svgPath, 'utf8'), 'MIT', true, undefined, catalogStyle === '3d' ? 'Icons' : undefined)
  }
}

// Glass Icons restyles Font Awesome Free glyphs with editable SVG gradients,
// highlights and filters. Keep only regular/solid glyphs, not brand marks.
const glassRoot = path.join(root, 'src/data/icon-sources/glass-icons')
for (const variant of ['solid', 'regular']) {
  const folder = path.join(glassRoot, variant)
  for (const file of fs.readdirSync(folder).filter((entry) => entry.endsWith('.svg'))) {
    const name = path.basename(file, '.svg').replace(`gi-${variant}-`, '')
    add('Glass Icons', name, 'gradient', fs.readFileSync(path.join(folder, file), 'utf8'), 'CC-BY-4.0', true, 'Font Awesome Free (adapted by Tien Chu)')
  }
}

// Flowbite's Svelte package contains the official editable SVG assets. Keep
// the light variants; dark variants are alternate colorways of the same art.
const flowbiteRoot = path.join(root, 'node_modules/flowbite-svelte-illustrations/dist')
function flowbiteSvgFromSvelte(source) {
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? ''
  const colors = Object.fromEntries([...script.matchAll(/(color\d+)\s*=\s*'([^']+)'/g)].map((match) => [match[1], match[2]]))
  let svg = source.match(/<svg\b[\s\S]*?<\/svg>/i)?.[0]
  if (!svg) return null
  svg = svg
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<desc\b[^>]*>[\s\S]*?<\/desc>/gi, '')
    .replace(/\{#if[^}]*\}[\s\S]*?\{\/if\}/g, '')
    .replace(/\sstyle=\{`[^`]*`\}/g, '')
    .replace(/\s(?:class|aria-[\w-]+)=\{[^}]*\}/g, '')
    .replace(/\s\{\.\.\.restProps\}/g, '')
    .replace(/\{(color\d+)\}/g, (_match, color) => JSON.stringify(colors[color] ?? '#7141e8'))
    .replace(/<\/?script[^>]*>/gi, '')
  return svg.includes('{') ? null : svg
}
for (const file of fs.readdirSync(flowbiteRoot).filter((entry) => entry.endsWith('.svelte') && !entry.endsWith('Dark.svelte'))) {
  const source = fs.readFileSync(path.join(flowbiteRoot, file), 'utf8')
  const svg = flowbiteSvgFromSvelte(source)
  if (!svg) continue
  const name = path.basename(file, '.svelte').replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  add('Flowbite Illustrations', name, 'illustration', svg, 'MIT', true)
}

const bioiconsRoot = path.join(root, 'public/illustrations/bioicons')
const bioiconsLicense = {
  'cc-0': 'CC0-1.0',
  bsd: 'BSD',
}
for (const icon of JSON.parse(fs.readFileSync(path.join(bioiconsRoot, 'index.json'), 'utf8'))) {
  const svg = fs.readFileSync(path.join(bioiconsRoot, icon.file), 'utf8')
  const name = icon.name.replace(/[_-]+/g, ' ')
  const category = icon.category.replace(/[_-]+/g, ' ')
  add('Bioicons', name, 'illustration', svg, bioiconsLicense[icon.license] ?? icon.license, true, icon.author)
  const record = records.at(-1)
  if (record) record.tags.push(...category.toLowerCase().split(/\s+/))
}

const seenIds = new Set()
const positionsBySvg = new Map()
const unique = []
for (const record of records) {
  // A few libraries expose aliases with different names but identical SVGs.
  // Collapse exact duplicates only within that library; matching icons from
  // separate libraries and distinct style variants remain available.
  const key = `${record.source}|${canonicalSvg(record.svg)}`
  if (seenIds.has(record.id)) continue
  seenIds.add(record.id)
  const existingIndex = positionsBySvg.get(key)
  if (existingIndex !== undefined) {
    // Prefer the shorter public name when a library offers an alias.
    if (record.name.length < unique[existingIndex].name.length) unique[existingIndex] = record
    continue
  }
  positionsBySvg.set(key, unique.length)
  unique.push(record)
}
const catalogJson = JSON.stringify(unique)
const catalogVersion = createHash('sha256').update('metadata-svg-shards-v3\0').update(catalogJson).digest('hex').slice(0, 12)
const catalogDir = path.join(root, 'public')
// Smaller source-local shards keep a filtered view from downloading a whole
// icon family when it only needs the first visible batch.
const maxShardBytes = 512 * 1024
const shards = []
const shardById = new Map()
const recordsBySource = new Map()
for (const record of unique) {
  const records = recordsBySource.get(record.source) ?? []
  records.push(record)
  recordsBySource.set(record.source, records)
}
for (const [source, sourceRecords] of recordsBySource) {
  let shard = []
  let shardBytes = 2 // JSON object braces
  const flushShard = () => {
    if (shard.length === 0) return
    const file = `icon-catalog-${catalogVersion}-${String(shards.length).padStart(3, '0')}.json.gz`
    const svgData = Object.fromEntries(shard.map(({ id, svg }) => [id, svg]))
    fs.writeFileSync(path.join(catalogDir, file), gzipSync(JSON.stringify(svgData), { level: 9 }))
    shards.push({ file, source, count: shard.length })
    for (const { id } of shard) shardById.set(id, file)
    shard = []
    shardBytes = 2
  }
  for (const record of sourceRecords) {
    const bytes = Buffer.byteLength(JSON.stringify([record.id, record.svg])) + (shard.length ? 1 : 0)
    if (shardBytes + bytes > maxShardBytes && shard.length) flushShard()
    shard.push(record)
    shardBytes += bytes
  }
  flushShard()
}
const metadata = unique.map(({ svg: _svg, ...record }) => ({ ...record, svgShard: shardById.get(record.id) }))
const metadataFile = `icon-catalog-${catalogVersion}-metadata.json.gz`
fs.writeFileSync(path.join(catalogDir, metadataFile), gzipSync(JSON.stringify(metadata), { level: 9 }))

// Pre-compute source, license, topic, and pack counts at build time so the
// client renders counts in O(1) without scanning 63k records on the main thread.
const sourceCounts = {
  Lucide: 0,
  Phosphor: 0,
  Tabler: 0,
  Heroicons: 0,
  'Simple Icons': 0,
  'Feather Icons': 0,
  'Remix Icon': 0,
  Lineicons: 0,
  'Material Symbols': 0,
  'Fluent System Icons': 0,
  'Carbon Icons': 0,
  'Bootstrap Icons': 0,
  'MingCute Icons': 0,
  'Open Doodles': 0,
  'Open Peeps': 0,
  'Fluent Emoji': 0,
  'Glass Icons': 0,
  'Flowbite Illustrations': 0,
  Bioicons: 0,
}
const licenseCounts = { MIT: 0, ISC: 0, 'Apache-2.0': 0, 'CC0-1.0': 0, BSD: 0 }
const topicDefinitions = [
  ['arrows', ['arrow', 'chevron', 'caret', 'direction', 'turn', 'move']],
  ['transport', ['car', 'bus', 'truck', 'taxi', 'bike', 'bicycle', 'plane', 'train', 'tram', 'ship', 'boat', 'scooter', 'road', 'traffic', 'transport']],
  ['albums', ['album', 'albums', 'disc', 'music', 'playlist', 'audio', 'headphone', 'speaker', 'microphone', 'record', 'volume']],
  ['brands', null],
  ['development', ['code', 'terminal', 'database', 'server', 'git', 'branch', 'bug', 'api', 'command', 'programming', 'bracket', 'dev']],
  ['education', ['book', 'education', 'school', 'graduation', 'student', 'pencil', 'library', 'chalkboard', 'classroom', 'teacher']],
  ['communication', ['message', 'chat', 'mail', 'email', 'phone', 'call', 'comment', 'send', 'share', 'conversation']],
  ['media', ['camera', 'image', 'video', 'film', 'photo', 'play', 'youtube', 'media', 'screen', 'broadcast']],
  ['navigation', ['map', 'pin', 'location', 'compass', 'navigation', 'globe', 'route', 'marker']],
  ['commerce', ['cart', 'shop', 'store', 'bag', 'wallet', 'payment', 'credit', 'receipt', 'checkout', 'money', 'cash', 'coin']],
  ['nature', ['leaf', 'tree', 'flower', 'plant', 'earth', 'nature', 'animal', 'bird', 'fish', 'bug', 'paw']],
  ['security', ['lock', 'key', 'shield', 'security', 'password', 'fingerprint', 'privacy', 'verified', 'safe']],
  ['devices', ['computer', 'laptop', 'desktop', 'tablet', 'mobile', 'device', 'keyboard', 'mouse', 'monitor', 'printer']],
  ['files', ['file', 'folder', 'document', 'archive', 'attachment', 'paperclip', 'download', 'upload']],
]
const packDefinitions = [
  ['pack-essential-ui', ['arrow', 'menu', 'search', 'settings', 'home', 'user', 'check', 'close', 'filter', 'grid', 'layout', 'bell', 'calendar', 'clock', 'plus', 'minus']],
  ['pack-ecommerce', ['cart', 'shopping', 'store', 'wallet', 'credit', 'payment', 'dollar', 'banknote', 'truck', 'package', 'tag', 'receipt', 'gift', 'bag']],
  ['pack-dev-cloud', ['code', 'git', 'terminal', 'database', 'server', 'cloud', 'api', 'workflow', 'branch', 'commit', 'pull request', 'cpu', 'command', 'bug', 'braces']],
  ['pack-creative-media', ['camera', 'video', 'film', 'image', 'palette', 'pen', 'brush', 'crop', 'aperture', 'music', 'headphones', 'mic', 'play', 'sparkles']],
  ['pack-security-auth', ['shield', 'lock', 'key', 'fingerprint', 'security', 'password', 'scan', 'user check', 'eye', 'badge', 'verified', 'safe']],
  ['pack-nature-climate', ['sun', 'moon', 'cloud', 'wind', 'tree', 'leaf', 'snowflake', 'flame', 'rain', 'nature', 'flower', 'water', 'earth', 'temperature']],
]
const topicCounts = {
  all: 0,
  illustrations: 0,
  ...Object.fromEntries(topicDefinitions.map(([id]) => [id, 0])),
}
const packCounts = Object.fromEntries(packDefinitions.map(([id]) => [id, 0]))

for (const icon of unique) {
  sourceCounts[icon.source] = (sourceCounts[icon.source] ?? 0) + 1
  if (licenseCounts[icon.license] !== undefined) licenseCounts[icon.license]++
  const lowerName = icon.name.toLowerCase()
  const words = ` ${lowerName} ${icon.tags.join(' ').toLowerCase()} `.replace(/[^a-z0-9]+/g, ' ')
  if (icon.category === 'Icons') {
    topicCounts.all++
    for (const [topicId, terms] of topicDefinitions) {
      if (terms === null) {
        if (icon.source === 'Simple Icons') topicCounts[topicId]++
      } else if (terms.some((term) => words.includes(` ${term} `))) {
        topicCounts[topicId]++
      }
    }
  } else if (icon.category === 'Illustrations') {
    topicCounts.illustrations++
  }
  for (const [packId, terms] of packDefinitions) {
    if (terms.some((term) => lowerName.includes(term) || icon.tags.some((tag) => tag.includes(term)))) {
      packCounts[packId]++
    }
  }
}

const initialIcons = unique.slice(0, 72).map((record) => ({
  ...record,
  svgShard: shardById.get(record.id),
}))
const bootPayload = {
  version: catalogVersion,
  count: unique.length,
  metadataFile,
  sourceCounts,
  licenseCounts,
  topicCounts,
  packCounts,
  initialIcons,
}
fs.writeFileSync(path.join(catalogDir, 'icon-catalog-boot.json'), JSON.stringify(bootPayload))

const manifest = {
  version: catalogVersion,
  count: unique.length,
  metadataFile,
  sourceCounts,
  licenseCounts,
  topicCounts,
  packCounts,
  shards,
}
fs.writeFileSync(path.join(catalogDir, 'icon-catalog-manifest.json'), JSON.stringify(manifest))

// Remove the previous single-file catalog and obsolete shards so production
// deployments don't ship duplicate 60+ MB catalog files.
for (const file of fs.readdirSync(catalogDir)) {
  if (file === 'icon-catalog.json' || file === 'icon-catalog.json.gz') {
    fs.rmSync(path.join(catalogDir, file), { force: true })
  } else if (/^icon-catalog-[a-f0-9]{12}-(?:\d{3}|metadata)\.json\.gz$/.test(file) && file !== metadataFile && !shards.some((entry) => entry.file === file)) {
    fs.rmSync(path.join(catalogDir, file), { force: true })
  }
}
const licenseDir = path.join(root, 'public/icon-licenses')
fs.mkdirSync(licenseDir, { recursive: true })
for (const [packageName, fileName] of [
  ['lucide-react', 'LICENSE'],
  ['@phosphor-icons/core', 'LICENSE'],
  ['@tabler/icons', 'LICENSE'],
  ['@heroicons/react', 'LICENSE'],
  ['simple-icons', 'LICENSE.md'],
  ['feather-icons', 'LICENSE'],
  ['remixicon', 'License'],
  ['lineicons', 'LICENSE.md'],
  ['@dicebear/open-peeps', 'LICENSE'],
  ['@fluentui-emoji/svg', 'LICENSE'],
  ['flowbite-svelte-illustrations', 'LICENSE'],
  ['@iconify-json/material-symbols', 'info.json'],
  ['@iconify-json/fluent', 'info.json'],
  ['@iconify-json/carbon', 'info.json'],
  ['@iconify-json/bi', 'info.json'],
  ['@iconify-json/mingcute', 'info.json'],
]) {
  const source = path.join(root, 'node_modules', packageName, fileName)
  const target = packageName.replaceAll('/', '-') + '-' + fileName
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(licenseDir, target))
}
for (const fileName of ['LICENSE', 'README.md']) {
  fs.copyFileSync(path.join(glassRoot, fileName), path.join(licenseDir, `glass-icons-${fileName}`))
}
fs.copyFileSync(path.join(root, 'node_modules/@fluentui-emoji/svg/LICENSE'), path.join(licenseDir, 'fluentui-emoji-LICENSE'))
for (const [source, target] of [
  ['public/illustrations/bioicons/licenses/cc-0.txt', 'bioicons-CC0-1.0.txt'],
  ['public/illustrations/bioicons/licenses/bsd.txt', 'bioicons-BSD.txt'],
]) fs.copyFileSync(path.join(root, source), path.join(licenseDir, target))
console.log(`Wrote metadata and ${unique.length} SVGs across ${shards.length} compressed shards`)
