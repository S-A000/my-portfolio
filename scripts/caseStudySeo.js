import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { caseStudyMeta, siteOrigin } from '../src/data/caseStudyMeta.js'

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

const buildStaticShell = (path, meta) => {
  const items = (meta.highlights || [])
    .map(item => `          <li>${escape(item)}</li>`)
    .join('\n')
  return `<div id="root">
      <main id="static-seo-shell" data-route="${escape(path)}">
        <h1>${escape(meta.heading || meta.title)}</h1>
        <p>${escape(meta.summary || meta.description)}</p>
        <ul>
${items}
        </ul>
        <nav aria-label="Static site directory">
          <a href="/">Home</a> |
          <a href="/industries">Industries &amp; Solutions</a> |
          <a href="/case-studies">Case Studies</a> |
          <a href="/case-studies/lobatse-pharmacy">Lobatse Pharmacy Case Study</a> |
          <a href="/case-studies/aqi-forecasting">AQI Forecasting Case Study</a> |
          <a href="/projects">Work &amp; Projects</a> |
          <a href="/about">About SAM Intelligence Group</a> |
          <a href="mailto:contact@samintelligencegroup.com">contact@samintelligencegroup.com</a>
        </nav>
      </main>
    </div>`
}

export default function caseStudySeo() {
  let output
  return {
    name: 'case-study-route-metadata',
    apply: 'build',
    configResolved(config) {
      output = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const base = readFileSync(resolve(output, 'index.html'), 'utf8')
      for (const [path, meta] of Object.entries(caseStudyMeta)) {
        const canonicalUrl = `${siteOrigin}${path}`
        let html = base.replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
        for (const [key, value] of Object.entries({
          description: meta.description,
          'og:title': meta.title,
          'og:description': meta.description,
          'og:url': canonicalUrl,
          'og:image': siteOrigin + meta.image,
          'og:image:alt': meta.title,
          'twitter:title': meta.title,
          'twitter:description': meta.description,
          'twitter:image': siteOrigin + meta.image,
        })) {
          const attr = key.startsWith('og:') ? 'property' : 'name'
          html = html.replace(new RegExp(`<meta ${attr}="${key}" content="[^"]*"[^>]*>`), `<meta ${attr}="${key}" content="${escape(value)}" />`)
        }
        if (/<link rel="canonical" href="[^"]*"[^>]*>/.test(html)) {
          html = html.replace(/<link rel="canonical" href="[^"]*"[^>]*>/, `<link rel="canonical" href="${canonicalUrl}" />`)
        } else {
          html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" /></head>`)
        }
        html = html.replace(/<div id="root">[\s\S]*?<\/main>\s*<\/div>/, buildStaticShell(path, meta))
        const target = resolve(output, path.slice(1))
        mkdirSync(target, { recursive: true })
        writeFileSync(resolve(target, 'index.html'), html)
      }
    },
  }
}
