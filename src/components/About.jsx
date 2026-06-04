import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Phone, ExternalLink, Award, Globe } from 'lucide-react'

const COMPETENCIES = [
  'BIM Management & ISO 19650',
  'Authority Approvals (DM / DCD / DEWA)',
  'Multidisciplinary Coordination (Arch/Str/MEP)',
  'BEP / MIDP / TIDP / CDE Governance',
  'High-Rise & Healthcare Design',
  'Clash Detection & Model Audit',
  'Tender & Construction Documentation',
  'Team Mentoring & Technical Leadership',
]

const LANGUAGES = [
  { lang: 'Arabic',  level: 'Native · C2',             pct: 100 },
  { lang: 'French',  level: 'Upper Intermediate · B2', pct: 75 },
  { lang: 'English', level: 'Upper Intermediate · B2', pct: 75 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function About() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-32 bg-charcoal relative overflow-hidden" ref={ref}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-48 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex items-center gap-4 mb-16"
        >
          <div className="gold-line" />
          <span className="section-label">Professional Profile</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — Bio */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.1 }}
          >
            <h2 className="section-title mb-8">
              Senior Architect &<br />
              <span className="text-gold">BIM Coordinator</span>
            </h2>

            <p className="text-white-warm/70 leading-8 mb-6">
              Senior Architect & BIM Coordinator with{' '}
              <span className="text-gold font-semibold">16+ years</span> of international experience
              delivering high-rise residential, mixed-use and healthcare projects across the UAE and Algeria.
            </p>
            <p className="text-white-warm/60 leading-8 mb-6">
              Currently leading design coordination on two flagship Dubai towers — a 90-storey
              residential tower in Downtown Dubai and a 50+ storey tower on Sheikh Zayed Road.
            </p>
            <p className="text-white-warm/60 leading-8 mb-10">
              RICS-aligned ISO 19650 BIM Management certified, recognised for closing the gap between
              architectural design intent, BIM coordination and authority compliance — delivering
              coordinated technical packages that build cleanly, approve faster and rework less.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin,   text: 'Dubai, UAE' },
                { icon: Mail,     text: 'berchache.mohamedamine@gmail.com' },
                { icon: Phone,    text: '+971 55 314 6783' },
                { icon: ExternalLink, text: 'linkedin.com/in/mohamed-al-amine-berchache' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={14} className="text-gold shrink-0" />
                  <span className="text-grey-muted text-sm">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Competencies + Languages + Education */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            transition={{ delay: 0.25 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                <div className="gold-line w-6" />
                Core Competencies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMPETENCIES.map(c => (
                  <div key={c} className="flex items-start gap-2">
                    <span className="text-gold mt-1.5 text-xs shrink-0">▸</span>
                    <span className="text-white-warm/70 text-sm leading-6">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                <Globe size={12} className="text-gold" />
                Languages
              </h3>
              <div className="space-y-4">
                {LANGUAGES.map(l => (
                  <div key={l.lang}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white-warm text-sm">{l.lang}</span>
                      <span className="text-grey-muted text-xs">{l.level}</span>
                    </div>
                    <div className="h-px bg-dark-grey relative">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gold"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${l.pct}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                <Award size={12} className="text-gold" />
                Education & Certification
              </h3>
              <div className="space-y-4">
                <div className="border-l border-gold/30 pl-5">
                  <p className="text-white-warm text-sm font-semibold">Diplôme d&apos;Architecte D.E.</p>
                  <p className="text-grey-muted text-xs mt-1">EPAU — École Polytechnique d&apos;Architecture et d&apos;Urbanisme, Alger · 2010</p>
                </div>
                <div className="border-l border-gold/30 pl-5">
                  <p className="text-white-warm text-sm font-semibold">BIM Management — ISO 19650</p>
                  <p className="text-grey-muted text-xs mt-1">RICS-accredited Online Academy, London · 2024</p>
                </div>
                <div className="border-l border-gold/20 pl-5">
                  <p className="text-gold/70 text-xs italic">In Progress 2026: AI for AEC Workflows · n8n Automation · Claude Code · PMP (planned)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
