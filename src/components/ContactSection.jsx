import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Mail, Send } from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { brand, serviceOptions, servicePillars } from '../data/agencyData'
import { industries, industryFromSearch } from '../data/industriesData'
import { buildContactEmail } from '../utils/contactBrief'

const clearValidity = (event) => event.currentTarget.setCustomValidity('')

export default function ContactSection() {
  const [message, setMessage] = useState('')
  const [initialIndustry] = useState(() => industryFromSearch(window.location.search))
  const [industryId, setIndustryId] = useState(initialIndustry?.id || '')
  const industry = industries.find(item => item.id === industryId)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.location.hash !== '#contact') return undefined
    const frame = requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [])

  const prepareBrief = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const nameInput = form.elements.namedItem('name')
    const scopeInput = form.elements.namedItem('scope')

    if (nameInput.value.trim().length < 2) nameInput.setCustomValidity('Please enter your full name.')
    if (scopeInput.value.trim().length < 40) scopeInput.setCustomValidity('Please add a little more project context (at least 40 characters).')
    if (!form.reportValidity()) return

    const data = new FormData(form)

    setMessage('Your brief is ready. Complete the handoff in the email application that opens next.')
    window.location.href = buildContactEmail(data, brand.email)
  }

  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title" ref={sectionRef}>
      <div className="contact__glow" aria-hidden="true" />
      <div className="contact__layout shell">
        <div className="contact__intro">
          <div className="contact__brand-lockup"><img src={samLogo} alt="" width="126" height="89" /><span>{brand.name}</span></div>
          <p className="eyebrow"><span /> Project conversation</p>
          <h2 id="contact-title">Start with the system as it is today.</h2>
          <p>Share the workflow, data, users, constraints, and outcome that matter. That is enough to begin a practical technical conversation.</p>
          <div className="contact__direct">
            <span>Prefer direct email?</span>
            <a href={`mailto:${brand.email}`}><Mail aria-hidden="true" /> {brand.email}<ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="contact__note">
            <i aria-hidden="true" />
            <p><strong>No server submission</strong><span>This website prepares an email locally. It does not store your form data.</span></p>
          </div>
        </div>

        <form className="contact-form" onSubmit={prepareBrief}>
          <header>
            <div><span>PROJECT BRIEF / 01</span><h3>Prepare the conversation</h3></div>
            <small><i /> Opens your email app</small>
          </header>
          <div className="contact-form__grid">
            <label><span>Name</span><input name="name" type="text" autoComplete="name" minLength="2" placeholder="Full name" required onInput={clearValidity} /></label>
            <label><span>Company / organization</span><input name="company" type="text" autoComplete="organization" minLength="2" placeholder="Organization" required /></label>
            <label className="contact-form__wide"><span>Work email</span><input name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" required /></label>
            <label className="contact-form__wide"><span>Industry / workflow</span><select name="industry" value={industryId} onChange={event => setIndustryId(event.target.value)}><option value="">Choose an industry (optional)</option>{industries.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
            {industry && <p className="contact-form__industry-note contact-form__wide" aria-live="polite">Inquiry context: <strong>{industry.name}</strong>. Tell us about your current process below; you can change either selection.</p>}
            <label className="contact-form__wide"><span>Area of interest</span><select name="service" defaultValue={initialIndustry ? servicePillars.find(item => item.id === initialIndustry.services[0]).title : ''} required><option value="" disabled>Select a service</option>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="contact-form__wide"><span>Project context</span><textarea name="scope" rows="6" minLength="40" placeholder="What exists today, what needs to change, and which constraints should shape the solution?" required onInput={clearValidity} /></label>
          </div>
          <button className="button button--primary contact-form__submit" type="submit">Open prepared email <Send aria-hidden="true" /></button>
          <p className="contact-form__fineprint">Submitting this form only opens a prefilled draft in your email application. You choose whether to send it.</p>
          <p className="contact-form__message" aria-live="polite">{message}</p>
        </form>
      </div>
    </section>
  )
}
