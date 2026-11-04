import { Blocks, Compass, ShieldCheck } from 'lucide-react'
import { aboutUs } from '../data/agencyData'

const valueIcons = [Compass, Blocks, ShieldCheck]

export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-section__inner">
        <div className="about-section__copy">
          <span className="about-section__eyebrow">Who we are</span>
          <h2 id="about-title">{aboutUs.title}</h2>
          <p className="about-section__lead">{aboutUs.summary}</p>
          <p>{aboutUs.detail}</p>
          <a href="#contact">Start a conversation <span aria-hidden="true">→</span></a>
        </div>

        <div className="about-section__values">
          {aboutUs.principles.map((principle, index) => {
            const Icon = valueIcons[index]
            return (
              <article className="about-value" key={principle.title}>
                <span className="about-value__icon" aria-hidden="true"><Icon /></span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
