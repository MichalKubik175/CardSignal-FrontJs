import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173, // Explicit port
    strictPort: true,
    open: true, // Open browser automatically
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: './' // Critical for proper routing
})