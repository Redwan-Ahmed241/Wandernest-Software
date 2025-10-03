import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 1241, // Change this to your desired port
  },
  build: {
    rollupOptions: {
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
