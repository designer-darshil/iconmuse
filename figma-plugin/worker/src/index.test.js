import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import worker from './index.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.generated/data')

function assetBinding() {
  return {
    async fetch(request) {
      const pathname = new URL(request.url).pathname.replace(/^\/data\//, '')
      const file = path.resolve(root, pathname)
      if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file)) return new Response('Not found', { status: 404 })
      return new Response(fs.readFileSync(file), { headers: { 'content-type': 'application/json' } })
    },
  }
}

async function call(pathname, method = 'GET') {
  return worker.fetch(new Request(`https://api.test${pathname}`, { method }), { ASSETS: assetBinding() })
}

test('facets expose the catalog source and style filters', async () => {
  const response = await call('/api/facets')
  const body = await response.json()
  assert.equal(response.status, 200)
  assert.ok(body.sources.includes('Lucide'))
  assert.ok(body.styles.includes('stroke'))
})

test('search returns matching results and paginates without duplicates', async () => {
  const firstResponse = await call('/api/search?q=home&limit=5&offset=0')
  const first = await firstResponse.json()
  assert.equal(firstResponse.status, 200)
  assert.ok(first.total > 5)
  assert.equal(first.items.length, 5)
  assert.notEqual(first.nextOffset, null)
  assert.ok(first.items.some((item) => item.name.toLowerCase().includes('home') || item.tags.includes('home')))

  const secondResponse = await call(`/api/search?q=home&limit=5&offset=${first.nextOffset}`)
  const second = await secondResponse.json()
  const firstIds = new Set(first.items.map((item) => item.id))
  assert.ok(second.items.every((item) => !firstIds.has(item.id)))
})

test('source and style filters narrow search results', async () => {
  const response = await call('/api/search?q=home&source=Lucide&style=stroke')
  const body = await response.json()
  assert.ok(body.items.length > 0)
  assert.ok(body.items.every((item) => item.source === 'Lucide' && item.style === 'stroke'))
})

test('empty searches and unknown terms return an empty result set', async () => {
  const short = await (await call('/api/search?q=a')).json()
  const none = await (await call('/api/search?q=zzzxqv-unlikely-token')).json()
  assert.deepEqual(short.items, [])
  assert.deepEqual(none.items, [])
})

test('preview and icon endpoints return source SVG markup', async () => {
  const search = await (await call('/api/search?q=home&limit=1')).json()
  const icon = search.items[0]
  assert.ok(icon)
  const previews = await (await call(`/api/previews?ids=${encodeURIComponent(icon.id)}`)).json()
  assert.match(previews.previews[icon.id], /^<svg\b/i)
  const response = await call(`/api/icons/${encodeURIComponent(icon.id)}`)
  const body = await response.json()
  assert.equal(body.id, icon.id)
  assert.match(body.svg, /^<svg\b/i)
})

test('API reports invalid methods, long queries, and missing icons clearly', async () => {
  assert.equal((await call('/api/facets', 'POST')).status, 405)
  assert.equal((await call(`/api/search?q=${'x'.repeat(101)}`)).status, 400)
  assert.equal((await call('/api/icons/no-such-icon')).status, 404)
})

test('API preflight enables cross-origin plugin access', async () => {
  const response = await call('/api/search', 'OPTIONS')
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), '*')
})
