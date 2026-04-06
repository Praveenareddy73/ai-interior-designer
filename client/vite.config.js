import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Removed FastAPI proxy, requests will hit local Wrangler / production CF worker directly
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
