import JSZip from 'jszip'
import { ICON_CATALOG, getIconSvg } from '../data/iconCatalog'

const safeFilename = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function downloadIconsZip(iconIds: string[]) {
  const selectedIds = new Set(iconIds)
  const icons = ICON_CATALOG.filter((icon) => selectedIds.has(icon.id))
  if (icons.length === 0) return

  const zip = new JSZip()
  const usedFilenames = new Set<string>()
  const attributionRows = ['IconMuse SVG export attribution', '']

  icons.forEach((icon) => {
    const baseName = `${safeFilename(icon.name)}-${safeFilename(icon.source)}-${safeFilename(icon.style)}`
    let filename = `${baseName}.svg`
    let suffix = 2
    while (usedFilenames.has(filename)) filename = `${baseName}-${suffix++}.svg`
    usedFilenames.add(filename)
    zip.file(filename, getIconSvg(icon))
    attributionRows.push(`${filename}\t${icon.name}\t${icon.source}\t${icon.license}${icon.author ? `\t${icon.author}` : ''}`)
  })

  zip.file('ATTRIBUTION.txt', attributionRows.join('\n'))
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `iconmuse-${icons.length}-icons.zip`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
