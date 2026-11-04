import { useId, useMemo, useState } from 'react'
import { CircleAlert, ShieldCheck, TrendingUp, Workflow } from 'lucide-react'
import { caseStudies, caseStudyFilters } from '../data/agencyData'

const narrativeItems = [
  { key: 'challenge', label: 'Challenge', icon: CircleAlert },
  { key: 'architecture', label: 'Architecture', icon: Workflow },
  { key: 'impact', label: 'Impact', icon: TrendingUp },
]

export default function CaseStudiesSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const gridId = useId()

  const filteredStudies = useMemo(() => {
    if (activeFilter === 'All') return caseStudies
    return caseStudies.filter((study) => study.categories.includes(activeFilter))
  }, [activeFilter])

  const resultLabel = `${filteredStudies.length} case ${filteredStudies.length === 1 ? 'study' : 'studies'} shown`

  return (
    <section className="case-studies content-section" id="case-studies" aria-labelledby="case-studies-title">
      <div className="case-studies__heading section-heading">
        <span>Selected engineering outcomes</span>
        <h2 id="case-studies-title">Case studies built around the problem, not the pitch.</h2>
        <p>Explore how focused architectures translate operational constraints into dependable software, data, and AI systems.</p>
      </div>

      <div className="case-studies__toolbar">
        <div className="case-studies__filters" role="group" aria-label="Filter case studies">
          {caseStudyFilters.map((filter) => {
            const isActive = activeFilter === filter
            return (
              <button
                className={`case-studies__filter${isActive ? ' case-studies__filter--active' : ''}`}
                type="button"
                key={filter}
                aria-pressed={isActive}
                aria-controls={gridId}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            )
          })}
        </div>
        <p className="case-studies__count" role="status" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">{String(filteredStudies.length).padStart(2, '0')}</span>
          {resultLabel}
        </p>
      </div>

      <div className="case-studies__grid" id={gridId}>
        {filteredStudies.length === 0 && (
          <div className="case-studies__empty">
            <ShieldCheck aria-hidden="true" />
            <div>
              <h3>Cybersecurity work is featured in the product portfolio.</h3>
              <p>Explore BotShield and DeepGuard for application defense, threat telemetry, and multi-modal forensics.</p>
              <a href="#products">View flagship security products</a>
            </div>
          </div>
        )}
        {filteredStudies.map((study) => (
          <article className="case-study-card" key={study.id}>
            <header className="case-study-card__header">
              <p className="case-study-card__eyebrow">{study.eyebrow}</p>
              <h3>{study.title}</h3>
              <ul className="case-study-card__categories" aria-label="Case study categories">
                {study.categories.map((category) => <li key={category}>{category}</li>)}
              </ul>
            </header>

            <dl className="case-study-card__narrative">
              {narrativeItems.map(({ key, label, icon: Icon }) => (
                <div className="case-study-card__narrative-item" key={key}>
                  <dt><Icon aria-hidden="true" />{label}</dt>
                  <dd>{study[key]}</dd>
                </div>
              ))}
            </dl>

          </article>
        ))}
      </div>
    </section>
  )
}
