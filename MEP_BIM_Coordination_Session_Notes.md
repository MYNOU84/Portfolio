# MEP System BIM Coordination — Session Notes
**Project:** M. Amine Berchache Portfolio Website  
**Page:** MEP System_ BIM Coordination  
**URL:** https://portfolio-five-kappa-d7gqte5vgz.vercel.app/mep-system-bim-coordination.html  
**Date:** 2026-06-20  
**Session Type:** Standards Compliance Check + BIM Content Rebuild  

---

## 1. Objective

Check the MEP BIM Coordination page against the DM/DCD Mechanical System Classification reference document and Dubai Building Code 2021. Fix all misclassifications and rebuild the page with full DM/DCD data per system.

---

## 2. Reference Documents Used

| Document | Use |
|---|---|
| `DM_DCD_Mechanical_System_Classification.md` | Primary authority reference — defines 8 BIM classification codes |
| `Dubai Building Code_English_2021 Edition` | DBC Part H (Thermal/HVAC) and Part G (Electrical) |
| ISO 19650-2 | BIM information management — data requirements |
| ISO 19650-3 | Asset information requirements — COBie handover |

---

## 3. DM/DCD Classification Structure

### Dubai Building Code (DM Authority) — Normal HVAC Systems

| BIM Code | Classification | Sub-systems (DM Doc §) |
|---|---|---|
| **M-01** | HVAC Comfort Cooling | Chillers, CHW pumps, supply/return pipework, AHUs, FAHUs, FCUs, VRF/VRV, Split/Package Units, Condensate Drainage — §3.1 |
| **M-02** | Ventilation & Exhaust | Fresh Air System, Toilet Exhaust, Kitchen Exhaust, Garbage Room Exhaust, Laundry Exhaust, Plant Room Ventilation — §3.2 |
| **M-03** | Car Park Ventilation | Normal Car Park Ventilation, CO Monitoring System, Jet Fan System, Exhaust Fans, Make-up Air System — §3.3 |
| **M-04** | Mechanical Plant & Energy | Pumps, Heat Recovery, VFDs, Energy Metering, Temperature & Humidity Control, Equipment Efficiency, BMS Interface — §3.4 |

### Dubai Civil Defence (DCD Authority) — Fire & Life Safety Mechanical Systems

| BIM Code | Classification | Sub-systems (DM Doc §) |
|---|---|---|
| **FLS-M-01** | Smoke Control Systems | Smoke Extract System, Smoke Exhaust Fans, Smoke Extract Ducts, Make-up Air, Smoke Reservoir/Zone, Smoke Curtains — §4.1 |
| **FLS-M-02** | Pressurization Systems | Staircase Pressurization, Firefighting Lift Lobby Pressurization, Lift Shaft Pressurization, Pressure Relief Dampers, Differential Pressure Sensors — §4.2 |
| **FLS-M-03** | Fire-Related HVAC Components | Fire Dampers, Smoke Dampers, Combination Fire/Smoke Dampers, Motorized Dampers, Fire-Rated Ducts — §4.3 |
| **FLS-M-04** | Fire Alarm / Emergency Interface | Fire Alarm Interface, Cause-and-Effect Matrix, Firefighter Control Panel, Emergency Power, Testing and Commissioning — §4.4 |

---

## 4. Issues Found in Original Page

| # | Issue | Fix Applied |
|---|---|---|
| 1 | FLS-M-01 and FLS-M-02 bundled into one card | Split into two separate cards |
| 2 | M-02 Ventilation & Exhaust — missing entirely | New card added |
| 3 | M-03 Car Park Ventilation — missing entirely | New card added |
| 4 | FLS-M-04 Fire Alarm Interface — missing entirely | New card added |
| 5 | BMS bundled under HVAC as sub-item | Separated as M-04/All Disciplines card |
| 6 | Water Supply marked `uae:false` | Fixed to `uae:true` (DEWA + DM mandatory submissions) |
| 7 | Drainage marked `uae:false` | Fixed to `uae:true` (DM public drainage approval required) |
| 8 | No DM reference codes on any card label | All labels updated with DM BIM codes |
| 9 | No standard references on model parameters | All params updated with `\| Ref: DM Classification §X.X` |
| 10 | Duplicate `</head><body>` HTML tags | Removed duplicate tags |
| 11 | Stats showed 12 systems / 9 UAE flags | Updated to 17 systems / 13 UAE flags |

---

## 5. Final Page Structure — 17 Systems

| # | ID | Label | Title | UAE Flag |
|---|---|---|---|---|
| 1 | hvac | Mechanical · DBC Part H \| M-01 | HVAC Comfort Cooling | ✓ |
| 2 | ventilation | Mechanical · DBC Part H \| M-02 | Ventilation & Exhaust Systems | — |
| 3 | carpark | Mechanical · DBC Part H \| M-03 | Car Park Ventilation | — |
| 4 | mech-gen | Mechanical · DBC Part H \| M-04 | Mechanical Plant & Energy Systems | — |
| 5 | bms | Mechanical · DBC \| M-04 / All Disciplines | BMS — Building Management System | ✓ |
| 6 | smoke | Mechanical · DCD \| FLS-M-01 | Smoke Control Systems | ✓ |
| 7 | pressurization | Mechanical · DCD \| FLS-M-02 | Pressurization Systems | ✓ |
| 8 | firedampers | Mechanical · DCD \| FLS-M-03 | Fire Dampers & Fire-Rated Ductwork | ✓ |
| 9 | flsm04 | Mechanical · DCD \| FLS-M-04 | Fire Alarm & Emergency Interface | ✓ |
| 10 | electrical | Electrical · DEWA / DBC Part G | Main Electrical Service | ✓ |
| 11 | power | Electrical · DBC Part G | Power Distribution | — |
| 12 | lighting | Electrical · DCD \| Emergency Lighting | Lighting Systems | ✓ |
| 13 | elv | ELV / Low Voltage · DCD / TRA | ELV / Low Voltage Systems | ✓ |
| 14 | fire | Fire Protection · DCD | Fire Protection Systems | ✓ |
| 15 | plumbing | Plumbing · DEWA / DM | Water Supply & Plumbing | ✓ |
| 16 | drainage | Plumbing · DM Authority | Drainage & Stormwater | ✓ |
| 17 | renewable | Renewable Energy · DEWA Net Metering | Solar PV Systems | ✓ |

**Total: 17 systems · 13 UAE Authority flags**

---

## 6. Model Parameter Reference Convention

Every parameter item in the "Model Parameters Required" panel ends with:

```
| Ref: DM Classification §X.X
| Ref: ISO 19650-2
| Ref: ISO 19650-3 (Asset information requirements)
| Ref: DBC 2021 Part H
| Ref: DEWA Technical Standards
| Ref: DCD submission requirements
| Ref: BEP information requirements
```

**Note on `§` symbol:** Standard section notation used in technical/legal documents. `§3.1` = Section 3.1 of the referenced document. Future improvement: add exact PDF page numbers when full PDFs are available.

---

## 7. Sign-Off Checklist (0/19)

The page includes 19 BIM coordination sign-off items accessible via the SIGN-OFF CHECKLIST button:

1. All systems classified and placed at correct level and zone in the model
2. All major equipment items tagged with asset codes per asset register
3. Plant rooms coordinated — maintenance clearances confirmed against manufacturer data
4. Shafts sized correctly to accommodate all risers including future capacity
5. Risers aligned vertically from basement to roof — no uncoordinated offsets
6. Ceiling coordination complete — all services coordinated within available void
7. Access panels provided for all items requiring regular or periodic maintenance
8. Fire-rated penetrations coordinated and fire stopping specification confirmed
9. Drainage slopes and invert levels checked — confirmed clear of all beams
10. Electrical panels protected — no water services routed above any panel
11. Equipment maintenance clearances respected and modeled as exclusion zones
12. All systems declared clash-free — formal clash report issued and signed off
13. Shop drawings reviewed and confirmed consistent with the coordination model
14. Schedules extracted correctly from model — quantities and types verified
15. COBie and asset data requirements confirmed with client and developer
16. DCD NOC status confirmed for all fire and life safety systems
17. DEWA coordination completed for main electrical service and water metering
18. Dubai Municipality drainage connection approval obtained
19. BMS integration list reviewed and signed off by all MEP consultants

---

## 8. Files Modified

| File | Change |
|---|---|
| `public/mep-system-bim-coordination.html` | Full rebuild — 17 systems, DM references, white text fix |
| `dist/mep-system-bim-coordination.html` | Copied from public/ for Vercel deployment |

---

## 9. Deployment

- **Repository:** https://github.com/MYNOU84/Portfolio.git
- **Branch:** main
- **Deploy trigger:** `git push origin main`
- **Vercel auto-deploys** on every push to main (~60 seconds)

### Git Commands Used
```powershell
cd "C:\Users\asus\Desktop\WEB - Copy\AI\portfolio-website"
Remove-Item "C:\Users\asus\Desktop\WEB - Copy\AI\portfolio-website\.git\index.lock"
git add public/mep-system-bim-coordination.html dist/mep-system-bim-coordination.html
git commit -m "MEP page: 17 systems, full DM/DCD data, white text fix"
git push origin main
```

---

## 10. Pending Improvements (Next Session)

- [ ] Add exact PDF page numbers to all `Ref:` citations (requires DBC 2021 and ISO 19650 PDFs)
- [ ] Review if M-04 BMS card should be merged back into M-04 Plant card
- [ ] Consider adding a filter tab for "DCD Systems" vs "DM Systems"
- [ ] Update Sign-Off checklist to reference DM codes (DCD NOC for FLS-M-01 through FLS-M-04 specifically)
