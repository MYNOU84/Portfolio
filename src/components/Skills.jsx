import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import * as Icons from 'lucide-react'
import { SKILLS } from '../data/skills'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function SkillCard({ skill }) {
  const Icon = Icons[skill.icon] || Icons.Star
  return (
    <motion.div
      variants={cardVariant}
      className="group relative bg-dark-grey border border-white-warm/5 p-5 cursor-default
        hover:border-gold/40 hover:bg-dark-grey/80
        hover:shadow-[0_0_35px_rgba(201,164,92,0.12)]
        transition-all duration-500"
    >
      <div className="mb-4">
        <div className="w-11 h-11 border border-gold/20 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-300">
          <Icon size={18} className="text-gold/70 group-hover:text-gold transition-colors duration-300" />
        </div>
      </div>

      <p className="text-white-warm text-sm font-medium leading-snug mb-3">{skill.label}</p>

      <div className="h-px bg-white-warm/8 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gold"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="flex justify-end mt-1.5">
        <span className="text-gold/50 text-[10px]">{skill.level}%</span>
      </div>

      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-gold/0 group-hover:border-gold/50 transition-all duration-300" />
    </motion.div>
  )
}

export default function Skills() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="py-32 bg-charcoal relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,164,92,1) 1px,transparent 1px),linear-gradient(90deg,rgba(201,164,92,1) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="gold-line" />
          <span className="section-label">Technical Profile</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4"
        >
          <h2 className="section-title">
            Skills & <span className="text-gold">Expertise</span>
          </h2>
          <p className="text-grey-muted text-sm max-w-xs text-right hidden sm:block">
            16+ years building expertise across architecture, BIM, and project delivery
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {SKILLS.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
