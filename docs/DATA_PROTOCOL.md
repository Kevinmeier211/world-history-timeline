# Data protocol

Copied verbatim from `docs/CURSOR_PLAN.md` §7, §13.7, and §15.


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

**13.7 Content at scale (accuracy rules — the biggest quality risk).**
- Every polity/relation/callout carries `verification: 'unverified' | 'cross-checked' | 'primary-checked'` and a short `evidence` note (e.g., "Met Essay *Mauryan Empire*: 322–185 BCE").
- You may draft from your own knowledge, but it stays `unverified` until you **actually consulted** a listed source (with a working URL) and recorded `evidence`. **Never invent sources, URLs, accession numbers, or quotes.** If you cannot verify a date, use `confidence: 'debated'` + `dateNote` with the competing range, or omit the entry.
- `npm run report:unverified` writes `docs/UNVERIFIED.md` (counts by era/family/importance). Goal by end of P6: **100% of importance ≥ 4 entries `cross-checked`**; everything else visibly flagged in the dossier ("Not yet cross-checked" chip) for Kevin's review.
- Prose is original; summaries ≤ 60 words; no copied sentences from any source; describe peoples as well as states.
- Image URLs must return HTTP 200 and a matching license record before entering `media-src.json`.

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
