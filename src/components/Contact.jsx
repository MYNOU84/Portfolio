import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink, MessageCircle, Send } from 'lucide-react'

const CONTACT_INFO = [
  { icon: Mail,     label: 'Email',    value: 'berchache.mohamedamine@gmail.com', href: 'mailto:berchache.mohamedamine@gmail.com' },
  { icon: Phone,    label: 'Phone',    value: '+971 55 314 6783',                 href: 'tel:+971553146783' },
  { icon: MapPin,   label: 'Location', value: 'Dubai, UAE',                       href: null },
  { icon: ExternalLink, label: 'LinkedIn', value: 'linkedin.com/in/mohamed-al-amine-berchache', href: 'https://linkedin.com/in/mohamed-al-amine-berchache' },
]

const inputClass = [
  'w-full bg-dark-grey border border-white-warm/10 px-4 py-3',
  'text-white-warm text-sm placeholder:text-grey-muted/40',
  'focus:outline-none focus:border-gold/50 hover:border-white-warm/20',
  'transition-colors duration-200',
].join(' ')

export default function Contact() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Enquiry from ${form.name}`)
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:berchache.mohamedamine@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="py-32 bg-charcoal relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="gold-line" />
          <span className="section-label">Get In Touch</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="section-title mb-16"
        >
          Contact &amp; <span className="text-gold">Collaborate</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-white-warm/60 leading-8 mb-10">
              Available for full-time, consulting, and BIM coordination roles worldwide.
              Open to Senior Architect, Lead Architect, and BIM Manager positions across UAE and GCC.
            </p>

            <div className="space-y-6 mb-10">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 border border-gold/25 flex items-center justify-center shrink-0
                    group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-300 mt-0.5">
                    <Icon size={14} className="text-gold/70" />
                  </div>
                  <div>
                    <p className="text-grey-muted text-[10px] tracking-[0.3em] uppercase mb-1">{label}</p>
                    {href
                      ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-white-warm text-sm hover:text-gold transition-colors duration-200 break-all">{value}</a>
                      : <p className="text-white-warm text-sm">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/971553146783"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-green-600/40 text-green-400 px-6 py-3 text-xs tracking-[0.25em] uppercase hover:bg-green-900/20 hover:border-green-500/60 transition-all duration-300"
            >
              <MessageCircle size={14} />
              Message on WhatsApp
            </a>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-grey-muted text-[10px] tracking-[0.3em] uppercase mb-2">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className={inputClass} />
            </div>
            <div>
              <label className="block text-grey-muted text-[10px] tracking-[0.3em] uppercase mb-2">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className={inputClass} />
            </div>
            <div>
              <label className="block text-grey-muted text-[10px] tracking-[0.3em] uppercase mb-2">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." required rows={6} className={`${inputClass} resize-none`} />
            </div>

            <button type="submit" className="group w-full btn-primary flex items-center justify-center gap-3 mt-2">
              {sent
                ? '✓ Opening Email Client...'
                : <>
                    <Send size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    Send Message
                  </>
              }
            </button>
            <p className="text-grey-muted/40 text-[10px] text-center">Opens your email client with the message pre-filled</p>
          </motion.form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 border-t border-white-warm/5 pt-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-grey-muted/50 text-xs tracking-wider">
            © 2026 M. Amine Berchache — Senior Architect & BIM Coordinator
          </p>
          <p className="text-grey-muted/30 text-[10px] tracking-wider">
            Dubai, UAE · ISO 19650 · Revit · Navisworks
          </p>
        </div>
      </div>
    </section>
  )
}
