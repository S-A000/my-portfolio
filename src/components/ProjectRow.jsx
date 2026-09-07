import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProjectCard from './ProjectCard'

export default function ProjectRow({ name, projects, onOpen }) {
  const rowRef = useRef(null)
  const scroll = (direction) => rowRef.current?.scrollBy({ left: direction * rowRef.current.clientWidth * .82, behavior: 'smooth' })
  return (
    <section className="project-row" aria-labelledby={`row-${name.replaceAll(' ', '-').toLowerCase()}`}>
      <div className="project-row__heading"><h2 id={`row-${name.replaceAll(' ', '-').toLowerCase()}`}>{name}</h2><span>{String(projects.length).padStart(2, '0')} projects</span></div>
      <div className="project-row__shell">
        <button type="button" className="row-arrow row-arrow--left" onClick={() => scroll(-1)} aria-label={`Scroll ${name} left`}><ChevronLeft /></button>
        <div className="project-row__track" ref={rowRef}>{projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
        <button type="button" className="row-arrow row-arrow--right" onClick={() => scroll(1)} aria-label={`Scroll ${name} right`}><ChevronRight /></button>
      </div>
    </section>
  )
}
