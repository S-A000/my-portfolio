import { ExternalLink, Github, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProjectCard({ project, onOpen }) {
  const activate = (event) => onOpen(project, event.currentTarget)
  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(event) }
  }
  return (
    <motion.article className="project-card" tabIndex="0" role="button" aria-label={`Open details for ${project.title}`} onClick={activate} onKeyDown={onKeyDown} whileHover={{ y: -9, scale: 1.06 }} transition={{ delay: .2, duration: .32, ease: [.22, 1, .36, 1] }}>
      <img src={project.image} alt={project.alt} width="640" height="360" loading={project.featured ? 'eager' : 'lazy'} />
      <div className="project-card__shade" />
      <div className="project-card__label"><span>{project.status}</span><h3>{project.title}</h3></div>
      <div className="project-preview">
        <div className="project-preview__actions">
          {project.link && <a href={project.link.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} on ${project.link.label}`} onClick={(event) => event.stopPropagation()}>{project.link.label === 'GitHub' ? <Github /> : <ExternalLink />}</a>}
          <button type="button" aria-label={`More information about ${project.title}`} onClick={(event) => { event.stopPropagation(); onOpen(project, event.currentTarget) }}><Info /></button>
        </div>
        <p>{project.summary}</p>
        <div className="chips">{project.tech.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
      </div>
    </motion.article>
  )
}
