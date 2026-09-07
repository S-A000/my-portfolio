# Syed Abdullah Bin Masood — Portfolio

A production-ready, static portfolio for an AI/ML developer. The experience uses a cinematic browsing pattern with horizontal project rows, accessible project-detail dialogs, client-side search, verified links and locally stored artwork.

## Tech stack

- React and Vite
- JavaScript and modern CSS
- Framer Motion
- Lucide React
- Vitest and React Testing Library
- ESLint

No backend, database, environment variables or runtime GitHub API access is required.

## Setup

```bash
npm ci
npm run dev
```

Vite prints the local address after startup.

## Quality checks

```bash
npm run lint
npm test -- --run
npm run build
```

The production output is written to `dist/`.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Keep the detected build command as `npm run build`.
3. Keep the output directory as `dist`.
4. Deploy. No environment variables are needed.

`vercel.json` includes an SPA fallback so project query URLs continue to work after a direct reload.

## Updating content

- Edit project content and verified links in `src/data/projects.js`.
- Edit skill groups in `src/data/skills.js`.
- Edit professional experience in `src/data/experience.js`.
- Replace the downloadable CV at `public/cv/Syed-Abdullah-Bin-Masood-CV.pdf` while keeping the filename stable.
- Add or replace project artwork in `public/projects/`, then update the relevant `image`, `alt` and `gallery` entries in the project data.

## Accessibility and interaction

Cards support mouse, touch and keyboard activation. The project dialog closes by button, backdrop or Escape, traps focus while open and restores focus after closing. Motion is reduced when the operating system requests it. All external links open safely with `noopener noreferrer`.
