import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

const STATS = [
  { value: '37',   label: 'A1 Boards' },
  { value: '8',    label: 'Thematic Zones' },
  { value: 'AED 35M', label: 'Budget Envelope' },
  { value: 'EN / AR', label: 'Bilingual Submission' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function FeaturedCompetition() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="dubai-competition" className="relative py-28 sm:py-36 overflow-hidden bg-deep-black" ref={ref}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`${BASE}projects/al-safa-living-intelligence-park/img-001.jpg`}
          alt="Al Safa Living Intelligence Park — National Day film night, Z6 Community Event Lawn"
          className="w-full h-full object-cover object-top"
          draggable={false}
          onContextMenu={e => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/85 to-deep-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black/90 via-deep-black/30 to-deep-black/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} className="flex items-center gap-4 mb-8">
          <div className="gold-line" />
          <span className="section-label">Live Design Competition &middot; Dubai Municipality</span>
        </motion.div>

        <motion.h2
          variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl text-white-warm leading-[1.05] mb-4 max-w-3xl"
        >
          Al Safa <span className="text-gold italic">Living Intelligence</span> Park
        </motion.h2>

        <motion.p
          variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.15 }}
          dir="rtl" className="text-gold/80 text-xl sm:text-2xl mb-6 max-w-3xl text-right"
          style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
        >
          حديقة الصفا للذكاء الحي
        </motion.p>

        <motion.p
          variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.2 }}
          className="text-white-warm/70 text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
        >
          Concept and preliminary design entry for the Dubai Municipality AI Park Design Challenge —
          reimagining the 15,037&nbsp;m&sup2; Al Safa&nbsp;2 neighbourhood park through an AI-integrated,
          Emirati-identity landscape strategy. Eight thematic zones under a shade-first canopy system,
          an oasis / majlis / falaj spatial language, and a documented AI-in-design-process methodology.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.25 }}
          className="flex flex-wrap items-center gap-8 sm:gap-12 mb-12"
        >
          {STATS.map(s => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-3xl text-gold leading-none">{s.value}</p>
              <p className="text-grey-muted text-[10px] tracking-[0.28em] uppercase mt-2">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href={`${BASE}dubai-municipality-competition.html`}
            target="_blank" rel="noopener noreferrer"
            className="group btn-primary flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            View Full Submission <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>
          <button
            onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="group btn-outline flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            Explore The Project <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
