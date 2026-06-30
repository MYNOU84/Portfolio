# Portfolio Website — Session Log 3
**Date:** 2026-06-28  
**Project:** M. Amine Berchache — Portfolio Website  
**Stack:** React / Vite / Tailwind CSS / Framer Motion  
**Repo:** https://github.com/MYNOU84/Portfolio.git  
**Live URL:** https://portfolio-five-kappa-d7gqte5vgz.vercel.app/

---

## Session Summary

---

### 1. Git Index Corruption — Resolved

**Problem:** `git status` showed `vercel.json`, `vite.config.js`, `tailwind.config.js` staged for deletion + `index.lock` blocking commands.  
**Fix:** User ran `del .git\index.lock` + `git restore --staged vercel.json vite.config.js tailwind.config.js` from PowerShell.  
**Result:** Clean git status. Branch confirmed up to date with `origin/main`.

---

### 2. Pipeline Bar — Confirmed Deployed

Commit `8681287` (Pipeline bar expanded to 7 zones) was already pushed and live.  
"Nothing happened" on push = already up to date, not an error.

**Pipeline zones live:**

| Zone | Label | Sub |
|------|-------|-----|
| Zone 01 | The Baseline | Contracts · Authority · Specs · BOQ |
| Zone 02 | Pre-Execution Gateways | Submittals · Shop Drawings · Mockups |
| Zone 03 | On-Site Reality | IR Cycle · Coordination · QA/QC |
| Zone 04 | Method Statement | Sequence · Safety · ITP |
| Zone 05 | Mockup Approval | Alignment · Finish · Workmanship |
| Zone 06 | Site Execution | IR Cycle · QA/QC · NCR Control |
| Zone 07 | Handover Sequence | Snagging · T&C · As-Built |

---

### 3. Zone Panels 02–07 — Rebuilt (File Was Truncated)

`site-supervision.html` was truncated at line 1062 — Zone 02 panel was cut mid-content, Zones 03–07 panels and all JavaScript were missing.  
**Root cause:** Python pipeline-bar replacement in previous session truncated the file tail.

**Fix:** Rebuilt and appended complete content for all missing zones.

Each zone panel contains:
- `zone-header` with zone number, title, description
- `gateway-grid` with 3 `gcard` items (technical sub-topics)
- `gallery-section` placeholder for future images

**Zones rebuilt:**
- Zone 02 — Pre-Execution Gateways (Material Submittals, Shop Drawings, Method Statement, Mockup Approval)
- Zone 03 — On-Site Reality (IR Cycle, RFI Management, NCR Control)
- Zone 04 — Method Statement (Execution Sequence, Safety Controls, ITP)
- Zone 05 — Mockup Approval (Finish Benchmark, Alignment Tolerance, Approval Protocol)
- Zone 06 — Site Execution (Progressive IR, QA/QC Surveillance, NCR Close-Out)
- Zone 07 — Handover Sequence (Snagging Close-Out, Documentation Package, Final Certificate)

---

### 4. Lightbox Feature — Added

**User request:** Click on image or card → zoom/open.

**Implementation:**

#### Image lightbox (step cards):
- Click any `.step-img` → opens full-screen overlay with image at `max 90vw / 80vh`
- Gold border, CLOSE button top-right, Escape key closes, click outside closes

#### Card lightbox (gateway cards):
- Click any `.gcard` → opens styled overlay panel showing zone label, title, full body text, tags
- Hover effect: card lifts `translateY(-4px)` + gold border highlight

#### CSS fixes required for lightbox to work:
- `.step-img-overlay` → added `pointer-events:none` (was blocking all clicks)
- `.ref-badge` → added `pointer-events:none` (z-index:2, was intercepting corner clicks)
- `.step-img` → added `cursor:zoom-in`
- `.step-img::after` → zoom `⊕` icon fades in on hover as visual cue

---

### 5. Commits This Session

| Commit | Message |
|--------|---------|
| `47d3d9b` | Complete zones 02-07 + image and card lightbox |
| `(latest)` | Fix lightbox - pointer-events on overlay + zoom cursor |

---

## File State — End of Session

| File | Status |
|------|--------|
| `public/site-supervision.html` | ✅ 1515 lines — all 7 zones complete + lightbox |
| `public/site-supervision-images/` | ✅ 01–09-COVER.png live |
| `public/architectural-specifications.html` | ✅ Deployed |
| `src/components/Navbar.jsx` | ✅ Fixed |
| `src/data/projects.js` | ✅ Fixed |
| `vercel.json` | ✅ Deployed |

---

## Live Pages

| Page | URL |
|------|-----|
| Main Portfolio | https://portfolio-five-kappa-d7gqte5vgz.vercel.app/ |
| Site Supervision | https://portfolio-five-kappa-d7gqte5vgz.vercel.app/site-supervision.html |
| Arch Specs | https://portfolio-five-kappa-d7gqte5vgz.vercel.app/architectural-specifications.html |
| MEP System | https://portfolio-five-kappa-d7gqte5vgz.vercel.app/mep-system-bim-coordination.html |

---

## Key Technical Notes

### Lightbox JavaScript Pattern
```js
// Images — attach to .step-img (not img directly, overlay was blocking)
document.querySelectorAll('.step-img').forEach(el => {
  el.addEventListener('click', () => openImgLightbox(el.querySelector('img').src));
});

// Cards — attach to .gcard
document.querySelectorAll('.gcard').forEach(el => {
  el.addEventListener('click', () => openCardLightbox(...));
});
```

### Critical: Overlay Click Blocking
Any `position:absolute` div inside a clickable container will intercept events unless it has `pointer-events:none`. Always check stacked divs when click handlers don't fire.

### File Truncation Prevention
Python `open(path, 'w')` rewrites the full file — never truncates if the base string is complete.  
Always verify with `tail -5` and `wc -l` after Python file edits.

---

*Session ended: 2026-06-28*
