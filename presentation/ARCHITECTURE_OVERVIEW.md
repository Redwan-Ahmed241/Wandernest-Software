## Wandernest - Architecture Overview

Summary
- Single-page React application (React 19 + TypeScript) built with Vite for fast dev and optimized production builds.
- Styling via Tailwind CSS with a custom theme.
- Client-side routing with React Router DOM.
- Mapping via Leaflet / react-leaflet. Charts via Recharts.
- Auth & booking state: React Context providers.
- Deployment target in repo: Netlify (netlify.toml present) or static host.

High-level layers
- Presentation (UI): React components in `src/components`, pages in `src/Pages`, global styles in `src/styles`.
- State & Services: `src/Context` (booking-context), `src/Authentication` (auth-context), `src/App` wiring, API services under `src/App`.
- Assets: `public/` for static assets and images, `src/assets` for component-scoped assets.
- Build & Tooling: Vite dev server, TypeScript build, ESLint, Jest for tests, image optimization script `scripts/optimize-images.js`.

Data flow
1. User interacts with UI (Pages/Components).
2. Components consume Context providers (AuthProvider, BookingProvider) for session and booking state.
3. Actions call API services (in `src/App` or `src/api`) which hit backend endpoints (VITE_REACT_APP_API_URL).
4. Responses update Context and components re-render.

Performance & optimizations
- Code splitting via React.lazy + Suspense (see `src/App.tsx`).
- Image optimization script available; Tailwind builds purge unused CSS via Vite plugin.
- Leaflet map assets loaded on-demand; heavy components lazily loaded.

Security & deployment notes
- Uses environment variables with `VITE_` prefix for client-side config (set in `.env`).
- Netlify config available (`netlify.toml`) — recommend using CI pipeline to run `npm run build` and deploy `dist/`.

Files of interest
- `package.json` - scripts and dependencies
- `vite.config.ts` - build config
- `netlify.toml` - deploy rules
- `src/App.tsx` - routing, lazy loading, context providers
- `src/Authentication/auth-context` - auth flows
- `src/Context/booking-context` - booking state

Suggested talking points
- Why Vite + React (fast HMR, smaller bundles)
- Lazy loading strategy for perceived performance
- Context-based state for scopes like auth/booking (simple vs redux)
- Deployment pipeline and static hosting advantages
