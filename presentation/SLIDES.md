---
title: Wandernest - Architecture & Project Structure
---

# Wandernest — Architecture & Structure

--

## Project Snapshot

- React 19 + TypeScript
- Vite build tool
- Tailwind CSS for styling
- Client-side routing: React Router DOM
- Maps: Leaflet / react-leaflet
- Testing: Jest + React Testing Library

--

## Folder Layout (key dirs)

```
src/
├── App/                 # API services and main app logic
├── Authentication/      # Auth context and login/signup
├── components/          # Reusable UI components
├── Context/             # React context providers (booking, etc.)
├── Pages/               # Route pages
├── assets/              # Component assets
└── styles/              # Tailwind/global styles
public/                  # Static assets (images, manifest)
```

--

## Routing & Lazy-loading

- `src/App.tsx` orchestrates routes using React Router.
- Heavy pages are lazy-loaded via `React.lazy` + `Suspense` to reduce initial bundle size.
- Protected routes use an `AuthProvider` and `ProtectedRoute` wrapper.

--

## State Management

- Local UI state in components
- Cross-cutting app state (auth, bookings) via React Context providers
- Suggested next step: add a light caching layer or SWR/react-query for API cache.

--

## Build & Deployment

- Local dev: `npm run dev` (Vite)
- Production build: `npm run build` (TypeScript build + Vite build)
- CI/CD: Deploy `dist/` to Netlify (netlify.toml present)
- Image optimization helper: `npm run optimize-images`

--

## Diagram (next slide)

--

## Speaker Notes

- Intro: quick tech stack and goals (1 min)
- Architecture: layers, where logic lives (2 min)
- Routing & lazy-loading: show code snippet from `src/App.tsx` (1 min)
- Deployment & perf: explain build, images, Tailwind purge (1 min)
- Q&A prep (rest)
