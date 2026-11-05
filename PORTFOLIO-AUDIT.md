# Portfolio Audit and Three Creative Directions

**Subject:** portfolio-five-kappa-d7gqte5vgz.vercel.app
**Prepared for:** Mohamed Amine Berchache — Senior Architect, BIM Coordinator / BIM Manager, Founder of BERRACHETA Consultancy
**Date:** 14 September 2026
**Status:** Audit only. No code written, no files modified, no images generated or altered.

---

## How this audit was carried out

The live URL serves a React single-page application, so fetching the page returns an empty HTML shell. The audit was therefore carried out against the deployed source itself, which allowed every link, image path, responsive breakpoint and animation to be verified rather than guessed at. Every finding below is checked against a file, not inferred.

---

# PART 1 — AUDIT

## 1. Current structure and all accessible pages

The site is a **single route**. There is no router. All navigation is anchor-scrolling within one page.

### Homepage section order

| # | Section | Notes |
|---|---------|-------|
| 1 | Hero | Centred, three stat counters, three call-to-action buttons |
| 2 | Featured Competition | Al Safa Park, bilingual title |
| 3 | About | Bio, 35 competency chips, 10 software chips, 5 highlights, language bars |
| 4 | Experience | Vertical timeline |
| 5 | Portfolio | 32 projects, 6 filter tabs, uniform grid |
| 6 | Video | 8 hardcoded YouTube IDs |
| 7 | Services | 6 service cards |
| 8 | CV | Admin-visible only |
| 9 | Contact | Form, details, footer |

### Standalone pages behind the app

| Page group | Count | Reachable from navigation |
|---|---|---|
| MEP System, FTB-RDS, Site Supervision, Architectural Specifications, Space Planning | 5 | Yes, from the nav bar |
| FTB-RDS sub-reports (FDG-18, Radiotherapy) | 2 | Only from inside the FTB-RDS page |
| Al Safa competition V1 and V2 | 2 | V1 from a project card, V2 from the homepage band |
| Al Safa submission boards `dm-submission/01` to `12` | 12 | **No** |
| WASD-navigable 3D gallery at `/3d/` | 1 | **No** |

### Modal layers

Three overlay systems exist: the immersive pan, zoom and rotate viewer; the gallery grid modal; and a password-gated admin panel with local persistence.

**Total accessible surface:** one scrolling page plus roughly twenty standalone pages, of which thirteen have no route in from anywhere on the site.

---

## 2. Strengths worth retaining

1. **The technical microsites are the genuine differentiator.** Room data sheets, a seventeen-system MEP coordination reference, an architectural specifications document and a site-supervision process page. Almost no architect portfolio publishes material at this depth.
2. **Volume and authenticity of the work.** Thirty-two projects and roughly seven hundred real images. No stock, no filler, no invented content.
3. **The immersive viewer.** Pan, zoom, rotate and keyboard shortcuts. This is genuinely correct behaviour for drawing sheets and is rare in portfolio sites.
4. **The Al Safa Park submission.** Bilingual, current, against a named Dubai Municipality challenge. It is real, dated evidence of competition activity.
5. **Image protection.** Drag and right-click are disabled site-wide and this is intentional. It stays.
6. **Admin CMS without a backend.** Projects, ordering and images persist through local storage and IndexedDB. Practical and self-sufficient.
7. **SEO and structured data foundation.** JSON-LD Person schema, Open Graph and Twitter cards, robots and sitemap files all present.
8. **The bilingual instinct.** Arabic titling already appears in the competition band, which is a real credibility signal in the Gulf.

---

## 3. Weak, repetitive, outdated or generic sections

### The formula repeats without variation

Every one of the nine sections uses the identical construction: gold hairline rule, tracked uppercase micro-label, serif headline with one word set in gold, fade-up on scroll. Nine times consecutively. The rhythm never changes, so the eye stops registering section boundaries.

### The category system is broken

Categories mirror the source image folder names rather than how a client thinks about work.

```
'All' · 'Concept & Detail Design' · 'BIM' · 'Interior Presentation' · 'Interior 3D View' · 'Site Construction'
```

Consequences that are visible to any visitor:

- A ninety-storey Downtown Dubai tower is filed under **Interior Presentation**.
- The Anti-Cancer Centre is filed under **Interior Presentation**.
- Hospital detail drawings are filed under **Interior Presentation**.
- **BIM** contains three projects, which under-represents the single strongest part of the profile.

### Ten projects have no human title

Nine concept projects are named only by internal code, with blank location and blank year:

```
H-01 · P-21049 · P-2329 · P-35052 · P-45099 · P-4699 · P-49237 · P-550 · P-59224
```

These read as a file dump rather than as authored work.

### The About section is a wall of chips

Thirty-five competency pills followed by ten software pills. Forty-five identical shapes in sequence read as noise, not as authority. Animated language percentage bars set at Arabic 100, French 75 and English 75 are a résumé-template convention and an invented precision. Nothing in a percentage bar is verifiable.

### Vestigial and dead material

| Item | State |
|---|---|
| `HeroScene.jsx` | 246 lines, imported nowhere |
| `Skills.jsx` | 104 lines, imported nowhere |
| `three` dependency | Present in the package manifest, no live consumer |
| `src/data/videos.js` | Exports an empty array, never used |
| `public/videos/` | Empty directory |

---

## 4. What makes the site resemble other AI-generated portfolios

These are the specific, identifiable tells, in the order a visitor encounters them.

1. **Pure black with a single gold accent.** The default "luxury" preset. It is the most frequently produced palette in AI-assisted portfolio work.
2. **Playfair Display paired with Inter.** The most common display-and-body pairing produced by generative tools.
3. **Animated shimmer gradient on headline text.** A gold gradient that slides across the type.
4. **Glow shadows everywhere.** Cards carry a fifty-pixel gold bloom on hover, buttons carry a twenty-four-pixel bloom that grows to forty on hover.
5. **Gradient buttons whose background slides on hover.**
6. **Radial ambient glow ellipses** layered into the hero and behind section backgrounds.
7. **Marble veining faked with stacked CSS linear-gradients.** At any size it reads as a gradient artifact, not as stone.
8. **Giant ghost watermark words** such as PORTFOLIO and CAREER set at near-zero opacity behind content.
9. **A centred hero with three stat counters and three call-to-action buttons.** This is the single most recognisable generated-portfolio composition, and it appears on the user's own avoid list.
10. **An emoji favicon.**
11. **Mouse-parallax tilt combined with a twenty-second infinite Ken Burns zoom** on a three-megabyte hero image.
12. **A full-viewport fixed noise grain overlay** sitting above all content.

None of these is individually fatal. Together they form a recognisable signature, and a reviewer who has seen three such sites will recognise the fourth in under five seconds.

---

## 5. Hierarchy, typography, colour, spacing, image presentation, navigation, animation, responsiveness

### Hierarchy — flat

Every section uses identical vertical padding and an identical title scale. In the project grid every card is the same height regardless of the project. The ninety-storey tower occupies exactly the same visual weight as concept sketch "P-550". Nothing on the page tells a visitor what matters most, so the visitor must read everything or nothing.

### Typography — under-exploited

Two families only. The display face appears at effectively two sizes. There is no type scale doing hierarchical work, no small-caps, no tabular figures for the numeric and technical content, and no monospace for codes and metadata, which the content is full of. Body copy runs at 55 to 70 percent opacity on near-black, and several of those combinations fall at or below accessible contrast. Micro-labels set at nine to ten pixels with very wide letter-spacing are hard to read on a phone.

### Colour — one accent, twenty opacities

A single gold is used at roughly twenty different transparency levels to fake variety. There is no secondary colour, no semantic colour, and therefore no way for colour to distinguish design content from technical content, or resolved from outstanding, or one discipline from another. In a portfolio built on coordination, that is a wasted instrument.

### Spacing — uniform

Section padding is constant. Grid gaps are constant. There is no compression before a release, no full-bleed moment, no change of pace. The page has one tempo from top to bottom.

### Image presentation — the single biggest missed opportunity

Every image, without exception, is cropped to the same 256-pixel-tall thumbnail. Photoreal renders, construction site photographs, clash detection screenshots and A1 drawing sheets all receive identical treatment. A drawing sheet at that crop is unreadable, so the most technically impressive material is the material most damaged by the presentation.

Technically:

- No lazy loading attribute anywhere.
- No responsive source sets.
- No width or height attributes, so the grid reflows as images arrive.
- Many source files are two to three megabytes.
- Roughly 1.6 gigabytes of images sit in the public directory.

### Navigation — overloaded

Ten top-level items. Four of them are technical microsites sitting at the same hierarchical level as "Contact". Between 768 and 1024 pixels those ten wide-tracked links crowd the bar. The mobile menu centres ten large items with generous gaps and **has no scroll container**, so on a short viewport the final items cannot be reached at all.

Two nav links are hardcoded to the full Vercel preview domain rather than to a relative path.

### Animation — one gesture, repeated

The same fade-up-and-in appears roughly forty times. Card stagger means the final card in a thirty-two-item grid waits about 1.9 seconds before appearing. Three infinite loops run permanently: hero zoom, shimmer, and marquee. There is **no reduced-motion support anywhere in the codebase**, which is both an accessibility failure and a comfort problem on long scrolls.

### Responsiveness — functional but unconsidered

The grid collapses correctly, but the mobile experience is the desktop experience narrowed. The mobile menu overflow is a real defect. Wide-tracked micro-type does not survive the reduction. Full-size images are served to phones.

---

## 6. Does the site communicate the combined architecture, BIM, technical delivery and site execution strength?

**No. The proportion is inverted.**

The site currently reads roughly seventy percent visual designer and thirty percent technical professional. The strongest and least replicable part of the profile is the part most deeply buried.

| Capability | Current visibility |
|---|---|
| Architectural authorship | Strong. Renders dominate. |
| BIM coordination | One filter tab containing three projects. |
| Technical delivery | Four microsites reachable **only** from the nav bar. Never surfaced in the body of the page. |
| Site execution | One card and one hidden page. |
| ISO 19650 process | A text string. Never demonstrated. |
| BEP, MIDP, TIDP, COBie | Named in copy. Never shown as artifacts. |
| Clash detection | Eighteen images with no account of what was resolved. |
| Authority submissions (Dubai Municipality, Civil Defence, DEWA, Al Sa'fat) | Mentioned in passing. |

A consultancy director scanning for thirty seconds sees a competent render portfolio. They do not see an ISO 19650 certified coordinator who runs federated models and clears authority submissions. That is the gap the redesign must close.

---

## 7. Are the important projects and achievements sufficiently visible?

**No.** The largest credentials are the least visible.

- **Kings' Square.** 151,473 square metres across eight towers, with more than 1,500 clashes resolved. It appears as a single bullet in About, and as a project card mis-titled "Terrace Garden" filed under Interior Presentation.
- **The 240-bed hospital.** Mentioned in the About text. It has **no project card at all**.
- **CAL Capital Tower.** Ninety storeys in Downtown Dubai. One card among thirty-two, same size as everything else.
- **The Anti-Cancer Centre.** Mis-categorised.
- **BERRACHETA Consultancy.** Appears **nowhere in the entire codebase**. Not in the nav, not in the footer, not in About, not in the structured data. The founder status that should be the top of the identity is entirely absent.
- **Saudi Arabia.** Present in the About copy, absent from the hero counter, which says two countries, and absent from the page title, which says UAE and Algeria.

---

## 8. Duplicated, unclear, missing or badly positioned information

### Duplicated

| Item | Detail |
|---|---|
| Project title | Two separate projects are both titled "Villa Youssef B". One is in Algeria with 28 images, one is in Dubai with 50. The Dubai one is tagged Algeria. |
| Availability sentence | "Available for full-time, consulting, and BIM coordination roles worldwide" appears verbatim in both Services and Contact. |
| Contact details | Phone, email and location are printed in both About and Contact. |
| Competition pages | V1 and V2 are both live. The project card links to V1 while the homepage band links to V2. |
| Clash detection images | Eleven images ship as both JPG and PNG. The PNG copies are roughly 24 MB and are never requested. |

### Unclear

- Ten code-only project titles with no location or year.
- "Detaill Surgery Room" carries a spelling error and near-duplicates a separate "Surgery Room" project.
- The hero says two countries while About says three.

### Missing

- BERRACHETA Consultancy, in full.
- Saudi Arabia in the positioning line.
- The 240-bed hospital as a project.
- Any case-study narrative. No project states a problem, a method and an outcome. Every project is a gallery.
- Any dated proof of the ISO 19650 certification as an artifact.

### Badly positioned

- The four technical microsites belong inside the content as evidence, not in the navigation bar as menu items.
- The competition band sits before About, so a first-time visitor meets a park competition before learning who authored it.
- The CV download sits publicly in both Hero and Services, contradicting the admin gate applied elsewhere.

---

## 9. Broken links, buttons, pages, images and mobile layout problems

### Verified working

- The MEP System page loads and its content is intact.
- The external FDG-18 report link resolves.
- All project image paths resolve. The clash detection folder declares eighteen JPGs and all eighteen exist. This was checked individually and is **not** broken.
- The `/3d/` gallery is fully functional. Its page, script and stylesheet all exist and the first-person WASD navigation works.

### Confirmed problems

| Problem | Detail | Severity |
|---|---|---|
| Hardcoded preview domain | Sixteen HTML files and two navigation links hardcode the full Vercel URL. Moving to a BERRACHETA domain breaks all of them. | High |
| Orphan pages | Twelve submission boards, the V2 competition page and the entire 3D gallery have no route in from anywhere. | High |
| Dead ends | The V2 competition page and all twelve board pages offer no back navigation. The visitor must use the browser button. | High |
| Orphan images | `Varian_Halcyon` (27), `FDG18-Cyclotron` (18) and `Site_Construction` (33). Roughly 78 images of real work are invisible to visitors. | High |
| Mobile menu overflow | Ten centred items with no scroll container. Final items unreachable on short viewports. | High |
| Sitemap | Lists the homepage only. None of the twenty technical pages are discoverable by search engines. | High |
| CV privacy conflict | Publicly downloadable from Hero and Services while gated behind admin elsewhere. | High |
| Stale build output | The build config preserves the output directory, so obsolete bundles ship alongside current ones, including a JavaScript file from June. | Medium |
| Filter tab counts | Counts are computed from the static import rather than the live list, so admin-added projects are not counted. | Medium |
| Project order list | Contains thirty entries for thirty-two projects. Two projects are omitted from the ordering. | Medium |
| Keyboard handler | The immersive viewer registers its key listener on every render with no dependency array, and references two functions before their declarations. | Medium |
| Thumbnail strip | Renders every thumbnail with no virtualisation. One project has ninety-two. | Medium |
| Missing Arabic font | The competition title requests a Naskh Arabic face that is never loaded, so it silently falls back. | Medium |
| Password in client bundle | The admin password appears in plain text in a source comment next to its own hash, and ships to every visitor. | Critical |
| No reduced-motion support | Not present anywhere. | Medium |
| Contact form | Opens a mail client rather than sending. On a device with no configured mail client, nothing happens. | Medium |
| Off-palette button | The WhatsApp button uses a green that exists nowhere else in the design system. | Low |

### Conflicting visual identities

Four different design systems are live on the same domain at the same time.

| Surface | Display face | Body face | Accent |
|---|---|---|---|
| Main application | Playfair Display | Inter | `#C9982C` |
| Technical microsites | Cormorant Garamond | Montserrat | `#c9a84c`, `#e2c068`, `#a8872e` |
| Space planning page | Cormorant Garamond | Inter | varies |
| Al Safa V2 | varies | varies | `#B45A3C` terracotta and `#D4AF37` |

A visitor moving from the homepage to the MEP page changes typeface, changes gold, and changes layout logic. It reads as three different people's work.

---

## 10. What makes it memorable, and what prevents it

### Memorable

- The drawing viewer. Pan, zoom and rotate on real sheets is a genuinely distinctive interaction.
- The depth of the technical documentation, once a visitor finds it.
- The bilingual competition submission.
- The simple fact that a working architect publishes room data sheets and MEP coordination references publicly. Very few do.

### Preventing memorability

1. **The visual identity is recognisable as a template**, so the first impression discounts everything after it.
2. **There is no signature element.** Nothing on the site could be screenshot-cropped and identified as yours.
3. **There is no ownable colour.** Black and gold belongs to everyone.
4. **The work is presented as an archive, not as arguments.** Thirty-two cards, no positions taken.
5. **BERRACHETA carries nothing.** There is no brand to remember, only a person's name.
6. **The deepest material is hidden behind navigation links** instead of being staged as the centrepiece.
7. **The site asks to be hired** rather than presenting a practice. The availability line reads as job-seeking, which conflicts directly with founder positioning.

---

# PART 2 — THREE CREATIVE DIRECTIONS

Each direction is developed specifically for the combination of architectural authorship, BIM intelligence, technical accuracy, construction knowledge and Gulf professional credibility. Each avoids every item on the stated avoid list: no purple, blue or pink gradients, no glassmorphism, no glowing cards, no neon borders, no floating blurred circles, no bento grids, no SaaS layouts, no centred hero, no excessive rounding, no decorative 3D, no invented statistics, no generated images, and no imitation of an existing studio's site.

---

## DIRECTION A — TITLE BLOCK

### Concept name
**TITLE BLOCK**

### Strategic idea

The portfolio becomes a controlled document set, presented the way work is actually issued on a project. Sheet codes, revision status, discipline tags, scale bars and a persistent title block. This is not decorative blueprint styling. It is the information discipline of a real title block used as the layout system itself. It dramatises ISO 19650 through structure rather than through claims, which is far more convincing to anyone who works in the field. A visitor who has ever received a drawing package recognises the language immediately, and a visitor who has not still reads it as rigour.

### Colour palette

| Role | Hex | Use |
|---|---|---|
| Drafting paper | `#F1EEE7` | Primary ground |
| Paper shade | `#E3DFD5` | Secondary panels, alternating bands |
| Ink | `#15181B` | Primary text, headings |
| Graphite | `#555B60` | Secondary text, captions |
| Rule line | `#C4C0B6` | All hairlines, table borders, frame |
| Markup oxide | `#B3402A` | Revision clouds, active state, single accent |
| Status approved | `#3E6B4C` | Approved and issued stamps |
| Technical petrol | `#1E4B57` | Technical sections, discipline headers |

The palette is drawn from drafting materials rather than from luxury convention. Oxide red is used exactly as a red pen is used on a check print: sparingly, and only to mark something.

### Typography

- **Archivo** for titles and headings. A grotesque with real presence at large sizes and no decorative character.
- **IBM Plex Sans** for body copy.
- **IBM Plex Mono** for every sheet code, dimension, revision number, date and item of metadata.

The IBM Plex superfamily is authentic engineering-documentation typography, designed for technical settings, and it is effectively unused in AI-generated portfolio work. Tabular figures throughout so numeric columns align.

### Grid and layout logic

A fixed drawing-sheet frame that never moves: a margin border at a constant offset from the viewport edge, and a persistent vertical title block running down the right edge. Inside the frame sits a twelve-column field. The title block updates its contents as the visitor scrolls, always showing where they are: project, discipline, sheet, revision, date.

### Homepage composition

No centred hero. The page opens as a title sheet.

1. One project image at large scale placed inside the field, not full bleed, so the frame stays visible.
2. The name set as a document title at top left, with the role line beneath it in monospace.
3. The title block on the right carrying discipline, location, certification and date.
4. Below the fold, a **drawing index**: every project listed with sheet number, title, discipline, status and sheet count.

That index is the navigation. This turns thirty-two projects from a problem into the feature, because a long, precisely numbered index reads as a body of work rather than as a backlog.

### Project page treatment

Each project becomes a set of sheets the visitor pages through. The title block holds constant project data while the sheet number increments. Drawings receive the full field width with aspect-aware zoom rather than a fixed crop. Renders break out of the frame to full bleed, and the contrast between a framed drawing and an unframed render does the hierarchical work that the current site lacks.

### BIM and technical information presentation

Each project carries a **Coordination Record** block, set as a document:

- Federation diagram showing which models were linked.
- Clash counts by discipline pair, in a monospaced table with tabular figures.
- BEP, MIDP and TIDP presented as document cards with revision status and issue date.
- Authority submission list, stamped per authority: Dubai Municipality, Civil Defence, DEWA, Al Sa'fat.

All populated from real project data only.

### Motion and interaction style

Plotter logic. Lines draw in horizontally. Title block fields set in place in monospace. Sheets slide as if drawn from a drawer. Revision clouds draw their outline once on entry and stop. Everything between 150 and 300 milliseconds, linear or a shallow ease, no bounce, no infinite loops, full reduced-motion support.

### Mobile adaptation

The title block collapses to a fixed bottom bar carrying the current sheet metadata, which keeps the core device intact rather than discarding it. The drawing index becomes the primary screen, which suits a phone far better than a card grid. Drawings open full-screen in the existing immersive viewer, rotated to landscape.

### Advantages

- Unmistakably architectural and impossible to mistake for generated output.
- Foregrounds technical authority without needing to assert it in copy.
- The index format handles thirty-two projects gracefully, and would handle a hundred.
- Exports beautifully to PDF, so the same system serves applications and submissions.
- Light ground dramatically improves image legibility, especially for drawings.

### Potential disadvantages

- A light paper aesthetic reads as less opulent than black and gold, and some Gulf clients expect visible luxury.
- It requires real metadata for every project. Ten projects currently have none, so those must be completed or held back.
- It can feel austere for the interior design and visualisation side of the practice.
- The persistent frame consumes screen area on smaller laptops.

---

## DIRECTION B — RECTO

### Concept name
**RECTO**

### Strategic idea

A bound architectural monograph. Each project is a chapter with an argued narrative rather than a card with a gallery. The site is paced like a printed book: title page, contents, chapters, plates, appendix. The decisive move is that the technical material becomes the **appendix**. In a monograph an appendix is not a hiding place, it is a mark of scholarship, and presenting room data sheets and MEP references as Appendix A through D reframes them from supporting files into evidence of depth.

### Colour palette

| Role | Hex | Use |
|---|---|---|
| Warm black | `#1A1714` | Primary ground |
| Warm panel | `#25211C` | Raised surfaces, chapter openers |
| Paper insert | `#E9E4D9` | Appendix and technical spreads |
| Paper deep | `#D8D1C2` | Secondary paper panels |
| Bone text | `#EFE9DD` | Body text on dark |
| Sienna accent | `#9A5334` | Chapter numbers, rules, single accent |
| Stone secondary | `#8A8579` | Captions, folios, metadata |

**No gold at all.** The sienna continues the terracotta already present in the Al Safa V2 work, which gives the most recent and most current project visual authority over the rest of the site and ties the identity to something authored rather than to a convention.

### Typography

- **Spectral** for display and long-form body. A serif designed for screen reading at length, unlike Playfair which is a display face pressed into body duty.
- **Inter Tight** for metadata, captions and folios.
- **Noto Naskh Arabic** for Arabic titling, properly loaded this time.

Genuine bilingual setting, rather than a fallback, is a real credibility signal in the Gulf and currently the site requests an Arabic face it never loads.

### Grid and layout logic

Asymmetric editorial. Three measures in use: full-bleed for plates, a narrow measure capped near sixty-two characters for reading text, and a thin margin column carrying chapter number and folio. Content shifts left and right between chapters so that scrolling feels like turning pages rather than descending a feed.

### Homepage composition

A title page, not a hero.

1. The name set large and left-aligned, with the role line beneath.
2. One commanding full-bleed plate.
3. A **Contents** list of eight to ten **chapters**, not thirty-two cards.

The chapters group the work by argument: Towers, Healthcare, Coordination, Site, Interiors, Competition. This forces the curation the site currently lacks, and it solves the taxonomy problem at the level of concept rather than by renaming folders.

### Project page treatment

A long-form chapter.

1. Opening plate, full bleed, with chapter number and title over it.
2. A spread pairing narrative text on one side with plates on the other.
3. Drawings presented as numbered figures with captions, which is the correct treatment for a drawing and the opposite of a cropped thumbnail.
4. A closing **colophon** listing role, gross floor area, tools, authorities and dates.

### BIM and technical information presentation

An appendix, set on the light paper ground in tight typographic tables. The four existing microsites become Appendix A through D, numbered and bound into the same object rather than linked away from it. Clash data, federation strategy and authority submissions are set as tables and figures, the way technical content appears in a real monograph.

### Motion and interaction style

Page-turn logic. Plates arrive by mask reveal rather than by fade. Text sets in place without movement, because moving text is a generated-site tell. Chapter transitions are a horizontal shift. No parallax, no tilt, no infinite loops, full reduced-motion support.

### Mobile adaptation

Single column. Chapters stack. The contents list becomes a sticky index. Plates run edge to edge, which is the natural phone treatment. The alternation between dark chapter and light appendix survives the reduction intact and gives the phone experience its rhythm.

### Advantages

- Maximum prestige, and the closest match to the "premium digital architectural monograph" half of the brief.
- Forces the curation that fixes the single biggest content problem.
- Perfectly suited to the render-heavy material, which is the largest part of the archive.
- Genuine bilingual setting reinforces Gulf credibility.
- Sienna is ownable in a field saturated with gold.

### Potential disadvantages

- It demands real writing for each chapter, and only the author can supply that.
- It de-emphasises the "intelligent technical project interface" half of the brief.
- Long-form suits a considered reader more than a recruiter scanning for forty seconds.
- Grouping into chapters necessarily demotes some projects, which is the point but is also a loss.

---

## DIRECTION C — FEDERATED

### Concept name
**FEDERATED**

### Strategic idea

The portfolio behaves like a coordination environment. Work is filtered by discipline, phase, authority and status rather than by folder name. This is not a dashboard and not a SaaS layout. It is an instrument: dense, precise, hairline-ruled, with a signal colour used in exactly the way a clash highlight is used in a federated model. The visitor operates it rather than scrolls it, and the act of operating it is itself the demonstration of BIM intelligence.

### Colour palette

| Role | Hex | Use |
|---|---|---|
| Ground | `#0E1112` | Primary background |
| Panel | `#161A1C` | Panels, rails |
| Panel raised | `#1E2426` | Active and selected surfaces |
| Rule | `#2C3336` | One-pixel rules, table borders |
| Text | `#D9DEDF` | Primary text |
| Muted | `#7B888C` | Secondary text, labels |
| Signal | `#E44E2E` | Clash, active filter, alert |
| Resolved | `#3E8F6A` | Resolved, approved, issued |

**Discipline legend**, functional rather than decorative:

| Discipline | Hex |
|---|---|
| Architecture | `#D9DEDF` |
| Structure | `#7E90A3` |
| MEP | `#D9992B` |
| Landscape | `#7C8F5A` |

Colour carries meaning here, which is precisely what justifies using more than one accent. Every colour on the page is doing a job.

### Typography

- **Archivo** for headings.
- **IBM Plex Mono** for all data, labels, codes and values.

No serif anywhere. Tabular figures throughout. The absence of a serif is itself a statement, because a serif is what every architecture portfolio reaches for.

### Grid and layout logic

Fixed instrument chrome.

- A left rail carrying discipline and phase filters, behaving like a model tree.
- A central viewport holding the current content.
- A right metadata panel that updates with the current selection.

A sixteen-column dense grid. One-pixel rules. Corner radius never above two pixels. **No shadows at all.** Depth is created by value steps between panel levels, which is how real technical software creates depth and is the direct opposite of glassmorphism and glow.

### Homepage composition

Not a hero. A state.

1. One full-bleed project image held at reduced value.
2. A thin data band across it carrying name, role, certification and location.
3. The live discipline legend.
4. Immediately below, the **project register**: a dense, sortable grid with columns for discipline, phase, authority, scale and sheet count.

Filter chips are the real navigation. A visitor who clicks "MEP" and "Construction Stage" and sees the register resolve has understood the professional profile without reading a bio.

### Project page treatment

Split view. The existing immersive viewer occupies the main area, with the metadata panel alongside. Tabs switch **layers** on the same project:

| Layer | Content |
|---|---|
| Design | Renders, concept, plans |
| Coordination | Federation, clash data, model strategy |
| Authority | Submission drawings, stamps, approvals |
| Site | Construction photography, site records |

This is the strongest single idea across all three directions, because it makes the four-way capability legible **on every project** rather than in a bio paragraph. A visitor sees that the same person authored the design, coordinated the models, cleared the authority and supervised the site. That is the entire positioning, expressed as an interface rather than as a claim.

### BIM and technical information presentation

Native to this direction rather than added to it.

- Clash matrix by discipline pair.
- Federation tree showing linked models.
- BEP, MIDP and TIDP as document records with revision state.
- Authority tracker across Dubai Municipality, Civil Defence, DEWA and Al Sa'fat.

All populated from real project data only. Nothing invented.

### Motion and interaction style

Instrument behaviour. Panels slide. Filters snap. Values tick to their number rather than counting up theatrically. Crossfades under 180 milliseconds. **No scroll-triggered fade-ups at all**, which is in itself the sharpest possible break from the current site and from generated portfolios generally. Full reduced-motion support.

### Mobile adaptation

Rails collapse into a bottom sheet. Filters become a horizontal scroller pinned above the register. The four layer tabs remain, because they are the core idea and must survive every breakpoint. Records stack while keeping their labels in monospace, so density becomes legibility rather than clutter.

### Advantages

- The clearest possible statement of BIM intelligence and technical accuracy.
- Scales effortlessly to thirty-two projects and would scale to three hundred.
- Absorbs the four orphaned microsites as layers rather than as navigation items, which solves the burial problem structurally.
- The layer system fixes the taxonomy problem without requiring the categories to be rewritten.
- Zero overlap with any generated-portfolio convention.

### Potential disadvantages

- Risks reading cold to design-led interior and residential clients.
- The heaviest of the three to build.
- Requires real metadata per project, and several projects currently lack it.
- Density demands careful typographic control or it becomes fatiguing.

---

# RECOMMENDATION

The brief describes a premium digital architectural monograph combined with an intelligent technical project interface. That is literally **B plus C**.

The recommended route is **FEDERATED as the spine, with RECTO's chapter treatment applied to six flagship projects**. Kings' Square, CAL Capital Tower, the Anti-Cancer Centre, the 240-bed hospital, the Al Safa competition and one signature interior receive authored narrative chapters. The remaining twenty-six stay in the register, where density is an asset rather than a liability.

TITLE BLOCK is the most distinctive single idea of the three, but it is the hardest to sustain across the interior and visualisation work.

---

# CONTENT FIXES REQUIRED REGARDLESS OF DIRECTION

These are independent of styling and must happen whichever direction is chosen.

1. Rebuild the taxonomy around professional narrative rather than source folder names.
2. Surface BERRACHETA Consultancy across the site, the footer, the structured data and the metadata.
3. Correct the country count to three, and add Saudi Arabia to the positioning line.
4. Promote Kings' Square to flagship status and correct its title and category.
5. Add the 240-bed hospital as a project.
6. Give the ten code-only projects real titles, locations and years, or hold them back.
7. Resolve the duplicate Villa Youssef B titles and the Algeria and Dubai tag conflict.
8. Remove the password comment from the source, and move the admin gate off the client.
9. Decide the CV policy once and apply it consistently in every location.
10. Replace all hardcoded Vercel URLs with relative paths before any domain move.
11. Link or retire the twelve board pages, the V2 competition page and the 3D gallery.
12. Surface the 78 orphaned images or remove the folders.
13. Expand the sitemap to cover all twenty technical pages.
14. Retire one of the two competition pages and point all links at the survivor.
15. Unify the four conflicting visual identities into one system.
16. Add reduced-motion support, lazy loading, image dimensions and responsive sources.
17. Remove the dead components, the unused 3D dependency and the empty video data files.
18. Delete the redundant PNG duplicates in the clash detection folder.
19. Fix the mobile menu overflow, the filter tab counts and the two missing entries in the project order.
20. Rewrite the availability line so it reads as a practice, not as a job search.

---

**End of audit.** No code has been written and no files have been modified. Awaiting approval of one direction before any design or implementation work begins.
