import { Component, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
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
  const [adminOpen, setAdminOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        setAdminOpen(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <ErrorBoundary>
      <div className="bg-deep-black min-h-screen font-sans">
        <Navbar isAdmin={adminOpen} onAdminToggle={() => setAdminOpen(v => !v)} />
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
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </ErrorBoundary>
  )
}
