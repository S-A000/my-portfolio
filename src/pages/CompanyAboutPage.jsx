import { ArrowRight, CheckCircle2 } from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import ApproachSection from '../components/ApproachSection'
import TechnologyBadge from '../components/TechnologyBadge'
import { aboutUs, brand, servicePillars, technologyGroups } from '../data/agencyData'
import { pastProjects } from '../data/projectsData'
import usePageMeta from '../hooks/usePageMeta'

const proofIds = ['aqi-forecasting', 'industrial-print-proofing', 'sam-eda', 'pinn-app']
const proofProjects = proofIds.map((id) => pastProjects.find((project) => project.id === id)).filter(Boolean)

const faqItems = [
  {
    question: 'What services does SAM Intelligence Group offer as a software house?',
    answer: 'SAM Intelligence Group delivers four connected engineering services: Data Engineering & ETL (Python, SQL Server, PostgreSQL, BigQuery, SSIS), MLOps & Production AI (MLflow, Feast, chronological evaluation, FastAPI serving, GitHub Actions), Full-Stack Web & Custom Software (React, FastAPI, C#, .NET 10, ASP.NET Core MVC, EF Core, WPF), and Custom AI Solutions (PyTorch, OpenCV, YOLO computer vision, local Ollama/LangChain agents, and human-reviewed workflows).',
  },
  {
    question: 'Does SAM Intelligence Group work with international clients globally?',
    answer: 'Yes. SAM Intelligence Group operates as a global engineering partner serving clients worldwide across North America, Europe, the Middle East, Africa, and Asia-Pacific through a structured five-stage lifecycle: Discovery, Architecture, Build, Deployment, and Support & Iteration.',
  },
  {
    question: 'What production AI, MLOps, and full-stack projects has SAM Intelligence Group delivered?',
    answer: 'Documented builds include the Lobatse Pharmacy platform (.NET 10, ASP.NET Core MVC, EF Core, PostgreSQL on AWS RDS/EC2/S3 with 11,204 catalog rows processed), the Three-City AQI Forecasting MLOps Platform (105,054 hourly BigQuery rows, 606 ordered features, MLflow, FastAPI, Streamlit), DeepGuard multimodal deepfake video forensics (186 commits in PyTorch and OpenCV), the Industrial Print Proofing C#/WPF desktop suite, and the open-source SAM-EDA Python package on PyPI.',
  },
  {
    question: 'Who leads engineering at SAM Intelligence Group and how can we start a project?',
    answer: 'Engineering at SAM Intelligence Group is led by Syed Abdullah Bin Masood, Lead AI/ML and Full-Stack Systems Engineer. To start a project, share your current workflow, data constraints, and target outcome via the project brief form at samintelligencegroup.com/#contact or email contact@samintelligencegroup.com directly.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function CompanyAboutPage() {
  usePageMeta({
    title: 'About Us | SAM Intelligence Group',
    description: 'Learn how SAM Intelligence Group delivers data engineering, MLOps, custom software, and applied AI projects.',
    path: '/about',
  })

  return <div className="about-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="page-hero page-hero--about" aria-labelledby="about-page-title">
      <div className="page-hero__grid shell">
        <div><div className="about-brand-lockup"><img src={samLogo} alt="" width="180" height="127" /><span>{brand.name}</span></div><p className="eyebrow"><span /> About SAM Intelligence Group</p><h1 id="about-page-title">Intelligence is useful when the system around it works.</h1></div>
        <div className="page-hero__summary"><p>{aboutUs.summary}</p><p>{aboutUs.detail}</p></div>
      </div>
      <div className="page-hero__signal" aria-hidden="true"><i /><i /><i /><i /></div>
    </section>

    <section className="company-services section" aria-labelledby="company-services-title"><div className="shell">
      <header className="section-intro section-intro--split"><div><p className="eyebrow"><span /> What we do</p><h2 id="company-services-title">Four services, designed to work together.</h2></div><p>SAM connects data foundations, model delivery, software interfaces, and human-reviewed AI into coherent systems rather than isolated outputs.</p></header>
      <div className="company-services__grid">{servicePillars.map((service) => <article key={service.id}><h3>{service.title}</h3><p>{service.executiveSummary}</p><ul>{service.deliverables.slice(0, 3).map((item) => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}</ul><div className="company-services__stack">{service.stack.slice(0, 4).map((item) => <TechnologyBadge name={item} compact key={item} />)}</div></article>)}</div>
    </div></section>

    <ApproachSection />

    <section className="strengths section" aria-labelledby="strengths-title"><div className="shell">
      <header className="section-intro section-intro--split"><div><p className="eyebrow"><span /> Technology in context</p><h2 id="strengths-title">A production stack selected around the problem.</h2></div><p>Tools are grouped by the role they play in delivery. Recognizable marks identify established technologies; niche tools use a consistent neutral symbol.</p></header>
      <div className="strengths__grid strengths__grid--badges">{technologyGroups.map((group) => <article key={group.label}><h3>{group.label}</h3><ul>{group.items.map((item) => <li key={item}><TechnologyBadge name={item} /></li>)}</ul></article>)}</div>
    </div></section>

    <section className="proof-strip section" aria-labelledby="proof-strip-title"><div className="shell">
      <header className="section-intro section-intro--split"><div><p className="eyebrow"><span /> Real project proof</p><h2 id="proof-strip-title">Working systems, tools, prototypes, and research.</h2></div><a className="text-link" href="/projects">Open the full project library <ArrowRight aria-hidden="true" /></a></header>
      <div className="proof-strip__list">{proofProjects.map((project, index) => <a href={`/projects?project=${project.id}`} key={project.id}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{project.title}</strong><small>{project.category}</small></div><em>{project.status}</em><ArrowRight aria-hidden="true" /></a>)}</div>
    </div></section>

    <section className="about-faq section" aria-labelledby="about-faq-title"><div className="shell">
      <header className="section-intro section-intro--split"><div><p className="eyebrow"><span /> Frequently asked questions</p><h2 id="about-faq-title">Clear answers on scope, stack, and delivery.</h2></div><p>Direct answers for engineering leaders, operations teams, and partners evaluating how SAM Intelligence Group works.</p></header>
      <div className="company-services__grid about-faq__grid">{faqItems.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div>
    </div></section>

    <section className="page-cta section" aria-labelledby="about-cta-title"><div className="page-cta__inner shell"><div className="page-cta__brand"><img src={samLogo} alt="" width="120" height="84" /><span>{brand.name}</span></div><p className="eyebrow"><span /> Start with the constraint</p><h2 id="about-cta-title">Have a system that needs a clearer next move?</h2><p>Share the current state, operational context, and outcome that needs to change.</p><a className="button button--primary" href="/#contact">Discuss a project <ArrowRight aria-hidden="true" /></a></div></section>
  </div>
}
