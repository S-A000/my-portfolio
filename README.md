# SAM Intelligence Group — Company Website

The official front-end for SAM Intelligence Group, working across Data Engineering, MLOps, Web Development & Custom Software, and AI Solutions.

The site uses the supplied SAM navy, teal, orange, and warm-white visual language. It includes the animated hero, four original service scenes, a seven-industry solutions directory, two complete case studies, a company About page, and the 19-project archive with accessible project-detail dialogs.

## Tech stack

- React 19 and Vite 7
- Framer Motion
- Lucide React
- Three.js, React Three Fiber, and Drei for system scenes
- Lightweight SVG workflow diagrams for industries
- Responsive CSS
- ESLint

No site database is required. The contact form submits directly to the Vercel Serverless Function at `/api/contact` using the Resend API (`RESEND_API_KEY`, documented in `.env.example`), clearly discloses that no form data is stored by the site, and provides a one-click clipboard & email fallback if delivery fails.

## Setup

```bash
pnpm install
pnpm dev
```

Vite prints the local preview address after startup.

## Routes

- `/` — home, services, Industries & Solutions, Selected Case Studies, approach, work, company preview, and contact
- `/industries` — seven industry workflows, prospective solutions, related project evidence, and contextual contact paths
- `/industries#<industry-id>` — a specific industry section
- `/case-studies` — case-study index
- `/case-studies/lobatse-pharmacy` — pharmacy commerce case study
- `/case-studies/aqi-forecasting` — AQI internship portfolio case study
- `/about` — company positioning, operating approach, and technical strengths
- `/projects` — complete filterable project library
- `/projects?project=<id>` — directly opens a specific project detail

`vercel.json` provides the SPA fallback required for direct navigation to these routes.

Industry CTAs use `/?industry=<industry-id>#contact`. The optional industry selection and suggested service remain editable, and the submitted project brief (plus fallback clipboard copy) includes the industry context.

## Quality checks

```bash
pnpm run lint
pnpm run build
pnpm test --run
node scripts/verify-case-build.mjs
```

The production output is written to `dist/`.

## Content architecture

Public company content is centralized in `src/data/agencyData.js`. Industry copy, service mappings, evidence links, and contact-context IDs live in `src/data/industriesData.js`. The portfolio inventory and maturity labels live in `src/data/projectsData.js`; case-study narratives live in `src/data/caseStudiesData.js`. The build emits route-specific static metadata for industries and case studies.

## Deployment

On Vercel, run `pnpm run build` and publish `dist/`.

## Accessibility

The experience includes skip navigation, semantic landmarks and heading structure, visible focus treatment, labelled controls, keyboard-operable service tabs and dialogs, focus trapping and restoration, and clear form validation. Animated systems pause when offscreen or when the document is hidden, while reduced-motion preferences switch the experience to stable static states.
