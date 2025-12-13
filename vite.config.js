import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // backend server
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensures SPA routing works on Render
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})