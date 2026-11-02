import { ArrowUpRight, Atom, BrainCircuit, Network, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { brand, leadership } from '../data/agencyData'
import SectionHeading from './SectionHeading'

const focusIcons = [Network, BrainCircuit, ShieldCheck, Atom]

export default function LeadershipSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="section leadership-section" id="leadership" aria-labelledby="leadership-title">
      <SectionHeading
        eyebrow="Leadership"
        title="Technical leadership, close to the architecture."
        description="Strategy stays connected to implementation—from first system boundary to production hardening."
        id="leadership-title"
      />

      <motion.div
        className="leadership-panel glass-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="leadership-panel__identity">
          <div className="leadership-monogram" aria-hidden="true"><span>S</span><i /></div>
          <div>
            <span className="status-label">Founder-led engineering</span>
            <h3>{leadership.name}</h3>
            <p className="leadership-role">{leadership.role}</p>
          </div>
        </div>

        <div className="leadership-panel__story">
          <p className="leadership-lead">{leadership.summary}</p>
          <p>{leadership.detail}</p>
          <a href={brand.github} target="_blank" rel="noreferrer" className="text-link">
            Explore the GitHub portfolio <ArrowUpRight aria-hidden="true" />
          </a>
        </div>

        <div className="leadership-focus" aria-label="Leadership focus areas">
          {leadership.focusAreas.map((area, index) => {
            const Icon = focusIcons[index]
            return <div className="leadership-focus__item" key={area}><Icon aria-hidden="true" /><span>{area}</span></div>
          })}
        </div>
      </motion.div>
    </section>
  )
}
