import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Phone, ExternalLink, Award, Globe, Star, Monitor } from 'lucide-react'

const COMPETENCIES = [
  'Architectural Design Development','Technical Documentation','DD-to-Tender Packages',
  'IFC Drawing Coordination','High-Rise Residential','Mixed-Use Projects',
  'Healthcare Architecture','Hospital Design Coordination','BIM Coordination',
  'ISO 19650 Workflows','BEP / MIDP / TIDP','CDE Governance',
  'Federated Model Coordination','Clash Detection & Resolution','Revit Model Audits',
  'Multidisciplinary Coordination (Arch/Str/MEP)','Facade Coordination',
  'Authority Submission Coordination','Dubai Municipality','Dubai Civil Defence','DEWA',
  'RFI Management','Submittal Review','BOQ & Quantity Validation',
  'QA/QC','Site Coordination','Snagging','Handover Support',
  'Interior Space Planning','Layout Analysis','Design Review & Audits',
  'AI-Assisted Visualization','Prompt Engineering for AEC Workflows',
]

const SOFTWARE = [
  'Autodesk Revit','Navisworks Manage','AutoCAD','BIM 360',
  'Autodesk Construction Cloud','Bluebeam Revu','Enscape',
  'Twinmotion','Adobe Photoshop','Adobe Lightroom',
]

const HIGHLIGHTS = [
  'Contributed to tender-stage coordination on Kings’ Square — an 8-tower mixed-use development in Riyadh, Saudi Arabia, with a GFA of 151,473 m².',
  'Led multidisciplinary coordination across architecture, structure, MEP, façade and BMU/cleaning systems, resolving 1,500+ coordination clashes prior to tender stage.',
  'Developed ISO 19650-aligned BIM documentation including BEP, MIDP and TIDP frameworks supporting CDE governance, model quality control and naming convention compliance.',
  'Delivered healthcare projects including a 240-bed hospital and a 140-bed Anti-Cancer Centre in Algeria — concept through BIM production, BOQ validation and site coordination.',
  'Gained 4+ years of contractor-side BIM and site experience covering RFI cycles, submittal review, QA/QC, snagging and handover support.',
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
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'}
          className="flex items-center gap-4 mb-16">
          <div className="gold-line" />
          <span className="section-label">Professional Profile</span>
        </motion.div>

        {/* Top grid: Bio + Competencies */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-20">

          {/* Left - Bio */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.1 }}>
            <h2 className="section-title mb-8">
              Senior Architect &<br />
              <span className="text-gold">BIM Coordinator</span>
            </h2>
            <p className="text-white-warm/70 leading-8 mb-6">
              Senior Architect and BIM Coordinator with{' '}
              <span className="text-gold font-semibold">16+ years</span> of experience across the UAE,
              Saudi Arabia and Algeria, covering high-rise residential, mixed-use, healthcare, public
              and interior design projects.
            </p>
            <p className="text-white-warm/60 leading-8 mb-6">
              Currently coordinating two major Dubai high-rise projects: a 90-storey residential tower
              in Downtown Dubai and a 50-storey tower on Sheikh Zayed Road (GFA 130,000 m²). Strong
              background in ISO 19650-aligned BIM workflows, BEP, MIDP, TIDP, CDE governance, federated
              model coordination and clash resolution using Revit, Navisworks and Autodesk Construction Cloud.
            </p>
            <p className="text-white-warm/60 leading-8 mb-10">
              Hands-on contractor-side and consultant-side experience with strong knowledge of Dubai
              Municipality, Dubai Civil Defence and DEWA submission coordination. Healthcare experience
              includes a 240-bed hospital and a 140-bed Anti-Cancer Centre — from concept through
              tender, BIM coordination and site execution.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin,       text: 'Dubai, UAE' },
                { icon: Mail,        text: 'berchache.mohamedamine@gmail.com' },
                { icon: Phone,       text: '+971 55 314 6783' },
                { icon: ExternalLink, text: 'linkedin.com/in/mohamed-al-amine-berchache' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={14} className="text-gold shrink-0" />
                  <span className="text-grey-muted text-sm">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Languages + Education */}
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.25 }}
            className="space-y-12">

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
                      <motion.div className="absolute top-0 left-0 h-full bg-gold"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${l.pct}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                <Award size={12} className="text-gold" />
                Education &amp; Certification
              </h3>
              <div className="space-y-4">
                <div className="border-l border-gold/30 pl-5">
                  <p className="text-white-warm text-sm font-semibold">B.Sc. Architectural Engineering</p>
                  <p className="text-grey-muted text-xs mt-1">University of Mentouri Constantine, Algeria &middot; 2009</p>
                </div>
                <div className="border-l border-gold/30 pl-5">
                  <p className="text-white-warm text-sm font-semibold">BIM Management &mdash; ISO 19650</p>
                  <p className="text-grey-muted text-xs mt-1">RICS-accredited Online Academy, London &middot; 2024</p>
                </div>
                <div className="border-l border-gold/20 pl-5">
                  <p className="text-gold/70 text-xs italic">In Progress 2026: AI for AEC Workflows &middot; n8n Automation &middot; Claude Code &middot; PMP (planned)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-width: Core Competencies */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.3 }}
          className="mb-16">
          <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
            <div className="gold-line w-6" />
            Core Competencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {COMPETENCIES.map(c => (
              <span key={c} className="text-white-warm/70 text-xs border border-white/10 rounded px-3 py-1.5 hover:border-gold/40 hover:text-gold/80 transition-colors">
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Full-width: Software Skills */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.35 }}
          className="mb-16">
          <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
            <Monitor size={12} className="text-gold" />
            Software Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {SOFTWARE.map(s => (
              <span key={s} className="text-gold/80 text-xs border border-gold/20 rounded px-3 py-1.5 hover:border-gold/60 hover:text-gold transition-colors">
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Full-width: Key Career Highlights */}
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay: 0.4 }}>
          <h3 className="text-white-warm text-xs tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
            <Star size={12} className="text-gold" />
            Key Career Highlights
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="border-l border-gold/30 pl-4">
                <p className="text-white-warm/65 text-sm leading-7">{h}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
