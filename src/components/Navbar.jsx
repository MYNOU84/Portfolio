import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Portfolio',  href: '#portfolio' },
  { label: 'MEP System', href: 'https://portfolio-five-kappa-d7gqte5vgz.vercel.app/mep-system-bim-coordination.html', external: true },
  { label: 'Services',   href: '#services' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navbar({ isAdmin = false, onAdminToggle }) {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const logoClicks = useRef(0)
  const logoTimer  = useRef(null)

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveHash('#' + e.target.id)
        })
      },
      { threshold: 0.3 }
    )
    NAV_LINKS.forEach(l => {
      const el = document.querySelector(l.href)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-deep-black/90 backdrop-blur-2xl border-b border-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <motion.button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 border border-gold/70 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold transition-all duration-300">
              <span className="font-display text-gold text-sm font-bold tracking-widest">AB</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-white-warm text-[11px] tracking-[0.35em] uppercase">Berchache</p>
              <p className="text-gold text-[9px] tracking-[0.45em] uppercase">Senior Architect</p>
            </div>
          </motion.button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => link.external ? window.location.href = link.href : scrollTo(link.href)}
                className="relative text-grey-muted hover:text-white-warm text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 group pb-1 cursor-pointer"
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-300 ${
                    activeHash === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <a
                href="/cv/M-Amine-Berchache-CV.pdf"
                download
                className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase px-5 py-2 border border-gold/60 text-gold hover:bg-gold hover:text-deep-black hover:border-gold transition-all duration-300"
              >
                <Download size={11} />
                CV
              </a>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gold p-1 cursor-pointer"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} /></motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={22} /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-deep-black/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-10"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => link.external ? window.location.href = link.href : scrollTo(link.href)}
                className="text-white-warm hover:text-gold font-display text-3xl tracking-wider transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </motion.button>
            ))}
            {isAdmin && (
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                href="/cv/M-Amine-Berchache-CV.pdf"
                download
                onClick={() => setMenuOpen(false)}
                className="mt-4 btn-outline flex items-center gap-2"
              >
                <Download size={14} />
                Download CV
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
