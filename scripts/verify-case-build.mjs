import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { URL } from 'node:url'
import { caseStudyMeta, siteOrigin } from '../src/data/caseStudyMeta.js'

assert.equal(siteOrigin, 'https://samintelligencegroup.com', 'siteOrigin must use canonical domain')

for (const indexingFile of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt']) {
  const fileUrl = new URL(`../dist/${indexingFile}`, import.meta.url)
  assert.ok(existsSync(fileUrl), `dist/${indexingFile} exists`)
  const text = readFileSync(fileUrl, 'utf8')
  assert.ok(text.includes(siteOrigin), `dist/${indexingFile} references ${siteOrigin}`)
  assert.ok(!text.includes('my-portfolio-nine-nu-52.vercel.app'), `dist/${indexingFile} has no legacy vercel domain`)
  process.stdout.write(`dist/${indexingFile}: verified\n`)
}

const rootHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
assert.ok(rootHtml.includes(`rel="canonical" href="${siteOrigin}/"`), '/: canonical')
assert.ok(rootHtml.includes(`content="${siteOrigin}/social-preview.png"`), '/: social image metadata')
assert.ok(rootHtml.includes('id="static-seo-shell"'), '/: crawlable fallback HTML shell')
assert.ok(rootHtml.includes('<h1>Engineering the systems behind the next decision.</h1>'), '/: crawlable h1')
assert.ok(!rootHtml.includes('my-portfolio-nine-nu-52.vercel.app'), '/: no legacy vercel domain')
process.stdout.write('/: static title, canonical, crawlable shell and social image verified\n')

for (const [route, meta] of Object.entries(caseStudyMeta)) {
  const html = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8')
  assert.ok(html.includes(`<title>${meta.title.replaceAll('&', '&amp;')}</title>`), `${route}: static title`)
  assert.ok(html.includes(`rel="canonical" href="${siteOrigin}${route}"`), `${route}: canonical`)
  assert.ok(html.includes(`property="og:url" content="${siteOrigin}${route}"`), `${route}: og:url`)
  assert.ok(html.includes(`content="${siteOrigin}${meta.image}"`), `${route}: social image metadata`)
  assert.ok(html.includes(`data-route="${route}"`), `${route}: crawlable route shell`)
  assert.ok(html.includes(`<h1>${meta.heading.replaceAll('&', '&amp;')}</h1>`), `${route}: crawlable h1`)
  assert.ok(existsSync(new URL(`../dist${meta.image}`, import.meta.url)), `${route}: social image exists`)
  assert.ok(!html.includes('my-portfolio-nine-nu-52.vercel.app'), `${route}: no legacy vercel domain`)
  process.stdout.write(`${route}: static title, canonical, crawlable shell and social image verified\n`)
}
