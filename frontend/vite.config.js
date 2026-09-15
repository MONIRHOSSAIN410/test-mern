import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind v4 is wired up through postcss.config.mjs (@tailwindcss/postcss),
// so no Tailwind plugin is needed — and imported here it was an unused
// variable that failed `npm run lint`.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
