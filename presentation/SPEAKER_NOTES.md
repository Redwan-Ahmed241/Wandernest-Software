# Speaker Notes — Wandernest Architecture Presentation

Slide 1 - Title
- Quick greeting and what I'll cover: stack, architecture, routing, state, build & deploy (30s)

Slide 2 - Project Snapshot
- Mention React 19 + TypeScript choice for type-safety and modern features.
- Vite for fast dev cycles and smaller production bundles.

Slide 3 - Folder Layout
- Walk through `src/` and `public/` highlighting where to find pages, components, context providers, and assets.

Slide 4 - Routing & Lazy-loading
- Explain `src/App.tsx` routing setup. Show how `React.lazy` reduces initial payload and improves TTI.

Slide 5 - State Management
- Explain why React Context is used for auth and bookings (simplicity, scoped state). Mention trade-offs vs global stores.

Slide 6 - Build & Deployment
- Explain `npm run build` steps and Netlify deployment. Mention image optimization script and Tailwind purge.

Slide 7 - Diagram
- Walk the flow: browser -> static host -> API -> DB. Highlight where caching or SW could be introduced.

Slide 8 - Q&A
- Be ready to answer common questions (see Q&A file).
