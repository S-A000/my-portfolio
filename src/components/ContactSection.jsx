import { useState } from 'react'
import { ArrowUpRight, Github, Mail, Send } from 'lucide-react'
import { brand, serviceOptions } from '../data/agencyData'
import SectionHeading from './SectionHeading'

export default function ContactSection() {
  const [message, setMessage] = useState('')

  const prepareBrief = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const company = data.get('company') || 'Organization'
    const service = data.get('service') || 'General Inquiry'
    const subject = encodeURIComponent(`Project discovery — ${service} — ${company}`)
    const body = encodeURIComponent([
      `Name: ${data.get('name')}`,
      `Company / Organization: ${company}`,
      `Work Email: ${data.get('email')}`,
      `Service Required: ${service}`,
      '',
      'Project Scope / Architecture Needs:',
      data.get('scope'),
    ].join('\n'))

    setMessage('Your project brief is ready. Send the prepared email from your mail application to complete the inquiry.')
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`
  }

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-section__glow" aria-hidden="true" />
      <div className="contact-layout">
        <div className="contact-intro">
          <SectionHeading
            eyebrow="Project discovery"
            title="Bring the hardest system constraint."
            description="Share the current architecture, the operational risk, and the outcome that matters. SAM Intelligence Group will map the next practical engineering move."
            id="contact-title"
          />

          <div className="contact-direct">
            <span>Direct channels</span>
            <a href={`mailto:${brand.email}`}><Mail aria-hidden="true" /> {brand.email}<ArrowUpRight aria-hidden="true" /></a>
            <a href={brand.github} target="_blank" rel="noreferrer"><Github aria-hidden="true" /> GitHub / S-A000<ArrowUpRight aria-hidden="true" /></a>
          </div>

          <div className="contact-response glass-panel">
            <span className="signal-dot" aria-hidden="true" />
            <div><b>Architecture-first intake</b><p>Every inquiry starts with scope, constraints, and deployment context—not a generic sales script.</p></div>
          </div>
        </div>

        <form className="intake-form glass-panel" onSubmit={prepareBrief}>
          <div className="intake-form__header">
            <div><span>SECURE INTAKE / 01</span><h3>Project architecture brief</h3></div>
            <span className="intake-form__status"><i /> Local handoff</span>
          </div>

          <div className="form-grid">
            <label><span>Name</span><input name="name" type="text" autoComplete="name" placeholder="Full name" required /></label>
            <label><span>Company / Organization</span><input name="company" type="text" autoComplete="organization" placeholder="Organization" required /></label>
            <label className="form-field--wide"><span>Work Email</span><input name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" required /></label>
            <label className="form-field--wide"><span>Service Needed</span><select name="service" defaultValue="" required><option value="" disabled>Select an engineering track</option>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="form-field--wide"><span>Project Details</span><textarea name="scope" rows="6" placeholder="Current system, target state, constraints, timeline, and critical risks…" required /></label>
          </div>

          <button className="button button--primary intake-form__submit" type="submit">Prepare project brief <Send aria-hidden="true" /></button>
          <p className="form-note">This static intake prepares an email in your local mail application. No form data is stored by this website.</p>
          <p className="form-message" aria-live="polite">{message}</p>
        </form>
      </div>
    </section>
  )
}
