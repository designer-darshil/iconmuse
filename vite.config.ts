import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Publish source maps so production errors in the generated bundle can be
    // traced to their original modules in browser diagnostics.
    sourcemap: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
