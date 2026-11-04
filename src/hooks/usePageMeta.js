import { useEffect } from 'react'

const setMeta = (selector, content) => {
  const element = document.head.querySelector(selector)
  if (element) element.setAttribute('content', content)
}

export default function usePageMeta({ title, description }) {
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

    return () => {
      document.title = previousTitle
      setMeta('meta[name="description"]', previousDescription)
    }
  }, [description, title])
}
