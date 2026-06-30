# Portfolio Website — Session Log 4
**Date:** 2026-06-29  
**Project:** M. Amine Berchache — Portfolio Website  
**Stack:** React / Vite / Tailwind CSS / Framer Motion  
**Repo:** https://github.com/MYNOU84/Portfolio.git  
**Live URL:** https://portfolio-five-kappa-d7gqte5vgz.vercel.app/

---

## Session Summary

---

### 1. Git Cleanup — Index & HEAD Lock Files

**Problem:** `.git/index.lock` and `.git/HEAD.lock` repeatedly blocked commits.  
**Fix:** User ran `del .git\index.lock` and `del .git\HEAD.lock` from PowerShell before each commit.  
**Note:** Bash cannot remove these lock files — must always be done from PowerShell on Windows.

---

### 2. Pipeline Bar — Confirmed Already Deployed

Commit `8681287` (7 zones) was already pushed. "Nothing happened" = already up to date.  
All 7 zones confirmed live: Zone 01 The Baseline → Zone 07 Handover Sequence.

---

### 3. Zone Panels 02–07 — Rebuilt + Lightbox Added

**Problem:** `site-supervision.html` was truncated at line 1062 — Zone 02 cut mid-content, Zones 03–07 and all JavaScript missing.

**Fix:** Rebuilt and appended complete zone panels for Zones 02–07, each containing:
- `zone-header` with zone number, title, description
- `gateway-grid` with 3 `gcard` items
- `gallery-section` placeholder

**Lightbox system added (Chapter 1):**
- Click `.step-img` → full-screen image lightbox
- Click `.gcard` → card lightbox with title, body, tags
- Escape or click outside → closes
- `.step-img-overlay` fixed with `pointer-events:none` (was blocking all clicks)
- `.ref-badge` fixed with `pointer-events:none`
- `.step-img` cursor set to `zoom-in`
- `::after` pseudo-element adds `⊕` icon on hover

---

### 4. Chapter 2 — Consultant-Side Construction Team Scope Report

**Added as second major chapter below the Site Supervision Process.**

#### Chapter Navigation Bar
Sticky bar below portfolio nav with two tabs:
- `01 — Site Supervision Process` (scrolls to hero)
- `02 — Consultant-Side Construction Team Scope` (scrolls to Chapter 2)

#### Chapter 2 Structure (8 sections):

| Section | Content |
|---------|---------|
| 01 | General Consultant-Side Organigram (Client → PM → Engineer → RE → CM → 7 discipline teams) |
| 02 | Consultant Team by Specialty (12 team cards: Arch, Structural, MEP, QA/QC, DocControl, BIM, Planning, QS, HSE, Authority, T&C, Handover) |
| 03 | Main Architectural Roles (3 role blocks with images) |
| 04 | Role Comparison Table (7 rows × 4 columns) |
| 05 | Workflow Example — Ceiling Package (6 stages × 3 roles) |
| 06 | Reference Framework (18 references) |
| 07 | Glossary (13 terms: IFC, Shop Drawing, MIR, IR/WIR, ITP, Method Statement, RFI, NCR, SI, CDE, O&M, As-Built) |
| 08 | Final Positioning Statement |

#### Three Main Architectural Role Blocks:

**Role 01 — Senior Technical Architect**
- Core function, 70–80% technical/document
- 15 deep scope items, 11 key documents
- Main question: *Is this technically correct, coordinated, compliant, and buildable?*

**Role 02 — Architectural Package Lead**
- Package management/coordination, 60–70%
- 15 scope items, 8 example packages
- Main question: *Is this package approved, coordinated, procured, installed, and ready for handover?*

**Role 03 — Senior Site Architect**
- Site supervision/inspection, 70–80%
- 17 scope items + full IR/WIR workflow (Before/During/After inspection)
- Main question: *Is the actual installed work correct, compliant, coordinated, and acceptable for the next stage?*

---

### 5. Role Images — Added

Three AI-generated professional images assigned to each role:

| File | Role | Source |
|------|------|--------|
| `role-technical-architect.png` | Senior Technical Architect | `Senior Technical Architect.png` |
| `role-package-lead.png` | Architectural Package Lead | `Architectural Package Lead.png` |
| `role-site-architect.png` | Senior Site Architect | `Senior Site  Architect.png` |

**Image display issues fixed:**
- `object-fit: cover` with portrait images was cutting heads → fixed with `width:100%; height:auto` (no crop, natural aspect ratio)
- Duplicate `.role-img` CSS blocks cleaned up with regex
- `object-position: center top` tried but ultimately removed in favour of natural sizing

---

### 6. Lightbox & Zoom — Chapter 2

**Double-click on role images:**
- Added `ondblclick="openImgLightbox(...)"` inline on each `.role-img` div
- Opens full image in existing lightbox overlay

**⊕ Read Full button on each role body:**
- Gold border button floated top-right of each `.role-body`
- Single click → opens full role scope in readable lightbox
- Shows: role tag, title, focus ratio, definition, full bullet list, key question
- Double-click on `.role-body` also triggers same function (`zoomRole()`)

---

### 7. Commits This Session

| Commit | Message |
|--------|---------|
| `47d3d9b` | Complete zones 02-07 + image and card lightbox |
| `8ceb092` | Fix lightbox - pointer-events on overlay + zoom cursor |
| `e419bb3` | Role images - increase height to 480px, center positioning |
| `eaf0027` | Add role images to Chapter 2 |
| `(latest)` | Add Read Full zoom button to each role block |

---

## File State — End of Session

| File | Status |
|------|--------|
| `public/site-supervision.html` | ✅ ~2500 lines — Chapter 1 + Chapter 2 complete |
| `public/site-supervision-images/role-*.png` | ✅ 3 role images live |
| `public/architectural-specifications.html` | ✅ Verified |
| `vercel.json` | ✅ Active |

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

### Git Lock File Pattern (Windows)
```powershell
# Always run before commit if stuck:
del .git\HEAD.lock 2>$null
del .git\index.lock 2>$null
```

### Bash Cannot Push to GitHub
Git push from Linux sandbox always fails — no Windows credentials available.  
All pushes must be done from PowerShell.

### Inline Event Handlers vs addEventListener
`addEventListener('dblclick', ...)` added via JS was unreliable on deployed pages.  
Solution: use `ondblclick="fn()"` directly in the HTML element — always works.

### object-fit: contain Requirements
`object-fit: contain` only works when the `<img>` has explicit `width` AND `height` set.  
With `width:auto; height:auto` it has no effect — image just renders at natural size.  
For no-crop display: use `width:100%; height:auto` with no object-fit.

### Portrait Images in Landscape Containers
Portrait images (tall) in wide containers with `object-fit:cover` always crop the top and bottom.  
Use `width:100%; height:auto` to show the complete image at natural aspect ratio.

---

*Session ended: 2026-06-29*
