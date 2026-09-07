import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { searchProjects } from '../data/projects'

export default function SearchOverlay({ open, onClose, onOpenProject }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const results = useMemo(() => searchProjects(query), [query])
  useEffect(() => {
    if (!open) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    const keydown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', keydown) }
  }, [open, onClose])
  const select = (project, event) => { onClose(); onOpenProject(project, event.currentTarget) }

  return <AnimatePresence>{open && <motion.div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <div className="search-overlay__top"><label className="search-field"><Search /><span className="sr-only">Search projects</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, technologies, categories…" /></label><button className="search-close" type="button" onClick={onClose}><X /> <span>Close</span></button></div>
    <div className="search-results" aria-live="polite"><div className="search-results__count">{results.length} {results.length === 1 ? 'result' : 'results'}</div>{results.length ? results.map((project) => <button type="button" key={project.id} className="search-result" onClick={(event) => select(project, event)}><img src={project.image} alt="" width="240" height="135" /><span><b>{project.title}</b><small>{project.category}</small><em>{project.summary}</em></span></button>) : <div className="empty-state"><Search /><h2>No projects found</h2><p>Try a broader term such as Python, MLOps, computer vision or automation.</p></div>}</div>
  </motion.div>}</AnimatePresence>
}
