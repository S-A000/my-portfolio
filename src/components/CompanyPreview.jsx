import { ArrowRight, CheckCircle2 } from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { aboutUs, brand, servicePillars } from '../data/agencyData'

export default function CompanyPreview() {
  return (
    <section className="company-preview section" aria-labelledby="company-preview-title">
      <div className="company-preview__panel shell">
        <div className="company-preview__brand">
          <img src={samLogo} alt="" width="250" height="176" />
          <span>{brand.name}</span>
        </div>
        <div className="company-preview__copy">
          <p className="eyebrow"><span /> One connected engineering partner</p>
          <h2 id="company-preview-title">{aboutUs.title}</h2>
          <p>{aboutUs.summary} {aboutUs.detail}</p>
          <ul aria-label="SAM Intelligence Group services">
            {servicePillars.map((service) => (
              <li key={service.id}><CheckCircle2 aria-hidden="true" />{service.title}</li>
            ))}
          </ul>
          <a className="button button--line" href="/about">How SAM delivers projects <ArrowRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
