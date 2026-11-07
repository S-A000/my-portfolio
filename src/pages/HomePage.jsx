import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ApproachSection from '../components/ApproachSection'
import CompanyPreview from '../components/CompanyPreview'
import ContactSection from '../components/ContactSection'
import Hero from '../components/Hero'
import SelectedWorkSection from '../components/SelectedWorkSection'
import ServiceShowcase from '../components/ServiceShowcase'
import usePageMeta from '../hooks/usePageMeta'
import CaseStudiesSection from '../components/CaseStudiesSection'
import IndustriesSection from '../components/IndustriesSection'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const homeRef = useRef(null)
  const reduceMotion = useReducedMotion()

  usePageMeta({
    title: 'SAM Intelligence Group | Data, MLOps, Custom Software & AI',
    description: 'Engineering data platforms, MLOps systems, custom web and .NET software, and applied AI workflows.',
  })

  useLayoutEffect(() => {
    const scope = homeRef.current
    if (!scope || reduceMotion || typeof window === 'undefined' || navigator.userAgent.includes('jsdom')) return undefined

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray('section:not(.hero)', scope)
      sections.forEach((section) => {
        section.classList.add('cinematic-section')
        const targets = Array.from(section.querySelectorAll([
          '.section-intro > *',
          '.service-showcase__header > *',
          '.service-showcase__frame',
          '.approach__steps > li',
          '.work-card',
          '.company-preview__panel > *',
          '.contact__intro > *',
          '.contact-form',
        ].join(',')))

        if (!targets.length) return
        gsap.fromTo(targets, {
          autoAlpha: 0,
          y: 72,
          rotateX: 4,
          filter: 'blur(9px)',
          transformOrigin: '50% 100%',
        }, {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          stagger: 0.085,
          ease: 'power3.out',
          clearProps: 'transform,filter',
          onStart: () => section.classList.add('is-revealed'),
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        })
      })
    }, scope)

    return () => context.revert()
  }, [reduceMotion])

  return (
    <div className="home-experience" ref={homeRef}>
      <Hero />
      <ServiceShowcase />
      <IndustriesSection />
      <CaseStudiesSection />
      <ApproachSection />
      <SelectedWorkSection />
      <CompanyPreview />
      <ContactSection />
    </div>
  )
}
