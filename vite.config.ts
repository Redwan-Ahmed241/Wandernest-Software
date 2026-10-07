import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 1241, // Change this to your desired port
    proxy: {
      '/api': {
        target: 'https://wandernest-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    rollupOptions: {
      // Two HTML entries: the legacy page and the standalone tracker (own bundle).
      input: { main: 'index.html', tracker: 'tracker.html' },
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-feather', 'react-icons'],
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet'],
          datepicker: ['react-datepicker'],
        },
      },
    },
    // Enable minification and tree shaking
    minify: 'terser',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline small assets
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Optimize static assets
  assetsInclude: ['**/*.webp', '**/*.avif'],
})
