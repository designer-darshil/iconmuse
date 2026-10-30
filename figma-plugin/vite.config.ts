import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const pluginRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const buildingCode = mode === 'plugin-code'
  return {
  root: pluginRoot,
  // Figma loads ui.html from a plugin-owned URL, not from the site root.
  // Absolute `/assets/...` URLs therefore point outside the plugin iframe.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: buildingCode,
    copyPublicDir: false,
    target: 'es2020',
    rollupOptions: {
      input: buildingCode ? path.resolve(pluginRoot, 'src/code.ts') : path.resolve(pluginRoot, 'ui.html'),
      ...(buildingCode ? { output: { entryFileNames: 'code.js', format: 'iife' as const } } : {}),
    },
  },
  plugins: [{
    name: 'prepare-figma-plugin-output',
    closeBundle() {
      if (buildingCode) {
        const manifest = JSON.parse(fs.readFileSync(path.join(pluginRoot, 'manifest.json'), 'utf8'))
        manifest.main = 'code.js'
        manifest.ui = 'ui.html'
        fs.writeFileSync(path.join(pluginRoot, 'dist/manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
        return
      }

      // Figma's __html__ UI is more reliable when it is self-contained. Vite
      // emits a separate module asset by default, so inline that bundled code.
      const htmlPath = path.join(pluginRoot, 'dist/ui.html')
      const html = fs.readFileSync(htmlPath, 'utf8')
      const scriptTag = html.match(/<script\s+type="module"\s+crossorigin\s+src="([^"]+)"\s*>\s*<\/script>/i)
      if (!scriptTag) throw new Error('Could not find the bundled Figma UI script to inline.')
      const scriptPath = path.join(pluginRoot, 'dist', scriptTag[1].replace(/^\.\//, ''))
      const script = fs.readFileSync(scriptPath, 'utf8').replace(/<\/script/gi, '<\\/script')
      const inlined = html.replace(scriptTag[0], `<script>${script}</script>`)
      fs.writeFileSync(htmlPath, inlined)
    },
  }],
  }
})
