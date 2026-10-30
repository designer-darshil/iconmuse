type IconResult = {
  id: string
  name: string
  source: string
  style: string
  license: string
  author?: string
}

type SearchResponse = {
  items: IconResult[]
  nextOffset: number | null
  total: number
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const queryInput = $('query') as HTMLInputElement
const sourceSelect = $('source') as HTMLSelectElement
const styleSelect = $('style') as HTMLSelectElement
const status = $('status')
const grid = $('grid')
const moreButton = $('more') as HTMLButtonElement
const settings = $('settings')
const apiInput = $('api-url') as HTMLInputElement
const settingsToggle = $('settings-toggle') as HTMLButtonElement

const STORAGE_KEY = 'iconmuse-figma-api-url'
const DEFAULT_API = 'http://localhost:8787'
let sessionApiBase = DEFAULT_API
let offset: number | null = null
let requestNumber = 0
let debounceTimer = 0
let loadingMore = false

function getApiBase() {
  try {
    sessionApiBase = (localStorage.getItem(STORAGE_KEY) || sessionApiBase || DEFAULT_API).replace(/\/+$/, '')
  } catch {
    // Some embedded plugin webviews disable browser storage. Keep settings usable for this session.
  }
  return sessionApiBase
}

function setApiBase(value: string) {
  sessionApiBase = value || DEFAULT_API
  try {
    localStorage.setItem(STORAGE_KEY, sessionApiBase)
  } catch {
    // The value remains available in memory until this plugin window closes.
  }
}

function showStatus(message: string, kind: 'info' | 'error' = 'info') {
  status.textContent = message
  status.className = kind === 'error' ? 'error' : ''
}

async function api(path: string, signal?: AbortSignal) {
  const response = await fetch(`${getApiBase()}${path}`, { signal })
  if (!response.ok) {
    let detail = `IconMuse API returned ${response.status}.`
    try {
      const body = await response.json() as { error?: string }
      if (body.error) detail = body.error
    } catch { /* Keep the HTTP status message. */ }
    throw new Error(detail)
  }
  return response.json()
}

async function loadFacets() {
  try {
    const facets = await api('/api/facets') as { sources: string[]; styles: string[] }
    sourceSelect.replaceChildren(new Option('All libraries', ''))
    styleSelect.replaceChildren(new Option('All styles', ''))
    for (const [select, values] of [[sourceSelect, facets.sources], [styleSelect, facets.styles]] as const) {
      for (const value of values) {
        const option = document.createElement('option')
        option.value = value
        option.textContent = value
        select.append(option)
      }
    }
  } catch (error) {
    showStatus(error instanceof Error ? error.message : 'Could not connect to IconMuse.', 'error')
  }
}

function renderIcon(item: IconResult) {
  const button = document.createElement('button')
  button.className = 'icon'
  button.type = 'button'
  button.title = `${item.name} · ${item.source} · ${item.license}`
  button.setAttribute('aria-label', `Insert ${item.name} from ${item.source}`)
  const preview = document.createElement('span')
  preview.className = 'preview'
  const label = document.createElement('span')
  label.className = 'label'
  label.textContent = item.name
  button.append(preview, label)
  button.addEventListener('click', () => void insert(item, button))
  return { button, preview }
}

async function loadPreviews(items: IconResult[], targets: HTMLElement[]) {
  if (!items.length) return
  try {
    const ids = items.map((item) => item.id).join(',')
    const data = await api(`/api/previews?ids=${encodeURIComponent(ids)}`) as { previews: Record<string, string> }
    items.forEach((item, index) => {
      const svgMarkup = data.previews[item.id]
      if (!svgMarkup) return
      const template = document.createElement('template')
      template.innerHTML = svgMarkup
      const svg = template.content.querySelector('svg')
      if (svg) targets[index].replaceChildren(svg)
    })
  } catch { /* A missing preview should not prevent insertion or searching. */ }
}

async function insert(item: IconResult, button: HTMLButtonElement) {
  button.disabled = true
  showStatus(`Loading ${item.name}…`)
  try {
    const data = await api(`/api/icons/${encodeURIComponent(item.id)}`) as { svg: string }
    parent.postMessage({ pluginMessage: {
      type: 'insert-icon', svg: data.svg, name: item.name, source: item.source, license: item.license,
    } }, '*')
  } catch (error) {
    showStatus(error instanceof Error ? error.message : 'Could not load this icon.', 'error')
  } finally {
    button.disabled = false
  }
}

async function search(append = false) {
  const q = queryInput.value.trim()
  const currentRequest = ++requestNumber
  if (!append) {
    offset = null
    grid.replaceChildren()
    moreButton.style.display = 'none'
  }
  if (q.length < 2) {
    showStatus('Type at least 2 characters to search.')
    return
  }
  loadingMore = append
  showStatus(append ? 'Loading more icons…' : 'Searching…')
  const params = new URLSearchParams({ q, limit: '48', offset: String(append ? offset ?? 0 : 0) })
  if (sourceSelect.value) params.set('source', sourceSelect.value)
  if (styleSelect.value) params.set('style', styleSelect.value)
  try {
    const data = await api(`/api/search?${params}`) as SearchResponse
    if (currentRequest !== requestNumber) return
    if (!append) grid.replaceChildren()
    const rendered = data.items.map(renderIcon)
    for (const item of rendered) grid.append(item.button)
    void loadPreviews(data.items, rendered.map((item) => item.preview))
    offset = data.nextOffset
    moreButton.style.display = offset === null ? 'none' : 'block'
    showStatus(data.total ? `${data.total.toLocaleString()} matching icons` : 'No icons found. Try another search.')
  } catch (error) {
    if (currentRequest !== requestNumber) return
    showStatus(error instanceof Error ? error.message : 'Could not search IconMuse.', 'error')
  } finally {
    loadingMore = false
  }
}

function scheduleSearch() {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => void search(), 240)
}

queryInput.addEventListener('input', scheduleSearch)
sourceSelect.addEventListener('change', () => void search())
styleSelect.addEventListener('change', () => void search())
moreButton.addEventListener('click', () => {
  if (!loadingMore && offset !== null) void search(true)
})
settingsToggle.addEventListener('click', () => {
  const open = settings.style.display === 'block'
  settings.style.display = open ? 'none' : 'block'
  if (!open) apiInput.value = getApiBase()
})
apiInput.addEventListener('change', () => {
  const value = apiInput.value.trim().replace(/\/+$/, '')
  if (value && !/^https?:\/\//i.test(value)) {
    showStatus('API URL must start with http:// or https://.', 'error')
    return
  }
  setApiBase(value)
  grid.replaceChildren()
  void loadFacets()
  scheduleSearch()
})

window.onmessage = (event: MessageEvent) => {
  const message = event.data?.pluginMessage
  if (message?.type === 'inserted') showStatus(`Added ${message.name} to the canvas.`)
  if (message?.type === 'insert-error') showStatus(message.detail || 'Figma could not import this SVG.', 'error')
}

void loadFacets()
