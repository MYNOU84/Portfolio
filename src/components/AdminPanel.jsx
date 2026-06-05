import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, GripVertical, Check, Plus, Trash2, Upload, Folder, RotateCcw, Pencil, EyeOff, Eye } from 'lucide-react'
import { PROJECTS, CATEGORIES } from '../data/projects'
import { storeBlob, deleteProjectBlobs } from '../utils/imageDb'
import {
  loadDynamicProjects, saveDynamicProject, deleteDynamicProject,
  loadProjectOrder, saveProjectOrder, clearProjectOrder,
  loadHiddenProjects, toggleHiddenProject,
  loadProjectOverrides, saveProjectOverride, clearProjectOverride,
} from '../utils/dynamicProjects'

const STORAGE_KEY    = 'portfolio-admin'
const FORM_CATEGORIES = CATEGORIES.filter(c => c !== 'All')

export function loadAdminData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    // Seed each project with its hardcoded cover default; localStorage overrides when present
    const merged = {}
    PROJECTS.forEach(p => {
      merged[p.id] = { cover: p.cover ?? 0, ...saved[p.id] }
    })
    return merged
  } catch { return {} }
}
function saveAdminData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase mb-0.5">{label}</p>
      <p className="text-white/70 text-xs">{value || '—'}</p>
    </div>
  )
}

function DynamicProjectPanel({ project, onDelete, onSave, onAddImages }) {
  const [editing, setEditing]   = useState(false)
  const [confirm, setConfirm]   = useState(false)
  const [addingImgs, setAddingImgs] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const addFileRef = useRef(null)

  const FORM_CATS = CATEGORIES.filter(c => c !== 'All')
  const [form, setForm] = useState({
    title:       project.title       || '',
    subtitle:    project.subtitle    || '',
    category:    project.category    || FORM_CATS[0],
    location:    project.location    || '',
    year:        project.year        || '',
    role:        project.role        || '',
    description: project.description || '',
    tags:        project.tags?.join(', ') || '',
  })

  const inputCls = 'w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors'
  const labelCls = 'block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5'

  const handleSave = () => {
    const updated = {
      ...project,
      title:       form.title.trim() || project.title,
      subtitle:    form.subtitle.trim() || undefined,
      category:    form.category,
      location:    form.location.trim(),
      year:        form.year.trim(),
      role:        form.role.trim(),
      description: form.description.trim(),
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    onSave(updated)
    setEditing(false)
  }

  const handleAddFiles = (files) => {
    const imgs = files.filter(f => f.type.startsWith('image/'))
    if (!imgs.length) return
    onAddImages(project.id, imgs)
    setAddingImgs(false)
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="bg-gold/20 text-gold text-[8px] tracking-[0.3em] uppercase px-2 py-0.5">Custom Project</span>
          <span className="text-white/25 text-[9px]">{project.imageCount} images</span>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/50 text-[10px] tracking-wider hover:border-gold/50 hover:text-gold transition-all cursor-pointer">
            <Pencil size={11} /> Edit / Rename
          </button>
        )}
      </div>

      {/* View mode */}
      {!editing && (
        <>
          <h2 className="text-white/80 text-base font-medium mb-1">{project.title}</h2>
          {project.subtitle && <p className="text-gold/60 text-xs mb-4">{project.subtitle}</p>}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5">
            <InfoRow label="Category" value={project.category} />
            <InfoRow label="Location" value={project.location} />
            <InfoRow label="Year" value={project.year} />
            <InfoRow label="Role" value={project.role} />
            <InfoRow label="Images" value={`${project.imageCount} image${project.imageCount !== 1 ? 's' : ''}`} />
            <InfoRow label="Tags" value={project.tags?.join(', ')} />
          </div>
          {project.description && (
            <p className="text-white/40 text-xs mt-5 leading-relaxed">{project.description}</p>
          )}

          {/* Add more images */}
          {!addingImgs ? (
            <button onClick={() => setAddingImgs(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 border border-white/10 text-white/40 text-[10px] tracking-wider hover:border-gold/40 hover:text-gold transition-all cursor-pointer">
              <Plus size={11} /> Add More Images
            </button>
          ) : (
            <div className="mt-6">
              <div
                className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
                  dragActive ? 'border-gold/60 bg-gold/5' : 'border-white/10 hover:border-white/20'
                }`}
                onDragOver={e => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={e => { e.preventDefault(); setDragActive(false); handleAddFiles(Array.from(e.dataTransfer.files)) }}
                onClick={() => addFileRef.current?.click()}
              >
                <div className="py-8 flex flex-col items-center gap-2 pointer-events-none">
                  <Upload size={18} className="text-white/20" />
                  <p className="text-white/40 text-xs">Drop images or click to browse</p>
                  <p className="text-white/20 text-[10px]">Images will be appended to this project</p>
                </div>
                <input ref={addFileRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={e => handleAddFiles(Array.from(e.target.files))} />
              </div>
              <button onClick={() => setAddingImgs(false)}
                className="mt-2 text-white/30 text-[10px] hover:text-white/60 transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          )}

          {/* Delete */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
            {confirm ? (
              <>
                <span className="text-white/35 text-[10px] flex-1">All images will be permanently deleted.</span>
                <button onClick={onDelete}
                  className="px-4 py-2 bg-red-700/70 text-white text-[10px] tracking-wider hover:bg-red-600 transition-all cursor-pointer">
                  Confirm Delete
                </button>
                <button onClick={() => setConfirm(false)}
                  className="px-4 py-2 border border-white/15 text-white/50 text-[10px] hover:border-white/30 transition-all cursor-pointer">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-500/25 text-red-400/60 text-[10px] tracking-wider hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer">
                <Trash2 size={11} /> Delete Project
              </button>
            )}
          </div>
        </>
      )}

      {/* Edit mode */}
      {editing && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                className={inputCls} placeholder="Project name" />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))}
                className={inputCls} placeholder="Optional subtitle" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
                className={inputCls + ' cursor-pointer'}>
                {FORM_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))}
                className={inputCls} placeholder="City, Country" />
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input value={form.year} onChange={e => setForm(p => ({...p, year: e.target.value}))}
                className={inputCls} placeholder="2025" />
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Role</label>
            <input value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))}
              className={inputCls} placeholder="Lead Architect & BIM Coordinator" />
          </div>
          <div className="mb-4">
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
              rows={3} className={inputCls + ' resize-none'} placeholder="Project description..." />
          </div>
          <div className="mb-6">
            <label className={labelCls}>Tags <span className="text-white/20 normal-case tracking-normal">(comma-separated)</span></label>
            <input value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))}
              className={inputCls} placeholder="BIM, Dubai, High-Rise" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave}
              className="px-6 py-2.5 bg-gold text-deep-black text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-gold/85 transition-all cursor-pointer">
              Save Changes
            </button>
            <button onClick={() => setEditing(false)}
              className="px-6 py-2.5 border border-white/15 text-white/45 text-[10px] tracking-[0.3em] uppercase hover:border-white/30 transition-all cursor-pointer">
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function StaticPanel({
  project, orderedImages, coverOrigIdx, isHidden, override,
  dragging, dragOver,
  onToggleHidden, onSaveOverride,
  onDragStart, onDragOver, onDrop, onDragEnd, onSetCover,
}) {
  const [renaming, setRenaming] = useState(false)
  const [nameVal, setNameVal]   = useState('')

  const displayTitle = override.title || project.title

  const startRename = () => { setNameVal(displayTitle); setRenaming(true) }
  const cancelRename = () => setRenaming(false)
  const saveRename = () => {
    onSaveOverride({ title: nameVal.trim() })
    setRenaming(false)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-5">
        {/* Title row */}
        <div className="flex items-center gap-3 mb-3">
          {renaming ? (
            <>
              <input
                autoFocus
                value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') cancelRename() }}
                className="flex-1 bg-[#0f0f0f] border border-gold/50 text-white/90 text-sm px-3 py-1.5 focus:outline-none"
              />
              <button onClick={saveRename}
                className="px-3 py-1.5 bg-gold text-deep-black text-[10px] tracking-wider font-semibold cursor-pointer hover:bg-gold/85 transition-all">
                Save
              </button>
              <button onClick={cancelRename}
                className="px-3 py-1.5 border border-white/15 text-white/40 text-[10px] cursor-pointer hover:border-white/30 transition-all">
                Cancel
              </button>
              {override.title && (
                <button onClick={() => { onSaveOverride({ title: '' }); cancelRename() }}
                  className="text-white/25 text-[9px] hover:text-white/50 cursor-pointer transition-colors">
                  Reset original
                </button>
              )}
            </>
          ) : (
            <>
              <h2 className="text-white/80 text-sm font-medium">{displayTitle}</h2>
              {override.title && (
                <span className="text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 bg-gold/10 text-gold/60 border border-gold/20">Renamed</span>
              )}
              {isHidden && (
                <span className="text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 bg-red-500/15 text-red-400/70 border border-red-500/20">Hidden</span>
              )}
              <button onClick={startRename}
                className="flex items-center gap-1.5 px-3 py-1 border border-white/12 text-white/35 text-[10px] tracking-wider hover:border-gold/50 hover:text-gold transition-all cursor-pointer">
                <Pencil size={10} /> Rename
              </button>
            </>
          )}
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleHidden}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] tracking-wider transition-all cursor-pointer ${
              isHidden
                ? 'border-green-500/40 text-green-400/70 hover:border-green-500/70 hover:text-green-400'
                : 'border-white/12 text-white/35 hover:border-red-400/40 hover:text-red-400/70'
            }`}>
            {isHidden ? <><Eye size={11} /> Show in Portfolio</> : <><EyeOff size={11} /> Hide from Portfolio</>}
          </button>
          <span className="text-white/25 text-[9px]">{orderedImages.length} images · drag to reorder · ★ to set cover</span>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {orderedImages.map((img, displayIdx) => {
          const origIdx    = project.images.indexOf(img)
          const isCover    = origIdx === coverOrigIdx
          const isDragTarget = dragOver === displayIdx
          return (
            <div key={`${project.id}-${origIdx}`} draggable
              onDragStart={e => onDragStart(e, displayIdx)}
              onDragOver={e => onDragOver(e, displayIdx)}
              onDrop={e => onDrop(e, displayIdx)}
              onDragEnd={onDragEnd}
              className={`relative group cursor-grab active:cursor-grabbing rounded-sm overflow-hidden bg-dark-grey transition-all duration-200 ${
                isDragTarget ? 'ring-2 ring-gold scale-[1.03]' : ''
              } ${dragging === displayIdx ? 'opacity-40' : ''}`}
            >
              <div className="aspect-[4/3]">
                <img src={img} alt="" className="w-full h-full object-cover pointer-events-none"
                  draggable={false} onContextMenu={e => e.preventDefault()} />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <button onClick={() => onSetCover(origIdx)}
                  className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded cursor-pointer ${isCover ? 'text-gold' : 'text-white/70 hover:text-gold'}`}
                  title="Set as cover image">
                  <Star size={18} fill={isCover ? 'currentColor' : 'none'} />
                </button>
              </div>
              {isCover && (
                <div className="absolute top-1 left-1 bg-gold text-deep-black text-[8px] tracking-wider px-1.5 py-0.5 font-semibold">COVER</div>
              )}
              <div className="absolute bottom-1 right-1 bg-black/60 text-white/50 text-[8px] px-1 rounded">
                {String(displayIdx + 1).padStart(2, '0')}
              </div>
              <div className="absolute top-1 right-1 text-white/20 group-hover:text-white/50 transition-colors">
                <GripVertical size={12} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const EMPTY_FORM = () => ({
  title: '', subtitle: '', category: FORM_CATEGORIES[2],
  location: '', year: String(new Date().getFullYear()),
  role: '', description: '', tags: '', files: []
})

function buildArrangeList(dynamicMeta, savedOrder) {
  const allIds = [...dynamicMeta, ...PROJECTS].map(p => p.id)
  if (!savedOrder) return allIds
  const ordered   = savedOrder.filter(id => allIds.includes(id))
  const remaining = allIds.filter(id => !ordered.includes(id))
  return [...ordered, ...remaining]
}

export default function AdminPanel({ onClose }) {
  const [adminData, setAdminData]           = useState(() => loadAdminData())
  const [dynamicMeta, setDynamicMeta]       = useState(() => loadDynamicProjects())
  const [hiddenProjects, setHiddenProjects] = useState(() => loadHiddenProjects())
  const [projectOverrides, setProjectOverrides] = useState(() => loadProjectOverrides())
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id)
  const [saved, setSaved]   = useState(false)

  /* image-grid drag state */
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  /* new-project upload */
  const [mode, setMode]               = useState('manage')
  const [uploading, setUploading]     = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive]   = useState(false)
  const [newForm, setNewForm]         = useState(EMPTY_FORM)
  const fileInputRef = useRef(null)

  /* arrange order */
  const [arrangeList, setArrangeList]       = useState([])
  const [arrangeDragging, setArrangeDragging] = useState(null)
  const [arrangeDragOver, setArrangeDragOver] = useState(null)

  const isViewingDynamic = mode === 'manage' && dynamicMeta.some(p => p.id === activeProject)
  const staticProject    = PROJECTS.find(p => p.id === activeProject)
  const dynamicProject   = dynamicMeta.find(p => p.id === activeProject)

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1500) }

  /* ── static image management ───────────────────────────────── */
  const getImages = useCallback((proj) => {
    const order = adminData[proj.id]?.order
    if (!order || order.length !== proj.images.length) return proj.images
    return order.map(i => proj.images[i])
  }, [adminData])

  const getCoverIdx = useCallback((projId) => adminData[projId]?.cover ?? 0, [adminData])

  const setCover = (projId, originalIdx) => {
    setAdminData(prev => {
      const next = { ...prev, [projId]: { ...prev[projId], cover: originalIdx } }
      saveAdminData(next)
      return next
    })
    showSaved()
  }

  const handleDragStart = (e, idx) => { setDragging(idx); e.dataTransfer.effectAllowed = 'move' }
  const handleDragOver  = (e, idx) => { e.preventDefault(); setDragOver(idx) }
  const handleDragEnd   = () => { setDragging(null); setDragOver(null) }
  const handleDrop = (e, dropIdx) => {
    e.preventDefault()
    if (dragging === null || dragging === dropIdx || !staticProject) return
    const images    = getImages(staticProject)
    const origOrder = images.map(img => staticProject.images.indexOf(img))
    const reordered = [...origOrder]
    const [moved] = reordered.splice(dragging, 1)
    reordered.splice(dropIdx, 0, moved)
    setAdminData(prev => {
      const next = { ...prev, [staticProject.id]: { ...prev[staticProject.id], order: reordered } }
      saveAdminData(next)
      return next
    })
    setDragging(null); setDragOver(null); showSaved()
  }

  /* ── arrange order ─────────────────────────────────────────── */
  const enterArrangeMode = () => {
    setArrangeList(buildArrangeList(dynamicMeta, loadProjectOrder()))
    setMode('arrange')
  }

  const handleArrangeDragStart = (e, idx) => {
    setArrangeDragging(idx); e.dataTransfer.effectAllowed = 'move'
  }
  const handleArrangeDragOver = (e, idx) => { e.preventDefault(); setArrangeDragOver(idx) }
  const handleArrangeDragEnd  = () => { setArrangeDragging(null); setArrangeDragOver(null) }
  const handleArrangeDrop = (e, dropIdx) => {
    e.preventDefault()
    if (arrangeDragging === null || arrangeDragging === dropIdx) return
    const next = [...arrangeList]
    const [moved] = next.splice(arrangeDragging, 1)
    next.splice(dropIdx, 0, moved)
    setArrangeList(next)
    saveProjectOrder(next)
    window.dispatchEvent(new CustomEvent('project-order-updated'))
    setArrangeDragging(null); setArrangeDragOver(null)
    showSaved()
  }

  const resetArrangeOrder = () => {
    clearProjectOrder()
    window.dispatchEvent(new CustomEvent('project-order-updated'))
    setArrangeList(buildArrangeList(dynamicMeta, null))
    showSaved()
  }

  /* ── export current settings to code ──────────────────────────── */
  const handleExportToCode = () => {
    const savedOrder = loadProjectOrder()
    const allIds = [...dynamicMeta.map(p => p.id), ...PROJECTS.map(p => p.id)]
    const rawOrder = savedOrder
      ? [...savedOrder.filter(id => allIds.includes(id)), ...allIds.filter(id => !savedOrder.includes(id))]
      : PROJECTS.map(p => p.id)
    const staticOrder = rawOrder.filter(id => PROJECTS.find(p => p.id === id))

    const lines = [
      '// ── Paste into src/data/projects.js ──────────────────────',
      '',
      'export const PROJECT_ORDER = [',
      ...staticOrder.map(id => `  '${id}',`),
      ']',
      '',
      '// Cover indices — update the cover: field on each project:',
      ...PROJECTS.map(p => {
        const idx = adminData[p.id]?.cover ?? p.cover ?? 0
        return `  // '${p.id}' → cover: ${idx}   (${p.title})`
      }),
    ]

    const output = lines.join('\n')
    console.log(output)
    navigator.clipboard?.writeText(output)
      .then(() => alert('✓ Exported to console + clipboard'))
      .catch(() => alert('✓ Exported to console (open F12 → Console)'))
  }

  /* ── new project upload ─────────────────────────────────────── */
  const handleFiles = (files) => {
    const imgs   = files.filter(f => f.type.startsWith('image/'))
    const sorted = imgs.sort((a, b) => a.name.localeCompare(b.name))
    const entries = sorted.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setNewForm(prev => ({ ...prev, files: [...prev.files, ...entries] }))
  }

  const removePreview = (idx) => {
    URL.revokeObjectURL(newForm.files[idx].preview)
    setNewForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }))
  }

  const cancelNew = () => {
    newForm.files.forEach(f => URL.revokeObjectURL(f.preview))
    setNewForm(EMPTY_FORM)
    setMode('manage')
  }

  const handleSaveProject = async () => {
    if (!newForm.title.trim() || newForm.files.length === 0) return
    setUploading(true); setUploadProgress(0)
    const id = `custom-${Date.now()}`
    for (let i = 0; i < newForm.files.length; i++) {
      await storeBlob(`${id}/${i}`, newForm.files[i].file)
      setUploadProgress(Math.round((i + 1) / newForm.files.length * 100))
    }
    const project = {
      id,
      title:       newForm.title.trim(),
      subtitle:    newForm.subtitle.trim() || undefined,
      category:    newForm.category,
      location:    newForm.location.trim(),
      year:        newForm.year.trim(),
      role:        newForm.role.trim(),
      description: newForm.description.trim(),
      tags:        newForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      imageKeys:   Array.from({ length: newForm.files.length }, (_, i) => `${id}/${i}`),
      imageCount:  newForm.files.length,
      isDynamic:   true,
    }
    saveDynamicProject(project)
    window.dispatchEvent(new CustomEvent('dynamic-projects-updated'))
    newForm.files.forEach(f => URL.revokeObjectURL(f.preview))
    const updated = loadDynamicProjects()
    setDynamicMeta(updated)
    setNewForm(EMPTY_FORM)
    setUploading(false)
    setMode('manage')
    setActiveProject(id)
    showSaved()
  }

  /* ── delete dynamic project ─────────────────────────────────── */
  const handleDeleteDynamic = async (id) => {
    await deleteProjectBlobs(id)
    deleteDynamicProject(id)
    window.dispatchEvent(new CustomEvent('dynamic-projects-updated'))
    setDynamicMeta(loadDynamicProjects())
    setActiveProject(PROJECTS[0].id)
  }

  /* ── save (rename/edit) dynamic project ─────────────────────── */
  const handleSaveDynamic = (updatedProject) => {
    saveDynamicProject(updatedProject)
    window.dispatchEvent(new CustomEvent('dynamic-projects-updated'))
    setDynamicMeta(loadDynamicProjects())
    showSaved()
  }

  /* ── add more images to existing dynamic project ─────────────── */
  const handleAddImages = async (projectId, files) => {
    const project = dynamicMeta.find(p => p.id === projectId)
    if (!project) return
    const startIdx = project.imageCount
    for (let i = 0; i < files.length; i++) {
      await storeBlob(`${projectId}/${startIdx + i}`, files[i])
    }
    const updated = {
      ...project,
      imageKeys:  [...(project.imageKeys || []), ...Array.from({ length: files.length }, (_, i) => `${projectId}/${startIdx + i}`)],
      imageCount: startIdx + files.length,
    }
    saveDynamicProject(updated)
    window.dispatchEvent(new CustomEvent('dynamic-projects-updated'))
    setDynamicMeta(loadDynamicProjects())
    showSaved()
  }

  /* ── hide / show built-in project ────────────────────────────── */
  const handleToggleHidden = (id) => {
    const updated = toggleHiddenProject(id)
    setHiddenProjects([...updated])
    window.dispatchEvent(new CustomEvent('project-visibility-updated'))
    showSaved()
  }

  /* ── rename / override built-in project fields ───────────────── */
  const handleSaveOverride = (id, fields) => {
    if (Object.values(fields).every(v => !v?.trim())) {
      clearProjectOverride(id)
    } else {
      saveProjectOverride(id, fields)
    }
    setProjectOverrides(loadProjectOverrides())
    window.dispatchEvent(new CustomEvent('project-overrides-updated'))
    showSaved()
  }

  const orderedImages = staticProject ? getImages(staticProject) : []
  const coverOrigIdx  = staticProject ? getCoverIdx(staticProject.id) : 0

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#060606] flex flex-col"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">Admin Panel</span>
          <span className="text-grey-muted/25 text-[9px]">Ctrl+Shift+L · or triple-click logo</span>
          {mode === 'arrange' && (
            <span className="text-grey-muted/40 text-[10px]">Drag rows to reorder · changes save instantly</span>
          )}
          {mode === 'manage' && !isViewingDynamic && staticProject && (
            <span className="text-grey-muted/40 text-[10px]">Click ★ to set cover · Drag to reorder images</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportToCode}
            title="Export current order + cover settings to code"
            className="text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border border-white/15
              text-grey-muted/50 hover:border-gold/50 hover:text-gold transition-all cursor-pointer"
          >
            Export to code
          </button>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-green-400 text-[10px] tracking-wider"
              >
                <Check size={11} /> Saved
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={onClose}
            className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold transition-all cursor-pointer">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 overflow-y-auto flex-shrink-0">

          {/* Arrange order */}
          <button onClick={enterArrangeMode}
            className={`w-full flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] transition-all cursor-pointer ${
              mode === 'arrange' ? 'bg-gold/10 text-gold border-l-2 border-l-gold' : 'text-white/40 hover:text-gold hover:bg-white/[0.02]'
            }`}>
            <GripVertical size={13} />
            <span className="text-[11px] tracking-[0.2em] uppercase">Arrange Order</span>
          </button>

          {/* New project */}
          <button onClick={() => setMode('new')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] transition-all cursor-pointer ${
              mode === 'new' ? 'bg-gold/10 text-gold border-l-2 border-l-gold' : 'text-white/40 hover:text-gold hover:bg-white/[0.02]'
            }`}>
            <Plus size={13} />
            <span className="text-[11px] tracking-[0.2em] uppercase">New Project</span>
          </button>

          {/* Custom projects */}
          {dynamicMeta.length > 0 && (
            <div className="px-4 pt-3 pb-1.5">
              <span className="text-white/20 text-[8px] tracking-[0.35em] uppercase">Custom</span>
            </div>
          )}
          {dynamicMeta.map(p => (
            <button key={p.id}
              onClick={() => { setMode('manage'); setActiveProject(p.id) }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer border-b border-white/[0.03] ${
                activeProject === p.id && mode === 'manage' ? 'bg-gold/10 border-l-2 border-l-gold' : 'hover:bg-white/[0.03]'
              }`}>
              <div className="w-10 h-10 flex-shrink-0 bg-dark-grey flex items-center justify-center">
                <Folder size={14} className="text-gold/40" />
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] leading-tight truncate ${activeProject === p.id && mode === 'manage' ? 'text-gold' : 'text-white/70'}`}>{p.title}</p>
                <p className="text-white/30 text-[9px] mt-0.5">{p.imageCount} images</p>
              </div>
            </button>
          ))}

          {/* Built-in projects */}
          <div className="px-4 pt-3 pb-1.5 border-t border-white/[0.04] mt-1">
            <span className="text-white/20 text-[8px] tracking-[0.35em] uppercase">Built-in</span>
          </div>
          {PROJECTS.map(p => {
            const coverImg = p.images[getCoverIdx(p.id)]
            const isHidden = hiddenProjects.includes(p.id)
            return (
              <div key={p.id}
                className={`flex items-center border-b border-white/[0.03] transition-all ${
                  isHidden ? 'opacity-50' : ''
                } ${activeProject === p.id && mode === 'manage' ? 'bg-gold/10 border-l-2 border-l-gold' : 'hover:bg-white/[0.03]'}`}>
                {/* Project row — click to select */}
                <button
                  onClick={() => { setMode('manage'); setActiveProject(p.id) }}
                  className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0 text-left cursor-pointer">
                  <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-dark-grey relative">
                    <img src={coverImg} alt="" className="w-full h-full object-cover"
                      draggable={false} onContextMenu={e => e.preventDefault()} />
                    {isHidden && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <EyeOff size={10} className="text-white/70" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[11px] leading-tight truncate ${activeProject === p.id && mode === 'manage' ? 'text-gold' : 'text-white/70'}`}>{p.title}</p>
                    <p className={`text-[9px] mt-0.5 ${isHidden ? 'text-red-400/60' : 'text-white/30'}`}>
                      {isHidden ? 'Hidden' : `${p.images.length} images`}
                    </p>
                  </div>
                </button>
                {/* Hide / Show toggle — always visible */}
                <button
                  onClick={e => { e.stopPropagation(); handleToggleHidden(p.id) }}
                  title={isHidden ? 'Show in portfolio' : 'Hide from portfolio'}
                  className={`flex-shrink-0 mr-3 p-1.5 rounded transition-all cursor-pointer ${
                    isHidden
                      ? 'text-green-400/60 hover:text-green-400 hover:bg-green-400/10'
                      : 'text-white/20 hover:text-red-400/70 hover:bg-red-400/10'
                  }`}>
                  {isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Arrange Order ── */}
          {mode === 'arrange' && (
            <div className="p-6 max-w-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white/70 text-sm font-medium">Project Display Order</h2>
                <button onClick={resetArrangeOrder}
                  className="flex items-center gap-1.5 text-white/30 text-[10px] tracking-wider hover:text-white/60 transition-colors cursor-pointer">
                  <RotateCcw size={10} /> Reset default
                </button>
              </div>

              <div className="border border-white/5">
                {arrangeList.map((id, idx) => {
                  const sp = PROJECTS.find(p => p.id === id)
                  const dp = dynamicMeta.find(p => p.id === id)
                  const proj = sp || dp
                  if (!proj) return null
                  const thumb = sp ? sp.images[getCoverIdx(sp.id)] : null
                  const isTarget  = arrangeDragOver === idx
                  const isDragged = arrangeDragging === idx
                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={e => handleArrangeDragStart(e, idx)}
                      onDragOver={e => handleArrangeDragOver(e, idx)}
                      onDrop={e => handleArrangeDrop(e, idx)}
                      onDragEnd={handleArrangeDragEnd}
                      className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.04] last:border-b-0 cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
                        isTarget  ? 'bg-gold/8 border-l-2 border-l-gold' : 'hover:bg-white/[0.025]'
                      } ${isDragged ? 'opacity-35' : ''}`}
                    >
                      <span className="text-white/18 text-[9px] w-5 text-right tabular-nums">{idx + 1}</span>
                      <GripVertical size={14} className="text-white/22 flex-shrink-0" />
                      {thumb ? (
                        <div className="w-12 h-9 flex-shrink-0 overflow-hidden">
                          <img src={thumb} alt="" className="w-full h-full object-cover pointer-events-none"
                            draggable={false} onContextMenu={e => e.preventDefault()} />
                        </div>
                      ) : (
                        <div className="w-12 h-9 flex-shrink-0 bg-dark-grey flex items-center justify-center">
                          <Folder size={13} className="text-gold/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white/65 text-xs truncate">{proj.title}</p>
                        <p className="text-white/28 text-[9px]">{proj.category}</p>
                      </div>
                      {dp && (
                        <span className="text-[7px] text-gold/50 tracking-wider border border-gold/20 px-1.5 py-0.5">custom</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-white/20 text-[9px] mt-4 tracking-wider">
                Drag any row to change its position in the portfolio grid.
              </p>
            </div>
          )}

          {/* ── New Project Form ── */}
          {mode === 'new' && (
            <div className="p-8 max-w-2xl">
              <h2 className="text-white/70 text-sm font-medium mb-6 tracking-wide">Upload New Project</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Title *</label>
                  <input value={newForm.title} onChange={e => setNewForm(p => ({...p, title: e.target.value}))}
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Project name" />
                </div>
                <div>
                  <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Subtitle</label>
                  <input value={newForm.subtitle} onChange={e => setNewForm(p => ({...p, subtitle: e.target.value}))}
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Optional subtitle" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Category *</label>
                  <select value={newForm.category} onChange={e => setNewForm(p => ({...p, category: e.target.value}))}
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors cursor-pointer">
                    {FORM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Location</label>
                  <input value={newForm.location} onChange={e => setNewForm(p => ({...p, location: e.target.value}))}
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Year</label>
                  <input value={newForm.year} onChange={e => setNewForm(p => ({...p, year: e.target.value}))}
                    className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="2025" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Role</label>
                <input value={newForm.role} onChange={e => setNewForm(p => ({...p, role: e.target.value}))}
                  className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Lead Architect & BIM Coordinator" />
              </div>

              <div className="mb-4">
                <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">Description</label>
                <textarea value={newForm.description} onChange={e => setNewForm(p => ({...p, description: e.target.value}))}
                  rows={3} className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  placeholder="Project description..." />
              </div>

              <div className="mb-6">
                <label className="block text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1.5">
                  Tags <span className="text-white/20 normal-case tracking-normal">(comma-separated)</span>
                </label>
                <input value={newForm.tags} onChange={e => setNewForm(p => ({...p, tags: e.target.value}))}
                  className="w-full bg-[#0f0f0f] border border-white/10 text-white/80 text-xs px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="BIM, Dubai, High-Rise" />
              </div>

              <div
                className={`border-2 border-dashed transition-all duration-200 mb-4 cursor-pointer ${
                  dragActive ? 'border-gold/60 bg-gold/5' : 'border-white/10 hover:border-white/20'
                }`}
                onDragOver={e => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={e => { e.preventDefault(); setDragActive(false); handleFiles(Array.from(e.dataTransfer.files)) }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="py-10 flex flex-col items-center gap-3 pointer-events-none">
                  <Upload size={22} className="text-white/20" />
                  <div className="text-center">
                    <p className="text-white/45 text-xs mb-0.5">Drop images here or click to browse</p>
                    <p className="text-white/22 text-[10px]">PNG · JPG · WEBP — multiple files supported</p>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={e => handleFiles(Array.from(e.target.files))} />
              </div>

              {newForm.files.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/30 text-[10px] tracking-wider mb-3">
                    {newForm.files.length} image{newForm.files.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {newForm.files.map((f, i) => (
                      <div key={i} className="relative group aspect-[4/3] overflow-hidden bg-dark-grey">
                        <img src={f.preview} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                        <button onClick={e => { e.stopPropagation(); removePreview(i) }}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                          <X size={14} className="text-white" />
                        </button>
                        <div className="absolute bottom-0.5 right-0.5 bg-black/60 text-white/40 text-[7px] px-1">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploading && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/40 text-[10px]">Saving images…</span>
                    <span className="text-gold text-[10px]">{uploadProgress}%</span>
                  </div>
                  <div className="h-px bg-white/10 overflow-hidden">
                    <div className="h-full bg-gold transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleSaveProject}
                  disabled={uploading || !newForm.title.trim() || newForm.files.length === 0}
                  className="px-6 py-2.5 bg-gold text-deep-black text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-gold/85 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                  {uploading ? `Saving… ${uploadProgress}%` : `Save Project${newForm.files.length > 0 ? ` (${newForm.files.length})` : ''}`}
                </button>
                <button onClick={cancelNew} disabled={uploading}
                  className="px-6 py-2.5 border border-white/15 text-white/45 text-[10px] tracking-[0.3em] uppercase hover:border-white/30 transition-all disabled:opacity-30 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Dynamic project info ── */}
          {mode === 'manage' && isViewingDynamic && dynamicProject && (
            <DynamicProjectPanel
              project={dynamicProject}
              onDelete={() => handleDeleteDynamic(dynamicProject.id)}
              onSave={handleSaveDynamic}
              onAddImages={handleAddImages}
            />
          )}

          {/* ── Static project image grid ── */}
          {mode === 'manage' && !isViewingDynamic && staticProject && (
            <StaticPanel
              project={staticProject}
              orderedImages={orderedImages}
              coverOrigIdx={coverOrigIdx}
              isHidden={hiddenProjects.includes(staticProject.id)}
              override={projectOverrides[staticProject.id] || {}}
              dragging={dragging}
              dragOver={dragOver}
              onToggleHidden={() => handleToggleHidden(staticProject.id)}
              onSaveOverride={(fields) => handleSaveOverride(staticProject.id, fields)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onSetCover={(origIdx) => setCover(staticProject.id, origIdx)}
            />
          )}

        </div>
      </div>
    </motion.div>
  )
}

