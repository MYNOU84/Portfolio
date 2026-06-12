import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Grid3x3, Compass, ZoomIn, ZoomOut } from 'lucide-react'
import RotateIcon from './RotateIcon'

const PAN_SPRING  = { stiffness: 80, damping: 22, mass: 1 }
const MIN_ZOOM    = 0.25
const MAX_ZOOM    = 4

export default function ImmersiveView({ project, onClose, onOpenGallery }) {
  const [imgIndex, setImgIndex]       = useState(0)
  const [hintVisible, setHintVisible] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [zoom, setZoom]               = useState(1)
  const [rotation, setRotation]       = useState(0)
  const [isDragging, setIsDragging]   = useState(false)
  const containerRef  = useRef(null)
  const dragStart     = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const directionRef  = useRef('next')

  /* spring values — pan offset */
  const panX = useSpring(0, PAN_SPRING)
  const panY = useSpring(0, PAN_SPRING)

  /* fade hint */
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 2800)
    return () => clearTimeout(t)
  }, [])

  /* helpers */
  const resetMotion = useCallback(() => {}, [])

  const resetPan  = useCallback(() => { panX.set(0); panY.set(0) }, [panX, panY])
  const zoomIn    = useCallback(() => setZoom(z => Math.min(+(z + 0.25).toFixed(2), MAX_ZOOM)), [])
  const zoomOut   = useCallback(() => setZoom(z => Math.max(+(z - 0.25).toFixed(2), MIN_ZOOM)), [])
  const resetZoom = useCallback(() => { setZoom(1); setRotation(0); panX.set(0); panY.set(0) }, [panX, panY])
  const rotate    = useCallback(() => setRotation(r => r - 90), [])

  /* max pan range — allow panning at any zoom level */
  const maxPan = () => Math.max(Math.abs(zoom - 1) * 500, 200)

  /* scroll-wheel zoom */
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.12 : 0.12
    setZoom(z => Math.min(Math.max(+(z + delta).toFixed(2), MIN_ZOOM), MAX_ZOOM))
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  /* ── Mouse handlers ──────────────────────────────────────────── */
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, px: panX.get(), py: panY.get() }
  }, [panX, panY])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const mp = maxPan()
    panX.set(Math.min(Math.max(dragStart.current.px + dx, -mp), mp))
    panY.set(Math.min(Math.max(dragStart.current.py + dy, -mp), mp))
  }, [isDragging, panX, panY])

  const handleMouseUp    = useCallback(() => setIsDragging(false), [])
  const handleMouseLeave = useCallback(() => setIsDragging(false), [])

  /* touch pan */
  const touchDrag = useRef({ active: false, x: 0, y: 0, px: 0, py: 0 })
  const handleTouchStart = useCallback((e) => {
    if (!e.touches[0]) return
    touchDrag.current = { active: true, x: e.touches[0].clientX, y: e.touches[0].clientY, px: panX.get(), py: panY.get() }
  }, [panX, panY])

  const handleTouchMove = useCallback((e) => {
    if (!e.touches[0] || !touchDrag.current.active) return
    const dx = e.touches[0].clientX - touchDrag.current.x
    const dy = e.touches[0].clientY - touchDrag.current.y
    const mp = maxPan()
    panX.set(Math.min(Math.max(touchDrag.current.px + dx, -mp), mp))
    panY.set(Math.min(Math.max(touchDrag.current.py + dy, -mp), mp))
  }, [panX, panY])

  const handleTouchEnd = useCallback(() => { touchDrag.current.active = false }, [])

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')            { onClose(); return }
      if (e.key === 'ArrowRight')        goNext()
      if (e.key === 'ArrowLeft')         goPrev()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-')                 zoomOut()
      if (e.key === '0')                 resetZoom()
      if (e.key === 'r' || e.key === 'R') rotate()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const images  = project.images || []
  const current = images[imgIndex]

  const goPrev = () => {
    if (imgIndex > 0 && !transitioning) {
      directionRef.current = 'prev'
      setTransitioning(true); setImgIndex(i => i - 1)
      setZoom(1); setRotation(0); resetPan(); resetMotion()
      setTimeout(() => setTransitioning(false), 500)
    }
  }
  const goNext = () => {
    if (imgIndex < images.length - 1 && !transitioning) {
      directionRef.current = 'next'
      setTransitioning(true); setImgIndex(i => i + 1)
      setZoom(1); setRotation(0); resetPan(); resetMotion()
      setTimeout(() => setTransitioning(false), 500)
    }
  }

  /* cursor style — always grab (no auto-move, user controls everything) */
  const cursor = isDragging ? 'grabbing' : 'grab'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 bg-deep-black select-none"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor }}
    >
      {/* ── 3D stage ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1400px' }}>

        {/* Ambient bg */}
        <div className="absolute inset-0 opacity-20">
          <img src={current} alt="" className="w-full h-full object-cover"
            style={{ filter: 'blur(30px) brightness(0.25) saturate(0.4)' }}
            draggable={false} onContextMenu={e => e.preventDefault()} />
        </div>

        {/* Main image — zoom + pan only (no rotation) */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: rotation }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{
            scale: zoom,
            x: panX,
            y: panY,
            willChange: 'transform',
            transformStyle: 'preserve-3d',
          }}
        >
          <AnimatePresence mode="sync" custom={directionRef.current}>
            <motion.img
              key={current}
              src={current}
              alt=""
              custom={directionRef.current}
              variants={{
                enter: (dir) => ({
                  rotateY: dir === 'next' ? 90 : -90,
                  opacity: 0,
                }),
                center: {
                  rotateY: 0,
                  opacity: 1,
                },
                exit: (dir) => ({
                  rotateY: dir === 'next' ? -90 : 90,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              style={{ pointerEvents: 'none', backfaceVisibility: 'hidden' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, transparent 18%, transparent 70%, rgba(5,5,5,0.75) 100%)',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(5,5,5,0.5) 0%, transparent 18%, transparent 82%, rgba(5,5,5,0.5) 100%)',
          }} />
        </motion.div>
      </div>

      {/* Outer vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(5,5,5,0.65) 100%)',
      }} />

      {/* no custom cursor — browser grab/grabbing handles it */}

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 pt-6 z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <Compass size={12} className="text-gold" />
          <span className="text-gold text-[9px] tracking-[0.45em] uppercase">Immersive View</span>
          <span className="text-gold/50 text-[9px] tracking-[0.3em] uppercase ml-2">· Drag to Pan</span>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          {onOpenGallery && (
            <button onClick={onOpenGallery}
              className="flex items-center gap-2 border border-white-warm/20 px-4 py-2 text-[9px] tracking-[0.3em] uppercase text-grey-muted hover:border-gold/60 hover:text-gold transition-all duration-300 cursor-pointer">
              <Grid3x3 size={10} />Gallery Grid
            </button>
          )}
          <button onClick={onClose}
            className="w-9 h-9 border border-white-warm/20 flex items-center justify-center text-white-warm hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Zoom controls ───────────────────────────────────────── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button onClick={zoomIn} disabled={zoom >= MAX_ZOOM}
          className="w-9 h-9 border border-white-warm/20 flex items-center justify-center text-white-warm hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-20 cursor-pointer">
          <ZoomIn size={14} />
        </button>
        <div className="w-9 flex items-center justify-center cursor-pointer" onClick={resetZoom} title="Reset zoom (key: 0)">
          <span className="text-gold/60 text-[9px] tracking-wider">{Math.round(zoom * 100)}%</span>
        </div>
        <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM}
          className="w-9 h-9 border border-white-warm/20 flex items-center justify-center text-white-warm hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-20 cursor-pointer">
          <ZoomOut size={14} />
        </button>
        <button onClick={rotate} title="Rotate 90° (key: R)"
          className="w-9 h-9 border border-white-warm/20 flex items-center justify-center text-white-warm hover:border-gold hover:text-gold transition-all duration-200 cursor-pointer">
          <RotateIcon size={14} />
        </button>
      </div>

      {/* ── Hint ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: 3, duration: 1 }}
              className="border border-gold/40 px-6 py-3">
              <p className="text-gold text-[9px] tracking-[0.5em] uppercase">Move · Scroll/+− Zoom · Drag to Pan</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Left / Right nav ────────────────────────────────────── */}
      <button onClick={goPrev} disabled={imgIndex === 0}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 border border-white-warm/15 flex items-center justify-center text-white-warm hover:border-gold hover:text-gold transition-all duration-300 disabled:opacity-15 cursor-pointer">
        <ChevronLeft size={18} />
      </button>
      <button onClick={goNext} disabled={imgIndex === images.length - 1}
        className="absolute right-20 top-1/2 -translate-y-1/2 z-10 w-11 h-11 border border-white-warm/15 flex items-center justify-center text-white-warm hover:border-gold hover:text-gold transition-all duration-300 disabled:opacity-15 cursor-pointer">
        <ChevronRight size={18} />
      </button>

      {/* ── Bottom info ──────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-8 pb-8 z-10 pointer-events-none">
        <div>
          <p className="text-gold/80 text-[9px] tracking-[0.45em] uppercase mb-1.5">
            {project.category}&nbsp;&nbsp;·&nbsp;&nbsp;{project.year}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-white-warm leading-tight mb-1">{project.title}</h2>
          <p className="text-grey-muted text-xs tracking-wider">{project.location}</p>
        </div>
        <div className="text-right pointer-events-auto">
          <p className="text-white-warm/80 font-display text-3xl leading-none">{String(imgIndex + 1).padStart(2, '0')}</p>
          <p className="text-grey-muted/40 text-xs tracking-widest mt-1">/ {String(images.length).padStart(2, '0')}</p>
          <div className="flex gap-1.5 mt-3 justify-end">
            {images.slice(Math.max(0, imgIndex - 2), imgIndex + 3).map((img, i) => {
              const realIdx = Math.max(0, imgIndex - 2) + i
              return (
                <button key={realIdx} onClick={() => { directionRef.current = realIdx > imgIndex ? 'next' : 'prev'; setImgIndex(realIdx); setZoom(1); resetPan() }}
                  className={`w-8 h-6 overflow-hidden transition-all duration-300 cursor-pointer ${realIdx === imgIndex ? 'ring-1 ring-gold opacity-100' : 'opacity-35 hover:opacity-70'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover"
                    draggable={false} onContextMenu={e => e.preventDefault()} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Keyboard hint ───────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="text-grey-muted/30 text-[8px] tracking-[0.4em] uppercase">
          ← → Navigate · Scroll/+− Zoom · Drag Pan · 0 Reset · Esc Close
        </span>
      </div>
    </motion.div>
  )
}

function CrosshairCursor({ zoom }) {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  useEffect(() => {
    const f = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', f)
    return () => window.removeEventListener('mousemove', f)
  }, [])
  const s = zoom > 1 ? 36 : 28
  return (
    <div className="fixed pointer-events-none z-20" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)' }}>
      <div className="relative" style={{ width: s, height: s }}>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gold/70" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/70" />
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  )
}
