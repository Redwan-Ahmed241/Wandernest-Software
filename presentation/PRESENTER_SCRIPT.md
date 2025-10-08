## 5-7 Minute Presenter Script

0:00-0:30 — Intro
- Hello, I'm presenting the Wandernest frontend architecture. I'll cover the stack, how the app is organized, key design choices, and deployment.

0:30-1:30 — Stack & Goals
- Built with React 19 and TypeScript. Vite powers local dev and builds. Tailwind provides consistent styling and theming.
- Goals: fast developer experience, modular code, good perceived performance.

1:30-3:00 — App Structure & Routing
- `src/Pages` contains route pages; `src/components` contains shared UI components.
- `src/App.tsx` uses React Router and lazy-loads heavy pages using `React.lazy` + `Suspense`.
- Protected routes use an `AuthProvider` and `ProtectedRoute` wrapper.

3:00-4:00 — State & Data Flow
- Auth and booking state live in React Context providers for simplicity and minimal boilerplate.
- Components call backend APIs via services (configured with `VITE_REACT_APP_API_URL`) and update contexts.

4:00-5:00 — Build & Deployment Considerations
- Build: `tsc -b` then `vite build` produces `dist/` for static hosting.
- Recommend CI that runs lint/tests, runs `npm run build`, and deploys to Netlify. Use `optimize-images` script as part of CI.

5:00-5:30 — Closing
- Summary of trade-offs and next improvements (caching layer, incremental SSR if needed).
