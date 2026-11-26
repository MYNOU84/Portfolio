import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EXPERIENCE } from '../data/experience'

/*
  Previously an alternating left/right timeline with a centre rail.
  It is a widely reproduced pattern, it left half of every row empty,
  and it made this one section several thousand pixels tall.

  Replaced with a register: period in a fixed left column, the post on
  the right, separated by hairlines — how a CV or a drawing index reads.
*/
function ExperienceRow({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: Math.min(index, 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-4 py-10 border-t border-white-warm/10"
    >
      {/* Period rail */}
      <div className="md:col-span-3">
        <p className="text-gold text-[11px] tracking-[0.16em] uppercase tabular-nums">{item.period}</p>
        <p className="text-grey-muted text-[11px] mt-2">{item.location}</p>
        <p className="text-grey-muted/70 text-[10px] tracking-[0.16em] uppercase mt-1">{item.type}</p>
      </div>

      {/* Post */}
      <div className="md:col-span-9">
        <h3 className="font-display text-xl sm:text-2xl text-white-warm leading-snug tracking-tight">
          {item.role}
        </h3>
        <p className="text-white-warm/70 text-sm mt-1.5">{item.company}</p>

        <ul className="mt-5 space-y-2.5 max-w-3xl">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-white-warm/60 text-sm leading-6">
              <span className="mt-2.5 h-px w-3 bg-gold/60 shrink-0" aria-hidden="true" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {item.tools?.length > 0 && (
          <p className="mt-5 text-[11px] text-grey-muted tracking-wide">
            {item.tools.join('  ·  ')}
          </p>
        )}
      </div>
    </motion.article>
  )
}

export default function Experience() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-5"
          >
            <div className="gold-line" />
            <span className="section-label">Work History</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <h2 className="section-title">
              Professional <span className="text-gold">Experience</span>
            </h2>
            <p className="text-grey-muted text-sm">
              {EXPERIENCE.length} posts · 16+ years
            </p>
          </motion.div>
        </div>

        <div className="border-b border-white-warm/10">
          {EXPERIENCE.map((item, i) => (
            <ExperienceRow key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
