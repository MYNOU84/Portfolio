import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Wrench } from 'lucide-react'
import { EXPERIENCE } from '../data/experience'

function ExperienceCard({ item, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}
    >
      {/* Timeline dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-4 h-4 rounded-full bg-gold border-4 border-deep-black shadow-[0_0_20px_rgba(201,152,44,0.6)]"
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}
          bg-dark-grey border border-white-warm/5 p-6
          hover:border-gold/25 hover:shadow-[0_0_40px_rgba(201,152,44,0.08)]
          transition-all duration-500`}
      >
        <div className="inline-block border border-gold/30 px-3 py-1 text-gold text-[10px] tracking-[0.3em] uppercase mb-4">
          {item.period}
        </div>

        <h3 className="font-display text-xl text-white-warm mb-1">{item.role}</h3>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-gold text-sm font-semibold">{item.company}</span>
          <span className="flex items-center gap-1 text-grey-muted text-xs">
            <MapPin size={10} />
            {item.location}
          </span>
          <span className={`text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border ${
            item.type === 'Consultant'
              ? 'border-gold/30 text-gold/70'
              : 'border-grey-muted/30 text-grey-muted/70'
          }`}>
            {item.type}
          </span>
        </div>

        <ul className="space-y-2 mb-5">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-white-warm/65 text-sm leading-6">
              <span className="text-gold mt-2 text-[7px] shrink-0">◆</span>
              {h}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 flex-wrap">
          <Wrench size={11} className="text-gold/50" />
          {item.tools.map(t => (
            <span key={t} className="text-[10px] text-grey-muted/70 tracking-wider border border-white-warm/8 px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const headerRef    = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="experience" className="py-32 bg-deep-black relative overflow-hidden">
      <div className="absolute top-20 right-0 text-[10rem] font-display text-white-warm/[0.012] leading-none select-none pointer-events-none overflow-hidden">
        CAREER
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="gold-line" />
            <span className="section-label">Work History</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-title mb-20"
          >
            Professional <span className="text-gold">Experience</span>
          </motion.h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/15 to-transparent -translate-x-1/2" />
          <div className="space-y-12">
            {EXPERIENCE.map((item, i) => (
              <ExperienceCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
