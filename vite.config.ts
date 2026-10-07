import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Mirrors public/_redirects so /tracker works in `vite` and `vite preview` too.
const rewriteTracker: Connect.NextHandleFunction = (req, _res, next) => {
  if (req.url && /^\/tracker\/?(\?|$)/.test(req.url)) req.url = req.url.replace(/^\/tracker\/?/, '/tracker.html')
  next()
}
const trackerRoute = (): Plugin => ({
  name: 'tracker-route',
  configureServer: (s) => void s.middlewares.use(rewriteTracker),
  configurePreviewServer: (s) => void s.middlewares.use(rewriteTracker),
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), trackerRoute()],
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
