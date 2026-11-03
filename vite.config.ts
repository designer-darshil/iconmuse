import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
      'jszip',
    ],
  },
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
