import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/backend': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
