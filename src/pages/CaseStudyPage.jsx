import { ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { caseStudies } from '../data/caseStudiesData'
import CaseStudyWalkthrough from '../components/CaseStudyWalkthrough'
import TechnologyBadge from '../components/TechnologyBadge'
import CaseStudyScene from '../three/CaseStudyScene'
import usePageMeta from '../hooks/usePageMeta'
import { caseStudyMeta } from '../data/caseStudyMeta'

const captions=[
  'Karachi dashboard: current conditions and direct forecast horizons, as captured in the project.',
  'Lahore dashboard: the same forecast interface applied to a different city.',
  'Islamabad dashboard: city-specific conditions and forecast presentation.',
  'FastAPI documentation: the project’s exposed inference and dashboard interfaces.',
  'MLflow experiment view: recorded candidate runs for model comparison.',
  'Local contributions from the 24-hour linear model. The historical file is named “shap-summary”; this view is not a SHAP explanation.',
  'Captured successful hourly ingestion workflow in GitHub Actions.',
  'Captured successful daily training workflow in GitHub Actions.',
]

export default function CaseStudyPage({id}){
  const study=caseStudies.find(item=>item.id===id),related=caseStudies.find(item=>item.id!==id)
  usePageMeta({...caseStudyMeta[`/case-studies/${study.id}`],path:`/case-studies/${study.id}`})
  return <article className={`case-detail case-detail--${id}`}>
    <section className="case-hero shell" aria-labelledby="case-title"><a className="case-back" href="/case-studies"><ArrowLeft aria-hidden="true"/> All case studies</a><div className="case-hero__heading"><p className="eyebrow"><span/> {study.category}</p><p className="case-hero__index">CASE STUDY / {study.number}</p></div><h1 id="case-title">{id === 'lobatse-pharmacy' ? <>Building a Pharmacy <span className="keep-together">E-commerce</span> Platform for an 11,000+ Product Catalog</> : study.title}</h1><div className="case-hero__lower"><div className="case-hero__summary"><p>{study.summary}</p><span>{study.context}</span><a className="text-link" href="#system-walkthrough">Explore the system <ArrowDown aria-hidden="true"/></a></div><div className="case-hero__scene"><CaseStudyScene study={study} stage={id==='lobatse-pharmacy'?1:4}/><div><span>INTERACTIVE SYSTEM STUDY</span><strong>{study.name}</strong><small>Original 3D illustration / scroll for the full walkthrough</small></div></div></div></section>
    {id==='aqi-forecasting'&&<aside className="case-attribution case-attribution--top shell"><span>PROJECT CONTEXT</span><p>{study.role}</p></aside>}
    <section className="case-facts shell" aria-label="Project quick facts"><dl>{study.facts.map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>
    <div className="case-narrative shell"><section className="case-chapter"><div className="case-chapter__label"><span>01 / THE CHALLENGE</span><h2>{id==='lobatse-pharmacy'?'Retail convenience meets pharmacy operations.':'A forecast is only one part of the system.'}</h2></div><div className="case-prose"><p>{study.challenge}</p><p>{study.solution}</p></div></section>
    <section className="case-chapter case-chapter--decisions"><div className="case-chapter__label"><span>02 / ENGINEERING DECISIONS</span><h2>Design around the constraints.</h2></div><div className="case-decisions">{study.decisions.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="case-chapter"><div className="case-chapter__label"><span>03 / THE ARCHITECTURE</span><h2>{id==='lobatse-pharmacy'?'One platform, connected responsibilities.':'A contract from data to dashboard.'}</h2></div><div className="case-prose"><p>{study.architecture}</p><ol className="case-architecture-flow">{study.chain.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}</li>)}</ol></div></section></div>
    <CaseStudyWalkthrough study={study}/>
    <div className="case-narrative shell"><section className="case-chapter"><div className="case-chapter__label"><span>04 / WHAT WAS DELIVERED</span><h2>From architecture to a usable workflow.</h2></div><div className="case-delivery">{study.delivery.map(([title,copy])=><div key={title}><Check aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
    <section className="case-outcome" aria-labelledby="outcome-title"><div><p className="eyebrow"><span/> Verified outcomes</p><h2 id="outcome-title">{study.metric}</h2><span>{study.metricLabel}</span></div><div><h3>A result grounded in the implementation.</h3><p>{study.outcome}</p><small>{study.outcomeNote}</small></div></section>
    <section className="case-chapter"><div className="case-chapter__label"><span>05 / THE TECHNOLOGY</span><h2>Tools chosen for the work.</h2></div><ul className="case-technologies">{study.tech.map(name=><li key={name}><TechnologyBadge name={name}/></li>)}</ul></section>
    <section className="case-gallery" aria-labelledby="gallery-title"><p className="eyebrow"><span/> Project gallery</p><h2 id="gallery-title">{study.gallery?'The actual project, on screen.':'A closer look at the system.'}</h2>{study.gallery?<div className="case-gallery__grid">{study.gallery.map(([src,alt],i)=><figure key={src}><a href={src} target="_blank" rel="noreferrer" aria-label={`Open full image: ${alt}`}><img src={src} alt={alt} width="1200" height="675" loading="lazy"/></a><figcaption><span>{String(i+1).padStart(2,'0')}</span>{captions[i]}</figcaption></figure>)}</div>:<figure className="case-gallery__illustration"><img src="/case-studies/lobatse-pharmacy.svg" width="1000" height="650" alt="Original illustration of the pharmacy commerce and separate prescription-review architecture" loading="lazy"/><figcaption>Original system illustration, not a product screenshot. The architecture is based on the project source; no private pharmacy or customer records are shown. Public storefront screenshots were not available in the supplied site assets.</figcaption></figure>}</section>
    <aside className="case-attribution"><span>ROLE & ATTRIBUTION</span><p>{study.role}</p>{study.roleNote&&<small>{study.roleNote}</small>}</aside></div>
    <section className="case-next shell"><div><p className="eyebrow"><span/> Continue exploring</p><h2>{related.name}</h2><p>{related.problem}</p><a href={`/case-studies/${related.id}`} className="text-link">Read the next case study <ArrowRight aria-hidden="true"/></a></div><div><img src="/sam-logo-full.png" alt="SAM Intelligence Group" width="120" height="85" loading="lazy"/><h2>Bring your own constraints.</h2><p>Tell us about the data, people, and workflow your system needs to connect.</p><a href="/#contact" className="button button--primary">Start a conversation <ArrowRight aria-hidden="true"/></a></div></section>
  </article>
}
