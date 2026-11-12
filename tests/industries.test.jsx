import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import ContactSection from '../src/components/ContactSection'
import { industries, industryContactHref, industryServiceHref } from '../src/data/industriesData'
import { servicePillars } from '../src/data/agencyData'
import { pastProjects } from '../src/data/projectsData'
import { buildBriefClipboardText, buildContactEmail, formatContactBrief } from '../src/utils/contactBrief'

const route = path => { window.history.replaceState({}, '', path); return render(<App/>) }

describe('Industries and solutions',()=>{
  it('loads the directory directly with seven distinct workflows and meaningful service links',()=>{
    route('/industries')
    expect(screen.getAllByRole('heading',{level:1})).toHaveLength(1)
    expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Technology built around how your business actually operates.')
    expect(document.querySelectorAll('.industry-section')).toHaveLength(7)
    expect(within(screen.getByRole('navigation',{name:'Industry sections'})).getAllByRole('link').every(link=>!/^\d/.test(link.textContent))).toBe(true)
    for(const industry of industries){
      const section=screen.getByRole('region',{name:industry.heading})
      expect(within(section).getByText(industry.problem)).toBeInTheDocument()
      expect(within(section).getByRole('heading',{name:'What we can build'})).toBeInTheDocument()
      expect(within(section).getByRole('link',{name:industry.cta})).toHaveAttribute('href',industryContactHref(industry.id))
      for(const id of industry.services){
        expect(within(section).getByRole('link',{name:servicePillars.find(s=>s.id===id).title})).toHaveAttribute('href',industryServiceHref(id))
      }
    }
    expect(document.title).toBe('Industries & Solutions | SAM Intelligence Group')
    expect(document.head.querySelector('link[rel=canonical]')).toHaveAttribute('href','https://samintelligencegroup.com/industries')
  })
  it('preserves evidence boundaries and uses only existing project and case-study links',()=>{
    route('/industries')
    for(const industry of industries){
      const section=screen.getByRole('region',{name:industry.heading})
      if(!industry.related)expect(within(section).queryByText('Related work')).not.toBeInTheDocument()
      for(const work of industry.related||[]){
        expect(pastProjects.some(project=>project.id===work.projectId)).toBe(true)
        expect(within(section).getByRole('link',{name:work.title||pastProjects.find(p=>p.id===work.projectId).title})).toHaveAttribute('href',work.href)
      }
    }
    expect(screen.getByText(/not a separate retail client/)).toBeInTheDocument()
    expect(screen.getByText(/internship at 10Pearls/)).toBeInTheDocument()
    expect(screen.getByText(/not a SAM client engagement/)).toBeInTheDocument()
    expect(pastProjects.find(p=>p.id==='industrial-print-proofing').status).toBe('Desktop Application')
    expect(pastProjects.find(p=>p.id==='smartpark-vision').status).toBe('Research Prototype')
  })
  it('places Industries in navigation and the homepage before the case-study showcase',async()=>{
    const user=userEvent.setup()
    route('/')
    const nav=within(screen.getByRole('navigation',{name:'Primary navigation'}))
    const labels=nav.getAllByRole('link').map(link=>link.textContent)
    expect(labels.slice(1,4)).toEqual(['Services','Industries','Case Studies'])
    expect(within(screen.getByRole('navigation',{name:'Footer navigation'})).getByRole('link',{name:'Industries'})).toHaveAttribute('href','/industries')
    const sectionIds=[...document.querySelectorAll('main section[id]')].map(section=>section.id)
    expect(sectionIds.indexOf('industries')).toBe(sectionIds.indexOf('services')+1)
    expect(sectionIds.indexOf('case-studies')).toBe(sectionIds.indexOf('industries')+1)
    expect(document.querySelectorAll('.industry-preview')).toHaveLength(3)
    expect(document.querySelector('.hero__proof')).not.toBeInTheDocument()
    expect(screen.queryByText(/\d+ \/ WORKFLOW FOCUS/)).not.toBeInTheDocument()
    expect(screen.getByRole('link',{name:'Explore all industries'})).toHaveAttribute('href','/industries')
    await user.click(screen.getByRole('button',{name:'Open navigation menu'}))
    expect(screen.getByRole('button',{name:'Close navigation menu'})).toHaveAttribute('aria-expanded','true')
  })
  it.each(industries)('preserves the $name contact context with an editable service selection',async industry=>{
    const user=userEvent.setup()
    window.history.replaceState({},'',industryContactHref(industry.id))
    render(<ContactSection/>)
    expect(screen.getByLabelText('Industry / workflow')).toHaveValue(industry.id)
    expect(screen.getByLabelText('Area of interest')).toHaveValue(servicePillars.find(s=>s.id===industry.services[0]).title)
    await user.selectOptions(screen.getByLabelText('Area of interest'),'General Inquiry')
    expect(screen.getByLabelText('Area of interest')).toHaveValue('General Inquiry')
    expect(screen.getByLabelText('Industry / workflow')).toHaveValue(industry.id)
    expect(screen.getByText(/without saving form data on this site/i)).toBeInTheDocument()
  })
  it('ignores unrecognized context values and keeps the normal contact form validation',()=>{
    window.history.replaceState({},'','/?industry=unrecognized#contact')
    render(<ContactSection/>)
    expect(screen.getByLabelText('Industry / workflow')).toHaveValue('')
    expect(screen.getByLabelText('Area of interest')).toHaveValue('')
    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Project context')).toHaveAttribute('minlength','40')
  })
  it('includes the validated industry in the local email draft without submitting a message',()=>{
    const data=new FormData()
    for(const [key,value] of Object.entries({name:'Example Person',company:'Example Company',email:'example@example.com',service:'Data Engineering',industry:'wholesale-distribution',scope:'We need to connect our catalog records and quotation workflow.'}))data.set(key,value)
    const draft=new URL(buildContactEmail(data,'example@example.com'))
    expect(draft.protocol).toBe('mailto:')
    expect(draft.searchParams.get('subject')).toContain('B2B Wholesale & Distribution')
    expect(draft.searchParams.get('body')).toContain('Industry / workflow: B2B Wholesale & Distribution')
    expect(draft.searchParams.get('body')).toContain(data.get('scope'))
    data.set('industry','unrecognized')
    expect(new URL(buildContactEmail(data,'example@example.com')).searchParams.get('body')).not.toContain('Industry / workflow:')
    data.set('industry','wholesale-distribution')
    const brief=formatContactBrief(data)
    expect(brief.industryLabel).toBe('B2B Wholesale & Distribution')
    expect(brief.subject).toBe('New Project Brief from Example Person (B2B Wholesale & Distribution)')
    expect(buildBriefClipboardText(data,'contact@samintelligencegroup.com')).toContain('To: contact@samintelligencegroup.com')
  })
})
