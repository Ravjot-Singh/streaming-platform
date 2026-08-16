import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
  tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Without this, Vite's file-watcher often misses change events
    // on Windows bind-mounts (Docker Desktop doesn't forward native
    // filesystem change events the same way native Linux does).
    watch: {
      usePolling: true
    }
  }
})