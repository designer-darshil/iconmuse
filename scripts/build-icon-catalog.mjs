import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as lucide from 'lucide-react'
import * as heroOutline from '@heroicons/react/24/outline'
import * as heroSolid from '@heroicons/react/24/solid'
import * as simpleIcons from 'simple-icons'
import { createAvatar } from '@dicebear/core'
import * as openPeeps from '@dicebear/open-peeps'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const records = []
const slugify = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-')

function add(source, name, style, svg, license, preserveColors = false, author) {
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
  const category = ['Open Doodles', 'Open Peeps', 'Fluent Emoji', 'Flowbite Illustrations'].includes(source) ? 'Illustrations' : 'Icons'
  records.push({ id, name: readableName.replace(/\b\w/g, (letter) => letter.toUpperCase()), category, source, style, license, ...(author ? { author } : {}), tags: slugify(name).split('-'), svg })
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

// Microsoft Fluent Emoji ships a complete, editable flat SVG variant plus
// high-contrast and modern variants. Include the flat SVG catalog here.
const fluentRoot = path.join(root, 'node_modules/@fluentui-emoji/svg')
const fluentMetadata = JSON.parse(fs.readFileSync(path.join(fluentRoot, 'metadata.json'), 'utf8'))
for (const emoji of fluentMetadata.emojis) {
  if (!emoji.styles.includes('flat')) continue
  const svgPath = path.join(fluentRoot, 'icons/flat', `${emoji.slug}.svg`)
  if (!fs.existsSync(svgPath)) continue
  add('Fluent Emoji', emoji.name, 'flat', fs.readFileSync(svgPath, 'utf8'), 'MIT', true)
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

const iraIllustration = fs.readFileSync(path.join(root, 'public/illustrations/ira-design/man-simple.svg'), 'utf8')
add('IRA Design', 'Man Simple', 'illustration', iraIllustration, 'MIT', true)

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
fs.writeFileSync(path.join(root, 'public/icon-catalog.json'), JSON.stringify(unique))
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
]) {
  const source = path.join(root, 'node_modules', packageName, fileName)
  const target = packageName.replaceAll('/', '-') + '-' + fileName
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(licenseDir, target))
}
for (const [source, target] of [
  ['public/illustrations/bioicons/licenses/cc-0.txt', 'bioicons-CC0-1.0.txt'],
  ['public/illustrations/bioicons/licenses/bsd.txt', 'bioicons-BSD.txt'],
  ['public/illustrations/ira-design/LICENSE.txt', 'ira-design-MIT.txt'],
]) fs.copyFileSync(path.join(root, source), path.join(licenseDir, target))
console.log(`Wrote ${unique.length} icons to public/icon-catalog.json`)
