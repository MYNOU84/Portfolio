import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, ChevronDown } from 'lucide-react'

/*
  Ten flat top-level items crowded the bar between 768 and 1024px and put
  four technical microsites at the same level as "Contact". They now sit
  under one grouped item, and every href is relative — two links were
  previously hardcoded to the Vercel preview domain.
*/
/* ◐ light / dark toggle — same control as the Healthcare Architecture pages.
   The choice is saved under 'ha-theme', so it carries across both. */
function ThemeToggle({ className = '' }) {
  const toggle = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    try { localStorage.setItem('ha-theme', next) } catch { /* storage blocked */ }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light / dark theme"
      title="Light / dark"
      className={`w-8 h-8 flex items-center justify-center text-[13px] leading-none border border-white-warm/20 text-grey-muted hover:border-gold hover:text-gold transition-colors duration-300 cursor-pointer ${className}`}
    >
      ◐
    </button>
  )
}

const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Portfolio',  href: '#portfolio' },
  {
    label: 'Technical',
    children: [
      { label: 'MEP System Coordination', href: '/mep-system-bim-coordination.html' },
      { label: 'FTB Room Data Sheets',    href: '/ftb-rds.html' },
      { label: 'Site Supervision',        href: '/site-supervision.html' },
      { label: 'Architectural Specs',     href: '/architectural-specifications.html' },
      { label: 'Space Planning',          href: '/space-planning/' },
      { label: 'Healthcare Architecture', href: '/healthcare-architecture/index.html' },
    ],
  },
  { label: 'Services', href: '#services' },
  { label: 'Contact',  href: '#contact' },
]

const SECTION_LINKS = NAV_LINKS.filter((l) => l.href)

export default function Navbar({ isAdmin = false, onAdminToggle }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [openGroup, setOpenGroup] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const logoClicks = useRef(0)
  const logoTimer  = useRef(null)
  const groupRef   = useRef(null)

  const handleLogoClick = () => {
    logoClicks.current += 1
    clearTimeout(logoTimer.current)
    if (logoClicks.current >= 3) {
      logoClicks.current = 0
      onAdminToggle?.()
      return
    }
    logoTimer.current = setTimeout(() => { logoClicks.current = 0 }, 1500)
    scrollTo('#hero')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /*
    Picks the section whose top is nearest to (and above) the nav line.
    The previous observer set the active item on any intersection, so the
    highlight lagged behind the section actually on screen.
  */
  useEffect(() => {
    const onScroll = () => {
      let current = ''
      for (const l of SECTION_LINKS) {
        const el = document.querySelector(l.href)
        if (el && el.getBoundingClientRect().top <= 120) current = l.href
      }
      setActiveHash(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close the grouped menu on outside click or Escape */
  useEffect(() => {
    if (!openGroup) return
    const onDown = (e) => { if (groupRef.current && !groupRef.current.contains(e.target)) setOpenGroup(false) }
    const onKey  = (e) => { if (e.key === 'Escape') setOpenGroup(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openGroup])

  /* Lock body scroll while the mobile panel is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href) => {
    if (!href) return
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const linkClass = (href) =>
    `relative text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 pb-1 cursor-pointer ${
      activeHash === href ? 'text-white-warm' : 'text-grey-muted hover:text-white-warm'
    }`

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-deep-black/92 backdrop-blur-xl border-b border-white-warm/10'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
            aria-label="Back to top"
          >
            <span className="w-9 h-9 border border-gold flex items-center justify-center transition-colors duration-300 group-hover:bg-gold">
              <span className="font-display text-gold text-[13px] font-bold tracking-wider transition-colors duration-300 group-hover:text-deep-black">AB</span>
            </span>
            <span className="hidden sm:block leading-tight text-left">
              <span className="block text-white-warm text-[11px] tracking-[0.24em] uppercase">Berchache</span>
              <span className="block text-grey-muted text-[9px] tracking-[0.24em] uppercase">Senior Architect</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative" ref={groupRef}>
                  <button
                    onClick={() => setOpenGroup((v) => !v)}
                    aria-expanded={openGroup}
                    aria-haspopup="true"
                    className="flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-grey-muted hover:text-white-warm transition-colors duration-300 pb-1 cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${openGroup ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openGroup && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full mt-4 w-72 bg-deep-black border border-white-warm/12 py-2"
                      >
                        <p className="px-5 pt-2 pb-3 eyebrow">Technical documentation</p>
                        {link.children.map((c) => (
                          <a
                            key={c.href}
                            href={c.href}
                            onClick={() => setOpenGroup(false)}
                            className="block px-5 py-2.5 text-[12px] text-grey-muted hover:text-white-warm hover:bg-white-warm/5 transition-colors duration-200"
                          >
                            {c.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button key={link.href} onClick={() => scrollTo(link.href)} className={`${linkClass(link.href)} group`}>
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                      activeHash === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            {isAdmin && (
              <a
                href="/cv/Berchache_Amine_CV_ATS_FINAL.pdf"
                download
                className="hidden lg:flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase px-5 py-2 border border-white-warm/20 text-white-warm hover:border-gold hover:text-gold transition-colors duration-300"
              >
                <Download size={11} /> CV
              </a>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white-warm p-1 cursor-pointer"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile panel — scrollable, so the last items are always reachable */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-deep-black/98 backdrop-blur-xl overflow-y-auto overscroll-contain"
          >
            <nav className="min-h-full flex flex-col justify-center px-8 pt-28 pb-16 max-w-md mx-auto w-full">
              {SECTION_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-white-warm hover:text-gold font-display text-3xl py-4 border-b border-white-warm/8 transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}

              <p className="eyebrow mt-10 mb-4">Technical documentation</p>
              {NAV_LINKS.find((l) => l.children).children.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-grey-muted hover:text-white-warm text-sm py-3 border-b border-white-warm/8 transition-colors duration-200"
                >
                  {c.label}
                </a>
              ))}

              {isAdmin && (
                <a
                  href="/cv/Berchache_Amine_CV_ATS_FINAL.pdf"
                  download
                  onClick={() => setMenuOpen(false)}
                  className="mt-10 btn-outline flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download CV
                </a>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
