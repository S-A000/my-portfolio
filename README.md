# SAM Intelligence Group — Company Website

The official front-end for SAM Intelligence Group, a founder-led technology practice working across data engineering, MLOps, custom software, applied AI, and supporting cybersecurity research.

The site uses a dark, systems-led visual language derived from the supplied SAM references. It includes an animated but lightweight canvas hero, four original service scenes, a dedicated About page, and the complete 18-project archive with filters, direct links, and accessible project-detail dialogs.

## Tech stack

- React 19 and Vite 7
- Framer Motion
- Lucide React
- Native Canvas 2D for the hero field
- Responsive CSS
- ESLint

No backend, database, runtime API, or environment variables are required. The contact form prepares a prefilled message in the visitor's local email application and clearly discloses that no form data is stored by the site.

## Setup

```bash
pnpm install
pnpm dev
```

Vite prints the local preview address after startup.

## Routes

- `/` — home, service showcase, approach, selected work, founder preview, and contact
- `/about` — company positioning, founder profile, operating approach, and technical strengths
- `/projects` — complete filterable project library
- `/projects?project=<id>` — directly opens a specific project detail

`vercel.json` provides the SPA fallback required for direct navigation to these routes.

## Quality checks

```bash
pnpm run lint
pnpm run build
```

The production output is written to `dist/`.

## Content architecture

Public company content is centralized in `src/data/agencyData.js`. The preserved portfolio inventory, project maturity labels, gallery media, and verified source links live in `src/data/projectsData.js`.

## Deployment

On Vercel, run `pnpm run build` and publish `dist/`.

## Accessibility

The experience includes skip navigation, semantic landmarks and heading structure, visible focus treatment, labelled controls, keyboard-operable service tabs and dialogs, focus trapping and restoration, and clear form validation. Animated systems pause when offscreen or when the document is hidden, while reduced-motion preferences switch the experience to stable static states.
