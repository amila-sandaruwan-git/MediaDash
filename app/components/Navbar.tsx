// app/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { FaDownload } from 'react-icons/fa'

// We define the interface so it accepts the isDesktopApp prop
interface NavbarProps {
  isDesktopApp?: boolean
}

export default function Navbar({ isDesktopApp }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    const onResize = () => window.innerWidth >= 768 && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollToSection = useCallback((id: string) => {
    setMenuOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30)
  }, [])

  // Build the links array dynamically based on environment
  const links = [
    { id: 'about', label: 'About' },
    { id: 'help', label: 'Help' },
    // 👇 Only add the Install link if we are on the web
    ...(isDesktopApp ? [] : [{ id: 'install', label: 'Install', icon: true }]),
  ]

  return (
    <nav className={`md-nav ${isScrolled || menuOpen ? 'is-scrolled' : ''}`}>
      <div className="md-nav__inner">
        <Link href="/" className="md-nav__brand" onClick={() => setMenuOpen(false)}>
          <span className="md-nav__logo">MediaDash</span>
          <span className="md-nav__badge">v1.0</span>
        </Link>

        <div className="md-nav__links">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollToSection(l.id)} className="md-nav__link">
              {l.icon && <FaDownload className="md-nav__icon" />}
              {l.label}
            </button>
          ))}
        </div>

        <div className="md-nav__actions">
          <button
            className={`md-nav__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="md-mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="md-mobile-menu" className={`md-nav__panel ${menuOpen ? 'is-open' : ''}`}>
        {links.map((l) => (
          <button key={l.id} onClick={() => scrollToSection(l.id)} className="md-nav__panel-link">
            {l.icon && <FaDownload />}
            {l.label}
          </button>
        ))}
      </div>
      <div
        className={`md-nav__backdrop ${menuOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
    </nav>
  )
}