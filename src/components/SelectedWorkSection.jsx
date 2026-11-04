import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { selectedProjectIds } from '../data/agencyData'
import { pastProjects } from '../data/projectsData'

const selectedProjects = selectedProjectIds
  .map((id) => pastProjects.find((project) => project.id === id))
  .filter(Boolean)

export default function SelectedWorkSection() {
  return (
    <section className="selected-work section" id="work" aria-labelledby="selected-work-title">
      <div className="shell">
        <header className="section-intro section-intro--split">
          <div>
            <p className="eyebrow"><span /> Selected work</p>
            <h2 id="selected-work-title">Evidence across systems, software, and research.</h2>
          </div>
          <div className="section-intro__action">
            <p>Every item is drawn from the existing project library and labelled by its actual maturity.</p>
            <a href="/projects">Explore all 18 projects <ArrowRight aria-hidden="true" /></a>
          </div>
        </header>

        <div className="selected-work__grid">
          {selectedProjects.map((project, index) => (
            <article className={`work-card work-card--${index + 1}`} key={project.id}>
              <a href={`/projects?project=${project.id}`} aria-label={`View details for ${project.title}`}>
                <div className="work-card__visual">
                  {project.image ? (
                    <img src={project.image} alt={project.alt || ''} width="1200" height="675" loading="lazy" />
                  ) : (
                    <div className="work-card__fallback" aria-hidden="true">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <i /><i /><i />
                    </div>
                  )}
                  <span className="work-card__status">{project.status}</span>
                </div>
                <div className="work-card__copy">
                  <p>{project.category}</p>
                  <h3>{project.title}</h3>
                  <span>Open project <ArrowUpRight aria-hidden="true" /></span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
