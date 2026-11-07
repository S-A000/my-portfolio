import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Braces, Cpu, Database } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { brand } from '../data/agencyData'
import IntelligenceCanvas from './IntelligenceCanvas'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const focusAreas = [
  { icon: Database, label: 'Data foundations' },
  { icon: Cpu, label: 'Applied intelligence' },
  { icon: Braces, label: 'Custom software' },
]

export default function Hero() {
  const reduceMotion = Boolean(useReducedMotion())
  const heroRef = useRef(null)
  const scrollProgress = useRef(0)
  const introStartedAt = useRef(
    typeof performance === 'undefined' ? 0 : performance.now(),
  ).current
  const [revealed, setRevealed] = useState(reduceMotion)
  const revealCopy = useCallback(() => setRevealed(true), [])

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true)
      return undefined
    }

    const fallbackReveal = window.setTimeout(revealCopy, 4600)
    return () => window.clearTimeout(fallbackReveal)
  }, [reduceMotion, revealCopy])

  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero || reduceMotion || typeof window === 'undefined' || navigator.userAgent.includes('jsdom')) {
      scrollProgress.current = 0
      hero?.style.setProperty('--hero-scroll-progress', '0')
      return undefined
    }

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: ({ progress }) => {
        scrollProgress.current = progress
        hero.style.setProperty('--hero-scroll-progress', progress.toFixed(4))
      },
    })

    return () => trigger.kill()
  }, [reduceMotion])

  return (
    <section
      className={`hero${revealed ? ' hero--revealed' : ''}`}
      id="home"
      aria-labelledby="hero-title"
      data-hero-phase={revealed ? 'settling' : 'forming'}
      ref={heroRef}
    >
      <div className="hero__visual" aria-hidden="true">
        <IntelligenceCanvas
          introStartedAt={introStartedAt}
          onReveal={revealCopy}
          scrollProgress={scrollProgress}
        />
      </div>

      <div className="hero__inner shell">
        <div className="hero__copy">
          <div className="hero__brand-lockup"><img src={samLogo} alt="" width="112" height="79" /><span>{brand.name}</span></div>
          <p className="eyebrow"><span /> Data, software, and applied intelligence</p>
          <h1 id="hero-title">
            Build the systems behind the <em>next decision.</em>
          </h1>
          <p className="hero__description">
            SAM Intelligence Group designs data platforms, MLOps infrastructure, custom software,
            and applied AI workflows as connected, production-minded systems.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#services">
              Explore services <ArrowRight aria-hidden="true" />
            </a>
            <a className="button button--quiet" href="#contact">Discuss a project</a>
          </div>

          <ul className="hero__focus" aria-label="Core engineering focus">
            {focusAreas.map(({ icon: Icon, label }) => (
              <li key={label}><Icon aria-hidden="true" /><span>{label}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <a className="hero__scroll" href="#services">
        <span>Explore the system</span><ArrowDown aria-hidden="true" />
      </a>
    </section>
  )
}
