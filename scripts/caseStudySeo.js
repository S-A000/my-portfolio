import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { caseStudyMeta, siteOrigin } from '../src/data/caseStudyMeta.js'

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
export default function caseStudySeo() {
  let output
  return { name: 'case-study-route-metadata', apply: 'build', configResolved(config) { output = resolve(config.root, config.build.outDir) }, closeBundle() {
    const base = readFileSync(resolve(output, 'index.html'), 'utf8')
    for (const [path, meta] of Object.entries(caseStudyMeta)) {
      let html = base.replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      for (const [key,value] of Object.entries({description:meta.description,'og:title':meta.title,'og:description':meta.description,'og:image':siteOrigin+meta.image,'og:image:alt':meta.title,'twitter:title':meta.title,'twitter:description':meta.description,'twitter:image':siteOrigin+meta.image})) {
        const attr=key.startsWith('og:')?'property':'name'
        html=html.replace(new RegExp(`<meta ${attr}="${key}" content="[^"]*"[^>]*>`),`<meta ${attr}="${key}" content="${escape(value)}" />`)
      }
      html=html.replace('</head>',`<link rel="canonical" href="${siteOrigin+path}" /><meta property="og:url" content="${siteOrigin+path}" /></head>`)
      const target=resolve(output,path.slice(1));mkdirSync(target,{recursive:true});writeFileSync(resolve(target,'index.html'),html)
    }
  }}
}
