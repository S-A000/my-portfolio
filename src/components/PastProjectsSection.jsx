import { pastProjects } from '../data/projectsData'

export default function PastProjectsSection() {
  return (
    <section className="past-projects content-section" id="projects" aria-labelledby="past-projects-title">
      <header className="past-projects__heading section-heading">
        <span>Selected work</span>
        <h2 id="past-projects-title">Ideas engineered into working systems.</h2>
        <p>
          A selection of enterprise software, applied intelligence, data platforms, and specialist
          digital products shaped around real operational needs.
        </p>
      </header>

      <div className="past-projects__grid">
        {pastProjects.map((project, index) => {
          return (
            <article className={`past-project-card past-project-card--tone-${index % 5}`} key={project.id}>
              <div className="past-project-card__body">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <a
                  className="past-project-card__link"
                  href="#contact"
                  aria-label={`Discuss a project like ${project.title}`}
                >
                  Discuss a similar project <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="past-project-card__wave" aria-hidden="true"><span /><i /></div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
