import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 9973,     // нужный порт
    host: true,      // чтобы был доступ из контейнера/сети
    watch: {
      usePolling: true,      // включаем polling
      interval: 500          // интервал проверки в мс
    }
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  }
})
