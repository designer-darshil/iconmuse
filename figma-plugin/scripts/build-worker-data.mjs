import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.resolve(pluginRoot, '..')
const outputRoot = path.join(pluginRoot, 'worker/.generated/data')
const metadataShards = 16
const svgShards = 4096

function bucket(value, count) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) % count
}

function writeJson(relativePath, value) {
  const destination = path.join(outputRoot, relativePath)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, JSON.stringify(value))
}

function tokenize(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) ?? []
}

const manifestPath = path.join(root, 'public/icon-catalog-manifest.json')
if (!fs.existsSync(manifestPath)) {
  throw new Error('Missing public/icon-catalog-manifest.json. Run npm run catalog:build first.')
}

fs.rmSync(outputRoot, { recursive: true, force: true })
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const catalog = manifest.shards.flatMap(({ file }) => {
  const shardPath = path.join(root, 'public', file)
  if (!fs.existsSync(shardPath)) throw new Error(`Missing catalog shard ${file}. Run npm run catalog:build first.`)
  return JSON.parse(gunzipSync(fs.readFileSync(shardPath), { maxOutputLength: 8 * 1024 * 1024 }).toString('utf8'))
})
if (catalog.length !== manifest.count) throw new Error(`Catalog is incomplete (${catalog.length} of ${manifest.count} icons).`)
const metadata = Array.from({ length: metadataShards }, () => [])
const svgData = Array.from({ length: svgShards }, () => ({}))
const searchData = new Map()
const sources = new Set()
const styles = new Set()

for (const icon of catalog) {
  const row = {
    id: icon.id,
    name: icon.name,
    source: icon.source,
    style: icon.style,
    license: icon.license,
    ...(icon.author ? { author: icon.author } : {}),
    tags: icon.tags ?? [],
  }
  metadata[bucket(icon.id, metadataShards)].push(row)
  svgData[bucket(icon.id, svgShards)][icon.id] = icon.svg
  sources.add(icon.source)
  styles.add(icon.style)

  const terms = new Set(tokenize(`${icon.name} ${(icon.tags ?? []).join(' ')}`))
  for (const term of terms) {
    if (term.length < 2) continue
    for (let length = 2; length <= term.length; length += 1) {
      const prefix = term.slice(0, length)
      let postings = searchData.get(prefix)
      if (!postings) searchData.set(prefix, (postings = new Set()))
      postings.add(icon.id)
    }
  }
}

for (let index = 0; index < metadata.length; index += 1) {
  writeJson(`metadata/${index.toString(16).padStart(2, '0')}.json`, metadata[index])
}
for (let index = 0; index < svgData.length; index += 1) {
  const values = svgData[index]
  if (Object.keys(values).length) writeJson(`svg/${index.toString(16).padStart(3, '0')}.json`, values)
}
// Group token postings into small, lazy-loadable static assets.
const indexFiles = new Map()
for (const [prefix, ids] of searchData) {
  const key = prefix.slice(0, 2)
  let file = indexFiles.get(key)
  if (!file) indexFiles.set(key, (file = {}))
  file[prefix] = [...ids]
}
for (const [key, value] of indexFiles) writeJson(`search/${key}.json`, value)
writeJson('facets.json', { sources: [...sources].sort(), styles: [...styles].sort() })

const files = (directory) => {
  const result = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...files(target))
    else result.push(target)
  }
  return result
}
const dataFiles = files(outputRoot)
const totalBytes = () => {
  let total = 0
  for (const file of dataFiles) total += fs.statSync(file).size
  return total
}
const largestAsset = dataFiles.reduce((largest, file) => Math.max(largest, fs.statSync(file).size), 0)
console.log(`Prepared ${catalog.length} icons for Cloudflare Workers.`)
console.log(`Static data: ${dataFiles.length} files, ${(totalBytes() / 1024 / 1024).toFixed(1)} MiB; largest asset ${(largestAsset / 1024 / 1024).toFixed(1)} MiB.`)
