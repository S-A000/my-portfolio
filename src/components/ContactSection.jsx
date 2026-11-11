import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Send,
} from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { brand, serviceOptions, servicePillars } from '../data/agencyData'
import { industries, industryFromSearch } from '../data/industriesData'
import {
  buildBriefClipboardText,
  buildContactEmail,
  formatContactBrief,
} from '../utils/contactBrief'

const CONTACT_ENDPOINT = '/api/contact'

const clearValidity = (event) => event.currentTarget.setCustomValidity('')

async function copyTextToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall back to execCommand below when clipboard permissions are restricted.
    }
  }

  if (typeof document === 'undefined') return false
  const helper = document.createElement('textarea')
  helper.value = text
  helper.setAttribute('readonly', '')
  helper.style.position = 'fixed'
  helper.style.opacity = '0'
  document.body.appendChild(helper)
  helper.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  helper.remove()
  return copied
}

export default function ContactSection() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [fallbackBrief, setFallbackBrief] = useState(null)
  const [formKey, setFormKey] = useState(0)
  const [initialIndustry] = useState(() => industryFromSearch(window.location.search))
  const [industryId, setIndustryId] = useState(initialIndustry?.id || '')
  const industry = industries.find((item) => item.id === industryId)
  const sectionRef = useRef(null)
  const isSubmitting = status === 'submitting'

  useEffect(() => {
    if (window.location.hash !== '#contact') return undefined
    const frame = requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [])

  const submitBrief = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const nameInput = form.elements.namedItem('name')
    const companyInput = form.elements.namedItem('company')
    const scopeInput = form.elements.namedItem('scope')

    if (nameInput.value.trim().length < 2) nameInput.setCustomValidity('Please enter your full name.')
    if (companyInput.value.trim().length < 2) companyInput.setCustomValidity('Please enter your company or organization.')
    if (scopeInput.value.trim().length < 40) scopeInput.setCustomValidity('Please add a little more project context (at least 40 characters).')
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const brief = formatContactBrief(data)
    const clipboardText = buildBriefClipboardText(data, brand.email)
    const mailtoHref = buildContactEmail(data, brand.email)

    setFallbackBrief({ clipboardText, mailtoHref })
    setStatus('submitting')
    setErrorMessage('')
    setCopied(false)

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: brief.name,
          email: brief.email,
          industry: brief.industryLabel,
          message: brief.message,
        }),
      })

      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || result?.message || `Unable to deliver your brief right now. Please copy your brief below or email ${brand.email}.`,
        )
      }

      setStatus('success')
      setFallbackBrief(null)
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : `Unable to deliver your brief right now. Please copy your brief below or email ${brand.email}.`,
      )
    }
  }

  const copyFallbackBrief = async () => {
    const text = fallbackBrief?.clipboardText || `To: ${brand.email}`
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopied(true)
    } else if (fallbackBrief?.mailtoHref) {
      window.location.href = fallbackBrief.mailtoHref
    }
  }

  const resetForm = () => {
    setStatus('idle')
    setErrorMessage('')
    setCopied(false)
    setFallbackBrief(null)
    setIndustryId(initialIndustry?.id || '')
    setFormKey((value) => value + 1)
  }

  const defaultService = initialIndustry
    ? servicePillars.find((item) => item.id === initialIndustry.services[0])?.title || ''
    : ''

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
            <p><strong>Direct serverless delivery</strong><span>Your brief is sent directly to our inbox without storing form data on this website.</span></p>
          </div>
        </div>

        <div className="contact-form">
          {status === 'success' ? (
            <div className="contact-form__success" role="status" aria-live="polite">
              <header>
                <div><span>PROJECT BRIEF / SENT</span><p className="contact-form__header-title">Transmission complete</p></div>
                <small><i /> Sent to {brand.shortName}</small>
              </header>
              <div className="contact-form__success-body">
                <span className="contact-form__success-icon" role="img" aria-label="Success checkmark">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <h3>Brief Sent Successfully!</h3>
                <p>
                  Thank you for reaching out. We will review your project details and get back to you at{' '}
                  <a href={`mailto:${brand.email}`}>{brand.email}</a> shortly.
                </p>
                <button className="button button--primary" type="button" onClick={resetForm}>
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form key={formKey} onSubmit={submitBrief} aria-busy={isSubmitting}>
              <header>
                <div><span>PROJECT BRIEF / 01</span><h3>Prepare the conversation</h3></div>
                <small><i /> Sends directly</small>
              </header>
              <div className="contact-form__grid">
                <label><span>Name</span><input name="name" type="text" autoComplete="name" minLength="2" placeholder="Full name" required onInput={clearValidity} /></label>
                <label><span>Company / organization</span><input name="company" type="text" autoComplete="organization" minLength="2" placeholder="Organization" required onInput={clearValidity} /></label>
                <label className="contact-form__wide"><span>Work email</span><input name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" required /></label>
                <label className="contact-form__wide"><span>Industry / workflow</span><select name="industry" value={industryId} onChange={(event) => setIndustryId(event.target.value)}><option value="">Choose an industry (optional)</option>{industries.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
                {industry && <p className="contact-form__industry-note contact-form__wide" aria-live="polite">Inquiry context: <strong>{industry.name}</strong>. Tell us about your current process below; you can change either selection.</p>}
                <label className="contact-form__wide"><span>Area of interest</span><select name="service" defaultValue={defaultService} required><option value="" disabled>Select a service</option>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="contact-form__wide"><span>Project context</span><textarea name="scope" rows="6" minLength="40" placeholder="What exists today, what needs to change, and which constraints should shape the solution?" required onInput={clearValidity} /></label>
              </div>

              {status === 'error' && (
                <div className="contact-form__error" role="alert">
                  <div className="contact-form__error-copy">
                    <AlertCircle aria-hidden="true" />
                    <div>
                      <strong>Could not send your brief automatically</strong>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                  <div className="contact-form__error-actions">
                    <button
                      className="button button--quiet contact-form__copy-btn"
                      type="button"
                      onClick={copyFallbackBrief}
                    >
                      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      <span>{copied ? 'Copied Brief & Email' : 'Copy Brief & Email'}</span>
                    </button>
                    {fallbackBrief?.mailtoHref && (
                      <a className="text-link contact-form__mailto-fallback" href={fallbackBrief.mailtoHref}>
                        Open in email app <ArrowUpRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  {copied && (
                    <p className="contact-form__copy-status" role="status" aria-live="polite">
                      Copied your brief and {brand.email} to clipboard.
                    </p>
                  )}
                </div>
              )}

              <button
                className="button button--primary contact-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="contact-form__spinner" aria-hidden="true" />
                    <span>Sending Brief...</span>
                  </>
                ) : (
                  <>
                    <span>Send project brief</span>
                    <Send aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="contact-form__fineprint">
                Submitting sends your brief directly to {brand.email} without saving form data on this site.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
