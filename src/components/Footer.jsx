import { ArrowUp, Github } from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { brand, navigation } from '../data/agencyData'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a href="#home" className="footer-brand" aria-label={`${brand.name} home`}>
          <span className="footer-brand__mark"><img src={samLogo} alt="" width="150" height="90" /></span>
          <span className="footer-brand__copy"><b>{brand.name}</b><small>Enterprise intelligence systems</small></span>
        </a>
        <p>{brand.tagline}</p>
        <a className="back-to-top" href="#home">Back to top <ArrowUp aria-hidden="true" /></a>
      </div>

      <div className="site-footer__bottom">
        <nav aria-label="Footer navigation">
          {navigation.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
        </nav>
        <a
          className="footer-github"
          href={brand.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SAM Intelligence Group on GitHub"
        >
          <Github aria-hidden="true" /> S-A000
        </a>
        <p>© {new Date().getFullYear()} {brand.name}</p>
      </div>
    </footer>
  )
}
