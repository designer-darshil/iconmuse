import { readFileSync } from 'node:fs'

const tokenSource = readFileSync(new URL('../src/styles/_tokens.scss', import.meta.url), 'utf8')
const tailwindSource = readFileSync(new URL('../src/styles/tailwind.css', import.meta.url), 'utf8')

function declarations(source, selector) {
  const block = source.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`))?.[1]
  if (!block) throw new Error(`Could not find ${selector} token block`)
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([^;]+);/gi)].map((match) => [match[1], match[2].trim()]))
}

function resolveDeclarations(source, selector, inherited = {}) {
  const values = { ...inherited, ...declarations(source, selector) }
  return Object.fromEntries(Object.entries(values).map(([name, value]) => {
    let resolved = value
    for (let i = 0; i < 8 && /var\(--[\w-]+\)/.test(resolved); i++) {
      resolved = resolved.replace(/var\(--([\w-]+)\)/g, (_match, ref) => values[ref] ?? _match)
    }
    return [name, resolved.toUpperCase()]
  }))
}

const lightTokens = declarations(tokenSource, ':root')
const darkTokens = declarations(tokenSource, 'html\\.dark')
const lightUi = resolveDeclarations(tailwindSource, ':root', lightTokens)
const darkUi = resolveDeclarations(tailwindSource, 'html\\.dark', darkTokens)

const palettes = {
  light: {
    surfaces: [lightTokens.canvas, lightTokens.surface, lightTokens['surface-strong']],
    textThreshold: 4.5,
    componentThreshold: 3,
    statusThreshold: 4.5,
    text: [lightTokens.ink, lightTokens.muted, lightTokens['accent-text'], lightTokens.success, lightTokens.danger],
    component: [lightTokens['control-line'], lightTokens.selection],
    selectedState: {
      foreground: lightTokens['accent-text'],
      background: lightTokens['selection-soft'],
      boundary: lightTokens.selection,
      adjacentSurface: lightTokens.canvas,
    },
    primaryButton: { foreground: lightUi['primary-foreground'], background: lightUi.primary },
    code: { background: '#0F1116', foregrounds: ['#F1F1F3', '#B89AFF', '#38BDF8', '#A7F3D0', '#94A3B8'] },
    compareBadge: { foreground: '#B89AFF', background: '#2E2156' },
    statuses: [
      [lightTokens.success, lightTokens['success-subtle']],
      ['#0369A1', '#E0F2FE'],
      ['#854D0E', '#FEF08A'],
      [lightTokens.danger, lightTokens['danger-subtle']],
    ],
  },
  dark: {
    textThreshold: 7,
    componentThreshold: 3,
    statusThreshold: 7,
    surfaces: [darkTokens.canvas, darkTokens.surface, darkTokens['surface-strong']],
    text: [darkTokens.ink, darkTokens.muted, darkTokens['accent-text'], darkTokens.success, darkTokens.danger],
    component: [darkTokens['control-line'], darkTokens.selection],
    selectedState: {
      foreground: darkTokens['accent-text'],
      background: darkTokens['selection-soft'],
      boundary: darkTokens.selection,
      adjacentSurface: darkTokens.surface,
    },
    primaryButton: { foreground: darkUi['primary-foreground'], background: darkUi.primary },
    code: { background: '#25262C', foregrounds: ['#F1F1F3', '#C5AEFF', '#7DD3FC', '#A7F3D0', '#B6B6C2'] },
    compareBadge: { foreground: '#E0D4FF', background: '#3A2D66' },
    statuses: [
      [darkTokens.success, darkTokens['success-subtle']],
      ['#7DD3FC', darkTokens['info-subtle']],
      ['#FCD34D', darkTokens['warning-subtle']],
      [darkTokens.danger, darkTokens['danger-subtle']],
    ],
  },
}

function luminance(hex) {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi).map((channel) => parseInt(channel, 16) / 255)
  const linear = [r, g, b].map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

let failures = 0
for (const [theme, palette] of Object.entries(palettes)) {
  for (const foreground of palette.text) {
    for (const background of palette.surfaces) {
      const ratio = contrast(foreground, background)
      if (ratio < palette.textThreshold) {
        console.error(`FAIL ${theme} text ${foreground} on ${background}: ${ratio.toFixed(2)}:1 (needs ${palette.textThreshold}:1)`)
        failures++
      }
    }
  }
  for (const foreground of palette.component) {
    for (const background of palette.surfaces) {
      const ratio = contrast(foreground, background)
      if (ratio < palette.componentThreshold) {
        console.error(`FAIL ${theme} non-text ${foreground} on ${background}: ${ratio.toFixed(2)}:1 (needs ${palette.componentThreshold}:1)`)
        failures++
      }
    }
  }
  for (const [foreground, background] of palette.statuses) {
    const ratio = contrast(foreground, background)
    if (ratio < palette.statusThreshold) {
      console.error(`FAIL ${theme} status text ${foreground} on ${background}: ${ratio.toFixed(2)}:1 (needs ${palette.statusThreshold}:1)`)
      failures++
    }
  }
  const selectedTextRatio = contrast(
    palette.selectedState.foreground,
    palette.selectedState.background,
  )
  const selectedTextThreshold = theme === 'dark' ? 7 : 4.5
  if (selectedTextRatio < selectedTextThreshold) {
    console.error(`FAIL ${theme} selected-state text: ${selectedTextRatio.toFixed(2)}:1 (needs ${selectedTextThreshold}:1)`)
    failures++
  }
  const selectedBoundaryRatio = contrast(
    palette.selectedState.boundary,
    palette.selectedState.adjacentSurface,
  )
  if (selectedBoundaryRatio < 3) {
    console.error(`FAIL ${theme} selected-state boundary: ${selectedBoundaryRatio.toFixed(2)}:1 (needs 3:1)`)
    failures++
  }
  const buttonRatio = contrast(palette.primaryButton.foreground, palette.primaryButton.background)
  if (buttonRatio < 4.5) {
    console.error(`FAIL ${theme} button text: ${buttonRatio.toFixed(2)}:1 (needs 4.5:1)`)
    failures++
  }
  for (const foreground of palette.code.foregrounds) {
    const ratio = contrast(foreground, palette.code.background)
    const codeThreshold = theme === 'light' ? 4.5 : 7
    if (ratio < codeThreshold) {
      console.error(`FAIL ${theme} code preview text ${foreground} on ${palette.code.background}: ${ratio.toFixed(2)}:1 (needs ${codeThreshold}:1)`)
      failures++
    }
  }
  const badgeRatio = contrast(palette.compareBadge.foreground, palette.compareBadge.background)
  const badgeThreshold = theme === 'light' ? 4.5 : 7
  if (badgeRatio < badgeThreshold) {
    console.error(`FAIL ${theme} comparison badge: ${badgeRatio.toFixed(2)}:1 (needs ${badgeThreshold}:1)`)
    failures++
  }
  console.log(`${theme}: checked ${palette.text.length * palette.surfaces.length} text pairs at ${palette.textThreshold}:1, ${palette.component.length * palette.surfaces.length} non-text pairs at ${palette.componentThreshold}:1, ${palette.statuses.length} status pairs, 1 selected state, and 1 button pair`)
}

if (failures) process.exitCode = 1
else console.log('Contrast checks passed.')
