import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { URL } from 'node:url'
import { caseStudyMeta, siteOrigin } from '../src/data/caseStudyMeta.js'

assert.equal(siteOrigin, 'https://samintelligencegroup.com', 'siteOrigin must use canonical domain')

const rootHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
assert.ok(rootHtml.includes(`rel="canonical" href="${siteOrigin}/"`), '/: canonical')
assert.ok(rootHtml.includes(`content="${siteOrigin}/social-preview.png"`), '/: social image metadata')
assert.ok(!rootHtml.includes('my-portfolio-nine-nu-52.vercel.app'), '/: no legacy vercel domain')
process.stdout.write('/: static title, canonical and social image verified\n')

for (const [route, meta] of Object.entries(caseStudyMeta)) {
  const html = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8')
  assert.ok(html.includes(`<title>${meta.title.replaceAll('&', '&amp;')}</title>`), `${route}: static title`)
  assert.ok(html.includes(`rel="canonical" href="${siteOrigin}${route}"`), `${route}: canonical`)
  assert.ok(html.includes(`property="og:url" content="${siteOrigin}${route}"`), `${route}: og:url`)
  assert.ok(html.includes(`content="${siteOrigin}${meta.image}"`), `${route}: social image metadata`)
  assert.ok(existsSync(new URL(`../dist${meta.image}`, import.meta.url)), `${route}: social image exists`)
  assert.ok(!html.includes('my-portfolio-nine-nu-52.vercel.app'), `${route}: no legacy vercel domain`)
  process.stdout.write(`${route}: static title, canonical and social image verified\n`)
}
