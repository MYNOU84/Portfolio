import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Upload, Link, Trash2, Film, ChevronLeft } from 'lucide-react'

// ── YouTube URL → privacy-enhanced embed URL ──────────────────────────────────
const getYouTubeEmbedUrl = (input) => {
  if (!input) return null
  try {
    const url = new URL(input.trim())
    let id = null
    if (url.hostname === 'youtu.be') {
      id = url.pathname.slice(1)
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') {
        id = url.searchParams.get('v')
      } else if (url.pathname.startsWith('/shorts/')) {
        id = url.pathname.split('/')[2]
      } else if (url.pathname.startsWith('/embed/')) {
        id = url.pathname.split('/')[2]
      }
    }
    if (!id) return null
    id = id.split('?')[0].split('&')[0]
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`
  } catch (err) {
    console.error('Invalid YouTube URL', err)
    return null
  }
}

const STORAGE_KEY = 'portfolio-video'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null } catch { return null }
}

function getValidSavedEmbedUrl(saved) {
  if (!saved || saved.type !== 'youtube') return null
  const u = saved.embedUrl || ''
  if (u.includes('/embed/')) return u
  localStorage.removeItem(STORAGE_KEY)
  return null
}

// ── Video gallery data ────────────────────────────────────────────────────────
// type: 'local'   → src  points to a file in public/videos/
// type: 'youtube' → url  is any YouTube link (watch / shorts / youtu.be)
// thumbnail is optional — set to null if you have no image.

const VIDEO_CATEGORIES = ['All', 'Render', 'Construction', 'Detail', 'Walkthrough', 'Other']

const videoGallery = [
  {
    id: 1,
    title: 'Villa Exterior Render',
    category: 'Render',
    type: 'local',
    src: '/videos/render/render-01.mp4',
    thumbnail: null,
  },
  {
    id: 2,
    title: 'New AI Render Process',
    category: 'Render',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: null,
  },
  {
    id: 3,
    title: 'Construction Progress',
    category: 'Construction',
    type: 'local',
    src: '/videos/construction/construction-01.mp4',
    thumbnail: null,
  },
  {
    id: 4,
    title: 'Facade Detail',
    category: 'Detail',
    type: 'local',
    src: '/videos/detail/detail-01.mp4',
    thumbnail: null,
  },
  {
    id: 5,
    title: 'Walkthrough Tour',
    category: 'Walkthrough',
    type: 'local',
    src: '/videos/walkthrough/walkthrough-01.mp4',
    thumbnail: null,
  },
]

// ── Inline confirm dialog ─────────────────────────────────────────────────────
function RemoveConfirm({ onCancel, onConfirm }) {
  return (
    <div className="flex items-center gap-3 mt-3 p-3 border border-gold/20 bg-deep-black/60">
      <span className="text-white-warm/70 text-xs flex-1">Remove this video?</span>
      <button
        onClick={onCancel}
        className="text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border border-white-warm/15
          text-grey-muted hover:text-white-warm transition-colors duration-200 cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border border-gold/40
          text-gold hover:bg-gold/10 transition-all duration-200 cursor-pointer"
      >
        Remove
      </button>
    </div>
  )
}

// ── Enable-sound button (shared) ──────────────────────────────────────────────
function EnableSoundBtn({ videoRef }) {
  const handleClick = async () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.defaultMuted = false
    v.volume = 1
    try { await v.play() } catch (err) { console.error('Play blocked:', err) }
  }
  return (
    <div className="mt-3 flex items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold
          text-[9px] tracking-[0.3em] uppercase hover:bg-gold/10
          transition-all duration-300 cursor-pointer"
      >
        ▶ Enable sound
      </button>
      <span className="text-grey-muted/35 text-[9px]">
        Click Enable sound if your browser starts the video muted.
      </span>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
function VideoModal({ onClose, localUrl, setLocalUrl, isAdmin }) {
  const saved = loadSaved()

  const [tab, setTab]               = useState('youtube')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [ytEmbedUrl, setYtEmbedUrl] = useState(() => getValidSavedEmbedUrl(saved))
  const [ytError, setYtError]       = useState('')

  // Gallery state
  const [activeCategory, setActiveCategory]     = useState('All')
  const [activeGalleryVideo, setActiveGalleryVideo] = useState(null)

  const [confirmRemove, setConfirmRemove] = useState(false)

  const fileRef          = useRef(null)
  const uploadedVideoRef = useRef(null)
  const galleryVideoRef  = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // ── YouTube ────────────────────────────────────────────────────────────────
  const handleYtSubmit = () => {
    setYtEmbedUrl(null)
    setYtError('')
    const embedUrl = getYouTubeEmbedUrl(youtubeUrl)
    console.log('FINAL YOUTUBE EMBED URL:', embedUrl)
    if (!embedUrl) { setYtError('Could not find a YouTube video ID in this URL.'); return }
    setYtEmbedUrl(embedUrl)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ type: 'youtube', embedUrl }))
    setConfirmRemove(false)
  }

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLocalUrl(URL.createObjectURL(file))
    setConfirmRemove(false)
  }

  const clearLocal = () => {
    setLocalUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Remove (YouTube only) ──────────────────────────────────────────────────
  const doRemove = () => {
    if (tab === 'youtube') { setYtEmbedUrl(null); setYoutubeUrl(''); localStorage.removeItem(STORAGE_KEY) }
    if (tab === 'upload')  { clearLocal() }
    setConfirmRemove(false)
  }

  // ── Filtered gallery ───────────────────────────────────────────────────────
  const filtered = activeCategory === 'All'
    ? videoGallery
    : videoGallery.filter(v => v.category === activeCategory)

  const TABS = [
    ...(isAdmin ? [{ id: 'youtube', label: 'YouTube', Icon: Link }] : []),
    { id: 'gallery',  label: 'Video Gallery', Icon: Film   },
    ...(isAdmin ? [{ id: 'upload',  label: 'Upload',  Icon: Upload }] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        className="relative w-full max-w-4xl bg-dark-grey border border-gold/25
          shadow-[0_0_100px_rgba(201,152,44,0.10)] max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Close button ───────────────────────────────────────── */}
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center
            border border-white-warm/15 bg-deep-black/80 backdrop-blur-sm
            text-grey-muted hover:border-gold hover:text-gold
            transition-all duration-300 cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4 border-b border-white-warm/8 shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="gold-line w-5" />
            <span className="text-gold text-[9px] tracking-[0.45em] uppercase">Showreel</span>
          </div>
          <h3 className="font-display text-lg text-white-warm leading-tight">
            Project Showreel
          </h3>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div className="flex border-b border-white-warm/8 shrink-0">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id)
                setConfirmRemove(false)
                if (id !== 'gallery') setActiveGalleryVideo(null)
              }}
              className={`flex items-center gap-2 px-5 py-3 text-[9px] tracking-[0.3em] uppercase
                transition-all duration-300 cursor-pointer border-b-2
                ${tab === id
                  ? 'text-gold border-gold'
                  : 'text-grey-muted hover:text-white-warm border-transparent'}`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {/* ── Body (scrollable) ──────────────────────────────────── */}
        <div className="p-5 overflow-y-auto flex-1">

          {/* ── YouTube tab ──────────────────────────────────────── */}
          {tab === 'youtube' && (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={e => { setYoutubeUrl(e.target.value); setYtError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleYtSubmit() }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 bg-deep-black border border-white-warm/12 text-white-warm text-sm
                    px-4 py-2.5 placeholder-grey-muted/35 focus:outline-none focus:border-gold/55
                    transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={handleYtSubmit}
                  className="btn-primary px-4 flex items-center gap-2 shrink-0 text-xs"
                >
                  <Link size={12} /> Embed
                </button>
              </div>

              {ytError && (
                <p className="text-red-400/75 text-[10px] mb-2 pl-1">{ytError}</p>
              )}
              <p className="text-grey-muted/40 text-[9px] tracking-wide mb-4">
                Supports: youtube.com/watch · youtu.be · youtube.com/shorts
              </p>

              {ytEmbedUrl && (
                <iframe
                  src={ytEmbedUrl}
                  title="YouTube video player"
                  className="w-full aspect-video"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}

              {!ytEmbedUrl && (
                <div className="flex flex-col items-center justify-center h-44
                  border border-white-warm/6 text-grey-muted/25 gap-3">
                  <Play size={32} className="text-gold/30" />
                  <span className="text-xs tracking-wider">Enter a URL above to preview</span>
                </div>
              )}

              {ytEmbedUrl && (
                confirmRemove
                  ? <RemoveConfirm onCancel={() => setConfirmRemove(false)} onConfirm={doRemove} />
                  : (
                    <button
                      onClick={() => setConfirmRemove(true)}
                      className="mt-3 flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase
                        text-grey-muted/50 hover:text-red-400/70 transition-colors cursor-pointer"
                    >
                      <Trash2 size={11} /> Remove video
                    </button>
                  )
              )}
            </div>
          )}

          {/* ── Video Gallery tab ─────────────────────────────────── */}
          {tab === 'gallery' && (
            <div>
              {/* Player view */}
              {activeGalleryVideo ? (
                <div>
                  <button
                    onClick={() => setActiveGalleryVideo(null)}
                    className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase
                      text-grey-muted/60 hover:text-gold transition-colors cursor-pointer mb-4"
                  >
                    <ChevronLeft size={12} /> Back to gallery
                  </button>

                  <p className="text-white-warm/80 text-sm font-medium mb-1">
                    {activeGalleryVideo.title}
                  </p>
                  <p className="text-gold/50 text-[9px] tracking-[0.3em] uppercase mb-3">
                    {activeGalleryVideo.category}
                  </p>

                  {activeGalleryVideo.type === 'youtube' ? (
                    <iframe
                      src={getYouTubeEmbedUrl(activeGalleryVideo.url)}
                      title={activeGalleryVideo.title}
                      className="w-full aspect-video"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <video
                        ref={galleryVideoRef}
                        key={activeGalleryVideo.src}
                        src={activeGalleryVideo.src}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full"
                        style={{ maxHeight: '52vh', background: '#000' }}
                        onLoadedMetadata={(e) => {
                          e.currentTarget.muted = false
                          e.currentTarget.defaultMuted = false
                          e.currentTarget.volume = 1
                        }}
                        onCanPlay={(e) => {
                          e.currentTarget.muted = false
                          e.currentTarget.defaultMuted = false
                          e.currentTarget.volume = 1
                        }}
                      />
                      <EnableSoundBtn videoRef={galleryVideoRef} />
                    </>
                  )}
                </div>
              ) : (
                /* Grid view */
                <div>
                  {/* Category filters */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {VIDEO_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border
                          transition-all duration-300 cursor-pointer
                          ${activeCategory === cat
                            ? 'border-gold bg-gold text-deep-black font-semibold'
                            : 'border-white-warm/15 text-grey-muted hover:border-gold/50 hover:text-white-warm'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Video card grid */}
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-44
                      border border-white-warm/6 text-grey-muted/30 gap-3 text-center px-6">
                      <Film size={28} className="text-gold/30" />
                      <p className="text-xs tracking-wide leading-6">
                        No videos in this category yet.<br />
                        Add <span className="text-gold/60">.mp4</span> files to{' '}
                        <span className="text-white-warm/50">
                          public/videos/{activeCategory.toLowerCase()}/
                        </span>{' '}
                        and register them in <span className="text-white-warm/50">VideoSection.jsx</span>.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filtered.map(video => (
                        <button
                          key={video.id}
                          onClick={() => setActiveGalleryVideo(video)}
                          className="group relative bg-deep-black border border-white-warm/8
                            hover:border-gold/40 transition-all duration-300 cursor-pointer text-left
                            overflow-hidden"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-28 bg-dark-grey overflow-hidden">
                            {/* YT badge */}
                            {video.type === 'youtube' && (
                              <span className="absolute top-1.5 left-1.5 z-10 bg-deep-black/80
                                text-gold text-[7px] tracking-widest uppercase px-1.5 py-0.5
                                border border-gold/30">
                                YT
                              </span>
                            )}
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105
                                  transition-transform duration-500"
                                draggable={false}
                                onContextMenu={e => e.preventDefault()}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film size={24} className="text-gold/20" />
                              </div>
                            )}
                            {/* Play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center
                              bg-deep-black/0 group-hover:bg-deep-black/50 transition-all duration-300">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                w-9 h-9 rounded-full border border-gold/60 bg-gold/10
                                flex items-center justify-center">
                                <Play size={12} className="text-gold fill-gold ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Card info */}
                          <div className="px-3 py-2.5">
                            <p className="text-white-warm/85 text-xs font-medium leading-tight
                              group-hover:text-gold transition-colors duration-300 line-clamp-1">
                              {video.title}
                            </p>
                            <p className="text-gold/45 text-[8px] tracking-[0.25em] uppercase mt-1">
                              {video.category}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Upload tab ───────────────────────────────────────── */}
          {tab === 'upload' && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mov"
                className="hidden"
                onChange={handleFile}
              />

              {!localUrl ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-44 border border-dashed border-white-warm/12
                    hover:border-gold/45 flex flex-col items-center justify-center gap-3
                    text-grey-muted hover:text-white-warm transition-all duration-300 cursor-pointer"
                >
                  <Upload size={26} className="text-gold/45" />
                  <span className="text-xs tracking-[0.25em] uppercase">Click to select video</span>
                  <span className="text-[9px] text-grey-muted/35 tracking-wide">MP4 · WebM · MOV</span>
                </button>
              ) : (
                <div>
                  <video
                    ref={uploadedVideoRef}
                    src={localUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full"
                    style={{ maxHeight: '52vh', background: '#000' }}
                  />

                  {confirmRemove
                    ? <RemoveConfirm onCancel={() => setConfirmRemove(false)} onConfirm={doRemove} />
                    : (
                      <div className="mt-3 flex items-center gap-5">
                        <button
                          onClick={clearLocal}
                          className="text-[9px] text-grey-muted/50 hover:text-gold
                            transition-colors tracking-[0.3em] uppercase cursor-pointer"
                        >
                          ← Choose different file
                        </button>
                        <button
                          onClick={() => setConfirmRemove(true)}
                          className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase
                            text-grey-muted/50 hover:text-red-400/70 transition-colors cursor-pointer"
                        >
                          <Trash2 size={11} /> Remove
                        </button>
                      </div>
                    )
                  }
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
  const [open, setOpen]         = useState(false)
  const [localUrl, setLocalUrl] = useState(null)

  return (
    <section id="showreel" className="py-32 bg-deep-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,152,44,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,152,44,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(201,152,44,0.07) 0%, transparent 70%)' }}
      />

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

        <button
          onClick={() => setOpen(true)}
          className="group relative mx-auto flex items-center justify-center w-24 h-24 cursor-pointer"
          aria-label="Open showreel"
        >
          <span className="absolute inset-0 rounded-full border border-gold/25
            group-hover:border-gold/60 transition-all duration-500" />
          <motion.span
            className="absolute inset-0 rounded-full border border-gold/12"
            animate={{ scale: [1, 1.4], opacity: [0.55, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
          <span className="relative w-16 h-16 rounded-full bg-gold/8 border border-gold/35
            flex items-center justify-center
            group-hover:bg-gold/18 group-hover:border-gold/60
            transition-all duration-300">
            <Play size={20} className="text-gold fill-gold ml-1" />
          </span>
        </button>

        <p className="text-grey-muted/40 text-[9px] tracking-[0.5em] uppercase mt-5">
          Watch Showreel
        </p>
      </div>

      <AnimatePresence>
        {open && (
          <VideoModal
            onClose={() => setOpen(false)}
            localUrl={localUrl}
            setLocalUrl={setLocalUrl}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
