# Space Planning Portfolio — Session Log
**Project:** The Chedi Private Residences · Sheikh Zayed Road, Dubai  
**Developer:** Al Seeb  
**Session Date:** 19 June 2026  
**Author:** M. Amine Berchache — Senior Architect · BIM Coordinator  
**Portfolio:** https://portfolio-five-kappa-d7gqte5vgz.vercel.app

---

## SESSION SUMMARY

This session established the full space planning workflow for The Chedi Private Residences and applied DBC 2021 compliance standards across ALL Dubai projects on the portfolio.

---

## PROJECT OVERVIEW — THE CHEDI PRIVATE RESIDENCES

| Item | Detail |
|---|---|
| Location | Sheikh Zayed Road, Dubai |
| Tower | 52 floors (GFA 130,000 m²) |
| Developer | Al Seeb |
| Brand | The Chedi Private Residences |
| Handover | Q1 2029 |
| Payment Plan | 55/45 |
| Units | 3BR · 4BR · Duplex · Triplex |

---

## COMPLETED THIS SESSION

### 1. Sanctuary Type 3BR + Maid — Full Report
**URL (live):** https://portfolio-five-kappa-d7gqte5vgz.vercel.app/space-planning/chedi-private-residences-3br-jun2026/  
**File:** `public/space-planning/chedi-private-residences-3br-jun2026/index.html`  
**Score:** 78 / 100 — Qualified Luxury  
**DBC Status:** 1 Fail · 2 Marginal

**Unit Confirmed Figures:**
- GFA: **360 m²** (3,875 sqft)
- Built-up area: **480 m²**
- Net internal (plan measurement): ~228 m²
- Typology: 3BR + Maid · Sanctuary Type · LEFT unit
- Floor level example: FFL +42,700

**13 Sections completed:**
| # | Section | Key Finding |
|---|---|---|
| 00 | Developer Floor Plan | Flat mood board.png inserted |
| 01 | Area Efficiency | 79% primary-use ratio · 5.3% circulation — Strong |
| 02 | Public/Private Zoning | Maid room confirmed direct lobby access (Pass) · Guest powder room confirmed at lobby (Pass) |
| 03 | Circulation Analysis | 5.3% — well below 12% benchmark |
| 04 | Room Dimensional Audit | All rooms vs DBC 2021 Table B.3 |
| 05 | Living/Dining Analysis | 100.5m² open plan — Exceptional |
| 06 | Kitchen Analysis | ~11.4m² — Pass (2x DBC minimum) |
| 07 | Bedroom Analysis | Master 29.5m² (Exceptional) · Bed01+02 marginal at 3,000mm |
| 08 | Bathroom/WC Analysis | Master ensuite ~20m² · Guest powder room confirmed at lobby |
| 09 | Balcony Analysis | 33.8m² primary + 10.2m² secondary = 44m² total |
| 10 | Storage Analysis | Dressing rooms + store confirmed |
| 11 | Main Weaknesses Ranked | #1 Bed widths marginal · #2 Resolved (powder room) · #3 Corridor 1,100mm · #4 Maid room no window (DBC FAIL) |
| 12 | Final Verdict | 78/100 · Qualified Luxury |

---

### 2. DBC 2021 Compliance Applied to ALL Dubai Projects

**Standard used:** Dubai Building Code — English — 2021 Edition (official document)  
**Reference file created:** `public/space-planning/DBC-2021-COMPLIANCE-REFERENCE.md`

#### Corrections applied to JVC 3BR Report (new-ruby-jvc-3br-jun2026):
| Error | Corrected |
|---|---|
| Kitchen min 5.0m² | **5.4m²** (DBC 2021 Table B.3) |
| Kitchen deficit 0.04m² | **0.44m²** (far more severe) |
| Generic DBC citation | Specific Table B.3 / B.5.2 cited |

#### Corrections applied to Chedi 3BR Report:
| Error | Corrected |
|---|---|
| Kitchen min 5.0m² | **5.4m²** (DBC 2021 Table B.3) |
| "Maid room fails on natural ventilation" | Fails on **daylighting only** (DBC B.6.5.2.1) |
| "5% openable ventilation required" | **Removed** — HVAC mandatory per DBC H.4.11 |
| GFA = 228 m² (estimated) | **GFA = 360 m²** (confirmed by owner) |
| Gross = 273 m² (estimated) | **Built-up = 480 m²** (confirmed by owner) |
| Guest powder room "unconfirmed" | **Confirmed** at unit lobby (LOB.) |
| "No guest WC" flag | **Withdrawn** — lobby position is correct luxury planning |

---

### 3. DBC 2021 Key Standards (Extracted from Official Document)

| Check | DBC 2021 Standard | Reference |
|---|---|---|
| Bedroom / living min area | **10.5m²** net | Table B.3 |
| Bedroom / living min dim | **3,000mm** clear | Table B.3 |
| Housekeeper's room min area | **4.5m²** (excl. toilet) | Table B.3 |
| Housekeeper's room min dim | **2,100mm** clear | Table B.3 |
| Enclosed kitchen min area | **5.4m²** | Table B.3 |
| Kitchen manoeuvring clearance | **1,200mm** | B.5.2, Fig B.24 |
| Min ceiling height (residential) | **2,700mm** | Table B.4 |
| Internal unit corridor | **1,000mm** | Table B.5 |
| Common corridor (single-sided) | **1,500mm** | Table B.5 |
| Common corridor (double-sided) | **1,800mm** | Table B.5 |
| Window glazing — bedrooms/living | **10% of room area** | Table B.8, B.6.5.2.1 |
| Window glazing — housekeeper's room | **10% of room area** | B.6.5.2.1 |
| Min daylight lux | **150 lux** | B.6.5.2.1 |
| Natural ventilation | Permitted but NOT required | H.4.11 |
| Mechanical HVAC | **Mandatory** | H.4.12 |
| Entry door clear width | **915mm** | Table B.7 |
| Bathroom door clear width | **815mm** | Table B.7 |
| Min 1 bathroom per unit | **Required** | B.8.1 |

---

### 4. Portfolio Index Updated
**File:** `public/space-planning/index.html`  
- Project card #02 added for Chedi 3BR
- Tags: GFA 360m² · DBC 1 Fail · 78/100

---

### 5. Deployment
**Commit:** `36c5fbc`  
**Message:** "add: Chedi 3BR report + DBC 2021 compliance fixes across all Dubai projects"  
**Files changed:** 5 files · 1,694 insertions · 11 deletions  
**Status:** ✅ Pushed to GitHub → Vercel auto-deployed

---

## PENDING — NEXT SESSIONS

### Units Still to Analyze (Same Tower — The Chedi):

| Unit | Typology | Priority | Notes |
|---|---|---|---|
| **4BR** | 4 Bedroom | Next | Confirm which side (left/right) of typical floor |
| **Duplex** | 2-floor unit | — | Need full floor plans for both levels |
| **Triplex** | 3-floor unit | — | Need full floor plans for all three levels |

### For Each New Unit — Required from Owner:
1. Developer floor plan image (with visible dimensions)
2. Confirm GFA and built-up area (m²)
3. Confirm unit position on floor (left / right / corner)
4. Any specific rooms to flag (e.g. maid room, study, staff quarters)

### Workflow for Next Unit:
1. User provides floor plan → Claude reads all dimensions
2. Full DBC 2021 audit against `DBC-2021-COMPLIANCE-REFERENCE.md`
3. 13-section HTML report generated (same design system)
4. Card added to `/space-planning/index.html`
5. Git push → Vercel deploy
6. git command: `git add public/space-planning/ && git commit -m "..." && git push origin main`

---

## FILE STRUCTURE (Current State)

```
public/space-planning/
├── index.html                                    ← Main index (01 JVC + 02 Chedi cards)
├── DBC-2021-COMPLIANCE-REFERENCE.md              ← Master DBC 2021 standards (ALL Dubai projects)
├── SESSION-LOG-Chedi-Jun2026.md                  ← This file
├── new-ruby-jvc-3br-jun2026/
│   ├── index.html                                ← JVC 3BR report (DBC corrected)
│   └── floor-plan.jpg                            ← JVC developer floor plan
└── chedi-private-residences-3br-jun2026/
    ├── index.html                                ← Chedi Sanctuary 3BR report (78/100)
    └── Flat mood board.png                       ← Chedi floor plan reference image
```

---

## DESIGN SYSTEM (All Reports — DO NOT CHANGE)

```css
--bg:      #0A0A0A
--surface: #111111
--card:    #161616
--gold:    #C4922A
--red:     #C94040
--amber:   #C4882A
--green:   #3D8C5E
--text:    #F0EBE0
```

**Fonts:** Cormorant Garamond (display) · DM Sans (body) · DM Mono (data/mono)

---

## GIT WORKFLOW

```powershell
# Always navigate with EXACT hyphen (not em-dash)
cd "C:\Users\asus\Desktop\WEB - Copy\AI\portfolio-website"

# Stage all space-planning changes
git add public/space-planning/

# Commit and push
git commit -m "add: [unit type] space planning report"
git push origin main
```

**Vercel auto-deploys on push. Takes ~2 minutes.**  
**Monitor at:** https://vercel.com/dashboard

---

*Session completed: 19 June 2026*  
*Next session: 4BR analysis — The Chedi Private Residences*
