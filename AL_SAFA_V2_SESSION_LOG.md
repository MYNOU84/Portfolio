# Al Safa Living Intelligence Park — V2 Redesign — Session Log
**Date:** 2026-09-07
**Project:** M. Amine Berchache — Portfolio Website
**Stack:** React / Vite / Tailwind CSS (portfolio shell) — this sub-project is a static, self-contained HTML/CSS/JS page inside `public/`, no React/build-step involvement
**Repo:** portfolio-website (local path below)
**Live URL:** https://portfolio-five-kappa-d7gqte5vgz.vercel.app/

---

## What this is

The "Al Safa Living Intelligence Park" / Dubai Municipality AI Park Design Challenge competition entry (51 A1 boards) lives as one static HTML file inside this React/Vite portfolio repo — **not** its own project folder.

**Local repo root:** `C:\Users\asus\Desktop\WEB - Copy\AI\portfolio-website\`

**Key files:**
| File | Role |
|---|---|
| `public/dubai-municipality-competition.html` | The **original**, self-contained single-file page (~3100 lines, inline `<style>`/`<script>`). **NEVER modify** — user's manual backup. Verified untouched all session: md5 `f8bf7ee548e13604e2c2360ec21781d5`. |
| `public/dubai-municipality-competition-v2.html` | The new V2 scrollytelling redesign, built step-by-step. Byte-for-byte copy of the original, then edited section-by-section. Ends with `<section id="competition-archive">` wrapping the **untouched** original 51-board archive (`b01`–`b51`) + `<footer>`. |
| `public/al-safa-v2.css` | External stylesheet for all V2 sections. One `/* STEP NN — ... */` block per step. |
| `public/al-safa-v2.js` | External script (`<script defer>`). One IIFE per step, native `IntersectionObserver` only — **no GSAP, no ScrollTrigger, no WebGL/canvas, no parallax libraries** (hard user constraint from Step 01). |
| `public/dubai-municipality-competition-assets/` | Shared image/asset folder, referenced by absolute path from both the original and V2 files — nothing duplicated. |

**Hard constraints (apply to every future step):**
- Never modify `dubai-municipality-competition.html` (the original).
- Never modify the 51 competition boards (inside `#competition-archive` in the V2 file).
- Never invent climate data, performance values, sensor data, or sustainability claims — every number must be traced to a specific board in the original file.
- No GSAP / ScrollTrigger / parallax / WebGL / glassmorphism.
- Work only inside the section named in the current step's spec; do not pre-build later sections.

---

## Progress so far

### STEP 01 — V2 structural scaffold
Copied the original file to `-v2.html`. Added a new `<header>` with primary nav (`#hero #masterplan #living-intelligence #zones #human-journey #performance #final-film #competition-archive`), 12 empty semantic `<section id="...">` stubs (hero / challenge / concept / masterplan / living-intelligence / environmental-intelligence / zones / falaj / human-journey / performance / after-dark / final-film), then the untouched `#competition-archive`, then `<footer>`.

### STEP 02 — Cinematic Hero
`<section id="hero">` built as a full-bleed (100vh) hero using `.hero-v2__*` classes (media/overlay/content/index/meta/title/concept/desc/scroll). Background: existing asset `night/hero_lagoon_c.jpg`. `al-safa-v2.js` IIFE 1 wires the "SCROLL TO EXPLORE" button.

### STEP 03 — Challenge + Concept
`<section id="challenge">` + `<section id="concept">` as one continuous scroll story.
- Challenge = `.challenge-intro` + `.challenge-scroll` — desktop split: sticky `.challenge-visual` image stack crossfading through 4 project images, paired with 4 `.challenge-step` blocks (HEAT / WATER / COMFORT / ACCESS).
- Concept = `.concept-intro` + 3 `.concept-principle` blocks (HUMAN FIRST / INTELLIGENCE INVISIBLE / NATURE RESPONSIVE) revealed progressively + closing `.concept-resolution` ("LIVING INTELLIGENCE").
- `al-safa-v2.js` IIFE 2: `IntersectionObserver` toggles `.is-active` on current step/visual/dot; separate reveal-on-scroll for concept principles/resolution.

### STEP 04 — Interactive Masterplan
`<section id="masterplan">` — zone-by-zone exploration of the approved masterplan.
- `.masterplan-intro` ("04 / THE PARK" + "One park. Eight experiences.") + `.masterplan-layout` (sticky `.masterplan-stage` left, `.zone-story` right).
- Plan image: single, never-swapped `zoning_plate_c.jpg` (1448×890, architect's own labeled zoning diagram) inside an aspect-ratio-locked `.masterplan-stage` (`aspect-ratio:1448/890`).
- **No SVG zone polygons drawn** (explicitly disallowed as guessed geometry). Instead: a CSS radial-gradient `.masterplan-overlay` "spotlight" dims the plan away from the active zone, and small `.zone-hotspot` markers are positioned via percentage coordinates read directly off the architect's own pre-placed zone-badge circles (extracted with a PIL grid-overlay technique).
- **9 verified zone-hotspot coordinates** (canonical — reused again in Step 06):

  | Zone | left % | top % |
  |---|---|---|
  | Z1 — Active Sports Zone | 16.5 | 32 |
  | Z2 — Outdoor Fitness + Calisthenics | 13 | 62 |
  | Z3 — Inclusive Family Play | 32 | 59 |
  | Z4 — Family Picnic Grove | 45 | 25 |
  | Z5 — Living Oasis + AI Community Majlis | 52 | 47 |
  | Z6 — Community Event Lawn | 49 | 72 |
  | Z7-A — Therapeutic/Sensory Garden (`data-zone="z7"`) | 79 | 53 |
  | Z7-B — Ecology/Learning Garden (`data-zone="z7"`) | 79 | 28 |
  | Z8 — Arrival, Restaurant + Visitor Hub | 85 | 68 |

- `.zone-story` has 10 `.zone-step` blocks (intro → Z1..Z8 → outro), copy sourced from boards 26–35.
- `al-safa-v2.js` IIFE 3: `IntersectionObserver` drives `setActiveZone(zone)`, moving the spotlight via CSS custom properties (`--sx/--sy/--srx/--sry`) from a hardcoded `SPOTLIGHT` table; hover micro-preview is pure CSS.

### STEP 05 — Living Intelligence / AI System Architecture
`<section id="living-intelligence">` — the park's AI/sensing system diagram, sourced entirely from **Board 19 "Park-Wide AI · Intelligence Stack"** (reconstructed as SVG since the original had no image asset for it, just HTML/CSS).
- `.intelligence-intro` ("05 / LIVING INTELLIGENCE" + "The park does not wait to be asked.") + `.intelligence-layout` (sticky SVG `.intelligence-stage` left, 5 `.intelligence-step` right — Sense / Understand / Decide / Respond / Working together).
- SVG maps Board 19's real 5-stage pipeline onto SENSE→UNDERSTAND→DECIDE→RESPOND: SENSE = 6 Field Sensing nodes; UNDERSTAND = Edge Gateways + Secure Platform/Digital Twin; DECIDE = central "LIVING INTELLIGENCE" core; RESPOND = 4 workflow-family nodes, gated by a final "Z8 Human Operations" node (manual override, straight from Board 19's privacy-by-design language).
- Below the diagram: `.workflow-system` presents all **12 verified AI workflows** (Comfort Routing, Smart Irrigation, Tree Health, Water Quality, Adaptive Lighting, Crowd Forecast, Predictive Maintenance, Waste Optimisation, Sports Booking, Inclusive Companion, Ecology Learning, Emergency Assist) as a flat `.workflow-index` list (**never a 12-card grid**) — click swaps a single `.workflow-detail__panel` (Input/Decision/Response/Outcome).
- Connectors: bundled single bezier paths between column groups (not one-line-per-node), animated via `pathLength="1000"` + `stroke-dashoffset` line-draw — this technique is reused in Step 06.
- `al-safa-v2.js` IIFE 4: `STEP_ORDER = [sense, understand, decide, respond, together]`, **cumulative** activation (each step keeps all prior layers lit, so "together" = everything active).
- Ends with verbatim final statement + "Environmental Intelligence ↓" teaser.

### STEP 06 — Environmental Intelligence (this session, complete)

Full 31-point spec was provided verbatim; work confined to `<section id="environmental-intelligence">`.

**Data sourcing (no invented values) — read directly from the original file:**
- **Board 07 "Site · Climate · Context"** — NASA POWER 2001–2020 baseline: 28.2°C annual mean, 44.6°C max design metric, 3.73 m/s mean wind @10m · WNW 292.4°, 5.67 kWh/m²/day solar irradiation. NOAA sun/shadow table. Thermal Comfort Rules note. Tags: Shade ≥60% loop at maturity · 100% critical points · Rest ≤50m. True north 55.2° (the project's controlling site-orientation figure).
- **Board 16 "Sun-Path Study"** — solar geometry for actual coordinates (25.1557°N, 55.2220°E), 4 callouts: west edge (afternoon shade priority), Z5 (canopy/water-glare control), Z6 (flexible event-lawn shade), Z8 (morning entrance protection). **Caveat preserved:** this board's own diagram base has an internal 38.3° true-north reading — diagram-local, never conflated with Board 07's controlling 55.2°.
- **Board 17 "Wind & Microclimate Analysis"** — prevailing WNW–NW flow, explicitly self-flagged "indicative climate-pattern analysis, not a CFD study — Status: Indicative, CFD to verify." Informed the deliberately restrained wind treatment.
- **Board 36 "The Falaj · Lagoon & Water"** — targets: recirculation ≥95%, irrigation reduction ≥30% vs conventional, hydrozoning 100%, building water demand 19.5–32.5 m³/day. Lagoon documented as threading through Z5 (Living Oasis) → Z8 (Arrival/Visitor Hub).
- **Board 18 "Movement · Circulation"** — confirmed to contain only entrance/movement **hierarchy tables** (E1–E5, R1–R5), **no actual path/polyline geometry**. This directly shaped the decision to build the Comfort Route overlay from Step 04's own verified zone-hotspot coordinates rather than invent route geometry.

**Structure built:**
- `.environment-bridge` — static 3-line chain linking back to Step 05: "Sensors read conditions ↓ Living Intelligence interprets them ↓ The landscape responds."
- `.environment-intro` — index "06 / ENVIRONMENTAL INTELLIGENCE" + statement "Climate becomes a design input." + lede.
- `.environment-layout` — sticky `.environment-stage` (60% width) + `.environment-story` of 6 `.environment-step`s (Sun / Heat / Wind / Shade / Water / Landscape Response).
- **Stage reuse (critical, per spec point 22):** exact same `zoning_plate_c.jpg` image and `aspect-ratio:1448/890` container as Step 04 — not a new plan. An SVG (`viewBox="0 0 1448 890"`) overlays it, with all geometry keyed to the **same 9 zone-hotspot coordinates** from the table above (converted % → viewBox units), so Step 04 and Step 06 stay visually consistent.
- **Six `.environment-layer[data-layer="…"]` SVG groups** (sun/heat/wind/shade/water — "landscape" is the *combined* state, not its own group):
  - **Sun** — schematic arc (line-draw) + sun-dot + the 4 Board-16 callout points (west-edge line + Z5/Z6/Z8 circles) with text labels.
  - **Heat** — same 3 zone points (larger, warm-colored, unlabeled to avoid text stacking) + a west-edge warm glow ellipse.
  - **Wind** — 4 parallel dashed diagonal lines with small downward arrowheads, **deliberately mimicking the original file's own Board-07 wind-line idiom** (near-vertical, slight lean) rather than inventing a new visual convention.
  - **Shade** — a conceptual loop (straight-line path connecting all 9 zone hotspots, standing in for the R1 3.0m multi-ability loop — captioned as conceptual since Board 18 has no exact centerline) + 9 small rest-point dots + a distinct dashed `.environment-comfort-route` sub-path.
  - **Water** — a curved Falaj line from Z5 → Z8 (matches Board 36's own language) + endpoint circles + one "Falaj — Z5 → Z8" label.
- **Verified-value annotation chips** (`.environment-annotation-group[data-for]`, CSS-gated to the currently active step via a `data-current` attribute on `.environment-stage`, so they never stack):
  - Sun: `5.67 kWh/m²/day` / "Solar irradiation"
  - Heat: `44.6°C peak design condition` / `28.2°C annual mean`
  - Wind: `WNW → ESE` / `3.73 m/s mean @ 10 m`
  - Shade: `≥60% loop shade at maturity` / `Shaded rest ≤ 50 m`
  - Water: `≥95% recirculation target` / `≥30% irrigation reduction`
- **Comfort Routing moment:** implemented as the `.environment-comfort-route` sub-path (Z2→Z3→Z5→Z6) — a highlighted subset of the same conceptual shade loop, not a separate diagram, so it can never contradict the masterplan.
- **`.environment-moments`** — flat (non-card-grid) list of 4 rows below the sticky layout, reusing Step 05's exact Board-19 workflow names: Comfort Route, Smart Irrigation, Water Quality, and a visually **secondary/smaller Tree Health** (per spec's "keep this secondary"). Each is a one-line Input → Response climate-to-outcome statement — distinct from, not duplicating, Step 05's full workflow detail panels.
- **`.environment-resolution`** — equation line ("Sun + Wind + Shade + Water + Landscape + Intelligence = a more comfortable public realm."), verbatim final statement ("The park does not fight the climate. It learns how to work with it."), and a transition line teasing "The Eight Park Experiences ↓" (Zones section itself **not** built).

**JS (`al-safa-v2.js`, 5th IIFE) — deliberately different pattern from Step 05:**
Step 05 used *cumulative* activation (each step keeps prior layers lit). Step 06 uses **spotlight activation** instead — each step shows *only* its own layer, matching the spec's explicit instruction that sun/heat exposure should visually fade as the shade step arrives — except the final "landscape" step, which activates all 5 layers together as the resolution. The same `setStep()` also sets `data-current` on `.environment-stage`, which drives annotation-chip visibility via CSS, decoupling annotation text from layer/geometry visibility so nothing overlaps at the combined step. A second, unrelated `IntersectionObserver` reveals the 4 `.environment-moment` rows on scroll (simple fade/rise, `prefers-reduced-motion`-gated).

**Mobile:** `.environment-sticky` un-stickies to a single static block above sequential `.environment-step` text (same pattern as Steps 04/05). Deliberately **not** building 6 separate per-layer mobile visuals (which the spec's mobile section loosely suggested) — that would reload the same heavy plan image repeatedly, conflicting with the spec's own performance constraint against duplicating the same asset.

**Verification suite — all passed:**
- Original file md5sum unchanged: `f8bf7ee548e13604e2c2360ec21781d5`
- `git status --porcelain` — only expected V2 files touched (`al-safa-v2.css`, `al-safa-v2.js`, `dubai-municipality-competition-v2.html`), plus one pre-existing untracked stray file `_probe_delete_test.txt` (not created this session, left alone)
- Board count: 52 matches (identical in both original and v2 — consistent baseline, not a regression)
- All 13 `<section id="...">` boundaries present exactly once, in order
- HTML tag balance confirmed (div/svg/g/article/p/h2/h3 all matched) via a small Python check script
- CSS brace balance confirmed (304 open / 304 close)
- `node --check public/al-safa-v2.js` passed
- Dev server smoke test: `npm run dev -- --port 5183 --strictPort`, curl returned `200` for the v2 HTML, `al-safa-v2.css`, and `al-safa-v2.js`; confirmed `environmental-intelligence` markup, `STEP 06` CSS marker, and `Environmental Intelligence (Step 06)` JS marker all present in the served output. Dev server stopped cleanly afterward.

### STEP 07 — Eight Experiences / Zone Cinematic Chapters (this session, complete)

Full 39-point spec was provided verbatim; work confined to `<section id="zones">`. Explicitly **not** an 8-card grid — 8 independent cinematic chapters in a vertical scroll sequence.

**Structure built:**
- `.zones-bridge` (Systems → Places → People) + `.zones-intro` — index "07 / EIGHT EXPERIENCES" + verbatim statement "ONE PARK. EIGHT WAYS TO EXPERIENCE IT." + verbatim lede.
- 8 `.zone-chapter` articles, each a full-width tonal band (`--tone-a` warm ivory Z1–Z4, `--tone-b` muted stone Z5–Z6, `--tone-c` soft sage Z7, `--tone-d` deep charcoal Z8 — grouped intentionally, never one colour per zone) with a layout modifier matching the spec's own example set exactly:

  | Zone | Layout class | Render(s) used |
  |---|---|---|
  | Z1 Running + Tennis | `--full-below` | `hero_z1_c.jpg` |
  | Z2 Fitness | `--split` | `hero_z2_c.jpg` |
  | Z3 Family Play | `--image-left` | `hero_z3_c.jpg` |
  | Z4 Picnic Orchard | `--full-bleed` | `hero_z4_gathering_c.jpg` |
  | Z5 Oasis Café + Community Majlis | `--cinematic` | `hero_z5_c.jpg` (dominant) + `night/z5_lounge2_c.jpg` (supporting) — only zone with 2 renders, per spec's explicit extra-weight allowance |
  | Z6 Community Events Square | `--overlay` | `hero_z6_c.jpg` |
  | Z7-A Seniors Garden / Z7-B Ecology + Learning Garden | `--dual` (2-col `.zone-dual` grid of `.zone-subchapter`) | `z7/exec-751401a1-0e74-425f-a702-140fab07fcac_c.jpg` (Z7-A) + `hero_z7_c.jpg` (Z7-B) |
  | Z8 Restaurant | `--plate` | `hero_z8_c.jpg` |

- **Z7-A vs Z7-B image resolution:** the source `z7/` gallery has no semantic filenames, so both candidate renders were directly viewed (not grepped) to confirm content: `exec-751401a1-…` shows seniors playing backgammon beside a wheelchair-accessible terrace and herb garden (→ Z7-A); `hero_z7_c.jpg` shows schoolchildren studying an on-screen "ECOLOGICAL DIGITAL TWIN" display (→ Z7-B), cross-confirmed by a near-duplicate render in the same folder with "Z7-B VEGETATION COMMUNITIES" literally labeled on-screen.
- **Zone locator reuse:** each chapter's small `.zone-locator` (a thin bounding frame + single glowing dot, CSS-only, non-interactive) reuses the *exact* percentage coordinates already established in Step 04's `.zone-hotspot` buttons — no new geometry invented, no full interactive map rebuilt (kept deliberately secondary per spec).
- Each chapter/subchapter: `.zone-head` (locator + `Z# / ##` index) → `.zone-visual` (render) → `.zone-text` (`.zone-eyebrow` using the original approved zone-id wording, e.g. "Z1 · Active Sports Zone", large cinematic `.zone-title`, one ≤25-word `.zone-statement-text`, ≤3 short `.zone-functions`). Copy kept spatial/architectural (movement, shade, community, ecology, water) — no marketing language, nothing beyond what's on the source boards.
- Closes with `.zone-resolution`: verbatim "DIFFERENT EXPERIENCES. ONE CONTINUOUS LANDSCAPE.", a typographic (non-card) list Running/Fitness/Play/Picnic/Community/Events/Learning/Dining, verbatim transition "Across every zone, water remains a continuous environmental and cultural thread.", and a "The Falaj ↓" teaser. **The Falaj section itself was deliberately left untouched** — stop-after-Step-07 instruction honored.

**JS (`al-safa-v2.js`, 6th IIFE) — simpler than Steps 04–06:**
Because each `.zone-chapter` is an independent, self-contained block (not one shared sticky diagram driving many text steps), Step 07 needed only a single generic reveal-on-scroll `IntersectionObserver` toggling `.is-active` on `.zone-chapter`/`.zone-subchapter` — CSS-only fade + `scale(1.03)→1.00` + slight translate, fully gated by `prefers-reduced-motion`. No continuous scroll-linked parallax was added (the spec listed it as optional) to keep motion restrained and performant, and no sticky-stage/spotlight pattern was needed at all.

**Performance/accessibility:** first zone image (`hero_z1_c.jpg`) `loading="eager"`, every other zone image `loading="lazy"`; meaningful per-zone `alt` text (never filenames); `object-position` tuned on Z8's closing plate (`.zone-image--roof`) to keep the branching canopy roofline visible when cropped tall.

**Mobile:** split/image-left layouts collapse to a single stacked column (image above text, full width, no side-by-side); cinematic/overlay text drops from a narrow corner column to full-width padding; the Z7 dual grid collapses to one column with the divider moved from `border-left` to `border-top` so Z7-A/Z7-B stay visibly separated.

**Verification suite — all passed:**
- Original file md5sum unchanged: `f8bf7ee548e13604e2c2360ec21781d5`, and zero `git diff` against the tracked commit
- Board count: 52 (unchanged)
- All 13 `<section id="...">` boundaries present exactly once, in order
- HTML tag balance confirmed for the zones region (article/div/span/ul/li/h2/h3/p all matched, checked via bash `grep -c` open/close counts — Python 3 was not available in this session's shell, unlike Step 06)
- CSS brace balance confirmed (398 open / 398 close)
- `node --check public/al-safa-v2.js` passed
- Dev server smoke test (`npm run dev`, default port 5173): curl returned `200` for the v2 HTML, `al-safa-v2.css`, `al-safa-v2.js`, every referenced zone image path, and the untouched original HTML. Dev server stopped cleanly afterward (`taskkill //F //IM node.exe //T`).

### STEP 08 — The Falaj / Water as the Continuous Thread (this session, complete)

Full 35-point spec was provided verbatim; work confined to `<section id="falaj">`. Explicitly **not** a water-feature catalogue / spa / luxury-resort / engineering-dashboard aesthetic.

**Data sourcing (no invented values):**
- **Board 36 "The Falaj · Lagoon & Water"** — lagoon threads Z5 (Living Oasis) → Z8 (Arrival/Visitor Hub); design targets ≥95% recirculation, ≥30% irrigation reduction vs conventional, 100% hydrozoning, building water demand 19.5–32.5 m³/day, water quality + leak sensing at Z5 majlis/Z8 dashboard — all carrying the board's own "figures above are project targets, not certifications" disclaimer, reused verbatim. Its own curated 13-image "Z5 + Z8" gallery is the approved image source.
- **Step 05/06's Smart Irrigation / Water Quality workflow phrasing** — reused exactly, not re-derived, to connect back to the AI system without repeating the full architecture.
- Boards 45–46 (Stormwater/Drainage, 7-network system) were checked but **not used** — their diagram assets (`drainage/z*_networks_c.jpg`) read as engineering/plumbing diagrams, explicitly against the spec's prohibited-aesthetic list.

**Structure built:**
- `.falaj-intro` — index "08 / THE FALAJ" + verbatim statement "WATER BECOMES THE THREAD THAT CONNECTS THE PARK." + lede on regional water traditions + `.falaj-position` cultural-positioning paragraph (contemporary interpretation, explicitly NOT an exact historic reconstruction).
- `.falaj-layout` — sticky `.falaj-plan` reusing the *exact same* `zoning_plate_c.jpg` + `aspect-ratio:1448/890` container already used in Steps 04/06 (no new plan asset), overlaid with an inline SVG (`viewBox="0 0 1448 890"`) illustrative water-path. **Geometry could not be extracted pixel-perfect from the masterplan**, so per the spec's own fallback it's a hand-estimated bezier in the shared coordinate space, explicitly captioned "Illustrative water route, simplified for clarity — not a survey drawing." Path reveal driven by a single `--fj-progress` custom property (0→1, `stroke-dashoffset` on a `stroke-dasharray:1200` path) rather than per-step class toggling, for a continuous "water travels through the park" draw effect.
- `.falaj-story` — 6 `.falaj-stage` articles (Source → Flow → Landscape → Comfort → Social life → Ecology), each with the exact required verbatim bold statements/supporting lines from the spec.
- `.falaj-moments` — 3 more Board-36-gallery photos (Landscape/Comfort/Social life), all `loading="lazy"`, distinct from images already used in Step 07's zone chapters.
- `.falaj-intelligence` — Smart Irrigation / Water Quality rows in Step 05/06's exact established phrasing + a targets footnote (with the "targets, not certifications" disclaimer).
- `.falaj-layers` — "visible water" vs "working water" distinguished **typographically only**, deliberately NOT built as two cards, per spec.
- `.falaj-cinematic` — full-bleed moment (reusing Step 07's viewport-edge breakout technique) with the verbatim line "THE FALAJ IS BOTH INFRASTRUCTURE AND EXPERIENCE."
- `.falaj-movement` / `.falaj-continuity` — family-walking image + text, and a Z8 elevated-terrace image + text. **Continuity claim restricted strictly to the one documented Z5↔Z8 lagoon relationship** — deliberately not claiming any water relationship with Z4, Z6, or Z7 despite visual proximity on the masterplan (avoids inventing connectivity).
- `.falaj-resolution` — `Water · Shade · Landscape · People · Ecology` typographic list, verbatim "ONE CONTINUOUS LIVING SYSTEM." and "THE FALAJ IS NOT AN OBJECT IN THE PARK. IT IS PART OF HOW THE PARK LIVES.", transition line "Systems create the conditions. People turn them into experience.", and a "FOLLOW ONE FAMILY THROUGH THE PARK. ↓" teaser. **Human Journey itself deliberately left untouched** — stop-after-Step-08 instruction honored.

**JS (`al-safa-v2.js`, 7th IIFE) — mirrors Step 06's pattern, not Step 07's:**
Per spec's explicit "sticky plan/water diagram + scrolling story" request, Step 08 reuses Step 06's shared-sticky-diagram `setStep()` pattern (an `IntersectionObserver` over 6 `.falaj-stage`s driving a `PROGRESS` lookup table onto `--fj-progress`), rather than Step 07's simpler independent-chapter reveal. A separate, reused generic `reveal(selector, options)` helper (Step 07's exact pattern) handles the `.falaj-moment` photo grid's fade/rise-on-scroll. Self-caught during implementation: the first `.falaj-moment` CSS lacked any initial/transition state for the `reveal()` call to animate, so a follow-up edit added the opacity/transform transition plus its `prefers-reduced-motion` override, consistent with every other animated element in the file.

**Animation restriction honored:** SVG path-draw / opacity / crossfade / parallax only — no wave, liquid-shader, splash, particle, or glossy-3D-water effects (explicit prohibition).

**Accent color:** muted teal/desaturated blue-green (`--fj-water`) scoped to `#falaj` — deliberately not bright pool blue.

**Mobile:** all sticky/diagram layouts simplify to sequential static blocks (same pattern as Steps 04–06); `.falaj-moments` stacks to one column.

**Verification suite — all passed:**
- Original file md5sum unchanged: `f8bf7ee548e13604e2c2360ec21781d5`, `git status --porcelain`/`git diff --stat` empty against it
- Board count: 52 (unchanged)
- Section boundaries confirmed via grep: `#zones` → `#falaj` (`class="falaj-section"`) → `#human-journey`, each present exactly once, in order
- HTML tag balance confirmed for the falaj region (section/div/svg/path/circle/article/h2/h3/p/ul/li/img/figure/figcaption/span/strong all matched — `img` intentionally void/self-closing, 7 open/0 close is correct)
- CSS brace balance confirmed (474 open / 474 close)
- `node --check public/al-safa-v2.js` passed
- Dev server smoke test (`npm run dev`, port 5173): curl returned `200` for the v2 page and all 7 newly-referenced image paths (`zoning_plate_c.jpg` + 6 waterside renders, URL-encoded via Node since Python is unavailable in this shell). Dev server stopped cleanly afterward (`taskkill //F //IM node.exe //T`).

### STEP 09 — Human Journey / Family Scrollytelling (this session, complete)

Full 35-point spec was provided verbatim; work confined to `<section id="human-journey">`. Family characters use the user's canon names (Rashid/father, Maryam/mother, Zayed/boy, Hessa/girl) mapped onto Board 50's anonymous storyboard cast — no new images, no new family members, no altered character identities.

**Image sourcing (no invented imagery):**
- **Board 50 "User Journey Storyboard · A Family Visit"** — the sole authoritative source, 25 captioned frames (`1_Videos/0.png`–`24.png`). Compressed to **11 key moments** (spec asked for 8–12): frames 1, 2, 6, 7, 9, 12, 14, 19, 21, 22, 23 — a monotonically increasing subset, preserving the storyboard's own chronology.
- All 11 selected frames were directly viewed (not just grepped by caption) to confirm Rashid/Maryam/Zayed/Hessa appear consistently — same clothing, faces, styling — across every frame. No conflicting or duplicate character versions found.
- **Board 50 has no literal car/departure frame.** Frame 23 ("End of the day — portrait at dusk, canopy structure and palms behind") was used as the closest available substitute for the DEPARTURE moment — a transparent substitution, not an invented image.

**Structure built:**
- `.journey-intro` — index "09 / Human Journey" + verbatim "THE SYSTEM DISAPPEARS. THE EXPERIENCE REMAINS." + verbatim lede.
- Full-bleed `.journey-cinematic--arrival` (frame 1) — large word "ARRIVAL", minimal copy.
- `.journey-layout` — sticky 6-stage crossfade group (HEAT/WELCOME/MOVE/REST/DISCOVER/LEARN, frames 2/6/12/7/9/14) reusing **Step 03's** crossfade pattern (not Step 08's SVG pattern — no JS-level `reduceMotion` branch needed for a plain opacity swap), each with its exact required verbatim statement and a restrained single-word `.journey-tag` (COMFORT/ACCESS/SHADE/WATER/PLAY/LEARN).
- Full-bleed `.journey-cinematic--gather` (frame 21, Majlis) — verbatim "WATER, SHADE AND SOCIAL LIFE COME TOGETHER."
- `.journey-simple--sunset` (frame 19) — verbatim "THE PARK CHANGES AS THE DAY CHANGES."
- Full-bleed `.journey-cinematic--night` (frame 22) — verbatim "LIGHT APPEARS WHERE IT IS NEEDED."
- `.journey-simple--departure` (frame 23) — verbatim "THE PARK QUIETLY RETURNS TO REST."
- `.journey-resolution` — 7-item typographic list (Heat/Shade/Water/Play/Learning/Community/Night), verbatim "A PARK THAT UNDERSTANDS.", a `.journey-connections` line tying each earlier system (Heat/Water/Ecology/Lighting) back to this human story, and the "The experience is human. The performance is measurable." teaser for the not-yet-built Performance section.

**Day-to-night progression (CSS-only, no JS recoloring):** a single multi-stop `linear-gradient` on `#human-journey` itself (day ivory → gold → dusk → near-black, mirroring `#concept`'s own precedent), with each dark "island" (cinematic peaks, departure block, resolution) hardcoding its own light/dark text color locally rather than depending on one dynamic ink token.

**JS (`al-safa-v2.js`, 8th IIFE):** Step 03's exact `setActiveStep`/`IntersectionObserver` pattern (threshold 0.5, rootMargin `-20% 0px -20% 0px`) drives the 6-stage sticky group; the generic `reveal()` helper (reused from Steps 07/08) handles the cinematic peaks and simple blocks, gated by `prefers-reduced-motion`.

**Performance/accessibility:** first journey image (frame 1, ARRIVAL) `loading="eager"`, all other 10 images `loading="lazy"`; meaningful per-image `alt` text naming the family and the moment (never filenames); minimal captions only (e.g. "ARRIVAL / DROP-OFF PLAZA").

**Mobile:** sticky crossfade group un-stickies to a static stack (same pattern as Steps 04–08); sunset/departure simple blocks stack to a single column, image above text.

**Verification suite — all passed:**
- Original file md5sum unchanged: `f8bf7ee548e13604e2c2360ec21781d5`
- Board count: 52 (unchanged)
- Section boundaries confirmed via grep: `#falaj` → `#human-journey` → `#performance` → `#after-dark`, each present exactly once, in order
- HTML tag balance confirmed for the journey region (section/div/figure/figcaption/ul/li/article/span/p all matched; 11 `img` tags confirmed)
- CSS brace balance confirmed (544 open / 544 close, whole file)
- `node --check public/al-safa-v2.js` passed
- Dev server smoke test (`npm run dev`, port 5199): curl returned `200` for the v2 page, `al-safa-v2.css`, `al-safa-v2.js`, and all 11 referenced journey image paths. Dev server stopped cleanly afterward (`taskkill //F //IM node.exe //T`).

### STEP 10 — Performance / Data Storytelling (this session, complete)

Full 35-point spec was provided verbatim; work confined to `<section id="performance">`. Explicitly **not** a KPI dashboard / bento grid / analytics/SaaS report / gauge wall — a typography-driven "editorial data visualization + architectural performance summary."

**Data sourcing (no invented values, no internet search) — read directly from the original file:**
- **Cover-stat strip (lines 317–338)** — the single most authoritative source for the six headline metrics: 15,037 m² landscape (precise 15,036.7951 m²), 93.4% open-to-sky, 8+1 experience zones ("Zones Z1–Z8 · Z6-A pilot canopy"), 51 A1 competition boards.
- **"Controlled Area Schedule" table (Board 10-area, lines 755–770)** — authoritative source for the precise proportional-area breakdown: 71.15% landscape/open space, 22.24% parking/drives/entrances, 6.60% building footprint (sums to 99.99% in the table's own rounding — not adjusted, reported as published).
- **Board 19's itemized "12 AI Workflows" card (lines 1119–1136)** — authoritative, named/auditable source for the AI workflow count and the 12 names.
- **Cost/budget board (lines 2294–2418)** — AED 33.47M / 33,469,885 against the AED 35,000,000 cap (AED 1,530,115 headroom), and the "locked… one permitted number set" narrative (lines 2440–2445) that justifies presenting the cost figure verbatim with no recalculation.

**Discrepancy disclosed, not silently resolved:** an earlier hero-stats block (line 533) states "13 AI Workflows," conflicting with Board 19's own itemized card, which names exactly 12. Used **12** (matches the itemized, auditable source and the user's own spec example list) and flagged the 13-vs-12 conflict transparently rather than guessing or averaging.

**Structure built:**
- `.performance-intro` — index "10 / Performance" + verbatim statement "THE EXPERIENCE IS HUMAN. THE PERFORMANCE IS MEASURABLE." + verbatim lede "The project translates design intent into measurable spatial, environmental and operational outcomes."
- `.performance-story` — 6 full-bleed `.metric-block` beats, one metric per visual beat (never a card row), alternating the site's already-established ivory/stone/green/charcoal palette:

  | Beat | Metric | Background | Count-up? |
  |---|---|---|---|
  | PROJECT SCALE | 15,037 m² | stone (light) | Yes |
  | OPEN LANDSCAPE | 93.4% open to sky | green (dark) | Yes |
  | PROGRAM DIVERSITY | 8+1 experience zones | ivory (light) | No (compound glyph) |
  | LIVING INTELLIGENCE | 12 AI workflows (restrained list, not 12 cards) | charcoal (dark) | Yes |
  | INVESTMENT | AED 33.47M | stone (light) | Yes |
  | DOCUMENTATION | 51 A1 boards | charcoal (dark) | Yes |

- Each `.metric-block`: `.metric-label` → `.metric-value-row` (`.metric-value` large `clamp()` Playfair Display number + `.metric-unit`) → `.metric-descriptor` → `.metric-copy` → `.metric-connection` (short line tying the metric back to human experience) → optional `.metric-tertiary` annotation.
- **Supporting diagram:** one `.metric-visual .metric-bar` proportional-area bar on the PROJECT SCALE beat only, reusing the original document's own `.abar`-table colors (`#B45A3C`/`#8A5A2B`/`#7A8450`) and the exact 71.15/22.24/6.60 percentages — no invented subcategories, no chart-variety pile-up elsewhere.
- **AI workflow beat:** a restrained `.metric-stream` flat list of the 12 verified names (Comfort Routing, Smart Irrigation, Tree Health, Water Quality, Adaptive Lighting, Crowd Forecast, Predictive Maintenance, Waste Optimisation, Sports Booking, Inclusive Companion, Ecology Learning, Emergency Assist) with a `·` separator convention — not 12 cards.
- `.performance-summary` — merges the spec's "one strong data moment" and "final resolution" asks into a single `.metric-composition` (4 items: 15,037 m² / 93.4% / 8+1 / 12) resolving into verbatim "ONE CONNECTED PARK SYSTEM."
- `.performance-transition` — teases the not-yet-built After Dark section: verbatim "Performance does not stop at sunset." / "THE PARK CHANGES WITH THE DAY." **After Dark itself deliberately left untouched** — stop-after-Step-10 instruction honored.

**Count-up animation (new pattern this step):** each `.metric-value`'s real, correctly-formatted final text (e.g. "15,037", "93.4", "12", "33.47", "51") is always present in the DOM by default via a `data-final` attribute — a no-JS/no-motion-safe default, not a fallback bolted on afterward. `data-count-to` (raw numeric target) and `data-decimals` (0/1/2) drive a `requestAnimationFrame` cubic-ease-out animation (~1300ms) that formats via `toLocaleString('en-US', …)` and resets to `data-final` on completion to avoid float-rounding artifacts. Fully gated behind `!reduceMotion && window.IntersectionObserver`. 5 of 6 metrics animate; the 8+1 zones beat stays static since it's a compound glyph, not a pure number.

**JS (`al-safa-v2.js`, 9th IIFE):** reuses the established generic `reveal()` helper for `.metric-block`/`.metric-bar` scroll reveal, plus a new dedicated `countUp()`/`formatCount()` block wired to an `IntersectionObserver` over `.metric-value[data-count-to]` elements.

**Strict design restrictions honored:** no KPI card grid, no bento metrics, no speedometer gauges, no donut charts, no stock icons, no glass cards, no gradients-behind-numbers, no glowing/crypto-dashboard aesthetic, no fake precision (no invented energy/carbon/water-saving/satisfaction/maintenance percentages).

**Mobile:** all 6 metric beats stack vertically with controlled padding/sizing (no side-by-side, no horizontal scroll); `.metric-composition` drops to a 2-column grid; `.metric-bar__legend` stacks; `.metric-copy`/`.metric-connection`/`.metric-tertiary` get a constrained `max-width`.

**Verification suite — all passed:**
- Original file md5sum unchanged: `f8bf7ee548e13604e2c2360ec21781d5`
- Board count: 52 (unchanged)
- Section boundaries confirmed via grep: `#human-journey` → `#performance` → `#after-dark` → `#final-film` → `#competition-archive`, each present exactly once, in order
- HTML tag balance confirmed for the performance region via a scratchpad Node script (section 1/1, div 31/31, article 6/6, ul 2/2, li 15/15, p 18/18, span 28/28) — an inline `node -e` check first gave false MISMATCH results due to shell backslash-escaping mangling the regex, fixed by writing the check to a script file instead
- CSS brace balance confirmed (615 open / 615 close, whole file)
- `node --check public/al-safa-v2.js` passed
- Dev server smoke test: curl returned `200` for the v2 page, `al-safa-v2.css`, and `al-safa-v2.js`. Dev server stopped cleanly afterward (`taskkill //F //IM node.exe //T`).

### STEP 11 — After Dark / Adaptive Lighting + Night Experience (this session, complete)

Full 31-point spec was provided verbatim; work confined to `<section id="after-dark">`. Explicitly **not** cyberpunk / neon city / smart-city dashboard / festival lighting / nightclub / luxury-nightlife aesthetic — "cinematic night architecture + adaptive public realm + quiet intelligence."

**Data sourcing (no invented lighting data):**
- **Board 49 "Night Experience · After Dark"** — the sole authoritative source: 11 captioned night images (`night/hero_lagoon_c.jpg`, `z2_fitness_c.jpg`, `z5_*` ×6, `z6_cinema_v2_c.jpg`, `z8_dining_c.jpg`), plus an explicit disclaimer that photometric design/lux levels are not yet developed and are subject to DEWA + Dubai Municipality approval at the detailed MEP stage. This directly justified skipping the spec's optional SVG lighting-overlay-on-plan (point 21) — building one would mean guessing fixture geometry the source doesn't contain.
- **Board 19's Adaptive Lighting workflow card** ("Scenes by presence · safety minimum kept") — the same Input/Decision/Response/Outcome panel already built in Step 05, reused verbatim and remapped onto the spec's requested SENSE→ACTIVATE→GUIDE→DIM framing (same "relabel a verified pipeline" technique Step 05 used for its own SENSE→UNDERSTAND→DECIDE→RESPOND diagram).
- **Human Journey frames 19 and 23** (`1_Videos/19.png`, `1_Videos/23.png`) reused per the spec's explicit Step 09↔Step 11 continuity instruction (the sunset/departure connection).

**Structure built:**
- `.afterdark-intro` — index "11 / After Dark" + verbatim "THE PARK CHANGES WITH THE DAY." (deliberately echoing Step 10's own closing teaser line) + verbatim lede.
- `.night-transition` — a small, contained day → golden hour → blue hour → night swatch strip with a one-shot growing gradient line. **Not** a full-section background gradient — the whole section is already "after dark," so the day-to-night idea is confined to this one contained element rather than repeating Human Journey's whole-section gradient technique.
- Full-bleed `.afterdark-cinematic--primary` — reuses `night/hero_lagoon_c.jpg`, the same "park-wide night atmosphere" image already used in the Hero, per the spec's own #1 priority choice for the primary night visual.
- `.night-logic` — merges the spec's "Core Night Logic" (SENSE→ACTIVATE→GUIDE→DIM) and "Adaptive Lighting Story" into one block: verbatim "LIGHT APPEARS WHERE IT IS NEEDED." + Board 19's exact verified text remapped onto 4 `.lighting-node`s, connected by one-shot-reveal `.lighting-path` lines.
- `.afterdark-layout` — sticky 6-stage crossfade group (SUNSET/PATHS/GATHER/WATER/RESPONSE/QUIET) reusing **Step 09's exact** `setActiveStep` pattern, each with its required verbatim statement:

  | Stage | Statement | Image |
  |---|---|---|
  | 01 SUNSET | "THE PARK SLOWS DOWN." | `1_Videos/19.png` (reused from Journey) |
  | 02 PATHS | "MOVEMENT DEFINES WHERE LIGHT IS NEEDED." | `night/z2_fitness_c.jpg` |
  | 03 GATHER | "PUBLIC LIFE CONTINUES AFTER SUNSET." | `night/z5_lounge1_c.jpg` |
  | 04 WATER | "WATER BECOMES QUIETER, NOT BRIGHTER." | `night/z5_interior_c.jpg` |
  | 05 RESPONSE | "LIGHTING RESPONDS TO USE, NOT JUST TIME." | `night/z8_dining_c.jpg` |
  | 06 QUIET NIGHT | "THE PARK QUIETLY DIMS." | `1_Videos/23.png` (reused from Journey) |

  `night/z5_interior_c.jpg` was chosen for WATER over `z5_lounge2_c.jpg` specifically to avoid a duplicate appearance of an image already used once in Step 07's Zones.
- `.lighting-layers` — a flat, non-card list distinguishing Path / Social / Landscape / Building & Canopy / Water Edge lighting, each a short architecturally-grounded description — no invented lux/fixture specs anywhere.
- Full-bleed `.afterdark-cinematic--final` — `night/z6_cinema_v2_c.jpg`, verbatim "THE PARK REMAINS ACTIVE WITHOUT BECOMING LOUD." / "SAFE. CALM. RESPONSIVE."
- `.night-resolution` — verbatim "FROM DAYLIGHT TO DARKNESS, THE SYSTEM REMAINS QUIETLY PRESENT." / "SEE THE PARK IN MOTION." teaser for the not-yet-built Final Film section. **Final Film itself deliberately left untouched** — stop-after-Step-11 instruction honored.

**Color language:** charcoal/deep-green base (`--ad-charcoal:#101416`, `--ad-green:#13201A`), muted warm-white ink (`--ad-ink:#F2F0EA`), bronze/gold accent (`--ad-sun:#C9A667`), subtle teal for the blue-hour swatch (`--ad-teal:#7CA39D`) — no neon blue/green/purple/magenta/cyan anywhere.

**JS (`al-safa-v2.js`, 10th IIFE):** again reuses Step 09's exact `setActiveStep`/`IntersectionObserver` crossfade pattern for the 6-stage sequence, plus the generic `reveal()` helper for `.night-transition`, the two `.afterdark-cinematic` peaks, `.night-logic`, and each `.lighting-layer` item. No new animation technique introduced — crossfade opacity swaps and one-shot line/opacity reveals only, per the spec's "restrained line illumination" motion rule (no flicker/pulse/particles/bloom).

**Mobile:** sticky crossfade group un-stickies to a static stack (same pattern as Steps 04–09); `.lighting-path` connector lines hidden and `.lighting-node`s stack vertically; `.night-transition__line` hidden (swatches still show, just without the connecting line).

**Verification suite — all passed:**
- Original file md5sum unchanged: `f8bf7ee548e13604e2c2360ec21781d5`
- Board count: 52 (unchanged, confirmed in both the original and the v2 file's embedded archive)
- Section boundaries confirmed via grep: `#performance` → `#after-dark` (`class="afterdark-section"`) → `#final-film` → `#competition-archive`, each present exactly once, in order
- HTML tag balance confirmed for the after-dark region via the scratchpad `check_balance.js` script re-scoped to `#after-dark`…`#final-film` (section 1/1, div 30/30, article 6/6, ul 2/2, li 11/11, p 21/21, span 40/40, figure 2/2, figcaption 1/1, img 8/8)
- CSS brace balance confirmed (705 open / 705 close, whole file)
- `node --check public/al-safa-v2.js` passed
- Dev server smoke test (`npm run dev`, port 5183): curl returned `200` for the v2 page, `al-safa-v2.css`, and `al-safa-v2.js`; confirmed `afterdark-section` markup, "STEP 11 — After Dark" CSS marker, "After Dark (Step 11)" JS marker, and the verbatim "THE PARK QUIETLY DIMS." copy all present in the served output. Dev server stopped cleanly afterward (`taskkill //F //IM node.exe //T`).

---

## File state — end of this session

| File | Status |
|---|---|
| `public/dubai-municipality-competition.html` | ✅ Untouched (md5 verified) |
| `public/dubai-municipality-competition-v2.html` | ✅ Steps 01–11 complete; `#final-film` onward still empty stubs |
| `public/al-safa-v2.css` | ✅ Steps 02–11 fully implemented (`/* STEP 02 */` … `/* STEP 11 */` blocks), shared `@media (max-width:720px)` and `@media (prefers-reduced-motion: reduce)` blocks extended for every step |
| `public/al-safa-v2.js` | ✅ 10 IIFEs (Steps 02–11), `node --check` clean |
| Persistent Claude memory (`project_al_safa_portfolio_site.md`) | ✅ Updated with full Step 11 documentation |

---

## Key technical conventions (apply to every future step)

- **No build step for this sub-project** — plain HTML/CSS/JS served as static files from Vite's `public/` folder, root-absolute asset paths (`/dubai-municipality-competition-assets/...`).
- **Scrollytelling pattern:** native CSS `position:sticky` + `IntersectionObserver`. No GSAP/ScrollTrigger anywhere in this file.
- **Line-draw animation:** SVG `pathLength="1000"` + `stroke-dasharray:1000` + `stroke-dashoffset` transition to `0` on `.is-active`.
- **Typography:** `clamp()`-based responsive editorial type; Playfair Display for statements/headings, Arial/Helvetica for small labels/index tags (uppercase via `letter-spacing` + `text-transform`).
- **Section-scoped CSS custom properties** (`--li-*`, `--mp-*`, `--ev-*`, etc.) declared on each `#section-id`, not globally — background tone deliberately drifts darker/warmer across sections for continuity (charcoal → deep charcoal → warm charcoal).
- **`prefers-reduced-motion: reduce`** handled per step — every step's CSS block ends with its own override disabling transitions/animations and forcing final visible states.
- **Masterplan coordinate system is canonical** — any future section that needs to reference zones (Falaj, Human Journey, Performance, After Dark, Zones itself) should reuse the same 9 zone-hotspot % coordinates from Step 04 (table above) rather than re-deriving positions.
- **Verification suite pattern** (re-run after every step's edits): md5sum on the original file, `git status --porcelain`, board-count grep (`class="board"` = 52 baseline), section-boundary grep, `node --check` on the JS, CSS brace balance, dev-server HTTP smoke test via `npm run dev -- --port <N> --strictPort` + curl, then `taskkill //F //IM node.exe //T` to stop it cleanly.
- **Windows/Git-Bash quirks:** `python` (not `python3`) is the working Python 3.12 + PIL install; use forward slashes in paths even on Windows.

---

## Next step (not started)

**STEP 12 — Final Film** (`<section id="final-film">`) — teased at the end of Step 11 ("FROM DAYLIGHT TO DARKNESS, THE SYSTEM REMAINS QUIETLY PRESENT." / "SEE THE PARK IN MOTION.") but explicitly **not built** per the user's "STOP after STEP 11. Do NOT continue to Final Film or Archive" instruction. Waiting on the next full spec message before starting. Remaining stub sections after that: `final-film`, `competition-archive` (the latter already holds the full embedded 51-board archive and is not expected to need new content, only wrapper/nav treatment if the next spec calls for it).

---

*Session ended: 2026-09-08. Resume by pasting the next step's spec — this file plus the Claude memory entry `project_al_safa_portfolio_site.md` carry full context forward.*
