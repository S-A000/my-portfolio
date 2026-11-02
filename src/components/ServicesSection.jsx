import { BrainCircuit, Check, Code2, Database, ServerCog, ShieldCheck } from 'lucide-react'
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
        <span>Core engineering pillars</span>
        <h2 id="services-title">Systems engineered for production, scale, and resilience.</h2>
        <p>
          Five integrated practices move complex initiatives from architecture through secure,
          observable delivery.
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

                <div className="services__focus">
                  <span>Engineering focus</span>
                  <p>{pillar.focus}</p>
                </div>

                <div className="services__deliverables">
                  <h4>Core deliverables</h4>
                  <ul>
                    {pillar.deliverables.map((deliverable) => (
                      <li key={deliverable}>
                        <Check aria-hidden="true" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ul className="services__stack" aria-label={`${pillar.title} technology stack`}>
                  {pillar.stack.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
