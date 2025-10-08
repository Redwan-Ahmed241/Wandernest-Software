## Likely Questions & Short Answers

Q: Why React Context instead of Redux?
A: Context is simpler for scoped state like auth and booking. Redux adds complexity for this use-case; consider it if state grows or needs complex caching.

Q: How do you handle sensitive keys?
A: Use environment variables with `VITE_` prefix for client-accessible values; never expose server secrets in client code. Use backend for secret storage.

Q: How is performance optimized?
A: Lazy loading, Tailwind purge, image optimization script, and code-splitting. Next steps: add HTTP caching, CDN, and client-side cache (SWR/react-query).

Q: Why Vite?
A: Faster dev server and HMR, simpler config, and modern build optimizations.
