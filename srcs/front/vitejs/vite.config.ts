import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ],
    }
  },
  server: {
    allowedHosts: ["*"],
    proxy: {
      '/localrpc': {
        target: 'http://127.0.0.1:8545',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rpc/, ''),
      },
    },
    host: true,
    watch: {
      usePolling: true,
    }
  }
})
