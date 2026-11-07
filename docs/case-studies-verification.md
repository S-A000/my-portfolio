# Case studies implementation and verification

Implemented 7 November 2026 in the existing SAM Intelligence Group repository. The public Vercel deployment was not modified.

## Routes and integration

- `/case-studies`
- `/case-studies/lobatse-pharmacy`
- `/case-studies/aqi-forecasting`

Desktop, mobile, and footer navigation place Case Studies between Services and Work / Projects. The homepage features both studies immediately after Services. Lobatse appears once in the archive; AQI retains its original entry. All displayed project counts derive from the 19-record project data. Both project dialogs link to their case studies. Each study links to the other and the existing contact section.

The shared detail layout includes the hero, facts, challenge, engineering decisions, architecture, interactive walkthrough, delivery, outcomes, colored technology marks, gallery, attribution, related study, and contact CTA. The four services and existing About/contact implementations remain in place.

## Source evidence and copy corrections

The repositories were read without running their applications, accessing live pharmacy data, or contacting AWS services.

### Lobatse Pharmacy

Evidence reviewed in `D:/lobatse Phar/PharmacyStore`:

- `README.md`, `Directory.Build.props`, and `src/PharmacyStore.Web/PharmacyStore.Web.csproj`: .NET 10, MVC, EF Core, PostgreSQL, customer workflows, roles, modular monolith, and inventory boundaries.
- `docs/architecture.md`, `docs/prescription-flow.md`, Shop and Checkout controllers: application boundaries, transaction/reservation handling, COD, and separate authorized prescription review.
- `src/PharmacyStore.Infrastructure/Files/S3ProductImageStorage.cs`, `S3PrescriptionFileStorage.cs`, and dependency injection: separate product-media/private-document handlers.
- `.github/workflows/cd.yml`: Linux/EC2 deployment workflow.
- `POLICY_IMPLEMENTATION_REPORT.md`: owner-confirmed EC2, RDS PostgreSQL, and S3 deployment context. The brief supplies the Ubuntu host detail. This is an architecture description, not a fresh live-infrastructure certification.
- `tools/PharmacyStore.CatalogImporter/README.md` and `catalog_import_report.csv`: batched import and report evidence.

**Correction:** the full catalog report contains 11,204 source rows: **11,180 CREATED, 19 UPDATED, and 5 SKIPPED**. Published copy therefore says **11,204 source rows processed**, rather than implying every row was imported or created. Catalog volume does not establish current sellable stock. No sales, conversion, revenue, or fulfillment claims were added.

The role is attributed to Syed Abdullah Bin Masood without inventing an agency team or contract. No approved public storefront screenshot was found in the supplied site assets or the inspected QA-image directories. Lobatse uses explicitly labeled original system illustrations, including its gallery. The 3D storefront screens are original illustrations, not fabricated screenshots.

### AQI forecasting

The final repository is `D:/10Pearls/aqi-forecasting-mlops`; the earlier `D:/aqi-forecasting` snapshot contains an obsolete architecture review and was not used to narrow the completed system to its old state.

- Final `README.md`: three cities, hourly BigQuery ingestion, chronological evaluation, train-fitted preprocessing, per-city failure isolation, direct horizons, MLflow lifecycle, FastAPI, Streamlit, and scheduled workflows.
- `reports/eda_timeseries/timeseries_stats.json`: `shape.rows = 105054`.
- `models/registry/24h_metadata.json`, `48h_metadata.json`, and `72h_metadata.json`: **606 ordered feature names in each horizon**.
- Existing site AQI project data and eight real gallery assets: city dashboards, API documentation, experiments, local contributions, hourly/daily workflow captures.

The legacy `shap-summary.webp` filename is retained, but its caption correctly identifies the captured view as local contributions from the 24-hour linear model, not a SHAP explanation. The scheduled architecture uses BigQuery directly; Feast is not inserted into that path. No accuracy, uptime, reliability, or public-health-impact figure was invented.

The required attribution appears near the top and in the role section: **Designed and developed by Syed Abdullah Bin Masood during an AI/ML and MLOps internship at 10Pearls.** The page explicitly distinguishes this individual portfolio work from a SAM client engagement.

## Three.js implementation

Both stories use actual React Three Fiber / Three.js geometry, canvas-textured original interfaces, shared SAM material/color tokens, moving data particles, group assembly, and stage-specific camera travel. The normal page scroll remains available; there is no pinned scrolling timeline or wheel interception that cancels native scrolling.

- Lobatse: 18 representative product tiles assemble, connect to detailed storefront/product/basket screens, reflow into desktop/tablet/phone layouts, separate commerce and private-review paths, and pull back to the application/data/media/operations architecture.
- AQI: three labeled abstract city nodes feed observation streams, ingestion/validation/storage, a representative feature lattice and chronological partitions, candidate evaluation/MLflow/artifacts, then API/dashboard/direct horizons and the complete chain.
- HTML stage explanations, tab controls, active indicators, previous/next, replay/pause, arrow keys, Home, and End.
- Reduced motion uses still stages and a reset control. `?motion=reduce` is also available for deterministic verification.
- `?renderer=fallback` exercises the same explanatory HTML with a useful original system illustration. Natural WebGL failure/context loss also falls back through the existing canvas wrapper.
- DPR is capped at 1.5 with adaptive quality; object counts are bounded. New canvases use a zero-margin intersection observer, pause the continuous frame loop offscreen or when the document is hidden, and render on demand in reduced-motion mode.
- Generated textures are explicitly disposed, and R3F owns geometry/material teardown. A still illustration covers renderer startup.

## Checks and visual verification

Final application checks:

| Check | Result |
| --- | --- |
| `pnpm build` | Passed |
| `pnpm lint` | Passed |
| `pnpm test --run` | Passed: 13 tests in 2 files |
| `node scripts/verify-case-build.mjs` | Passed for all 3 routes |
| Type checking | No separate TypeScript/type-check script is configured in this JavaScript repository |

Vite reports a large JavaScript chunk warning (approximately 1.70 MB / 495 KB gzip). Dependency deprecation notices for Three.js and a reduced-motion notice appear in the test environment. These are warnings, not failing checks. No production page console errors were observed.

The production output was served locally on port 4173. All three new paths were opened directly and reloaded successfully. The three built HTML documents contain specific static title, description, canonical URL, and PNG social metadata so preview crawlers do not need to execute React. Explicit Vercel rewrites target those documents before the existing SPA fallback. A new public Vercel deployment was not performed or claimed to have been tested.

Browser QA covered approximately 1440 × 900 desktop and 390 × 844 mobile:

- Both complete WebGL stories replayed through all five stages. Sample logs recorded stages 1–5 with `renderer: webgl` throughout.
- Storefront/product/basket and genuine responsive layout changes, separated COD/private-review paths, pharmacy architecture, city streams, storage, features/time partitions, lifecycle, and direct horizons were visually inspected.
- Step selection, replay, pause, keyboard selection, ordinary scrolling, reduced motion, and the no-WebGL fallback were checked. Reduced-motion accessibility and all-stage keyboard behavior are also exercised by the tests.
- Mobile navigation opened Case Studies; homepage cards opened both correct detail routes. The project archive showed 19 projects, and the AQI dialog linked to the full study.
- All four original service scene tabs were selected and rendered; About and the existing contact validation/handoff were retained and checked by the existing tests. No email was sent.
- The gallery and long-form layout were inspected. Checks found no horizontal overflow or broken loaded images at the tested widths. No persistent blank scene, overlap with surrounding copy, or obvious severe animation stall was observed.

## Screenshots and motion evidence

Local review artifacts are in `tmp/qa/` (ignored by Git). These are browser captures, not invented product screenshots.

- `home-desktop.jpg`, `home-mobile-full.jpg`: complete homepage case-study section at desktop/mobile widths.
- `lobatse-desktop.jpg`, `lobatse-mobile.jpg`: pharmacy page hero/layout.
- `aqi-desktop.jpg`, `aqi-mobile.jpg`: AQI page hero/layout.
- `lobatse-operations-desktop.jpg`, `lobatse-architecture-desktop.jpg`, `lobatse-walkthrough-mobile.jpg`: pharmacy system views.
- `aqi-walkthrough-desktop.jpg`, `aqi-walkthrough-mobile.jpg`, `aqi-gallery-desktop.jpg`: AQI system and real gallery views.
- `reduced-motion-mobile.jpg`, `fallback-mobile.jpg`: accessible alternatives.
- `lobatse-walkthrough.mp4`, `aqi-walkthrough.mp4`: **21-second browser-sampled recordings at 5 fps**, each containing every live WebGL stage. These are review evidence and are not used as site animations.
- `lobatse-motion-log.json`, `aqi-motion-log.json`: stage/renderer samples corresponding to those captures.
- `screenshots-overview.jpg`: six-panel desktop/mobile review sheet.

## Changed files

New application files:

- `src/components/CaseStudyWalkthrough.jsx`
- `src/data/caseStudiesData.js`
- `src/data/caseStudyMeta.js`
- `src/pages/CaseStudiesPage.jsx`
- `src/pages/CaseStudyPage.jsx`
- `src/styles/case-studies.css`
- `src/three/CaseStudyScene.jsx`
- `tests/caseStudies.test.jsx`

Updated application/integration files:

- `src/App.jsx`
- `src/main.jsx`
- `src/components/CaseStudiesSection.jsx`
- `src/components/Navbar.jsx`
- `src/components/ProjectLibrary.jsx`
- `src/components/SelectedWorkSection.jsx`
- `src/components/TechnologyBadge.jsx`
- `src/data/agencyData.js`
- `src/data/projectsData.js`
- `src/hooks/usePageMeta.js`
- `src/pages/HomePage.jsx`
- `src/pages/ProjectsPage.jsx`
- `src/three/SceneCanvas.jsx`
- `tests/portfolio.test.jsx`
- `vite.config.js`
- `vercel.json`
- `README.md`

New build/assets/documentation files:

- `scripts/caseStudySeo.js`
- `scripts/generate-case-art.mjs`
- `scripts/verify-case-build.mjs`
- `public/case-studies/lobatse-pharmacy.svg`
- `public/case-studies/aqi-forecasting.svg`
- `public/case-studies/social-index.svg` and `.png`
- `public/case-studies/social-lobatse-pharmacy.svg` and `.png`
- `public/case-studies/social-aqi-forecasting.svg` and `.png`
- `docs/case-studies-verification.md`
