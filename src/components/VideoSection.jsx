import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Plus, Trash2, ExternalLink, Film, Link } from 'lucide-react'

// ── YouTube helpers ───────────────────────────────────────────────────────────
const getYtId = (input) => {
  if (!input) return null
  try {
    const url = new URL(input.trim())
    let id = null
    if (url.hostname === 'youtu.be')              id = url.pathname.slice(1)
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch')              id = url.searchParams.get('v')
      else if (url.pathname.startsWith('/shorts/')) id = url.pathname.split('/')[2]
      else if (url.pathname.startsWith('/embed/'))  id = url.pathname.split('/')[2]
    }
    if (!id) return null
    return id.split('?')[0].split('&')[0]
  } catch { return null }
}

const ytThumb  = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`
const ytWatch  = (id) => `https://www.youtube.com/watch?v=${id}`

// ── Storage ───────────────────────────────────────────────────────────────────
const GALLERY_KEY = 'portfolio-yt-gallery'

const DEFAULT_VIDEOS = [
  { id: 'yt-1', ytId: 'Pwz_uhkKWBE', title: 'The Horizon Restaurant 2', category: 'Interior'     },
  { id: 'yt-2', ytId: 'id3AaDUa7Z0', title: '08 juillet 2020',          category: 'Construction' },
  { id: 'yt-3', ytId: 'P9c5iYk33YQ', title: 'Visite du Minister',       category: 'Construction' },
  { id: 'yt-4', ytId: 'H0uOx2WuHqg', title: 'Preparation',              category: 'Construction' },
  { id: 'yt-5', ytId: 'T-AbnGhcrbU', title: 'CAC CHELEF',               category: 'Construction' },
]

const loadGallery = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(GALLERY_KEY))
    return saved && saved.length > 0 ? saved : DEFAULT_VIDEOS
  } catch { return DEFAULT_VIDEOS }
}
const saveGallery = (list) => localStorage.setItem(GALLERY_KEY, JSON.stringify(list))

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Render', 'BIM', 'Construction', 'Interior', 'Walkthrough', 'Other']

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ video, isAdmin, onRemove }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group relative bg-deep-black border border-white-warm/8 hover:border-gold/40 transition-all duration-300 overflow-hidden">
      {/* Thumbnail — click opens YouTube */}
      <a href={ytWatch(video.ytId)} target="_blank" rel="noopener noreferrer"
        className="block relative h-36 bg-dark-grey overflow-hidden cursor-pointer">
        {!imgError ? (
          <img
            src={ytThumb(video.ytId)}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film size={28} className="text-gold/20" />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-deep-black/0 group-hover:bg-deep-black/50 flex items-center justify-center transition-all duration-300">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full border border-gold/60 bg-gold/10 flex items-center justify-center">
            <Play size={14} className="text-gold fill-gold ml-0.5" />
          </div>
        </div>
        {/* YouTube badge */}
        <div className="absolute top-2 right-2 bg-deep-black/80 border border-white-warm/10 px-1.5 py-0.5 flex items-center gap-1">
          <ExternalLink size={8} className="text-gold/60" />
          <span className="text-[7px] text-gold/60 tracking-wider uppercase">YouTube</span>
        </div>
      </a>

      {/* Info */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white-warm/85 text-xs font-medium leading-tight group-hover:text-gold transition-colors duration-300 line-clamp-2">
            {video.title}
          </p>
          <p className="text-gold/45 text-[8px] tracking-[0.25em] uppercase mt-1">{video.category}</p>
        </div>
        {isAdmin && (
          <button
            onClick={onRemove}
            className="flex-shrink-0 text-white-warm/20 hover:text-red-400/70 transition-colors cursor-pointer mt-0.5"
            title="Remove video">
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────
function VideoModal({ onClose, isAdmin }) {
  const [tab, setTab]             = useState('gallery')
  const [gallery, setGallery]     = useState(() => loadGallery())
  const [activeCategory, setActiveCategory] = useState('All')

  // Add form
  const [ytUrl, setYtUrl]         = useState('')
  const [title, setTitle]         = useState('')
  const [category, setCategory]   = useState('Other')
  const [error, setError]         = useState('')
  const [added, setAdded]         = useState(false)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const handleAdd = () => {
    setError('')
    const ytId = getYtId(ytUrl)
    if (!ytId) { setError('Could not find a YouTube video ID in this URL.'); return }
    if (!title.trim()) { setError('Please enter a title.'); return }
    const entry = { id: `yt-${Date.now()}`, ytId, url: ytUrl.trim(), title: title.trim(), category }
    const updated = [...gallery, entry]
    setGallery(updated)
    saveGallery(updated)
    setYtUrl(''); setTitle(''); setCategory('Other')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleRemove = (id) => {
    const updated = gallery.filter(v => v.id !== id)
    setGallery(updated)
    saveGallery(updated)
  }

  const filtered = activeCategory === 'All'
    ? gallery
    : gallery.filter(v => v.category === activeCategory)

  const TABS = [
    { id: 'gallery', label: 'Video Gallery', Icon: Film },
    ...(isAdmin ? [{ id: 'add', label: 'Add Video', Icon: Plus }] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(5,5,5,0.92)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-4xl bg-dark-grey border border-gold/25 shadow-[0_0_100px_rgba(201,152,44,0.10)] max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center border border-white-warm/15 bg-deep-black/80 text-grey-muted hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer">
          <X size={15} />
        </button>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white-warm/8 shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="gold-line w-5" />
            <span className="text-gold text-[9px] tracking-[0.45em] uppercase">Showreel</span>
          </div>
          <h3 className="font-display text-lg text-white-warm leading-tight">Project Showreel</h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white-warm/8 shrink-0">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[9px] tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer border-b-2 ${
                tab === id ? 'text-gold border-gold' : 'text-grey-muted hover:text-white-warm border-transparent'
              }`}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">

          {/* Gallery tab */}
          {tab === 'gallery' && (
            <div>
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-5">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all duration-300 cursor-pointer ${
                      activeCategory === cat
                        ? 'border-gold bg-gold text-deep-black font-semibold'
                        : 'border-white-warm/15 text-grey-muted hover:border-gold/50 hover:text-white-warm'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-44 border border-white-warm/6 text-grey-muted/30 gap-3 text-center px-6">
                  <Film size={28} className="text-gold/30" />
                  <p className="text-xs tracking-wide leading-6">
                    {gallery.length === 0
                      ? isAdmin ? 'No videos yet. Go to Add Video tab to add your first YouTube video.' : 'No videos yet.'
                      : 'No videos in this category.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filtered.map(video => (
                    <VideoCard key={video.id} video={video} isAdmin={isAdmin} onRemove={() => handleRemove(video.id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add Video tab (admin only) */}
          {tab === 'add' && isAdmin && (
            <div className="max-w-lg">
              <p className="text-white-warm/40 text-xs mb-6 leading-6">
                Add a YouTube video to the gallery. Visitors click the card and go directly to YouTube.
              </p>

              <div className="mb-4">
                <label className="block text-white-warm/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">YouTube URL *</label>
                <div className="flex gap-2">
                  <input
                    value={ytUrl}
                    onChange={e => { setYtUrl(e.target.value); setError('') }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-deep-black border border-white-warm/12 text-white-warm text-sm px-4 py-2.5 placeholder-grey-muted/35 focus:outline-none focus:border-gold/55 transition-colors"
                  />
                  <div className="flex items-center px-3 border border-white-warm/8 bg-deep-black/50">
                    {getYtId(ytUrl)
                      ? <img src={ytThumb(getYtId(ytUrl))} alt="" className="h-9 w-16 object-cover" />
                      : <Link size={14} className="text-gold/30" />
                    }
                  </div>
                </div>
                <p className="text-grey-muted/35 text-[9px] mt-1">Supports: youtube.com/watch · youtu.be · youtube.com/shorts</p>
              </div>

              <div className="mb-4">
                <label className="block text-white-warm/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Title *</label>
                <input
                  value={title}
                  onChange={e => { setTitle(e.target.value); setError('') }}
                  placeholder="e.g. CAL Capital Tower — BIM Walkthrough"
                  className="w-full bg-deep-black border border-white-warm/12 text-white-warm text-sm px-4 py-2.5 placeholder-grey-muted/35 focus:outline-none focus:border-gold/55 transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white-warm/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-deep-black border border-white-warm/12 text-white-warm text-sm px-4 py-2.5 focus:outline-none focus:border-gold/55 transition-colors cursor-pointer">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {error && <p className="text-red-400/75 text-xs mb-4">{error}</p>}

              {added && (
                <p className="text-green-400/70 text-xs mb-4 tracking-wider">✓ Video added to gallery</p>
              )}

              <button onClick={handleAdd}
                className="px-6 py-2.5 bg-gold text-deep-black text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-gold/85 transition-all cursor-pointer">
                Add to Gallery
              </button>

              {/* Current gallery list */}
              {gallery.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white-warm/8">
                  <p className="text-white-warm/30 text-[9px] tracking-[0.3em] uppercase mb-3">Current videos ({gallery.length})</p>
                  <div className="space-y-2">
                    {gallery.map(v => (
                      <div key={v.id} className="flex items-center gap-3 py-2 border-b border-white-warm/5">
                        <img src={ytThumb(v.ytId)} alt="" className="w-14 h-9 object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white-warm/70 text-xs truncate">{v.title}</p>
                          <p className="text-gold/40 text-[8px] tracking-wider uppercase">{v.category}</p>
                        </div>
                        <button onClick={() => handleRemove(v.id)}
                          className="text-white-warm/20 hover:text-red-400/70 transition-colors cursor-pointer flex-shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function VideoSection({ isAdmin = false }) {
  const [open, setOpen] = useState(false)

  return (
    <section id="showreel" className="py-32 bg-deep-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(201,152,44,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,152,44,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(201,152,44,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="gold-line" />
          <span className="section-label">Visual Work</span>
          <div className="gold-line" />
        </div>
        <h2 className="section-title mb-4">
          Project <span className="text-gold">Showreel</span>
        </h2>
        <p className="text-white-warm/45 text-sm max-w-sm mx-auto mb-14 leading-7">
          Architectural visualisations and BIM coordination walkthroughs.
        </p>

        <button onClick={() => setOpen(true)}
          className="group relative mx-auto flex items-center justify-center w-24 h-24 cursor-pointer"
          aria-label="Open showreel">
          <span className="absolute inset-0 rounded-full border border-gold/25 group-hover:border-gold/60 transition-all duration-500" />
          <motion.span className="absolute inset-0 rounded-full border border-gold/12"
            animate={{ scale: [1, 1.4], opacity: [0.55, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />
          <span className="relative w-16 h-16 rounded-full bg-gold/8 border border-gold/35 flex items-center justify-center group-hover:bg-gold/18 group-hover:border-gold/60 transition-all duration-300">
            <Play size={20} className="text-gold fill-gold ml-1" />
          </span>
        </button>
        <p className="text-grey-muted/40 text-[9px] tracking-[0.5em] uppercase mt-5">Watch Showreel</p>
      </div>

      <AnimatePresence>
        {open && <VideoModal onClose={() => setOpen(false)} isAdmin={isAdmin} />}
      </AnimatePresence>
    </section>
  )
}
