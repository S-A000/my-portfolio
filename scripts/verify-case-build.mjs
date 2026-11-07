import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { URL } from 'node:url'
import { caseStudyMeta, siteOrigin } from '../src/data/caseStudyMeta.js'

for (const [route, meta] of Object.entries(caseStudyMeta)) {
  const html = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8')
  assert.ok(html.includes(`<title>${meta.title.replaceAll('&', '&amp;')}</title>`), `${route}: static title`)
  assert.ok(html.includes(`rel="canonical" href="${siteOrigin}${route}"`), `${route}: canonical`)
  assert.ok(html.includes(`content="${siteOrigin}${meta.image}"`), `${route}: social image metadata`)
  assert.ok(existsSync(new URL(`../dist${meta.image}`, import.meta.url)), `${route}: social image exists`)
  process.stdout.write(`${route}: static title, canonical and social image verified\n`)
}
