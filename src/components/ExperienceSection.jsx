import { BriefcaseBusiness } from 'lucide-react'
import { experience } from '../data/experience'

export default function ExperienceSection() {
  return <section className="content-section split-section" id="experience" aria-labelledby="experience-title"><div className="section-heading section-heading--sticky"><span>Professional experience</span><h2 id="experience-title">Building in real delivery environments</h2><p>Hands-on work across production-minded machine learning and software development.</p></div><div className="timeline">{experience.map((item, index) => <article className="timeline-item" key={item.role}><div className="timeline-index">0{index + 1}</div><div><div className="timeline-title"><span className="timeline-icon"><BriefcaseBusiness /></span><div><h3>{item.role}</h3><p>{item.company}{item.period && <> · {item.period}</>}</p></div></div><p>{item.description}</p><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div></article>)}</div></section>
}
