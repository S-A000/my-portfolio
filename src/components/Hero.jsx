import { ArrowDown, ArrowRight, Database, Gauge, ShieldCheck, Workflow } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { trustMetrics } from '../data/agencyData'

const metricIcons = [Workflow, Database, ShieldCheck, Gauge]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className="hero__grid-lines" aria-hidden="true" />

        <motion.div
          className="hero__content"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__badge">
            <span aria-hidden="true" />
            Enterprise AI <b>•</b> MLOps <b>•</b> Data <b>•</b> Cyber Defense
          </div>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-light">Autonomous AI &amp; Data Systems</span>
            <span className="hero__title-dark">Engineered for Enterprise Scale</span>
          </h1>

          <p className="hero__description">
            SAM Intelligence Group builds production-grade AI architectures, automated data pipelines,
            resilient MLOps infrastructure, and proactive cyber defense.
          </p>

          <a className="hero__action" href="#services">
            Explore Capabilities <ArrowRight aria-hidden="true" />
          </a>
        </motion.div>

        <dl className="hero__trust-strip" aria-label="SAM Intelligence Group capabilities">
          {trustMetrics.map(({ value, label }, index) => {
            const Icon = metricIcons[index]
            return (
              <div className={`hero__metric${index === 2 ? ' hero__metric--active' : ''}`} key={value}>
                <Icon aria-hidden="true" />
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            )
          })}
        </dl>

        <a className="hero__scroll-cue" href="#services" aria-label="Scroll to services">
          <span>Scroll to explore</span><ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
