import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Folder, Tag, Maximize2, LayoutGrid } from 'lucide-react'
import { PROJECTS, CATEGORIES, PROJECT_ORDER } from '../data/projects'
import { loadAdminData } from './AdminPanel'
import { loadDynamicProjects, loadProjectOrder } from '../utils/dynamicProjects'
import { getBlobUrl } from '../utils/imageDb'
import ProjectModal from './ProjectModal'
import ImmersiveView from './ImmersiveView'

function getProjectImages(project, adminData) {
  const d = adminData[project.id]
  let images = project.images
  if (d?.order && d.order.length === images.length) {
    images = d.order.map(i => project.images[i])
  }
  return images
}

function getCoverImage(project, adminData) {
  const d = adminData[project.id]
  const coverIdx = d?.cover ?? 0
  return project.images[coverIdx] || project.images[0]
}

function ProjectCard({ project, onImmersive, onGallery, adminData }) {
  const [hovered, setHovered] = useState(false)
  const coverImg = getCoverImage(project, adminData)

  return (
    <div
      className="group relative cursor-pointer overflow-hidden bg-dark-grey border border-white-warm/5
        hover:border-gold/35 transition-all duration-500
        hover:shadow-[0_0_60px_rgba(201,152,44,0.12)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden" onClick={() => onImmersive(project)}>
        <motion.img
          src={coverImg}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-grey/95 via-transparent to-transparent" />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.9), rgba(5,5,5,0.15))' }}
        />

        {/* Image count badge */}
        <div className="absolute top-3 right-3 bg-deep-black/80 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
          <Folder size={9} className="text-gold" />
          <span className="text-gold text-[9px] tracking-wider">{project.images.length}</span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3 border border-gold/40 px-2 py-0.5">
          <span className="text-gold text-[9px] tracking-[0.25em] uppercase">{project.category}</span>
        </div>

        {/* Explore 3D overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="border border-gold/60 px-5 py-2.5 flex items-center gap-2.5">
            <Maximize2 size={12} className="text-gold" />
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase">Explore 3D</span>
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-white-warm group-hover:text-gold transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-gold/55 text-[9px] tracking-[0.25em] uppercase mt-0.5 line-clamp-1">{project.subtitle}</p>
            )}
          </div>
          {/* Gallery grid button */}
          <button
            onClick={(e) => { e.stopPropagation(); onGallery(project) }}
            title="Open gallery grid"
            className="shrink-0 w-7 h-7 border border-white-warm/10 flex items-center justify-center text-grey-muted/50 hover:border-gold/50 hover:text-gold transition-all duration-300 mt-0.5 cursor-pointer"
          >
            <LayoutGrid size={11} />
          </button>
        </div>
        <p className="text-grey-muted text-xs mb-3 tracking-wide">{project.location} · {project.year}</p>
        <p className="text-white-warm/55 text-sm leading-6 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.slice(0, 3).map(t => (
            <span key={t} className="flex items-center gap-1 text-[9px] text-grey-muted/60 tracking-wider">
              <Tag size={7} className="text-gold/40" />{t}
            </span>
          ))}
        </div>

        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          className="mt-4 flex items-center gap-2 cursor-pointer"
          onClick={() => onImmersive(project)}
        >
          <div className="gold-line w-8" />
          <span className="text-gold text-[10px] tracking-[0.3em] uppercase">Enter Space</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [immersiveProject, setImmersiveProject] = useState(null)
  const [galleryProject,   setGalleryProject]   = useState(null)
  const [adminData] = useState(() => loadAdminData())
  const [dynamicProjects, setDynamicProjects] = useState([])
  const [projectOrder, setProjectOrder]       = useState(() => loadProjectOrder())
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    const load = async () => {
      const meta = loadDynamicProjects()
      if (meta.length === 0) { setDynamicProjects([]); return }
      const resolved = await Promise.all(
        meta.map(async p => {
          const images = await Promise.all(p.imageKeys.map(k => getBlobUrl(k)))
          return { ...p, images: images.filter(Boolean) }
        })
      )
      setDynamicProjects(resolved)
    }
    load()
    window.addEventListener('dynamic-projects-updated', load)
    return () => window.removeEventListener('dynamic-projects-updated', load)
  }, [])

  useEffect(() => {
    const handler = () => setProjectOrder(loadProjectOrder())
    window.addEventListener('project-order-updated', handler)
    return () => window.removeEventListener('project-order-updated', handler)
  }, [])

  const allProjects = (() => {
    const base  = [...dynamicProjects, ...PROJECTS]
    const order = projectOrder ?? PROJECT_ORDER  // localStorage → hardcoded fallback
    if (!order) return base
    const map       = new Map(base.map(p => [p.id, p]))
    const ordered   = order.filter(id => map.has(id)).map(id => map.get(id))
    const remaining = base.filter(p => !order.includes(p.id))
    return [...ordered, ...remaining]
  })()

  const filtered = activeCategory === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory)

  const totalImages = allProjects.reduce((n, p) => n + (p.images?.length || 0), 0)

  const handleImmersive = (project) => {
    setGalleryProject(null)
    const images = getProjectImages(project, adminData)
    setImmersiveProject({ ...project, images })
  }
  const handleGallery = (project) => {
    setImmersiveProject(null)
    setGalleryProject(project)
  }
  const handleImmersiveToGallery = () => {
    const p = immersiveProject
    setImmersiveProject(null)
    setTimeout(() => setGalleryProject(p), 50)
  }

  return (
    <section id="portfolio" className="py-32 bg-deep-black relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 left-0 text-[10rem] font-display text-white-warm/[0.012] leading-none select-none pointer-events-none">
        PORTFOLIO
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="gold-line" />
          <span className="section-label">Selected Projects</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
        >
          <h2 className="section-title">
            Project <span className="text-gold">Portfolio</span>
          </h2>
          <p className="text-grey-muted text-sm hidden sm:block">
            {allProjects.length} projects · {totalImages}+ images
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] tracking-[0.3em] uppercase px-4 py-2 border transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'border-gold bg-gold text-deep-black font-semibold'
                  : 'border-white-warm/15 text-grey-muted hover:border-gold/50 hover:text-white-warm'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  ({PROJECTS.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <ProjectCard
                  project={project}
                  onImmersive={handleImmersive}
                  onGallery={handleGallery}
                  adminData={adminData}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Immersive 3D view */}
      <AnimatePresence>
        {immersiveProject && (
          <ImmersiveView
            project={immersiveProject}
            onClose={() => setImmersiveProject(null)}
            onOpenGallery={handleImmersiveToGallery}
          />
        )}
      </AnimatePresence>

      {/* Gallery grid modal */}
      <AnimatePresence>
        {galleryProject && (
          <ProjectModal
            project={galleryProject}
            onClose={() => setGalleryProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
