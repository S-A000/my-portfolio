import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { caseStudies } from '../src/data/caseStudiesData'
import { pastProjects } from '../src/data/projectsData'

const route = path => { window.history.replaceState({}, '', path); return render(<App/>) }

describe('Case studies',()=>{
  it('links both editorial cards and places navigation between Services and Work',()=>{
    route('/case-studies')
    const nav=within(screen.getByRole('navigation',{name:'Primary navigation'}))
    expect(nav.getAllByRole('link').map(a=>a.textContent)).toEqual(['Home','Services','Industries','Case Studies','Work / Projects','About Us','Contact'])
    const links=screen.getAllByRole('link',{name:'Read case study'})
    expect(links.map(a=>a.getAttribute('href'))).toEqual(['/case-studies/lobatse-pharmacy','/case-studies/aqi-forecasting'])
    expect(document.head.querySelector('link[rel=canonical]')).toHaveAttribute('href','https://samintelligencegroup.com/case-studies')
  })
  it.each(caseStudies)('loads $name directly with attribution, verified facts and a useful WebGL fallback',study=>{
    route(`/case-studies/${study.id}`)
    expect(screen.getByRole('heading',{level:1})).toHaveTextContent(study.title)
    expect(screen.getAllByText(study.role).length).toBeGreaterThan(0)
    expect(screen.getByRole('tablist',{name:'System walkthrough stages'})).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(5)
    expect(document.querySelectorAll('.scene-canvas-host>[data-fallback=true]')).toHaveLength(2)
    expect(screen.getByRole('link',{name:'Read the next case study'})).toHaveAttribute('href',`/case-studies/${caseStudies.find(s=>s.id!==study.id).id}`)
    expect(document.title).toContain(study.name)
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute('content',`https://samintelligencegroup.com/case-studies/social-${study.id}.png`)
  })
  it('supports all five manual stages, arrow keys, Home/End and reduced-motion reset',async()=>{
    const user=userEvent.setup()
    route('/case-studies/lobatse-pharmacy?renderer=fallback&motion=reduce')
    const tabs=screen.getAllByRole('tab')
    for(let i=0;i<5;i++){
      await user.click(tabs[i]);expect(tabs[i]).toHaveAttribute('aria-selected','true')
      expect(screen.getByRole('tabpanel')).toHaveTextContent(caseStudies[0].stages[i].detail)
      expect(document.querySelector('.case-walkthrough [data-stage]')).toHaveAttribute('data-stage',String(i+1))
    }
    await user.keyboard('{Home}');expect(tabs[0]).toHaveFocus()
    await user.keyboard('{ArrowRight}');expect(tabs[1]).toHaveFocus()
    await user.keyboard('{End}');expect(tabs[4]).toHaveFocus()
    await user.click(screen.getByRole('button',{name:'Return to first stage'}))
    expect(tabs[0]).toHaveAttribute('aria-selected','true')
    expect(screen.queryByRole('button',{name:'Pause story'})).not.toBeInTheDocument()
  })
  it('adds Lobatse once, preserves one AQI record and cross-links the AQI detail',()=>{
    expect(pastProjects.filter(p=>p.id==='lobatse-pharmacy')).toHaveLength(1)
    expect(pastProjects.filter(p=>p.id==='aqi-forecasting')).toHaveLength(1)
    route('/projects?project=aqi-forecasting')
    expect(within(screen.getByRole('dialog')).getByRole('link',{name:'Read full case study'})).toHaveAttribute('href','/case-studies/aqi-forecasting')
  })
  it('places selected case studies after Services and before Work on the homepage',()=>{
    route('/')
    const ids=[...document.querySelectorAll('main section[id]')].map(s=>s.id)
    expect(ids.indexOf('case-studies')).toBeGreaterThan(ids.indexOf('services'))
    expect(ids.indexOf('case-studies')).toBeLessThan(ids.indexOf('work'))
    expect(screen.getByRole('link',{name:`Explore all ${pastProjects.length} projects`})).toBeInTheDocument()
  })
})
