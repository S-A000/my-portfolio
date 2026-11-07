# Focused visual polish

Completed in the existing checkout on 7 November 2026. Existing routes, copy, section order, brand palette, logo, and application interactions were retained. No Three.js scene or animation-logic file was edited.

## Changes

- Removed the homepage hero statistics strip from the component and rebalanced its spacing.
- Removed decorative serials from the industry cards, case-study preview labels, industry section labels, workflow captions, and industry selector. Removed the directory's seven-industry/four-service counter.
- Removed painted grid overlays from the hero, service surroundings, workflow diagrams, and case-study SVG previews. Preserved the illustrations themselves and the original 3D scenes, including their scene geometry.
- Replaced heavy panel outlines with quieter tonal surfaces, restrained separators, and broad light falloff. The sticky industry selector is opaque so underlying text cannot bleed through it.
- Slimmed service tabs to 56px desktop / 52px mobile, retaining icons, labels, keyboard behavior, and a short orange active accent.
- Reduced section spacing, preview-card padding, heading sizes, illustration preview height, and empty space. Body copy remains comfortably sized, with normal mobile wrapping and accessible controls.
- Compacted the industry selector and controlled long industry headings. Corrected active-section highlighting to follow the nearest visible section heading after the sizing changes.

## Factual content preserved

The 11,204 catalog source rows, 606 ordered model features, three supported cities, direct 24h/48h/72h horizons, 105,054 checked-in hourly rows, technology versions, project descriptions, and attribution were not changed. The 19-project archive count remains; only the explicitly requested homepage statistics strip was removed.

## Changed files in this task

- `src/components/Hero.jsx`
- `src/components/IndustriesSection.jsx`
- `src/components/CaseStudiesSection.jsx`
- `src/components/IndustryFlow.jsx`
- `src/pages/IndustriesPage.jsx`
- `src/styles/visual-polish.css` (new focused override sheet)
- `src/main.jsx` (loads the new stylesheet last)
- `public/case-studies/lobatse-pharmacy.svg`
- `public/case-studies/aqi-forecasting.svg`
- `scripts/generate-case-art.mjs` (keeps regenerated artwork free of the grid overlay)
- `tests/industries.test.jsx` (checks statistics/serial removal)
- `docs/visual-polish-verification.md`

## Verification

- Production build passed. The existing large JavaScript bundle warning remains.
- ESLint passed.
- All 25 existing/updated tests passed in 3 files.
- Static metadata verification passed for Industries and the three case-study routes.
- `git diff --check` passed.
- Rendered homepage and Industries views were checked at approximately 1440×900, 768×1024, and 390×844. No horizontal overflow was detected at these widths.
- Inspected the slimmer tabs, more compact cards, controlled headings, removed grids, borderless selector, and ordinary sticky-header clearance.
- Verified service selection by click and keyboard, the native mobile industry selector, active desktop selector state, pharmacy case-study navigation, and contact industry preselection.
- The original case-study WebGL renderers remained active. No scene logic was changed. No browser console errors were observed in the final check.
- Existing case-study tests continue to check both detail routes, attribution, fallback content, and stage controls. Existing tests also cover About, the project archive, four services, and contact validation.

## Before/after evidence

The supplied attachment contained the text brief, with no screenshot files available beside it. Before captures were taken from the actual current site before editing.

Review files are in `tmp/polish-qa/` (ignored by Git):

- `before-after.jpg`: five before/after pairs for the hero, services, industry cards, case-study cards, and industry selector.
- `before-home.jpg`, `before-services.jpg`, `before-industries.jpg`, `before-case-studies.jpg`, `before-selector.jpg`: original captures.
- `after-1440-*.jpg`, `after-768-*.jpg`, `after-390-*.jpg`: desktop, tablet, and mobile captures of the same sections.

The public Vercel deployment was not changed. The local development preview remains available at `http://localhost:5173/`.
