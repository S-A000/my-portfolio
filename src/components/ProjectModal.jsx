import { useEffect, useRef } from 'react'
import { Check, ExternalLink, Github, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const Section = ({ title, children }) => <section className="modal-section"><h3>{title}</h3>{children}</section>

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!project) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    const first = dialog?.querySelector('button, a[href]')
    first?.focus()
    const keydown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialog) {
        const items = [...dialog.querySelectorAll('button, a[href]')].filter((item) => !item.hasAttribute('disabled'))
        if (!items.length) return
        const start = items[0]; const end = items.at(-1)
        if (event.shiftKey && document.activeElement === start) { event.preventDefault(); end.focus() }
        else if (!event.shiftKey && document.activeElement === end) { event.preventDefault(); start.focus() }
      }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', keydown) }
  }, [project, onClose])

  return <AnimatePresence>{project && (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div ref={dialogRef} className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, scale: .96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close project details"><X /></button>
        <div className="modal-hero"><img src={project.image} alt={project.alt} width="1280" height="720" /><div className="modal-hero__copy"><span className="eyebrow">{project.status}</span><h2 id="modal-title">{project.title}</h2><p>{project.category}</p>{project.link && <a className="button button--light" href={project.link.url} target="_blank" rel="noopener noreferrer">{project.link.label === 'GitHub' ? <Github /> : <ExternalLink />} View {project.link.label}</a>}</div></div>
        <div className="modal-body">
          <div className="modal-lead"><div><span className="match">Selected work</span><h3>Overview</h3><p>{project.overview}</p></div><div className="modal-meta"><p><b>Status:</b> {project.status}</p><p><b>Focus:</b> {project.category}</p><p><b>Stack:</b> {project.tech.join(', ')}</p></div></div>
          <div className="modal-grid">
            <Section title="Problem addressed"><p>{project.problem}</p></Section>
            <Section title="What I built"><p>{project.built}</p></Section>
            <Section title="Architecture / workflow"><ol>{project.architecture.map((item) => <li key={item}>{item}</li>)}</ol></Section>
            <Section title="Key features"><ul className="check-list">{project.features.map((item) => <li key={item}><Check /> {item}</li>)}</ul></Section>
            <Section title="Personal contribution"><p>{project.contribution}</p></Section>
            {project.outcomes.length > 0 && <Section title="Verified outcomes"><ul className="metric-list">{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></Section>}
          </div>
          {project.gallery?.length > 0 && <Section title="Project gallery"><div className="modal-gallery">{project.gallery.map(([src, alt]) => <img key={src} src={src} alt={alt} width="640" height="360" loading="lazy" />)}</div></Section>}
        </div>
      </motion.div>
    </motion.div>
  )}</AnimatePresence>
}
