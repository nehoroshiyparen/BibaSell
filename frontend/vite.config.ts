import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 9973,     // нужный порт
    host: true,      // чтобы был доступ из контейнера/сети
    watch: {
      usePolling: true,      // включаем polling
      interval: 500          // интервал проверки в мс
    },
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:7812',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  }
})
