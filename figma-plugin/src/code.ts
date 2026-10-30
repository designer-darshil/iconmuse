figma.showUI(__html__, { width: 360, height: 500, themeColors: true })

figma.ui.onmessage = async (message: { type?: string; svg?: string; name?: string; source?: string; license?: string }) => {
  if (message.type !== 'insert-icon' || typeof message.svg !== 'string') return

  try {
    await figma.currentPage.loadAsync()
    const node = figma.createNodeFromSvg(message.svg)
    const attribution = [message.name, message.source, message.license].filter(Boolean).join(' · ')
    node.name = attribution || 'IconMuse icon'
    node.setPluginData('iconmuse.attribution', attribution)
    node.x = figma.viewport.center.x - node.width / 2
    node.y = figma.viewport.center.y - node.height / 2
    figma.currentPage.appendChild(node)
    figma.currentPage.selection = [node]
    figma.ui.postMessage({ type: 'inserted', name: message.name })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Figma could not import this SVG.'
    figma.ui.postMessage({ type: 'insert-error', detail })
  }
}
