import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, ExternalLink, ImageOff, X } from 'lucide-react'
import { pastProjects } from '../data/projectsData'
import TechnologyBadge from './TechnologyBadge'

const ALL_PROJECTS = 'All projects'
const FILTERS = [ALL_PROJECTS, 'AI & Computer Vision', 'MLOps & Data', 'Cybersecurity', 'Enterprise Software', 'Developer Tools']

const filterTerms = {
  'AI & Computer Vision': ['ai', 'machine learning', 'deep learning', 'computer vision', 'forecast', 'pinn', 'nlp', 'vision'],
  'MLOps & Data': ['mlops', 'data', 'etl', 'eda', 'pipeline', 'bigquery', 'sql', 'forecast'],
  Cybersecurity: ['cyber', 'security', 'waf', 'deepguard', 'fraud', 'forensic'],
  'Enterprise Software': ['enterprise', 'custom software', 'industrial', 'wpf', '.net'],
  'Developer Tools': ['developer tool', 'automation', 'cli', 'extension', 'downloader', 'utility'],
}

const projectMap = new Map(pastProjects.map((project) => [project.id, project]))
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const projectFromLocation = () => {
  const projectId = new URLSearchParams(window.location.search).get('project')
  return projectId ? projectMap.get(projectId) || null : null
}

const matchesFilter = (project, filter) => {
  if (filter === ALL_PROJECTS) return true
  const searchable = `${project.id} ${project.title} ${project.category} ${project.status} ${project.tech?.join(' ') || ''}`.toLowerCase()
  return filterTerms[filter].some((term) => searchable.includes(term))
}

const initials = (title) => title
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0])
  .join('')
  .toUpperCase()

function ProjectArtwork({ project, eager = false }) {
  const [failed, setFailed] = useState(false)

  if (project.image && !failed) {
    return (
      <img
        src={project.image}
        alt={project.alt || `${project.title} project preview`}
        width="1200"
        height="675"
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div className="project-artwork-fallback" role="img" aria-label={`${project.title} project artwork placeholder`}>
      <ImageOff aria-hidden="true" />
      <strong>{initials(project.title)}</strong>
      <span>{project.category}</span>
    </div>
  )
}

function ProjectLinks({ project, className = '' }) {
  const links = project.links?.filter((link) => (
    !link.label.toLowerCase().includes('github') && !link.url.includes('github.com')
  )) || []
  if (!links.length) return null

  return (
    <div className={className} aria-label={`Resources for ${project.title}`}>
      {links.map((link) => (
        <a href={link.url} target="_blank" rel="noreferrer" key={`${link.label}-${link.url}`}>
          <span>{link.label}</span><ExternalLink aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

function ProjectCard({ project, index, onOpen }) {
  const buttonRef = useRef(null)
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      className="project-card"
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.24 }}
    >
      <div className="project-card__media">
        <ProjectArtwork project={project} />
        <span>{project.status}</span>
        <small>{String(index + 1).padStart(2, '0')}</small>
      </div>
      <div className="project-card__body">
        <p>{project.category}</p>
        <h2>{project.title}</h2>
        <p className="project-card__summary">{project.summary}</p>
        <ul aria-label={`Technology used for ${project.title}`}>
          {project.tech.slice(0, 4).map((item) => <li key={item}><TechnologyBadge name={item} compact /></li>)}
        </ul>
        <div className="project-card__footer">
          <ProjectLinks project={project} className="project-card__links" />
          <button ref={buttonRef} type="button" onClick={() => onOpen(project, buttonRef.current)} aria-haspopup="dialog">
            View details <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function DetailBlock({ title, children, className = '' }) {
  return <section className={`project-dialog__block ${className}`.trim()}><h3>{title}</h3>{children}</section>
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!project) return undefined
    const previousOverflow = document.body.style.overflow
    const dialog = dialogRef.current
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => dialog?.querySelector('[data-close]')?.focus())

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll(focusableSelector)]
        .filter((element) => !element.hasAttribute('disabled'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-dialog-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
        >
          <motion.div
            ref={dialogRef}
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            aria-describedby="project-dialog-summary"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="project-dialog__close" type="button" onClick={onClose} aria-label="Close project details" data-close>
              <X aria-hidden="true" />
            </button>
            <div className="project-dialog__hero">
              <div className="project-dialog__media"><ProjectArtwork project={project} eager /></div>
              <div>
                <p>{project.status} <span>/</span> {project.category}</p>
                <h2 id="project-dialog-title">{project.title}</h2>
                <p id="project-dialog-summary">{project.overview || project.summary}</p>
                <ProjectLinks project={project} className="project-dialog__links" />
              </div>
            </div>

            <div className="project-dialog__content">
              {project.problem && <DetailBlock title="Problem addressed"><p>{project.problem}</p></DetailBlock>}
              {project.built && <DetailBlock title="What was built"><p>{project.built}</p></DetailBlock>}
              {project.architecture?.length > 0 && (
                <DetailBlock title="Architecture / workflow" className="project-dialog__wide">
                  <ol className="project-dialog__flow">{project.architecture.map((item) => <li key={item}>{item}</li>)}</ol>
                </DetailBlock>
              )}
              {project.features?.length > 0 && (
                <DetailBlock title="Key features">
                  <ul className="project-dialog__features">{project.features.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
                </DetailBlock>
              )}
              {project.contribution && <DetailBlock title="Contribution"><p>{project.contribution}</p></DetailBlock>}
              {project.outcomes?.length > 0 && <DetailBlock title="Outcomes"><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></DetailBlock>}
              <DetailBlock title="Technology" className="project-dialog__wide">
                <ul className="project-dialog__stack">{project.tech.map((item) => <li key={item}><TechnologyBadge name={item} /></li>)}</ul>
              </DetailBlock>
              {project.gallery?.length > 0 && (
                <DetailBlock title="Project gallery" className="project-dialog__wide">
                  <div className="project-dialog__gallery">
                    {project.gallery.map(([src, alt]) => <img src={src} alt={alt} width="640" height="360" loading="lazy" key={src} />)}
                  </div>
                </DetailBlock>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProjectLibrary() {
  const [activeFilter, setActiveFilter] = useState(ALL_PROJECTS)
  const [selectedProject, setSelectedProject] = useState(projectFromLocation)
  const triggerRef = useRef(null)
  const gridId = useId()

  const projects = useMemo(
    () => pastProjects.filter((project) => matchesFilter(project, activeFilter)),
    [activeFilter],
  )

  useEffect(() => {
    const handlePopState = () => setSelectedProject(projectFromLocation())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const openProject = useCallback((project, trigger) => {
    triggerRef.current = trigger
    setSelectedProject(project)
    const url = new URL(window.location.href)
    url.searchParams.set('project', project.id)
    window.history.pushState({ project: project.id }, '', url)
  }, [])

  const closeProject = useCallback(() => {
    setSelectedProject(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('project')
    window.history.replaceState({}, '', url)
    window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }, [])

  return (
    <>
      <section className="project-library section" aria-labelledby="project-library-title">
        <div className="shell">
          <header className="section-intro section-intro--split">
            <div>
              <p className="eyebrow"><span /> Project library</p>
              <h2 id="project-library-title">Production work, tools, prototypes, and research.</h2>
            </div>
            <p>Filter the complete 18-project archive, then open any project for its problem, workflow, contribution, technology, and available supporting material.</p>
          </header>

          <div className="project-library__toolbar">
            <div role="group" aria-label="Filter projects by category">
              {FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={activeFilter === filter ? 'is-active' : ''}
                  aria-pressed={activeFilter === filter}
                  aria-controls={gridId}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <p role="status" aria-live="polite"><strong>{String(projects.length).padStart(2, '0')}</strong> {projects.length === 1 ? 'project' : 'projects'} shown</p>
          </div>

          <motion.div className="project-library__grid" id={gridId} layout>
            <AnimatePresence initial={false} mode="popLayout">
              {projects.map((project) => (
                <ProjectCard project={project} index={pastProjects.indexOf(project)} onOpen={openProject} key={project.id} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <ProjectDialog project={selectedProject} onClose={closeProject} />
    </>
  )
}
