import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // FIXED: Ubah localhost menjadi 127.0.0.1 agar tidak lari ke IPv6 (::1)
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})