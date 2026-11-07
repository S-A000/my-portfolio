# SAM Intelligence Group — implemented website design

Recorded **7 November 2026**, from the working repository and the running preview at `http://localhost:5173`. This is a description of the current implementation, including existing inconsistencies. It is not a proposal or a record of every earlier request.

## 1. Scope, evidence, and implementation boundaries

The source of truth is the mounted component tree in [App.jsx](../src/App.jsx), its data, and the final CSS cascade. The screenshot set records the real localhost rendering. Website source, runtime assets, and configuration were not edited for this document.

CSS loads in this order in [main.jsx](../src/main.jsx):

1. [global.css](../src/styles/global.css)
2. [service-showcase.css](../src/styles/service-showcase.css)
3. [corrections.css](../src/styles/corrections.css)
4. [case-studies.css](../src/styles/case-studies.css)
5. [industries.css](../src/styles/industries.css)
6. [visual-polish.css](../src/styles/visual-polish.css)

The last sheet changes scale, spacing, surfaces, and borders. Earlier declarations such as a 100px service tab or a rectangular service frame are therefore not the current design. Media rules in earlier files can also be overridden by later, unconditional rules. Values below account for this cascade; follow the linked selector definitions for properties not repeated here.

**Verification language:** “browser verified” means observed in this localhost session. “Source specified” means implemented code was inspected, without claiming every hardware, assistive-technology, or operating-system path was exercised. Metrics and project maturity labels describe the website's current copy; this documentation does not independently audit the underlying client systems.

**Not implemented:** separate service-detail pages; a standalone `/contact` page; standalone `/projects/<id>` detail routes; an industry Three.js scene; a server contact-submission endpoint. Contact is a homepage section. Project details are query-addressable dialogs. Industry diagrams are animated SVG. Unmatched paths display the site's 404 content.

## 2. Design overview and information architecture

### Purpose and audience

SAM presents an engineering company offering data engineering, MLOps, custom software, and applied AI. The primary audience is an organization evaluating a technical partner: operators, founders, product owners, and technical decision makers who need to understand workflows, delivery boundaries, and evidence of previous work.

The visual personality is technical, deliberate, and evidence led. Dark navy surfaces, teal connections, orange actions, large compact headings, and system diagrams connect the engineering practices. Warm white sections distinguish selected project evidence and the About proof list. Copy distinguishes implemented work, research, prototypes, proposed industry solutions, and internship portfolio experience.

Current visual principles are visible in the implementation: prominent outcomes and operating constraints; restrained orange emphasis; diagrams supported by readable HTML; compact homepage previews leading to detailed pages; broad atmospheric gradients; and reduced framing in recently polished sections. The archive, contact form, and detailed case studies retain stronger rectangular framing.

### Page hierarchy and actual destinations

| Destination | Implemented view | Primary content and hierarchy |
|---|---|---|
| `/` | [HomePage](../src/pages/HomePage.jsx) | Hero → four services → three industry previews → two case-study previews → five delivery stages → four selected projects → company preview → contact |
| `/industries` | [IndustriesPage](../src/pages/IndustriesPage.jsx) | Hero and overview SVG → process statement → sticky industry directory → seven industry sections → closing contact CTA |
| `/case-studies` | [CaseStudiesPage](../src/pages/CaseStudiesPage.jsx) | Editorial hero → two case-study cards → project conversation CTA |
| `/case-studies/lobatse-pharmacy` | [CaseStudyPage](../src/pages/CaseStudyPage.jsx) | Pharmacy narrative, facts, 3D walkthrough, delivery, outcome, technology, illustration, attribution, related case and contact |
| `/case-studies/aqi-forecasting` | Same template, AQI data | Forecasting narrative, prominent internship attribution, facts, 3D walkthrough, delivery, outcome, technology, eight-image gallery, attribution, related case and contact |
| `/projects` | [ProjectsPage](../src/pages/ProjectsPage.jsx) | Shared inner-page hero → filterable 19-project archive → closing CTA |
| `/projects?project=<id>` | [ProjectLibrary](../src/components/ProjectLibrary.jsx) dialog | Archive beneath a modal containing the selected project's media, summary, evidence, stack, and optional gallery |
| `/about` | [CompanyAboutPage](../src/pages/CompanyAboutPage.jsx) | Company hero → four service cards → delivery stages → three technology groups → proof list → closing CTA |
| Any other path | `NotFoundPage` in [App](../src/App.jsx) | “This page is outside the system.”; Go home and View projects buttons |

Every view shares a fixed header, `<main id="main-content">`, and footer. Routing reads `window.location.pathname` and removes trailing slashes; it is not React Router navigation. Normal page links load their destination. Query/hash behavior is implemented separately by the relevant component.

## 3. Design system

### Exact CSS tokens

These are the complete named root colour tokens in [global.css](../src/styles/global.css). Alpha tokens retain their exact CSS values; their base RGB hex is supplied separately rather than representing them as opaque colours.

| Token | Exact value | Role |
|---|---|---|
| `--ink` | `#061018` | Main dark background |
| `--ink-deep` | `#030a0f` | Deep surfaces |
| `--navy` | `#081824` | Navigation and panels |
| `--navy-soft` | `#0c2230` | Secondary navy |
| `--teal` | `#0d5263` | Atmospheric teal |
| `--cyan` | `#27d2e4` | Eyebrows, icons, focus accents |
| `--blue` | `#1479b8` | Secondary blue |
| `--orange` | `#ff6b1a` | Primary action and active markers |
| `--orange-soft` | `#ff9b56` | Outcomes and contextual accents |
| `--warm-white` | `#f5f0e8` | Primary text; evidence-section background |
| `--muted` | `#9db0ba` | Secondary copy |
| `--line` | `rgba(168, 210, 222, 0.16)`; base `#a8d2de`, 16% alpha | Quiet dividers |
| `--line-strong` | `rgba(168, 210, 222, 0.3)`; base `#a8d2de`, 30% alpha | Framed UI |

There is no unified semantic-token layer for every component. Important additional literal colours and backgrounds are:

| Surface or text | Exact implementation |
|---|---|
| Site shell | `radial-gradient(ellipse at 95% 8%, #0b2530 0, transparent 42rem), radial-gradient(ellipse at 0 55%, #0a202b 0, transparent 60rem), #061018` |
| Header after 16px scroll | `rgba(3,10,15,.84)`; `backdrop-filter: blur(18px) saturate(130%)` |
| Closed/open mobile-menu surface | `rgba(3,10,15,.98)` |
| Primary button text / hover fill | `#150b06` / `#ff8442` |
| Homepage industry cards | `linear-gradient(140deg,#102b36b3,#091c274d)` |
| Industry solution panel | `linear-gradient(135deg,#102a3580,#0b1e292b)` |
| Industry directory | `#081923`; select bottom border `#52717d` |
| Selected-work section | `#f5f0e8` background; `#0b1823` text; card `#fffdf8`; secondary text `#52616a`; action `#c44c0e` |
| Archive card | `#091923`; media `#07131b`; summary `#8fa5af` |
| Project dialog | `#07141d`; backdrop `rgba(1,5,8,.86)` with 14px blur |
| Contact form | `rgba(8,24,36,.72)`; inputs `rgba(2,10,15,.62)` |
| Footer | `#02070b`; descriptive copy `#78909b` |
| About technology section | `#0b202c` |
| Shared About/Projects hero | `radial-gradient(circle at 78% 30%,rgba(13,82,99,.32),transparent 32rem), linear-gradient(140deg,#030a0f,#081824 66%,#07141d)` |

SVG illustrations, technology marks, and Three.js scenes have their own literal palettes. They should not be recoloured by assuming the root orange or cyan is their only source. Scene tokens are specified in section 5; the SVG paths and fills live in the linked assets/components.

### Typography

[index.html](../index.html) requests Google Fonts **Inter 400/500/600/700/800** and **Poppins 600/700**, with `display=swap`. Body/UI stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Headings `h1/h2/h3`: `Poppins, Inter, ui-sans-serif, system-ui, sans-serif`. Numbered process labels and some small interface labels use `"Courier New", monospace`; inline industry SVG labels use Arial.

Root `font-synthesis: none`; body is 16px, normal weight 400, line-height 1.6. Headings default to line-height 1.04 and tracking `-.045em`. Heading weight is browser bold (normally 700) unless a selector overrides it, notably 600 on hero/page-hero headings. CSS also requests weights 650, 750, and 760 on some UI. The font request does not explicitly load those as separate weights; font matching depends on the delivered font and browser. There is no single global h1–h6 size token scale. Values are component specific.

| Use / selector | Current size | Additional specification |
|---|---|---|
| Homepage `.hero h1` | `clamp(48px,6.3vw,88px)`; ≤640px: 48px | Weight 600; tracking `-.07em`; line-height .93, ≤640px .95; orange block `<em>`; actual copy width also constrained by `.hero__copy` |
| Hero description | `clamp(1.02rem,1.5vw,1.24rem)`; ≤640px `.98rem` | `#b9c7ce`, line-height 1.75 |
| General `.section-intro h2` | `clamp(2.5rem,5.2vw,5.25rem)` | Up to 850px wide |
| Home services/industries/cases section headings | `clamp(30px,3.5vw,48px)` | Line-height 1.15; override the general section-intro scale |
| Service detail `h3` | `clamp(27px,2.8vw,38px)`; ≤640px: 28px | Line-height 1.16 |
| Home featured industry `h3` | `clamp(28px,2.7vw,38px)` | 31px at 641–900px; 28px ≤640px |
| Other home industry `h3` | 25px | 24px at 641–900px; 28px ≤640px |
| Editorial case-card `h3` | `clamp(25px,2.2vw,31px)` | Line-height 1.16 |
| Industries page `h1` | `clamp(36px,4.6vw,64px)` | Line-height 1.09; ≤640px 36px/1.15 |
| Industry section `h2` | `clamp(29px,2.8vw,39px)` | ≤640px 29px |
| Case index `h1` | `clamp(55px,7.5vw,112px)` | Line-height 1.05; retains this clamp on mobile |
| Case detail `h1` | `clamp(39px,5vw,72px)` | Line-height 1.09; ≤760px 39px/1.13 |
| Case chapter `h2` | `clamp(30px,3vw,43px)` | Line-height 1.18; ≤760px 30px |
| Case prose | 16px/1.85 | ≤760px 15px; summary 17px/1.85 → 15px/1.9 |
| About/Projects `.page-hero h1` | `clamp(4rem,7.2vw,7rem)` | Weight 600; ≤640px `clamp(3.25rem,15vw,5rem)` |
| Process step `h3` / body | `1.35rem` / `.9rem` | Body line-height 1.7 |
| Selected-work `h3` | `clamp(1.45rem,2.5vw,2.35rem)` | Dark text on warm white |
| Company-preview `h2` | No font-size override: observed **24px** at 768px viewport | Browser h2 default; `max-width:14ch`; unlike `.section-intro h2` |
| Contact `h2` | `clamp(2.8rem,5.2vw,5.3rem)` | No smaller mobile override; observed 44.8px at 768px viewport |
| Archive card `h2` / summary | `1.55rem` / `.85rem` | Summary line-height 1.65 |
| Dialog `h2` | `clamp(2.2rem,4.5vw,4.5rem)` | Body `.84rem`, line-height 1.7 |
| Eyebrow | `.72rem`, 800, `.16em` tracking | Uppercase, line-height 1.4; 24×2px orange rule and 11px gap |
| Technology badge | `.8rem`, 650 | Compact `.72rem`; baseline line-height 1; mobile normal `.72rem` |

Conversions from rem assume the normal 16px browser root. Browser font availability, user text sizing, and font rasterization can change the rendered result without changing these declarations.

### Geometry, spacing, decoration

| Item | Exact implemented rules |
|---|---|
| Box model and overflow | Universal `border-box`; body min-width 320px and `overflow-x:hidden`; main `overflow:clip` |
| Shell | `min(1240px,calc(100vw - 64px))`; ≤1120px `min(100% - 40px,1240px)`; ≤640px `calc(100% - 32px)`; centered |
| Header | 82px high, fixed, z-index 100; ≤640px 72px |
| Anchor offset | HTML `scroll-padding-top:calc(var(--header-height) + 24px)`; smooth scrolling unless reduced motion; some sections add their own scroll margins |
| General section | `padding-block:clamp(96px,10vw,156px)`; ≤640px 88px |
| Polished homepage services/industries/cases | 75px vertical padding; ≤640px 48px; heading bottom margin 36px → 28px, split gap 50px → 22px |
| General split intro | Columns `minmax(0,1.45fr) minmax(260px,.55fr)`; gap `clamp(36px,7vw,100px)`; margin below `clamp(48px,6vw,78px)` |
| Hero | Minimum `max(760px,100svh)` on desktop; 860px at ≤860px; 820px at ≤640px. Inner top `header + 30px`, bottom 65px; mobile top 110px/bottom 55px |
| Service panel | Minimum 570px; columns `minmax(0,1.35fr) minmax(320px,.8fr)`; visual minimum 500px; single column ≤1000px |
| Service visual edge | Host mask `linear-gradient(90deg,transparent,#000 4%,#000 94%,transparent)`; no outer frame, visual border, or frame shadow |
| Industry cards / panels | Preview radius 14px, padding 24px →22px mobile; solution radius 12px, padding 26px →22px 16px mobile; no outer borders |
| Case preview media | Radius 12px; aspect 2.15 →1.85 ≤640px; `object-fit:cover`; grid gap 28px, 30px ≤760px |
| Selected project media | Aspect 16/9; card border `rgba(8,24,36,.12)`; 20px grid gap; square corners |
| Archive | Three columns, 22px gap; card media 16/10; body padding 26px and min-height 375px (340px ≤640px); square corners |
| Technology badges | Radius `.75rem`; padding `.48rem .78rem .48rem .58rem`; min-height 2.55rem; border `rgba(159,210,218,.16)`; inset highlight and `0 8px 28px rgba(0,0,0,.12)` shadow |
| Contact form | Strong-line border; square corners; `0 34px 90px rgba(0,0,0,.26)` shadow; grid gap 20px; content padding 32px 30px 20px |
| Dialog | Width `min(1120px,100%)`; max-height `calc(100vh - 60px)`; backdrop padding 30px; shadow `0 36px 110px rgba(0,0,0,.55)`; own vertical scrolling; z-index 160 |
| Primary action shadow | `0 18px 45px rgba(255,107,26,.19)` |
| Selected-work hover shadow | `0 22px 50px rgba(21,35,42,.12)` |
| Background patterns | Homepage hero grid removed by polish; shared About/Projects hero still has a 70px CSS grid; archive placeholders use 32px grids; case scenes have a Three.js floor grid |

No universal 4px/8px spacing scale, radius scale, or shadow-token set is declared. Values above are current component choices, not an inferred global standard.

### Interactive component states

| Component | Rest / selected state | Hover, focus, disabled, validation, and interaction |
|---|---|---|
| Primary button | Orange, dark text; min-height 52px; padding 13px 20px; `.82rem`/800 uppercase, `.04em` tracking; 18px icons, 12px gap | Hover fill `#ff8442`, translateY(-2px); transitions 180ms. Keyboard focus uses global orange outline |
| Quiet/line button | Quiet: strong-line border and `rgba(8,24,36,.5)`; line: `rgba(245,240,232,.22)` border | Hover border/text cyan; same lift and focus rules |
| Text link | Warm white, weight 750; 10px gap,18px arrow | Hover arrow translateX(4px),180ms. Not every ordinary link has a separate hover colour |
| Main navigation | `#b5c3ca`; weight 750; 12px on desktop ≥1000px; current page warm white with orange 2px underline | Hover same text/underline; underline scale transition 180ms. On the overlay underline is removed; links are large rows with bottom dividers below 1000px. At 1000–1120px the later min 1000 rule keeps their text at 12px |
| Service tabs | Four columns; 56px min-height; padding 12px 10px;13px/760 labels; gap 12px | Hover/active `rgba(39,210,228,.04)` and warm white; selected 40×2px orange underline. Roving focus, Left/Right wrap, Home/End. Prev/next controls wrap around all four services |
| Industry directory | Active anchor has `aria-current="location"` and orange 2px bottom border | Anchors scroll to sections; mobile/tablet native select changes hash. Keyboard behavior is native select/link behavior |
| Editorial case card | Illustration, category, linked title, problem, solution, result, Read case study | Media hover scale 1.035 over .6s; reduced-motion CSS suppresses that transform; media/title/CTA are separate links |
| Selected-work card | Whole card is one named link; status badge and category/title/action | Hover border `#e7611d`, lift 4px, shadow; image scale 1.03 and saturation.75→1 |
| Archive filter | `.7rem`/750; border line, padding 8px 12px, muted text | Hover/active orange border, `rgba(255,107,26,.1)` fill, warm-white text; `aria-pressed` identifies current filter |
| Archive card | Border line; first four technology badges; View details button | Image saturation.72→1 and scale 1.025; Framer layout/entry/exit transitions. View details opens modal; no whole-card navigation |
| Case stage tabs | Five equal columns; selected orange marker and warm-white copy | Roving Left/Right wrap, Home/End; associated tabpanel. Previous/Next disabled at first/last stage, opacity.3 and default cursor; playback buttons use `#0e2633`, line border,11px labels and 40px minimum height; Replay/Pause described below |
| Contact fields | Labels wrap controls; border line; padding 14px 15px; square corners; warm-white input text | Focus border cyan and background `rgba(5,20,29,.85)`; local outline reset, so field focus is conveyed by border/background. Native required/type/min-length validity; custom trimmed-name and scope messages |
| Dialog | `role="dialog"`, `aria-modal`, labelled title; close control 44×44px | Escape, close button, or backdrop dismisses; Tab focus loop; body scroll lock; trigger focus restored for card-opened dialogs. Entry/exit motion respects OS reduced motion |

No dedicated loading/disabled state exists for the email action. No inline field-by-field custom error component is implemented; invalid forms use browser validation. Do not invent success, delivery, or server-error screens.

### Logo inventory and actual use

| Asset | Current role | Rules visible in implementation |
|---|---|---|
| [SAM_Full_Transparent_Cropped.png](../SAM_Full_Transparent_Cropped.png) | Imported by Navbar, Footer, Hero, ContactSection, CompanyPreview, CompanyAboutPage | Full transparent mark on dark backgrounds; preserve intrinsic proportions with `object-fit:contain`; text lockups repeat the company name |
| [public/sam-logo-full.png](../public/sam-logo-full.png) | Industries closing CTA and case-detail closing CTA | Full mark; meaningful `alt="SAM Intelligence Group"` where displayed independently |
| [SAM_Profile_1080_Black.png](../SAM_Profile_1080_Black.png), [public/sam-logo-profile.png](../public/sam-logo-profile.png) | Available profile variants; not referenced by mounted page components | No current in-page placement rule implemented |
| [SAM_White_Background.png](../SAM_White_Background.png), [public/sam-logo-white.png](../public/sam-logo-white.png) | Available white-background variants; not referenced by mounted page components | No implemented automatic light-background swap |
| [favicon.png](../public/favicon.png), [favicon.svg](../public/favicon.svg) | PNG selected by index.html; SVG also available | Browser identity asset; not a substitute for the page lockup |

Navbar image:58×44px, mobile ≤640px width 49px; adjacent name 800, desktop `.8rem` after navigation adjustment. Footer image 150×96px aligned left. Shared small lockup image 3.75rem×2.62rem, drop-shadow `0 0 16px rgba(39,205,201,.18)`; Hero ≤760px 3rem×2.15rem. Company-preview image `min(65%,14rem)` with automatic height. Images inside already-labelled home links or adjacent text lockups use empty alt to avoid repetition. There is **no verified formal brand guide** for exclusion zones, minimum reproduction size, print colours, or acceptable logo modifications in this implementation.

## 4. Pages and sections in detail

### Homepage and hero

[Hero.jsx](../src/components/Hero.jsx) renders the company lockup, cyan eyebrow, single h1 “Build the systems behind the next decision.”, summary, Explore services (`#services`), Discuss a project (`#contact`), and three icon-led focus labels. The orange phrase occupies a block line. Text sits above a darkened full-area Three.js background, with the formation biased right on wide screens. A vertical Explore the system link points to services and is hidden at ≤860px. There is no rendered hero statistics/proof strip; the old `heroProof` data export is not used by Hero.

The copy container has max-width 820px, expanding to 780px at ≤1120px and 700px at ≤860px through existing media declarations. The h1's 950px max-width does not override its parent's available width. Actions become one column at ≤640px. The actual intro is documented in section 5; the copy starts partially visible rather than being completely absent while WebGL loads.

### Four Services

[ServiceShowcase.jsx](../src/components/ServiceShowcase.jsx) is the mounted service experience. An introductory split heading leads to a four-tab strip, one canvas, a changing explanatory panel, and previous/current/next controls. There is no fifth cybersecurity practice and no separate service route. Each panel follows h3 → executive summary → Engineering focus → four checked deliverables → technology badges. Exact copy is in [agencyData.js](../src/data/agencyData.js).

| Tab / service id | Focus and deliverables | Stack shown |
|---|---|---|
| Data Engineering / `data-engineering` | Ingestion/validation, transformations, storage/query architecture, reporting outputs | Python, SQL Server, PostgreSQL, BigQuery, SSIS, Docker |
| MLOps / `mlops` | Reproducible training, experiment/model tracking, serving APIs, monitoring/iteration | MLflow, Feast, FastAPI, PyTorch, GitHub Actions, Docker |
| Web & Software / `web-software` | Responsive applications, FastAPI/.NET backends, C#/WPF tools, API/database integration | React, JavaScript, Python, FastAPI, C#, .NET, WPF, SQL Server |
| AI Solutions / `ai-solutions` | Workflow architecture, computer vision, local-first automation, human-reviewed outputs | PyTorch, OpenCV, YOLO, LangChain, Ollama, FastAPI |

`/?service=<id>#service-visualization` selects the tab on initial load and scrolls to the visual. Plain tab clicks change local state without updating the URL. HTML stage labels remain separate from the canvas. Copy transitions wait for the outgoing panel: opacity/x 24 entrance and x−18 exit, .38s; stage-label fades .32s. Controls have 44px minimum dimensions. Earlier serial/status/security decorations are not rendered in the current component.

### Industry previews and `/industries`

[IndustriesSection.jsx](../src/components/IndustriesSection.jsx) shows exactly three previews: Pharmacies & Healthcare Retail, B 2B Wholesale & Distribution, and Manufacturing & Industrial Operations. The left pharmacy card spans two rows on desktop; the two smaller cards sit right, with problem and diagram side by side. Each includes Workflow focus, linked h3, operating problem, SVG, “What we can build” copy, and a specific `/industries#<id>` link. The section-wide CTA is Explore all industries.

The full page starts with “Technology built around how your business actually operates.”, an explanatory paragraph, Discuss your workflow (`/#contact`), Explore industries (`#industry-directory`), and an overview SVG. A process-first statement precedes the sticky directory. Every industry uses the same implemented hierarchy: industry name → h2 outcome → challenge paragraph and SVG on the left → relevant-service links → prospective solution list and industry-specific contact CTA on the right → related-work block only when data exists.

| Industry / fragment | Section h2 | Diagram captions | Relevant services | Contact CTA |
|---|---|---|---|---|
| Pharmacies & Healthcare Retail<br>`/industries#pharmacies-healthcare-retail` | A connected experience for customers and pharmacy teams. | Catalog → Storefront → Orders → Pharmacist review | Web & Software, Data Engineering | Discuss a pharmacy platform<br>`/?industry=pharmacies-healthcare-retail#contact` |
| Retail & E-commerce<br>`/industries#retail-ecommerce` | Commerce systems that keep the storefront and operations connected. | Product data → Discovery → Checkout → Operations | Web & Software, Data Engineering | Plan a commerce system<br>`/?industry=retail-ecommerce#contact` |
| B 2B Wholesale & Distribution<br>`/industries#wholesale-distribution` | Make the path from catalog to repeat order simpler. | Price lists → Account terms → Quotation → Repeat order | Web & Software, Data Engineering, AI Solutions | Discuss your wholesale workflow<br>`/?industry=wholesale-distribution#contact` |
| Manufacturing & Industrial Operations<br>`/industries#manufacturing-industrial` | Bring validation into the production workflow. | Order records → Validation → Proof → Operator review | Web & Software, Data Engineering | Map a production workflow<br>`/?industry=manufacturing-industrial#contact` |
| Logistics & Supply Chain<br>`/industries#logistics-supply-chain` | Turn operational events into useful visibility. | Order events → Integration → Exception queue → Operations view | Data Engineering, Web & Software, MLOps | Discuss operational visibility<br>`/?industry=logistics-supply-chain#contact` |
| Media, Research & Publishing<br>`/industries#media-research-publishing` | Move from scattered sources to reviewable intelligence. | Sources → Draft synthesis → Human verification → Reviewed brief | AI Solutions, Data Engineering, Web & Software | Discuss a research workflow<br>`/?industry=media-research-publishing#contact` |
| Environmental Data & Smart Infrastructure<br>`/industries#environmental-smart-infrastructure` | Turn continuous observations into decisions. | Observations → Data validation → Model evaluation → Forecast view | Data Engineering, MLOps, AI Solutions | Explore a data or forecasting project<br>`/?industry=environmental-smart-infrastructure#contact` |

The lists are explicitly **solutions SAM can build**, not seven claims of completed client engagements. Related work is qualified in the UI: Lobatse appears for both pharmacy and retail as the same project; industrial proofing is a desktop application without established production deployment; the research-brief engine is portfolio work with proposed editorial checks scoped separately; AQI is internship portfolio experience at 10Pearls; SmartPark is a synthetic-video research prototype. Wholesale and logistics do not display invented related projects.

Relevant-service links use `/?service=<id>#service-visualization`. Industry CTAs use `/?industry=<id>#contact`. The selected industry and its initial first relevant service are prefilled in the contact form. Changing the industry dropdown later does not automatically replace the user's service choice. The directory marks the section nearest 200px from the viewport top among observed sections; ≤900px it uses a labelled native select. Initial recognized industry hashes are explicitly scrolled into view by the page effect.

### Case Studies preview and index

[CaseStudiesSection.jsx](../src/components/CaseStudiesSection.jsx) is used on the homepage and index. It contains two editorial cards in a two-column grid. The artwork is original SVG illustration, not a product screenshot. Category → linked h3 → problem → solution → orange-soft result → Read case study is the content order. The home header says “Inside the systems we build.” and links to All case studies. The index version says “The work behind the outcome.” and omits that redundant link.

[CaseStudiesPage.jsx](../src/pages/CaseStudiesPage.jsx) adds “Good engineering. Made visible.” with an orange second line, supporting copy, a two-case count, and a final “What does your system need to solve?” contact CTA. No pagination, filters, third case, or archive search is implemented here.

### Lobatse and AQI detail pages

Both use [CaseStudyPage.jsx](../src/pages/CaseStudyPage.jsx), [caseStudiesData.js](../src/data/caseStudiesData.js), and [case-studies.css](../src/styles/case-studies.css).

| Section | Layout, content hierarchy, and interaction |
|---|---|
| Hero | Back to All case studies; category and case number; h1; summary/context/Explore the system link beside a framed live 3D illustration. Lobatse uses Storefront stage; AQI uses Forecasts stage. The hero does not cycle through stages automatically |
| Attribution | AQI adds a prominent Project context aside before quick facts; both repeat Role & attribution near the end |
| Quick facts | Semantic `dl`, three columns, top/bottom dividers; small uppercase terms and larger values |
| Challenge | Numbered chapter 01, label/h2 left, explanatory problem and solution right |
| Engineering decisions | Chapter 02; heading left, two-column set of numbered decisions right |
| Architecture | Chapter 03; prose and numbered HTML architecture chain; this list remains readable independently of WebGL |
| System walkthrough | “From inputs to everyday use.”; sticky canvas and five-stage controls beside five scroll chapters; normal page scroll selects stages; tabs and replay also work |
| Delivered work | Chapter 04; checked deliverables with h3 and explanation |
| Outcome | Two-column teal/navy gradient panel; orange-soft large metric, explanation and qualification. It reports source rows/data volume rather than an invented commercial growth metric |
| Technology | Chapter 05; wrapping branded/neutral technology badges |
| Gallery | AQI: eight real project captures, two-column grid, `object-fit:contain`, captions and links opening full images in a new tab. Lobatse: original illustration and explicit “not a product screenshot” caption |
| End navigation | Related other case on the left; SAM logo, “Bring your own constraints.” and contact CTA on the right |

| Case | Current copy and visual distinctions |
|---|---|
| Lobatse Pharmacy | h1 “Building a Pharmacy E-commerce Platform for an 11,000+ Product Catalog”; large-catalog commerce and pharmacy operations; **11,204 source rows processed**; ASP.NET Core, PostgreSQL/RDS, EC 2, S 3 and separate pharmacist/private prescription handling are explained. `E-commerce` is a no-wrap span. The visual separates cash-on-delivery order flow from private prescription review. No private records or supplied live storefront screenshots are displayed |
| Three-City AQI Forecasting Platform | h1 “From Hourly Environmental Data to Three-City AQI Forecasts”; Karachi/Lahore/Islamabad; **105,054 checked-in hourly rows**,606 ordered features, direct 24h/48h/72h horizons; ingestion → BigQuery → chronological features/evaluation → MLflow → FastAPI → Streamlit. Internship attribution identifies Syed Abdullah Bin Masood and 10Pearls; it is not presented as a SAM client engagement. The file `shap-summary.webp` is explicitly captioned as linear-model local contributions, not a SHAP explanation |

### Delivery approach, selected work, and company preview

[ApproachSection.jsx](../src/components/ApproachSection.jsx), shared by Home and About, contains a large split introduction and an ordered list of Discovery, Architecture, Build, Deployment, and Support & iteration. Step numbers are functional sequence labels and remain visible. Five desktop columns have dividers and a subtle cyan hover background; they become three, two, then one column at the breakpoints below. This is a CSS/HTML list, not another Three.js scene.

[SelectedWorkSection.jsx](../src/components/SelectedWorkSection.jsx) introduces a warm-white band and four whole-card links: AQI Forecasting, Industrial Print Proofing, DeepGuard, and SAM-EDA. Desktop uses a 12-column layout with spans 7/5 then 5/7. Artwork, maturity badge, category, h3, and Open project lead to `/projects?project=<id>`. Industrial proofing uses a decorative concentric-ring placeholder because its image is null. “Explore all 19 projects” leads to `/projects`.

[CompanyPreview.jsx](../src/components/CompanyPreview.jsx) returns to dark surfaces. A circular logo treatment sits left, copy sits right: eyebrow, “Connected engineering for systems that need to work in practice.”, company summary/detail, four checked service names, and How SAM delivers projects (`/about`). Borders enclose the panel vertically; concentric CSS rings rotate in opposite directions over 14s and 10s. At ≤760px it stacks. Its h2 currently retains the browser's 24px default, a difference from the large section-intro headings.

### Work / Projects archive and detail views

[ProjectsPage.jsx](../src/pages/ProjectsPage.jsx) has the framed/grid-backed shared inner-page hero, contact text link, archive, and final “Use the portfolio as evidence, not a one-size-fits-all package.” CTA. [ProjectLibrary.jsx](../src/components/ProjectLibrary.jsx) renders 19 projects and six filter buttons: All projects, AI & Computer Vision, MLOps & Data, Cybersecurity, Enterprise Software, Developer Tools.

Filtering matches configured terms against id/title/category/status/technology. There is **no text-search input**. Matching categories can overlap. The toolbar displays the current count. No dedicated empty-results component is rendered. Cards have media/status/index, category, h2, summary, first four stack badges, optional case-study/resource links, and View details.

Opening a card pushes `?project=<id>` into browser history. Closing removes the parameter with replacement; `popstate` observes query changes. An initial valid query opens the dialog directly; unknown project IDs leave the archive. Details contain problem, what was built, architecture/workflow, key features, contribution, outcomes, technology, optional resources, and optional gallery. Missing or failed archive images use an accessible ImageOff/initials placeholder. The modal is not a separate content route or a replacement page h1.

GitHub-labelled links and URLs containing `github.com` are intentionally filtered from rendered project resource links, even though source data retains them. The currently rendered non-GitHub resource is SAM-EDA's PyPI link. External destination availability was not tested; the local link destination and filtering implementation were checked.

### About Us

[CompanyAboutPage.jsx](../src/pages/CompanyAboutPage.jsx) is the current `/about` component. Its hero contains the official company lockup and h1 “Intelligence is useful when the system around it works.” beside summary/detail copy. Four two-column service cards show executive summaries, the first three deliverables, and first four technology badges. The shared Approach section follows. Technology in context groups badges into Data & MLOps, AI & vision, Software delivery. A warm-white proof strip currently resolves **three** project links: AQI, industrial proofing, and SAM-EDA. The configured fourth identifier `pinn-web-app` does not match the actual project id `pinn-app` and is filtered out. The page closes with a centered logo/constraint-led contact CTA.

No founder portrait/story section is mounted. `aboutUs.principles` exists in data but this page does not render it as a principles-card section. Legacy founder CSS/components are not evidence of a current founder layout.

### Contact

[ContactSection.jsx](../src/components/ContactSection.jsx) is `/#contact`, not a standalone contact page. On wide screens a sticky introductory column sits beside the framed form in `.82fr/1.18fr` columns, with gap `clamp(48px,8vw,110px)`. Intro: logo, eyebrow, h2 “Start with the system as it is today.”, operating-context paragraph, direct email, and explicit local-email/no-storage note. The decorative glow breathes over 7s.

Form order: Name; Company/organization; Work email; optional Industry/workflow; optional visible inquiry-context note; required Area of interest; required Project context; Open prepared email; fine print; live status message. Name and company require at least 2 characters; email uses native email validation; project context requires at least 40 characters, with extra trimmed-length checks for name/scope. Fields have appropriate name/organization/email autocomplete. Name/company share the first desktop row; the remaining controls span both columns. Mobile uses one column and narrower padding.

[contactBrief.js](../src/utils/contactBrief.js) constructs a URL-encoded `mailto:abinemasood814@gmail.com` draft with service/company/industry context and the entered details. Valid submission sets the polite status “Your brief is ready. Complete the handoff in the email application that opens next.” and opens the email handler. It does not store data, POST to a server, prove email delivery, or automatically send a message. The final handoff depends on the user's installed email application; sending was not exercised during documentation.

### Footer

[Footer.jsx](../src/components/Footer.jsx) uses a deep `#02070b` background with a top divider. Three desktop columns contain the logo/tagline, seven navigation links, and conversation/email. Below is the current year, company name, and Data · MLOps · Custom software · AI solutions. The email is a mailto link. At ≤860px the brand spans a row over two columns; ≤640px all columns and the bottom line stack. No social-network strip, newsletter, legal-policy routes, or additional footer destinations are implemented.

## 5. Animation and Three.js specification

### Mounted scenes versus unused implementations

The actual chain is Hero → IntelligenceCanvas → SceneCanvas → HeroFormationScene; ServiceShowcase → SceneCanvas → FoundationDemoScene → four custom service scenes; CaseStudyPage/CaseStudyWalkthrough → CaseStudyScene → SceneCanvas → World. IndustryFlow is SVG/CSS. Older [ServiceScene 3D.jsx](../src/components/ServiceScene3D.jsx), [NeuralField.jsx](../src/components/NeuralField.jsx), and legacy service/product/about sections are not mounted by the current pages. Their palettes, orbit scenes, and transitions must not be described as active behavior. No supplied reference MP 4 is a live hero/service video.

### Shared WebGL runtime and performance contract

Sources: [SceneCanvas.jsx](../src/three/SceneCanvas.jsx), [sceneRuntime.js](../src/three/sceneRuntime.js), [useSceneTransition.js](../src/three/useSceneTransition.js), [RestrainedBloom.jsx](../src/three/RestrainedBloom.jsx).

| Property | Source-specified behavior |
|---|---|
| Base camera | Perspective FOV 42°, position `[.5,.4,8.5]`, near.1, far 40; individual rigs subsequently position it |
| Renderer | sRGB output, ACES filmic tone mapping, exposure.98, opaque clear `#030b12` despite alpha-capable context, depth on, stencil off, high-performance preference |
| DPR / quality | Preferred device ratio clamped 1–1.5; low quality ratio 1; PerformanceMonitor declines/fallbacks to low, inclines to high, flipflops 3; AdaptiveDpr also mounted; high-quality antialiasing |
| Shadows / bloom | PCF shadow map high, Basic low. Bloom implemented by RenderPass + UnrealBloomPass; default strength .24/radius .28/threshold .86, composer ratio capped 1.5; effects disposed on unmount |
| Visibility | IntersectionObserver threshold .01, root margin 160px vertically for hero/services; case scenes explicitly use 0px. `document.visibilitychange` also gates runtime |
| Frame loop | `always` only while WebGL available, context healthy, in view, document visible, and motion allowed; otherwise `demand`. Rendering may still occur when state invalidates; “off-screen pause” is not a promise of zero CPU or unmounting |
| Reduced motion | OS preference or `?motion=reduce` makes SceneCanvas demand-render static state. OS preference additionally controls Framer/GSAP/CSS paths. The query is a scene/test override, not a global substitute for the OS preference |
| Capability/error fallback | Probe WebGL2 then WebGL; error boundary and context-lost state select supplied HTML fallback. Context listeners are installed/cleaned; context restoration path exists in source but real GPU context-loss recovery was not exercised |
| Resource behavior | Buffer geometry/material disposal in custom memoized effects; R 3F object cleanup; case CanvasTextures disposed; observers/listeners/timers cleaned. Service scenes remain mounted rather than being rebuilt for every click |

No hard FPS target, total triangle limit, or draw-call budget is declared. The limits that actually exist are DPR, quality-dependent particle/environment/shadow resolution, capped case-scene delta, and visibility/motion gating. Mobile width does not automatically force every canvas to low quality.

### Scene colours and common service materials

Exact [sceneTheme.js](../src/three/sceneTheme.js) values:

| Name | Hex | Name | Hex |
|---|---|---|---|
| background | `#030b12` | navy | `#061521` |
| deepNavy | `#082433` | panel | `#0c3444` |
| teal | `#25d2d8` | cyan | `#8cf3f4` |
| blue | `#3f91c7` | orange | `#ff762b` |
| warmWhite | `#f2eadf` | shadow | `#010609` |

Common physical-material presets, locally overridden where necessary: shell = deepNavy, metalness.72, roughness.24, clearcoat.72, clearcoatRoughness.22; panel = panel colour,.48/.30/.62/.28; ceramic = warmWhite,.08/.38/.42/.34. Wires, emissive accents, screen planes and particles also use basic/standard/shader materials; not every object uses a physical material.

### Hero formation

Source: [IntelligenceCanvas](../src/components/IntelligenceCanvas.jsx), [HeroFormationScene](../src/three/HeroFormationScene.jsx), [Hero](../src/components/Hero.jsx).

**Objects/materials:** a procedural particle network/abstract intelligence formation, filaments, network shell, and 44 instanced relay nodes. Particles and filaments use custom vertex/fragment shaders with seeded positions, target/exit attributes, turbulence and teal/blue/orange pulses. This is not an extruded raster logo. Point size is capped 8.5 in the shader. High quality uses 5,200 particles, or 2,600 when canvas aspect<.72; low quality 1,700. High filaments use 22 strands, aspect<.72 uses 12, with 42 segments; low 10 strands/28 segments. Geometry positions and shader formulas are defined directly in the source.

**Camera/layout:** aspect<.68 uses formation offset `[.1,-1.42]`, scale .76; aspect<1.05 `[.74,-.58]`, scale .86; otherwise `[1.72,.02]`, scale 1. Desktop camera travels `[5.3,2.25,13.4]` → `[.45,.34,9.25]`; portrait `[3.4,2.1,13.8]` → `[.05,.35,10.7]`. It includes an arcing lateral move and damped look-at. Camera math includes settled pointer offsets x×.08/y×.045, but the mounted `.hero__visual` has `pointer-events:none`; pointer-driven parallax was not verified as an operable interaction. No drag/orbit controls are exposed.

**Lighting:** ambient warmWhite.18; hemisphere `#85dfe9/#02070b` .45; cyan spotlight angle .38/penumbra .86/distance 24 sweeps horizontally, base intensity 18 plus an 88-intensity sine envelope; orange point rises 5→20; warm-white directional 1.1. High quality adds a 64-resolution Environment with cyan/warm-white Lightformers and bloom strength .31/radius .32/threshold .82. Fog 8.5–24.

**Intro/idle/scroll/exit:** time is measured from Hero mount. Formation smooths from .34s over 3.25s; camera from .42s over 4.15s. Copy reveal callback at 4.12s; Hero also reveals after 4.6s if the renderer never calls back. Copy opacity .78→1 over 900ms and translateY 10→0 over 1,100ms. Lighting sweep starts 3.72s, duration 1.45s. Settle starts 5.25s, duration 1.05s, then restrained turbulence, breathing, filaments, relay motion, and camera drift persist. ScrollTrigger maps hero top→bottom leaving the viewport into 0–1 progress; shader particles move toward exit positions while the group moves down/back, tilts and slightly shrinks. No pinned scroll or tab-change animation exists for this hero.

**Reduced/fallback/mobile:** reduced state uses elapsed 8, formation/camera/settle 1 and scroll 0, with static demand rendering. Hero's non-WebGL fallback is three CSS spans inside `.intelligence-canvas__fallback`; copy remains available through the timer/OS path. Mobile changes camera/layout and particle counts and darkens the text overlay; it does not remove the content. Actual no-GPU failure and OS setting changes were not reproduced; these are source-specified paths.

### Four service scenes: lifecycle, environment, and controls

[FoundationDemoScene.jsx](../src/three/FoundationDemoScene.jsx) shares a phase controller and mounts all four custom scenes. The older generic core/rings/panels group is scaled to.001 for the four recognized service keys; its presence in the file does not make it the visible service design.

Phase durations are INTRO.82s → ACTIVE.26s → IDLE. A new requested tab queues EXIT.48s of the current key, then the latest requested key enters. Cubic easing assembles/disassembles objects; additional choreography continues into idle time. “Intro duration” therefore does not mean the full explanatory sequence finishes in.82s. Lifecycle time is `progress*.9`, then `.9+progress*.25`, then `1.15+idleTime` for data; `.86`, `.86+progress*.28`, then `1.14+idleTime` for the other scenes. Reduced-motion semantic time is 10 (data) or 12 (others), showing the assembled wide view.

Shared [SceneEnvironment](../src/three/SceneEnvironment.jsx): background/fog `#030b12`8.5–18; ambient warmWhite.34; hemisphere `#bceff3/#02070b` .72; warm-white spot `[4.5,6.5,5.8]`, intensity 48, distance 18, angle .46, penumbra .72; teal spot `[-5.2,2.4,3.5]`, intensity 32, distance 15, angle .5, penumbra .82; orange point `[3.4,-.4,3.2]`, intensity 18/distance 10. High/low shadow maps 1024/512, environment 128/64, contact-shadow resolution 512/256. ContactShadows at y−1.56: opacity .46, scale 7.5, blur 2.7, far 5.2; continuous only while running high quality, otherwise one frame. High quality includes restrained bloom.

The environment supplies a responsive framing camera (sceneRadius 3.7), then the active custom rig performs its shot sequence. All four use the scene palette and common physical presets with local overrides. There are no user orbit, zoom, object-picking, or drag controls; service tabs and arrows are the intended interaction. Scroll only starts/pauses visibility and the homepage reveal; it does not scrub the service story. On exit the scene disperses/scales and camera pulls back. The HTML fallback shows decorative orbit/core spans and “3D preview unavailable”; the tab text and service copy remain available.

| Scene/source | Actual objects and narrative | Idle/choreography and quality |
|---|---|---|
| [DataEngineeringScene](../src/three/DataEngineeringScene.jsx) | Five platforms: source devices, ingestion, transform hub, data lake, analytics. Catmull-Rom tube routes, packets,12 hub pieces becoming a regular grid, database/storage elements, dashboard bars | Platforms assemble over semantic time 0–2.38; transform shot and return below; hub pieces rotate/align, packet travel, storage pulses and dashboard activation; subtle root drift. Sparkles 34 high/14 low |
| [MLOpsDeliveryScene](../src/three/MLOpsDeliveryScene.jsx) | Feature bank, training hardware/rings, evaluation gate/registry, inference deployment, monitoring/radar, retraining curve, moving model artifact | Five modules assemble 0–2.3; training charge, comparison/evaluation, artifact handoff, inference and monitoring activate; retraining feedback persists with restrained rotation/pulses. Sparkles 30/12 |
| [WebProductScene](../src/three/WebProductScene.jsx) | Four depth-separated layers (deployment, data, API, frontend), desktop browser with assembled UI parts, tablet, phone, connecting service and responsive-handoff curves | Layer assembly 0–2.2; browser UI parts 2.2–4.08; depth/orbit reveal and responsive device handoff, rotating connection rings and pulses, then wide idle. Sparkles 26/10. Screens are mesh UI illustrations, not screenshots |
| [AISolutionsScene](../src/three/AISolutionsScene.jsx) | Document sheets, structured-data and prompt modules converge into a layered reasoning core; particles/result artifact form insight output and a distinct human-review module/halo | Inputs/core assemble 0–1.52; processing/core activation, insight module 5.85–7.05, review 7.5–8.55; subtle root float after 10.4, rotating plates/result, review halo and pulses. Sparkles 34/14; no autonomous real AI task runs |

Service camera keyframes below are exact source vectors. Values are Three.js units, not CSS pixels. “Compact” is width<560 or aspect<.82 for MLOps/Web/AI; data uses aspect<.82. Timings refer to semantic lifecycle time, with smoothstep blends and exponential damping, not a guaranteed fixed wall-clock duration under pause.

| Scene | Wide → focused shot(s) | Compact / portrait equivalents | Shot windows and exit |
|---|---|---|---|
| Data | `[4.7,3.35,7.8]` → `[1.1,1.18,3.85]`; wide target `[.02,-.34,.02]`, close `[-.28,.12,.08]` | `[4.45,4.2,10.7]` → `[1.25,1.75,6.4]`; wide target `[0,-.28,.02]` | Close-in 2.55–3.55; return 4.75–6.15; exit z+2.2; damp 3.4 |
| MLOps | `[4.8,3.25,8.05]` → training `[-.12,1.38,4.15]` → delivery `[3.75,1.35,4.55]` | `[4.4,4.2,10.9]`, `[.3,2.05,6.5]`, `[3.7,2.05,6.7]` | Training 2.7–3.65, return 5.85–6.75; delivery 6.1–7, return 9.1–10.65; exit z+2.1; damp 3.25 |
| Web | `[5.35,2.9,8.8]` → close `[2.4,1.2,6.2]` → orbit `[-4.25,2.35,7.35]` → responsive `[4.55,1.65,7.05]` | `[5.1,4.25,11.75]`, `[3.05,2.6,9.2]`, `[-4.55,3.8,10.2]`, `[4.8,3.1,9.5]` | Close 2.6–3.7/return 4.45–5.15; orbit 4.55–5.35/return 6.55–7.15; responsive 6.65–7.3/return 9.45–10.35; exit z+2.4; damp 3.1 |
| AI | `[5.1,3.1,8.65]` → inputs `[-3.65,1.65,5.95]` → core `[1.45,1.62,4.7]` → output `[4.7,1.18,5.2]` | `[3,4.2,11.9]`, `[-3.9,3.05,9.15]`, `[1.7,2.8,7.65]`, `[4.9,2.8,8.35]` | Inputs 2–2.75/return 3.75–4.45; core 4–4.75/return 6.15–6.85; output 6.5–7.15/return 9.45–10.35; exit z+2.3; damp 3.15 |

Reduced-motion camera movement weights are zero, and damping speed 20 settles to the wide view. Per-scene assembled/exploded coordinates, local material overrides, geometry dimensions, and curve control points are the `STAGES`/`LAYERS`/`MODULES` and curve constants in these source files; maintain those together with the camera rather than adjusting geometry from screenshots.

### Industry diagrams: overview plus seven variants

Source: [IndustryFlow.jsx](../src/components/IndustryFlow.jsx), [industries.css](../src/styles/industries.css). Every variant is a 600×255 viewBox SVG: record/list panel left, hexagonal business-rules/check symbol center, working interface right, gradient connections, dashed moving signal, grounding ellipse, and four HTML workflow captions. Pharmacy uses product/bottle cards; manufacturing uses a light proof-sheet layout; overview/retail/wholesale/logistics/research/environment use the dark dashboard variant. Their semantic labels are listed in the industry inventory.

Exact prominent SVG colours include gradient `#27d2e4`→`#ff8a46`, signal `#8cf3f4`, input panel `#0d2e3e`/border `#376577`, rules `#0b3544`/`#29aab8`, dashboard `#0e2b3a`/`#3a6879`, pharmacy `#f2eee4`/`#17505b`, proof sheet `#f1ece1`, and grounding ellipse `#102b38` at .6 opacity. SVG overall opacity .9 after polish.

No objects/materials/lighting/perspective camera in the Three.js sense exist here. The pseudo-depth is SVG geometry. Signals use dasharray `5 95`, offset 100→−100 over 5s linear infinite. Animation starts only when figure intersects at threshold .08 and document is visible; otherwise play-state pauses. Reduced-motion CSS removes animation and dasharray, leaving.65-opacity static signals. There is no separate intro assembly, exit, tab-change transition, manual playback, or no-WebGL requirement. Industry sections themselves fade/translate via Framer: opacity .4/y 24 →1/0, duration .65s, once, viewport amount.08; OS reduced motion disables the initial transform.

### Case-study scenes: shared implementation

Source: [CaseStudyScene.jsx](../src/three/CaseStudyScene.jsx), [CaseStudyWalkthrough.jsx](../src/components/CaseStudyWalkthrough.jsx). Both detail heroes and walkthroughs use this renderer, not the service SceneEnvironment.

**Objects/materials:** RoundedBox physical shells use scene presets; plane screens use basic materials with locally generated CanvasTextures. Pharmacy interface textures depict catalog/search/header,18 representative products, detail/basket, and genuinely different desktop/tablet/phone layouts (three/two/one product columns). Generic pipeline/forecast screens are original UI diagrams. Texture canvases use 1024px width and normally 640px height, with taller phone texture 1450px; no external font/image fetch is required to draw them. Databases are stacked cylinders; model artifacts and city nodes use simple solids; streams are quadratic Bézier lines plus small 6×6-segment particle spheres. These screens and city locations are illustrative, not live application embeds, real-time readings, geographic coordinates, or all 11,204/606 source records.

**Lighting:** ambient 1.5; hemisphere `#c5f7f0/#082334`2; warm-white directional `[3,5,5]` intensity 3; teal point intensity 12 with x=`sin(time*.45)*4`; orange point `[3,-1,3]` intensity 10. A retained 18-unit/24-division floor grid sits below the scene. These are different, brighter lights from the services; service bloom/ContactShadows are not mounted here.

**Camera:** FOV 42° comes from SceneCanvas. Desired z = `(AQI ? 8.8 : 8.7) * [1.02,.94,1.02,1.13,1.16][stage] / min(aspect,1.3)`. AQI x targets `[-.6,.6,-.4,.7,0]`, y.8; Lobatse x `[.6,-.5,.55,0,.7]`, y.35; look-at origin. Lerp factor `1-exp(-min(dt,.05)*3)`; reduced motion snaps. Narrow aspect increases camera distance instead of switching off the scene.

**Intro/idle/stage exit:** all five stage groups stay mounted. Active groups scale toward 1, inactive toward.001 and become invisible below.005. Blending factor `1-exp(-min(dt,.05)*7)`; inactive groups slide x−3 for AQI or+3 for Lobatse. Active idle float y=`sin(time*.55)*.045`, yaw=`sin(time*.24+index)*.045`. Stream time is capped to.05 delta increments; particles traverse at `.18` normalized path units per second. Lobatse product tiles additionally assemble from scattered positions with staggered smoothstep progress. Reduced motion resolves scale/position immediately and suppresses float/particle progression. Hidden groups still exist; visibility and frame-loop pause do not mean each inactive callback is unmounted.

| Stage | Lobatse actual objects/story | AQI actual objects/story |
|---|---|---|
| 1 |18 product tiles assemble into 6×3 catalog grid, plus catalog/data-layer screen and streams | Three named abstract city nodes, observation streams and a collection ring |
| 2 | Layered desktop storefront, distinct product-detail screen and basket | Scaled city sources above Ingestion → Validation → BigQuery/database |
| 3 | Desktop, tablet and phone with responsive original pharmacy layouts |36 representative feature cubes,606-feature contract label and chronological Train/Validation/Test panels |
| 4 | Orange Basket → COD checkout → Order management, separated from teal Prescription upload → Private file handling → Pharmacist review → Decision | Ridge/Random Forest/Histogram Gradient Boosting candidates, central wireframe artifact, MLflow/evaluation and registered-artifact panel |
| 5 | Customer devices → ASP.NET Core/EC 2 → PostgreSQL/RDS and S 3, connected to admin/pharmacist screen | Model bundles → FastAPI → Streamlit dashboard;24h/48h/72h cards; miniature cities/BigQuery/features/MLflow chain |

**Scroll/controls:** normal window scroll chooses the chapter whose center is nearest 55% of viewport height; it does not pin the document, capture the wheel, or hijack scrolling. The left scene/control column is CSS sticky. Clicking a tab/Previous/Next selects a stage without scrolling the chapter into place; subsequent normal scroll may select a different stage. Tab keyboard controls are roving Left/Right/Home/End. Replay starts stage 0 and advances every 4,200ms through stage 4; Pause stops it; wheel/touch stops replay. Replay intervals pause when the walkthrough is off-screen (threshold .05), document hidden, or motion reduced. Reduced mode labels the control Return to first stage and does not auto-play. A polite caption and associated HTML tabpanel describe the current scene; five full HTML chapters remain below/beside it.

**Fallback:** an original SVG plus current stage title/label appears while the first WebGL frame is pending and when unsupported/error/context-lost. `?renderer=fallback` explicitly selects this path for case scenes. This override was browser verified with `?renderer=fallback&motion=reduce`: no case canvas was present, and Storefront title/explanation remained. It does not emulate a real GPU failure or prove every context-restoration path. Case canvases use `touch-action:pan-y`; no OrbitControls or drag-to-rotate interaction is implemented despite the generic “Interactive system study” label.

### Other implemented motion

Home's [HomePage.jsx](../src/pages/HomePage.jsx) applies GSAP reveals to selected headings, service frame, approach steps, work cards, company columns, and contact content: opacity 0/y 72/rotateX 4/blur 9px → visible/y 0/rotation 0/blur 0; duration 1.05s, stagger.085s, ease `power3.out`, start `top 82%`, once. It skips OS reduced motion and jsdom. Section CSS includes a 1.45s foreground light pass and a 1.8s background sweep; company rings and contact glow have separate animation rules in corrections.css. Project filtering uses Framer layout and .24s entry/exit transitions; image/card/link hover transitions remain ordinary CSS. No motion graphic or MP 4 background was added to these pages.

## 6. Responsive behavior

Desktop screenshots use a 1440×900 CSS viewport, mobile 390×844. A 768×1024 viewport was also checked for industry selector/layout and contact preselection/stacking. “Tablet” below describes actual CSS ranges, not a device-detection system.

| Area | Desktop | Tablet/intermediate changes | Mobile changes |
|---|---|---|---|
| Header/shell | Three header columns; inline nav; CTA; shell max 1240px | ≤1120px menu toggle, fixed full-height overlay nav, CTA hidden;40px total shell inset. Overlay link size is 12px at 1000–1120px because of the later min 1000 rule | ≤640px header 72px,32px total shell inset, smaller brand; menu toggle remains 46×46px |
| Hero | Full viewport/min 760px; text over right-biased formation; two inline actions | ≤860px min 860px, stronger overlay, no scroll hint, copy max 700px | ≤640px min 820px; h1 48px; action grid 1 column; focus labels wrap; camera aspect framing/narrow particle count |
| General intros | Split heading and supporting copy | ≤860px split intros become 1 column, gap 24px | Base section padding 88px; polished preview sections override to 48px |
| Services header/tabs | Header 1.35/.65; four tabs | Header 1 column and tabs 2 columns at ≤760px; otherwise tabs 4 columns | ≤640px tab 52px min,12px label,4px gaps; no tiny serial column |
| Service scene/copy | Panel 1.35/.8; visual min 500px | **Final cascade stacks at ≤1000px**, despite earlier 1080px rule. Visual min 430px; copy padding 26px 8px 60px. Earlier copy min-height 520px ≤1080px /560px ≤760px remains | ≤640px visual min 370px; at ≤520px older height 340px is constrained by final 370px min-height. HTML stage labels become compact grids near canvas bottom at ≤520px; data labels `.4rem` |
| Home industries | Two columns; pharmacy spans 2rows; smaller cards internally split | 641–900px pharmacy spans full width with problem/diagram side by side; smaller cards two columns, internally vertical | ≤640px one column; card padding 22px; all card h3 28px; diagrams full width; smaller figcaptions remain hidden |
| Industries page hero | Copy and SVG 1/.8 | ≤1000px 1/.85; ≤900px stack, diagram max 600px | ≤640px h1 36px; top 115px; primary hero CTA full width; process statement blocks |
| Industry directory/content | Sticky below header; anchors; two-column challenge/solution | ≤900px anchors hidden and native select shown; challenge/solution stack; section scroll-margin 105px instead of 125px | ≤640px section padding 36px; solution padding 22px 16px; related cards and closing content stack |
| Case preview/index | Two cards; large editorial hero | ≤760px cards 1 column, index hero top 125px and supporting line stacks | ≤640px media aspect 1.85; body 14px/problem 16px; case index h1 still 55px minimum |
| Case hero/narrative | Summary/scene.85/1.15; scene 350px; facts 3 column; chapters.75/1.25 | ≤1000px scene 300px, narrower gaps; ≤760px hero/chapter/outcome/next 1 column, facts 2 column, scene 285px | h1 39px; quick fact 12px; decisions retain 2 columns; gallery 1 column; attribution padding 18px 20px |
| Case walkthrough | Sticky left scene, right stages each 72vh; frame scene `clamp(230px,34vh,400px)` | ≤1000px columns 1.15/.85 and 35px gap; ≤760px block layout with sticky scene/control stack | Sticky top header+8px; scene 225px, tabs min 44px and 9px label, playback 36px; chapters 90vh. At height≤740px AND width≤760px scene 170px and description 10px |
| Approach | Five columns | ≤1120px 3 columns; ≤860px 2 columns | ≤640px 1 column; automatic height;24px 0/30px step padding |
| Selected work |12-col 7/5,5/7 arrangement | ≤860px all cards 1 column | Copy padding 22px;16/9 media retained |
| Company preview/About service cards | Preview.72/1.28; service cards 2 columns | ≤760px both1 column; preview circle min 17rem/max 24rem | Preview services list 1 column; card padding 1.25rem; badges smaller |
| About/Projects shared hero |1.3/.7 columns,680px minimum, header+120px top | ≤860px 1 column,620px minimum,36px gap | ≤640px 610px min, header+80px top, h1 `clamp(3.25rem,15vw,5rem)` |
| About tech/proof/CTA | Three tech columns; proof rows; centered CTA | ≤860px technology 1 column | ≤640px proof maturity text hidden; proof grid changes; closing h2 keeps its existing fluid clamp |
| Project archive/dialog |3 column archive; modal hero/content 2 column; gallery 2 column | ≤1120px archive 2 column; ≤860px dialog hero/content 1 column | ≤640px archive 1 column; toolbar vertical; dialog fills width/max 100vh with no backdrop padding or outer border; gallery 1 column, content padding 28px 20px |
| Contact | Sticky intro + two-column form layout | ≤860px section 1 column and intro static | ≤640px fields 1 column; form header vertical; grid padding 24px 20px 16px; submit/fine print 20px inset |
| Footer | Three columns | ≤860px brand spans full row, nav/contact 2 column | ≤640px all 1 column,44px gaps; bottom copyright/service line vertical |

Breakpoint inventory: [global.css](../src/styles/global.css)1120/860/640; [service-showcase.css](../src/styles/service-showcase.css)1080/760/520; [corrections.css](../src/styles/corrections.css)760; [case-studies.css](../src/styles/case-studies.css)min 1000, max 1000/760, plus max-height 740+max-width 760; [industries.css](../src/styles/industries.css)min 1121, max 1000/900/640 and 641–900; [visual-polish.css](../src/styles/visual-polish.css)max 1000/640 and 641–900. Reduced-motion and forced-colors rules are additional media features. They are not interchangeable with width breakpoints.

## 7. Component, route, content, and asset inventory

### Page/section implementation mapping

“Global” below links to [global.css](../src/styles/global.css); “Corrections” to [corrections.css](../src/styles/corrections.css); “Polish” to [visual-polish.css](../src/styles/visual-polish.css). These files coexist; a section does not own an isolated stylesheet.

| Page/section | Source component(s) | Styles | Image/video/logo assets |
|---|---|---|---|
| All routes/header | [Navbar](../src/components/Navbar.jsx), [agencyData](../src/data/agencyData.js) | Global; navigation adjustments in [case-studies](../src/styles/case-studies.css), [industries](../src/styles/industries.css) | Root transparent SAM PNG |
| Home hero | [Hero](../src/components/Hero.jsx), [IntelligenceCanvas](../src/components/IntelligenceCanvas.jsx), [HeroFormationScene](../src/three/HeroFormationScene.jsx) | Global + Corrections + Polish | Root SAM PNG; procedural geometry; no video |
| Home four services | [ServiceShowcase](../src/components/ServiceShowcase.jsx), [FoundationDemoScene](../src/three/FoundationDemoScene.jsx), four scene modules above | [service-showcase](../src/styles/service-showcase.css) + Corrections + Polish | Procedural 3D, HTML/Lucide labels; no external model or scene image |
| Home industry preview | [IndustriesSection](../src/components/IndustriesSection.jsx), [IndustryFlow](../src/components/IndustryFlow.jsx) | Global + [industries](../src/styles/industries.css) + Polish | Inline SVG, no raster images |
| Industries page | [IndustriesPage](../src/pages/IndustriesPage.jsx), [industriesData](../src/data/industriesData.js), IndustryFlow | Global + industries + Polish | Inline SVG; public SAM full PNG; industry social preview metadata |
| Home/index case cards | [CaseStudiesSection](../src/components/CaseStudiesSection.jsx), [CaseStudiesPage](../src/pages/CaseStudiesPage.jsx) | Global + [case-studies](../src/styles/case-studies.css) + Polish | `public/case-studies/lobatse-pharmacy.svg`, `aqi-forecasting.svg` |
| Case detail/hero/walkthrough | [CaseStudyPage](../src/pages/CaseStudyPage.jsx), [CaseStudyWalkthrough](../src/components/CaseStudyWalkthrough.jsx), [CaseStudyScene](../src/three/CaseStudyScene.jsx), [caseStudiesData](../src/data/caseStudiesData.js) | Global + case-studies + Corrections badges | Generated CanvasTextures; same SVG fallbacks; public SAM full PNG; AQI WebP gallery |
| Home/About approach | [ApproachSection](../src/components/ApproachSection.jsx) | Global + Corrections/Home GSAP | Lucide arrows only |
| Home selected work | [SelectedWorkSection](../src/components/SelectedWorkSection.jsx), [projectsData](../src/data/projectsData.js) | Global + Corrections | AQI dashboard WebP, DeepGuard/SAM-EDA SVG; industrial CSS placeholder |
| Home company preview | [CompanyPreview](../src/components/CompanyPreview.jsx) | Corrections + Global headings | Root transparent SAM PNG; CSS rings |
| About | [CompanyAboutPage](../src/pages/CompanyAboutPage.jsx), [TechnologyBadge](../src/components/TechnologyBadge.jsx) | Global + Corrections | Root SAM PNG; inline technology SVG/Lucide marks |
| Project archive/dialog | [ProjectsPage](../src/pages/ProjectsPage.jsx), [ProjectLibrary](../src/components/ProjectLibrary.jsx), TechnologyBadge | Global + Corrections | Project assets listed below; CSS placeholders for null/failed media |
| Home contact | [ContactSection](../src/components/ContactSection.jsx), [contactBrief](../src/utils/contactBrief.js) | Global + Corrections + industry-note rules in industries.css | Root SAM PNG; CSS glow; Lucide icons |
| All routes/footer | [Footer](../src/components/Footer.jsx) | Global | Root transparent SAM PNG |
| All routes/head | [index.html](../index.html), [usePageMeta](../src/hooks/usePageMeta.js), [caseStudyMeta](../src/data/caseStudyMeta.js), [caseStudySeo](../scripts/caseStudySeo.js) | Browser metadata; Google font stylesheet | Favicon PNG, social PNGs; SVG source counterparts retained |
| Unknown paths | [App](../src/App.jsx) NotFoundPage | Global `.not-found` | No dedicated media |

### Complete project destinations and media

Every row below opens a query-addressed archive dialog, not a standalone detail page. All use ProjectLibrary and global.css + corrections.css. AQI and Lobatse additionally expose their full case-study links.

| Project | Dialog destination | Main media / placeholder |
|---|---|---|
| Lobatse Pharmacy | `/projects?project=lobatse-pharmacy` | [lobatse-pharmacy.svg](../public/case-studies/lobatse-pharmacy.svg) |
| AQI Forecasting MLOps Platform | `/projects?project=aqi-forecasting` | [dashboard-karachi.webp](../public/projects/dashboard-karachi.webp) |
| DeepGuard | `/projects?project=deepguard` | [deepguard.svg](../public/projects/deepguard.svg) |
| Intelligent Data Agent | `/projects?project=intelligent-data-agent` | [data-agent.svg](../public/projects/data-agent.svg) |
| InstaPipeline | `/projects?project=instapipeline` | [pipeline.svg](../public/projects/pipeline.svg) |
| SAM-EDA | `/projects?project=sam-eda` | [sam-eda.svg](../public/projects/sam-eda.svg) |
| Credit Card Fraud Detection | `/projects?project=fraud-detection` | [fraud.svg](../public/projects/fraud.svg) |
| Stock Price Prediction — Google | `/projects?project=stock-forecast` | [stock.svg](../public/projects/stock.svg) |
| PalmPilot | `/projects?project=palmpilot` | [palmpilot.svg](../public/projects/palmpilot.svg) |
| VS Code Developer Extensions | `/projects?project=vscode-extensions` | [extensions.svg](../public/projects/extensions.svg) |
| Web Data Extraction Tool | `/projects?project=web-extraction` | [pipeline.svg](../public/projects/pipeline.svg) |
| House Price Prediction | `/projects?project=house-price` | [housing.svg](../public/projects/housing.svg) |
| PINN Web Application | `/projects?project=pinn-app` | [pinn.svg](../public/projects/pinn.svg) |
| Chatbot Application | `/projects?project=chatbot` | [chatbot.svg](../public/projects/chatbot.svg) |
| Instagram Reel Downloader | `/projects?project=reel-downloader` | [reel.svg](../public/projects/reel.svg) |
| BotShield | `/projects?project=botshield` | No supplied image; generated HTML/CSS placeholder |
| Industrial Print Proofing & Label Validation Suite | `/projects?project=industrial-print-proofing` | No supplied image; generated HTML/CSS placeholder |
| AI Research Brief Generation Engine | `/projects?project=ai-research-brief-engine` | No supplied image; generated HTML/CSS placeholder |
| SmartPark-Vision | `/projects?project=smartpark-vision` | No supplied image; generated HTML/CSS placeholder |

### All local public assets

Paths in this table are repository files. At runtime `public/` is omitted from their URL. “Available” does not imply a mounted image; metadata/source/unused variants are identified above and below.

| File | Implemented role |
|---|---|
| [aqi-forecasting.svg](../public/case-studies/aqi-forecasting.svg) | Editorial artwork / case scene fallback; Lobatse also gallery |
| [lobatse-pharmacy.svg](../public/case-studies/lobatse-pharmacy.svg) | Editorial artwork / case scene fallback; Lobatse also gallery |
| [social-aqi-forecasting.png](../public/case-studies/social-aqi-forecasting.png) | Social metadata image |
| [social-aqi-forecasting.svg](../public/case-studies/social-aqi-forecasting.svg) | Social-artwork SVG source; not selected as the metadata image |
| [social-index.png](../public/case-studies/social-index.png) | Social metadata image |
| [social-index.svg](../public/case-studies/social-index.svg) | Social-artwork SVG source; not selected as the metadata image |
| [social-lobatse-pharmacy.png](../public/case-studies/social-lobatse-pharmacy.png) | Social metadata image |
| [social-lobatse-pharmacy.svg](../public/case-studies/social-lobatse-pharmacy.svg) | Social-artwork SVG source; not selected as the metadata image |
| [favicon.png](../public/favicon.png) | Active browser favicon |
| [favicon.svg](../public/favicon.svg) | Available SVG favicon |
| [social-preview.png](../public/industries/social-preview.png) | Social metadata image |
| [social-preview.svg](../public/industries/social-preview.svg) | Social-artwork SVG source; not selected as the metadata image |
| [api-docs.webp](../public/projects/api-docs.webp) | AQI real project capture / gallery |
| [chatbot.svg](../public/projects/chatbot.svg) | Original vector project artwork (some shared across projects) |
| [dashboard-islamabad.webp](../public/projects/dashboard-islamabad.webp) | AQI real project capture / gallery |
| [dashboard-karachi.webp](../public/projects/dashboard-karachi.webp) | AQI real project capture / gallery |
| [dashboard-lahore.webp](../public/projects/dashboard-lahore.webp) | AQI real project capture / gallery |
| [data-agent.svg](../public/projects/data-agent.svg) | Original vector project artwork (some shared across projects) |
| [deepguard.svg](../public/projects/deepguard.svg) | Original vector project artwork (some shared across projects) |
| [extensions.svg](../public/projects/extensions.svg) | Original vector project artwork (some shared across projects) |
| [fraud.svg](../public/projects/fraud.svg) | Original vector project artwork (some shared across projects) |
| [github-daily-green.webp](../public/projects/github-daily-green.webp) | AQI real project capture / gallery |
| [github-hourly-green.webp](../public/projects/github-hourly-green.webp) | AQI real project capture / gallery |
| [housing.svg](../public/projects/housing.svg) | Original vector project artwork (some shared across projects) |
| [mlflow-runs.webp](../public/projects/mlflow-runs.webp) | AQI real project capture / gallery |
| [palmpilot.svg](../public/projects/palmpilot.svg) | Original vector project artwork (some shared across projects) |
| [pinn.svg](../public/projects/pinn.svg) | Original vector project artwork (some shared across projects) |
| [pipeline.svg](../public/projects/pipeline.svg) | Original vector project artwork (some shared across projects) |
| [reel.svg](../public/projects/reel.svg) | Original vector project artwork (some shared across projects) |
| [sam-eda.svg](../public/projects/sam-eda.svg) | Original vector project artwork (some shared across projects) |
| [shap-summary.webp](../public/projects/shap-summary.webp) | AQI real project capture / gallery |
| [stock.svg](../public/projects/stock.svg) | Original vector project artwork (some shared across projects) |
| [sam-logo-full.png](../public/sam-logo-full.png) | Independent closing-CTA logo |
| [sam-logo-profile.png](../public/sam-logo-profile.png) | Available logo variant; not mounted |
| [sam-logo-white.png](../public/sam-logo-white.png) | Available logo variant; not mounted |
| [social-preview.png](../public/social-preview.png) | Social metadata image |
| [social-preview.svg](../public/social-preview.svg) | Social-artwork SVG source; not selected as the metadata image |

Additional root logo files are listed in the logo table. [design-references](../design-references) contains supplied reference images/videos, including two MP 4 files; it is not an active runtime media directory. No image/video reference was substituted for a screenshot of the site. TechnologyBadge contains inline SVG marks for recognized technologies and a consistent neutral Lucide symbol for others; these are code assets, not missing raster files.

### Navigation and anchor contract

| Visible control / use | Actual destination |
|---|---|
| Header/footer brand and Home | `/#home` |
| Header/footer Services | `/#services` |
| Header/footer Industries | `/industries` |
| Header/footer Case Studies | `/case-studies`; detail pages keep this group active |
| Header/footer Work / Projects | `/projects` |
| Header/footer About Us | `/about` |
| Header/footer Contact and conversation CTAs | `/#contact` |
| Hero Explore services / Discuss a project | `#services` / `#contact` on home |
| Homepage section anchors | `#home`, `#services`, `#industries`, `#case-studies`, `#approach`, `#work`, `#contact` |
| Service preselection | `/?service=data-engineering#service-visualization`, `/?service=mlops#service-visualization`, `/?service=web-software#service-visualization`, `/?service=ai-solutions#service-visualization` |
| Industry directory | `/industries#industry-directory`; seven fragments in industry table |
| Industry inquiry | `/?industry=<one of the seven valid ids>#contact` |
| Case navigation | `/case-studies/lobatse-pharmacy`, `/case-studies/aqi-forecasting`; each `#system-walkthrough`; back `/case-studies`; related switches to other case |
| Project detail | Nineteen `/projects?project=<id>` destinations above |
| About shared approach | `/about#approach` exists because ApproachSection is reused |
| Skip link | Current page `#main-content` |
| Direct contact | `mailto:abinemasood814@gmail.com` |
| Rendered project resource | `https://pypi.org/project/sam_eda/`; external reachability not verified |
| Full AQI gallery images | Corresponding `/projects/*.webp` URL in a new tab |

No `/services`, `/contact`, `/work`, `/projects/<id>`, or individual `/industries/<id>` page is implemented. Use the routes/fragments above. [vercel.json](../vercel.json) rewrites industries and the three case URLs to generated route HTML, then remaining requests to index.html. Actual deployed routing/status codes were not verified against the public host.

## 8. Accessibility and SEO

### Implemented accessibility

| Area | Current behavior / evidence |
|---|---|
| Landmarks and headings | English document; skip-to-main link; header/nav/main/footer; one primary h1 on each real page; named sections typically use `aria-labelledby`; case facts use `dl`, stages/process use ordered lists. Project archive titles are h2; editorial preview titles h3 |
| Keyboard focus | Global 3px orange `:focus-visible` outline with 4px offset; visible skip link on focus. Form controls replace outline with cyan focus border/background. No claim of full WCAG conformance is made |
| Navigation | Menu button has expanded/controls labels; opening locks body and focuses first link; Escape closes and restores button focus (browser verified). Closed-menu focus leak is listed below |
| Service/case tabs | ARIA tablist/tab/tabpanel relationships, roving tabindex, arrows/Home/End; HTML descriptions remain separate from visual geometry. Stage choice and service tab changes were browser verified |
| Project modal | Named modal dialog, initial close-button focus, keyboard loop, Escape/backdrop/close dismissal, scroll lock and trigger restoration; query-opened dialog displayed and Escape updated URL during browser checks |
| Forms | Visible wrapping labels, appropriate autocomplete/types, required/minLength constraints, native validity, polite inquiry/status messages; form preselection was browser verified. No outgoing email was sent |
| Images | Editorial illustrations explicitly described as illustrations; real AQI gallery alt text/captions; null/failed archive images receive named placeholders; redundant lockup images have empty alt; independent SAM image has brand alt |
| Visual-only content | Decorative Lucide icons/hero visual marked hidden where applicable; scene host has image role/description; industry SVG hidden from AT with HTML workflow captions; case HTML stage content supports fallback interpretation |
| Motion/scroll | OS reduced-motion branches in JS, CSS transition/animation duration reduction, static SVG and scene states; no case scroll hijack; canvases support vertical touch panning |
| Forced colours | Rules replace certain indicators with CanvasText and add CanvasText borders to buttons/cards/form; source specified, not exercised in an OS forced-colours session |

Contrast considerations: primary warm-white/muted text uses dark backgrounds; dark primary-button text is paired with orange; selected-work/proof sections explicitly change text colours for light backgrounds. Small low-emphasis labels, transparent panels, SVG labels, gradient compositing, and canvas-rendered text require contextual assessment. No complete contrast audit, screen-reader audit,200%/400% zoom audit, or WCAG certification was performed. Do not infer compliance from the palette or screenshots alone. Mobile data-stage labels reach `.4rem` (6.4px at a 16px root), and case mobile descriptions can reach10px; those exact values are implemented, not recommended minimum sizes.

### Metadata, canonical paths, and crawl behavior

[index.html](../index.html) supplies viewport/theme-colour/dark-colour-scheme metadata, favicon, title/description, Open Graph, Twitter large-image card, font preconnects, and Organization JSON-LD with brand/email/service topics. [usePageMeta.js](../src/hooks/usePageMeta.js) updates title, description, OG/Twitter title/description/image, OG URL, canonical link, and image alt after mount.

Canonical origin is exactly `https://my-portfolio-nine-nu-52.vercel.app`. Paths remove trailing slashes and omit query/hash, so project queries canonicalize to `/projects` and industry inquiry queries to `/`. Browser canonical values were checked on all seven implemented main routes.

| Page | Title | Social PNG |
|---|---|---|
| Home | SAM Intelligence Group \| Data, MLOps, Custom Software & AI | `/social-preview.png` |
| Industries | Industries & Solutions \| SAM Intelligence Group | `/industries/social-preview.png` |
| Case index | Case Studies \| SAM Intelligence Group | `/case-studies/social-index.png` |
| Lobatse | Lobatse Pharmacy Case Study \| SAM Intelligence Group | `/case-studies/social-lobatse-pharmacy.png` |
| AQI | Three-City AQI Forecasting Platform Case Study \| SAM Intelligence Group | `/case-studies/social-aqi-forecasting.png` |
| Projects | Work & Projects \| SAM Intelligence Group | `/social-preview.png` |
| About | About Us \| SAM Intelligence Group | `/social-preview.png` |

The build-only plugin in [scripts/caseStudySeo.js](../scripts/caseStudySeo.js), configured in [vite.config.js](../vite.config.js), emits route-specific head metadata HTML for industries and all three case routes. It is not full content SSR. About/Projects use the shared initial shell before runtime metadata updates. The source does not include a dedicated sitemap/robots asset in `public/`, route-specific structured data for every case, or bespoke 404 metadata/status handling. Public search indexing, social crawler rendering, deployed canonical correctness, and external link health remain **not verified** in this local documentation task.

## 9. Current visual references

All images below were captured from the real running localhost site on 7 November 2026. They are JPEG browser screenshots, not supplied design references or mockups. They show viewport excerpts rather than a stitched full page. Section images document additional scrolled states. Desktop captures use a 1440×900 CSS viewport; mobile 390×844. The app's screenshot output has different raster dimensions due to browser/app scaling and scrollbar capture; CSS viewport is the layout reference. Some excerpts naturally end before a long card, form, or narrative finishes.

### Homepage hero

Route/state: `/`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Homepage hero, desktop](design-screenshots/homepage-desktop.jpg) | ![Homepage hero, mobile](design-screenshots/homepage-mobile.jpg) |

*Homepage hero: current rendered desktop and mobile viewport excerpts.*

### Data Engineering service viewport

Route/state: `/#services`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Data Engineering service viewport, desktop](design-screenshots/services-desktop.jpg) | ![Data Engineering service viewport, mobile](design-screenshots/services-mobile.jpg) |

*Data Engineering service viewport: current rendered desktop and mobile viewport excerpts.*

### Homepage industry preview

Route/state: `/#industries`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Homepage industry preview, desktop](design-screenshots/industry-preview-desktop.jpg) | ![Homepage industry preview, mobile](design-screenshots/industry-preview-mobile.jpg) |

*Homepage industry preview: current rendered desktop and mobile viewport excerpts.*

### Homepage case-study preview

Route/state: `/#case-studies`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Homepage case-study preview, desktop](design-screenshots/case-preview-desktop.jpg) | ![Homepage case-study preview, mobile](design-screenshots/case-preview-mobile.jpg) |

*Homepage case-study preview: current rendered desktop and mobile viewport excerpts.*

### Homepage contact section

Route/state: `/#contact`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Homepage contact section, desktop](design-screenshots/contact-desktop.jpg) | ![Homepage contact section, mobile](design-screenshots/contact-mobile.jpg) |

*Homepage contact section: desktop shows the settled two-column layout; mobile is scrolled to the form with the Name field focused. CSS viewports 1440 ×900 and 390 ×844 respectively.*

### Industries page hero

Route/state: `/industries`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Industries page hero, desktop](design-screenshots/industries-desktop.jpg) | ![Industries page hero, mobile](design-screenshots/industries-mobile.jpg) |

*Industries page hero: current rendered desktop and mobile viewport excerpts.*

### Case-study index hero

Route/state: `/case-studies`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Case-study index hero, desktop](design-screenshots/case-studies-desktop.jpg) | ![Case-study index hero, mobile](design-screenshots/case-studies-mobile.jpg) |

*Case-study index hero: current rendered desktop and mobile viewport excerpts.*

### Lobatse detail hero

Route/state: `/case-studies/lobatse-pharmacy`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Lobatse detail hero, desktop](design-screenshots/lobatse-desktop.jpg) | ![Lobatse detail hero, mobile](design-screenshots/lobatse-mobile.jpg) |

*Lobatse detail hero: current rendered desktop and mobile viewport excerpts.*

### AQI detail hero

Route/state: `/case-studies/aqi-forecasting`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![AQI detail hero, desktop](design-screenshots/aqi-desktop.jpg) | ![AQI detail hero, mobile](design-screenshots/aqi-mobile.jpg) |

*AQI detail hero: current rendered desktop and mobile viewport excerpts.*

### AQI walkthrough, Cities stage

Route/state: `/case-studies/aqi-forecasting#system-walkthrough`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![AQI walkthrough, Cities stage, desktop](design-screenshots/walkthrough-desktop.jpg) | ![AQI walkthrough, Cities stage, mobile](design-screenshots/walkthrough-mobile.jpg) |

*AQI walkthrough, Cities stage: current rendered desktop and mobile viewport excerpts.*

### Project archive page hero

Route/state: `/projects`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![Project archive page hero, desktop](design-screenshots/projects-desktop.jpg) | ![Project archive page hero, mobile](design-screenshots/projects-mobile.jpg) |

*Project archive page hero: current rendered desktop and mobile viewport excerpts.*

### AQI project detail dialog

Route/state: `/projects?project=aqi-forecasting`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![AQI project detail dialog, desktop](design-screenshots/project-detail-desktop.jpg) | ![AQI project detail dialog, mobile](design-screenshots/project-detail-mobile.jpg) |

*AQI project detail dialog: current rendered desktop and mobile viewport excerpts.*

### About Us page hero

Route/state: `/about`.

| Desktop — CSS viewport 1440 × 900 | Mobile — CSS viewport 390 × 844 |
|---|---|
| ![About Us page hero, desktop](design-screenshots/about-desktop.jpg) | ![About Us page hero, mobile](design-screenshots/about-mobile.jpg) |

*About Us page hero: current rendered desktop and mobile viewport excerpts.*

## 10. Reproducible issues and current inconsistencies

### Reproduced problems

| Issue | Reproduction and observed result | Source |
|---|---|---|
| Two simultaneous current navigation links on home | At 1440×900 scroll to Services, then Contact. Both Home and the relevant section link have `is-active` and `aria-current="page"`. This was observed for Home+Services and Home+Contact; the section screenshots also capture the duplicate underline state | [Navbar.jsx](../src/components/Navbar.jsx): route `/` stays active independently of section observer state |
| Closed mobile navigation still receives keyboard focus | At 390×844 with the menu closed, focus the header brand and press Tab. Focus moves to hidden Home inside primary navigation while nav opacity is 0 and menu `aria-expanded` is false | [Navbar.jsx](../src/components/Navbar.jsx), [global.css](../src/styles/global.css): opacity/pointer-events conceal the overlay without inert/hidden/tabindex management |

### Observed design differences, not new features

- Homepage company-preview h2 is 24px in the checked tablet DOM while the neighboring general section-intro scale is substantially larger. Its CSS supplies a width but no size override. The specification preserves that actual result.
- Polished homepage/service/industry/editorial previews use minimal borders, while project archive, contact, About service cards, and detailed case-story frames retain stronger borders. Case-scene floor grids remain even though the homepage hero CSS grid was removed.
- Service mobile data-stage labels use 6.4px at the default root, and case stage/control text is smaller than normal body copy. The screenshots show this density; no unverified contrast failure is asserted.
- About's proof list resolves three links from a four-ID configuration because the PINN identifier differs from the project data. This is source confirmed; the absent fourth item is not represented as current visible content.

### Optional future improvements — not implemented by this task

Potential follow-up work could correct navigation focus/current-state behavior, unify secondary heading/label sizes, reconcile the About proof identifier, and conduct a measured contrast/zoom/screen-reader audit. A future brand guide could formalize clear space and logo usage. These are separate suggestions, not implemented screens, animations, or promised behavior.

## 11. Verification and maintenance notes

- Inspected all mounted page/component branches, shared navigation/data, current stylesheet order, scene/runtime code, assets, and metadata generation paths.
- Browser verified all seven main routes at desktop 1440×900 and mobile 390×844; each rendered its expected h1 with no horizontal document overflow at those tested sizes. This is not an exhaustive cross-device guarantee.
- Checked tablet 768×1024 industry layout/select behavior and manufacturing-industry inquiry preselection; the initial service was Web Development & Custom Software.
- Exercised a service tab change, a case stage change, query-addressed project dialog, menu open/Escape behavior, and case static-fallback override. Off-screen pause, adaptive quality thresholds, complete lifecycle timings, true GPU failure/recovery, and OS reduced-motion/forced-colours paths are documented from source; no profiling or hardware-wide guarantee is claimed.
- Saved 26 screenshots and embedded each with a relative repository path. All 199 local link references (122 unique targets), all 19 project destinations, all 7 industry fragments, and referenced project media resolved against current files/data after writing.
- Website-source integrity was compared before and after documentation; existing source/configuration/assets were preserved. Existing repository changes from earlier work were not reverted.

To maintain this reference, re-check the component tree and the complete stylesheet cascade before updating any dimensions. Re-capture affected routes and section states, preserve the stated CSS viewport in captions, and distinguish observed runtime behavior from source-only fallbacks. Do not copy historical requests or unused component designs into the current specification without confirming they are mounted.
