const cache = new Map()
const MAX_LIMIT = 24

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'cache-control': 'public, max-age=60',
      ...extraHeaders,
    },
  })
}

function normalizedTokens(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) ?? []
}

function bucket(value, count) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) % count
}

async function readAsset(env, key) {
  if (cache.has(key)) return cache.get(key)
  const promise = (async () => {
    const response = await env.ASSETS.fetch(new Request(`https://assets.iconmuse.invalid/data/${key}`))
    if (!response.ok) throw new Error(`Missing generated data asset: ${key}`)
    return response.json()
  })()
  cache.set(key, promise)
  try {
    return await promise
  } catch (error) {
    cache.delete(key)
    throw error
  }
}

async function getSvg(env, id) {
  const shard = bucket(id, 4096).toString(16).padStart(3, '0')
  const data = await readAsset(env, `svg/${shard}.json`)
  return data[id] ?? null
}

async function handleSearch(request, env) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.trim() ?? ''
  if (query.length < 2) return json({ items: [], total: 0, nextOffset: null })
  if (query.length > 100) return json({ error: 'Search text must be 100 characters or fewer.' }, 400)

  const terms = [...new Set(normalizedTokens(query))]
  if (!terms.length || terms.length > 8) return json({ items: [], total: 0, nextOffset: null })
  const indexKeys = [...new Set(terms.map((term) => term.slice(0, 2)))].map((key) => `search/${key}.json`)
  const indexes = await Promise.all(indexKeys.map((key) => readAsset(env, key).catch(() => ({}))))
  const postings = terms.map((term) => indexes[indexKeys.indexOf(`search/${term.slice(0, 2)}.json`)]?.[term])
  if (postings.some((ids) => !ids?.length)) return json({ items: [], total: 0, nextOffset: null })

  postings.sort((left, right) => left.length - right.length)
  const rest = postings.slice(1).map((ids) => new Set(ids))
  const candidateIds = postings[0].filter((id) => rest.every((ids) => ids.has(id)))
  if (!candidateIds.length) return json({ items: [], total: 0, nextOffset: null })

  const metadataKeys = [...new Set(candidateIds.map((id) => `metadata/${bucket(id, 16).toString(16).padStart(2, '0')}.json`))]
  const shards = await Promise.all(metadataKeys.map((key) => readAsset(env, key)))
  const metadata = new Map(shards.flat().map((item) => [item.id, item]))
  const source = url.searchParams.get('source') ?? ''
  const style = url.searchParams.get('style') ?? ''
  const queryTokens = terms
  const results = candidateIds
    .map((id) => metadata.get(id))
    .filter((item) => item && (!source || item.source === source) && (!style || item.style === style))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      const q = query.toLowerCase()
      const score = (name) => name === q ? 0 : name.startsWith(q) ? 1 : queryTokens.every((token) => name.includes(token)) ? 2 : 3
      return score(nameA) - score(nameB) || nameA.localeCompare(nameB) || a.id.localeCompare(b.id)
    })

  const offset = Math.max(0, Math.min(10000, Number.parseInt(url.searchParams.get('offset') ?? '0', 10) || 0))
  const limit = Math.max(1, Math.min(MAX_LIMIT, Number.parseInt(url.searchParams.get('limit') ?? String(MAX_LIMIT), 10) || MAX_LIMIT))
  const items = results.slice(offset, offset + limit)
  const nextOffset = offset + items.length < results.length ? offset + items.length : null
  return json({ items, total: results.length, nextOffset }, 200, { 'cache-control': 'public, max-age=30' })
}

async function handlePreviews(request, env) {
  const url = new URL(request.url)
  const ids = [...new Set((url.searchParams.get('ids') ?? '').split(',').filter((id) => /^[a-z0-9-]{1,200}$/i.test(id)))].slice(0, MAX_LIMIT)
  const shards = [...new Set(ids.map((id) => bucket(id, 4096).toString(16).padStart(3, '0')))]
  const contents = await Promise.all(shards.map((shard) => readAsset(env, `svg/${shard}.json`)))
  const svgById = new Map(contents.flatMap((content) => Object.entries(content)))
  return json({ previews: Object.fromEntries(ids.map((id) => [id, svgById.get(id)]).filter(([, svg]) => typeof svg === 'string')) }, 200, { 'cache-control': 'public, max-age=300' })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
    } })
    if (request.method !== 'GET') return json({ error: 'Only GET requests are supported.' }, 405)
    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/facets') return json(await readAsset(env, 'facets.json'), 200, { 'cache-control': 'public, max-age=3600' })
      if (url.pathname === '/api/search') return await handleSearch(request, env)
      if (url.pathname === '/api/previews') return await handlePreviews(request, env)
      const iconMatch = url.pathname.match(/^\/api\/icons\/([a-z0-9-]{1,200})$/i)
      if (iconMatch) {
        const svg = await getSvg(env, iconMatch[1])
        if (!svg) return json({ error: 'Icon not found.' }, 404)
        return json({ id: iconMatch[1], svg }, 200, { 'cache-control': 'public, max-age=86400, immutable' })
      }
      return json({ error: 'Not found.' }, 404)
    } catch (error) {
      console.error('IconMuse API error', error)
      return json({ error: 'IconMuse could not complete this request. Try again shortly.' }, 500)
    }
  },
}
