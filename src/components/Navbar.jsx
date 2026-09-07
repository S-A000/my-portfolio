import { useEffect, useState } from 'react'
import { Download, Github, Linkedin, Menu, Search, X } from 'lucide-react'

const links = ['Home', 'Skills', 'Experience', 'Projects', 'Education', 'Contact']

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const sections = links.map((link) => document.getElementById(link.toLowerCase())).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-25% 0px -60%', threshold: [0.05, 0.25, 0.6] })
    sections.forEach((section) => observer.observe(section))
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])

  const go = () => setOpen(false)
  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#home" className="brand" aria-label="Syed Abdullah home"><span className="brand__mark">SAM</span><span className="brand__name">ABDULLAH</span></a>
      <nav className={`navlinks ${open ? 'navlinks--open' : ''}`} aria-label="Primary navigation">
        {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} onClick={go} className={active === link.toLowerCase() ? 'active' : ''}>{link}</a>)}
        <a className="nav-cv" href="/cv/Syed-Abdullah-Bin-Masood-CV.pdf" download onClick={go}><Download size={16} /> Download CV</a>
      </nav>
      <div className="nav-actions">
        <button className="icon-button" type="button" onClick={onSearch} aria-label="Search projects"><Search /></button>
        <a className="icon-button desktop-social" href="https://github.com/S-A000" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github /></a>
        <a className="icon-button desktop-social" href="https://www.linkedin.com/in/abdullah-bin-masood-0b25103b4/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin /></a>
        <button className="icon-button menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}
