// ============================================================
//  Panoramic interior walkthrough — your actual photos ARE the room
// ============================================================
import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

// ── Rooms: each is one of your real interior photos ───────────
const ROOMS = [
  { src:'../projects/Villa_youssef_B/img-022.jpg', label:'Villa Youssef B — Main Hall'   },
  { src:'../projects/Villa_youssef_B/img-025.jpg', label:'Villa Youssef B — Living Room' },
  { src:'../projects/Villa_youssef_B/img-028.jpg', label:'Villa Youssef B — Suite'       },
  { src:'../projects/Villa_youssef_B/img-032.jpg', label:'Villa Youssef B — Detail'      },
  { src:'../projects/Villa_youssef_B/img-035.jpg', label:'Villa Youssef B — Lounge'      },
  { src:'../projects/Renovation_flat/img-001.jpg', label:'Apartment Renovation'           },
  { src:'../projects/The_Horizon_Restaurant/img-001.jpg', label:'The Horizon Restaurant'  },
  { src:'../projects/INTER_Dubai/img-001.jpg',     label:'Interior Design — Dubai'        },
]
let currentRoom = 0

// ── Project data ─────────────────────────────────────────────
const PROJECTS = [
  { id:'oasis-pavilion',    title:'Oasis Pavilion',              cat:'Masterplan', loc:'Dubai, UAE',          year:'2026',      folder:'Oasis_pavilion',                  count:92, ext:'png' },
  { id:'chadi-tower',       title:'CHADI Tower',                 cat:'High-Rise',  loc:'Dubai Downtown, UAE', year:'2025–2026', folder:'CHADI_Tower_Dubai_Downtown',       count:16, ext:'jpg' },
  { id:'cal-capital',       title:'CAL Capital Tower',           cat:'High-Rise',  loc:'Dubai Downtown, UAE', year:'2025–2026', folder:'CAL_Capital_Tower_Dubai_Downtown',  count:14, ext:'jpg' },
  { id:'interior-dubai',    title:'Interior Design — Dubai',     cat:'Interior',   loc:'Dubai, UAE',          year:'2025',      folder:'INTER_Dubai',                     count:7,  ext:'jpg' },
  { id:'anti-cancer',       title:'Anti-Cancer Centre',          cat:'Healthcare', loc:'Algeria',             year:'2019–2023', folder:'Hospital_Anti_Cancer_Algeria',     count:23, ext:'jpg' },
  { id:'saudi-mixed',       title:'Saudi Mixed-Use Development', cat:'Mixed-Use',  loc:'Saudi Arabia',        year:'2025',      folder:'Saudia_Mixt_Use',                 count:6,  ext:'jpg' },
  { id:'terrace-garden',    title:'Terrace Garden',              cat:'Masterplan', loc:'Abu Dhabi, UAE',      year:'2025',      folder:'Terrace_Gardin_Abudhabi',          count:17, ext:'jpg' },
  { id:'horizon-rest',      title:'The Horizon Restaurant',      cat:'Interior',   loc:'UAE',                 year:'2025',      folder:'The_Horizon_Restaurant',           count:26, ext:'jpg' },
  { id:'renovation-flat',   title:'Apartment Renovation',        cat:'Interior',   loc:'Algeria',             year:'2025',      folder:'Renovation_flat',                  count:30, ext:'jpg' },
  { id:'healthcare-detail', title:'Hospital Detail Drawings',    cat:'Healthcare', loc:'Algeria',             year:'2020–2023', folder:'DETAIL_HETHCARE',                  count:24, ext:'jpg' },
  { id:'surgery-room',      title:'Surgery Room Documentation',  cat:'Healthcare', loc:'Algeria',             year:'2021–2023', folder:'Surgery_room',                     count:30, ext:'jpg' },
  { id:'detaill-surgery',   title:'Surgical Suite Detail',       cat:'Healthcare', loc:'Algeria',             year:'2021–2023', folder:'Detaill_Surgery_Room',             count:40, ext:'jpg' },
  { id:'varian-halcyon',    title:'Varian Halcyon Radiotherapy',  cat:'Healthcare', loc:'Algeria',            year:'2021–2023', folder:'Varian_Halcyon',                   count:27, ext:'jpg' },
  { id:'construction',      title:'Construction Site Experience', cat:'Construction',loc:'Algeria',           year:'2013–2023', folder:'Presentation_Algeria',             count:33, ext:'jpg' },
  { id:'villa-youssef',     title:'Villa Youssef B',             cat:'Interior',   loc:'Dubai, UAE',          year:'2025–2026', folder:'Villa_youssef_B',                  count:50, ext:'jpg' },
  { id:'autres-dubai',      title:'Dubai Selected Works',        cat:'Mixed-Use',  loc:'Dubai, UAE',          year:'2023–2025', folder:'Autre_Dubai',                      count:20, ext:'jpg' },
]
const imgSrc = (p, n) => `../projects/${p.folder}/img-${String(n).padStart(3,'0')}.${p.ext}`

// ── Renderer ─────────────────────────────────────────────────
const canvas = document.getElementById('c')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
try { renderer.outputColorSpace = THREE.SRGBColorSpace } catch (_) {}

// ── Scene ─────────────────────────────────────────────────────
const scene  = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 500)
camera.position.set(0, 0, 0.01)
scene.add(new THREE.AmbientLight(0xffffff, 1))

// ── Panoramic sphere ──────────────────────────────────────────
const sphereGeo = new THREE.SphereGeometry(100, 64, 40)
sphereGeo.scale(-1, 1, 1)           // flip normals → render inside
const sphereMat = new THREE.MeshBasicMaterial()
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
scene.add(sphereMesh)

// Second sphere for fade transition (underneath)
const fadeMat  = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
const fadeMesh = new THREE.Mesh(sphereGeo.clone(), fadeMat)
scene.add(fadeMesh)

const loader = new THREE.TextureLoader()
let transitioning = false

function loadRoom(idx, instant = false) {
  const room = ROOMS[idx]
  loader.load(room.src, tex => {
    try { tex.colorSpace = THREE.SRGBColorSpace } catch (_) {}
    tex.mapping = THREE.EquirectangularReflectionMapping

    if (instant) {
      sphereMat.map = tex
      sphereMat.needsUpdate = true
      document.getElementById('room-label').textContent = room.label
      return
    }

    // Cross-fade: load into fadeMesh, then swap
    fadeMesh.material.map = tex
    fadeMesh.material.needsUpdate = true
    fadeMesh.material.opacity = 0
    transitioning = true
    let t = 0
    const dur = 60 // frames
    const doFade = () => {
      t++
      fadeMesh.material.opacity = t / dur
      if (t < dur) { requestAnimationFrame(doFade) }
      else {
        sphereMat.map = tex
        sphereMat.needsUpdate = true
        fadeMesh.material.opacity = 0
        transitioning = false
        document.getElementById('room-label').textContent = room.label
      }
    }
    doFade()
  })
}
loadRoom(0, true)

// ── Hotspots (floating labels in 3D space) ────────────────────
const hotspots  = []
const hotspotData = [
  { pos:[  0,  0, -80], label:'Portfolio',   action:{ type:'section', id:'portfolio' } },
  { pos:[ 60,  0, -55], label:'About',       action:{ type:'section', id:'about'     } },
  { pos:[-60,  0, -55], label:'Experience',  action:{ type:'section', id:'experience'} },
  { pos:[ 70,  0,  30], label:'Services',    action:{ type:'section', id:'services'  } },
  { pos:[-70,  0,  30], label:'Contact',     action:{ type:'section', id:'contact'   } },
  { pos:[  0, 15, -80], label:'Next Room →', action:{ type:'room', dir:+1            } },
  { pos:[  0,-15, -80], label:'← Prev Room', action:{ type:'room', dir:-1            } },
]

function makeHotspotSprite(text) {
  const cv = document.createElement('canvas')
  cv.width = 380; cv.height = 90
  const ctx = cv.getContext('2d')
  ctx.fillStyle = 'rgba(5,5,5,0.88)'
  roundRect(ctx, 0, 0, 380, 90, 8)
  ctx.fill()
  ctx.strokeStyle = '#C9982C'
  ctx.lineWidth = 1.5
  roundRect(ctx, 0, 0, 380, 90, 8)
  ctx.stroke()
  ctx.fillStyle = '#C9982C'
  ctx.font = 'bold 15px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.toUpperCase(), 190, 45)
  const tex = new THREE.CanvasTexture(cv)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(18, 4.5, 1)
  return sprite
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.lineTo(x+w-r, y)
  ctx.arcTo(x+w, y, x+w, y+r, r)
  ctx.lineTo(x+w, y+h-r)
  ctx.arcTo(x+w, y+h, x+w-r, y+h, r)
  ctx.lineTo(x+r, y+h)
  ctx.arcTo(x, y+h, x, y+h-r, r)
  ctx.lineTo(x, y+r)
  ctx.arcTo(x, y, x+r, y, r)
  ctx.closePath()
}

hotspotData.forEach(hd => {
  const s = makeHotspotSprite(hd.label)
  s.position.set(...hd.pos)
  s.userData = { hotspot: true, label: hd.label, action: hd.action }
  scene.add(s)
  hotspots.push(s)
})

// ── PointerLockControls ───────────────────────────────────────
const controls = new PointerLockControls(camera, document.body)
let locked = false
controls.addEventListener('lock',   () => {
  locked = true
  document.getElementById('entrance').classList.add('hidden')
  document.getElementById('resume-overlay').classList.add('hidden')
  document.getElementById('crosshair').classList.add('show')
})
controls.addEventListener('unlock', () => {
  locked = false
  document.getElementById('crosshair').classList.remove('show')
  document.getElementById('tooltip').classList.remove('show')
  if (!secOverlayOpen && !imgModalOpen) {
    document.getElementById('resume-overlay').classList.remove('hidden')
  }
})

// ── WASD movement ─────────────────────────────────────────────
const keys = {}
document.addEventListener('keydown', e => { keys[e.code] = true  })
document.addEventListener('keyup',   e => { keys[e.code] = false })

// Scroll zoom
window.addEventListener('wheel', e => {
  if (!locked) return
  camera.fov = Math.max(45, Math.min(90, camera.fov + e.deltaY * 0.04))
  camera.updateProjectionMatrix()
}, { passive: true })

const vel = new THREE.Vector3()
const dir = new THREE.Vector3()
const SPEED = 0.12, DAMP = 0.86

function processMovement() {
  if (!locked) return
  dir.set(0, 0, 0)
  if (keys['KeyW'] || keys['ArrowUp'])    dir.z -= 1
  if (keys['KeyS'] || keys['ArrowDown'])  dir.z += 1
  if (keys['KeyA'] || keys['ArrowLeft'])  dir.x -= 1
  if (keys['KeyD'] || keys['ArrowRight']) dir.x += 1
  if (dir.length() > 0) dir.normalize()
  vel.x += dir.x * SPEED
  vel.z += dir.z * SPEED
  vel.multiplyScalar(DAMP)
  controls.moveRight(vel.x)
  controls.moveForward(-vel.z)
  // Keep camera near origin (inside the sphere)
  const maxDist = 8
  if (camera.position.length() > maxDist) {
    camera.position.normalize().multiplyScalar(maxDist)
  }
  camera.position.y = 0
}

// ── Raycasting for hotspot hover + click ─────────────────────
const raycaster = new THREE.Raycaster()
const center = new THREE.Vector2(0, 0)
let hovered = null
const tooltip = document.getElementById('tooltip')

function doRaycast() {
  if (!locked) return
  raycaster.setFromCamera(center, camera)
  const hits = raycaster.intersectObjects(hotspots, false)
  if (hits.length) {
    const obj = hits[0].object
    tooltip.textContent = '● ' + obj.userData.label
    tooltip.classList.add('show')
    hovered = obj
  } else {
    tooltip.classList.remove('show')
    hovered = null
  }
}

document.addEventListener('click', () => {
  if (!locked || !hovered) return
  const action = hovered.userData.action
  if (action.type === 'section') openSection(action.id)
  if (action.type === 'room' && !transitioning) {
    currentRoom = ((currentRoom + action.dir) + ROOMS.length) % ROOMS.length
    loadRoom(currentRoom)
  }
})

// ── Section overlay ───────────────────────────────────────────
let secOverlayOpen = false
const secOverlay = document.getElementById('sec-overlay')
const secClose   = document.getElementById('sec-close')
const secInner   = document.getElementById('sec-inner')

function openSection(id) {
  controls.unlock()
  secOverlayOpen = true
  secInner.innerHTML = buildSection(id)
  secOverlay.classList.remove('hidden')
  if (id === 'portfolio') setupPortfolioFilter()
}
secClose.addEventListener('click', () => {
  secOverlay.classList.add('hidden')
  secOverlayOpen = false
  controls.lock()
})

function buildSection(id) {
  switch (id) {
    case 'about': return `
      <div class="sec-head"><div class="gl"></div><span class="lbl">About</span></div>
      <h2 class="sec-title">Crafting Space,<br><em>Defining Experience</em></h2>
      <p class="sec-text">Senior Architect and BIM Coordinator with over 16 years of experience across Algeria, UAE and Saudi Arabia. Specialist in healthcare facilities, high-rise towers and luxury interior design with full ISO 19650 BIM workflow expertise.</p>
      <div class="about-grid">
        <div class="about-card"><h4>BIM Expertise</h4><p>ISO 19650 · Revit · Navisworks · CDE Governance</p></div>
        <div class="about-card"><h4>Authority Submissions</h4><p>Dubai Municipality · DCD · DEWA · Civil Defense</p></div>
        <div class="about-card"><h4>Visualization</h4><p>AI Rendering · Twinmotion · Enscape · Photorealistic</p></div>
        <div class="about-card"><h4>Project Types</h4><p>Healthcare · High-Rise · Interior · Masterplan</p></div>
        <div class="about-card"><h4>Education</h4><p>Architecture Diploma · BIM Certifications · CPD</p></div>
        <div class="about-card"><h4>Languages</h4><p>Arabic (Native) · French (Fluent) · English (Professional)</p></div>
      </div>`

    case 'experience': return `
      <div class="sec-head"><div class="gl"></div><span class="lbl">Experience</span></div>
      <h2 class="sec-title">Professional <em>Journey</em></h2>
      <div class="timeline">
        <div class="tl-item"><div class="tl-year">2023 — Present</div><div class="tl-role">Lead Architect & BIM Coordinator</div><div class="tl-company">EAS Consultant — Dubai, UAE</div><p class="tl-desc">Leading BIM coordination for 90-storey towers in Dubai Downtown. ISO 19650, DM/DCD/DEWA submissions for CHADI Tower and CAL Capital Tower.</p></div>
        <div class="tl-item"><div class="tl-year">2022 — 2023</div><div class="tl-role">Senior Architect — James Cubitt & Partners</div><div class="tl-company">Abu Dhabi, UAE</div><p class="tl-desc">8-tower mixed-use masterplan. Facade strategy, BMU systems, 1,500+ clashes resolved prior to tender.</p></div>
        <div class="tl-item"><div class="tl-year">2019 — 2023</div><div class="tl-role">BIM Architect — Healthcare Specialist</div><div class="tl-company">GB Construction — Algeria</div><p class="tl-desc">140-bed Anti-Cancer Center and 240-bed hospital. Surgical suites, radiotherapy vault design, Varian Halcyon integration.</p></div>
        <div class="tl-item"><div class="tl-year">2013 — 2019</div><div class="tl-role">Site Architect / Project Manager</div><div class="tl-company">Algeria</div><p class="tl-desc">Site supervision, team coordination, quality control across major architectural and infrastructure projects.</p></div>
      </div>`

    case 'services': return `
      <div class="sec-head"><div class="gl"></div><span class="lbl">Services</span></div>
      <h2 class="sec-title">What I <em>Offer</em></h2>
      <div class="srv-grid">
        <div class="srv-card"><div class="srv-num">01</div><h4>Architectural Design</h4><p>Concept to construction documentation. Residential, commercial, healthcare, hospitality.</p></div>
        <div class="srv-card"><div class="srv-num">02</div><h4>BIM Coordination</h4><p>ISO 19650 workflow, multi-disciplinary clash detection, CDE governance.</p></div>
        <div class="srv-card"><div class="srv-num">03</div><h4>Interior Design</h4><p>Luxury residential & commercial. AI-rendered photorealistic visualizations.</p></div>
        <div class="srv-card"><div class="srv-num">04</div><h4>Authority Submissions</h4><p>Complete packages for DM, DCD, DEWA and Civil Defense.</p></div>
        <div class="srv-card"><div class="srv-num">05</div><h4>Healthcare Architecture</h4><p>Complex facilities: clinical workflows, equipment integration, radiation protection.</p></div>
        <div class="srv-card"><div class="srv-num">06</div><h4>3D Visualization</h4><p>Photorealistic renders and AI proposals for residential and commercial projects.</p></div>
      </div>`

    case 'contact': return `
      <div class="sec-head"><div class="gl"></div><span class="lbl">Contact</span></div>
      <h2 class="sec-title">Let's Create<br><em>Together</em></h2>
      <p class="sec-text">Available for Senior Architect, Lead Architect & BIM Coordinator roles across UAE and international markets.</p>
      <div class="contact-wrap"><div class="cinfo">
        <div class="cinfo-row"><span class="c-label">Email</span><span class="c-val"><a href="mailto:berchache.mohamedamine@gmail.com">berchache.mohamedamine@gmail.com</a></span></div>
        <div class="cinfo-row"><span class="c-label">Location</span><span class="c-val">Dubai, UAE</span></div>
        <div class="cinfo-row"><span class="c-label">Availability</span><span class="c-val">Open to opportunities</span></div>
      </div>
      <div class="c-quote"><blockquote>"Architecture is the will of an epoch translated into space."</blockquote><cite>— Ludwig Mies van der Rohe</cite></div></div>`

    default: return buildPortfolioHTML()
  }
}

function buildPortfolioHTML() {
  return `
    <div class="sec-head"><div class="gl"></div><span class="lbl">Portfolio</span></div>
    <h2 class="sec-title">Selected <em>Projects</em></h2>
    <div class="port-filter">
      <button class="flt-btn active" data-filter="all">All (${PROJECTS.length})</button>
      ${['High-Rise','Healthcare','Interior','Mixed-Use','Masterplan','Construction'].map(c=>`<button class="flt-btn" data-filter="${c}">${c} (${PROJECTS.filter(p=>p.cat===c).length})</button>`).join('')}
    </div>
    <div class="port-grid" id="port-grid">
      ${PROJECTS.map(p=>`
        <div class="proj-card" data-cat="${p.cat}" onclick="window.__openModal('${p.id}')">
          <div class="proj-thumb"><img src="${imgSrc(p,1)}" alt="${p.title}" loading="lazy" onerror="this.parentElement.style.background='#111'"></div>
          <div class="proj-info">
            <div class="proj-cat">${p.cat}</div>
            <div class="proj-name">${p.title}</div>
            <div class="proj-meta">${p.loc} · ${p.year}</div>
          </div>
        </div>`).join('')}
    </div>`
}

window.__openModal = id => openModal(PROJECTS.find(p => p.id === id))

function setupPortfolioFilter() {
  document.querySelectorAll('.flt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.flt-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const f = btn.dataset.filter
      document.querySelectorAll('.proj-card').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none'
      })
    })
  })
}

// ── Image modal ───────────────────────────────────────────────
let imgModalOpen = false, curProject = null, curIdx = 0, zoomLvl = 1
let isDragging = false, dragX = 0, dragY = 0, transX = 0, transY = 0

const imgModal  = document.getElementById('img-modal')
const mImg      = document.getElementById('m-img')
const mViewport = document.getElementById('m-viewport')
const mClose    = document.getElementById('m-close')
const modalBack = document.getElementById('modal-back')
const mPrev     = document.getElementById('m-prev')
const mNext     = document.getElementById('m-next')
const mThumbs   = document.getElementById('m-thumbs')
const mCount    = document.getElementById('m-count')
const mCat      = document.getElementById('m-cat')
const mTitle    = document.getElementById('m-title')
const mLoc      = document.getElementById('m-loc')
const zIn       = document.getElementById('z-in')
const zOut      = document.getElementById('z-out')
const zRst      = document.getElementById('z-rst')
const zVal      = document.getElementById('z-val')

function openModal(project) {
  if (!project) return
  curProject = project; curIdx = 0; zoomLvl = 1; transX = 0; transY = 0
  mCat.textContent   = project.cat
  mTitle.textContent = project.title
  mLoc.textContent   = `${project.loc} · ${project.year}`
  buildThumbs(); showImage(0)
  imgModal.classList.remove('hidden')
  imgModalOpen = true
}

function buildThumbs() {
  mThumbs.innerHTML = ''
  for (let i = 1; i <= Math.min(curProject.count, 20); i++) {
    const b = document.createElement('button')
    b.className = 'm-thumb'
    b.innerHTML = `<img src="${imgSrc(curProject, i)}" loading="lazy">`
    b.addEventListener('click', () => showImage(i - 1))
    mThumbs.appendChild(b)
  }
}

function showImage(idx) {
  curIdx = ((idx % curProject.count) + curProject.count) % curProject.count
  mImg.src = imgSrc(curProject, curIdx + 1)
  mCount.textContent = `${curIdx + 1} / ${curProject.count}`
  zoomLvl = 1; transX = 0; transY = 0; applyZoom()
  document.querySelectorAll('.m-thumb').forEach((t, i) => t.classList.toggle('active', i === curIdx))
  mThumbs.children[curIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function applyZoom() {
  zVal.textContent = Math.round(zoomLvl * 100) + '%'
  mImg.style.transform = `translate(${transX}px,${transY}px) scale(${zoomLvl})`
}

function closeModal() {
  imgModal.classList.add('hidden')
  imgModalOpen = false
}

mPrev.addEventListener('click', () => showImage(curIdx - 1))
mNext.addEventListener('click', () => showImage(curIdx + 1))
zIn.addEventListener('click',  () => { zoomLvl = Math.min(4, +(zoomLvl+0.25).toFixed(2)); applyZoom() })
zOut.addEventListener('click', () => { zoomLvl = Math.max(0.25, +(zoomLvl-0.25).toFixed(2)); applyZoom() })
zRst.addEventListener('click', () => { zoomLvl=1; transX=0; transY=0; applyZoom() })
mClose.addEventListener('click', closeModal)
modalBack.addEventListener('click', closeModal)

mViewport.addEventListener('mousedown', e => { isDragging=true; dragX=e.clientX-transX; dragY=e.clientY-transY })
window.addEventListener('mousemove', e => { if(!isDragging) return; transX=e.clientX-dragX; transY=e.clientY-dragY; applyZoom() })
window.addEventListener('mouseup', () => isDragging=false)
mViewport.addEventListener('wheel', e => { e.preventDefault(); const d=e.deltaY>0?-0.1:0.1; zoomLvl=Math.min(4,Math.max(0.25,+(zoomLvl+d).toFixed(2))); applyZoom() }, {passive:false})

window.addEventListener('keydown', e => {
  if (imgModalOpen) {
    if (e.key === 'ArrowRight') showImage(curIdx+1)
    if (e.key === 'ArrowLeft')  showImage(curIdx-1)
    if (e.key === 'Escape')     closeModal()
  }
})

// ── Room label element (add to DOM) ───────────────────────────
const roomLabel = document.createElement('div')
roomLabel.id = 'room-label'
roomLabel.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);font-size:10px;letter-spacing:0.45em;text-transform:uppercase;color:rgba(201,152,44,0.7);pointer-events:none;z-index:60;display:none'
document.body.appendChild(roomLabel)

// ── Enter / Resume / Exit buttons ────────────────────────────
document.getElementById('enter-btn').addEventListener('click', () => {
  document.getElementById('entrance').classList.add('hidden')
  controls.lock()
  roomLabel.style.display = 'block'
  const hint = document.getElementById('ctrl-hint')
  hint.style.display = 'flex'
})
document.getElementById('resume-btn').addEventListener('click', () => {
  document.getElementById('resume-overlay').classList.add('hidden')
  controls.lock()
})
document.getElementById('exit-btn').addEventListener('click', () => {
  document.getElementById('resume-overlay').classList.add('hidden')
  document.getElementById('entrance').classList.remove('hidden')
})

// ── Resize ────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ── Hotspot pulse animation ───────────────────────────────────
const clock = new THREE.Clock()

// ── Render loop ───────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate)
  const t = clock.getElapsedTime()

  processMovement()
  doRaycast()

  // Hotspot gentle float + pulse
  hotspots.forEach((s, i) => {
    s.position.y = hotspotData[i].pos[1] + Math.sin(t * 1.2 + i * 0.8) * 1.5
    s.material.opacity = 0.75 + Math.sin(t * 1.8 + i) * 0.25
  })

  renderer.render(scene, camera)
}
animate()
