# Chronos Atlas v2 — Cursor Implementation Plan

> Hand this whole file to Cursor. Repo: `~/World Hist Timeline` (Vite + React 19 + TypeScript). Remote: `origin → github.com/Kevinmeier211/world-history-timeline`. No CI exists; do not add any (see §11).

## 0. TL;DR (read this first)

**Goal.** Turn Gemini's "Chronos Atlas" from a generic dashboard-with-bars into a faithful, richer, interactive descendant of the UsefulCharts *Timeline of World History* poster: one continuous, parchment-toned field where **colored lineage rivers flow top-to-bottom through 5,300 years, fork and merge, and fan out into ~60 modern nations**, studded with real artifact/portrait thumbnails and tiny annotations — then make it interactive (zoom, lineage focus, search, dossier, scrubber, tours) and exportable to print.

**What is wrong today (one line each).**
1. It is not a river chart: polities are fat capsules in 11 rigid columns; only parent→child links under 280 px are drawn; nothing really forks, merges, or drifts across the map.
2. It is thin: 69 polities, 58 callouts, 0 images, 3 tours. The poster has ~300 labeled entities, ~100 annotations, ~30 illustrations. The modern era (the poster's best part — the 60-nation fan-out) is nearly empty.
3. Chrome dominates: 3 toolbars + a dossier open by default + floating map + bottom cards leave ~35% of a laptop screen for the chart; the full chart is never visible at once (canvas is 2,199 px wide × 2,480 px tall at 65% zoom).
4. Wrong mood: neon dark default and "app" styling vs. the poster's warm parchment/cartographic character.
5. Labels clip and collide; callout cards sit on top of ribbons (PLAN.md promised `rbush` collision handling; it was never installed).
6. No sources, no confidence, no dates policy — unlike Gemini's PDF, which at least had 37 sources and a reading key.

**The fix, in one sentence.** Replace the render/layout core with a **data-driven lineage-river layout engine**, rebuild the data as a **sourced, validated roster of ~300 polities + relations + callouts + curated images**, restyle to a **poster-faithful design system**, and keep/extend Gemini's good interactive ideas (lenses, scrubber, tours, ⌘K) on top.

**Build order** (each phase ends with a local, demonstrable result): P0 baseline → P1 data model + validation → P2 layout engine → P3 poster renderer → P4 callouts + images → P5 interactions → P6 content depth (era passes) → P7 print/export → P8 optional map/prehistory/deploy.

**Built for long unattended runs (~60–70 agent-hours).** Cursor should *not* work from §0–§12 alone. The operating manual is **§13 (autonomous run protocol)**; the executable work queue is **Appendix E (≈150 atomic tasks, each with a "done when" check)**; numeric constants and pseudocode are in **Appendix G**; test fixtures in **Appendix H**; file templates (`PROGRESS.md`, `RUN_CONFIG.md`, …) in **Appendix I**; the always-on Cursor rule file in **Appendix F**. Approvals that must not be assumed (image downloads, push, deploy) are **off by default** and switched on by Kevin in one file, `docs/RUN_CONFIG.md`; gated steps are queued and the run continues. **Start with T0.01 and keep going until the backlog (or `MAX_PHASE`) is done.**

---

## 1. Context

- **Inspiration:** UsefulCharts "Timeline of World History" (Matt Baker, PhD). Saved reference image: `docs/reference/usefulcharts-poster.webp` (copy it in as step P0.3). **Reference only — do not trace, copy, or re-use its artwork, text, or layout coordinates.** Everything we ship (data, prose, images) is independently sourced.
- **Gemini artifacts reviewed:**
  - `src/**` + `PLAN.md` — the Chronos Atlas web app (single commit `14b5965`, ~11k lines).
  - `World_History_Timeline_8x11.pdf` — one-page print poster (7 macro-regions, ~100 pill-shaped bars, no branching).
  - `World_History_Timeline_Expanded_8x11.pdf` — 8 pages: 5 era×region reference tables ("why it matters", "three connections to remember"), a reading key, 37 numbered sources. Copy both PDFs into `docs/reference/gemini/`.
- **Owner preferences that bind this plan:** accuracy and verifiable dates over decoration; direct, scannable communication; finish the named job; reuse existing files before inventing new systems; no unrequested deploys.

---

## 2. Review findings

### 2.1 Anatomy of the poster — what actually makes it work (the spec we are matching)
1. **X = geography, Y = time, color = lineage.** Columns run roughly west→east (Americas → Africa/Europe/Middle East → South Asia → East Asia/Oceania). A ribbon keeps its family color as it ages (Rome purple → Franks → HRE → France/Spain/Britain all purple), so you can *see* descent.
2. **Rivers, not boxes.** Ribbons are vertical, rounded, with rotated labels inside. They **split** (Roman Empire → Western/Eastern), **merge**, **drift sideways** (Mongols, Caliphates, Ottomans spanning columns), and **fan out** at the bottom into ~60 modern states labeled at the 2000 CE edge.
3. **Width = prominence** (Roman Empire, Han, Ottoman are wide; minor cultures are hairlines).
4. **Layered annotation:** (a) six era bands (Early Bronze → Modern) as horizontal gray rules with rotated labels at the left; (b) cross-cutting shaded bands ("4.2 kiloyear event", "Greek Dark Ages", "Western European Dark Ages", "Islamic Golden Age", "Axial Age", "Hellenism", "Black Death", "Reformation", "Enlightenment", "Industrial Revolution", "World Wars", "Cold War"); (c) dashed migration/trade arcs ("Silk Road", "Early trade routes"); (d) tiny two-line annotations attached to ribbons.
5. **Images as punctuation:** ~30 small, consistent thumbnails (pyramids, Stonehenge, Olmec head, Augustus, Dome of the Rock, samurai, astronaut…) that anchor the eye and signal "this is the era of …".
6. **Scale discipline:** near-uniform vertical scale (100-year grid, 50 later), faint horizontal grid, a legible left year axis, a title band. The *whole* thing can be taken in at one glance, then explored in detail.
7. **Mood:** warm sepia map-paper background with faint continent watermark, deep brown frame, condensed bold sans labels.

### 2.2 Chronos Atlas v1 (Gemini web app) — diagnosis
| Area | Finding | Evidence |
|---|---|---|
| Layout model | Discrete `RegionId` columns; each `PolitySpan` is a rectangle with a `laneOffset`. No continuous x, no keyframed drift. | `types/history.ts`, `TimelineCanvas.tsx:171-200` |
| Ribbon shape | `buildVerticalRibbonPath` = capsule with straight sides; width constant per span → "bars". | `utils/timeLayout.ts:119-149` |
| Lineage | `parentIds/childIds` arrays; Sankey link drawn only if gap < 280 px and picks first matching span; no relation types, no flow-width conservation. | `TimelineCanvas.tsx:240-290` |
| Multi-region empires | A flat rectangle "bridge" between spans' x-centers at 36% opacity — reads as a glitch, not an empire. | `TimelineCanvas.tsx:203-238, 612-639` |
| Scale | "Poster Warped" piecewise px/yr (0.42–1.45) distorts the very proportions the poster preserves; ends 2025 not 2000. | `timeLayout.ts:14-22` |
| Overview | No fit-to-screen. Native scroll; canvas 2,199×2,480 px at 65%. Minimap promised, absent. | live check |
| Collisions | Callouts are absolutely positioned at `colLeft + 0.52·colWidth`; no collision logic; labels clip. `rbush` not in `package.json`. | live check |
| Content | 38 + 31 = 69 polities; 58 nodes (40 tier-1, 18 tier-2, **0 tier-3**), 11 bands, 9 routes, 16 presets, **3 tours**, 0 images, 0 sources. Modern states absent. | `grep` counts |
| Map | Hand-drawn blob polygons, not geography. | `WorldMapPanel.tsx:182-192` |
| Network | Dossier fetches Wikipedia REST live — fine as enhancement, wrong as the only source of imagery/summary. | `DossierDrawer.tsx:75` |
| Chrome | Dark theme default; top bar (2 rows) + lens/zoom row + bottom transport + bottom 11-card snapshot strip + open drawer + floating atlas. | live check |
| Hygiene | `tsconfig.tsbuildinfo` committed; no tests, no lint, no data validation. | `git ls-files` |
| Motion | Perpetually animated dashed route lines (`animated-route-line`) — noise. | `TimelineCanvas.tsx:790` |

**Keep:** Vite/React/TS stack; `types` vocabulary for lenses/tours/presets as a starting point; ⌘K search concept; scrubber + "World in Year X" idea; lineage-dimming on hover; Story Mode concept; localStorage custom nodes; light/dark toggle mechanism; `formatYear` helpers.

### 2.3 Gemini PDFs — what to keep, what to drop
- **Keep (content/ethos):** the **reading key** ("peoples outlast states", ancient-date uncertainty, multiple endpoints for Safavid/Mughal/Ottoman/Rome, "c." policy, no year 0); the **37-source bibliography** (Met Essays, UNESCO, Yale eHRAF, Smithsonian NMAI, Cambridge/Oxford handbooks, etc.) as the *seed* bibliography; the per-era/per-region **"why it matters"** sentences and **"three connections to remember"** as data (`EraRegionNote`, tour seeds); the idea that every claim carries a source id.
- **Drop:** pill boxes with no connecting flow; tiny low-contrast type; the claim that "no connecting line is intended to assert descent" (we will instead draw *typed* relations and be honest about which are succession, conquest, cultural continuity, or disputed — see §6.3); the "8 × 11" sizing (US Letter is 8.5 × 11; poster targets are in §9 P7).
- **Generate, don't hand-maintain:** the Expanded Reference pages should become an *export of the same dataset* (P7), not a separate artifact.

---

## 3. Product definition

**One dataset → four views**
1. **Interactive Atlas** (primary): the poster, alive.
2. **Poster print export** (vector PDF at Letter, Tabloid 11×17, and 24×36).
3. **Reference Tables**: generated era×region pages with sources (Gemini's Expanded PDF, regenerated from data).
4. **Accessible Table/Outline view**: the same data as searchable lists (a11y and SEO fallback).

**Non-goals (for now):** user accounts, backend, AI-generated prose at runtime, 3D globe, prehistory before 3300 BCE (optional P8), editing UI beyond the existing custom-milestone feature.

---

## 4. Design principles (new — Cursor must follow these)

**4.1 Poster-first.** The chart is the product. At rest, chrome ≤ **12% of viewport area**: one slim top bar (title · search · lens · view · theme). Everything else (dossier, map, snapshot strip, layers panel) is **closed by default** and opens on demand. The default view is **fit-to-width, whole timeline visible by scrolling vertically**, with an **Overview** button/minimap that shows all 5,300 years at once.

**4.2 Parchment cartographic light is the default.** Dark mode ("night atlas") is a secondary theme, not the hero. Tokens (CSS custom properties on `:root`; dark overrides under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`):

| Token | Light (default) | Dark |
|---|---|---|
| `--paper` | `#F1E8D2` | `#14161B` |
| `--paper-shade` (era bands) | `#E6DBC0` | `#1B1E25` |
| `--ink` | `#2A241C` | `#E9E3D3` |
| `--ink-muted` | `#6B6154` | `#A59F90` |
| `--rule` | `#CDBF9F` | `#2A2E37` |
| `--frame` | `#4A4234` (outer poster border) | `#0B0C10` |
| `--focus` | `#B4531F` | `#F2A65A` |
Ribbon fills come from the **lineage palette** (App. A). No neon, no pure black/white, no default drop shadows.

**4.3 Color encodes lineage, not region.** A polity inherits its `family` color; siblings vary lightness ±6–10% so splits are visible; successors keep hue. Rules: (a) neighboring ribbons must differ by ΔE ≥ 12 at the same y; (b) palette must pass deuteranopia/protanopia simulation (script in P3); (c) color is never the only cue — uncertainty, disputed relations, and imports use **pattern/dash**, not hue; (d) label text color auto-selected (ink or paper) by contrast ≥ 4.5:1 against its ribbon.

**4.4 Ribbon form language.** Rounded caps (radius = min(width/2, 10px)); 1px edge in fill darkened 18%; width follows an optional **`widthProfile`** (swells at peak, tapers in decline) — *not* a constant capsule; uncertain beginnings use a **gradient-fade cap + dashed edge** (reuse v1's `uncertaintyYears` idea); flows/connectors are the same hue at 55% alpha, no stroke; trade/migration arcs are 1.5px dashed hairlines (static, not animated, unless the Trade lens is active and the user hovers).

**4.5 Typography (self-hosted via `@fontsource`, no runtime Google Fonts).**
- Title/era names: **Barlow Condensed 700–800**, caps, tracked +2%.
- Ribbon & callout labels: **Barlow Condensed 600** (narrow letterforms fit vertical text).
- Body/dossier/UI: **Source Sans 3** (400/600). Dossier headings: **Source Serif 4** (600).
- **Minimum sizes at default zoom:** ribbon label ≥ 10 px, axis ticks ≥ 10 px, callouts ≥ 11 px, UI ≥ 13 px. In print: ≥ 6 pt at 24×36, ≥ 5 pt only for tertiary annotations.
- Label fitting: measure text (cached `canvas.measureText`); choose horizontal vs rotated; shrink to min size; else **truncate with ellipsis at a word boundary**; else drop to a hover label. Never clip mid-glyph.

**4.6 Hierarchy by importance (1–5).** Every ribbon, callout, image, and band has `importance`. At a given zoom, an element is drawn only if `importance ≥ threshold(zoom)`; ribbon width is a function of `weight` *and* importance; label size steps 10/11/12/13/15 px. Importance is a data field curated by hand, not computed from page views.

**4.7 Density & rhythm.** 8-px base grid; min 6 px gap between neighboring ribbons; min 4 px between any label box and any other box; hairline leader lines (0.75px); callouts never overlap a ribbon *label* (they may overlap ribbon *bodies* only when a leader line makes ownership clear). Whitespace is allowed — the top of the chart is intentionally sparse.

**4.8 Z-order (back → front).** paper → watermark map → era bands → gridlines → epoch/cross-cutting bands → connectors → ribbons → ribbon labels → trade/migration arcs → callouts + images → crosshair/scrubber → UI.

**4.9 Era bands & axis.** Six era bands (Early Bronze, Bronze, Iron, Classical Antiquity, Middle Ages, Modern) as full-width slightly darker bands with rotated labels in **both** left and right gutters; ticks every 100 yrs (minor 50, labeled at zoom-in); left axis uses **BCE/CE** with no year 0; **linear time scale by default** (poster-faithful). "Compress antiquity" is an optional toggle, labeled clearly. Default range 3300 BCE – **2000 CE**; a toggle extends to the present.

**4.10 Motion.** Purposeful only: inertial pan/zoom, 200 ms ease-out lineage focus, `flyTo` ≤ 600 ms; respect `prefers-reduced-motion` (no fly, no fades — instant). No looping animations.

**4.11 Interaction affordances.** Hover = lineage focus (non-lineage ribbons to 25% opacity) + tooltip with name, dates (with "c."), confidence glyph. Click = open dossier. Click on empty paper = clear selection. Focus ring uses `--focus` (2 px, offset 2 px). Touch: tap = select, long-press = tooltip, two-finger pinch = zoom.

**4.12 Responsive & accessible.** Desktop-first, usable at 390 px: on narrow screens the dossier is a bottom sheet, toolbar collapses to icon row, and an **"Era reading mode"** lists the current era's polities as cards. WCAG AA contrast; every ribbon/callout is a focusable element with `aria-label` ("Roman Empire, 27 BCE to 476 CE, Latin West"); tab order = time then x; a full **Table view** mirrors the data; text scales with browser zoom.

**4.13 Print design.** Same tokens; vector; 0.25 pt min stroke; 0.5 in safe margin, 0.125 in bleed for 24×36; embedded fonts; images ≥ 300 dpi at final size.

**4.14 Legend & "How to read this" (always one click away).** Explains: ribbon width = relative prominence (not exact area); color = lineage family; gradient/dashed tops = uncertain beginnings; dashed connectors = disputed/cultural continuity; "c." = approximate; "peoples outlast states." Adapt Gemini's reading key wording.

**4.15 Anti-patterns to remove (these are why v1 looks bad).** Neon dark default · capsule blocks of constant width · clipped vertical text · cards floating over ribbons · icon badges standing in for images · five simultaneous UI surfaces · perpetual animation · distorted time scale · region color confused with lineage color · prose without sources.

---

## 5. Image principles (new — Cursor must follow these)

**5.1 Purpose.** Images are **evidence and wayfinding, not decoration.** Each teaches one thing: a characteristic artifact (Olmec colossal head, cuneiform tablet, Terracotta Army), a face (ruler portrait/coin/bust), or a monument/building. Target **60 images at end of P4 → 120+ by P6.** Density cap: ≤ 1 image per ~160 px of vertical space per column at default zoom; at overview only importance-5 images show.

**5.2 Licensing (hard rule).** Allowed: **CC0 / Public Domain (including PD-Art 2D reproductions)** from Met Open Access, Smithsonian Open Access, Rijksmuseum, Cleveland Museum of Art, National Gallery of Art, Getty Open Content, Wikimedia Commons (PD/CC0 only). CC BY / CC BY-SA **only** with an explicit decision recorded in `media.json` (`licenseApproved: true`) because attribution and share-alike affect the print poster. **Never:** images from the UsefulCharts poster, search-engine scraping, NC/ND licenses, unlicensed museum websites, AI-generated "historical" images, or stock photos.
Each record stores: source URL, creator, object title, date, institution/accession, license + license URL, retrieved date, and file hash. A generated **Credits** page and the print colophon read from this file. Build fails if any shipped image lacks it.

**5.3 Authenticity & captions.** Real objects, photographs, or contemporaneous artworks only. **Captions name object · culture · date · holding institution** ("Colossal Head 4, Olmec, c. 1200–900 BCE, San Lorenzo; Museo de Antropología de Xalapa"). When an image is a *later or idealized* depiction (e.g., a 14th-century portrait of Genghis Khan, a 19th-c. Napoleon painting) the caption says so. No imaginative reconstructions unless captioned "reconstruction" with its basis. Alt text required (validated), written to describe content, not repeat the caption.

**5.4 Sensitivity & representation.** Balance the geography: non-European history should be represented by **objects made by those cultures**, not by colonial-era photography or exoticizing images; avoid human remains and sacred/restricted objects; avoid depicting the Prophet Muhammad — represent the Islamic world through architecture (Dome of the Rock), manuscripts, calligraphy, astrolabes, coins. Prefer images of *things people made* over battles and gore.

**5.5 Visual consistency ("museum plate" treatment).** All images pass through one pipeline so they feel like one set: uniform crops (**1:1** objects, **4:5** portraits, **3:2** monuments; focal point stored in data), −15% saturation, +20% warm tint, subtle paper-grain multiply, 1 px ink frame, 2 px radius; **cut-outs only** for free-standing objects and only with hand-checked masks (no automatic background removal artifacts). Sizes: thumbnail 56–72 px on chart; hero 160 px on hover; dossier 640 px. Optional global "engraving" CSS filter mode for a more graphic look.

**5.6 Technical pipeline.** `scripts/media/` downloads originals from `media-src.json` (URL + sha256), caches to a **gitignored** `media-cache/`, processes with `sharp` to **AVIF + WebP at 128 / 320 / 960 px**, emits dominant color for blur-up, writes `src/data/media.generated.json`. **Only processed derivatives are committed.** Budgets: chart-time payload for thumbnails ≤ **1.2 MB total**; each thumbnail ≤ 10 KB; lazy-load by viewport (`loading="lazy"`, `decoding="async"`, explicit `width/height`); SVG `<image>` for in-chart plates. **No hotlinking at runtime.** Downloading source files is a separate, user-approved step (see §11).

**5.7 Placement.** Images attach to a ribbon or callout with a hairline leader; placement is collision-aware (same R-tree as labels); images prefer the ribbon's *free side*, never cover ribbon labels, and shrink/hide by importance as zoom changes. Print: ≥ 300 dpi at final size (a 1.1″ thumbnail on 24×36 needs ≥ 330 px source → keep the 320 px derivative minimum and a 960 px for heroes).

**5.8 Fallbacks.** If no license-clean image exists for an entity: use a **single consistent in-house line-pictogram set** (SVG, 1.5 px stroke, drawn once: pyramid, ziggurat, temple, ship, scroll, coin, crown, etc.), never emoji and never a random photo. v1's Lucide category badges are replaced by this set.

**5.9 Reference caution.** Do not recreate the poster's specific illustrations (e.g., its Augustus, Mao, Queen Elizabeth, astronaut). Choose our own subjects from the roster in App. B and source them ourselves.

---

## 6. Architecture

### 6.1 Stack (additions in **bold**)
Vite 6 · React 19 · TypeScript 5.8 (strict) · **zustand** (state) · **zod** (data schemas) · **rbush** (collision/spatial index) · **d3-scale / d3-shape / d3-zoom** (math + camera; no d3 DOM) · **@fontsource/** fonts · **sharp** (media script, dev only) · **Vitest** + **@testing-library/react** · **Playwright** (local screenshots only) · **ESLint + Prettier**. **Do not** add Next.js or any server; the app stays static.

### 6.2 Repo layout
```
src/
  data/
    schema/            zod schemas + TS types (single source of truth)
    families.json      lineage families + palette
    geography.json     x-axis mapping, macro-regions, column guides
    polities/          one JSON per family: latin-west.json, chinese.json, …
    relations/         edges (succession, split, merge, conquest, …)
    callouts/          events/people/inventions/monuments per era
    bands/             eras, epochs, cross-cutting, climate, pandemics
    routes/            trade/migration arcs
    notes/             EraRegionNote (Gemini "why it matters" content)
    sources.json       bibliography (seed from Gemini [1]–[37])
    media.json         image manifest (license, credit, focal point)
    tours/             story tours
  layout/              PURE functions: no React, no DOM
    projectX.ts  laneSolver.ts  ribbonGeometry.ts  connectors.ts
    labelFit.ts  calloutPlacer.ts  lod.ts  index.ts
  render/              SVG components (Ribbon, Connector, Label, Callout, Plate, Bands, Axis…)
  camera/              pan/zoom/flyTo, minimap, hash-state
  state/               zustand store, URL (hash) serializer
  ui/                  TopBar, LayersPanel, Dossier, Search, SnapshotStrip, Legend, Tours, TableView
  styles/              tokens.css, chart.css, ui.css
scripts/
  validate-data.ts  layout-report.ts  media/…  export-pdf.ts
docs/
  reference/ (poster + Gemini PDFs)   DATA_PROTOCOL.md   DESIGN.md   CREDITS (generated)
```

### 6.3 Data model (replaces v1 `types/history.ts`; keep v1 names where sensible)
```ts
type Confidence = 'secure' | 'conventional' | 'approximate' | 'debated';
type RelationType = 'succession' | 'split' | 'merge' | 'conquest' | 'vassalage' | 'cultural_continuity' | 'migration' | 'disputed';

interface Family { id: string; name: string; color: string; macroRegion: MacroRegion; }

interface Polity {
  id: string; name: string; altNames?: string[];
  family: string;                 // color inheritance
  start: number; end: number;     // astronomical-ish ints; BCE negative; no year 0 in display
  startUncertainty?: number; endUncertainty?: number;   // years, drives fuzzy caps
  confidence: Confidence; dateNote?: string;            // e.g. "traditional date", "Xin interlude 9–23 CE"
  importance: 1|2|3|4|5;
  weight: number;                                       // 0.1–1: width prominence
  kind: 'state'|'culture'|'period'|'empire'|'confederation'|'people';
  anchor: AnchorKey[];            // keyframed geography: [{year, geo:[lon,lat] | xKey}] → poster-x
  widthProfile?: {year:number; w:number}[];
  spans?: MultiRegionSpan[];      // for empires covering several geographic zones
  summary: string; keyFacts: string[]; sourceIds: string[];
  rulers?: {name:string; reign:string; title?:string}[];
  wikipediaTitle?: string; mediaId?: string;
}
interface Relation { id:string; from:string[]; to:string[]; year:number; type:RelationType;
  share?: number[];               // flow-width split among targets (sums ≤ 1)
  note?: string; sourceIds:string[]; confidence: Confidence; }
interface Callout { id:string; title:string; year:number; endYear?:number; kind:'event'|'person'|'invention'|'monument'|'text'|'climate'|'trade';
  attachTo?: string /*polityId*/; geo?: [number,number]; importance:1|2|3|4|5;
  blurb:string /*≤ 14 words*/; mediaId?:string; sourceIds:string[]; confidence:Confidence; }
interface Band { id:string; title:string; start:number; end:number; scope:'global'|MacroRegion[]; type:'era'|'epoch'|'climate'|'pandemic'|'collapse'|'golden_age'|'war'; importance:1|2|3|4|5; description:string; sourceIds:string[]; }
interface Source { id:string; title:string; publisher:string; url:string; accessedISO:string; kind:'museum'|'university'|'handbook'|'govt'|'encyclopedia'; }
interface MediaItem { id:string; src:string; credit:{creator:string; title:string; date:string; institution:string; accession?:string};
  license:'CC0'|'PD'|'CC-BY'|'CC-BY-SA'; licenseUrl:string; licenseApproved:boolean; retrieved:string; sha256:string;
  crop:{ratio:'1:1'|'4:5'|'3:2'; focal:[number,number]; cutout?:boolean}; alt:string; caption:string; depiction:'contemporary'|'later'|'reconstruction'|'photo'; }
interface EraRegionNote { eraId:string; macroRegion:MacroRegion; entries:{range:string; text:string; sourceIds:string[]}[]; whyItMatters:string; connections?:string[]; }
```
**Date policy (from Gemini's reading key, tightened):** `c.` iff `confidence ≠ 'secure'`; conventional/traditional dates carry `dateNote`; multiple endpoints are modeled as separate `endpoints` notes, not silently chosen (Safavid 1722/1736; Mughal 1707/1857; Ottoman 1299–1922; Rome 476/1453). Years are integers; display helper outputs "1 CE" after "1 BCE" (no year 0).

**Validation (`npm run validate:data`, must pass before every commit):** schema parse · all ids unique · all relation endpoints exist · `start < end` · relation year lies within endpoints' lifetimes ± tolerance · every polity/relation/callout has ≥ 1 `sourceId` that exists · `importance` and `confidence` present · every `mediaId` exists and has license + alt + caption · no `CC-BY*` unless `licenseApproved` · summaries ≤ 60 words, callout blurbs ≤ 14 words · warn on > 25% family color duplication in adjacent lanes · report coverage counts per era/region.

### 6.4 Layout engine (`src/layout/`, pure & unit-tested) — the heart of the upgrade
**Inputs:** polities, relations, geography mapping, viewport zoom, visible families/regions.
1. **projectX** — map each polity's keyframed anchor to a poster-x in `[0,1]` via a hand-tuned monotone piecewise mapping of longitude (so Europe/Med/Middle East aren't squashed and the Pacific isn't wasted): Americas −120…−30 → 0–0.18; Atlantic gap compressed; Africa/Europe/W. Asia −20…60 → 0.20–0.62; South Asia 60…95 → 0.62–0.74; East Asia/Pacific 95…180 → 0.74–1.0. Per-family `xBias` and per-polity manual `xOverride` keyframes supported (hand-tuning will always be needed).
2. **Time slices** — collect all start/end/relation years; between consecutive event years the active set is constant.
3. **laneSolver** — for each slice, order active ribbons by desired x (stable w.r.t. previous slice to avoid crossings), then resolve overlaps with 1-D iterative relaxation: min separation = (wᵢ+wⱼ)/2 + gap; clamp per-slice drift to `maxDriftPxPerPx` (≈0.35) so ribbons slant gently; weight-aware (heavier ribbons move less). Add hysteresis (spring to previous x) to avoid jitter. Output `x(y)` keyframes per ribbon.
4. **ribbonGeometry** — monotone cubic spline through keyframes; width from `widthProfile`; emit left/right edge polylines → smooth closed path with rounded caps and gradient-fade caps for uncertain starts.
5. **connectors** — for each Relation: fan-in/fan-out S-curves (cubic Béziers) whose widths follow `share` (flow conservation: Σ child widths ≤ parent end-width); style by `type` (solid for succession/split; hatched for conquest/vassalage; dashed for cultural continuity/disputed).
6. **labelFit** — measure text; pick rotation; shrink/truncate; mark `fitted=false` for hover-only labels.
7. **calloutPlacer** — candidate slots (right/left of ribbon, N/S offsets) scored by distance, collision (rbush), importance; greedy by descending importance; leader lines; images share the placer.
8. **lod** — `threshold(zoom)` for importance; sub-ribbons collapse into parent at overview (e.g., individual Chinese dynasties → "Imperial China") with smooth cross-fade.
**Outputs:** serializable `LayoutResult` (paths, label boxes, callout boxes, z-bands) so it can be cached, unit-tested, snapshot-tested, and reused by the PDF exporter.
**Quality metrics (exposed by `scripts/layout-report.ts`):** ribbon overlap count (must be 0), min gap, % labels fitted by importance tier, # callouts dropped, # relations unroutable, max drift, runtime (< 150 ms for 300 ribbons).
**Escape hatch:** `layoutOverrides.json` (pin x, force label orientation, nudge callouts) — auto layout proposes, humans finalize. A dev-only `?debug=layout` overlay draws lanes, boxes, and violations.

### 6.5 Rendering & camera
- **SVG** for ribbons/connectors/labels/bands (≈300 ribbons is comfortable); **virtualize by viewport** (draw only elements intersecting the visible y-range ±1 screen); no per-ribbon React re-render on hover (use CSS classes + a lineage-focus store selector).
- Custom camera (d3-zoom math): wheel/pinch zoom **anchored at pointer**, drag-pan with inertia, `fit()` and `flyTo({year, x, zoom})`, clamp to content; keyboard (+/−, arrows, Home/End, `/`, ⌘K).
- Zoom model: **y-zoom** (time) and **x-zoom** (column width) linked by default, independent with Shift. Overview minimap (bottom-left, 120 px wide) draws a low-fidelity layout render with a viewport rectangle.
- Fonts/images load lazily; the layout never depends on image load (reserve boxes).

### 6.6 State & URL
`zustand` store: camera, selection, lens, visible families, theme, active year/lock, tour step. **Hash-URL state** (`#y=-221&z=1.4&sel=han_dynasty&lens=trade`) so any view is shareable and the browser back button works. Persist only theme + custom milestones in `localStorage` (wrapped in try/catch).
---

## 7. Content plan & data protocol

**Targets.** ≥ **300 polities/cultures/periods** · ≥ **450 relations** · ≥ **260 callouts** (≥ 100 importance ≥ 3) · ≥ **35 bands** · ≥ **15 trade/migration arcs** · ≥ **120 images** · ≥ **10 tours** · 100% sourced.
**Era coverage minimums** (so the chart is balanced, unlike v1's thin modern era): 3300–2000 BCE ≥ 35 · 2000–1000 BCE ≥ 40 · 1000–0 BCE ≥ 55 · 0–500 CE ≥ 40 · 500–1000 ≥ 45 · 1000–1500 ≥ 55 · 1500–1800 ≥ 55 · **1800–2000 ≥ 70** (nation-states fan-out).

**Data protocol (`docs/DATA_PROTOCOL.md`).**
1. Every entry: ≥ 1 source from `sources.json`; ancient dates (pre-1000 BCE) reconciled against **two** references; disagreements recorded in `dateNote`.
2. Source preference: museum/university/handbook (Met Essays, UNESCO, Cambridge/Oxford Histories, Smithsonian, Yale eHRAF, national archives) > encyclopedias > Wikipedia. Wikipedia may seed a draft but cannot be the sole source for importance ≥ 3 entries.
3. `confidence` and `importance` are mandatory; "secure" requires inscriptional/documentary anchoring.
4. Prose rules: summaries ≤ 60 words; callouts ≤ 14 words; neutral tone; no "greatest/first-ever" without a source; avoid "primitive/civilized" framing; describe peoples, not just states; always note when a polity's people continue after its political end.
5. Use the roster in **App. B** as a *starting checklist only*; every date there must be re-verified before commit.
6. Each era pass ends with an **accuracy review checklist** (dates, relations, spellings, diacritics, captions) and a coverage report; flagged items stay `confidence: 'debated'` rather than being silently chosen.

---

## 8. Features (re-specified on the new core)

| Feature | v2 behavior |
|---|---|
| **Lineage focus** | Hover/select dims everything but ancestors, descendants, siblings and typed connectors; breadcrumb in dossier. |
| **Layers/Lenses** | Politics (default) · Trade & Migration · Climate & Pandemics · Technology & Writing · Religion & Ideas · Art & Monuments. Lenses re-weight importance and reveal arcs; they never hide the chart. |
| **Scrubber / "World in Year X"** | Horizontal crosshair + lock; snapshot is a **popover/strip that opens only when locked** (not a permanent 11-card bar); shows who is active per macro-region with importance ≥ 3. Time-lapse is an optional button. |
| **Search (⌘K)** | Fuzzy over polities, callouts, bands, years ("44 BCE"), people; `flyTo` + select; recent searches. |
| **Dossier** | Right drawer, closed by default; summary, dates + confidence, key facts, rulers, lineage chips (typed), related callouts, image with caption/credit, **sources list**; optional live Wikipedia extract clearly labeled "From Wikipedia" (never required). |
| **Compare / fold** | Fold (collapse) or pin families/macro-regions; presets (Rome vs Han, Americas, Steppe vs Settled…). Layout re-solves with animated transition. |
| **Story Mode** | ≥ 10 tours (seed from Gemini's "three connections"): Bronze Age Collapse · Axial Age · Silk Roads · Islamic Golden Age · Mongol connection · Columbian Exchange · Atlantic slavery & abolition · Industrial transformation · Decolonization · Writing's independent inventions. Each waypoint = camera + lens + highlight + ≤ 70-word narrative + source ids. |
| **Reading key** | Always-available "How to read this" + legend (§4.14). |
| **Custom milestones** | Keep v1 localStorage feature; style as dashed-outline callouts. |
| **Table view** | Sortable table of polities/callouts, same filters; a11y + print-friendly. |
| **Map (optional, P8)** | Schematic locator using Natural Earth (public domain) — no fake borders. |

---

## 9. Phased roadmap (acceptance criteria are the exit gates; the atomic task list is Appendix E)

### P0 — Baseline & hygiene (½ day)
1. `git tag gemini-v1`; branch `v2/foundation`.
2. Remove `tsconfig.tsbuildinfo` from git, add to `.gitignore`.
3. Create `docs/reference/` and add the poster image + both Gemini PDFs (user supplies the poster file if absent).
4. Add ESLint, Prettier, Vitest, Playwright (local), `npm run check` = typecheck + lint + test + validate:data.
5. Add `docs/DESIGN.md` (copy §4–§5) and `docs/DATA_PROTOCOL.md` (§7).
**Exit:** `npm run check` green; v1 still builds.

### P1 — Data model v2 + validation (2–3 days)
1. Implement zod schemas/types (§6.3); `scripts/validate-data.ts`.
2. **Migrate** v1's 69 polities, 58 nodes, 11 bands, 9 routes, 3 tours, 16 presets into v2 files (assign `family`, `importance`, `confidence`; split multi-region v1 spans into keyframed anchors).
3. Seed `sources.json` from Gemini's [1]–[37] (titles/publishers/URLs from the PDF pages 7–8); add `accessedISO`.
4. Build the **skeleton roster** (names, dates, family, relations, importance — no prose yet) for all of App. B.
**Exit:** validator green; coverage report shows era minimums met at skeleton level; **no UI work yet**.

### P2 — Layout engine (3–4 days)
Implement §6.4 as pure TS with Vitest tests: slice building, lane solving (no overlaps, order stability, bounded drift), geometry, connectors (flow conservation), label fitting, callout placement. `scripts/layout-report.ts` prints metrics; `?debug=layout` overlay.
**Exit:** report shows **0 ribbon overlaps, 0 unroutable relations, ≥ 90% fit for importance ≥ 3 labels, runtime < 150 ms**; golden snapshot test of `LayoutResult` for a 40-polity fixture.

### P3 — Poster renderer & design system (3–4 days)
Implement §4 tokens, fonts, era bands, axis, gridlines, ribbons, connectors, labels, epoch bands, title band/frame, fit-to-width default, camera, minimap, Overview button, lineage focus. Remove v1 `TimelineCanvas` once parity is reached.
**Exit (visual):** Playwright screenshots at 1440×900, 1920×1080, 390×844 reviewed side-by-side with the poster using the checklist in App. D; chrome ≤ 12% at rest; 60 fps pan on an M-series Mac with 300 ribbons; lineage focus < 50 ms.

### P4 — Callouts, annotations & images (3 days)
Placement with leader lines; LOD by importance; media pipeline (§5.6) and the first **60 images** with full credit data; in-house pictogram fallback set; Credits page.
**Exit:** no callout/label overlap at default zoom; image payload ≤ 1.2 MB; build fails on missing license/alt/caption; Credits page lists all images.

### P5 — Interactions (3 days)
Search, dossier, scrubber/snapshot popover, lenses, fold/pin/presets, hash-URL state, keyboard navigation, reduced-motion, Table view, Legend/reading key, mobile bottom sheet.
**Exit:** keyboard-only walkthrough possible; axe-core (local) reports 0 serious violations; deep links round-trip.

### P6 — Content depth, era by era (the long tail; ~6 passes)
Order: (1) 1800–2000 nation-state fan-out → (2) 1500–1800 → (3) 500–1500 → (4) 600 BCE–500 CE → (5) 2000–600 BCE → (6) 3300–2000 BCE. Each pass: prose, relations, callouts, images, bands, sources, accuracy checklist, coverage report, tour(s).
**Exit per pass:** era minimums met; validator green; accuracy checklist completed and recorded in `docs/reviews/<era>.md`.

### P7 — Print & reference export (2 days)
`scripts/export-pdf.ts` renders the same `LayoutResult` to vector PDF via headless Chromium: **Letter (8.5×11)**, **Tabloid (11×17)**, **Poster 24×36** (bleed + crop marks option), plus PNG. Generate the **Expanded Reference** pages (era × macro-region tables, "why it matters", "three connections", sources) from data, plus reading key and Credits colophon.
**Exit:** 24×36 PDF text selectable, fonts embedded, min stroke ≥ 0.25 pt, images ≥ 300 dpi; reference pages regenerate with one command.

### P8 — Optional (only if requested)
Deep Prehistory expansion (10,000–3300 BCE) · schematic locator map (Natural Earth, no invented borders; if any boundary dataset is considered, check its license first — some are GPL) · deployment to Vercel (**requires explicit approval**).

---

## 10. Verification

- **Automated (local):** `npm run check` (typecheck, ESLint, Vitest, `validate:data`); `npm run layout:report`; `npm run build`.
- **Visual:** `npm run shots` → Playwright screenshots at 3 viewports × (overview, ancient, classical, medieval, modern, lineage-focused, dossier-open, dark theme). Compare with poster using App. D.
- **Performance:** DevTools trace for pan/zoom (target 60 fps), initial render < 1.5 s on dev machine, JS bundle < 400 KB gz excluding images.
- **Accessibility:** axe-core via Playwright; keyboard walkthrough; reduced-motion check; color-blind simulation script on the palette.
- **Content QA:** coverage report; spot-verification of ≥ 10% of entries per era against primary sources; every "debated" item reviewed.
- **Print QA:** open PDFs in Preview/Acrobat; zoom to 400% on labels; check embedded fonts and image dpi.

---

## 11. Guardrails (Kevin's standing rules)

- **Git/CI:** commit locally as often as useful (every completed task). **Never push** unless `ALLOW_PUSH=true` in `docs/RUN_CONFIG.md`; Kevin pushes once, when the run (or a phase) is ready — no checkpoint pushes, no push-to-see-if-CI-passes. **Do not add GitHub Actions/workflows** to this repo. Verify locally (`npm run check`) before every commit. Small related edits share one commit. Never run `workflow_dispatch` or re-run jobs.
- **Deploy/publish:** never deploy, publish, or change hosting settings unless `ALLOW_DEPLOY=true` *and* Kevin named the artifact and destination.
- **Downloads:** the media fetch script downloads image files — it runs only when `ALLOW_MEDIA_DOWNLOAD=true` in `docs/RUN_CONFIG.md`, and only for entries in the reviewed `media-src.json` (filename, source URL, license). With the switch off, build and test the pipeline on synthetic images, ship pictogram fallbacks, queue the gated tasks, and continue.
- **IP:** reference poster is inspiration only; no tracing/copying. No unlicensed images. No copied prose from Wikipedia/Britannica — write original summaries.
- **Accuracy:** consequential historical claims need sources; label uncertainty rather than hiding it; missing source = `debated` or cut.
- **Scope discipline:** finish the named phase before starting the next; don't create parallel systems (e.g., a second data format); reuse v1 files/types where they still fit.
- **Report honestly:** at the end of each phase list what was verified, what wasn't, number of pushes made and CI runs triggered (expected: 0 CI runs).

---

## 12. Assumptions (flag to Kevin; cheap to change)
1. The **interactive web app is primary**; print/PDF is a derivative export (P7).
2. Keep **Vite/React/TS** (no framework switch).
3. Default range **3300 BCE–2000 CE** (poster-faithful) with a toggle to the present.
4. **Light parchment** default; dark secondary.
5. Images limited to **CC0/PD** unless CC-BY(-SA) is explicitly approved.
6. Hosting later on Vercel, only with approval.
7. Cursor works **autonomously for many hours**; it never blocks on a question — it queues the question in `docs/QUESTIONS.md`, applies the stated default, and continues.
8. Approvals are **switches in `docs/RUN_CONFIG.md`** (all default `false`): `ALLOW_MEDIA_DOWNLOAD`, `ALLOW_PUSH`, `ALLOW_DEPLOY`, `ALLOW_BIG_DEPS`, plus `MAX_PHASE` (default `7`) and `CC_BY_APPROVED_IDS`. Kevin flips them before or during the run.
9. Estimated effort for an autonomous agent: P0 ≈ 1 h · P1 ≈ 5 h · P2 ≈ 8 h · P3 ≈ 8 h · P4 ≈ 6 h · P5 ≈ 7 h · P6 ≈ 20–30 h · P7 ≈ 4 h → **≈ 60–70 h**, in ~2–3 h context windows (see §13.8).

---

## 13. Autonomous run protocol (how Cursor works unattended for hours)

**13.1 Start-of-session ritual (every new context window — memory does not persist).**
1. Read `docs/RUN_CONFIG.md`, the last ~80 lines of `docs/PROGRESS.md`, the titles in `docs/DECISIONS.md`, and `docs/CONTEXT.md`.
2. `git status`, `git log --oneline -10`, then `npm run check` to establish the baseline. If the baseline is red, fixing it is the first task.
3. Pick the **first `todo` task in Appendix E whose dependencies are `done`**, staying within the current phase and (if running parallel agents) your lane. Phases above `MAX_PHASE` are off-limits.

**13.2 Task loop (repeat until the backlog or `MAX_PHASE` is finished).**
a. Mark the task `doing` in `PROGRESS.md`. b. Write tests first for any pure logic. c. Implement the smallest slice that satisfies "Done when". d. Run `npm run check` **and** the task's own verification command. e. For visual tasks run `npm run shots`, assert the numeric checks (§13.6), and save images under `docs/shots/<phase>/`. f. Commit locally: `T2.04: lane solver relaxation + property tests` (one task ≈ one commit; the tree must be green at every commit). g. Update `PROGRESS.md` (status, commit hash, evidence = command + key output, minutes spent). h. Next task. **Do not wait for confirmation between tasks.**

**13.3 Failure protocol.** Three honest attempts per failure (change approach each time). Then write a **Blocked** entry (what you tried, exact error, top hypotheses, what would unblock) and **move to the next independent task**; revisit blocked tasks at the end of the phase. Never delete or weaken a test, validator, or design-lint rule to get green. No `@ts-ignore`/`any` without a `DECISIONS.md` entry. If a dependency is genuinely broken, pin a working version and log it.

**13.4 Decision rule.** Decide yourself when the choice is local, reversible, and consistent with §4–§7: log it in `docs/DECISIONS.md` (date · decision · alternatives · why). **Ask-first list** — queue in `docs/QUESTIONS.md`, apply the stated default, keep going: changing the stack · adding a runtime dependency over 50 KB gz (unless `ALLOW_BIG_DEPS`) · adding any CC-BY/CC-BY-SA image · touching git remotes, pushing, deploying · deleting v1 data beyond migration · paid APIs · violating §4/§5 · anything that would change the *meaning* of a historical claim without a source.

**13.5 Approval switches.** `docs/RUN_CONFIG.md` (template in App. I). All gated actions default to **off**. A gated task that cannot run is marked `queued-gated`; its non-gated parts still run (e.g., pipeline built and tested on synthetic images).

**13.6 Verification without relying on eyesight.** Eyes help, but gates must be machine-checkable:
- **Layout metrics** (`npm run layout:report`): overlaps = 0; unroutable relations = 0; label fit ≥ 90% (importance ≥ 3); callout drops reported; runtime < 150 ms.
- **DOM geometry assertions** in Playwright: bounding boxes of labels/callouts/plates never intersect (tolerance 1 px); ribbon labels inside ribbon boxes; nothing outside the poster frame.
- **Design lint** (`npm run design:lint`, part of `check`): no color literals outside `tokens.css`; no `font-size` below the §4.5 minimums; no `animation-iteration-count: infinite` except the loading spinner; every icon-only button has `aria-label`; only self-hosted fonts.
- **Pixel baselines:** after each phase's exit gate is accepted, `toHaveScreenshot` baselines (max diff 0.2%) protect against regressions.
- **Perf probe:** `npm run perf` samples frame times during a scripted pan/zoom (budget: p95 frame ≤ 20 ms).
- If your environment can view images, also open the screenshots and compare to Appendix D; record honest pass/fail in the review file.

**13.7 Content at scale (accuracy rules — the biggest quality risk).**
- Every polity/relation/callout carries `verification: 'unverified' | 'cross-checked' | 'primary-checked'` and a short `evidence` note (e.g., "Met Essay *Mauryan Empire*: 322–185 BCE").
- You may draft from your own knowledge, but it stays `unverified` until you **actually consulted** a listed source (with a working URL) and recorded `evidence`. **Never invent sources, URLs, accession numbers, or quotes.** If you cannot verify a date, use `confidence: 'debated'` + `dateNote` with the competing range, or omit the entry.
- `npm run report:unverified` writes `docs/UNVERIFIED.md` (counts by era/family/importance). Goal by end of P6: **100% of importance ≥ 4 entries `cross-checked`**; everything else visibly flagged in the dossier ("Not yet cross-checked" chip) for Kevin's review.
- Prose is original; summaries ≤ 60 words; no copied sentences from any source; describe peoples as well as states.
- Image URLs must return HTTP 200 and a matching license record before entering `media-src.json`.

**13.8 Context hygiene for long runs.** Keep files ≤ 400 lines (split data per family, ≤ 60 entries per file). At the end of each phase and every ~2–3 hours, update `docs/CONTEXT.md` (≤ 1 page: architecture, commands, conventions, gotchas, what's next) so a fresh window resumes in minutes. Prefer reading files with offsets rather than whole large files. Log minutes per task in `PROGRESS.md` to calibrate estimates.

**13.9 Git.** Local only (`ALLOW_PUSH=false`). Branch per phase (`v2/p1-data` …). When the phase exit gate passes: `git merge --no-ff` into `v2/main`, tag `v2-pN-done`. Never rebase shared history, never force anything, never touch `main` until Kevin says so. Final report states **pushes made (expected 0) and CI runs triggered (expected 0).**

**13.10 Parallel lanes (only if Cursor supports multiple/background agents; otherwise follow 13.12 order).**
| Lane | Owns (exclusive write) | Tasks |
|---|---|---|
| A — Engine & render | `src/layout/`, `src/render/`, `src/camera/` | P2, P3 |
| B — Data & content | `src/data/**` (except `schema/`), `docs/reviews/` | P1, P6 |
| C — Media | `scripts/media/`, `src/data/media*.json`, pictograms, `src/render/Plate*` | P4 |
| D — Tooling & export | `scripts/` (non-media), config files, `docs/` meta, P7 | P0, P7 |
`src/data/schema/` is changed only via a `DECISIONS.md` note + running `npm run check` on all lanes' branches. Lane B can start P1 as soon as T1.01–T1.02 land.

**13.11 Mandatory self-critique checkpoints.**
- **M1 — Vertical slice (T3.17):** ~100 polities, real layout, poster look. Fill `docs/reviews/M1.md` scoring Appendix D item by item (pass / partial / fail + fix list). **Do not start P4 until ≥ 70% pass.** If layout looks poor, fix the engine or add overrides *now*; content depth multiplies any layout flaw.
- **M2 — Interactive complete (T5.17)**, **M3 — Content complete (T6.99)**, **M4 — Release candidate (T9.03)**: same rubric plus a11y/perf/accuracy sections.

**13.12 If time or budget runs short, cut in this order (cut from the bottom).** Must: P0–P3, P5 core (search, dossier, lineage focus, hash URL), P6 passes 1–3 · Should: P4 images, rest of P5, P6 passes 4–6 · Could: P7 print/export, P8.

**13.13 Global Definition of Done (every task).** Types strict · tests added/updated · `npm run check` green · no new console warnings · docs/CONTEXT updated if conventions changed · `PROGRESS.md` entry with evidence · commit made.

**13.14 End of run → `docs/HANDOFF.md`.** Per-phase status; metrics (layout report, bundle size, perf, a11y); screenshot index; counts (polities, relations, callouts, images, tours) vs. targets; `UNVERIFIED.md` summary; open `QUESTIONS.md`; known issues; how to run/export; **pushes = 0, CI runs = 0**; recommended next steps.

---

## 14. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Auto-layout looks cluttered/ugly in dense eras | High | M1 gate; `layoutOverrides.json`; debug overlay; fixtures C/G; importance-based LOD; manual tuning task T3.18 |
| Historical errors at scale (dates, relations) | High | `verification` field; two-source rule for pre-1000 BCE; validator; `UNVERIFIED.md`; flag instead of guess |
| Palette collisions / color-blind failures | Med | `palette-check` (ΔE + CVD) in `check`; pattern/dash cues |
| Label clutter & clipping | High | measure-based `labelFit`; short-ribbon policy; DOM-geometry tests |
| Performance with 350+ ribbons and 120 images | Med | viewport virtualization; memoized layout; image lazy-loading; perf probe |
| License contamination (images, fonts, deps) | Med | allowlist, `licenseApproved`, `docs/LICENSES.md` audit (T9.04) |
| Scope creep (map, 3D, prehistory) | Med | `MAX_PHASE`; P8 optional |
| Context loss in long runs | High | §13.1 ritual, `PROGRESS.md`, `CONTEXT.md`, small files |
| Over-reliance on poster look-alike | Low/High-impact | §1 reference-only rule; our own roster, images, prose, coordinates |
| Cursor stalls waiting for approvals | Med | Approval switches + queue-and-continue rule (§13.4–13.5) |

## 15. Ambiguity defaults (decide silently, log in DECISIONS.md if you deviate)

- **Which end date?** Model the polity with its widely cited political end (e.g., Western Rome 476, Eastern 1453); alternative endpoints go in `dateNote`; never silently pick one for debated cases (Safavid 1722/1736, Mughal 1707/1858).
- **Successor coloring:** inherit family hue; siblings ±6–10% lightness.
- **Multi-zone empires** (Mongol, Ottoman, Umayyad/Abbasid, British): a single wide ribbon whose width tracks `spanLanes`, tapering at zone edges, with one label — not several overlapping blocks.
- **Conquered-but-continuing peoples:** the conquered ribbon continues thinner under the conqueror, with a `conquest` connector.
- **Modern states:** include UN members plus notable historical states; group micro-states into labeled clusters at the 2000 edge when they cannot fit (e.g., "Gulf states", "Caribbean"), expandable on zoom.
- **Naming:** English common name first, native name in `altNames`; pinyin for Chinese (Wade–Giles in `altNames`); keep diacritics; capitalize dynasties ("Han Dynasty"); no leading "The".
- **Years:** BCE negative; no year 0; `c.` shown iff `confidence ≠ 'secure'`.
- **Imagery gaps:** pictogram, never a random photo.
- **Something not covered here:** choose the simplest option consistent with §4–§5 and the data protocol, log it, continue.
---

## Appendix A — Lineage families & starting palette (tune with the validator; must pass ΔE and CVD checks)

| Family id | Hue (start) | Notes |
|---|---|---|
| `andean` | `#4F9A7B` | Norte Chico → Chavín → Nazca/Moche → Wari/Tiwanaku → Inca → Andean republics |
| `mesoamerican` | `#E7B43F` | Olmec → Zapotec/Teotihuacan/Maya → Toltec → Aztec → New Spain → Mexico/C. America |
| `north_american` | `#D98429` | Poverty Point → Adena/Hopewell → Mississippian/Puebloan → colonies → USA/Canada |
| `sub_saharan` | `#D9654F` | Kerma/Kush/Nok/Aksum → Sahel empires → Zimbabwe/Kongo/… → colonial → modern states |
| `nile_egyptian` | `#86B26C` | Dynastic → Ptolemaic → Roman Egypt; continues into Islamic Egypt (same hue family as `islamic`) |
| `mesopotamian` | `#C2A84A` | Sumer → Akkad → Babylon/Assyria; Elam, Hittites as sibling shades |
| `persian_iranian` | `#5B8FB9` | Medes → Achaemenid → Parthian → Sasanian → Safavid/Qajar → Iran |
| `levantine_semitic` | `#7C6FB0` (distinct from Latin purple; test) | Phoenicia, Israel/Judah, Carthage, Nabataeans |
| `greek_byzantine` | `#6AA7DB` | Minoan → Mycenaean → Greece → Hellenistic → Byzantine → Greece |
| `latin_west` | `#9A78BF` | Etruscan → Rome → Western successors → HRE → France/Spain/Britain/Italy/Germany |
| `celtic_germanic_norse` | `#B8A7D9` | Hallstatt/La Tène, Germanic kingdoms, Vikings, Anglo-Saxons |
| `slavic_steppe` | `#8796A8` | Scythians, Huns, Rus', Golden Horde, Muscovy → Russia/USSR |
| `islamic_arab` | `#3F9970` | Rashidun → Umayyad → Abbasid → regional caliphates/sultanates → Ottomans (hue-shifted) |
| `turkic_mongol` | `#A27A58` | Xiongnu → Göktürk → Seljuk → Mongol → Timurid/Mughal/Ottoman influence |
| `indian` | `#EE8C32` | Indus → Vedic → Maurya/Gupta → Chola/Delhi/Vijayanagara → Mughal/Raj → India/Pakistan/Bangladesh |
| `chinese` | `#D9473F` | Neolithic → Shang/Zhou → Qin/Han → … → Qing → ROC/PRC |
| `korean_japanese` | `#C95F85` | Joseon/Goryeo/Silla…; Jōmon → Yamato → shogunates → Meiji → Japan |
| `southeast_oceanian` | `#3FA3A0` | Dong Son/Funan/Khmer/Srivijaya/Majapahit/Ayutthaya; Lapita → Polynesia → Aotearoa; Aboriginal Australia as a continuous thin ribbon |

**X-axis zones (west→east guides, faint dashed):** Americas (Andes, Mesoamerica, N. America) · Atlantic gap · Sub-Saharan Africa · Iberia/W. Europe · Central/E. Europe & Steppe · Mediterranean & Egypt · Levant/Mesopotamia/Iran · Central Asia · South Asia · East Asia · SE Asia & Oceania. Macro-region labels (Gemini's PDF grouping): Americas · Europe · Africa · West & Central Asia · South Asia · East Asia · SE Asia & Oceania.

## Appendix B — Seed roster (CHECKLIST ONLY: re-verify every date against sources; BCE as negative in data)

**Andean:** Norte Chico/Caral c.3000–1800 BCE · Chavín c.900–200 BCE (earlier in some chronologies) · Paracas c.800 BCE–100 CE · Nazca c.100 BCE–800 · Moche c.100–700 · Wari c.600–1000 · Tiwanaku c.500–1000 · Chimú c.900–1470 · Inca 1438–1533 · Viceroyalty of Peru 1542–1824 · Viceroyalty of New Granada 1717–1819 · Río de la Plata 1776–1810 · Modern: Argentina, Chile, Peru, Bolivia, Ecuador, Colombia, Venezuela, Paraguay, Uruguay (independence 1810s–1830s).
**Mesoamerica:** Olmec c.1500–400 BCE · Zapotec/Monte Albán c.500 BCE–800 · Teotihuacan c.100 BCE–550 CE · Maya (Preclassic c.2000 BCE–250 CE; Classic 250–900; Postclassic 900–1697) · Toltec c.900–1150 · Mixtec · Aztec Triple Alliance 1428–1521 · Tarascan c.1300–1530 · New Spain 1521–1821 · Mexico 1821– · Central American states 1821/1838–.
**North America:** Poverty Point c.1700–1100 BCE · Adena c.1000–200 BCE · Hopewell c.200 BCE–500 CE · Ancestral Puebloan c.100–1300 · Mississippian c.800–1600 (Cahokia c.1050–1350) · Haudenosaunee Confederacy (15th c.–) · Thule · New France 1534–1763 · Thirteen Colonies 1607–1776 · USA 1776– · Canada 1867– · Russian America 1799–1867.
**Sub-Saharan Africa:** Kerma c.2500–1500 BCE · Kush (Napatan c.1000–300 BCE; 25th Dyn. 744–656; Meroitic c.300 BCE–350 CE) · Nok c.1500 BCE–500 CE · Aksum c.100–940 · Ghana/Wagadu c.300–1200 · Great Zimbabwe c.1100–1450 · Swahili city-states c.800–1500+ · Mali c.1235–1600 · Songhai c.1464–1591 · Kanem–Bornu c.700–1900 · Benin c.1180–1897 · Ethiopia (Solomonic) 1270–1974 · Kongo c.1390–1914 · Oyo c.1400–1835 · Ashanti c.1701–1901 · Sokoto Caliphate 1804–1903 · Zulu Kingdom 1816–1897 · European partition c.1880–1914 · Independence 1950s–70s · South Africa (Union 1910; apartheid 1948–94).
**Nile/Egypt:** Early Dynastic c.3100–2686 BCE · Old Kingdom 2686–2181 · First Intermediate 2181–2055 · Middle Kingdom 2055–1650 · Second Intermediate 1650–1550 · New Kingdom 1550–1069 · Third Intermediate 1069–664 · Late Period 664–332 · Ptolemaic 305–30 · Roman Egypt 30 BCE–641 CE · Tulunid 868–905 · Fatimid 969–1171 · Ayyubid 1171–1250 · Mamluk 1250–1517 · Ottoman Egypt 1517–1805 · Muhammad Ali dynasty 1805–1953 · Republic 1953–.
**Mesopotamia/W. Asia:** Sumerian city-states c.3500–2334 BCE · Akkadian c.2334–2154 · Ur III c.2112–2004 · Old Babylonian c.1894–1595 · Kassite c.1595–1155 · Elam c.2700–539 · Hittites c.1650–1178 · Middle Assyrian c.1365–1050 · Neo-Assyrian 911–609 · Neo-Babylonian 626–539 · Medes c.678–550 · Lydia c.680–546 · Urartu c.860–590.
**Persia/Iran:** Achaemenid 550–330 BCE · Seleucid 312–63 · Parthian 247 BCE–224 CE · Sasanian 224–651 · Buyid 934–1062 · Seljuk 1037–1194 · Ilkhanate 1256–1335 · Timurid 1370–1507 · Safavid 1501–1722/1736 · Afsharid 1736–1796 · Qajar 1789–1925 · Pahlavi 1925–1979 · Islamic Republic 1979–.
**Levant/Semitic:** Phoenician city-states c.1500–539 BCE · Israel/Judah c.1000–586 BCE · Second Temple period 516 BCE–70 CE · Carthage c.814–146 BCE · Nabataean c.312 BCE–106 CE · Crusader states 1098–1291 · Ottoman Levant 1516–1918 · Mandates 1920–48 · Israel 1948– · modern Arab states 1930s–70s.
**Greek/Byzantine:** Minoan c.2700–1450 BCE · Mycenaean c.1600–1100 · Greek "Dark Ages" c.1100–800 · Archaic 800–480 · Classical 480–323 (Athens, Sparta, Thebes) · Macedon/Alexander 336–323 · Hellenistic kingdoms 323–31 (Antigonid, Seleucid, Ptolemaic, Greco-Bactrian) · Byzantine 330/395–1453 · First Bulgarian 681–1018 · Second Bulgarian 1185–1396 · Latin Empire 1204–1261 · Serbia (medieval) · Greece 1821/1832–.
**Latin West:** Etruscans c.900–264 BCE · Roman Kingdom (trad.) 753–509 BCE · Republic 509–27 BCE · Empire 27 BCE–476 (West) · Ostrogoths 493–553 · Visigoths c.418–711 · Vandals 429–534 · Lombards 568–774 · Merovingian Franks 481–751 · Carolingian 751–843 · West Francia → France (Capetian 987–) · East Francia → Holy Roman Empire 962–1806 · Papal States 756–1870 · Venice 697–1797 · Kingdom of Aragon/Castile → Spain (union 1469; Habsburg Spain 1516–1700) · Portugal 1139– · Dutch Republic 1581–1795 · Habsburg Austria → Austria-Hungary 1867–1918 · Prussia 1701–1947 · German Empire 1871–1918 · Italy 1861– · France: Revolution 1789, First Republic 1792, Empire 1804–14 · Weimar 1919–33 · Nazi Germany 1933–45 · East/West Germany 1949–90.
**Celtic/Germanic/Norse:** Hallstatt c.1200–500 BCE · La Tène c.450–50 BCE · Gaul (to 51 BCE) · Germanic tribes · Anglo-Saxons c.410–1066 · Vikings c.793–1066 · Norman England 1066 · England → Great Britain (1707) → UK (1801) · Scandinavian kingdoms (Denmark, Sweden, Norway) · Kalmar Union 1397–1523.
**Slavic/Steppe:** Scythians c.900–200 BCE · Sarmatians · Huns c.370–469 · Avars 567–822 · Khazars c.650–1000 · Kievan Rus' c.882–1240 · Golden Horde 1242–1502 · Muscovy → Tsardom 1547–1721 · Russian Empire 1721–1917 · USSR 1922–91 · Russia 1991– · Poland–Lithuania 1569–1795.
**Islamic/Arab:** Rashidun 632–661 · Umayyad 661–750 · Abbasid 750–1258 · Al-Andalus 711–1492 · Almoravid 1040–1147 · Almohad 1121–1269 · Fatimid 909/969–1171 · Mamluk 1250–1517 · Ottoman c.1299–1922 · Saudi Arabia 1932–.
**Turkic/Mongol:** Xiongnu c.209 BCE–93 CE · Xianbei · Göktürk 552–744 · Uyghur Khaganate 744–840 · Seljuk · Khitan Liao 916–1125 · Jurchen Jin 1115–1234 · Mongol Empire 1206–1368 (Yuan 1271–1368; Ilkhanate; Chagatai; Golden Horde) · Timurid 1370–1507 · Mughal 1526–1857 · Dzungar c.1634–1757.
**India/South Asia:** Indus/Harappan c.3300–1300 BCE (mature 2600–1900) · Vedic period c.1500–500 BCE · Mahajanapadas c.600–345 BCE · Nanda 345–322 · Maurya c.322–185 · Satavahana c.230 BCE–220 CE · Kushan c.30–375 · Gupta c.320–550 · Pallava/Chalukya (6th–8th c.) · Harsha 606–647 · Rashtrakuta 753–982 · Pala c.750–1161 · Chola c.850–1279 · Delhi Sultanate 1206–1526 · Vijayanagara 1336–1646 · Mughal 1526–1857 · Maratha 1674–1818 · Sikh Empire 1799–1849 · British Raj 1858–1947 · India/Pakistan 1947 · Bangladesh 1971 · Sri Lanka (Anuradhapura etc.) · Tibetan Empire c.618–842 · Nepal.
**China:** Neolithic (Yangshao, Longshan, Liangzhu c.3300–2300 BCE) · Erlitou c.1900–1500 BCE (Xia link debated) · Shang c.1600–1046 · Western Zhou 1046–771 · Spring & Autumn 770–476 · Warring States 475–221 · Qin 221–206 · Western Han 206 BCE–9 CE · Xin 9–23 · Eastern Han 25–220 · Three Kingdoms 220–280 · Jin 266–420 · Northern & Southern dynasties 420–589 · Sui 581–618 · Tang 618–907 · Five Dynasties 907–960 · Liao 916–1125 · Northern Song 960–1127 · Southern Song 1127–1279 · Western Xia 1038–1227 · Jin 1115–1234 · Yuan 1271–1368 · Ming 1368–1644 · Qing 1644–1912 · ROC 1912– · PRC 1949– · Taiwan.
**Korea/Japan:** Gojoseon (trad./legendary start) · Three Kingdoms of Korea: Goguryeo 37 BCE–668, Baekje 18 BCE–660, Silla 57 BCE–935 · Unified Silla 668–935 · Balhae 698–926 · Goryeo 918–1392 · Joseon 1392–1897 · Korean Empire 1897–1910 · Korea under Japan 1910–45 · N/S Korea 1948– · Jōmon c.14000–300 BCE · Yayoi c.300 BCE–300 CE · Kofun c.250–538 · Asuka 538–710 · Nara 710–794 · Heian 794–1185 · Kamakura 1185–1333 · Muromachi 1336–1573 · Azuchi–Momoyama 1573–1603 · Tokugawa 1603–1868 · Meiji 1868–1912 · Empire of Japan 1868–1947 · Japan 1947– · Ryukyu Kingdom 1429–1879.
**SE Asia/Oceania:** Dong Son c.700 BCE–100 CE · Funan c.68–550 · Champa 192–1832 · Srivijaya c.650–1377 · Pagan 849–1297 · Khmer/Angkor 802–1431 · Dai Viet 968– · Majapahit 1293–1527 · Ayutthaya 1351–1767 · Konbaung 1752–1885 · Nguyen 1802–1945 · Spanish Philippines 1565–1898 · VOC 1602–1799 → Dutch East Indies → Indonesia 1945/49 · Thailand/Siam · Vietnam 1945/76 · Lapita c.1600–500 BCE · Polynesian expansion (Tonga/Samoa c.900 BCE; E. Polynesia c.1000–1300 CE; Aotearoa c.1250–1300) · Aboriginal Australia (continuous, c.65,000 yr) · NSW colony 1788 · Treaty of Waitangi 1840 · Australia federation 1901.
**Cross-cutting bands (seed):** 4.2 ka event (c.2200–2100 BCE) · Bronze Age Collapse (c.1200–1150 BCE) · Greek Dark Ages · Axial Age (c.800–200 BCE) · Hellenistic world · Roman Climate Optimum · Plague of Justinian (541–549) · Late Antique Little Ice Age (536 event) · Islamic Golden Age (c.750–1258) · Medieval Warm Period · Black Death (1347–51) · Little Ice Age · Age of Discovery · Reformation · Scientific Revolution · Enlightenment · Industrial Revolution · WWI/WWII · Cold War.
**Callout seeds (importance-5 first):** first writing (Uruk c.3300–3200 BCE; Egyptian hieroglyphs) · Giza pyramids c.2600–2500 BCE · Hammurabi's Code c.1754 BCE · Shang oracle bones · Olmec colossal heads · Kadesh (1274 BCE) · Phoenician alphabet · Buddha/Confucius/Socrates/Zoroaster · Qin Terracotta Army · Alexander's conquests · Ashoka · Rome's fall (476) · Hagia Sophia (537) · Hijra (622) · Tang/Song printing · Mansa Musa's hajj (1324) · Mongol conquests · Zheng He voyages · Gutenberg (c.1450) · 1492 · Taj Mahal · Scientific Revolution · French Revolution · Haitian Revolution · steam engine · Meiji · WWI/WWII · UN (1945) · decolonization · Moon landing (1969) · fall of USSR (1991).

## Appendix C — Gemini PDF reuse map
| PDF content | Becomes |
|---|---|
| Reading key (p.6) | `docs/` + in-app "How to read this" + `dateNote` conventions |
| Sources [1]–[37] (pp.7–8) | `sources.json` seed |
| Era × region tables (pp.1–5) | `EraRegionNote` entries; seed callouts; reference-page generator input |
| "Why it matters" lines | dossier "Context" blurbs + reference pages |
| "Three connections to remember" | tour seeds and importance-5 callouts |
| One-page poster's era band labels & macro-region grouping | era bands + macro-region labels (not the pill shapes) |

## Appendix D — Side-by-side acceptance checklist vs. the poster (screenshot review)
- [ ] Whole timeline legible as a single field; Overview/minimap shows all 5,300 years.
- [ ] Rivers fork/merge/drift: Rome splits E/W; Franks→HRE/France; Caliphates span columns; Mongol/Ottoman breadth; India/China continuity.
- [ ] Modern fan-out: ≥ 60 labeled states at the bottom edge.
- [ ] Ribbon width visibly encodes prominence; no capsule-block look.
- [ ] Color follows lineage; neighbors distinguishable; passes CVD simulation.
- [ ] Six era bands + ≥ 12 cross-cutting bands readable, behind ribbons.
- [ ] ≥ 30 images visible at default zoom across the whole chart; consistent plate treatment; none covering labels.
- [ ] Labels never clipped; min sizes met; callouts have leader lines.
- [ ] Chrome ≤ 12% at rest; dossier/map/snapshot closed by default.
- [ ] Parchment light default feels like a map-room poster, not a dashboard.
- [ ] No poster artwork/text reproduced.
---

## Appendix E — Task backlog (work top to bottom; `dep:` = must be done first; "Done when" is a command or checkable fact)

Status values for `PROGRESS.md`: `todo · doing · done · blocked · queued-gated`. IDs are stable; add new tasks as `T<phase>.<nn>+` and never renumber.

### P0 — Baseline & tooling
- **T0.01** Tag current HEAD `gemini-v1`; create branch `v2/main` then `v2/p0-tooling`. *Done when:* `git tag` lists `gemini-v1`.
- **T0.02** Untrack `tsconfig.tsbuildinfo`; extend `.gitignore` (`dist/ dist-print/ media-cache/ test-results/ playwright-report/ *.tsbuildinfo`). *Done when:* `git ls-files | grep tsbuildinfo` empty.
- **T0.03** Confirm `docs/CURSOR_PLAN.md` (this plan) exists in the repo. Create `docs/reference/` with the poster image, `gemini/World_History_Timeline_8x11.pdf`, `gemini/World_History_Timeline_Expanded_8x11.pdf`; if the poster file is missing, log it in `QUESTIONS.md` and continue. *Done when:* files present.
- **T0.04** Create the doc skeletons from Appendix I: `RUN_CONFIG, PROGRESS, DECISIONS, QUESTIONS, UNVERIFIED, CONTEXT, DESIGN, DATA_PROTOCOL` (DESIGN = §4–§5 verbatim; DATA_PROTOCOL = §7 + §13.7 + §15). *Done when:* files exist and are linked from `README.md`.
- **T0.05** Create `.cursor/rules/chronos.mdc` from Appendix F. *Done when:* file present.
- **T0.06** Install deps: runtime `zustand zod rbush d3-scale d3-shape d3-zoom d3-ease @fontsource/barlow-condensed @fontsource/source-sans-3 @fontsource/source-serif-4`; dev `vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom eslint typescript-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y prettier @playwright/test @axe-core/playwright sharp tsx culori @types/rbush @types/d3-scale @types/d3-shape @types/d3-zoom @types/d3-ease`. Remove `lucide-react` later (T5.20) once pictograms replace it. *Done when:* `npm ls --depth=0` clean.
- **T0.07** TypeScript strict + `noUncheckedIndexedAccess`; path alias `@/ → src/`; Vitest (jsdom, coverage thresholds off until P2); Playwright config (webServer = `vite preview`, projects: desktop 1440×900, wide 1920×1080, mobile 390×844). *Done when:* `npx tsc -b` and `npx vitest run` run (even with zero tests).
- **T0.08** ESLint (flat config) + Prettier; fix v1 violations only if trivial, otherwise `eslint-ignore` v1 folders until deleted in T3.16. *Done when:* `npm run lint` green.
- **T0.09** `scripts/design-lint.ts` implementing §13.6 rules; wired as `npm run design:lint`. *Done when:* script runs and has unit tests for each rule.
- **T0.10** npm scripts: `check` (typecheck + lint + design:lint + palette:check + test + validate:data), `validate:data`, `palette:check`, `layout:report`, `report:unverified`, `shots`, `perf`, `media:plan|fetch|process|budget`, `export:pdf`, `export:all`. Stubs OK. *Done when:* `npm run check` green.
- **T0.11** Baseline screenshots of v1 into `docs/shots/v1/` (3 viewports, scenes: default, ancient, classical, modern). *Done when:* ≥ 12 PNGs.
- **T0.12** `docs/CONTEXT.md` v0 (commands, structure, conventions). *Done when:* committed.

### P1 — Data model, validation, skeleton roster (dep: P0)
- **T1.01** `src/data/schema/*.ts`: zod schemas + inferred types for `Family, Polity, Relation, Callout, Band, Route, Source, MediaItem, EraRegionNote, Tour, Preset` per §6.3 (+ `verification`, `evidence`, `group`, `shortName`, `spanLanes`, `ownerLane`). *Done when:* schema unit tests (valid/invalid cases) pass.
- **T1.02** `src/lib/years.ts`: `toT(year)` (BCE→continuous: `year<0 ? year+1 : year`), `fromT`, `formatYear`, `formatRange(start,end,confidence)`, `parseYearQuery("44 BCE"|"1066"|"c. 500 BCE")`. *Done when:* tests cover −1→1 gap = 1 year, ranges, parsing, `c.` rules.
- **T1.03** `families.json` (App. A palette) + `scripts/palette-check.ts` (culori: ΔE2000 between all family pairs that share x-zones ≥ 12; CVD simulation for deuteranopia/protanopia/tritanopia; label-text contrast ≥ 4.5 for chosen ink/paper). Adjust hues until passing. *Done when:* `npm run palette:check` prints matrix and exits 0.
- **T1.04** `geography.json`: longitude→poster-x knots (App. G), macro-regions (Gemini grouping), x-zone guides, per-family `xBias`. *Done when:* schema-valid; `projectX` monotonicity test (T2.02) can consume it.
- **T1.05** `src/data/index.ts`: load JSON, build indexes (`byId`, `byFamily`, `relationsFrom/To`, `childrenOf/parentsOf`, `byEra`), memoized; zod-parse in dev + validator; production imports precompiled JSON. *Done when:* index tests.
- **T1.06** `scripts/validate-data.ts` implementing every check in §6.3 + coverage report (counts per era/family/importance) + exit codes (errors fail, warnings print). *Done when:* seeded-bad-data tests fail as expected; good fixture passes.
- **T1.07** `sources.json` seeded from Gemini PDF pp.7–8 sources [1]–[37] (use `pdftotext`/link extraction on `docs/reference/gemini/…Expanded…pdf`; keep title, publisher, and every URL that resolves; unresolved → `url:''` + warning). Add 15+ additional authoritative sources (Met Essays, UNESCO, Cambridge Histories, Oxford Handbooks, Smithsonian, Yale eHRAF, national archives) **only with real URLs verified to resolve**. *Done when:* ≥ 50 sources; validator link-shape checks pass; `LICENSES/SOURCES.md` generated.
- **T1.08** `scripts/migrate-v1.ts`: read v1 data from tag `gemini-v1` (`git show gemini-v1:src/data/...`) and emit v2 JSON skeletons with review markers; map v1 regions→families/macro-regions (table in `DECISIONS.md`). *Done when:* 69 polities emitted, `validate:data` passes with `verification:'unverified'`.
- **T1.09** Migrate v1 nodes→callouts (assign `importance`, `blurb ≤ 14 words`), bands, routes, tours, presets, paleoclimate curve → `climate.json`. *Done when:* counts match v1 (58/11/9/3/16); validator green.
- **T1.10–T1.27** **Roster skeleton per family** (one task each; no prose beyond `summary` ≤ 30 words; fields: id, name, shortName, family, start, end, uncertainty, confidence, importance, weight, kind, anchor keyframes, group, sourceIds, verification, evidence). Use App. B as a checklist and §15 conventions. *Done when:* family file validates and meets the target below:
  | Task | Family | Skeleton polities | Task | Family | Skeleton polities |
  |---|---|---|---|---|---|
  | T1.10 | andean | ≥ 23 | T1.19 | latin_west | ≥ 45 |
  | T1.11 | mesoamerican | ≥ 19 | T1.20 | celtic_germanic_norse | ≥ 12 |
  | T1.12 | north_american | ≥ 14 | T1.21 | slavic_steppe | ≥ 14 |
  | T1.13 | sub_saharan | ≥ 35 | T1.22 | islamic_arab | ≥ 12 |
  | T1.14 | nile_egyptian | ≥ 18 | T1.23 | turkic_mongol | ≥ 14 |
  | T1.15 | mesopotamian | ≥ 14 | T1.24 | indian | ≥ 28 |
  | T1.16 | persian_iranian | ≥ 14 | T1.25 | chinese | ≥ 32 |
  | T1.17 | levantine_semitic | ≥ 14 | T1.26 | korean_japanese | ≥ 28 |
  | T1.18 | greek_byzantine | ≥ 18 | T1.27 | southeast_oceanian | ≥ 28 |
- **T1.28** Cross-family relations pass (conquest, vassalage, migration, cultural continuity); every polity except true roots has ≥ 1 inbound relation or a documented reason. *Done when:* validator "orphan" warnings = 0 (or whitelisted with reason).
- **T1.29** Era-coverage check meets §7 minimums at skeleton level; add missing entries. *Done when:* coverage report all green.
- **T1.30** `scripts/report-unverified.ts` → `docs/UNVERIFIED.md`. *Done when:* generated and committed.
- **T1.31** Seed `layoutOverrides.json` (empty) + schema. *Done when:* validates.
- **T1.99** Phase gate: `npm run check` green; tag `v2-p1-done`; update CONTEXT.md.

### P2 — Layout engine (dep: T1.01, T1.02, T1.04, T1.05; can start once these land)
- **T2.01** `src/layout/types.ts`: `LayoutInput`, `LayoutResult` (ribbons, connectors, labels, callouts, plates, bands, axis, debug), pure/serializable. *Done when:* compiles; docs comment on each field.
- **T2.02** `projectX.ts` (+ tests: monotone, endpoints 0/1, family bias, override keyframes interpolation).
- **T2.03** `slices.ts` — unique event years (polity start/end, relation years, widthProfile years), active sets per slice (+ tests incl. zero-length slice handling).
- **T2.04** `laneSolver.ts` v1 — stable ordering + mass-weighted relaxation (App. G pseudocode) (+ property tests over seeded random inputs: no overlaps, deterministic, bounds respected).
- **T2.05** Drift limiting + hysteresis; insert intermediate keyframes when drift exceeds `MAX_DRIFT` (+ tests).
- **T2.06** Parent→child seeding for splits and child→parent convergence for merges (fixtures A, F).
- **T2.07** Multi-zone empires (`spanLanes`): wide-ribbon model with taper (fixture B).
- **T2.08** `ribbonGeometry.ts`: monotone cubic through keyframes, widthProfile, rounded caps → path strings (+ golden path snapshots).
- **T2.09** Uncertainty caps: gradient-fade + dashed edge geometry (fixture D).
- **T2.10** `connectors.ts` split/merge/succession with flow conservation (Σ child widths ≤ parent end width) (+ tests).
- **T2.11** Conquest/vassalage/continuity/disputed connector variants (fixture G).
- **T2.12** `labelFit.ts` with injectable `TextMeasurer` (canvas in browser, fixed-width fake in tests); orientation choice, shrink, shortName, word-boundary ellipsis (+ tests).
- **T2.13** Short-ribbon label policy (outside label + leader) (fixture H).
- **T2.14** `calloutPlacer.ts` with rbush + scoring (App. G) (+ tests: zero collisions, deterministic, drop policy).
- **T2.15** `lod.ts`: `importanceThreshold(zoom)`, group collapse (`group` field), crossfade parameters (+ tests).
- **T2.16** `layout/index.ts` orchestrator with memoization by input hash; perf bench (300 ribbons < 150 ms) as a Vitest bench/test.
- **T2.17** `scripts/layout-report.ts`: metrics from §6.4 → console + `docs/reports/layout-latest.json`; non-zero exit on gate failure.
- **T2.18** Debug payload (`LayoutResult.debug`) with lanes/boxes/violations.
- **T2.19** Overrides application + schema.
- **T2.20** Golden fixtures A–H committed under `src/layout/__fixtures__/` with snapshot tests; determinism hash test.
- **T2.99** Phase gate: layout-report passes on the real roster (overlaps 0, unroutable 0, fit ≥ 90%); coverage for `src/layout` ≥ 85%; tag `v2-p2-done`.

### P3 — Poster renderer & design system (dep: P2 core)
- **T3.01** `styles/tokens.css` (light/dark/`data-theme`), `@fontsource` imports, base reset; remove Google Fonts `<link>` from `index.html`. *Done when:* `design:lint` green; no network font requests.
- **T3.02** App shell: `PosterFrame` (title band "Timeline of World History"-style header in our own words/wording, frame, left+right era gutters), slim `TopBar` (title · search · lens · view · theme). Old chrome removed from the default render path.
- **T3.03** `camera/` module (d3-zoom math, inertia, clamp, `fit`, `flyTo`, pointer-anchored wheel/pinch) (+ transform unit tests).
- **T3.04** `render/Stage.tsx`: SVG root, coordinate system (App. G constants), viewport virtualization hook.
- **T3.05** `Axis`, `Gridlines`, `EraBands` (both gutters), tick labelling by zoom.
- **T3.06** `scripts/make-watermark.ts` → `public/watermark.svg` from public-domain Natural Earth land (via `world-atlas`/`topojson-client` as dev-only deps); 4% opacity, multiply.
- **T3.07** `Ribbon`, `RibbonLabel`, fuzzy caps, edge style; memoized; keyboard-focusable with `aria-label`.
- **T3.08** `Connector` components for all relation types.
- **T3.09** `Bands` (epoch/climate/pandemic/collapse hatching + margin labels) with z-order per §4.8.
- **T3.10** Lineage focus (store selector → CSS class; 200 ms) + tooltip (name, dates, confidence glyph, verification dot).
- **T3.11** Fit-to-width default; zoom controls; shortcuts (+/−, arrows, Home/End); **Overview minimap** with viewport rect.
- **T3.12** Theme toggle (light/dark/system) with persistence in try/catch; both themes pass contrast + palette checks.
- **T3.13** `Legend` + "How to read this" panel (content from §4.14 + Gemini reading key wording rewritten).
- **T3.14** `npm run shots` (3 viewports × scenes: overview, ancient, classical, medieval, modern, focus, dark). Accept baselines to `docs/shots/p3/`.
- **T3.15** Perf pass (`npm run perf`, p95 ≤ 20 ms during scripted pan/zoom with 300+ ribbons); fix hotspots.
- **T3.16** Delete v1 `TimelineCanvas`, `utils/timeLayout`, unused CSS/components; rewrite `README.md`.
- **T3.17** **M1 checkpoint**: `docs/reviews/M1.md` scoring App. D; fix list executed or logged.
- **T3.18** Layout tuning pass: use debug overlay + `layoutOverrides.json` to remove visual flaws in the 8 densest windows (e.g., 500–800 CE Mediterranean, 1200–1300 Mongol world, 1500–1800 Atlantic, 1900–2000 Europe/Africa/Asia fan-out). Record each override with a reason.
- **T3.99** Phase gate: Playwright + layout-report + perf green; tag `v2-p3-done`.
### P4 — Callouts, annotations & images (dep: P3)
- **T4.01** In-house pictogram set (≥ 24 SVG icons, 1.5 px stroke, consistent grid) + `Pictogram` component; replaces Lucide category badges.
- **T4.02** `Callout` component: year tag, title, ≤ 14-word blurb, pictogram or plate, importance sizing; leader lines.
- **T4.03** Wire `calloutPlacer`; Playwright DOM geometry test: zero intersections among callouts/labels at default zoom for all scenes.
- **T4.04** `media-src.json` schema + validator (license allowlist, `licenseApproved`, alt/caption/credit complete).
- **T4.05** `scripts/media/plan.ts` (**dry run, no downloads**): query institution open-access APIs (Met Open Access, Smithsonian Open Access, Rijksmuseum, Cleveland, NGA, Wikimedia Commons) for seed subjects in App. B "Callout seeds"; write candidate list with license data to `docs/media-curation.md` for review.
- **T4.06** Curate ≥ 120 candidates meeting §5 (region balance table, sensitivity check, depiction label). *Done when:* `media-src.json` validates.
- **T4.07** `scripts/media/fetch.ts` — **gated by `ALLOW_MEDIA_DOWNLOAD`**; HEAD check, sha256, cache in `media-cache/`; skips if switch off (`queued-gated`).
- **T4.08** `scripts/media/process.ts` (sharp): focal-point crop, plate treatment (−15% sat, +20% warm, grain, 1 px ink frame), AVIF+WebP at 128/320/960, dominant color; tested on synthetic images in `src/__fixtures__/`.
- **T4.09** `Plate` SVG component (blur-up, lazy by viewport, reserved box) and dossier-size `MediaFigure` with caption + credit.
- **T4.10** Credits generator + `#/credits` page + colophon text file for print.
- **T4.11** `npm run media:budget` — fails if thumbnails > 1.2 MB total or any > 10 KB.
- **T4.12** Place first 60 images; run geometry tests; tune. (`queued-gated` if downloads off; use pictograms.)
- **T4.99** Phase gate: geometry tests green; budget green (or gated); tag `v2-p4-done`.

### P5 — Interactions (dep: P3; P4 not required)
- **T5.01** zustand store + hash-URL (de)serializer (`#y=-221&z=1.4&sel=han&lens=trade&fold=…`) with round-trip tests; back/forward support.
- **T5.02** Search (small custom fuzzy index or MiniSearch if < 10 KB gz) + ⌘K/`/` dialog; supports names, altNames, years ("44 BCE"), callouts; `flyTo` + select; recents.
- **T5.03** Dossier v2: summary, dates + confidence, key facts, rulers, typed lineage chips, related callouts, media figure, sources list, verification chip; closed by default.
- **T5.04** Optional Wikipedia extract (abortable fetch, cache, failure UI, "From Wikipedia" label).
- **T5.05** Crosshair/scrubber + lock; snapshot **popover** (importance ≥ 3 per macro-region) — replaces the permanent bottom strip.
- **T5.06** Optional time-lapse; reduced-motion disables it.
- **T5.07** Lenses (importance re-weighting + arcs layer + UI).
- **T5.08** Trade/migration arcs (static hairlines; hover highlight; active-lens emphasis).
- **T5.09** Fold/pin families and macro-regions with animated re-layout (≤ 300 ms, keyframe interpolation).
- **T5.10** Presets migrated (16) + user-defined compare sets.
- **T5.11** Story Mode engine (waypoint → camera + lens + highlight + narrative card ≤ 70 words + sources) + 3 migrated tours.
- **T5.12** Table view (virtualized, sortable, filters) with ARIA table semantics.
- **T5.13** Keyboard navigation (tab order time→x), focus management, skip links, `prefers-reduced-motion` everywhere.
- **T5.14** Mobile: bottom-sheet dossier, collapsed toolbar, pinch zoom, "Era reading mode"; Playwright mobile scenes.
- **T5.15** Custom milestones migrated; dashed-outline styling; storage in try/catch.
- **T5.16** `@axe-core/playwright` scripted checks across scenes; fix all serious/critical.
- **T5.17** **M2 checkpoint** (`docs/reviews/M2.md`).
- **T5.20** Remove `lucide-react` if unused; bundle-size check (< 400 KB gz JS).
- **T5.99** Phase gate; tag `v2-p5-done`.

### P6 — Content depth, six era passes (dep: P1 skeleton, P3 renderer; may run in parallel with P4/P5 in Lane B)
**Pass template (apply to each pass; each sub-step is its own commit):** (a) prose: `summary ≤ 60 words`, `keyFacts` 2–4, rulers where meaningful; (b) refine relations + `share`; (c) callouts (≥ target) with ≤ 14-word blurbs; (d) bands; (e) importance/weight tuning with layout report; (f) **verification pass**: cross-check importance ≥ 4 entries against ≥ 1 listed source, fill `evidence`, upgrade `verification`; (g) region/era notes (`EraRegionNote`) ← adapt Gemini tables, rewritten; (h) tour(s); (i) accuracy checklist in `docs/reviews/<pass>.md` (dates, spellings, diacritics, relation sanity, captions); (j) layout-report + shots; fix overrides.
- **T6.01 Pass 1 — 1800–2000 CE** (min 70 entries; the nation-state fan-out). Must include: Americas republics (Mexico, Central America, Gran Colombia successors, Peru, Bolivia, Chile, Argentina, Uruguay, Paraguay, Brazil Empire→Republic, Haiti, Cuba, USA expansion, Canada); Europe (France republics/empires, UK, Germany/Prussia/Weimar/Nazi/East–West, Italy, Austria-Hungary and successors, Russia/USSR/successors, Ottoman successors in Balkans, Scandinavia, Iberia, Poland, Yugoslavia, Czechoslovakia); Africa (Egypt, Ethiopia, South Africa, partition colonies → independence waves 1950s–60s, key states); West/Central Asia (Turkey, Iran, Iraq, Saudi, Israel, Gulf, Afghanistan, Central Asian republics); South Asia (Raj → India/Pakistan/Bangladesh/Sri Lanka/Nepal); East Asia (Qing → ROC/PRC/Taiwan, Japan Empire, Koreas, Mongolia); SE Asia/Oceania (Indochina colonies → Vietnam/Laos/Cambodia, Thailand, Burma, Malaysia, Indonesia, Philippines, Australia, NZ, Pacific states). Bands: Industrial Revolution, WWI, WWII, Cold War, decolonization waves. Tours: *Industrial transformation*, *Decolonization*.
- **T6.02 Pass 2 — 1500–1800** (min 55): Spanish/Portuguese/Dutch/French/British empires, Atlantic world, gunpowder empires (Ottoman, Safavid, Mughal), Ming→Qing, Tokugawa, Joseon, Ayutthaya/Dai Viet, African states (Songhai→Moroccan, Kongo, Oyo, Asante, Benin), HRE/Habsburgs, Russia, Poland–Lithuania, Sweden. Bands: Age of Discovery, Reformation, Scientific Revolution, Enlightenment, Little Ice Age. Tours: *Columbian Exchange*, *Atlantic slavery & abolition*.
- **T6.03 Pass 3 — 500–1500 CE** (min 55 + 45): successor kingdoms, Byzantium, caliphates, Mongols & khanates, Seljuks/Mamluks/Timurids, Delhi Sultanate/Cholas/Vijayanagara, Tang/Song/Yuan/Ming, Heian/Kamakura, Khmer/Srivijaya/Majapahit, Sahel & Swahili states, Great Zimbabwe, Mississippian/Puebloan, Aztec/Inca/Maya postclassic. Bands: Western Dark Ages, Islamic Golden Age, Medieval Warm Period, Black Death. Tours: *Islamic Golden Age*, *Mongol connection*.
- **T6.04 Pass 4 — 600 BCE–500 CE** (min 55 + 40): Achaemenid→Seleucid/Parthian/Sasanian, Greece/Macedon/Hellenistic, Rome, Carthage, Celts, Qin/Han/Three Kingdoms, Maurya/Kushan/Gupta, Kush/Aksum, Nazca/Moche/Teotihuacan/Maya Classic, Korea/Japan origins, Funan/Dong Son. Bands: Axial Age, Hellenism, Roman climate optimum, Plague of Justinian/536. Tours: *Axial Age*, *Silk Roads*.
- **T6.05 Pass 5 — 2000–600 BCE** (min 40 + 55 portion): Middle/New Kingdom, Hittites, Assyria/Babylon, Minoan/Mycenaean, Bronze Age Collapse & Sea Peoples, Phoenicia/Israel, Vedic/Mahajanapadas, Shang/Zhou, Olmec/Chavín/Poverty Point, Kush, Nok, Jōmon/Yayoi, Lapita. Bands: Bronze Age Collapse, Greek Dark Ages, Iron Age transition. Tour: *Bronze Age Collapse*.
- **T6.06 Pass 6 — 3300–2000 BCE** (min 35): Uruk/Sumer/Akkad/Ur III, Early Dynastic–Old Kingdom Egypt, Indus, Norte Chico, Neolithic China (Liangzhu/Longshan), Minoan origins, Megalithic Europe, Austronesian origins, Kerma. Bands: 4.2 ka event. Tour: *Writing independently invented* (Mesopotamia, Egypt, China, Mesoamerica, Indus problem).
- **T6.07** Extra tours to reach ≥ 10: *Steppe vs settled*, *Religion & philosophy across Eurasia*, *Seas & routes (Indian Ocean/Pacific/Atlantic)*, *Cities that reshaped the world* (as chosen).
- **T6.08** Climate/pandemic dataset (`climate.json`, `pandemics` bands) cross-checked and cited.
- **T6.09** Re-run `validate:data`, coverage, `UNVERIFIED.md`; reduce unverified importance ≥ 4 to 0.
- **T6.99** **M3 checkpoint** (`docs/reviews/M3.md`): counts vs §7 targets, accuracy sampling (≥ 10% per era), layout/perf rerun; tag `v2-p6-done`.

### P7 — Print & reference export (dep: P3, P4 images optional)
- **T7.01** `?print=1` route: static render at fixed physical sizes, no UI, all labels forced to print minimums (§4.5).
- **T7.02** `scripts/export-pdf.ts` (Playwright `page.pdf`): Letter 8.5×11, Tabloid 11×17, Poster 24×36; embed fonts; verify with `pdffonts`.
- **T7.03** Bleed (0.125 in) + optional crop marks for 24×36.
- **T7.04** `scripts/check-pdf.ts`: min stroke, font embedding, image dpi (`pdfimages -list`), page size; fails below §4.13/§5.7.
- **T7.05** Reference pages generator (HTML templates → PDF): era × macro-region tables from `EraRegionNote` + sources list + reading key + credits colophon (the regenerated "Expanded Reference").
- **T7.06** `npm run export:all` → `dist-print/` (gitignored) + `manifest.json`.
- **T7.07** `docs/PRINT_QA.md` checklist (zoom 400%, label legibility, color proof advice).
- **T7.99** Phase gate; tag `v2-p7-done`.

### P8 — Optional (only if `MAX_PHASE ≥ 8` and Kevin asks)
- **T8.01** Deep Prehistory toggle (10,000–3300 BCE) with its own roster and bands.
- **T8.02** Schematic locator map (Natural Earth land only, influence circles; **no invented borders**); check any boundary dataset's license (some are GPL) before use.
- **T8.03** Deployment prep (`vercel.json` if needed) — **do not deploy** unless `ALLOW_DEPLOY=true`.

### P9 — Finish
- **T9.01** `README.md` rewrite (what/why/run/export/data protocol/credits).
- **T9.02** `docs/LICENSES.md` — dependency license audit (`license-checker` or `npm ls --json`), fonts (OFL), data/media licenses; flag anything copyleft.
- **T9.03** **M4 release candidate**: full `npm run check`, `shots`, `perf`, `layout:report`, `media:budget`, axe; `docs/reviews/M4.md`.
- **T9.04** `docs/HANDOFF.md` per §13.14; final `CONTEXT.md`.
- **T9.05** Final git summary: branches, tags, commits, **pushes = 0, CI runs = 0** (unless `ALLOW_PUSH`).

---

## Appendix F — `.cursor/rules/chronos.mdc` (create verbatim in T0.05; `alwaysApply: true`)
```
---
description: Chronos Atlas v2 — always-on rules for long autonomous runs
alwaysApply: true
---
# Mission
Build Chronos Atlas v2 per docs/CURSOR_PLAN.md (the full plan; Appendix E is the task queue). Work through Appendix E top-to-bottom without waiting for confirmation.

# Every session, first
1. Read docs/RUN_CONFIG.md, tail of docs/PROGRESS.md, docs/DECISIONS.md titles, docs/CONTEXT.md.
2. git status; git log -10; npm run check.
3. Take the first `todo` task whose deps are done and whose phase ≤ MAX_PHASE.

# Every task
Tests first for pure logic → implement → npm run check + task verification → commit locally (`Txx.yy: …`) → update PROGRESS.md with evidence. Tree must be green at each commit.

# Hard rules
- NEVER push, deploy, publish, or change remotes unless RUN_CONFIG allows it. NEVER add GitHub Actions.
- NEVER download media unless ALLOW_MEDIA_DOWNLOAD=true. Never use unlicensed or AI-generated images.
- NEVER invent sources, URLs, accession numbers, quotes, or dates. Unsure → confidence:'debated' or omit; verification:'unverified'.
- NEVER trace or copy the reference poster; all data, prose, images, coordinates are our own.
- Don't weaken tests/validators/design-lint to get green. No @ts-ignore/any without a DECISIONS entry.
- Don't stop to ask: log in docs/QUESTIONS.md, apply the default, continue. 3 failed attempts → log Blocked and move on.

# Design & code
- Follow docs/DESIGN.md (§4 design, §5 image principles). Colors/fonts only from tokens.css. Min font sizes enforced.
- Layout code in src/layout is pure (no DOM/React). Files ≤ 400 lines. Strict TypeScript.
- BCE negative, no year 0; use src/lib/years.ts helpers only.
- Data: every entity has sourceIds, confidence, importance, verification. Summaries ≤ 60 words; callout blurbs ≤ 14 words; original prose.

# Output hygiene
Small commits, descriptive messages, no giant diffs. Keep docs/CONTEXT.md current. End of run: docs/HANDOFF.md.
```

---

## Appendix G — Constants & pseudocode (starting values; tune, but log changes)

**Coordinate system (design units = CSS px at zoom 1).**
```
DESIGN_WIDTH   = 1500     LEFT_GUTTER = 84    RIGHT_GUTTER = 84    PLOT_WIDTH = 1332
TOP_PAD        = 120      BOTTOM_PAD  = 96
PX_PER_YEAR    = 0.62     // 3300 BCE → 2000 CE ≈ 3,290 px of plot height
T(year)        = year < 0 ? year + 1 : year          // continuous time; −1 → 0, 1 → 1
Y(year)        = TOP_PAD + (T(year) − T(−3300)) × PX_PER_YEAR × zoomY
MIN_RIBBON_W   = 12  MAX_RIBBON_W = 92  MIN_GAP = 6  MAX_DRIFT = 0.35 (x px per y px)
MIN_TRANSITION = 60 px  LABEL_MIN_H = 44 px  LABEL_FONT = 10…15 px (§4.5)
CALLOUT_W = 132  THUMB = 56  LEADER_STROKE = 0.75  GRID_MAJOR = 500 yr  GRID_MINOR = 100 yr
Ribbon width: w = MIN + (MAX − MIN) × weight          (weight ∈ [0.05, 1])
Default view: scale = viewportWidth / DESIGN_WIDTH (clamped 0.8…1.6); vertical scroll; Overview = scale to fit height.
```
**projectX knots (longitude° → poster x∈[0,1]; monotone piecewise-linear; tune in geography.json).**
`−125→0.00, −95→0.06, −75→0.13, −35→0.19 (Atlantic gap), −10→0.22, 10→0.34, 30→0.45, 45→0.55, 60→0.63, 80→0.71, 100→0.79, 120→0.88, 145→0.96, 180→1.00`
(South hemisphere uses the same longitude map; poster-x ignores latitude; per-family `xBias` and per-polity `xOverride` handle crowding.)

**laneSolver (per time slice; slices ordered top→bottom).**
```
for slice in slices:
  A = active(slice)                          // polities with start <= slice.start && end >= slice.end
  desired[p] = projectX(p, slice.mid) × PLOT_WIDTH + LEFT_GUTTER
  seed x[p]  = prev.x[p] if p existed else (parent.x[p] + splitOffset) if has inbound split else desired[p]
  order      = stableOrder(prevOrder ∩ A, newcomers inserted by desired x; ties: family, id)
  mass[p]    = 0.5 + weight[p] + 0.25 × importance[p]
  repeat ≤ 40 times until maxOverlap < 0.5:
     for each adjacent pair (a,b) in order:
        need = (w[a] + w[b]) / 2 + MIN_GAP ; overlap = need − (x[b] − x[a])
        if overlap > 0: x[a] −= overlap × mass[b]/(mass[a]+mass[b]) ; x[b] += overlap × mass[a]/(mass[a]+mass[b])
     for p in A: x[p] += 0.15 × (desired[p] − x[p]) / mass[p]       // gentle pull to geography
     clamp x[p] to [LEFT_GUTTER + w/2, LEFT_GUTTER + PLOT_WIDTH − w/2]
  drift limit: |x[p] − prev.x[p]| ≤ MAX_DRIFT × slice.heightPx; excess is deferred (add intermediate keyframe at slice.start + MIN_TRANSITION)
  emit keyframes (y = Y(slice.start), x[p]) for every p
```
**Connector flow conservation (split P → C₁…Cₙ with shares s₁…sₙ, Σ s ≤ 1).** Divide P's end edge `[x−w/2, x+w/2]` left→right (ordered by child x) into segments `wᵢ = w_P × sᵢ`; each child's start width = `min(w_Cᵢ, wᵢ)`; draw cubic Béziers with vertical tangents and control y at the midpoint of `[P.endY, Cᵢ.startY]`; if `Cᵢ.startY < P.endY` (overlap, e.g., conquest of a surviving state) attach to the parent's *side edge* at `Cᵢ.startY`. Merge is the mirror image.

**labelFit(name, shortName, box).**
```
for text in [name, shortName]:
  orient = box.h >= 1.4 × box.w ? 'rotated' : 'horizontal'
  for size from min(15, 0.62 × box.thickness) down to 10:
      if measure(text,size) <= box.length − 8: return {text, size, orient}
ellipsize at last word boundary that fits at size 10; else return null (hover-only label)
```
**calloutPlacer scoring.**
```
candidates = for side in [right, left] × dy in [0, −24, +24, −48, +48, −72, +72]
score = 10×importance − 0.2×|dy| − 0.05×distToRibbonEdge − 1000×collisions(rbush) − 500×overlapsRibbonLabel − 100×crossesLeader
place greedily by descending importance; if best has collisions: importance ≥ 4 → marker dot + hover card; else drop
```
**Typography scale (px at zoom 1):** ribbon label 10/11/12/13/15 by importance 1–5; tick 10; callout title 11/12; callout year 10; era gutter 12 caps tracked; title band 34.

---

## Appendix H — Test fixtures (store in `src/layout/__fixtures__/`; keep each ≤ 60 lines JSON)
- **A — Split:** Roman Republic → Roman Empire (27 BCE) → Western Roman (395–476) + Eastern Roman (395–1453). Assert: 2 split connectors, widths conserved, order stable (West left of East), 0 overlaps.
- **B — Multi-zone empire:** Mongol Empire (1206–1368) anchored E Asia → Central Asia → Persia → Rus'; splits into Yuan, Ilkhanate, Chagatai, Golden Horde. Assert: single wide ribbon tapering at zone edges; 4 child connectors; label fits.
- **C — Dense fan-out:** 8 parents → 60 modern states 1800–2000. Assert: 0 overlaps; min width ≥ 12; ≥ 85% labels fit or have leaders; runtime < 100 ms.
- **D — Uncertain start:** Olmec (±150 yr) → fuzzy cap geometry present; gradient id stable.
- **E — BCE/CE boundary:** polity −5…5 → height = 9 years×PX; `Y(−1)` and `Y(1)` differ by exactly 1 year of px.
- **F — Merge:** Castile + Aragon → Spain (1479/1516 note); assert merge connector, no crossing.
- **G — Conquest overlap:** Achaemenid conquers Neo-Babylonian (539 BCE) while target ribbon continues thinner; assert conquest connector attaches to side edge.
- **H — Label/short ribbons:** very short-lived polities (< 40 px) → outside label with leader; ellipsis behavior; diacritics preserved.
- **Property tests:** for 200 random seeds (random but valid rosters ≤ 120 ribbons): determinism, 0 overlaps, bounds, monotone y keyframes, no NaN, runtime budget.

---

## Appendix I — File templates (create in T0.04)

**`docs/RUN_CONFIG.md`** (Kevin edits this file; Cursor only reads it)
```
# Run configuration — edit values, save, continue
MAX_PHASE=7                  # highest phase Cursor may start (0–9)
ALLOW_MEDIA_DOWNLOAD=false   # true = fetch images listed in reviewed media-src.json from open-access sources
ALLOW_PUSH=false             # true = push branches/tags to origin (still no workflows, still once per phase)
ALLOW_DEPLOY=false           # true = deploy; requires a named target below
DEPLOY_TARGET=               # e.g. vercel-preview
ALLOW_BIG_DEPS=false         # true = permit runtime deps > 50 KB gz
CC_BY_APPROVED_IDS=          # comma-separated media ids Kevin approved despite attribution/share-alike
```
**`docs/PROGRESS.md`**
```
# Progress ledger (append-only; newest at bottom)
| Task | Status | Commit | Evidence (command → result) | Minutes | Notes |
## Blocked
| Task | Tried | Error | Hypotheses | Unblock needs |
```
**`docs/DECISIONS.md`:** `## YYYY-MM-DD — Title` / Decision / Alternatives / Why / Reversible? (y/n).
**`docs/QUESTIONS.md`:** `## Q-nn — Question` / Why it matters / Default applied / Affects tasks.
**`docs/UNVERIFIED.md`:** generated by `npm run report:unverified` (do not hand-edit).
**`docs/CONTEXT.md`:** ≤ 1 page — architecture map, commands, conventions, gotchas, current phase, next 3 tasks.
**`docs/reviews/<id>.md`:** rubric table (Appendix D items) with pass/partial/fail, evidence links (shots, report JSON), fix list, decision to proceed.
