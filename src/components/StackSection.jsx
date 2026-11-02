import { BrainCircuit, Code2, Database, ServerCog } from 'lucide-react'
import { technologyGroups } from '../data/agencyData'

const groupIcons = [BrainCircuit, Database, Code2, ServerCog]

export default function StackSection() {
  return (
    <section className="stack-section content-section" id="stack" aria-labelledby="stack-title">
      <div className="stack-section__heading section-heading">
        <span>Technology stack</span>
        <h2 id="stack-title">A production stack built for intelligence at scale.</h2>
        <p>AI, data, backend, frontend, and cloud capabilities are grouped by the role they play in dependable enterprise systems.</p>
      </div>

      <div className="stack-section__matrix">
        {technologyGroups.map((group, groupIndex) => {
          const Icon = groupIcons[groupIndex] ?? ServerCog
          return (
            <article className="stack-group" key={group.label}>
              <header className="stack-group__header">
                <span className="stack-group__index" aria-hidden="true">{group.index}</span>
                <Icon className="stack-group__icon" aria-hidden="true" />
                <h3>{group.label}</h3>
              </header>
              <ul className="stack-group__items" aria-label={`${group.label} technologies`}>
                {group.items.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
