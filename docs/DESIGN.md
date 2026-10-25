# Design

Copied verbatim from `docs/CURSOR_PLAN.md` §4 and §5. If this file and the plan disagree, the plan wins until a decision says otherwise.

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

