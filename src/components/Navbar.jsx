import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import samLogo from '../../SAM_Full_Transparent_Cropped.png'
import { brand, navigation } from '../data/agencyData'

const normalizePath = (value) => value.replace(/\/+$/, '') || '/'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const navRef = useRef(null)
  const path = normalizePath(window.location.pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    if (path !== '/') return () => window.removeEventListener('scroll', handleScroll)

    const sections = ['home', 'services', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-28% 0px -60%', threshold: [0.08, 0.35, 0.7] })
    sections.forEach((section) => observer.observe(section))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [path])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const firstLink = navRef.current?.querySelector('a')
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    window.requestAnimationFrame(() => firstLink?.focus())
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const isActive = (item) => {
    if (item.route && (normalizePath(item.route) === path || (item.route === '/case-studies' && path.startsWith('/case-studies/')))) return true
    return path === '/' && item.section === activeSection
  }

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner shell">
        <a className="site-header__brand" href="/#home" aria-label={`${brand.name} home`} onClick={() => setMenuOpen(false)}>
          <img src={samLogo} alt="" width="106" height="74" />
          <span>{brand.name}</span>
        </a>

        <nav
          ref={navRef}
          id="primary-navigation"
          className={`site-header__nav${menuOpen ? ' site-header__nav--open' : ''}`}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              className={isActive(item) ? 'is-active' : ''}
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="site-header__cta" href="/#contact">Start a conversation</a>
        <button
          ref={menuButtonRef}
          className="site-header__menu-toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
