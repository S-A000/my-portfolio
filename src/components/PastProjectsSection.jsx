import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, ExternalLink, Github, ImageOff, X } from 'lucide-react'
import { pastProjects } from '../data/projectsData'

const ALL_PROJECTS = 'All'
const PROJECT_FILTERS = [
  ALL_PROJECTS,
  'AI & Computer Vision',
  'MLOps & Data',
  'Cybersecurity',
  'Enterprise Software',
  'Developer Tools',
]

const projectMatchesFilter = (project, filter) => {
  if (filter === ALL_PROJECTS) return true

  const searchable = `${project.id} ${project.title} ${project.category} ${project.tech?.join(' ') || ''}`.toLowerCase()
  const needles = {
    'AI & Computer Vision': ['ai', 'machine learning', 'deep learning', 'computer vision', 'forecast', 'pinn', 'nlp'],
    'MLOps & Data': ['mlops', 'data', 'etl', 'eda', 'pipeline', 'bigquery', 'sql'],
    Cybersecurity: ['cyber', 'security', 'waf', 'deepguard', 'fraud', 'forensic'],
    'Enterprise Software': ['enterprise', 'custom software', 'industrial', 'wpf', '.net'],
    'Developer Tools': ['developer tool', 'automation', 'cli', 'extension', 'downloader'],
  }

  return needles[filter].some((needle) => searchable.includes(needle))
}

const projectById = new Map(pastProjects.map((project) => [project.id, project]))
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getMonogram = (title) => title
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0])
  .join('')
  .toUpperCase()

function ProjectArtwork({ project, className = '', eager = false }) {
  const [failedImage, setFailedImage] = useState(null)

  if (project.image && failedImage !== project.image) {
    return (
      <img
        className={className}
        src={project.image}
        alt={project.alt || `${project.title} project preview`}
        width="1200"
        height="675"
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailedImage(project.image)}
      />
    )
  }

  return (
    <div
      className={`${className} project-artwork-fallback`.trim()}
      role="img"
      aria-label={`${project.title} project monogram`}
    >
      <ImageOff aria-hidden="true" />
      <span aria-hidden="true">{getMonogram(project.title)}</span>
      <small>{project.category}</small>
    </div>
  )
}

function ProjectLinks({ project, className = '' }) {
  if (!project.links?.length) return null

  return (
    <div className={className} role="group" aria-label={`External resources for ${project.title}`}>
      {project.links.map((link) => {
        const isGithub = link.label.toLowerCase().includes('github')

        return (
          <a
            href={link.url}
            key={`${project.id}-${link.label}-${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            {isGithub && <Github aria-hidden="true" />}
            <span>{link.label}</span>
            <ExternalLink aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}

function ProjectCard({ project, onOpen }) {
  const cardRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const titleId = `past-project-${project.id}-title`

  const openFromSurface = (event) => {
    if (event.target.closest?.('a, button')) return
    onOpen(project, cardRef.current)
  }

  return (
    <motion.article
      ref={cardRef}
      className="past-project-card"
      aria-labelledby={titleId}
      tabIndex={-1}
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onClick={openFromSurface}
    >
      <div className="past-project-card__media">
        <ProjectArtwork project={project} className="past-project-card__image" />
        <span className="past-project-card__status">{project.status}</span>
      </div>

      <div className="past-project-card__body">
        <p className="past-project-card__category">{project.category}</p>
        <h3 id={titleId}>{project.title}</h3>
        <p className="past-project-card__summary">{project.summary}</p>

        {project.tech?.length > 0 && (
          <ul className="past-project-card__tech" aria-label={`Technology used for ${project.title}`}>
            {project.tech.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        )}

        <div className="past-project-card__footer">
          <ProjectLinks project={project} className="past-project-card__links" />
          <button
            className="past-project-card__open"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onOpen(project, event.currentTarget)
            }}
            aria-haspopup="dialog"
          >
            View details
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function DetailSection({ title, children, className = '' }) {
  return (
    <section className={`project-detail-modal__section ${className}`.trim()}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function ProjectDetailModal({ project, onClose, onExited }) {
  const dialogRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!project) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const dialog = dialogRef.current
    dialog?.querySelector('[data-modal-close]')?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog) return

      const focusableItems = [...dialog.querySelectorAll(focusableSelector)]
        .filter((item) => !item.hasAttribute('disabled') && item.getAttribute('aria-hidden') !== 'true')

      if (focusableItems.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstItem = focusableItems[0]
      const lastItem = focusableItems.at(-1)
      const focusIsOutside = !dialog.contains(document.activeElement)

      if (event.shiftKey && (document.activeElement === firstItem || focusIsOutside)) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && (document.activeElement === lastItem || focusIsOutside)) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  return (
    <AnimatePresence onExitComplete={onExited}>
      {project && (
        <motion.div
          className="project-detail-backdrop"
          key="project-detail-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            ref={dialogRef}
            className="project-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-modal-title"
            aria-describedby="project-detail-modal-overview"
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              className="project-detail-modal__close"
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              data-modal-close
            >
              <X aria-hidden="true" />
            </button>

            <div className="project-detail-modal__hero">
              <ProjectArtwork project={project} className="project-detail-modal__image" eager />
              <div className="project-detail-modal__hero-copy">
                <div className="project-detail-modal__meta">
                  <span>{project.status}</span>
                  <span>{project.category}</span>
                </div>
                <h2 id="project-detail-modal-title">{project.title}</h2>
                <p id="project-detail-modal-overview">{project.overview || project.summary}</p>
                <ProjectLinks project={project} className="project-detail-modal__links" />
              </div>
            </div>

            <div className="project-detail-modal__body">
              <div className="project-detail-modal__grid">
                {project.problem && (
                  <DetailSection title="Problem addressed">
                    <p>{project.problem}</p>
                  </DetailSection>
                )}

                {project.built && (
                  <DetailSection title="What was built">
                    <p>{project.built}</p>
                  </DetailSection>
                )}

                {project.architecture?.length > 0 && (
                  <DetailSection title="Architecture / workflow">
                    <ol className="project-detail-modal__architecture">
                      {project.architecture.map((item) => <li key={item}>{item}</li>)}
                    </ol>
                  </DetailSection>
                )}

                {project.features?.length > 0 && (
                  <DetailSection title="Key features">
                    <ul className="project-detail-modal__features">
                      {project.features.map((item) => (
                        <li key={item}>
                          <Check aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailSection>
                )}

                {project.contribution && (
                  <DetailSection title="Contribution">
                    <p>{project.contribution}</p>
                  </DetailSection>
                )}

                {project.outcomes?.length > 0 && (
                  <DetailSection title="Outcomes">
                    <ul className="project-detail-modal__outcomes">
                      {project.outcomes.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </DetailSection>
                )}
              </div>

              {project.tech?.length > 0 && (
                <DetailSection title="Technology stack" className="project-detail-modal__stack-section">
                  <ul className="project-detail-modal__stack" aria-label={`Complete technology stack for ${project.title}`}>
                    {project.tech.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                </DetailSection>
              )}

              {project.gallery?.length > 0 && (
                <DetailSection title="Project gallery" className="project-detail-modal__gallery-section">
                  <div className="project-detail-modal__gallery">
                    {project.gallery.map((entry, index) => {
                      const [src, alt] = Array.isArray(entry)
                        ? entry
                        : [entry.src, entry.alt]

                      return (
                        <img
                          src={src}
                          alt={alt || `${project.title} gallery image ${index + 1}`}
                          width="640"
                          height="360"
                          loading="lazy"
                          key={`${src}-${index}`}
                        />
                      )
                    })}
                  </div>
                </DetailSection>
              )}

              {project.links?.length > 0 && (
                <DetailSection title="Project resources" className="project-detail-modal__resources">
                  <ProjectLinks project={project} className="project-detail-modal__links" />
                </DetailSection>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function PastProjectsSection() {
  const [activeCategory, setActiveCategory] = useState(ALL_PROJECTS)
  const [selectedProject, setSelectedProject] = useState(null)
  const triggerRef = useRef(null)
  const gridId = useId()

  const categories = PROJECT_FILTERS

  const filteredProjects = useMemo(() => {
    return pastProjects.filter((project) => projectMatchesFilter(project, activeCategory))
  }, [activeCategory])

  const restoreTriggerFocus = useCallback(() => {
    const trigger = triggerRef.current
    triggerRef.current = null

    if (trigger?.isConnected) {
      trigger.focus({ preventScroll: true })
    }
  }, [])

  const syncProjectFromUrl = useCallback(() => {
    const url = new URL(window.location.href)
    const projectId = new URLSearchParams(url.search).get('project')
    const project = projectId ? projectById.get(projectId) : null

    if (projectId && !project) {
      url.searchParams.delete('project')
      window.history.replaceState(window.history.state, '', url)
    }

    setSelectedProject(project || null)
  }, [])

  useEffect(() => {
    syncProjectFromUrl()
    window.addEventListener('popstate', syncProjectFromUrl)
    return () => window.removeEventListener('popstate', syncProjectFromUrl)
  }, [syncProjectFromUrl])

  const openProject = useCallback((project, trigger) => {
    triggerRef.current = trigger || document.activeElement
    setSelectedProject(project)

    const url = new URL(window.location.href)
    if (url.searchParams.get('project') === project.id) return

    url.searchParams.set('project', project.id)
    window.history.pushState({ ...(window.history.state || {}), project: project.id }, '', url)
  }, [])

  const closeProject = useCallback(() => {
    setSelectedProject(null)

    const url = new URL(window.location.href)
    if (!url.searchParams.has('project')) return

    url.searchParams.delete('project')
    const nextState = { ...(window.history.state || {}) }
    delete nextState.project
    window.history.replaceState(nextState, '', url)
  }, [])

  const resultLabel = `${filteredProjects.length} ${filteredProjects.length === 1 ? 'project' : 'projects'} shown`

  return (
    <>
      <section className="past-projects content-section" id="projects" aria-labelledby="past-projects-title">
        <header className="past-projects__heading section-heading">
          <span>Selected systems and experiments</span>
          <h2 id="past-projects-title">Past Projects</h2>
          <p>
            Explore production platforms, applied AI research, data infrastructure, developer tools,
            and purpose-built software in one unified project library.
          </p>
        </header>

        <div className="past-projects__toolbar">
          <div className="past-projects__filters" role="group" aria-label="Filter past projects by category">
            {categories.map((category) => {
              const isActive = activeCategory === category

              return (
                <button
                  className={`past-projects__filter${isActive ? ' past-projects__filter--active' : ''}`}
                  type="button"
                  key={category}
                  aria-pressed={isActive}
                  aria-controls={gridId}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <p className="past-projects__count" role="status" aria-live="polite" aria-atomic="true">
            <span aria-hidden="true">{String(filteredProjects.length).padStart(2, '0')}</span>
            {resultLabel}
          </p>
        </div>

        <motion.div className="past-projects__grid" id={gridId} layout>
          <AnimatePresence initial={false} mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard project={project} onOpen={openProject} key={project.id} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <ProjectDetailModal
        project={selectedProject}
        onClose={closeProject}
        onExited={restoreTriggerFocus}
      />
    </>
  )
}
