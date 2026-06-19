/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://abbuba.github.io/Kamvala-A-Location-Based-Local-Job-Matching-Application/
const repoBase = '/Kamvala-A-Location-Based-Local-Job-Matching-Application/'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? repoBase : '/',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['mapbox-gl/dist/mapbox-gl-csp.js'],
  },
  worker: {
    format: 'es',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
