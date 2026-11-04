import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Maximize2, LayoutGrid } from 'lucide-react'
import { PROJECTS, CATEGORIES, PROJECT_ORDER } from '../data/projects'
import { loadAdminData } from './AdminPanel'
import { loadDynamicProjects, loadProjectOrder, loadHiddenProjects, loadProjectOverrides } from '../utils/dynamicProjects'
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
  if (project.isDynamic) return project.images[project.coverIdx ?? 0] || project.images[0]
  const d = adminData[project.id]
  const coverIdx = d?.cover ?? 0
  return project.images[coverIdx] || project.images[0]
}

function ProjectCard({ project, onImmersive, onGallery, adminData, featured = false }) {
  const [hovered, setHovered] = useState(false)
  const coverImg = getCoverImage(project, adminData)
  const meta = [project.location, project.year].filter(Boolean).join('  ·  ')

  return (
    <article
      className={`group relative cursor-pointer overflow-hidden bg-ink-700 border border-white-warm/8
        hover:border-white-warm/20 transition-colors duration-300 h-full flex flex-col
        `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — the lead project is given real size instead of the same crop as everything else */}
      <div
        className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
        onClick={() => onImmersive(project)}
      >
        <motion.img
          src={coverImg}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          onContextMenu={e => e.preventDefault()}
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-700 via-transparent to-transparent opacity-80" />

        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="theme-dark absolute inset-0 flex items-end p-4 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.75), transparent 55%)' }}
        >
          <span className="flex items-center gap-2 text-white-warm text-[10px] tracking-[0.18em] uppercase">
            <Maximize2 size={11} className="text-gold" /> Enter space
          </span>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-gold text-[9px] tracking-[0.2em] uppercase">{project.category}</span>
          <span className="text-grey-muted/70 text-[9px] tracking-[0.12em] uppercase tabular-nums">
            {project.images.length} images
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-display text-white-warm leading-snug tracking-tight ${featured ? 'text-2xl sm:text-[1.7rem]' : 'text-lg'}`}>
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-grey-muted text-[11px] mt-1 line-clamp-1">{project.subtitle}</p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onGallery(project) }}
            title="Open gallery grid"
            aria-label={`Open gallery for ${project.title}`}
            className="shrink-0 w-7 h-7 border border-white-warm/12 flex items-center justify-center text-grey-muted hover:border-gold hover:text-gold transition-colors duration-300 mt-1 cursor-pointer"
          >
            <LayoutGrid size={11} />
          </button>
        </div>

        {meta && (
          <p className="text-grey-muted text-[11px] tracking-[0.06em] uppercase mt-2.5">{meta}</p>
        )}

        <p className={`text-white-warm/55 text-sm leading-6 mt-3 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-auto pt-4">
          {project.tags.slice(0, featured ? 5 : 3).map(t => (
            <span key={t} className="text-[10px] text-grey-muted/70 tracking-wide">{t}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [immersiveProject, setImmersiveProject] = useState(null)
  const [galleryProject,   setGalleryProject]   = useState(null)
  const [adminData] = useState(() => loadAdminData())
  const [dynamicProjects, setDynamicProjects] = useState([])
  const [projectOrder, setProjectOrder]       = useState(() => loadProjectOrder())
  const [hiddenProjects, setHiddenProjects]     = useState(() => loadHiddenProjects())
  const [projectOverrides, setProjectOverrides] = useState(() => loadProjectOverrides())
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

  useEffect(() => {
    const handler = () => setHiddenProjects(loadHiddenProjects())
    window.addEventListener('project-visibility-updated', handler)
    return () => window.removeEventListener('project-visibility-updated', handler)
  }, [])

  useEffect(() => {
    const handler = () => setProjectOverrides(loadProjectOverrides())
    window.addEventListener('project-overrides-updated', handler)
    return () => window.removeEventListener('project-overrides-updated', handler)
  }, [])

  const allProjects = (() => {
    const base    = [...dynamicProjects, ...PROJECTS].map(p => {
      const ov = projectOverrides[p.id]
      return ov ? { ...p, ...ov } : p
    })
    const visible = base.filter(p => !hiddenProjects.includes(p.id))
    const order   = projectOrder ?? PROJECT_ORDER  // localStorage → hardcoded fallback
    if (!order) return visible
    const map       = new Map(visible.map(p => [p.id, p]))
    const ordered   = order.filter(id => map.has(id)).map(id => map.get(id))
    const remaining = visible.filter(p => !order.includes(p.id))
    return [...ordered, ...remaining]
  })()

  /* Live counts, from the visible list — not the static import. Any category with
     nothing in it is dropped, and a category introduced by a custom project is kept. */
  const categoryCounts = allProjects.reduce((acc, p) => {
    if (p.category) acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  const categoryTabs = [
    'All',
    ...CATEGORIES.filter(c => c !== 'All' && categoryCounts[c]),
    ...Object.keys(categoryCounts).filter(c => !CATEGORIES.includes(c)),
  ]
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

        {/* Filter tabs — one swipeable row on phones, wrapped rows from sm up.
           The fade at the right edge is the only hint that the row scrolls. */}
        <div className="relative">
        <div className="pointer-events-none absolute right-0 -mr-6 top-0 bottom-12 w-14 z-10 bg-gradient-to-l from-deep-black to-transparent sm:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-2 mb-12 overflow-x-auto sm:flex-wrap sm:overflow-x-visible -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categoryTabs.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 whitespace-nowrap text-[10px] tracking-[0.3em] uppercase px-4 py-2 border transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'border-gold bg-gold text-deep-black font-semibold'
                  : 'border-white-warm/15 text-grey-muted hover:border-gold/50 hover:text-white-warm'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  ({categoryCounts[cat] || 0})
                </span>
              )}
            </button>
          ))}
        </motion.div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                className={i === 0 && filtered.length > 2 ? 'sm:col-span-2' : ''}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05 }}
              >
                <ProjectCard
                  featured={i === 0 && filtered.length > 2}
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

      {/* Immersive 3D view + gallery stay dark in both themes */}
      <div className="theme-dark contents">
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
      </div>
    </section>
  )
}
