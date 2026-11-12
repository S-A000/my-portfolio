import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { caseStudyMeta, siteOrigin } from '../src/data/caseStudyMeta.js'

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
export default function caseStudySeo() {
  let output
  return { name: 'case-study-route-metadata', apply: 'build', configResolved(config) { output = resolve(config.root, config.build.outDir) }, closeBundle() {
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
      const target = resolve(output, path.slice(1))
      mkdirSync(target, { recursive: true })
      writeFileSync(resolve(target, 'index.html'), html)
    }
  }}
}
