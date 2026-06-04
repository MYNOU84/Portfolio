import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/*
  Luxury architectural corridor — dark gallery room with gold accents,
  animated lighting, floating particles, mouse parallax, scroll depth.
  Renders on a canvas that fills the Hero section behind all overlay content.
*/
export default function HeroScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ── Renderer ─────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.toneMapping    = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.88
    renderer.shadowMap.enabled  = true
    renderer.shadowMap.type     = THREE.PCFSoftShadowMap
    try { renderer.outputColorSpace = THREE.SRGBColorSpace } catch (_) {}

    /* ── Scene ────────────────────────────────────────────────── */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020203)
    scene.fog = new THREE.FogExp2(0x020203, 0.055)

    /* ── Camera ───────────────────────────────────────────────── */
    const W = canvas.clientWidth, H = canvas.clientHeight
    const camera = new THREE.PerspectiveCamera(68, W / H, 0.1, 120)
    camera.position.set(0, 1.8, 13)   // intro start: pulled back
    camera.lookAt(0, 1.8, 0)

    /* ── Room dimensions ──────────────────────────────────────── */
    const RW = 12    // width  (±6)
    const RH = 4.6   // height
    const RL = 50    // length (z: +5 to -45)

    /* ── Materials ────────────────────────────────────────────── */
    const mFloor = new THREE.MeshStandardMaterial({
      color: 0x050506, metalness: 0.90, roughness: 0.10,
    })
    const mWall = new THREE.MeshStandardMaterial({
      color: 0x080809, roughness: 0.92, metalness: 0.03,
    })
    const mCeil = new THREE.MeshStandardMaterial({
      color: 0x020202, roughness: 0.98,
    })
    const mGold = new THREE.MeshStandardMaterial({
      color: 0xC9982C, metalness: 0.93, roughness: 0.16,
      emissive: new THREE.Color(0x3e2a08), emissiveIntensity: 0.55,
    })
    const mCol = new THREE.MeshStandardMaterial({
      color: 0x101012, roughness: 0.90, metalness: 0.06,
    })
    const mColCap = new THREE.MeshStandardMaterial({
      color: 0xC9982C, metalness: 0.92, roughness: 0.18,
      emissive: new THREE.Color(0x2a1b04), emissiveIntensity: 0.50,
    })

    /* ── Helper: add mesh ─────────────────────────────────────── */
    const add = (geo, mat, x=0, y=0, z=0, rx=0, ry=0) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.rotation.x = rx; m.rotation.y = ry
      m.receiveShadow = true; m.castShadow = true
      scene.add(m); return m
    }

    /* ── Floor ────────────────────────────────────────────────── */
    add(new THREE.PlaneGeometry(RW, RL), mFloor, 0, 0, 0, -Math.PI/2)

    /* ── Ceiling ──────────────────────────────────────────────── */
    add(new THREE.PlaneGeometry(RW, RL), mCeil, 0, RH, 0, Math.PI/2)

    /* ── Walls ────────────────────────────────────────────────── */
    add(new THREE.PlaneGeometry(RL, RH), mWall,  -RW/2, RH/2, 0, 0,  Math.PI/2)
    add(new THREE.PlaneGeometry(RL, RH), mWall,   RW/2, RH/2, 0, 0, -Math.PI/2)
    add(new THREE.PlaneGeometry(RW, RH), mWall,     0, RH/2, -RL/2)

    /* ── Gold baseboards ──────────────────────────────────────── */
    add(new THREE.BoxGeometry(0.04, 0.11, RL), mGold, -RW/2+0.02, 0.055, 0)
    add(new THREE.BoxGeometry(0.04, 0.11, RL), mGold,  RW/2-0.02, 0.055, 0)

    /* ── Gold crown trim ──────────────────────────────────────── */
    add(new THREE.BoxGeometry(0.04, 0.07, RL), mGold, -RW/2+0.02, RH-0.055, 0)
    add(new THREE.BoxGeometry(0.04, 0.07, RL), mGold,  RW/2-0.02, RH-0.055, 0)

    /* ── Columns (pairs every 7 units) ───────────────────────── */
    ;[-4, -11, -18, -25].forEach(z => {
      ;[-RW/2+0.2, RW/2-0.2].forEach(x => {
        add(new THREE.BoxGeometry(0.32, RH, 0.32), mCol,    x, RH/2,      z)
        add(new THREE.BoxGeometry(0.42, 0.07, 0.42), mColCap, x, RH-0.035, z)
        add(new THREE.BoxGeometry(0.42, 0.07, 0.42), mColCap, x, 0.035,    z)
      })
    })

    /* ── Ceiling light slots (recessed geometry) ─────────────── */
    const mSlot = new THREE.MeshStandardMaterial({
      color: 0xC9982C, emissive: new THREE.Color(0xC9982C), emissiveIntensity: 1.8,
      metalness: 0.5, roughness: 0.4,
    })
    ;[-3, -10, -17, -24].forEach(z => {
      add(new THREE.PlaneGeometry(0.18, 1.8), mSlot, 0, RH-0.01, z, Math.PI/2)
    })

    /* ── Lighting ─────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x0d0d10, 1.4))

    // Ceiling spot lights — warm, casting pools on floor
    const spots = []
    ;[-3, -10, -17, -24].forEach(z => {
      const spot = new THREE.SpotLight(0xFFE8C0, 6, 14, Math.PI*0.16, 0.38, 1.6)
      spot.position.set(0, RH-0.12, z)
      spot.target.position.set(0, 0, z)
      spot.castShadow = true
      spot.shadow.mapSize.set(512, 512)
      scene.add(spot); scene.add(spot.target)
      spots.push(spot)
    })

    // Entrance fill — warm, in camera view
    const heroFill = new THREE.PointLight(0xFFD8A8, 3.2, 14)
    heroFill.position.set(0, RH-0.5, 5)
    scene.add(heroFill)

    // Gold wall accent sconces
    const accents = []
    ;[-1, -7, -14, -21].forEach(z => {
      ;[-RW/2+0.7, RW/2-0.7].forEach(x => {
        const pt = new THREE.PointLight(0xC9982C, 1.4, 5.5)
        pt.position.set(x, 2.3, z)
        scene.add(pt); accents.push(pt)
      })
    })

    /* ── Particles ────────────────────────────────────────────── */
    const PCNT = 380
    const pArr = new Float32Array(PCNT * 3)
    for (let i = 0; i < PCNT; i++) {
      pArr[i*3]   = (Math.random()-0.5) * RW * 0.85
      pArr[i*3+1] = Math.random() * RH
      pArr[i*3+2] = Math.random() * -RL + 5
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xC9982C, size: 0.020, transparent: true, opacity: 0.50,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    scene.add(new THREE.Points(pGeo, pMat))
    const pPos = pGeo.attributes.position

    /* ── Camera state ─────────────────────────────────────────── */
    let camX=0, camY=1.8, camZ=13     // current
    let tgtX=0, tgtY=1.8, tgtZ=8     // settled position (after intro)
    let mX=0, mY=0                    // mouse -1 → +1
    const lookAt = new THREE.Vector3()

    /* ── Mouse parallax ───────────────────────────────────────── */
    const onMouse = (e) => {
      mX = (e.clientX / window.innerWidth  - 0.5) * 2
      mY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    /* ── Scroll — push camera forward ────────────────────────── */
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1)
      tgtZ = 8 - p * 7       // hero scrolls out: camera drifts to z=1
      tgtY = 1.8 - p * 0.25
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── Resize ───────────────────────────────────────────────── */
    const onResize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    window.addEventListener('resize', onResize)

    /* ── Render loop ──────────────────────────────────────────── */
    const clock = new THREE.Clock()
    let raf

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      /* Intro: ease camera forward from z=13 → z=8 over 2.8 s */
      const iT  = Math.min(t / 2.8, 1)
      const iEase = 1 - Math.pow(1 - iT, 3)   // easeOutCubic
      const introZ = 13 - iEase * 5            // 13 → 8

      const finalTgtZ = t < 3.2 ? introZ : tgtZ

      /* Lerp camera */
      camX += (tgtX + mX * 0.28 - camX) * 0.042
      camY += (tgtY - mY * 0.14 - camY) * 0.042
      camZ += (finalTgtZ - camZ) * 0.042
      camera.position.set(camX, camY, camZ)

      /* LookAt: slightly ahead + mouse tilt */
      lookAt.set(mX * 0.45, 1.8 - mY * 0.22, camZ - 9)
      camera.lookAt(lookAt)

      /* Particle drift */
      for (let i = 0; i < PCNT; i++) {
        pPos.array[i*3+1] += 0.0014
        if (pPos.array[i*3+1] > RH) pPos.array[i*3+1] = 0
        pPos.array[i*3]   += Math.sin(t * 0.4 + i * 0.31) * 0.00045
      }
      pPos.needsUpdate = true

      /* Accent light flicker */
      accents.forEach((l, i) => {
        l.intensity = 1.2 + Math.sin(t * 1.7 + i * 1.1) * 0.28
      })
      heroFill.intensity = 3.0 + Math.sin(t * 0.65) * 0.35

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
