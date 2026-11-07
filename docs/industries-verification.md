# Industries & Solutions — implementation and verification

Completed in the current SAM Intelligence Group checkout on 7 November 2026. The preceding case-study work and its uncommitted changes were preserved. The public Vercel deployment was not changed.

## Experience and routes

- `/industries` — full seven-industry directory, introductory approach statement, responsive selector, industry workflows, prospective solutions, relevant services, related work, and contact paths.
- Homepage — three priority editorial cards immediately after Services and before Selected Case Studies.
- Desktop navigation, mobile menu, and footer — Industries appears between Services and Case Studies through the shared navigation data.
- `/?industry=<id>#contact` — existing local-email contact flow with an editable industry selection, suggested service, and context included in the draft subject/body.

In-page destinations:

| Industry | Anchor |
| --- | --- |
| Pharmacies & Healthcare Retail | `#pharmacies-healthcare-retail` |
| Retail & E-commerce | `#retail-ecommerce` |
| B2B Wholesale & Distribution | `#wholesale-distribution` |
| Manufacturing & Industrial Operations | `#manufacturing-industrial` |
| Logistics & Supply Chain | `#logistics-supply-chain` |
| Media, Research & Publishing | `#media-research-publishing` |
| Environmental Data & Smart Infrastructure | `#environmental-smart-infrastructure` |

Service links select the actual corresponding service in the existing homepage showcase, using `/?service=<service-id>#service-visualization`. All industry service IDs resolve to the existing four service definitions.

## Evidence and wording

Every industry presents prospective features under “What we can build.” Related work appears only when a real existing project is available.

- **Lobatse Pharmacy:** both pharmacy and general commerce sections link to the existing case study. The commerce section explicitly identifies it as the same project, rather than a second retail client. Existing verified catalog and architecture copy was preserved.
- **Industrial Print Proofing & Label Validation Suite:** inspected the existing archive entry and the local `D:/danial press/LabelFlowStudio` source, including WPF view models, import/validation services, proof layout/export code, and associated test files. This supports an implemented desktop application; no production deployment was established. The archive maturity label was narrowed from “Production Software” to **Desktop Application**, and the industry reference describes the implemented components without claiming deployment.
- **AI Research Brief Generation Engine:** the existing archive supports research-input processing and draft-brief generation. The label is now **Portfolio Project** and the copy explicitly describes draft briefs for human review. Additional editorial flags, review interfaces, and searchable reviewed archives remain proposed solutions. No automatic accuracy, publication, or client-deployment claim was added.
- **SmartPark-Vision:** the local `run_pipeline.py` prepares synthetic video and runs classical/YOLO detection; `benchmark.py` compares the detector outputs. The archive was narrowed to **Research Prototype**, and its summary, input workflow, and feature list now describe the synthetic-video research context.
- **AQI:** the industry reference links to the existing full case study. The required Syed Abdullah Bin Masood / 10Pearls internship attribution is retained and explicitly distinguished from a SAM client engagement.
- **Wholesale and logistics:** no related-work panel, invented client, or deployment proof. AI automation and MLOps are qualified by a reviewed use case and sufficient data/evaluation.

The 19-project inventory is preserved. No client testimonial, industry certification, clinical claim, compliance certification, prediction metric, revenue result, or efficiency percentage was invented.

## Design, motion, and contact behavior

- Uses the existing official SAM logo, typography, navy/teal/blue/orange/warm-white colors, and shared focus styling.
- Asymmetric desktop homepage showcase; tablet layout places pharmacy across the full width with wholesale/manufacturing below; mobile stacks the three cards.
- Full industry sections give the problem and proposed solution separate reading areas, with clear service and project links.
- Lightweight original SVG workflow diagrams provide animated connections. The industries page mounts **zero WebGL canvases**. Intersection and document-visibility state pause the CSS signal animation offscreen or while hidden. Reduced-motion CSS disables that animation; the existing motion preference hook suppresses the section-entry treatment.
- All meaningful content and diagram captions remain HTML. Selectors are native links/select controls. Industry anchors clear the fixed header and sticky directory.
- Long mobile CTAs wrap at a readable size and retain their tap area; the environmental CTA measured approximately 302 × 64 px in the 390px browser check.
- Contact industry IDs are validated against the shared data. Unknown values are ignored. Industry and service remain editable, and the normal required fields and 40-character project-context validation remain intact.
- The contact action still prepares a local `mailto:` draft. No server submission or message sending was added, and no email was sent during verification.

## Checks

| Check | Result |
| --- | --- |
| `pnpm build` | Passed after the final responsive/CTA adjustments |
| `pnpm lint` | Passed |
| `pnpm test --run` | 25 tests passed in 3 files, including 12 new industry/contact tests |
| `node scripts/verify-case-build.mjs` | Static route metadata and social images verified for Industries and all 3 case-study routes |
| `git diff --check` | Passed |
| Type checking | No separate type-check script is configured in this JavaScript repository |

The build retains the existing large-bundle warning (approximately 1.72 MB / 503 KB gzip). Three.js dependency deprecation notices and the reduced-motion notice appear in the test output; checks still pass.

The production build was served locally on port 4173. `/industries` loaded directly and after refresh. Its built HTML includes a specific title/description, canonical URL, PNG social image, and social title/description tags. The explicit Vercel rewrite routes `/industries` to that built document before the existing SPA fallback. A public deployment was not performed or claimed to have been verified.

## Rendered verification

Inspected the homepage and Industries page at approximately **1440 × 900**, **768 × 1024**, and **390 × 844**.

- Verified navigation order, mobile menu, shared footer link, homepage “Explore all industries,” and the pharmacy preview anchor.
- Confirmed all seven industry sections and their distinct problems/solutions. Wholesale/logistics have no false related-client proof.
- Tested desktop anchors and the compact tablet/mobile selector. Measured target section tops below the sticky directory; no heading was obscured by either navigation bar.
- Opened the industrial, SmartPark, and research-brief project dialogs; the correct titles and narrowed maturity labels rendered. Opened both pharmacy and AQI case-study links; AQI retained its internship attribution.
- Tested an existing Data Engineering service link and confirmed the matching service tab was selected.
- Tested desktop wholesale and production-mobile environmental contact paths; both carried the correct industry and suggested service. Automated tests cover context preservation for every industry and local draft generation without sending a message.
- Inspected vector data flow, section reveals, text wrapping, long CTAs, and evidence notes. The visibility check showed only the visible industry diagram active and the offscreen diagrams paused.
- No horizontal overflow, out-of-bounds industry content, broken loaded image, production console error, persistent overlap, or obvious severe animation stall was observed at the checked widths.

## Screenshots

Browser captures are saved locally under `tmp/industries-qa/` (ignored by Git):

- `home-desktop.jpg` — complete desktop homepage Industries section.
- `home-mobile.jpg` — complete mobile homepage Industries section; `home-mobile-viewport.jpg` is the normal-height viewport capture.
- `home-tablet.jpg` — revised tablet hierarchy.
- `industries-desktop.jpg`, `industries-tablet.jpg`, `industries-mobile.jpg` — directory hero/layout captures.
- `industry-workflow-desktop.jpg`, `pharmacy-mobile.jpg` — problem, workflow, solution, and related-work layout examples.
- `wholesale-desktop.jpg`, `manufacturing-tablet.jpg`, `logistics-mobile.jpg`, `environment-mobile.jpg` — scope/evidence checks.
- `navigation-mobile.jpg`, `contact-context-desktop.jpg` — mobile navigation and contact preselection.
- `screenshots-overview.jpg` — combined desktop/mobile review sheet.

These diagrams are original system illustrations; they are not fabricated customer screenshots.

## Files changed for this request

New:

- `src/pages/IndustriesPage.jsx`
- `src/components/IndustriesSection.jsx`
- `src/components/IndustryFlow.jsx`
- `src/data/industriesData.js`
- `src/styles/industries.css`
- `src/utils/contactBrief.js`
- `tests/industries.test.jsx`
- `scripts/generate-industries-art.mjs`
- `public/industries/social-preview.svg`
- `public/industries/social-preview.png`
- `docs/industries-verification.md`

Updated:

- `src/App.jsx`
- `src/main.jsx`
- `src/pages/HomePage.jsx`
- `src/components/ContactSection.jsx`
- `src/data/agencyData.js`
- `src/data/projectsData.js`
- `src/data/caseStudyMeta.js`
- `tests/caseStudies.test.jsx`
- `tests/setup.js`
- `scripts/verify-case-build.mjs`
- `vercel.json`
- `README.md`

Navbar and Footer already consume the shared navigation data, so they receive the new link without separate component edits.
