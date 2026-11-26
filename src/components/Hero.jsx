import { useEffect } from 'react'
import { motion, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

/* Factual register — reads as drawing-sheet metadata, not as stat counters */
const REGISTER = [
  { k: 'Experience', v: '16+ Years' },
  { k: 'Projects',   v: '50+ Delivered' },
  { k: 'Regions',    v: 'UAE · KSA · Algeria' },
  { k: 'Standard',   v: 'ISO 19650' },
]

export default function Hero() {
  const reduced = useReducedMotion()

  /* Spring MotionValues for parallax + 3D tilt */
  const imgX  = useSpring(0, { stiffness: 38, damping: 24, mass: 1.2 })
  const imgY  = useSpring(0, { stiffness: 38, damping: 24, mass: 1.2 })
  const tiltX = useSpring(0, { stiffness: 48, damping: 20, mass: 0.9 })
  const tiltY = useSpring(0, { stiffness: 48, damping: 20, mass: 0.9 })

  /* Mouse tracking — the visitor looks around inside the room */
  useEffect(() => {
    if (reduced) return
    const onMouse = (e) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2  // -1 ... +1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      imgX.set(nx * -22)
      imgY.set(ny * -8)
      tiltX.set(ny * -2.2)
      tiltY.set(nx * 3.6)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [imgX, imgY, tiltX, tiltY, reduced])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Room */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1400px' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '-6%', right: '-6%', bottom: '-6%', left: '-6%',
            x: imgX, y: imgY, rotateX: tiltX, rotateY: tiltY,
            willChange: 'transform',
          }}
        >
          <motion.img
            src={`${BASE}hero/hero-bg.png`}
            alt="Interior view of a contemporary residential space overlooking the Dubai skyline"
            className="w-full h-full object-cover"
            width={1376}
            height={768}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              /* Raised from 0.48 — the room is the entrance to the portfolio,
                 not a background. It has to be legible. */
              filter: 'brightness(var(--hero-dim)) saturate(1.04) contrast(1.04)',
              transformOrigin: 'center center',
            }}
            initial={{ scale: 1.0 }}
            animate={reduced ? { scale: 1.04 } : { scale: 1.09 }}
            transition={reduced ? { duration: 0 } : { duration: 26, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>

        {/* Directional scrim — heavy where the type sits, open where the room reads */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgb(var(--c-deep-black) / 0.94) 0%, rgb(var(--c-deep-black) / 0.80) 26%, rgb(var(--c-deep-black) / 0.34) 55%, rgb(var(--c-deep-black) / 0.12) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(var(--c-deep-black) / 0.96) 0%, rgb(var(--c-deep-black) / 0.45) 28%, transparent 62%)' }} />
        <div className="absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(to bottom, rgb(var(--c-deep-black) / 0.85), transparent)' }} />
      </div>

      {/* Architectural module grid — structure, not decoration */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--c-white-warm) / 1) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-white-warm) / 1) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          maskImage: 'linear-gradient(100deg, rgba(0,0,0,0.9) 0%, transparent 62%)',
          WebkitMaskImage: 'linear-gradient(100deg, rgba(0,0,0,0.9) 0%, transparent 62%)',
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-14"
      >
        <div className="max-w-3xl">
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-9">
            <div className="gold-line" />
            <span className="section-label">Architecture &amp; BIM Coordination</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-white-warm mb-7 leading-[0.92] tracking-[-0.025em] text-[3.25rem] sm:text-7xl lg:text-[6rem] xl:text-[7rem]"
          >
            M.&nbsp;Amine
            <br />
            <span className="text-gold">Berchache</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-7">
            <span className="hairline w-10 flex-shrink-0 hidden sm:block" />
            <p className="text-white-warm/75 text-[11px] sm:text-xs tracking-[0.2em] uppercase leading-relaxed max-w-2xl">
              Senior Technical Architect &middot; BIM Coordinator &ndash; ISO&nbsp;19650 Certified &middot;
              Healthcare &amp; High-Rise Projects &middot; Multidisciplinary Design Coordination &middot;
              AI Visualization &amp; Automation
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-white-warm/55 text-base sm:text-lg font-light max-w-lg mb-12 leading-relaxed"
          >
            Designing, coordinating and documenting buildings that get built &mdash;
            from concept through federated model to site.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="group btn-primary flex items-center justify-center gap-3"
            >
              View Work
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href={`${BASE}cv/Berchache_Amine_CV_ATS_FINAL.pdf`}
              download
              className="btn-outline flex items-center justify-center gap-3"
            >
              <Download size={13} /> Download CV
            </a>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost hidden sm:block"
            >
              Contact
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Register rail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 w-full border-t border-white-warm/10 bg-deep-black/35 backdrop-blur-[2px]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {REGISTER.map((r, i) => (
              <div
                key={r.k}
                className={[
                  'py-5 sm:py-6',
                  i > 0 ? 'sm:border-l sm:border-white-warm/10 sm:pl-6' : '',
                  i % 2 === 1 ? 'border-l border-white-warm/10 pl-6' : '',
                  i < 2 ? 'border-b border-white-warm/10 sm:border-b-0' : '',
                ].join(' ')}
              >
                <dt className="eyebrow mb-1.5">{r.k}</dt>
                <dd className="text-white-warm text-sm sm:text-base tracking-tight">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </section>
  )
}
