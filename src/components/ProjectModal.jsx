import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, MapPin, Calendar, Tag } from 'lucide-react'

export default function ProjectModal({ project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom]                 = useState(1)
  const [imgErrors, setImgErrors]       = useState({})

  const validImages = project.images.filter((_, i) => !imgErrors[i])

  const prev = useCallback(() => {
    setZoom(1)
    setCurrentIndex(i => (i - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  const next = useCallback(() => {
    setZoom(1)
    setCurrentIndex(i => (i + 1) % validImages.length)
  }, [validImages.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
      if (e.key === '+')           setZoom(z => Math.min(z + 0.3, 3))
      if (e.key === '-')           setZoom(z => Math.max(z - 0.3, 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const markError = (i) => setImgErrors(e => ({ ...e, [i]: true }))

  if (!validImages.length) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-deep-black/98 backdrop-blur-sm flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white-warm/8 shrink-0 gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg sm:text-xl text-white-warm truncate">{project.title}</h2>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-grey-muted text-xs">
              <MapPin size={10} className="text-gold shrink-0" />
              {project.location}
            </span>
            <span className="flex items-center gap-1 text-grey-muted text-xs">
              <Calendar size={10} className="text-gold shrink-0" />
              {project.year}
            </span>
            <span className="text-grey-muted text-xs">
              {currentIndex + 1}<span className="text-gold mx-1">/</span>{validImages.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setZoom(z => Math.max(z - 0.3, 1))}
            disabled={zoom <= 1}
            className="w-8 h-8 border border-white-warm/15 flex items-center justify-center text-grey-muted hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            title="Zoom out (-)"
          >
            <ZoomOut size={13} />
          </button>
          <span className="w-12 text-center text-xs text-grey-muted hidden sm:block">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(z + 0.3, 3))}
            disabled={zoom >= 3}
            className="w-8 h-8 border border-white-warm/15 flex items-center justify-center text-grey-muted hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            title="Zoom in (+)"
          >
            <ZoomIn size={13} />
          </button>
          <div className="w-px h-5 bg-white-warm/10 mx-1" />
          <button
            onClick={onClose}
            className="w-8 h-8 border border-white-warm/15 flex items-center justify-center text-grey-muted hover:border-gold hover:text-gold transition-all duration-200"
            title="Close (Esc)"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-deep-black">
        <button
          onClick={prev}
          className="absolute left-3 z-20 w-10 h-10 sm:w-12 sm:h-12 border border-white-warm/15 bg-deep-black/60 backdrop-blur-sm flex items-center justify-center text-grey-muted hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-200"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          className="w-full h-full overflow-auto flex items-center justify-center p-4"
          style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={validImages[currentIndex]}
              alt={`${project.title} — view ${currentIndex + 1}`}
              onError={() => markError(currentIndex)}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease',
                maxHeight: 'calc(100vh - 200px)',
                maxWidth: '100%',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </AnimatePresence>
        </div>

        <button
          onClick={next}
          className="absolute right-3 z-20 w-10 h-10 sm:w-12 sm:h-12 border border-white-warm/15 bg-deep-black/60 backdrop-blur-sm flex items-center justify-center text-grey-muted hover:border-gold hover:text-gold hover:bg-gold/10 transition-all duration-200"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-white-warm/8 bg-deep-black">
        {/* Thumbnail strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'thin' }}>
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setZoom(1) }}
              className={`shrink-0 w-14 h-10 overflow-hidden border-2 transition-all duration-200 ${
                i === currentIndex ? 'border-gold opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                onError={() => markError(i)}
                draggable={false}
                onContextMenu={e => e.preventDefault()}
                style={{ pointerEvents: 'none' }}
              />
            </button>
          ))}
        </div>

        {/* Project info */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gold text-xs font-semibold tracking-wide">{project.role}</span>
          <span className="text-grey-muted/60 text-xs hidden sm:block">·</span>
          <p className="text-grey-muted text-xs leading-5 line-clamp-1 hidden sm:block">{project.description}</p>
          <div className="flex gap-2 ml-auto">
            {project.tags.slice(0, 3).map(t => (
              <span key={t} className="flex items-center gap-1 text-[9px] text-grey-muted/50">
                <Tag size={8} className="text-gold/40" />{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
