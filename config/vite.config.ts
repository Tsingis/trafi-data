import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true
    }
  }
})
