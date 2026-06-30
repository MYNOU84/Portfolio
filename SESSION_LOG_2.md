# Portfolio Website — Session Log 2
**Date:** 2026-06-27  
**Project:** M. Amine Berchache — Portfolio Website  
**Stack:** React / Vite / Tailwind CSS / Framer Motion  
**Repo:** https://github.com/MYNOU84/Portfolio.git  
**Live URL:** https://portfolio-five-kappa-d7gqte5vgz.vercel.app/

---

## Session Summary

---

### 1. Site Supervision Images — New Source Folder

**Source:** `C:\Users\asus\Desktop\WEB - Copy\AI\Site _supervision\`  
**Action:** Copied entire folder to `public/site-supervision-images/`

| File | Assigned To |
|------|-------------|
| `01.png` | Step 01 — Contract Documents & Specs |
| `02.png` | Step 02 — Material Submittals |
| `03.png` | Step 03 — Shop Drawings |
| `04.png` | Step 04 — Method Statement |
| `05.png` | Step 05 — Mockup / Sample Approval |
| `06.png` | Step 06 — Site Execution |
| `07.png` | Step 07 — Project Handover & Closeout |

---

### 2. Step Cards — All Updated to Real Images

All 6 dark placeholder panels replaced with real images from `/site-supervision-images/`.  
All images use `object-position: center center`.

**HTML pattern applied to all steps:**
```html
<div class="step-img">
  <img src="/site-supervision-images/01.png" alt="Step 01" loading="lazy" style="object-position:center center">
  <div class="step-img-overlay"></div>
  <div class="ref-badge"><span class="ref-badge-label">REF</span><span class="ref-badge-num">01</span></div>
  <div class="step-num-bg">01</div>
</div>
```

---

### 3. Step 07 — Zone 04 Handover (NEW)

Added as a new step card after Step 06.

- **Zone tag:** `◈ Zone 04 — The Handover Sequence`
- **Title:** Project Handover & Closeout
- **Tagline:** Transfer Verified Quality — Close the Project with Evidence
- **Image:** `/site-supervision-images/07.png`
- **Gateway badge:** `✓ Project Closed`
- **Key actions:**
  - Compile as-built drawings, O&M manuals, warranties, certifications
  - Close all outstanding snagging items, NCRs, and inspection records
  - Conduct final client walkthrough — every system demonstrated and accepted
  - Obtain formal handover certificate with client and authority sign-off
- **Tags:** As-Built Drawings, O&M Manuals, Test Reports, Handover Certificate

---

### 4. Process Section Headline — Updated

```html
<!-- Before -->
<h2 class="process-headline">The 11-Step Process<em>Steps 01 — 06</em></h2>

<!-- After -->
<h2 class="process-headline">The 11-Step Process<em>Zone 01 — 07</em></h2>
```

---

### 5. vercel.json — Created

Created to explicitly configure Vercel build:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### 6. Build Errors Fixed

Two source files were truncated in the GitHub repo — causing Vercel to fail every deployment.

#### `src/data/projects.js`
- **Error:** Unterminated string at line 444 — file ended with `'bim` (cut off)
- **Fix:** Appended missing `-h-02',\n]\n` to complete the array

#### `src/components/Navbar.jsx`
- **Error:** Unexpected token at line 170 — file ended with `</motion.` (cut off)
- **Fix:** Appended missing `a>\n  )}\n</motion.div>\n  )}\n</AnimatePresence>\n</>\n)\n}\n`

---

### 7. Git Commits This Session

| Commit | Message |
|--------|---------|
| `74e0c66` | Add 7-step supervision process with real images + Zone 04 Handover + Arch Specs page |
| `0f3175d` | Add vercel.json config |
| `32f5f93` | Fix truncated files — projects.js and Navbar.jsx |

---

## File State — End of Session

| File | Status |
|------|--------|
| `public/site-supervision.html` | ✅ 7 steps with real images, Zone 01–07 headline |
| `public/site-supervision-images/01–07.png` | ✅ Live on Vercel |
| `public/architectural-specifications.html` | ✅ Complete — 12 CSI divisions |
| `src/components/Navbar.jsx` | ✅ Fixed + Arch Specs link active |
| `src/data/projects.js` | ✅ Fixed — truncation resolved |
| `vercel.json` | ✅ Created and deployed |

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

### Why Files Were Truncated
Files written by Claude across long sessions can get cut off when context limits are reached mid-write. Always verify file integrity with `npm run build` locally before pushing to GitHub.

### Vercel Build Flow
1. GitHub push triggers Vercel webhook
2. Vercel clones repo and runs `npm run build` (Vite)
3. Vite copies `public/` → `dist/` and bundles React app
4. Vercel serves from `dist/`
5. `dist/` is in `.gitignore` — Vercel always rebuilds from source

### CSS Variables (reference)
```css
--bg:#0d0d0d    --gold:#c9a84c    --text:#e8e4dc
--bg2:#111      --gold2:#e2c068   --text2:#b8b2a8
--bg3:#161616   --gold3:#a8872e   --text3:#787068
--bg4:#1c1c1c                     --text4:#484440
```

### Position Title
`Site Technical Architect`

---

*Session ended: 2026-06-27*
