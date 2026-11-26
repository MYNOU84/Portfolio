import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, ShieldCheck, Users, FileSpreadsheet, CalendarRange, Database, Eye } from 'lucide-react'

const BASE = import.meta.env.BASE_URL
const LIVE_URL = 'https://buildtrack-pro-tan.vercel.app'

const SHOTS = [
  { file: 'dashboard.jpg', label: 'Portfolio dashboard' },
  { file: 'project.jpg',   label: 'Project overview & administration' },
  { file: 'schedule.jpg',  label: 'Schedule, milestones & Gantt' },
  { file: 'weekly.jpg',    label: 'Weekly reports' },
]

const CAPABILITIES = [
  { icon: Users,           title: 'Owner & team management',  text: 'Owner-only user administration, project membership and per-project roles: project manager, site engineer, consultant, contractor and client.' },
  { icon: CalendarRange,   title: 'Site reporting',           text: 'Daily site reports, generated weekly and monthly reports, schedule and milestones, HSE, risks and NCRs, plant, resources and documents.' },
  { icon: FileSpreadsheet, title: 'PDF & Excel exports',      text: 'Every module exports to PDF and Excel, plus a complete multi-sheet project export for the owner.' },
  { icon: ShieldCheck,     title: 'Server-side security',     text: 'httpOnly session cookies, CSRF header, role checks on every route and closed public registration.' },
  { icon: Eye,             title: 'Isolated public demo',     text: 'One-click demo accounts that can only read and export two fictional projects. Writes and private data are refused by the server.' },
  { icon: Database,        title: 'PostgreSQL & persistence', text: 'React, Express and Prisma on PostgreSQL (Neon), with persistent document storage on zero-cost serverless hosting.' },
]

const STATS = [
  { value: '15+',        label: 'Project Modules' },
  { value: '6',          label: 'Project Roles' },
  { value: 'PDF / XLSX', label: 'Exports' },
  { value: 'Live',       label: 'Public Demo' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function SoftwareProject() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActive] = useState(0)
  const anim = (delay = 0) => ({ variants: fadeUp, initial: 'hidden', animate: inView ? 'show' : 'hidden', transition: { delay } })

  return (
    <section id="buildtrack-pro" className="relative py-28 sm:py-36 overflow-hidden bg-deep-black" ref={ref}>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div {...anim()} className="flex items-center gap-4 mb-8">
          <div className="gold-line" />
          <span className="section-label">Software &middot; Construction Management Platform</span>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.25fr] gap-12 lg:gap-16 items-start">
          <div>
            <motion.h2 {...anim(0.1)} className="font-display text-4xl sm:text-6xl text-white-warm leading-[1.05] mb-6">
              BuildTrack <span className="text-gold italic">Pro</span>
            </motion.h2>

            <motion.p {...anim(0.15)} className="text-white-warm/70 text-base sm:text-lg leading-relaxed mb-10">
              A full-stack construction project tracker I designed and built to run site operations end to end,
              from daily reports and schedules to weekly and monthly reporting, risks, HSE and documents. It has
              owner-controlled accounts, role-based permissions and a read-only public demo on fictional projects.
            </motion.p>

            <motion.div {...anim(0.2)} className="flex flex-wrap items-center gap-8 sm:gap-10 mb-10">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="font-display text-2xl sm:text-3xl text-gold leading-none">{s.value}</p>
                  <p className="text-grey-muted text-[10px] tracking-[0.28em] uppercase mt-2">{s.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div {...anim(0.25)} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href={LIVE_URL} target="_blank" rel="noopener noreferrer"
                className="group btn-primary flex items-center gap-3 w-full sm:w-auto justify-center whitespace-nowrap">
                Live Demo <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
              <p className="text-grey-muted text-xs leading-relaxed max-w-xs">
                Pick any &ldquo;Explore as&rdquo; role, no sign-up needed. Demo data is fictional and read-only.
              </p>
            </motion.div>
          </div>

          <motion.div {...anim(0.2)}>
            <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-gold/25 bg-dark-grey shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={SHOTS[active].file}
                  src={`${BASE}projects/buildtrack-pro/${SHOTS[active].file}`}
                  alt={`BuildTrack Pro: ${SHOTS[active].label}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                  loading="lazy" draggable={false} onContextMenu={e => e.preventDefault()}
                />
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {SHOTS.map((s, i) => (
                <button key={s.file} type="button" onClick={() => setActive(i)} aria-label={s.label} title={s.label}
                  className={`relative aspect-[16/10] overflow-hidden rounded-sm border transition-colors duration-300 ${i === active ? 'border-gold' : 'border-white-warm/10 hover:border-gold/50'}`}>
                  <img src={`${BASE}projects/buildtrack-pro/${s.file}`} alt="" loading="lazy" draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    className={`w-full h-full object-cover object-top transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`} />
                </button>
              ))}
            </div>
            <p className="text-grey-muted text-[10px] tracking-[0.28em] uppercase mt-3">{SHOTS[active].label}</p>
          </motion.div>
        </div>

        <motion.div {...anim(0.3)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/15 border border-gold/15 mt-16">
          {CAPABILITIES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-deep-black p-6 sm:p-7">
              <Icon size={18} className="text-gold mb-4" strokeWidth={1.5} />
              <h3 className="text-white-warm text-sm tracking-wide mb-2">{title}</h3>
              <p className="text-grey-muted text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
