import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false, // Set to true to auto-open report after build
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
