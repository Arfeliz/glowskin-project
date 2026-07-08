import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // En GitHub Pages el sitio vive en /glowskin-project/
  // En local (o Vercel/Netlify con dominio propio) se usa /
  base: process.env.VITE_BASE_PATH ?? '/',
})
