import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import * as Icons from 'lucide-react'
import { SERVICES } from '../data/services'

export default function Services() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" className="py-32 bg-charcoal relative overflow-hidden" ref={ref}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="gold-line" />
              <span className="section-label">What I Offer</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="section-title mb-8"
            >
              Services &<br />
              <span className="text-gold">Expertise</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white-warm/60 leading-8 mb-10"
            >
              Available for full-time, consulting, and BIM coordination roles worldwide.
              Specialising in high-rise residential, healthcare, and mixed-use programs
              with a track record across UAE and Algeria.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary cursor-pointer"
              >
                Get In Touch
              </button>
              <a href="/cv/M-Amine-Berchache-CV.pdf" download className="btn-outline text-center">
                Download CV
              </a>
            </motion.div>
          </div>

          {/* Right — services list */}
          <div>
            {SERVICES.map((service, i) => {
              const Icon = Icons[service.iconName] || Icons.Star
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="group flex items-start gap-5 py-5 border-b border-white-warm/6
                    hover:border-gold/20 cursor-default transition-all duration-300
                    hover:bg-dark-grey/30 px-4 -mx-4"
                >
                  <div className="shrink-0 w-10 h-10 border border-gold/25 flex items-center justify-center
                    group-hover:border-gold/60 group-hover:bg-gold/5 transition-all duration-300 mt-0.5">
                    <Icon size={16} className="text-gold/70 group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-white-warm font-medium text-sm tracking-wide group-hover:text-gold transition-colors duration-300">
                        {service.title}
                      </h3>
                      <span className="text-gold/0 group-hover:text-gold/60 text-xs transition-all duration-300 shrink-0 ml-3">→</span>
                    </div>
                    <p className="text-grey-muted/70 text-xs leading-6">{service.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
