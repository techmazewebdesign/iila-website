import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import IILALogo from './IILALogo'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useTranslation } from '../i18n'
import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const t = useTranslation()
  const { lang } = useLanguage()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: t.header.home,         to: '/' },
    { label: t.header.about,        to: '/about' },
    { label: t.header.ourPeople,   to: '/our-people' },
    { label: t.header.mission,      to: '/mission' },
    { label: t.header.publications, to: '/publications' },
    { label: t.header.humanRights, to: '/human-rights' },
    { label: lang === 'fa' ? 'ثبت درخواست حقوق بشر' : 'Human Rights Intake', to: lang === 'fa' ? '/fa/human-rights-complaint' : '/human-rights-complaint' },
    { label: t.header.partners,     to: '/partners' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event) => { if (event.key === 'Escape') { setMobileOpen(false); document.body.style.overflow = '' } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (desktop.matches) { setMobileOpen(false); document.body.style.overflow = '' } }
    desktop.addEventListener('change', closeOnDesktop)
    return () => { desktop.removeEventListener('change', closeOnDesktop); document.body.style.overflow = '' }
  }, [])

  const toggleMobile = () => {
    setMobileOpen((v) => {
      document.body.style.overflow = !v ? 'hidden' : ''
      return !v
    })
  }

  return (
    <>
      {/* ── Main header bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3'
            : 'py-4'
        }`}
        style={{
          backgroundColor: scrolled
            ? 'rgb(var(--t-nav-bg) / 0.98)'
            : 'rgb(var(--t-nav-bg) / 0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgb(var(--t-border) / 0.08)',
          boxShadow: scrolled ? '0 2px 24px rgb(var(--t-border) / 0.08)' : 'none',
        }}
      >
        <div className="container-site flex flex-wrap items-center justify-between gap-x-4 gap-y-3">

          {/* Logo — text hidden on very small screens to prevent crowding */}
          <Link to="/" aria-label="IILA — back to home" className="flex-shrink-0 group">
            <span className="hidden sm:inline block transition-transform duration-300 group-hover:scale-105"><IILALogo size={38} showText={true} /></span>
            <span className="sm:hidden block transition-transform duration-300 group-hover:scale-105"><IILALogo size={32} showText={false} /></span>
          </Link>

          {/* Desktop nav — centred */}
          <nav className="hidden lg:flex order-3 w-full items-center justify-center gap-1 border-t border-t-border/10 pt-2" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative whitespace-nowrap px-2.5 py-2 text-[11px] tracking-[0.04em] uppercase font-semibold font-sans transition-all duration-250 ${
                    isActive
                      ? 'text-t-text'
                      : 'text-t-muted hover:text-t-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-3 right-3 h-px bg-t-gold" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* CTA + toggles + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex whitespace-nowrap btn-solid-burgundy py-2.5 px-5 text-[10px]"
            >
              {t.cta}
            </Link>

            <LanguageToggle />
            <ThemeToggle />

            {/* Hamburger */}
            <button
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-menu"
              className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-sm hover:bg-t-text/8 transition-all duration-300 hover:scale-105"
            >
              <span className={`w-5 h-px bg-gold transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`w-5 h-px bg-gold transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`w-5 h-px bg-gold transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      <div
        id="site-mobile-menu"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? '' : undefined}
        className={`fixed inset-0 z-40 flex flex-col lg:hidden overflow-y-auto overscroll-contain pt-20 transition-all duration-300 ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgb(var(--t-nav-bg) / 0.98)', backdropFilter: 'blur(24px)' }}
      >
        <nav className="container-site w-full flex-1 flex flex-col justify-start py-4" aria-label="Mobile navigation">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block py-3 text-lg font-serif font-bold border-b border-t-border/15 transition-all duration-300 ${
                  isActive ? 'text-gold pl-2' : 'text-t-text hover:text-gold hover:pl-1'
                }`
              }
              style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms' }}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-5">
            <Link to="/contact" className="btn-solid-gold w-full justify-center hover:scale-105">
              {t.cta}
            </Link>
          </div>
        </nav>

        {/* Bottom info */}
        <div className="container-site w-full py-5 flex flex-wrap items-center justify-between gap-4 border-t border-t-border/15">
          <p className="text-t-text text-[10px] tracking-[0.18em] uppercase font-bold font-sans">
            IILA · Swiss-registered · info@iila-swiss.org
          </p>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
