import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { featuredIndustryIds, industries } from '../data/industriesData'
import IndustryFlow from './IndustryFlow'

export default function IndustriesSection() {
  return <section className="industries-preview section" id="industries" aria-labelledby="industries-preview-title"><div className="shell">
    <header className="section-intro section-intro--split"><div><p className="eyebrow"><span/> Industries & Solutions</p><h2 id="industries-preview-title">Built around the way<br/>your business works.</h2></div><div className="section-intro__action"><p>Start with your operating challenge. Explore the software, data, and AI workflows we can build around it.</p><a href="/industries">Explore all industries <ArrowRight aria-hidden="true"/></a></div></header>
    <div className="industries-preview__grid">{featuredIndustryIds.map(id=>{
      const industry=industries.find(item=>item.id===id)
      return <article className={`industry-preview industry-preview--${id}`} key={id}>
        <div className="industry-preview__top"><span>Workflow focus</span><ArrowUpRight aria-hidden="true"/></div>
        <h3><a href={`/industries#${industry.id}`}>{industry.name}</a></h3>
        <p className="industry-preview__problem">{industry.previewProblem}</p>
        <IndustryFlow industry={industry}/>
        <div className="industry-preview__bottom"><p><span>What we can build</span>{industry.previewSolution}</p><a href={`/industries#${industry.id}`}>{industry.previewLink} <ArrowRight aria-hidden="true"/></a></div>
      </article>
    })}</div>
  </div></section>
}
