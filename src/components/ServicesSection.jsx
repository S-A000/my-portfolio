import { BrainCircuit, Code2, Database, ServerCog, ShieldCheck } from 'lucide-react'
import { servicePillars } from '../data/agencyData'

const pillarIcons = {
  'software-engineering': Code2,
  'data-engineering': Database,
  mlops: BrainCircuit,
  cybersecurity: ShieldCheck,
  'aspnet-web-development': ServerCog,
}

export default function ServicesSection() {
  return (
    <section className="services content-section" id="services" aria-labelledby="services-title">
      <header className="services__heading section-heading">
        <span>What we do</span>
        <h2 id="services-title">Integrated technology services for modern enterprises.</h2>
        <p>
          From strategic foundations to production delivery, our teams solve complex technology
          challenges with clarity, rigor, and measurable business focus.
        </p>
      </header>

      <ol className="services__grid" aria-label="SAM Intelligence Group service pillars">
        {servicePillars.map((pillar) => {
          const Icon = pillarIcons[pillar.id]
          const titleId = `service-${pillar.id}-title`

          return (
            <li className={`services__item services__item--${pillar.accent}`} key={pillar.id}>
              <article className="services__card" aria-labelledby={titleId}>
                <div className="services__card-topline">
                  <span className="services__number" aria-hidden="true">{pillar.number}</span>
                  <span className="services__icon" aria-hidden="true">
                    <Icon />
                  </span>
                </div>

                <h3 id={titleId}>{pillar.title}</h3>
                <p className="services__summary">{pillar.executiveSummary}</p>
                <a className="services__link" href="#contact">
                  Learn more <span aria-hidden="true">→</span>
                </a>
                <div className="services__wave" aria-hidden="true"><span /><i /></div>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
