import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { caseStudies } from '../data/caseStudiesData'

export default function CaseStudiesSection({index=false}) {
  return <section className={`selected-cases section${index?' selected-cases--index':''}`} id="case-studies" aria-labelledby={index?'case-index-cards':'selected-cases-title'}>
    <div className="shell">
      <header className="section-intro section-intro--split">
        <div><p className="eyebrow"><span/> {index?'Two systems, in detail':'Selected case studies'}</p><h2 id={index?'case-index-cards':'selected-cases-title'}>{index?'The work behind the outcome.':'Inside the systems we build.'}</h2></div>
        <div className="section-intro__action"><p>Real constraints. Specific engineering decisions. Outcomes supported by the work.</p>{!index&&<a href="/case-studies">All case studies <ArrowRight aria-hidden="true"/></a>}</div>
      </header>
      <div className="selected-cases__grid">{caseStudies.map(study=><article className={`editorial-case editorial-case--${study.id}`} key={study.id}>
        <a className="editorial-case__visual" href={`/case-studies/${study.id}`} aria-label={`Read ${study.name} case study`}><img src={`/case-studies/${study.id}.svg`} width="1000" height="650" alt={study.id==='lobatse-pharmacy'?'Original system illustration: pharmacy product catalog, responsive storefront, orders and prescription review':'Original system illustration: three city observation streams, feature pipeline and direct forecast horizons'} loading="lazy"/><span>Engineering in practice</span><i><ArrowUpRight aria-hidden="true"/></i></a>
        <div className="editorial-case__copy"><p className="editorial-case__category">{study.category}</p><h3><a href={`/case-studies/${study.id}`}>{study.name}</a></h3><p className="editorial-case__problem">{study.problem}</p><p>{study.solution}</p><div className="editorial-case__bottom"><span>{study.result}</span><a href={`/case-studies/${study.id}`}>Read case study <ArrowRight aria-hidden="true"/></a></div></div>
      </article>)}</div>
    </div>
  </section>
}
