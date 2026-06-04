# 3D Cube-Flip Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat opacity/scale image transition in `ImmersiveView.jsx` with a 3D cube-flip on the Y-axis (rotateY), preserving all existing controls.

**Architecture:** Add a `directionRef` to track navigation direction before each index change, then upgrade `AnimatePresence` to `mode="sync"` and drive `rotateY` on `motion.img` from that ref. The parent `motion.div` gains `transformStyle: "preserve-3d"` so the perspective set on its ancestor (already `perspective: 1400px`) passes through correctly.

**Tech Stack:** React 19, Framer Motion 12, Tailwind CSS 3. Zero new packages.

---

## File Map

| File | Change |
|---|---|
| `src/components/ImmersiveView.jsx` | Only file modified. Two changes: (1) add `directionRef`, wire into all navigation triggers; (2) upgrade `AnimatePresence` + `motion.img` to 3D cube-flip. |

---

### Task 1: Add direction ref and wire into all navigation triggers

**Files:**
- Modify: `src/components/ImmersiveView.jsx:1-120`

The direction must be set **before** each `setImgIndex` call so that `directionRef.current` holds the correct value when Framer Motion evaluates `initial`/`exit` on the (de)mounting `motion.img`.

There are four navigation triggers that change `imgIndex`:
1. `goNext()` — next arrow button and `ArrowRight` key
2. `goPrev()` — prev arrow button and `ArrowLeft` key
3. Filmstrip thumbnail click — sets index directly (line 272)

- [ ] **Step 1: Add `directionRef` after the existing refs**

In `src/components/ImmersiveView.jsx`, after line 16 (`const dragStart = useRef(…)`), add one line:

```jsx
const directionRef = useRef('next')
```

Full context for placement (lines 13–17 after change):
```jsx
  const containerRef  = useRef(null)
  const dragStart     = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const directionRef  = useRef('next')
```

- [ ] **Step 2: Update `goPrev` to set direction before index change**

Replace lines 107–112 (current `goPrev`):
```jsx
  const goPrev = () => {
    if (imgIndex > 0 && !transitioning) {
      setTransitioning(true); setImgIndex(i => i - 1)
      setZoom(1); resetPan(); resetMotion()
      setTimeout(() => setTransitioning(false), 500)
    }
  }
```
With:
```jsx
  const goPrev = () => {
    if (imgIndex > 0 && !transitioning) {
      directionRef.current = 'prev'
      setTransitioning(true); setImgIndex(i => i - 1)
      setZoom(1); resetPan(); resetMotion()
      setTimeout(() => setTransitioning(false), 500)
    }
  }
```

- [ ] **Step 3: Update `goNext` to set direction before index change**

Replace lines 114–119 (current `goNext`):
```jsx
  const goNext = () => {
    if (imgIndex < images.length - 1 && !transitioning) {
      setTransitioning(true); setImgIndex(i => i + 1)
      setZoom(1); resetPan(); resetMotion()
      setTimeout(() => setTransitioning(false), 500)
    }
  }
```
With:
```jsx
  const goNext = () => {
    if (imgIndex < images.length - 1 && !transitioning) {
      directionRef.current = 'next'
      setTransitioning(true); setImgIndex(i => i + 1)
      setZoom(1); resetPan(); resetMotion()
      setTimeout(() => setTransitioning(false), 500)
    }
  }
```

- [ ] **Step 4: Update filmstrip thumbnail click to set direction**

Find the filmstrip button's `onClick` (around line 272). Replace:
```jsx
onClick={() => { setImgIndex(realIdx); setZoom(1); resetPan() }}
```
With:
```jsx
onClick={() => {
  directionRef.current = realIdx > imgIndex ? 'next' : 'prev'
  setImgIndex(realIdx); setZoom(1); resetPan()
}}
```

---

### Task 2: Upgrade AnimatePresence + motion.img to 3D cube-flip

**Files:**
- Modify: `src/components/ImmersiveView.jsx:153-176`

Three changes in the JSX:
1. Add `transformStyle: 'preserve-3d'` to the zoom/pan `motion.div` so the ancestor `perspective: 1400px` passes through.
2. Change `AnimatePresence mode="wait"` → `mode="sync"` so exit and enter animations run simultaneously.
3. Replace `initial/animate/exit` on `motion.img` with `rotateY` driven by `directionRef.current`.

- [ ] **Step 1: Add `transformStyle` to the zoom/pan motion.div**

Find the `motion.div` at line 153. Replace its `style` prop:
```jsx
          style={{
            scale: zoom,
            x: panX,
            y: panY,
            willChange: 'transform',
          }}
```
With:
```jsx
          style={{
            scale: zoom,
            x: panX,
            y: panY,
            willChange: 'transform',
            transformStyle: 'preserve-3d',
          }}
```

- [ ] **Step 2: Upgrade AnimatePresence mode and motion.img transition**

Replace the entire `AnimatePresence` block (lines 162–176):
```jsx
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={current}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              style={{ pointerEvents: 'none' }}
            />
          </AnimatePresence>
```
With:
```jsx
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
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              style={{ pointerEvents: 'none', backfaceVisibility: 'hidden' }}
            />
          </AnimatePresence>
```

**Why `custom` + `variants`:** Framer Motion evaluates `custom` at the moment of mount/unmount, so the exiting element captures the correct direction even after the ref has moved on. This is the only reliable way to pass dynamic values into exit animations in `AnimatePresence`.

- [ ] **Step 3: Verify in the browser**

Start the dev server:
```bash
cd "C:/Users/asus/Desktop/WEB - Copy/AI/portfolio-website"
npm run dev
```

Open `http://localhost:5173`.

Manual checklist:
- [ ] Click a project → open Immersive View
- [ ] Click `→` (next): current image rotates out to the left (rotateY -90°), new image rotates in from the right (rotateY 90° → 0°). Smooth, 480ms.
- [ ] Click `←` (prev): current rotates out to the right (+90°), new rotates in from the left (−90° → 0°). Smooth.
- [ ] Press `ArrowRight` / `ArrowLeft` keys: same cube flip, correct direction each time.
- [ ] Click a filmstrip thumbnail: cube flip direction matches whether the thumbnail is ahead or behind the current index.
- [ ] Zoom in (scroll or +), then navigate: zoom resets to 100% and pan resets to center before the flip.
- [ ] Drag to pan while zoomed: works unchanged.
- [ ] Press `0`: zoom resets to 100%.
- [ ] Press `Esc`: viewer closes.
- [ ] Gradient overlays (top/bottom and left/right vignettes) still visible after transition.
- [ ] Ambient blurred background updates with the current image after each flip.
- [ ] No console errors.
