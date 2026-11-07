import { useEffect } from 'react'

const setMeta = (selector, content) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [, key, value] = selector.match(/\[(name|property)="([^"]+)"\]/)
    element.setAttribute(key, value)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export default function usePageMeta({ title, description, path = window.location.pathname, image = '/social-preview.png' }) {
  useEffect(() => {
    const previousTitle = document.title
    const descriptionElement = document.head.querySelector('meta[name="description"]')
    const previousDescription = descriptionElement?.getAttribute('content') || ''

    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    const origin = 'https://my-portfolio-nine-nu-52.vercel.app'
    const url = origin + (path.replace(/\/+$/, '') || '/')
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = url
    setMeta('meta[property="og:url"]', url)
    setMeta('meta[property="og:image"]', origin + image)
    setMeta('meta[name="twitter:image"]', origin + image)
    setMeta('meta[property="og:image:alt"]', title)

    return () => {
      document.title = previousTitle
      setMeta('meta[name="description"]', previousDescription)
    }
  }, [description, title, path, image])
}
