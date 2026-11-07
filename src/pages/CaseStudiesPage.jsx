import CaseStudiesSection from '../components/CaseStudiesSection'
import usePageMeta from '../hooks/usePageMeta'
import { caseStudyMeta } from '../data/caseStudyMeta'

export default function CaseStudiesPage(){
  usePageMeta({...caseStudyMeta['/case-studies'],path:'/case-studies'})
  return <div className="case-index"><section className="case-index__hero shell"><p className="eyebrow"><span/> SAM / Case studies</p><h1>Good engineering.<br/><em>Made visible.</em></h1><div><p>Go beyond the project card. See the problem, the decisions, and the working system behind each outcome.</p><span>02 CASE STUDIES / SOFTWARE · DATA · MLOPS</span></div></section><CaseStudiesSection index/><section className="case-index__cta shell"><h2>What does your system need to solve?</h2><a href="/#contact" className="button button--primary">Discuss your project</a></section></div>
}
