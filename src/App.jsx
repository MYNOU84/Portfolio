import { Component, useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import AdminPanel from './components/AdminPanel'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Portfolio from './components/Portfolio'
import VideoSection from './components/VideoSection'
import Services from './components/Services'
import CvDownload from './components/CvDownload'
import Contact from './components/Contact'

// SHA-256 hash of 'BIM2026!'
const ADMIN_HASH = '98aadf56a9d1e6f710d87117d87de0baf0c395dd66a16f0a0706da2e13548447'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function AdminLoginModal({ onSuccess, onCancel }) {
  const [pwd, setPwd]     = useState('')
  const [error, setError] = useState(false)
  const inputRef          = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const hash = await sha256(pwd)
    if (hash === ADMIN_HASH) { onSuccess() }
    else { setError(true); setPwd('') }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(5,5,5,0.92)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-dark-grey border border-gold/25 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="gold-line w-5" />
          <span className="text-gold text-[9px] tracking-[0.45em] uppercase">Admin Access</span>
        </div>
        <p className="text-white-warm/60 text-xs mb-5">Enter your password to access the admin panel.</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false) }}
            placeholder="Password"
            className="w-full bg-deep-black border border-white-warm/12 text-white-warm text-sm
              px-4 py-3 mb-3 placeholder-grey-muted/35 focus:outline-none focus:border-gold/55
              transition-colors duration-300"
          />
          {error && <p className="text-red-400/70 text-[10px] mb-3 pl-1">Incorrect password.</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1 py-2.5 text-xs">Enter</button>
            <button type="button" onClick={onCancel}
              className="flex-1 py-2.5 text-xs border border-white-warm/15 text-grey-muted hover:text-white-warm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#050505', color: '#C9982C', padding: '40px', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: 16 }}>React Error</h2>
          <pre style={{ color: '#fff', fontSize: 13, whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
          <pre style={{ color: '#888', fontSize: 11, marginTop: 12 }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [adminOpen,      setAdminOpen]      = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authenticated,  setAuthenticated]  = useState(false)

  const handleAdminToggle = () => {
    if (adminOpen) { setAdminOpen(false); return }
    if (authenticated) { setAdminOpen(true) }
    else { setShowLoginModal(true) }
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        handleAdminToggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [adminOpen, authenticated])

  return (
    <ErrorBoundary>
      <div className="bg-deep-black min-h-screen font-sans">
        <Navbar isAdmin={adminOpen} onAdminToggle={handleAdminToggle} />
        <main>
          <Hero />
          <About />
          <Experience />
          <Portfolio />
          <VideoSection />
          <Services />
          {adminOpen && <CvDownload />}
          <Contact />
        </main>
      </div>

      <AnimatePresence>
        {showLoginModal && (
          <AdminLoginModal
            onSuccess={() => { setShowLoginModal(false); setAuthenticated(true); setAdminOpen(true) }}
            onCancel={() => setShowLoginModal(false)}
          />
        )}
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </ErrorBoundary>
  )
}
