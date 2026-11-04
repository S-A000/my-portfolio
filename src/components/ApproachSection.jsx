import { ArrowDownRight } from 'lucide-react'
import { approachSteps } from '../data/agencyData'

export default function ApproachSection() {
  return (
    <section className="approach section" id="approach" aria-labelledby="approach-title">
      <div className="shell">
        <header className="section-intro section-intro--split">
          <div>
            <p className="eyebrow"><span /> How the work moves</p>
            <h2 id="approach-title">A practical path from uncertainty to a working system.</h2>
          </div>
          <p>
            The exact engagement changes with the project. The operating rhythm stays clear:
            understand the constraint, make the architecture explicit, then build and learn from use.
          </p>
        </header>

        <ol className="approach__steps">
          {approachSteps.map((step, index) => (
            <li key={step.number}>
              <div className="approach__step-head">
                <span>{step.number}</span>
                {index < approachSteps.length - 1 && <ArrowDownRight aria-hidden="true" />}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
