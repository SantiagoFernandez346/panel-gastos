import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Separa la librería de gráficos (la más pesada) para que el navegador la cachee aparte
        manualChunks: {
          graficos: ['recharts'],
        },
      },
    },
  },
})
