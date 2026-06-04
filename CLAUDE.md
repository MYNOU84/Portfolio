# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint check
```

No test suite — this is a static portfolio site.

## Stack

React 19 · Vite 8 · Tailwind CSS 3 · Framer Motion 12 · Lucide React 1.17

## Architecture

### Data flow

All project content lives in `src/data/projects.js`. The `imgs(slug, count, ext='jpg')` helper generates paths like `/projects/${slug}/img-001.jpg`. Folder names in `public/projects/` **must exactly match** the slug passed to `imgs()` — case-sensitive, using original source folder names.

**Important:** `Oasis_pavilion` uses `.png` extension: `imgs('Oasis_pavilion', 92, 'png')`. All other projects use `.jpg`.

### Built-in projects (16 total)

| id | folder | images |
|---|---|---|
| oasis-pavilion | Oasis_pavilion | 92 (.png) |
| chadi-tower | CHADI_Tower_Dubai_Downtown | 16 |
| cal-capital-tower | CAL_Capital_Tower_Dubai_Downtown | 14 |
| interior-dubai | INTER_Dubai | 7 |
| anti-cancer-center | Hospital_Anti_Cancer_Algeria | 23 |
| saudi-mixed-use | Saudia_Mixt_Use | 6 |
| terrace-garden | Terrace_Gardin_Abudhabi | 17 |
| horizon-restaurant | The_Horizon_Restaurant | 26 |
| renovation-flat | Renovation_flat | 30 |
| healthcare-detail | DETAIL_HETHCARE | 24 |
| surgery-room | Surgery_room | 90 |
| detaill-surgery-room | Detaill_Surgery_Room | 40 |
| varian-halcyon | Varian_Halcyon | 27 |
| construction-site | Presentation_Algeria | 33 |
| villa-youssef | Villa_youssef_B | 50 |
| autres-dubai | Autre_Dubai | 20 |

### Two project types

**Built-in projects** — defined in `src/data/projects.js`, images served from `public/projects/`.

**Custom (dynamic) projects** — uploaded via Admin Panel at runtime. Metadata stored in `localStorage` key `portfolio-custom-projects` via `src/utils/dynamicProjects.js`. Images stored as Blobs in IndexedDB (`portfolio-img-db`) via `src/utils/imageDb.js`. Cleared if browser data is cleared.

### Admin Panel

**Open with:** `Ctrl+Shift+L` OR click the **AB logo 3 times quickly** (within 1.5 s).
> `Ctrl+Shift+A` was removed — Chrome intercepts it for "Search tabs".

Renders as a full-screen overlay (`z-[100]`). Three modes:
- **manage** — set cover image (★) and drag-reorder images per project. Stored in `localStorage` key `portfolio-admin` as `{ [projectId]: { cover: origIdx, order: [origIdx…] } }`.
- **arrange** — drag the full project list to set display order. Saved to `portfolio-project-order`.
- **new** — form + file drop zone to upload a custom project into IndexedDB.

`loadAdminData()` is exported from `AdminPanel.jsx` and used by `Portfolio.jsx` to resolve cover images and ordering.

### Visibility gating (admin-only content)

`adminOpen` state lives in `App.jsx` and is passed as `isAdmin` to `Navbar` and used to conditionally render `<CvDownload />`. When `isAdmin` is false (default for visitors):
- CV download button hidden from navbar
- CV Download section not rendered
- Skills section (`Skills.jsx`) is fully removed from the page

### Portfolio rendering pipeline

```
src/data/projects.js (PROJECTS)
    ↓
Portfolio.jsx merges with dynamicProjects (resolved from IndexedDB)
    ↓ applies projectOrder (from localStorage)
allProjects → filtered by activeCategory
    ↓
ProjectCard — click image  → ImmersiveView (pan/zoom viewer)
           — click ⊞ icon → ProjectModal  (gallery grid)
```

### Image protection

All `<img>` tags displaying project images have `draggable={false}` and `onContextMenu={e => e.preventDefault()}`. **Intentional — do not remove.**

### Cross-window events

Components communicate via `CustomEvent` on `window`:
- `dynamic-projects-updated` — fired after custom project saved/deleted; Portfolio reloads from IndexedDB.
- `project-order-updated` — fired after arrange-order changes; Portfolio re-reads `portfolio-project-order`.

### Theming

Custom Tailwind colors in `tailwind.config.js`:

| Token | Value | Usage |
|---|---|---|
| `deep-black` | `#050505` | page background |
| `dark-grey` | `#1C1C1C` | card backgrounds |
| `gold` | `#C9982C` | all accent elements (deep amber-gold) |
| `beige` | `#D4B87C` | secondary warm accent |
| `white-warm` | `#F5F1E8` | body text |
| `grey-muted` | `#A8A8A8` | secondary text |

CSS variables `--gold`, `--gold-light`, `--gold-dark`, `--gold-mid` mirror the gold palette.

Marble vein texture applied in `src/index.css` directly to section IDs via stacked `linear-gradient` background-images. Cinematic grain overlay via `body::after` SVG turbulence at 2.8% opacity.

### Public assets layout

```
public/
  hero/hero-bg.png                    ← hero background image
  cv/M-Amine-Berchache-CV.pdf         ← place manually (folder exists)
  projects/
    Oasis_pavilion/img-001.png … img-092.png
    CHADI_Tower_Dubai_Downtown/img-001.jpg … img-016.jpg
    … (16 project folders total)
```
