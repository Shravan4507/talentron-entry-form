import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const buildTimestamp = Date.now().toString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-version-json',
      closeBundle() {
        writeFileSync(
          resolve('dist', 'version.json'),
          JSON.stringify({ version: buildTimestamp })
        )
      }
    }
  ],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-utils': ['xlsx', 'file-saver', 'jszip', 'framer-motion'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, 
  }
})
