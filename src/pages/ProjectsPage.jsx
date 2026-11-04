import { ArrowRight } from 'lucide-react'
import ProjectLibrary from '../components/ProjectLibrary'
import usePageMeta from '../hooks/usePageMeta'

export default function ProjectsPage() {
  usePageMeta({
    title: 'Work & Projects | SAM Intelligence Group',
    description: 'Explore 18 SAM Intelligence Group projects across data engineering, MLOps, custom software, AI, computer vision, cybersecurity, and developer tooling.',
  })

  return (
    <div className="projects-page">
      <section className="page-hero page-hero--projects" aria-labelledby="projects-page-title">
        <div className="page-hero__grid shell">
          <div>
            <p className="eyebrow"><span /> Work / projects</p>
            <h1 id="projects-page-title">A working archive, not a wall of claims.</h1>
          </div>
          <div className="page-hero__summary">
            <p>Explore systems, tools, prototypes, and research with the maturity of each project stated clearly.</p>
            <a className="text-link" href="/#contact">Discuss a related project <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="page-hero__signal" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>
      <ProjectLibrary />
      <section className="page-cta section">
        <div className="page-cta__inner shell">
          <p className="eyebrow"><span /> Your context is different</p>
          <h2>Use the portfolio as evidence, not a one-size-fits-all package.</h2>
          <p>Share the workflow, data, and constraints behind the system you need.</p>
          <a className="button button--primary" href="/#contact">Start a project brief <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>
    </div>
  )
}
