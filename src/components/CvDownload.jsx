import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Download, Quote } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

export default function CvDownload() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="cv" className="py-32 bg-deep-black relative overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(201,152,44,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Quote size={32} className="text-gold/25 mx-auto mb-8" />
          <blockquote className="font-display text-2xl sm:text-3xl text-white-warm/80 italic leading-relaxed mb-5">
            &ldquo;Architecture is the will of an epoch<br className="hidden sm:block" /> translated into space.&rdquo;
          </blockquote>
          <cite className="text-gold text-sm tracking-[0.35em] uppercase not-italic">
            — Ludwig Mies van der Rohe
          </cite>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-24 h-px bg-gold mx-auto mb-12"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-grey-muted text-sm tracking-wider mb-8">
            16+ years · 50+ projects · Available for Senior Architect, Lead Architect & BIM Coordinator roles
          </p>
          <a
            href={`${BASE}cv/M-Amine-Berchache-CV.pdf`}
            download
            className="group inline-flex items-center gap-4 bg-gold text-deep-black px-10 py-4 text-xs tracking-[0.4em] uppercase font-semibold hover:bg-beige transition-all duration-300"
          >
            <Download size={15} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            Download Full CV
          </a>
        </motion.div>
      </div>
    </section>
  )
}
