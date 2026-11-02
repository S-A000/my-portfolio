import { useEffect, useState } from 'react'
import { Github, Menu, X } from 'lucide-react'
import samLogo from '../../SAM_Profile_1080_Black.png'
import { brand, navigation } from '../data/agencyData'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visibleSection) setActiveSection(visibleSection.target.id)
    }, { rootMargin: '-28% 0px -62%', threshold: [0.05, 0.25, 0.6] })

    sections.forEach((section) => observer.observe(section))
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <a className="site-header__brand" href="#home" aria-label={`${brand.name} home`} onClick={closeMenu}>
        <span className="site-header__brand-mark">
          <img src={samLogo} alt="" width="56" height="56" />
        </span>
        <span className="site-header__brand-name">{brand.name}</span>
      </a>

      <nav
        id="primary-navigation"
        className={`site-header__nav${menuOpen ? ' site-header__nav--open' : ''}`}
        aria-label="Primary navigation"
      >
        {navigation.map(({ label, id }) => (
          <a
            key={id}
            className={`site-header__nav-link${activeSection === id ? ' site-header__nav-link--active' : ''}`}
            href={`#${id}`}
            aria-current={activeSection === id ? 'location' : undefined}
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        className="site-header__github"
        href={brand.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SAM Intelligence Group on GitHub"
      >
        <Github aria-hidden="true" />
      </a>

      <button
        className="site-header__menu-toggle"
        type="button"
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  )
}
