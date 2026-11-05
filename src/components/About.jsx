import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Phone, ExternalLink, Award, Globe, Star, Monitor } from 'lucide-react'

const COMPETENCY_GROUPS = [
  {
    group: 'Design & Documentation',
    items: [
      'Architectural Design Development','Technical Documentation','DD-to-Tender Packages',
      'IFC Drawing Coordination','Design Review & Audits','Interior Space Planning','Layout Analysis',
      'Tender / IFC / Shop Drawing Review','Buildability',
    ],
  },
  {
    group: 'Sectors',
    items: [
      'Super High-Rise & Mixed-Use','Healthcare / Oncology Facilities','Hospital Functional Planning','Medical Equipment Interfaces',
    ],
  },
  {
    group: 'BIM & Standards',
    items: [
      'BIM Coordination','ISO 19650 Workflows','EIR','LOD / LOIN','BEP, MIDP & TIDP Review','CDE / ACC',
      'Federated Model Coordination','Clash Review','Model Data & Naming Conventions',
    ],
  },
  {
    group: 'Coordination & Authorities',
    items: [
      'Multidisciplinary Coordination','Architecture / Structure / MEP Coordination','Façade Coordination',
      'Dubai Building Code','Dubai Municipality','Dubai Civil Defence','DEWA',
    ],
  },
  {
    group: 'Delivery & Site',
    items: [
      'RFIs & Submittals','BOQ Review','QA/QC','Site Technical Coordination',
    ],
  },
  {
    group: 'AI in Practice',
    items: [
      'AI Architectural Visualization','Revit–Claude MCP Automation','CAD-to-BIM Workflows',
    ],
  },
]

const SOFTWARE = [
  'Autodesk Revit','Navisworks Manage','AutoCAD','BIM 360',
  'Autodesk Construction Cloud','Bluebeam Revu','Enscape',
  'Twinmotion','Adobe Photoshop','Adobe Lightroom',
]

const HIGHLIGHTS = [
  'Coordinated architectural and technical review for a 90-storey Downtown Dubai residential tower and a 50-storey Sheikh Zayed Road tower (approx. 130,000 m² GFA).',
  'Supported detailed design and tender deliverables on Kings’ Square — an eight-tower mixed-use project in Riyadh (approx. 151,473 m² GFA).',
  'Reviewed and updated BEP, MIDP, TIDP and CDE processes under ISO 19650; checked model data against client EIR and LOD / LOIN expectations.',
  'Healthcare portfolio across five hospitals in Algeria — Jijel (240 beds), Ghardaia, Chlef Anti-Cancer Centre (140 beds), Boumerdes (240 beds) and Constantine Oncology (approx. 160 beds).',
  'Contractor-side technical experience covering IFC / shop drawing review, RFIs, submittals, quantities and medical equipment interfaces.',
]

const LANGUAGES = [
  { lang: 'Arabic',  level: 'Native', note: 'C2' },
  { lang: 'French',  level: 'Upper Intermediate', note: 'B2' },
  { lang: 'English', level: 'Upper Intermediate', note: 'B2' },
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
              Senior Technical Architect &<br />
              <span className="text-gold">BIM Coordinator</span>
            </h2>
            <p className="text-white-warm/70 leading-8 mb-6">
              Senior Technical Architect and BIM Coordinator with{' '}
              <span className="text-gold font-semibold">16+ years</span> of experience across the UAE
              and Algeria, and project delivery exposure in Saudi Arabia.
            </p>
            <p className="text-white-warm/60 leading-8 mb-6">
              Career progression from architectural design and hospital functional planning to
              construction-stage technical coordination, BIM information management and complex
              super high-rise developments.
            </p>
            <p className="text-white-warm/60 leading-8 mb-10">
              Combines consultant- and contractor-side judgment with RICS BIM Management
              certification (ISO 19650), practical AI architectural visualization and developing
              Revit–Claude MCP / CAD-to-BIM automation workflows.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin,       text: 'Based in Algeria · Available for UAE opportunities' },
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
                  <div key={l.lang} className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-white-warm text-sm">{l.lang}</span>
                    <span className="text-grey-muted text-xs">
                      {l.level}
                      <span className="text-gold/60 ml-2 tracking-[0.15em]">{l.note}</span>
                    </span>
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
                  <p className="text-white-warm text-sm font-semibold">RICS BIM Management Certificate &mdash; ISO 19650</p>
                  <p className="text-grey-muted text-xs mt-1">RICS &middot; 2024</p>
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
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETENCY_GROUPS.map(({ group, items }) => (
              <div key={group}>
                <p className="text-gold/70 text-[10px] tracking-[0.3em] uppercase mb-3">{group}</p>
                <ul className="space-y-1.5">
                  {items.map(c => (
                    <li key={c} className="text-white-warm/60 text-[13px] leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.65em] before:w-1.5 before:h-px before:bg-gold/40 before:content-['']">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
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
