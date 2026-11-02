# SAM Intelligence Group — Enterprise Website

The official front-end for SAM Intelligence Group, a specialized enterprise software, artificial intelligence, MLOps, data engineering, and cybersecurity practice.

The experience is a responsive, accessible Vite/React site with a warm studio-glass interface, a procedural three-stage neural-field canvas, data-driven services, a unified filterable project library, a categorized infrastructure stack, founder leadership, and a transparent project-discovery email handoff.

## Tech stack

- React 19 and Vite 7
- JavaScript with JSDoc-typed agency data
- Framer Motion
- Lucide React
- Modern responsive CSS
- Vitest and React Testing Library
- ESLint

No backend, database, runtime API, or environment variables are required. The project-intake form prepares a prefilled message in the visitor's local email application and explicitly discloses that behavior.

## Setup

```bash
pnpm install
pnpm dev
```

Vite prints the local preview address after startup.

## Quality checks

```bash
pnpm run lint
pnpm test -- --run
pnpm run build
```

The production output is written to `dist/`.

## Content architecture

Public agency content is centralized in `src/data/agencyData.js`, while the preserved portfolio inventory lives in `src/data/projectsData.js`:

- Brand, contact channels, and navigation
- Trust metrics and engineering pillars
- Unified past-project narratives, gallery media, and verified links
- Technology groups
- Leadership profile
- Project-intake service options

UI sections consume this configuration directly, keeping content changes separate from layout logic.

## Deployment

`vercel.json` contains the SPA fallback required for direct navigation. On Vercel, use `pnpm run build` and publish `dist/`.

## Accessibility

The site includes skip navigation, semantic heading structure, visible focus treatment, explicit form labels, keyboard-accessible case-study filters and mobile navigation, text-backed operational indicators, reduced-motion support, forced-color fallbacks, and opaque fallbacks for browsers without backdrop blur.
