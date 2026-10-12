import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — кейін Capacitor/WebView ішінен ашу үшін салыстырмалы жолдар керек
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5173 },
  build: { outDir: 'dist', assetsDir: 'assets' },
})
