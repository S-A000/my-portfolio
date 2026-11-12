import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { industries, industriesMeta, industryContactHref, industryServiceHref } from '../data/industriesData'
import { servicePillars } from '../data/agencyData'
import { pastProjects } from '../data/projectsData'
import IndustryFlow from '../components/IndustryFlow'
import usePageMeta from '../hooks/usePageMeta'

function IndustrySection({industry}) {
  const reduceMotion=useReducedMotion()
  return <motion.section className="industry-section" id={industry.id} aria-labelledby={`${industry.id}-title`} initial={reduceMotion?false:{opacity:.4,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.65,ease:'easeOut'}}>
    <header className="industry-section__heading"><p>{industry.name}</p><h2 id={`${industry.id}-title`}>{industry.heading}</h2></header>
    <div className="industry-section__grid"><div className="industry-section__challenge"><h3>The operating challenge</h3><p>{industry.problem}</p><IndustryFlow industry={industry}/><div className="industry-section__services"><span>Relevant services</span><ul>{industry.services.map(id=>{const service=servicePillars.find(item=>item.id===id);return <li key={id}><a href={industryServiceHref(id)}>{service.title}<ArrowUpRight aria-hidden="true"/></a></li>})}</ul>{industry.qualification&&<small>{industry.qualification}</small>}</div></div>
      <div className="industry-section__solutions"><p className="industry-section__scope">SOLUTIONS WE CAN BUILD</p><h3>What we can build</h3><ul>{industry.solutions.map(solution=><li key={solution}><Check aria-hidden="true"/><span>{solution}</span></li>)}</ul><a className="button button--primary" href={industryContactHref(industry.id)}>{industry.cta}<ArrowRight aria-hidden="true"/></a><small>Start with your current process and the outcome you need.</small></div></div>
    {industry.related?.length>0&&<aside className="industry-related" aria-label={`Related work for ${industry.name}`}><span>Related work</span><div>{industry.related.map(work=>{const project=pastProjects.find(item=>item.id===work.projectId);return <article key={work.projectId}><p>{work.type}</p><h3><a href={work.href}>{work.title||project.title}<ArrowUpRight aria-hidden="true"/></a></h3><p>{work.note}</p></article>})}</div></aside>}
  </motion.section>
}

export default function IndustriesPage() {
  const [active,setActive]=useState(industries[0].id)
  const pageRef=useRef(null)
  usePageMeta({...industriesMeta,path:'/industries'})
  useEffect(()=>{
    const target=industries.find(industry=>`#${industry.id}`===window.location.hash)
    const frame=target?requestAnimationFrame(()=>document.getElementById(target.id)?.scrollIntoView({block:'start'})):0
    const observer=new IntersectionObserver(entries=>{if(!entries.some(item=>item.isIntersecting))return;const closest=[...pageRef.current.querySelectorAll('.industry-section')].sort((a,b)=>Math.abs(a.getBoundingClientRect().top-200)-Math.abs(b.getBoundingClientRect().top-200))[0];if(closest)setActive(closest.id)},{rootMargin:'-180px 0px -55% 0px',threshold:0})
    pageRef.current.querySelectorAll('.industry-section').forEach(section=>observer.observe(section))
    return()=>{cancelAnimationFrame(frame);observer.disconnect()}
  },[])
  return <div className="industries-page" ref={pageRef}>
    <section className="industries-hero shell"><p className="eyebrow"><span/> Industries & Solutions</p><h1>Technology built around how your business actually operates.</h1><div className="industries-hero__lower"><div><p>Catalogs, data, orders, production, research, and forecasting create different constraints in every industry. SAM Intelligence Group connects software, data engineering, MLOps, and applied AI to the workflow that needs to work.</p><div className="industries-hero__actions"><a className="button button--primary" href="/#contact">Discuss your workflow <ArrowRight aria-hidden="true"/></a><a className="text-link" href="#industry-directory">Explore industries <ArrowDown aria-hidden="true"/></a></div></div><IndustryFlow hero/></div></section>
    <aside className="industries-approach shell"><span>THE PROCESS COMES FIRST</span><p>We begin with the current process, its bottlenecks, and the outcome that matters. From there, we design a system that fits the people, data, and decisions involved.</p></aside>
    <div className="industry-directory" id="industry-directory"><div className="shell"><div className="industry-directory__label"><span>FIND YOUR WORKFLOW</span></div><nav aria-label="Industry sections">{industries.map(industry=><a key={industry.id} href={`#${industry.id}`} aria-current={active===industry.id?'location':undefined}>{industry.selector}</a>)}</nav><label className="industry-directory__select"><span>Choose an industry</span><select value={active} onChange={event=>{setActive(event.target.value);window.location.hash=event.target.value}}>{industries.map(industry=><option key={industry.id} value={industry.id}>{industry.name}</option>)}</select></label></div></div>
    <div className="industries-content shell">{industries.map(industry=><IndustrySection industry={industry} key={industry.id}/>)}</div>
    <section className="industries-closing shell" aria-labelledby="industries-closing-title"><div><img src="/sam-logo-full.png" alt="SAM Intelligence Group" width="110" height="78"/><p className="eyebrow"><span/> Your operating context</p><h2 id="industries-closing-title">The starting point is<br/>the work you do.</h2></div><div><p>Your business may span more than one industry. Tell us what happens today, where information gets stuck, and what a useful next step would look like.</p><a className="button button--primary" href="/#contact">Discuss your workflow <ArrowRight aria-hidden="true"/></a></div></section>
  </div>
}
