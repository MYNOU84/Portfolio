import { useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'
import { ChevronDown, ArrowRight, Download, Mail } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.5 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show:   { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const STATS = [
  { value: '16+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '2',   label: 'Countries' },
]

export default function Hero() {
  /* ── Spring MotionValues for parallax + 3D tilt ─────────────── */
  const imgX  = useSpring(0, { stiffness: 38, damping: 24, mass: 1.2 })
  const imgY  = useSpring(0, { stiffness: 38, damping: 24, mass: 1.2 })
  const tiltX = useSpring(0, { stiffness: 48, damping: 20, mass: 0.9 })
  const tiltY = useSpring(0, { stiffness: 48, damping: 20, mass: 0.9 })

  /* ── Mouse tracking ──────────────────────────────────────────── */
  useEffect(() => {
    const onMouse = (e) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2  // −1 … +1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      imgX.set(nx * -18)   // image drifts opposite to cursor
      imgY.set(ny * -6)
      tiltX.set(ny * -3)   // subtle 3D tilt vertical
      tiltY.set(nx * 5)    // subtle 3D tilt horizontal
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [imgX, imgY, tiltX, tiltY])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background — parallax + tilt + cinematic zoom ───────── */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1200px' }}>

        {/* Motion wrapper: oversized 6% on all sides so edges never show during movement */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-6%', right: '-6%', bottom: '-6%', left: '-6%',
            x: imgX,
            y: imgY,
            rotateX: tiltX,
            rotateY: tiltY,
            willChange: 'transform',
          }}
        >
          <motion.img
            src={`${BASE}hero/hero-bg.png`}
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.48) saturate(1.1) contrast(1.08)',
              transformOrigin: 'center center',
            }}
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>

        {/* Gradients — unchanged */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black/85 via-transparent to-deep-black/40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 75% at 18% 55%, rgba(201,152,44,0.10) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 45% 55% at 75% 35%, rgba(201,152,44,0.05) 0%, transparent 60%)' }} />
      </div>

      {/* Architectural grid overlay */}
      <div className="absolute inset-0 opacity-[0.022] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(201,152,44,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,152,44,1) 1px, transparent 1px)', backgroundSize: '90px 90px' }} />

      {/* Fine grain */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20">
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-10">
          <div className="gold-line" />
          <span className="section-label">Architecture & BIM Coordination</span>
          <div className="gold-line" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] text-white-warm leading-[0.95] tracking-tight mb-6">
          M.&nbsp;Amine<br /><span className="text-gold italic">Berchache</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-grey-muted text-xs sm:text-sm tracking-[0.45em] uppercase mb-5">
          Senior Architect&nbsp;&nbsp;·&nbsp;&nbsp;BIM Coordinator&nbsp;&nbsp;·&nbsp;&nbsp;ISO 19650
        </motion.p>

        <motion.p variants={itemVariants} className="text-white-warm/60 text-lg sm:text-xl font-display font-light italic max-w-xl mx-auto mb-12 leading-relaxed">
          Designing spaces with precision,<br className="hidden sm:block" /> coordination, and visual impact.
        </motion.p>

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-8 sm:gap-16 mb-14">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl sm:text-5xl text-gold leading-none">{s.value}</p>
              <p className="text-grey-muted text-[10px] tracking-[0.3em] uppercase mt-2">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="group btn-primary flex items-center gap-3 w-full sm:w-auto justify-center">
            View Portfolio <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <a href={`${BASE}cv/M-Amine-Berchache-CV.pdf`} download className="btn-outline flex items-center gap-3 w-full sm:w-auto justify-center">
            <Download size={14} /> Download CV
          </a>
          <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-grey-muted hover:text-white-warm text-xs tracking-[0.3em] uppercase px-8 py-3 flex items-center gap-3 transition-colors duration-300 w-full sm:w-auto justify-center cursor-pointer">
            <Mail size={14} /> Contact Me
          </button>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer" onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="text-grey-muted text-[9px] tracking-[0.5em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <ChevronDown size={18} className="text-gold" />
        </motion.div>
      </motion.div>
    </section>
  )
}
