import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BrainCircuit, Check, Code2, Database, Sparkles } from 'lucide-react'
import { servicePillars } from '../data/agencyData'
import TechnologyBadge from './TechnologyBadge'
import FoundationDemoScene from '../three/FoundationDemoScene'
import SceneCanvas from '../three/SceneCanvas'

const serviceIcons = [Database, BrainCircuit, Code2, Sparkles]

const serviceVisualLabels = {
  'data-engineering': 'Data sources flow through ingestion and transformation into governed storage and decision dashboards',
  mlops: 'A model artifact moves from feature preparation through training, evaluation, registry, deployment, monitoring, and a retraining feedback loop',
  'web-software': 'One custom software interface assembles across desktop browser, tablet, and phone surfaces with a connected service layer',
  'ai-solutions': 'Documents and structured inputs enter an AI reasoning and automation layer, then move through human review to a traceable output',
}

const dataPipelineStages = [
  'Source devices',
  'Ingestion',
  'Transform hub',
  'Data lake',
  'Analytics',
]

const mlopsDeliveryStages = [
  'Feature bank',
  'Training',
  'Eval + registry',
  'Inference',
  'Monitoring',
  'Retraining loop',
]

const webProductLayers = [
  'Frontend UI',
  'API services',
  'Data layer',
  'Deployment',
]

const aiWorkflowStages = [
  'Inputs',
  'Reasoning core',
  'Insight output',
  'Human review',
]

function WebGLFallback() {
  return (
    <div className="service-foundation__fallback" aria-hidden="true">
      <span className="service-foundation__fallback-orbit" />
      <span className="service-foundation__fallback-core" />
      <span>3D preview unavailable</span>
    </div>
  )
}

export default function ServiceShowcase() {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (typeof window === 'undefined') return 0
    const requestedService = new URLSearchParams(window.location.search).get('service')
    const requestedIndex = servicePillars.findIndex((item) => item.id === requestedService)
    return requestedIndex >= 0 ? requestedIndex : 0
  })
  const tabRefs = useRef([])
  const reduceMotion = useReducedMotion()
  const service = servicePillars[activeIndex]

  useEffect(() => {
    if (window.location.hash !== '#service-visualization') return undefined
    const timer = window.setTimeout(() => {
      document.getElementById('service-visualization')?.scrollIntoView({ block: 'start' })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const select = (index, focus = false) => {
    const next = (index + servicePillars.length) % servicePillars.length
    setActiveIndex(next)
    if (focus) window.requestAnimationFrame(() => tabRefs.current[next]?.focus())
  }

  const handleTabsKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') select(0, true)
    else if (event.key === 'End') select(servicePillars.length - 1, true)
    else select(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), true)
  }

  return (
    <section className="service-showcase section" id="services" aria-labelledby="services-title">
      <div className="service-showcase__header shell">
        <div>
          <p className="eyebrow"><span /> Services / four connected practices</p>
          <h2 id="services-title">Engineering services, shown as systems.</h2>
        </div>
        <p>Move through four original scenes to see how SAM connects inputs, infrastructure, software, and responsible review.</p>
      </div>

      <div className="service-showcase__frame shell">
        <div className="service-showcase__tabs" role="tablist" aria-label="Engineering services" onKeyDown={handleTabsKeyDown}>
          {servicePillars.map((item, index) => {
            const Icon = serviceIcons[index]
            return (
              <button
                ref={(element) => { tabRefs.current[index] = element }}
                type="button"
                role="tab"
                id={`service-tab-${item.id}`}
                aria-selected={activeIndex === index}
                aria-controls={`service-panel-${item.id}`}
                tabIndex={activeIndex === index ? 0 : -1}
                className={activeIndex === index ? 'is-active' : ''}
                onClick={() => select(index)}
                key={item.id}
              >
                <Icon aria-hidden="true" /><strong>{item.shortTitle}</strong>
              </button>
            )
          })}
        </div>

        <div className="service-showcase__stage">
          <article
            className="service-showcase__panel"
            role="tabpanel"
            id={`service-panel-${service.id}`}
            aria-labelledby={`service-tab-${service.id}`}
          >
            <div className="service-showcase__visual" id="service-visualization">
              <SceneCanvas
                ariaLabel={serviceVisualLabels[service.id]}
                fallback={<WebGLFallback />}
                sceneKey={service.id}
              >
                <FoundationDemoScene sceneKey={service.id} />
              </SceneCanvas>
              <AnimatePresence initial={false}>
                {service.id === 'data-engineering' && (
                  <motion.ol
                    className="data-pipeline__labels"
                    aria-label="Data pipeline stages"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    {dataPipelineStages.map((label) => (
                      <li key={label}><strong>{label}</strong></li>
                    ))}
                  </motion.ol>
                )}
                {service.id === 'mlops' && (
                  <motion.ol
                    className="mlops-delivery__labels"
                    aria-label="Model delivery lifecycle stages"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    {mlopsDeliveryStages.map((label) => (
                      <li key={label}><strong>{label}</strong></li>
                    ))}
                  </motion.ol>
                )}
                {service.id === 'web-software' && (
                  <motion.ol
                    className="web-product__labels"
                    aria-label="Connected software product layers"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    {webProductLayers.map((label) => (
                      <li key={label}><strong>{label}</strong></li>
                    ))}
                  </motion.ol>
                )}
                {service.id === 'ai-solutions' && (
                  <motion.ol
                    className="ai-workflow__labels"
                    aria-label="AI workflow stages"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    {aiWorkflowStages.map((label) => (
                      <li key={label}><strong>{label}</strong></li>
                    ))}
                  </motion.ol>
                )}
              </AnimatePresence>
              <div className="service-foundation__legend" aria-hidden="true">
                {service.id === 'data-engineering' ? (
                  <><span>Source assembly</span><i /><span>Packet transform</span><i /><span>Camera pass</span></>
                ) : service.id === 'mlops' ? (
                  <><span>Artifact handoff</span><i /><span>Evaluation gate</span><i /><span>Feedback loop</span></>
                ) : service.id === 'web-software' ? (
                  <><span>Layer assembly</span><i /><span>Depth reveal</span><i /><span>Responsive handoff</span></>
                ) : service.id === 'ai-solutions' ? (
                  <><span>Inputs converge</span><i /><span>Evidence forms</span><i /><span>Human approval</span></>
                ) : (
                  <><span>Assembly</span><i /><span>Rotation</span><i /><span>Exit / intro</span></>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="service-showcase__copy"
                key={service.id}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3>{service.title}</h3>
                <p>{service.executiveSummary}</p>
                <div><small>ENGINEERING FOCUS</small><p>{service.focus}</p></div>
                <ul>{service.deliverables.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
                <div className="service-showcase__stack">{service.stack.map((item) => <TechnologyBadge name={item} compact key={item} />)}</div>
              </motion.div>
            </AnimatePresence>
          </article>

          <div className="service-showcase__controls">
            <button type="button" onClick={() => select(activeIndex - 1)} aria-label={`Previous service: ${servicePillars[(activeIndex + 3) % 4].title}`}><ArrowLeft aria-hidden="true" /></button>
            <span>{service.shortTitle}</span>
            <button type="button" onClick={() => select(activeIndex + 1)} aria-label={`Next service: ${servicePillars[(activeIndex + 1) % 4].title}`}><ArrowRight aria-hidden="true" /></button>
          </div>
        </div>

      </div>
    </section>
  )
}
