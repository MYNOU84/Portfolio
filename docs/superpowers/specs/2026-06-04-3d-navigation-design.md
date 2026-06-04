# 3D Navigation Design
**Date:** 2026-06-04  
**Status:** Approved

---

## Overview

Two independent features added to the existing portfolio website. Zero new npm packages. All existing design, images, backgrounds, and project content are preserved.

| Feature | Where | Tech |
|---|---|---|
| Interactive 3D Hero | `HeroScene.jsx` + `Hero.jsx` | Three.js OrbitControls + PointerLockControls (`three/examples/jsm`) |
| 3D Cube Transitions | `ImmersiveView.jsx` | Framer Motion + CSS 3D perspective |

---

## Files Modified

| File | Change |
|---|---|
| `src/components/HeroScene.jsx` | Add OrbitControls, PointerLockControls, mode-toggle logic, "Click to Explore" prompt UI |
| `src/components/Hero.jsx` | Replace static `hero-bg.png` with `<HeroScene />` canvas; overlay text unchanged |
| `src/components/ImmersiveView.jsx` | Replace flat opacity/scale transition with CSS 3D cube-flip animation |

**Untouched:** `App.jsx`, `Portfolio.jsx`, `AdminPanel.jsx`, all `src/data/` files, all `public/` assets.

---

## Feature 1 — Interactive 3D Hero

### Initial state
On page load the existing cinematic intro plays unchanged (camera eases z=13 → z=8 over 2.8s, mouse parallax active). A gold-bordered prompt is displayed:

```
[ Click to Explore · WASD Move · Mouse Look ]
```

This prompt fades out once the user clicks to enter a mode.

### Orbit Mode (default interactive mode)
- Activated by a single click on the canvas.
- Uses `OrbitControls` from `three/examples/jsm/controls/OrbitControls.js`.
- Left-drag: orbit. Scroll: zoom. Right-drag: pan.
- Camera distance clamped: min `2`, max `18` (prevents clipping through walls or exiting the corridor).
- A small badge in the top-left corner shows `ORBIT MODE` in gold/tracking style matching existing UI.
- A `[ ⊕ Walk ]` button (gold border, existing button style) appears top-left to switch to first-person.

### First-Person (Walk) Mode
- Activated by clicking `[ ⊕ Walk ]`.
- Uses `PointerLockControls` from `three/examples/jsm/controls/PointerLockControls.js`.
- On activation, browser pointer-lock is requested; the cursor disappears and mouse look is enabled.
- **Controls:** W/A/S/D move the camera inside the corridor. Mouse look rotates view.
- Camera height locked at Y=1.8 (eye level). No vertical movement.
- Collision buffer: camera X clamped to `±5.2`, camera Z clamped to `4.5 → -44` (inside corridor walls).
- Badge changes to `WALK MODE`. A `[ ✕ Exit Walk ]` button appears; pressing `Esc` also exits.
- On exit (Esc or button), pointer-lock is released and orbit mode resumes.

### Overlay content
- Hero overlay (name, subtitle, stats, CTA buttons) lives in `Hero.jsx` as a React layer on top of the canvas.
- `pointer-events: none` on the overlay container; `pointer-events: auto` re-enabled only on interactive elements (buttons, links).
- This ensures canvas clicks reach OrbitControls/PointerLockControls while buttons remain clickable.

### Mobile
- OrbitControls only (pointer lock not available on mobile).
- Touch-drag: orbit. Pinch: zoom.
- Walk mode button is hidden on mobile (`hidden sm:flex` or similar).

### Cinematic intro preservation
- The existing intro animation (camera lerp from z=13 → z=8, easeOutCubic over 2.8s) runs on mount before any controls are enabled.
- Controls become active only after intro completes (after ~3.2s) or when user first clicks, whichever comes first.

---

## Feature 2 — ImmersiveView 3D Cube Transitions

### Behavior
When navigating between project images (next/prev arrows, keyboard arrows, filmstrip thumbnails), the transition animates as a 3D cube rotation on the Y-axis:

| Direction | Current image | Incoming image |
|---|---|---|
| Next (→) | `rotateY: 0 → -90deg` | `rotateY: +90deg → 0` |
| Prev (←) | `rotateY: 0 → +90deg` | `rotateY: -90deg → 0` |

- CSS perspective: `1400px` (already set on the container).
- Duration: `480ms`, easing: cubic `[0.4, 0, 0.2, 1]` (smooth easeInOut).
- Both images animated simultaneously using Framer Motion `AnimatePresence` with `mode="sync"` (or two layers controlled by state).
- `transformOrigin` set to the exit edge so the cube hinge is at the correct side.
- Zoom and pan reset to `1` / `(0,0)` on each transition (already the case).

### Unchanged
- Drag-to-pan with spring physics.
- Scroll-wheel zoom and +/− keyboard zoom.
- Arrow key navigation (← →).
- Filmstrip thumbnail strip (bottom).
- Close button (Esc / ✕).
- Top bar (Immersive View label, Gallery Grid button).
- Zoom controls sidebar (right).
- Bottom project info (title, category, year, location).

---

## Constraints

- No new npm packages. Three.js `examples/jsm` modules are part of the existing `three` install.
- No removal of `hero-bg.png` from `public/` — the file stays; `Hero.jsx` simply stops rendering it.
- No changes to project data, image protection (`draggable={false}`, `onContextMenu`), or admin panel.
- All gold/dark theming tokens (`#C9982C`, `#050505`, etc.) preserved.
- Design remains premium: no visible jank, transitions are eased, UI labels match existing tracking/uppercase style.
