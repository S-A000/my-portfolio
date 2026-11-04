import { Mail } from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { brand, navigation } from '../data/agencyData'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main shell">
        <div className="site-footer__brand">
          <a href="/#home" aria-label={`${brand.name} home`}><img src={samLogo} alt="" width="190" height="134" /></a>
          <p>{brand.tagline}</p>
        </div>
        <div className="site-footer__nav">
          <span>Navigate</span>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
          </nav>
        </div>
        <div className="site-footer__contact">
          <span>Start a conversation</span>
          <a href={`mailto:${brand.email}`}><Mail aria-hidden="true" /> {brand.email}</a>
        </div>
      </div>
      <div className="site-footer__bottom shell">
        <p>© {new Date().getFullYear()} {brand.name}</p>
        <p>Data · MLOps · Custom software · AI solutions</p>
      </div>
    </footer>
  )
}
