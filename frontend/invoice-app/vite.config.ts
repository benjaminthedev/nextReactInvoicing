import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { subscribePlugin } from './subscribePlugin'

export default defineConfig({
  plugins: [react(), subscribePlugin(__dirname)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})