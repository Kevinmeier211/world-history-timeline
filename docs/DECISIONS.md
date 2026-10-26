# Decisions

Local, reversible choices consistent with the plan. Format: date, decision, alternatives, why, reversible.

## 2026-10-25 — Phase branches stay on the names in the plan

Decision: Work lands on `v2/p0-tooling`, then `v2/p1-data`, and so on. Completed phases merge with `--no-ff` into `v2/main`. `main` is not touched.

Alternatives: A single `cursor/…` branch for the whole run.

Why: Kevin named these branches in the approved plan and in the run instructions. `ALLOW_PUSH` is false, so the branches stay local.

Reversible? y

## 2026-10-25 — `@types/node` for configs and scripts

Decision: Dev-dependency `@types/node` is installed so `vite.config.ts` and later `scripts/` can import Node builtins under `tsc -b`.

Alternatives: Keep configs out of `tsc` and use URL-only aliases with no Node import.

Why: T0.07 requires `tsc -b` to typecheck the Vite and Playwright configs, and every later script is TypeScript on Node. This is not a runtime dependency and is under the size switch.

Reversible? y

## 2026-10-25 — Design lint skips v1 until it is deleted

Decision: `scripts/design-lint.ts` does not scan `index.html` or the v1 app (`src/App.tsx`, `src/main.tsx`, `src/components/`, `src/styles/app.css`, `src/utils/`). The five §13.6 rules still run on every other file, and unit tests cover each rule.

Alternatives: Fail `design:lint` on v1 now, or loosen the rules so the current CSS passes.

Why: T0.11 still needs an untouched v1 screenshot, and T3.01 / T3.16 are the tasks that remove Google fonts and the old canvas. The allowlist is a constant asserted by a test so it cannot grow quietly.

Reversible? y

## 2026-10-25 — Year 0 is invalid data, and endpoints are explicit

Decision: Schema years reject `0`. Alternative political ends (Safavid 1722/1736 and the like) go in optional `endpoints` notes instead of a second silent `end`.

Alternatives: Allow `0` and map it only at display time. Store one end and mention the other only in prose.

Why: The date policy says display has no year 0 and debated ends must not be chosen silently. Rejecting `0` in the schema makes the mistake fail validation.

Reversible? y

## 2026-10-25 — Lineage hues stay near Appendix A, lightness moves for contrast

Decision: `families.json` keeps each Appendix A hue within about 30 degrees, then changes lightness and chroma until every neighbor pair (families that share an `xZone`) has ΔE2000 ≥ 12 in normal vision and in deuteranopia, protanopia, and tritanopia, and each fill has a label contrast ≥ 4.5 against either ink or paper in both themes.

Alternatives: Keep the exact Appendix A hex values and drop the contrast rule. Compare every family pair, including ones that never sit next to each other.

Why: Several starting swatches (Chinese red, Levantine purple, Latin purple) cannot hold 4.5:1 type in either ink or paper. Neighbor-only comparison matches the rule that color must separate ribbons that can touch. Exact hex values that fail the gate are not usable.

Reversible? y

## 2026-10-25 — Local culori types instead of `@types/culori`

Decision: `src/types/culori.d.ts` declares the four functions the palette check calls. `@types/culori` is not installed.

Alternatives: Keep `@types/culori` and cast through `any`.

Why: Those published types make `differenceCiede2000()` a union too large for `tsc` to represent (`TS2590`). A narrow local declaration typechecks the calls we actually make.

Reversible? y

## 2026-10-25 — v1 data barrel moved to `legacy.ts`

Decision: `src/data/index.ts` is the v2 catalog entry. The previous barrel lives in `src/data/legacy.ts` and is re-exported so the v1 app keeps compiling until T3.16.

Alternatives: Replace the barrel now and update every v1 import. Leave the v2 catalog under a second filename.

Why: The plan names `src/data/index.ts` as the loader. Keeping the v1 names exported avoids a broken chart before the renderer swap.

Reversible? y

## 2026-10-25 — Validator warnings versus errors

Decision: Schema failures, duplicate ids, missing endpoints, a relation year outside a life ± 50 years, and missing source or media ids are errors. A polity with no inbound relation, a pre-1000 BCE polity with fewer than two sources, an empty source URL, and an importance ≥ 3 entry whose only citations are Wikipedia are warnings. The adjacent-lane color rule (>25% of touching pairs share a hex) is implemented and unit-tested; `validate:data` does not invent lane pairs, and prints that the check waits for the layout report.

Alternatives: Fail the build on orphans and single ancient sources now. Skip the color rule until T2.

Why: §6.3 says errors fail and warnings print. Orphans are cleared in T1.28, second ancient sources arrive as the roster is sourced, and lanes do not exist until the solver. The color function is already strict so the later call site cannot quietly drop the gate.

Reversible? y

## 2026-10-25 — `sources.json` is one object per line

Decision: `src/data/sources.json` is a JSON array with one source per line, and Prettier ignores that file. `scripts/write-sources-md.ts` regenerates `LICENSES/SOURCES.md`.

Alternatives: Let Prettier expand each object, which pushes the file past 400 lines. Split the bibliography across several JSON files.

Why: T1.07 names a single `sources.json`. The line cap still applies. A test checks that the markdown matches the generator.

Reversible? y

## 2026-10-25 — v1 columns map to families, with lineage overrides

Decision: `scripts/migrate-v1.ts` reads polities from tag `gemini-v1` and writes one JSON file per family. The column default is: andean → andean; mesoamerica → mesoamerican; north_america → north_american; sub_saharan_africa → sub_saharan; western_europe → latin_west; eastern_med_europe → greek_byzantine; egypt_levant → nile_egyptian; mesopotamia_persia → persian_iranian; indus_india → indian; china_east_asia → chinese; austronesia_japan_sea → southeast_oceanian. These ids override that default: megalithic_celts and british_empire → celtic_germanic_norse; russia_soviet → slavic_steppe; hittites, sumer_akkad, babylon_assyria, and neo_assyria_babylon → mesopotamian; phoenicia_israel → levantine_semitic; ptolemaic_seleucid → greek_byzantine; umayyad_abbasid and ottoman_empire → islamic_arab; mongol_empire → turkic_mongol; korea_dynasties and japan_timeline → korean_japanese. Every row is `verification: unverified`, `confidence: approximate`, importance 3. v1 `mapCenter` values are schematic pixels, so anchors store `xKey` = the v1 region id and do not invent longitude. Two `sources.json` ids are bibliography pointers, named in `evidence`, not checked citations. Parent links wait for T1.28, so orphan warnings are expected.

Alternatives: Keep each row in its v1 column family. Copy the pixel pairs into `geo`.

Why: Several v1 columns mix lineages (Mongols sit in the China column; Celts sit in Western Europe). Treating pixels as longitude would fail the coordinate bounds and place ribbons in the wrong ocean.

Reversible? y

## 2026-10-25 — v1 notes migrate at the tag's real counts

Decision: Nodes become callouts (zoom tier 1/2/3 → importance 4/3/2; blurb is the v1 significance clipped to 14 words). Cross-cutting bands, the six routes, three tours, and five presets are copied with `verification: unverified` where the schema has that field. Route waypoints store poster-x from the v1 column's geography zone, not longitude. The paleoclimate curve is `src/data/climate.json` and stays unverified. See Q-03 for the 9-route and 16-preset figures in the plan.

Alternatives: Add empty routes and presets until the counts match the plan sentence.

Why: Those extra rows are not in the tagged source. Inventing them would be new historical content.

Reversible? y

## 2026-10-25 — Checklist rows sit beside the v1 bundles

Decision: Appendix B entries that are not already a v1 id go in `src/data/polities/<family>-skeleton.json`. They stay `verification: unverified`, importance 2, and the summary is only the checklist label (≤ 30 words). `c.` ranges use `confidence: approximate`. Plain checklist years use `conventional`. A named cluster with no single year, such as Andean independence in the 1810s–1830s, starts at the edge of that band and ends at 2000, with that limit written in `dateNote`. Anchors use the same v1 column `xKey` as the migrated rows. v1 bundles such as `nazca_moche` stay, so a checklist split can share the chart until a later pass merges them. A family is checked against its Appendix E minimum only after its skeleton file exists.

Alternatives: Replace the v1 bundles in place. Invent years for names the checklist does not date.

Why: Callouts still point at the v1 ids. Deleting those ids would break validation. Undated names are left out rather than given a made-up span.

Reversible? y

## 2026-10-25 — Family minimums can add bounded gaps and a modern-era edge

Decision: When Appendix B's dated lines plus the migrated bundles are still under the Appendix E family minimum, add a debated row for an interval the checklist bounds on both sides and does not name. For a modern UN member that Section 15 includes and Appendix B never dates, use 1800–2000, `confidence: debated`, and a note that 1800 is the plan's modern-era edge. See Q-05.

Alternatives: Lower the family minimum. Invent a foundation year. Stop the family short of the gate.

Why: The minimum is a machine-checked gate. The era edge is a plan boundary, and the note stops it from being read as a historical start.

Reversible? y

## 2026-10-25 — Relations come from abutments, v1 parents, and named twins

Decision: `src/data/lineage.ts` is the generator. `scripts/write-lineage.ts` writes `src/data/relations/lineage-*.json` and `src/data/roots/roots-*.json`. A root reason must be at least 20 characters. A root that also has an inbound relation is an error. `scripts/lineage-data.test.ts` requires the JSON to match the generator. See Q-06.

Alternatives: Nearest-neighbor succession inside a family. Whitelist every polity. Place a v1 parent on a year that sits in neither span.

Why: Belgium is three years after Venice. A one-year gap while other rows are current would make Prussia succeed Habsburg Spain. The generator refuses both. Russian America and Canada share 1867, so that debated succession stays until a source is opened.

Reversible? y

## 2026-10-26 — The 3300–2000 BCE floor stays 35

Decision: T1.29 adds only the dated Appendix B span that was still missing (Old Kingdom 2686–2181 BCE) and three unnamed intervals the checklist bounds on both sides. `eraShortfalls` reports a short bin and does not fail `npm run check`. The §7 number 35 stays in `ERA_FLOORS`. The phase tag `v2-p1-done` waits until that bin meets 35. See Q-07.

Alternatives: Lower the floor to 26. Treat Yangshao and Longshan as sharing Liangzhu's years. Add cultures whose dates are not in Appendix B. Make the shortfall an error and stop the run.

Why: A red tree would block every later task. Inventing nine early spans would be a new historical claim. The report stays visible, and the test locks both the floor and the current count.

Reversible? y

## 2026-10-26 — Layout overrides are an empty pin-and-nudge file

Decision: `src/data/layoutOverrides.json` starts with empty `ribbons` and `callouts`. A ribbon row may pin poster-x keyframes and force a label to `along`, `horizontal`, or `outside`. A callout row stores `dx` and `dy` in poster pixels. Each row needs a reason of at least 8 characters. `validate:data` rejects an id that is not in the roster. T2.19 applies the file.

Alternatives: Store pins only on each polity's `xOverride`. Leave the file untyped until T2.19.

Why: The plan's escape hatch is a separate file, so a layout pass can record a reason without rewriting the roster. There is nothing to pin yet.

Reversible? y

## 2026-10-26 — Column keys enter projectX through a heartland longitude

Decision: `projectX` maps longitude through the geography knots, adds family bias, and clamps to [0, 1]. An `xOverride` span replaces that x between its pins, interpolated with `toT` so the missing year 0 is one year. An anchor that only has `xKey` uses a fixed heartland longitude: Andes −72, Mesoamerica −99, North America −90, Sub-Saharan Africa 10, Western Europe 2, Eastern Mediterranean 23, Egypt and the Levant 31, Mesopotamia and Persia 44, India 77, China 114, Japan and the Pacific 135. Those are layout defaults, not site coordinates.

Alternatives: Treat v1 `mapCenter` pixels as longitude. Leave `xKey` anchors unplaced until every polity has a geo anchor.

Why: The roster's anchors are column keys. The knots expect longitude. A named default keeps the projection monotone and testable.

Reversible? y

## 2026-10-26 — Twelve widely cited cultures close the early bin

Decision: Majiayao, Longshan, Jemdet Nasr, Early Dynastic Mesopotamia, Early Cycladic, Corded Ware, Bell Beaker, Naqada III, Yamnaya, Kura-Araxes, Los Millares, and Ebla are roster rows. Each uses a widely cited span, `confidence: approximate`, `verification: unverified`, and source ids already on that family. `v2-p1-done` stays untagged. See Q-07.

Alternatives: Leave the bin at 26. Lower `ERA_FLOORS` to 26. Copy Liangzhu's years onto Longshan.

Why: Kevin said Appendix B is a checklist, not a ceiling, and the 3300–2000 BCE floor of 35 has to be met before that phase is tagged. These spans are the standard archaeological ranges, and the notes say the pages were not opened.

Reversible? y

## 2026-10-26 — Drift hysteresis returns a quarter of each move

Decision: After the lane solver, `applyDrift` moves a continuing ribbon 75% of the way from its previous centerline toward the solved x, then caps the slant at `MAX_DRIFT` (0.35). A move that still does not fit inserts a keyframe `MIN_TRANSITION` (60) px down the slice. Appendix G's drift numbers are unchanged.

Alternatives: Use the solved x with only the drift cap. Spring inside every relaxation iteration.

Why: The plan asks for hysteresis so a small geographic change does not jitter the ribbon, and it does not give a coefficient. A quarter is enough to calm that noise and still lets a real move through. The cap stays the hard limit.

Reversible? y

## 2026-10-26 — Tag the data phase without moving v2/main

Decision: `v2-p1-done` points at `b4f3bea` only. That commit is not merged into `v2/main`. `v2/p2-layout` merges only when the P2 gate passes.

Alternatives: Merge `b4f3bea` into `v2/main`. Tag the current layout tip. Leave the phase untagged.

Why: `b4f3bea` descends from T2.01 and T2.02. A merge would put those unfinished layout commits on `v2/main`. The tag records the roster that meets every §7 floor. `v2/main` stays at the P0 merge.

Reversible? y

## 2026-10-26 — Migration connectors are dotted

Decision: Succession, split, and merge are solid. Conquest and vassalage are hatched. Cultural continuity and disputed use dash `4 3`. Migration uses dash `1 2.5` and is not hatched.

Alternatives: Draw migration as the continuity dash. Draw it solid. Omit a stroke until a later task.

Why: §6.4 names solid, hatched, and dashed groups and does not name migration. A dotted stroke keeps a migration from looking like succession or like a disputed claim. The uncertainty edge stays `1.5 2.5`.

Reversible? y

## 2026-10-26 — Short ribbons label outside below 40 px

Decision: A ribbon shorter than 40 design px gets a horizontal label beside it and a hairline leader. The outside box is 72 by 18. The right side is used until the label would pass the plot edge. Appendix G `LABEL_MIN_H` stays 44 and is not this switch.

Alternatives: Switch at 44. Always label inside. Always put the label on the left.

Why: Fixture H says a ribbon under 40 px takes an outside label. An 18 px box is the smallest height that still reaches the 10 px font under the 0.62 thickness rule. A 72 px width forces a long name onto a word-boundary ellipsis.

Reversible? y

## 2026-10-26 — Callout cards are 132 by 48

Decision: A callout card is 132 by 48 design px, 4 px off the ribbon edge. Candidates and the score are Appendix G. Cards and ribbon labels stay 4 px apart. A thumbnail is 56 px on the outer side. When every slot collides, importance of 4 or 5 becomes a marker dot and a lower importance is dropped.

Alternatives: Invent a taller card. Treat a leader crossing as a hard collision. Place low importance before high.

Why: Appendix G sets the width, the offsets, and the score, and it does not set the height. 48 px holds a title and a year. The 4 px gap is the label clearance in §4.7. Greedy order is descending importance.

Reversible? y

## 2026-10-26 — Overview hides importance below a zoom floor

Decision: `importanceThreshold` is 1 at zoom 1.6, 2 at 0.8, 3 at 0.45, 4 at 0.25, and 5 below that. Zoom 1 therefore keeps importance 2. Grouped polities collapse below zoom 0.85. The crossfade is 0.08 zoom units on either side. A collapsed ribbon spans the members' earliest start to their latest end.

Alternatives: Hide by count instead of importance. Collapse only the Chinese group. Fade over a fixed pixel band.

Why: §6.4 names a zoom threshold and a group collapse, and it does not give the numbers. Zoom 1 is the poster default, and almost every roster row is importance 2, so that zoom has to keep them. Lower zoom still drops to the important rows and the collapsed groups.

Reversible? y

## 2026-10-26 — Crowded slices drop the least important ribbons

Decision: A slice whose minimum widths do not fit the plot drops the lowest importance until they do. An importance tie keeps the earlier id. The solver makes 8 geographic passes, then a hard pack restores the gap. A centerline sample within 1 px of the chord is dropped.

Alternatives: Draw every ribbon and allow overlaps. Shrink below the 12 px minimum. Run all 40 pull passes on every slice.

Why: The busiest slice holds 87 ribbons, and even the minimum width does not fit in 1332 px. Appendix G stops at 40 passes or when the overlap is under 0.5 px. The hard pack meets that bound when the slice fits. Eight pull passes still leave a heavier ribbon closer to its desired x.

Reversible? y

## 2026-10-26 — A spread chain that does not fit is tightened

Decision: After the minimum gaps are enforced, the chain is shifted into the plot. If the gaps are still too wide for the plot, the ribbons are packed tight from the left edge.

Alternatives: Leave the overflow past the right gutter. Shrink ribbon width below the 12 px floor.

Why: A loose chain can satisfy every adjacent gap and still stick out of the plot. Sliding it back in then pushes the other end out again. Tightening is the pack that fits when the minimum footprint fits.

Reversible? y

## 2026-10-26 — Drawn spans stay inside the reserved lane

Decision: A multi-zone span is drawn no wider than the lane width reserved for that ribbon. `wideRibbon` still reports the geographic outer width for its own tests.

Alternatives: Reserve the geographic width in the solver. Draw the wide span and allow it to cover the neighbors.

Why: A span from Europe to East Asia is hundreds of px. The drift cap cannot open that corridor before the neighbors are covered. The overlap gate measures the drawn edges.

Reversible? y

## 2026-10-26 — Drift is packed again before the path is drawn

Decision: After drift, every keyframe y is packed in a stable left-to-right order. A ribbon that crosses that y is sampled there, so the segment between samples stays clear. Keyframe y is snapped to 0.01 px. The slant may exceed 0.35 on a short slice when that is what holds the gap.

Alternatives: Draw each slice as a vertical bar and break on every move. Drop the slant cap entirely. Leave the overlaps drift creates.

Why: Solved lanes do not overlap, and the slant cap then walks neighbors into the same column. The §6.4 gate counts drawn overlaps. Separation wins over the slant cap when both cannot be met.

Reversible? y

## 2026-10-26 — The layout report gates the warmed pass

Decision: `layout:report` prints the cold pass and the second pass. The runtime gate is the second pass, under 150 ms. A relation whose polity was not drawn is omitted, not unroutable. Unroutable means every endpoint is drawn and the curve is missing or empty.

Alternatives: Gate the cold pass. Count culled relations as unroutable.

Why: The cold pass pays for JIT and is not the steady layout. Culled ribbons are not on the poster, so their relations are not failed routes. The warmed roster pass is the §6.4 runtime bar.

Reversible? y

## 2026-10-26 — Layout overrides replace the pin and nudge the card

Decision: A ribbon row's `x` replaces that polity's `xOverride` for the whole layout. `along` forces a rotated label, `horizontal` forces a horizontal one, and `outside` forces a leader even on a tall ribbon. A callout `dx`/`dy` moves a placed card, its plate, and the leader's card end. The leader start stays on the ribbon. A dropped card is not moved.

Alternatives: Add the nudge before the collision search. Treat `along` as a second horizontal. Ignore a pin when the polity already has `xOverride`.

Why: The file is the hand-tuning hatch. A pin has to reach the solver, or the lane stays on the geographic x. A nudge after placement is what a person asked for; searching again would undo it.

Reversible? y

## 2026-10-26 — Layout coverage is enforced at 85 percent

Decision: `npm run test` runs Vitest with coverage. The threshold is 85% statements, branches, functions, and lines, and it includes only `src/layout`. A miss fails `npm run check`.

Alternatives: Count lines only. Leave the threshold off and print the number. Measure the whole `src` tree.

Why: The P2 gate asks for layout coverage of at least 85%. Branches were the short measure, at 79% before the extra cases. The rest of the app is still v1 and is not part of this gate.

Reversible? y

## 2026-10-26 — index.html is on the design lint

Decision: `index.html` leaves the design-lint allowlist. The Google Fonts stylesheet is gone. Barlow Condensed, Source Sans 3, and Source Serif 4 load from `@fontsource`. v1 CSS still names Inter, Cinzel, and JetBrains Mono; those faces are not fetched.

Alternatives: Keep the Google link until T3.16. Add fontsource packages for the v1 faces too.

Why: The poster type is self-hosted. A network font request fails the T3.01 check. Replacing every v1 face is T3.16, when that CSS is deleted.

Reversible? y

## 2026-10-26 — The poster shell is the default view

Decision: `main.tsx` renders `PosterApp`. The v1 stylesheet and `App` load only when the URL has `?v1=1`, which is where the baseline screenshots open. The masthead is "Chronos Atlas / States and peoples / 3300 BCE – 2000 CE". The theme control sets `data-theme` and does not write storage.

Alternatives: Leave v1 on `/` until the stage exists. Store the theme in this task.

Why: The old map, dossier, and snapshot bar are off the default path. The baseline command still has to reach the v1 tree. Persistence belongs to T3.12.

Reversible? y

## 2026-10-26 — Camera scale is uniform unless Shift is held

Decision: Wheel and pinch use the d3-zoom wheel factor and pointer anchor. Scale stays in 0.2–6. Fit-to-width uses Appendix G's 0.8–1.6 clamp. Overview may go below 0.8 so the whole sheet fits. Shift-wheel changes only the vertical scale. `flyTo` eases for at most 600 ms, and reduced motion jumps.

Alternatives: One scale at every gesture. Clamp overview to 0.8. Let a fly last longer than 600 ms.

Why: The default poster is one scale, and time can be stretched on purpose. A 5300-year sheet does not fit a short window at 0.8. The motion rule caps the flight.

Reversible? y

## 2026-10-26 — The stage scrolls in design pixels

Decision: The chart SVG uses a viewBox in Appendix G units. Its scale is the column width divided by the design width, capped at 1.6. A narrower column may go below 0.8 so the sheet does not scroll sideways. Vertical scroll of the frame is the camera's y. Geometry more than one viewport outside that window is not mounted.

Alternatives: Keep the 0.8 floor and scroll horizontally on a phone. Draw every ribbon and clip with overflow.

Why: The default reading is vertical. A 390 px screen cannot show 1,500 design px at 0.8 without a sideways scrollbar. The pad keeps a fast flick from popping empty bands.

Reversible? y

## 2026-10-26 — Era names sit in the design gutters

Decision: Era bands, gridlines, and year labels are drawn in the chart SVG. The names are rotated in the left and right design gutters. Tick spacing follows the sheet scale: 50/100 when large, 100/500 in the middle, 500 when small. The poster starts and ends are always labeled. There is no year 0.

Alternatives: Keep the HTML gutter columns and draw the bands only in the plot. Label every century at every scale.

Why: The HTML columns did not share the top pad, so the names missed the years. A phone-height sheet cannot hold a label every century.

Reversible? y

## 2026-10-26 — The watermark is one centered map

Decision: Natural Earth 110m land becomes one SVG path, centered in the plot, with longitude mapped through the poster knots. Land south of 58°S is dropped. The path is 4% ink, multiply in light and screen in dark, painted after the opaque era bands.

Alternatives: Stretch the map down the full sheet. Paint it under the bands.

Why: A full-height stretch smears the continents. Opaque era fills would hide a 4% map placed under them. `world-atlas` and `topojson-client` are dev dependencies; the path is generated, not fetched at runtime.

Reversible? y

## 2026-10-26 — Ribbon labels use the parchment ink pair

Decision: Each ribbon is a focusable button whose name is `formatRange` plus the family. The edge is the family fill darkened 18%. An uncertain start fades toward `--paper` and draws the dashed edge from the layout. Label fill is parchment ink or paper, whichever contrasts with the family color, because the family fill does not change in the night theme. The chart SVG is a group so those buttons stay in the tree. Off-window ribbons are not mounted.

Alternatives: Always use `--ink`. Keep `role="img"` on the chart.

Why: A dark ribbon needs light type in both themes. `role="img"` would hide the buttons from the accessibility tree.

Reversible? y

## 2026-10-26 — Connectors use the source family at 55 percent

Decision: Routed relations paint between the watermark and the ribbons. Succession, split, and merge are a solid fill at 55% of the source family color, with no stroke. Continuity, disputed, and migration are unfilled dashes (`4 3` or `1 2.5`). Conquest and vassalage add a diagonal hatch. The roster currently has succession, split, continuity, and disputed only.

Alternatives: Stroke every flow. Color a connector by its target.

Why: Section 4.4 asks for the same hue at 55% and a dash where the link is not a succession. The hatch is the non-color cue for conquest.

Reversible? y

## 2026-10-26 — Cross-cutting bands sit under the ribbons

Decision: Epoch, climate, pandemic, collapse, golden-age, and war bands paint after the watermark and before the connectors. A global band spans the plot. A regional band spans the union of its geography zones. Climate is a horizontal hatch, pandemic a dot hatch, collapse and war opposing diagonals. Epoch and golden age are a 6% ink wash. The six poster eras stay in the gutter guides. The title sits in the right gutter, rotated when the band is at least 48 px tall.

Alternatives: Paint the bands under the opaque era fills. Color each type with a new swatch.

Why: Section 4.8 puts these bands above the grid and below the connectors. A new swatch would leave the token set. The gutter keeps the title off the ribbons.

Reversible? y

## 2026-10-26 — Hover focuses a lineage

Decision: A pointer on a ribbon writes a small zustand focus: that family stays solid and every other ribbon eases to 25% over 200 ms. Reduced motion drops the ease. The tooltip shows the name, `formatRange` (so approximate dates keep "c."), a confidence glyph, and a verification dot. Ribbon fills do not take the pointer; the hit path does. The hash URL is still T5.01.

Alternatives: Dim only the hovered ribbon's siblings by id. Put the tooltip inside the SVG.

Why: Section 4.11 is a lineage focus, not a single-ribbon highlight. An HTML tooltip stays at 13 px when the sheet is scaled down.

Reversible? y

## 2026-10-26 — Zoom stays on the scrollport

Decision: The sheet opens at the column fit (multiplier 1). +/− and the zoom buttons scale around the viewport center, clamped to 0.2–6. Arrows, Home, and End pan the scroller. Past the column width the sheet grows so that overflow can be panned; Fit drops the extra width. The overview map is a 56 px copy of the ribbons with a focus-colored viewport rect, pinned to the scrollport with the buttons. A focused field ignores the shortcuts.

Alternatives: Leave the buttons at the bottom of the sheet. Zoom only the time axis. Take the wheel away from vertical scroll.

Why: A control at the end of a 3,500 px sheet is off-screen. Uniform zoom wider than the column clips the gutters unless the frame can scroll sideways. The wheel already moves through the years.

Reversible? y

## 2026-10-26 — The theme is stored on this browser

Decision: The theme control cycles system, light, and dark. The choice is written to `localStorage` under `chronos-theme`, inside try/catch. A missing, garbage, or blocked store stays on system. System removes `data-theme` so the OS preference applies. Ink and muted ink stay at least 4.5:1 on paper in both token sets. Family contrast stays on `palette:check`.

Alternatives: Keep the choice for the session only. Share v1's `color-scheme` key.

Why: A reload should open the atlas the reader left. v1's key belongs to the old shell. The night tokens are the ones in §4.2.

Reversible? y

## 2026-10-26 — The reading key uses our words

Decision: "How to read this" is a button on the title band. The panel is closed at rest. It explains width as prominence, color as lineage, faded tops, dashed links, c., and that peoples outlast states, then lists the 18 family swatches from `families.json`. Chart shortcuts do nothing while the dialog is open. None of the poster product's wording is copied.

Alternatives: Leave the key in the top bar. Draw the swatches by hand.

Why: Section 4.14 asks for the key one click away, and the bar is already the slim chrome. The family colors already live in data.

Reversible? y

## 2026-10-26 — Poster shots do not replace the v1 baselines

Decision: `npm run shots` runs `tests/e2e/p3-poster.spec.ts` and writes 21 frames to `docs/shots/p3/` (desktop, wide, and mobile × overview, ancient, classical, medieval, modern, focus, dark). The v1 spec and `docs/shots/v1/` stay as they are. A height-fit overview is centered in the frame. A sheet wider than the column stays west-aligned so sideways scroll starts at the left. On a short screen the era frames zoom until 2500 BCE, 100 CE, 1000 CE, and 1800 CE land at least 120 px apart.

Alternatives: Point `npm run shots` at both specs and regenerate v1. Leave the overview thumbnail in the left corner.

Why: T0.11 already accepted the v1 frames. Re-running that spec would replace them. A phone-height fit shows the whole axis in one window, so the era scenes have to zoom in or three of them are the same picture.

Reversible? y

## 2026-10-26 — Frame time is measured on a 300-ribbon bench

Decision: `npm run perf` opens `/?bench=300`, clones real ribbon paints until 300 are mounted, then pans and clicks zoom for about 150 frames. The score is the 95th percentile gap between animation frames. The budget is 20 ms. The public chart does not read `bench`. A run on this machine mounted 300 ribbons, p95 16.70 ms, worst frame 50 ms.

Alternatives: Time the 194-ribbon roster and call it enough. Ignore the worst frame by raising the percentile.

Why: The task asks for 300 ribbons. The roster has 194. Copying paints stresses the stage without inventing polities. p95 is the gate; the 50 ms frame stays in the log.

Reversible? y

## 2026-10-26 — The v1 canvas is gone

Decision: `src/App.tsx`, `src/components/`, `src/utils/timeLayout.ts`, `src/styles/app.css`, and `tests/e2e/v1-baseline.spec.ts` are deleted. `src/main.tsx` always mounts the poster. `?v1=1` no longer switches apps. The design-lint allowlist is empty. ESLint and Prettier still skip the v1 polity tables and `src/types`, which the lineage scripts and the catalog re-export still read. Baseline PNGs stay in `docs/shots/v1/`.

Alternatives: Keep `?v1=1` as a second app. Format the v1 data tables in this same commit.

Why: T3.16 removes the old canvas. Formatting those tables would mix a data cleanup into the deletion. The screenshots remain the T0.11 record.

Reversible? y

## 2026-10-26 — M1 is 5 of 11, so P4 stays closed

Decision: `docs/reviews/M1.md` scores Appendix D as 5 pass, 3 partial, 3 fail. Partials do not count. 45% is under 70%, so P4 does not start. The poster image was not available (Q-01). The misses are the overview's unreadably small labels, an incomplete fork story, 33 labeled polities at the 1900–2000 edge instead of 60, 11 cross-cutting bands instead of 12, no images, and 23 overlapping labels with callouts unpainted.

Alternatives: Count a partial as a pass and open P4. Treat the missing poster as a reason to skip the review.

Why: The checkpoint says to score honestly and to withhold P4 until at least 70% pass. Inventing the missing band, the missing states, or the missing images would fake the score.

Reversible? y

## 2026-10-26 — Dense-window labels move aside only when the name survives

Decision: `layoutOverrides.json` forces eight labels. Chalukya, Champa, the Etruscans, Goguryeo, Kofun, Kura-Araxes, and Nok sit beside the ribbon. The Mongol name runs along the ribbon. Fitted overlaps fall from 23 to 15. Every moved name is at least as long as before, importance-3 fit stays 69/69, and ribbon overlaps stay 0. The 1750–2000 crossings stay. Turning those labels horizontal replaces “England → British Empire & UK” with “England →…”. An Argentina x pin clears the United States label and lands on Bolivia instead.

Alternatives: Ellipsize the long names. Pin x anyway and accept a swapped collision. Leave the file empty.

Why: T3.18 asks for a recorded reason on a real flaw. Hiding the name is a different flaw. The lane solver treats a pin as a new desired x and snaps to the next open slot.

Reversible? y

## 2026-10-26 — The P3 gate passes and P4 stays closed

Decision: `npm run shots` passed on desktop, wide, and mobile. `layout:report` passed: 0 overlaps, 0 unroutable, importance-3 labels 69/69, warm 114 ms. `npm run perf` mounted 300 ribbons, p95 16.70 ms, worst frame 83.40 ms. Merge `v2/p3-poster` into `v2/main` with `--no-ff` and point `v2-p3-done` at that merge. Do not start P4. The next task is the hash URL.

Alternatives: Hold the merge until Appendix D reaches 70%. Open P4 on the pictogram path anyway.

Why: The phase gate is shots, the layout report, and the frame budget. M1 is a separate bar, and it blocks P4 only. P5 does not require P4.

Reversible? y

## 2026-10-26 — The hash stores the lens; the chart does not fly yet

Decision: `#y=-221&z=1.4&sel=han&lens=trade&fold=chinese` round-trips. The lens control writes that hash and keeps `y`, `z`, `sel`, and `fold`. Back and forward restore the lens. Those four fields do not move the camera, select a ribbon, or fold a family yet. Theme stays in `chronos-theme`, not the hash. Scrolling does not push a history entry.

Alternatives: Fly the camera from `y` and `z` in this same commit. Push a history entry on every scroll.

Why: T5.01 is the serializer and back/forward. A scroll entry would flood the session history. Camera, selection, and fold belong to the tasks that use them.

Reversible? y

## 2026-10-26 — Search is an in-memory index, and only a choice moves the chart

Decision: Search is a small scorer over polity names, alternate names, rulers, callout titles, and band titles. It does not add MiniSearch. A year such as `44 BCE` returns what is active then and scrolls to that year. A name scrolls to the polity's start and selects it. `/` and Ctrl/Cmd-K open the dialog. The choice pushes `y` and `sel`. Recents stay in component state, not localStorage. A ribbon click replaces `sel` and does not scroll. Scrolling never pushes history. `z` still does not zoom.

Alternatives: Add MiniSearch. Store recents in localStorage. Push a history entry on every scroll.

Why: The task allows a custom index. The plan stores only the theme and custom milestones in localStorage. A scroll entry would flood the session history.

Reversible? y

## 2026-10-26 — The dossier opens from a ribbon and shows no invented image

Decision: The dossier stays closed until a ribbon click. It shows the summary, dates, confidence, key facts, rulers, typed lineage, related notes, sources, and a verification chip. The figure says "No image is attached." No media row is on a polity, and downloads stay off. Escape closes the panel and leaves the selection. A click on empty paper clears the selection and closes the panel. Search does not open it. On a phone the panel is still a side sheet; the bottom sheet is T5.14.

Alternatives: Open the dossier from search. Draw a placeholder picture. Fetch a thumbnail.

Why: T5.03 asks for the panel and for it to be closed by default. An invented image would break the media rule.

Reversible? y

## 2026-10-26 — The Wikipedia extract is optional and labeled

Decision: A polity with `wikipediaTitle` shows a button labeled "From Wikipedia". The extract loads only after that click, from the English Wikipedia summary endpoint. A successful extract is cached. A failed or empty response is not cached, and the panel says "Wikipedia did not respond." Closing the dossier aborts the request. The loaded text sits under the heading "From Wikipedia". No image is fetched.

Alternatives: Fetch the extract as soon as the dossier opens. Cache failures. Download a thumbnail.

Why: T5.04 asks for an optional, abortable extract with a failure state and that label. Media downloads stay off.

Reversible? y

## 2026-10-26 — The year snapshot opens only when the crosshair is locked

Decision: A horizontal line follows the pointer and names the year under it. The snapshot stays closed until Lock year. It lists every macro-region and, in each, the importance ≥ 3 polities active that year: the family's region, plus any span that covers the year. Importance below 3 is omitted. Choosing a name selects that ribbon and opens the dossier. Unlock closes the snapshot and leaves the line. There is no permanent bottom strip. The line is not a dialog, so search still opens with `/`.

Alternatives: Keep an 11-card strip on screen. Open the snapshot on hover. Include every polity, including importance 2.

Why: T5.05 replaces the permanent strip with a locked popover of the states that matter in each region. Chrome at rest stays the top bar.

Reversible? y

## 2026-10-26 — Time-lapse steps the locked year, and reduced motion disables it

Decision: Play sits on the crosshair. It locks the year, then advances 25 years at a time, skipping year 0, and stops at 2000. The chart scrolls to keep that year in view, and the snapshot follows. Pause and Unlock stop the run. When `prefers-reduced-motion` matches, or when `matchMedia` is missing, Play is disabled and no timer starts.

Alternatives: Animate every year. Leave Play enabled and jump instantly under reduced motion. Run the lapse without locking the snapshot.

Why: T5.06 asks for an optional time-lapse that reduced motion disables. A 25-year step is readable. The missing-`matchMedia` case matches the fly, so tests do not animate.

Reversible? y

## 2026-10-26 — A lens re-weights the chart and reveals its arcs

Decision: All leaves every layer at full opacity and draws no arcs. Trade emphasizes trade and migration routes and reveals those arcs. Climate emphasizes climate, pandemic, and collapse bands. Ideas emphasizes golden-age bands and cultural routes. Everything else, including the ribbons, stays at least at 0.4 opacity, and ribbons stay at 0.55, so the chart is never hidden. Arc waypoints are ordered by year. Hover emphasis is still T5.08.

Alternatives: Filter the roster down to the lens. Re-run the lane solver with new importance. Draw every route on the default view.

Why: T5.07 asks for re-weighting and an arcs layer. The plan says a lens never hides the chart. Layout stays on the full roster so the lanes do not jump.

Reversible? y

## 2026-10-26 — Route arcs are static hairlines and thicken on hover

Decision: A trade arc is a 1.5px dash of 6 4. A migration arc is a finer 1.25px dash of 2 3. Hover removes the dash, sets the stroke to the focus color, and thickens it to 2.5px. There is no transition. A wider transparent stroke is the hit target along the whole route, including the gaps of the dash. Ribbons beside that stroke still receive the pointer.

Alternatives: Animate the dash. Use the same stroke for trade and migration. Make the whole bounding box capture the pointer.

Why: T5.08 asks for static hairlines, a hover highlight, and emphasis for the active kind. Motion stays off unless the user points at a route.

Reversible? y

## 2026-10-26 — Fold hides a column and pin isolates the rest

Decision: Fold on a family or macro-region removes its ribbons and the layout solves again. Pin shows only the pinned families and regions. A pinned family stays even when its region is folded. Fold wins when the same id is in both lists. The hash keeps `fold` and adds `pin`, both sorted, with commas left readable. Ribbons move by interpolating centerline keyframes over 300 ms. Ribbons that leave fade out and ribbons that arrive fade in. Labels and connectors wait until the tween ends. Reduced motion, or a missing `matchMedia`, jumps to the solved layout. The columns panel is a region, so `/` still opens search, and the search sits above the panel.

Alternatives: Collapse a family into one summary ribbon. Morph the path with CSS. Make the panel a dialog.

Why: T5.09 asks for fold and pin, a re-solved layout, and a keyframe tween no longer than 300 ms.

Reversible? y

## 2026-10-26 — Five migrated presets, and compares the reader names

Decision: The columns panel lists the five presets in `presets.json` and no others. Applying one clears fold. Pin becomes the preset's regions and families, or is cleared when those regions already cover every macro-region. A non-zero integer year moves the chart; year 0 is dropped, and a preset with no year leaves the current year. A reader can save the current fold and pin under a name. Those compares live in localStorage key `chronos-compares`, at most eight, and a failed write is ignored. Applying a compare sets fold and pin and leaves the year alone.

Alternatives: Invent the eleven presets named in the plan but missing from the tag. Store compares in the hash.

Why: T5.10 asks for the migrated presets and user-defined compare sets. Q-03 keeps the count at five. The year stays out of a compare so a saved column filter can be reused at another date.

Reversible? y

## 2026-10-26 — A story stop moves the camera and names its sources

Decision: The title band opens the three migrated tours and no others. Each stop sets the year, writes `z` as the camera scale, selects the polity, and shows the narrative with the catalog source titles. A callout stop highlights the polity that callout is attached to. Trade and climate use those chart lenses. Art uses the ideas lens. Politics and technology leave the lens on All, because the chart has no lens by those names. The card is a region, so search still opens. The dossier stays closed. Fit width and Overview clear `z` and return to the local scale. Narratives stay at or under 70 words.

Alternatives: Invent the seven tours named in the plan but missing from the tag. Add a politics lens. Open the dossier on every stop.

Why: T5.11 asks for a waypoint that sets the camera, the lens, the highlight, and a sourced narrative. Q-03 keeps the tour count at three.

Reversible? y

## 2026-10-26 — The table lists the same rows the chart is showing

Decision: Table view is a grid with row, columnheader, and cell roles. It lists every polity the current fold and pin still show, plus callouts attached to those polities. A callout with no polity stays only when every family is visible. Columns sort by name, start, end, family, and importance. Years use the same continuous index as the chart, so there is no year 0. A search box filters the name, the family, and the kind. Only the rows inside the scrollport are painted, with a short fallback when the port has not been measured. Choosing a polity sets the year and opens the dossier. Choosing a callout sets the year and selects the polity it is attached to.

Alternatives: Render all 400 rows at once. Give the table its own family list apart from fold and pin. Leave the placeholder sentence and ship no rows.

Why: T5.12 asks for a virtualized, sortable, filtered table with ARIA table semantics, using the same roster as the chart.

Reversible? y

## 2026-10-26 — Tab order follows the poster, and panels return focus

Decision: Ribbons are focused from top to bottom, and left to right when they start on the same line. Two skip controls sit first: one focuses the chart, the other focuses search. They do not write the address hash. Opening search, the dossier, the reading key, the columns panel, or a story moves focus to the first control inside it. Closing returns focus to whatever had it. A focus ring uses the focus token, 2px with a 2px offset. Under reduced motion, transitions and animations on the poster drop to zero duration. The ribbon fade already did this; the rule now covers the rest of the shell.

Alternatives: Give every ribbon a positive tabindex. Leave focus on the control that opened a panel. Keep the 200ms fade when reduced motion is requested.

Why: T5.13 asks for tab order by time then x, focus management, skip links, and reduced motion everywhere.

Reversible? y

## 2026-10-26 — A phone uses a bottom sheet and a two-finger pinch

Decision: At 480px and below, the dossier and the era list sit on the bottom of the screen, at most 70vh and 560px. Lens and View keep their controls and hide the words. Era reading lists every polity whose span meets the poster era that contains the current year, earliest first. Choosing one sets the year, selects the ribbon, and opens the dossier. A two-finger pinch changes the camera scale by the change in distance between the pointers. A mouse pointer does not. The scale stays inside the existing 0.2–6 clamp.

Alternatives: Keep the side dossier on a phone. Add a separate mobile route. Treat a mouse drag as a pinch.

Why: T5.14 asks for a bottom-sheet dossier, a collapsed toolbar, pinch zoom, and era reading mode.

Reversible? y

## 2026-10-26 — Custom milestones stay out of the catalog

Decision: A mark is a year plus a short label, at most 12, stored in localStorage under `chronos-milestones`. Reading and writing are wrapped in try/catch. Bad JSON, year 0, a year outside 3300 BCE–2000 CE, and a blocked store do not throw. A blocked store keeps the list in memory for the session. The same label at the same year replaces itself. Marks draw as dashed outlines on the chart and can be added or removed from the locked year card. They are not catalog callouts, they have no source, and they do not appear in the table.

Alternatives: Write marks into the polity JSON. Style them as solid catalog callouts. Drop the list when storage throws.

Why: T5.15 asks for the custom-milestone store, dashed-outline styling, and try/catch around storage. The catalog stays sourced.

Reversible? y

## 2026-10-26 — Axe scenes report no serious or critical issues

Decision: `npm run axe` runs `@axe-core/playwright` on the chart, an open dossier, the dark theme, table view, search, the reading key, stories, columns, and era reading. It runs at 1440×900, 1920×1080, and 390×844. The run fails if any violation is serious or critical. The Overview control’s visible word is Overview, matching its accessible name. Dossier buttons paint paper behind ink, so the dark theme stays above 4.5:1. Moderate landmark notes remain: the top bar and the title band are both banners, and the page has no main landmark.

Alternatives: Hide the Overview mismatch with an aria-label that drops the visible word. Exclude the chart from the panel scenes. Treat moderate landmarks as failures in this pass.

Why: T5.16 asks for scripted axe checks across scenes and zero serious or critical violations.

Reversible? y

## 2026-10-26 — M2 is 5 of 11

Decision: `docs/reviews/M2.md` scores Appendix D again on `v2/p5-interactions`. Five items pass, three are partial, three fail. That is 45%. M1 stays 5/11. Interactions did not change the resting layout score. P6 stays closed until a later honest score is at least 8/11. The next work is layout tuning and overrides on the rows that already exist. Images and painted callouts stay P4. No band or country is invented to raise the score.

Alternatives: Count a partial as a pass. Open P6 at 45%. Treat the phone sheet as a layout improvement.

Why: T5.17 is the M2 checkpoint. The plan says not to open content depth while the poster is still under 70%.

Reversible? y

## 2026-10-26 — A forced label orientation does not clear the fitted pairs

Decision: For each polity in the 15 fitted label pairs, forcing `outside`, `horizontal`, or `along` was measured with `layout()`. Every force that removed a pair either ellipsized the name or left the label hover-only. Those results are not kept. The full name stays on the ribbon. The next layout lever is a lane pin or a fitter change that keeps the full string.

Alternatives: Ship the ellipsis. Drop the label to hover-only and call the pair fixed.

Why: Item 8 asks for labels that are not clipped. Shortening a name to delete an overlap does not pass it.

Reversible? y

## 2026-10-26 — The poster JavaScript stays under 400 KB gzipped

Decision: `lucide-react` is not imported, so it is removed. `npm run bundle:check` builds the poster and fails when the gzipped JavaScript in `dist/assets` is missing or over 400 KB. This build is 233.77 KB gzipped. The check is not part of `npm run check`.

Alternatives: Leave the unused dependency. Split the bundle in this pass.

Why: T5.20 asks to remove `lucide-react` when nothing uses it, and to check the gzipped JavaScript against 400 KB.

Reversible? y

## 2026-10-26 — Rotated names stay one straight column

Decision: A fitted rotated name is pinned to the ribbon centerline at the middle of the name and drawn as one string. A fitted horizontal name is pinned the same way and may slide along its ribbon. If the box still crosses another fitted label, the name slides to the nearest clear span on its own ribbon. Text, size, and fit stay put. Per-letter seating that followed each bend was drawn and then dropped: the classical and medieval shots pulled the letters off the column. `labelHitPairs` on the full roster is 0. Nine hover-only names and 21 already-shortened fitted names remain. M3 in `docs/reviews/M3.md` is 5/11.

Alternatives: Draw one glyph per letter along the bend. Force `outside` or an ellipsis on the remaining names.

Why: Item 8 needs the full name readable. Following the bend removed the 15 overlaps and made the names unreadable. A straight column on the river removes the overlaps and leaves the string intact.

Reversible? y

## 2026-10-26 — Fork endpoints can take a peer's slot

Decision: `cullToFit` keeps its importance order. A split or merge endpoint that did not fit then replaces the lowest unprotected ribbon of no higher importance, when the widths allow it. East Francia and West Francia are drawn under their full names, and the Carolingian split routes. Sparta, Thebes, Maya postclassic, the Thirteen Colonies, the United States, Yuan, and Ming are drawn as well. Ribbon overlaps stay 0 and fitted label hits stay 0. `maxRibbonDrift` rises from 154.839 to 296.774 because packing still jumps when the slice membership changes. A clamp of those packed steps to `MAX_DRIFT` left 246 overlaps on a forward pass and 257 on a backward pass, so it was not kept. M4 in `docs/reviews/M4.md` is 5/11.

Alternatives: Protect every endpoint with no swap, and let the slice overflow. Hard-code only the two Francia ids. Ship the slope clamp and accept the overlaps.

Why: Item 2 asks for the Frankish fork. The children already exist and were culled. A higher-importance ribbon is not dropped to make room.

Reversible? y

## 2026-10-26 — A membership change does not rebuild the row from the gutter

Decision: `easeCenterlines` carries each ribbon's center and width down the chart. A continuing ribbon may follow its sample by at most `MAX_DRIFT` per px of y. A new ribbon is seated in a gap. When the tight chain can hold a 10px name, width stays at least `10 / 0.62` instead of falling to the 12px minimum. The old gutter reset is what moved `egypt_late_to_ptolemaic` 184px across 0.62px of y. That step is now 0.22px (slope 0.35). A clamp of every packed step to `MAX_DRIFT` is still not shipped: it left 246 overlaps forward and 257 backward. Rows that cannot separate inside the drift window still use the rightward overlap push, so `japan_timeline` still moves 6.6px across 0.62px (slope 10.66). Fixture C's fan-out keeps a fitted label on every drawn ribbon. The roster report is overlaps 0, label hits 0, importance 3 fit 69/69, importance 2 fit 120/125, warm 129ms.

Alternatives: Clamp centerlines after packing. Delete the 0.62px sample so the metric ignores the kink. Shorten the fan-out names.

Why: Item 2 needs a river that does not kink when neighbors appear or leave, and the sixty-state fixture still has to draw its names. Spending width, not a global slope cap, is what keeps the gaps.

Reversible? y

## 2026-10-26 — Rome splits, and Castile joins Aragon, in the data

Decision: `roman_empire` now ends at the conventional year 395. `western_roman_empire` (395–476, western Europe) and `eastern_roman_empire` (395–476, eastern Mediterranean) are checklist ribbons. The eastern ribbon stops at 476 so it does not lie on the Byzantine ribbon through 1453. `aragon` (1137–1469) and `castile` (1230–1469) meet `spain_union`, whose importance is 3 so the child stays in a full slice. `buildLineage` emits the split and the merge from `EXPLICIT_FORKS`. Abutment stays inside one family, and two predecessors would otherwise become `disputed`, so those edges are named rather than inferred. The cited pages were not opened. The lane solver places the ribbons: west at x 418, east at x 757, and the merge connector is routed. A same-family handoff still runs from the western ribbon to Italy in 476. The v1 cultural-continuity edge from Rome to the Franks drops, because 481 is outside the new end, and that pair is a skipped parent. The roster report is overlaps 0, label hits 0, importance 3 fit 74/74, warm 136ms. `maxRibbonDrift` is 4.193 on `umayyad_abbasid` (13px across 3.1px of y). The Egypt step stays 0.22px across 0.62px.

Alternatives: Draw the fork as a hand-built path. Keep one Roman ribbon. Invent a merge that has no polities behind it.

Why: Item 2 asks for the Rome east/west split and a merge the relation data already supports. The geometry has to come from the solver.

Reversible? y

## 2026-10-26 — Modern slices spend spare width in place

Decision: After the native lane solve, a slice that reaches 1900 may shrink only the spare width of an importance-2 lane and seat culled states into the gaps that open. Centers do not move. Importance 3 keeps its solved width, so `modern_india` and `modern_africa` stay fitted. Each slice picks its own shrink: a keep copied from the busiest year left Pakistan and South Korea unseated. A ribbon under 40px may take an outside name, and a name that still hits slides to another row. The string is not shortened to clear a hit. `easeCenterlines` adopts a narrower sample without leaving its center. India, Pakistan, North Korea, and South Korea draw their full names. Fitted labels on polities that meet 1900–2000 rise from 31 to 53 of 119. The roster report is overlaps 0, label hits 0, importance 3 fit 74/74, warm 149ms. `maxRibbonDrift` stays 4.193 on `umayyad_abbasid` (13px across 3.1px of y). The Egypt step stays 0.22px. West stays left of east, and `merge_aragon_castile_spain_union` still routes. 53 is not 60.

Alternatives: Solve the modern slices with compressed weights. That seated more names and moved `british_empire` 115px across 2.48px, dropped two importance-3 labels to hover, and warmed at about 240ms. Share one shrink across every modern slice. Shorten the four names.

Why: Item 3 asks for about 60 readable states on the modern edge, including India, Pakistan, and both Koreas. The names have to stay full, and the rivers have to stay where the solver put them.

Reversible? y

## 2026-10-26 — The layout pass is 5 of 10

Decision: `docs/reviews/layout-pass.md` scores Appendix D on `fd85844`. Shipped images are deferred to P4 and leave the denominator. Painted callout plates are deferred to P4 and do not fail the label row by themselves. Ten items remain. Five pass, three are partial, two fail. The bar is 8. `v2/p5-interactions` is not merged into `v2/main`. The interaction gate still runs: `npm run check`, `npm run shots` (3 passed), `npm run perf` (p95 16.80 ms), and `npm run axe` (24 passed, no serious or critical violation). Tag `v2-p5-done` records that gate on this branch. P4 and P6 stay closed.

Alternatives: Count the Roman split as a pass while its west ribbon has no painted name. Count 53 modern fits as the required 60. Open P6 at 5/10.

Why: The three layout commits changed the chart, and the rescore has to say what the shots show. The phase gate can be tagged when its commands are green. The poster merge waits for 8 of the 10 scored items.

Reversible? y

## 2026-10-26 — The west Rome name is painted, and the Umayyad step is eased

Decision: A ribbon whose inside box cannot hold its own name takes that full name beside the ribbon, sized to the measurer. A short ribbon under 40px still uses the 72px outside box, so fixture H stays ellipsized. "Western Roman Empire" and "Eastern Roman Empire" both paint in full. A later run moves only when its drift window is parked on a neighbor and that neighbor cannot open the gap. The move is at most one minimum ribbon plus the minimum gap, and only when the overflow is at least that gap. Al-Andalus returns into the open space instead of shoving `umayyad_abbasid`. That step was 13px across 3.1px of y (slope 4.193). The steepest Umayyad step is now 0.22px across 0.62px (slope 0.35). The Mongol override sits outside so the full name is not rotated into an ellipsis. The roster report is overlaps 0, label hits 0, importance 3 fit 74/74, warm 140ms. `maxRibbonDrift` is 3.211 on `japan_timeline` (1.99px across 0.62px), which was already that step before this change. West stays left of east. `merge_aragon_castile_spain_union` still routes. The Egypt step stays 0.22px across 0.62px.

Alternatives: Cap every centerline at `MAX_DRIFT`. That left 246 overlaps forward and 257 backward. Open every returning run. That moved Safavid onto the Mughal label. Leave the west ribbon with no painted name.

Why: The Roman split needs the west name on the sheet, and the Umayyad river should not step 13px in 3px of y. The overlap push stays for rows the window cannot separate, so the overlap count stays 0.

Reversible? y

## 2026-10-26 — Modern slices seat six more states, and a broken ribbon labels its longer piece

Decision: An importance-3 lane may give up half its solved width, and no more, so a modern slice can open a gap. Each slice seats at most six extras, and it stops at the smallest shrink that reaches that count. India, Pakistan, North Korea, and South Korea are seated ahead of other importance-2 extras. A ribbon that is missing from a middle slice keeps its name on the longer drawn piece, not in the gap. Ghana was sitting between Costa Rica and El Salvador; the name now sits on the lower piece and the hit is gone. Polities that meet 1900–2000 have 63 fitted labels, 48 of them the full name. India, Pakistan, North Korea, and South Korea are still the full names. The roster report is overlaps 0, label hits 0, importance 3 fit 74/74, warm 142ms. `maxRibbonDrift` stays 3.211 on `japan_timeline`.

Alternatives: Shrink importance 3 all the way to the label floor. That seated more names and raised `peru_republic` to slope 6.82. Skip `ghana_republic` by id. Add eight pixels of clearance around every extra. That dropped the fitted count to 43.

Why: The modern edge needs 60 painted states, and the four named states have to stay complete. Half a wide lane is enough spare width. A name in a gap is not a painted name.

Reversible? y

## 2026-10-26 — A drawn ribbon paints its full name

Decision: An unforced label is the polity's own name, or it is not drawn. A short ribbon uses the same measurer-sized box as a name that spills out of a tall ribbon. The 72px box no longer ellipsizes fixture H: "Nāṣer the Great" paints in full. Forced `along` and `horizontal` are unchanged. On the roster, 231 of 231 drawn ribbons carry that full name, including the 65 modern states that are drawn. Label hits stay 0. One more callout is crowded out (dropped 9, markers 12) because the wider names are larger obstacles. The report is overlaps 0, importance 3 fit 74/74, warm 144ms. `maxRibbonDrift` stays 3.211 on `japan_timeline`.

Alternatives: Keep the word-boundary ellipsis on short ribbons. Drop every ribbon whose name is longer than 72px. Leave hover-only ribbons on the sheet.

Why: A painted ellipsis, or a ribbon with no name, does not pass the label rule. The full string fits beside the ribbon, so nothing had to be removed.

Reversible? y

## 2026-10-26 — Overview type stays at its design size, and the Mongol span is a band

Decision: When the sheet is below one screen pixel per design pixel, era names, year labels, band titles, and ribbon labels grow by `1 / scale`, so a 10px label is still 10px on screen. A ribbon name that would then cover a more important name is left off until the reader zooms in. The six era gutters are unchanged. A twelfth cross-cutting band, `band_mongol_conquests`, uses the years and regions already on `mongol_empire` (1206–1368, Europe and East Asia) and cites `cambridge_histories`. Verification is unverified. The page was not opened. The migrated file stays the original 11 rows. The roster report is overlaps 0, label hits 0, importance 3 fit 74/74, warm 143ms. `maxRibbonDrift` stays 3.211 on `japan_timeline`.

Alternatives: Leave overview type at about 2px. Invent a twelfth era gutter. Cite a source id that is not in the dataset.

Why: Overview has to stay readable, and the band count has to reach 12 from a span the dataset already dates.

Reversible? y

## 2026-10-26 — Fit width keeps every full name

Decision: The overview cull starts only once the type has doubled (`scale` at or below 0.5). Fit width still grows the type so a 10px name is at least 10px on screen, and it does not drop a ribbon name. Overview still drops a name that would cover a more important one.

Alternatives: Cull at every scale below 1. That removed 26 names from the 1440px fit-width sheet, including nine modern states.

Why: The readable floor applies at the default zoom. The default zoom is fit width, and those names have to stay on the sheet.

Reversible? y

## 2026-10-26 — The 9/10 score opens P4, and plates start as pictograms

Decision: `v2/p5-interactions` is merged into `v2/main` with `--no-ff`. Tag `v2-p5-done` stays at `b5f7501`. Item 2 stays partial on `japan_timeline` (slope 3.211) and is not tuned again before the media work. The plate mark is an in-house line icon: 24px grid, 1.5px stroke, no fill. Callout kinds use seal, crown, wheel, temple, scroll, leaf, and ship. A real photograph replaces the icon only after a reviewed file exists. `ALLOW_MEDIA_DOWNLOAD` stays false.

Alternatives: Draw another layout pass on the Japan step before any plate. Keep a Lucide badge. Invent a license so a photograph can ship.

Why: The layout score cleared 8 of 10. Images still have to be license-clean, and none are downloaded while the switch is off.

Reversible? y

## 2026-10-26 — A search hit is kept only when the payload says CC0

Decision: `media:plan` queries the Cleveland Open Access API and the Met collection API and writes `docs/media-curation.md`. It does not download image files. A Cleveland row is kept when `share_license_status` is `CC0` and a creator description is present. Its `licenseUrl` is the Creative Commons CC0 deed for that string. A Met row with `isPublicDomain` and no license URL is listed and not copied into `media-src.json`. Search relevance is not a decision that the object depicts the callout.

Alternatives: Invent license URLs for the Met rows. Treat every keyword hit as a plate.

Why: The payload has to name the license. A keyword match is not a source.

Reversible? y

## 2026-10-26 — Fetch stays queued while the download switch is off

Decision: `scripts/media/fetch.ts` hashes bytes and can cache them under `media-cache/` after a successful HEAD. With `ALLOW_MEDIA_DOWNLOAD=false` the command reports `queued-gated` for every source row, exits 0, and does not call HEAD or GET. Tests pass buffers and a mock HEAD. No image file is downloaded. The source list is not rewritten here.

Alternatives: Turn the switch on to fetch the Cleveland files. Leave the script as a stub that cannot hash.

Why: The pipeline has to exist, and the switch still forbids downloading files.

Reversible? y

## 2026-10-26 — Plate treatment is tested on a painted rectangle

Decision: `scripts/media/process.ts` crops around a stored focal point, reduces saturation to 0.85, blends 20% toward warm `(255, 214, 170)`, multiplies a light grain, and paints a 1px frame in light-theme ink `(42, 36, 28)`. Outputs are AVIF and WebP at 128, 320, and 960. The only image exercised is `src/__fixtures__/plate-synthetic.png`, an 80×40 blue/red rectangle. `media:process` writes `src/data/media.generated.json` with an empty image list when `media-cache/` has no files. It does not download.

Alternatives: Download a Cleveland file to test sharp. Commit a derivative of a real object before the page is opened.

Why: The treatment has to be real, and no reviewed image file exists yet.

Reversible? y

## 2026-10-26 — A plate draws a pictogram until a local file exists

Decision: The chart plate reserves its box and paints the in-house pictogram. A dossier figure shows caption and credit only when its `src` is a local path. An `http` or `https` address is not written into the SVG or the figure. No callout is given a `mediaId`.

Alternatives: Hotlink the Cleveland object pages. Leave the plate markup inline in `Callout` with no reserved-image path.

Why: Derivatives are not shipped while downloads are off, and a remote address would be a hotlink.

Reversible? y

## 2026-10-26 — Credits list only shipped files, and `#/credits` is not a view

Decision: The credits page and `docs/print/colophon.txt` are generated from `media.generated.json` joined to `media-src.json`. An id with no derivative is omitted. With an empty derivative list, both say that no image files are shipped. `#/credits` is ignored by `readHash` and `publishView`, so opening the page does not clear `y`, `z`, `sel`, `lens`, `fold`, or `pin`.

Alternatives: List the 84 candidate rows as if their files were on the poster. Parse `#/credits` as a chart hash.

Why: A credit for a file that was not downloaded would be false, and the chart link has to survive the page.

Reversible? y

## 2026-10-26 — The thumbnail budget counts 128px files only

Decision: `media:budget` fails when 128px AVIF or WebP files total more than 1.2 MB or any one is over 10 KB. 320px and 960px derivatives are not thumbnails. Zero files is a pass, and the command says the set is gated, because no image file is shipped.

Alternatives: Count every derivative against the 10 KB cap. Fail the build because the directory is empty.

Why: The cap is the chart thumbnail payload. An empty directory is the honest result of the download switch.

Reversible? y

## 2026-10-26 — The first 60 source rows are queued, not placed

Decision: The first 60 rows already in `src/data/media-src.json` have `status: queued-gated`. The remaining 24 stay `candidate`. `docs/media-queue.md` repeats those ids, accessions, and URLs. No callout gained a `mediaId`. Chart plates stay pictograms. Fetch stays queued-gated.

Alternatives: Invent URLs to reach 60 images. Attach the Cleveland rows to callouts before the object pages are opened.

Why: The download switch is off, and a plate needs a local file. The queue is the real list, not a new one.

Reversible? y

## 2026-10-26 — The P4 gate passes with no shipped image files

Decision: Desktop callout geometry passed. `media:budget` passed with 0 thumbnails and reported the set as gated. That meets the phase gate. `v2/p4-media` merges into `v2/main` with `--no-ff`. Tag `v2-p4-done` points at that merge. Tag `v2-p5-done` stays at `b5f7501`.

Alternatives: Hold the gate until 120 real images are downloaded. Count the empty thumbnail directory as a budget failure.

Why: The switch forbids downloads, the geometry is green, and the budget is honestly gated.

Reversible? y

## 2026-10-26 — A cluster with no single year is not a split, and split shares are even

Decision: A row whose date note says Appendix B gives no single year is not an abutment successor. The Andean republics do not split from the Viceroyalty of the Río de la Plata in 1810. A generated split stores an even `share`. That share is layout flow. The checklist gives no proportion. The Mughal line's checklist end in 1857 links to the unnamed 1857–1858 interval. Pages were not opened. `verification` stays unverified.

Alternatives: Keep the Río de la Plata split because the years touch. Leave `share` unset. Invent a proportion.

Why: The 1810 start is the edge of a band, not a dated handoff. Even shares match the layout default and do not claim a measured division.

Reversible? y

## 2026-10-26 — Decolonization uses the independence row, and the war band stays bundled

Decision: `band_decolonization` runs 1950–1975, the years already on `african_independence`, and its scope is Africa. Appendix B says the 1950s to the 1970s and does not name each state. The Industrial Revolution stays inside `band_enlightenment_industrial` (1700–1900). World War I, World War II, and the Cold War stay inside `band_world_wars` (1914–1991). Those rows do not give separate endpoints. Pages were not opened. `verification` stays unverified.

Alternatives: Invent 1914–1918, 1939–1945, and 1947–1991. Copy the 1700–1900 band under a second title.

Why: A new band has to use a span the dataset already dates. Splitting the bundled rows would add years they do not contain.

Reversible? y

## 2026-10-26 — Fan-out importance stays at the skeleton values

Decision: The 1800–2000 checklist rows keep the importance and weight already on them. The 36 new callouts stay at importance 2. No weight was changed, so `layout:report` was not rerun. No listed source page was opened.

Alternatives: Raise India, the United States, and the USSR to importance 4 from the checklist names alone. Rerun the layout report with no weight change.

Why: Importance 4 and 5 are reserved for a cross-check against an opened source. A layout report of unchanged weights would only repeat the last sheet.

Reversible? y

## 2026-10-26 — T6.01 names states Appendix B does not date

Decision: Haiti, Cuba, the Empire of Brazil and the republic, Poland after 1795, Yugoslavia, Czechoslovakia, Turkey after 1922, a Gulf cluster, Afghanistan, the Central Asian republics, Sri Lanka, Nepal, Taiwan, Mongolia, Laos, Cambodia, Malaysia, and Burma after the Konbaung are on the chart. The years are widely cited political dates. `confidence` is approximate or debated. `verification` is unverified. Each date note says Appendix B does not date the row. `sourceIds` are ids already in `sources.json`. The Gulf row and the Central Asian republics are clusters at weight 0.22. Other new rows stay at weight 0.35 and importance 2. Pages were not opened.

Alternatives: Leave the names off, as the skeleton pass did under Q-04. Invent a source page or a quotation.

Why: T6.01 names these states, and Appendix B is a checklist, not a ceiling. A cluster does not paint as wide as one empire. Other undated checklist names stay omitted.

Reversible? y

## 2026-10-26 — The modern spine is importance 3 and weight 0.48

Decision: United States, United Kingdom, Ottoman Empire, USSR, India, People's Republic of China, Empire of Japan, and Brazil are importance 3 and weight 0.48. Gulf states and the Central Asian republics stay importance 2 and weight 0.22. Every other fan-out row stays at its previous importance and weight. None of these is importance 4 or 5. `npm run layout:report` after the change: 238 ribbons, 0 overlaps, importance 3 labels 82/82, 0 unroutable relations, max drift 3.211. Warm runtime is about 168–199 ms, over the 150 ms gate. The layout engine was not changed.

Alternatives: Leave every row at importance 2 and weight 0.35. Raise the spine to importance 4 without an opened page. Widen every new state.

Why: Width and importance should show the states a reader looks for, and the two clusters are not one empire. Importance 4 still waits on an opened page. The runtime miss is the larger roster, not a new solver.

Reversible? y

## 2026-10-26 — Sweden, Denmark–Norway, and Saadi Morocco are dated beside the checklist

Decision: `sweden_1523` runs 1523–1800 at weight 0.35 and `denmark_norway` runs 1523–1814 at weight 0.22. Both are debated and unverified. 1523 is the checklist end of the Kalmar Union, so the generated edge is an even split, not a handoff to Sweden alone. The share stays even. The narrower union keeps the Thirteen Colonies label off the Peru label. 1721 and 1536 stay endpoint notes. 1814 is the widely cited Treaty of Kiel. The modern Denmark, Sweden, and Norway rows still start in 1800. Their date notes now say the checklist gives no single year, so they are not successors of `sweden_1523`. `saadi_morocco` runs 1549–1659 in the sub-Saharan family. A bridge at 1591 links Songhai’s checklist end to that row. Pages were not opened.

Alternatives: Leave Sweden on the 1800 placeholder only. Make Sweden the only successor of the Kalmar Union. End Saadi Morocco in 1591 or invent one end for the Timbuktu pashalik.

Why: T6.02 names Sweden and Songhai→Moroccan. Appendix B dates the Kalmar end and the Songhai end, and it does not date these three rows. A Sweden-only handoff would hide Denmark and Norway. A pashalik end is not one year this pass will freeze.

Reversible? y

## 2026-10-26 — Reformation, Scientific Revolution, and Little Ice Age stay undated

Decision: T6.02 adds no band for the Reformation, the Scientific Revolution, or the Little Ice Age. Appendix B names those three and gives them no years. The Age of Discovery stays the existing band from 1492 to 1650. The Enlightenment stays inside the existing band from 1700 to 1900. Pages were not opened. `verification` on those bands stays unverified.

Alternatives: Invent 1517–1648, 1543–1687, or 1300–1850. Copy the discovery band under a second title.

Why: A new band has to use a span the dataset already dates. The two existing bands already cover the dated frames this pass can stand on.

Reversible? y

## 2026-10-26 — The Visigoth row uses 418 CE

Decision: `visigoths` starts in 418 and ends in 711. Appendix B says c.418–711 beside the other successor kingdoms, and the note does not say BCE. The stored start had been −418. The anchor year is 418. Confidence stays approximate. The generated handoff to `spain_portugal` in 711 is unchanged. The row stays a root. The nearest same-family end is now `roman_empire` at a gap of 23 years, not `roman_kingdom`. Pages were not opened.

Alternatives: Leave the ribbon running from 418 BCE. Treat 418 as debated and drop the row.

Why: A negative year is BCE in this dataset. 418 BCE is not the checklist span.

Reversible? y

## 2026-10-26 — Western Dark Ages and the Medieval Warm Period stay undated

Decision: T6.03 adds no band for the Western Dark Ages or the Medieval Warm Period. Appendix B names both and gives them no years. The Islamic Golden Age stays the existing band from 750 to 1258. The Black Death stays the existing band from 1346 to 1355. The Mongol conquests band stays 1206 to 1368, the years already on the Mongol Empire row. Pages were not opened. `verification` on those bands stays unverified.

Alternatives: Invent 500–1000 for a Western Dark Ages band. Invent 950–1250 for the Medieval Warm Period. Move the Black Death band from 1346–1355 to the seed’s 1347–1351.

Why: A new band has to use a span the dataset already dates. The three existing bands already cover the dated frames this pass can stand on. The Black Death row was not edited to chase the one-year difference in the seed list.

Reversible? y

## 2026-10-26 — Medieval importance stays at the rows already set

Decision: No 500–1500 row was raised to importance 3 or 4 in this pass. Weights were not changed. `npm run layout:report` after the callouts: 238 ribbons drawn, 436 polities, 0 overlaps, minimum gap 6, importance-3 labels 82/82, 0 unroutable relations, 82 omitted, max drift 3.211. Cold runtime 245 ms, warm 165 ms, over the 150 ms gate. Callouts dropped 174, with 13 markers and 61 placed. The layout engine was not changed.

Alternatives: Raise Tang, the Abbasids, Byzantium, and the Mongol Empire to importance 3. Raise any of them to importance 4 from the CHGIS homepage.

Why: The CHGIS page describes a placename database and does not state a row year. Importance 4 still waits on an opened page that states the claim. The runtime miss is the roster, not a new solver.

Reversible? y

## 2026-10-26 — The Roman Climate Optimum stays undated

Decision: T6.04 adds no band for the Roman Climate Optimum. Appendix B names it and gives it no years. The Axial Age stays the existing band from 650 BCE to 250 BCE. Hellenism stays 323 BCE to 31 BCE, the checklist span of the Hellenistic kingdoms. The 535–536 weather and the Plague of Justinian stay the existing band from 535 to 560. Pages were not opened. `verification` on those bands stays unverified.

Alternatives: Invent a Roman Climate Optimum span. Move the Axial Age band from 650–250 BCE to the seed’s about 800–200 BCE. Split 535–536 from the plague.

Why: A new band has to use a span the dataset already dates. The three existing bands already cover the dated frames this pass can stand on. The Axial Age row was not edited to chase the seed’s other pair of years.

Reversible? y

## 2026-10-26 — Classical importance stays at the rows already set

Decision: No 600 BCE–500 CE row was raised to importance 3 or 4 in this pass. Weights were not changed. `npm run layout:report` after the callouts: 238 ribbons drawn, 436 polities, 0 overlaps, minimum gap 6, importance-3 labels 82/82, 0 unroutable relations, 82 omitted, max drift 3.211. Cold runtime 252 ms, warm 169 ms, over the 150 ms gate. Callouts dropped 214, with 13 markers and 72 placed. The layout engine was not changed.

Alternatives: Raise Rome, Han, the Achaemenids, and the Mauryas to importance 3. Raise any of them to importance 4 without an opened page.

Why: Importance 4 still waits on an opened page that states the claim. The runtime miss is the roster, not a new solver.

Reversible? y

## 2026-10-26 — Early-modern importance stays at the rows already set

Decision: No 1500–1800 row was raised to importance 3 or 4 in this pass. `denmark_norway` stays weight 0.22. `sweden_1523` stays weight 0.35. `npm run layout:report` after the new rows and callouts: 238 ribbons drawn, 436 polities, 0 overlaps, minimum gap 6, importance-3 labels 82/82, 0 unroutable relations, 82 omitted, max drift 3.211. Cold runtime 259 ms, warm 156 ms, over the 150 ms gate. Callouts dropped 100, with 13 markers and 46 placed. The layout engine was not changed.

Alternatives: Raise Ming, the Mughals, Habsburg Spain, and the Safavids to importance 3. Raise any of them to importance 4 from the UNESCO volume list.

Why: Importance 4 still waits on an opened page that states the claim. The warm runtime is already over the gate, and another wider spine is not required to keep overlaps at 0.

Reversible? y

## 2026-10-26 — The Iron Age transition stays undated

Decision: T6.05 adds no band for an Iron Age transition. The pass names it and gives it no years. The Late Bronze Age Collapse band stays 1200–1150 BCE. The Greek Dark Ages band stays 1100–750 BCE. The Greek Dark Ages checklist row stays about 1100–800 BCE, and the two spans were not forced to match. Pages were not opened. `verification` on those bands stays unverified.

Alternatives: Invent an Iron Age transition span. Move the Greek Dark Ages band from 1100–750 BCE to the checklist row’s about 1100–800 BCE. Add a Sea Peoples row beside the collapse band.

Why: A new band has to use a span the dataset already dates. The collapse band and the Greek Dark Ages band already cover the dated frames this pass can stand on. Sea Peoples stay inside the existing collapse description.

Reversible? y

## 2026-10-26 — Bronze-age importance stays at the rows already set

Decision: No 2000–600 BCE row was raised to importance 3 or 4 in this pass. Weights were not changed. `npm run layout:report` after the callouts: 238 ribbons drawn, 436 polities, 0 overlaps, minimum gap 6, importance-3 labels 82/82, 0 unroutable relations, 82 omitted, max drift 3.211. Cold runtime 252 ms, warm 167 ms, over the 150 ms gate. Callouts dropped 221, with 13 markers and 81 placed. The layout engine was not changed.

Alternatives: Raise the Middle Kingdom, the New Kingdom, the Hittites, and the Shang to importance 3. Raise any of them to importance 4 without an opened page.

Why: The CDLI homepage describes a cuneiform library and does not state a row year. Importance 4 still waits on an opened page that states the claim. The runtime miss is the roster, not a new solver.

Reversible? y

## 2026-10-26 — The Bronze Age Collapse tour stays the migrated one

Decision: T6.05 does not add a second Bronze Age Collapse tour. `tour_bronze_collapse` is already on the sheet, with the title “1177 BCE: The Late Bronze Age Collapse.” Its stops were not rewritten, and no new goods, battles, or letters were added.

Alternatives: Copy the migrated tour under a new id. Replace its narratives with checklist years only.

Why: The pass asks for that tour, and the migrated one already occupies the title. A second copy would invent a parallel story.

Reversible? y

## 2026-10-26 — The 4.2 kiloyear band stays on its stored span

Decision: T6.06 does not add a second 4.2 kiloyear band and does not move the existing one. It stays 2200–2100 BCE. Pages were not opened. `verification` on that band stays unverified.

Alternatives: Invent a different aridification span. Split the band so each collapsed state has its own years.

Why: The dataset already dates that band. This pass can stand on that span.

Reversible? y

## 2026-10-26 — Early-bronze importance stays at the rows already set

Decision: No 3300–2000 BCE row was raised to importance 3 or 4 in this pass. Weights were not changed. `npm run layout:report` after the callouts: 238 ribbons drawn, 436 polities, 0 overlaps, minimum gap 6, importance-3 labels 82/82, 0 unroutable relations, 82 omitted, max drift 3.211. Cold runtime 253 ms, warm 165 ms, over the 150 ms gate. Callouts dropped 222, with 13 markers and 88 placed. The layout engine was not changed.

Alternatives: Raise Ur III, the Akkadian Empire, the Old Kingdom, and Liangzhu to importance 3. Raise any of them to importance 4 without an opened page.

Why: The Louvre homepage describes the museum’s hours and current exhibitions. It does not state a row year. Importance 4 still waits on an opened page that states the claim. The runtime miss is the roster, not a new solver.

Reversible? y

## 2026-10-26 — Four extra tours restate years already on the sheet

Decision: T6.07 adds Steppe vs settled, Religion & philosophy across Eurasia, Seas & routes (Indian Ocean/Pacific/Atlantic), and Cities that reshaped the world. Each stop uses a year already stored on a row and says the cited page was not opened. No raid, doctrine, voyage, cargo, or founding story is added. The tour count goes from 11 to 15. Nothing is marked cross-checked.

Alternatives: Leave the four titles off because the count was already past 10. Copy migrated blurbs about rulers, goods, and city plans into the new stops.

Why: The plan names those four titles. The count floor was already met, and the titles were still absent. Restating stored years fills them without a new claim.

Reversible? y

## 2026-10-26 — Climate curve and pandemic bands stay unverified

Decision: T6.08 does not mark the climate curve or the pandemic bands cross-checked. The curve keeps the stored temperatures. The 535–560 band and the 1346–1355 band keep those years. The 4.2 kiloyear band stays 2200–2100 BCE. Evidence on the curve and on those three bands records the pages that loaded. No temperature, plague year, or new pandemic band was added.

Alternatives: Treat a UNESCO century volume as confirmation of 536 or 1346. Treat the Hundred Years’ War dates as the Black Death. Add a 1918 band without an opened page.

Why: `max_planck_history` loaded and described the Max Planck Institute for the History of Science, founded in 1994. `worldhistory_org` loaded and featured the Hundred Years’ War from 1337 to 1453. `unesco_gha` loaded and listed General History of Africa volumes by century, including the 12th to the 16th. None of those pages stated a curve temperature, 535, 536, 560, 1346, or 1355. `cambridge_histories` was not opened.

Reversible? y

## 2026-10-26 — Unverified importance 4 callouts drop to 3

Decision: T6.09 lowers the 40 migrated callouts from importance 4 to 3. They stay unverified. No row is marked cross-checked. `npm run report:unverified` then lists 0 unverified entries at importance 4 or 5. `npm run layout:report`: 238 ribbons, 0 overlaps, importance-3 labels 82/82, 0 unroutable relations, callouts dropped 235, markers 0, placed 88, max drift 3.211. Cold runtime 264 ms, warm 186 ms, over the 150 ms gate. The layout engine was not changed.

Alternatives: Leave the 40 at importance 4. Mark them cross-checked from homepages that do not state the claims. Delete the callouts.

Why: Importance 4 waits on an opened page that states the claim. The pages opened in this phase describe institutions, volume centuries, or a war from 1337 to 1453. They do not state these callout claims. Importance 3 still draws when the card fits. A collision drops it instead of forcing a marker.

Reversible? y

## 2026-10-26 — The P6 tag stays unapplied

Decision: T6.99 writes `docs/reviews/M3.md` and does not create `v2-p6-done`. The era floors, the polity count, the callout count, and the tour count meet §7. Relations are 188, bands 13, routes 6, images 0, and callouts at importance 3 or higher are 58. Those five are short of 450, 35, 15, 120, and 100. The accuracy sample is the first tenth of each era bin, sorted by id, and it found no internal year mismatch. Nothing in it is cross-checked.

Alternatives: Tag the branch because the task list reached T6.99. Add relations, bands, and routes until the counts clear. Turn on media download.

Why: A tag named done would say the content gate passed. The short counts are real, and closing them here would invent rows or download images. `ALLOW_MEDIA_DOWNLOAD` stays false. `v2-p5-done` stays at `b5f7501`.

Reversible? y

## 2026-10-26 — The forty callouts stay importance 4

Decision: The 40 migrated callouts return to importance 4. They stay `verification: unverified`. Evidence returns to the bibliography sentence. `docs/UNVERIFIED.md` lists those 40 again. The dossier chip is the honest state. No row is demoted so that report reads 0.

Alternatives: Leave them at importance 3. Mark them cross-checked from pages that do not state the claims.

Why: T6.09 lowered them so the unverified report would read 0 of 0. That hid the claims. Importance 4 still waits on an opened page, and the chip says they are not yet cross-checked.

Reversible? y

## 2026-10-26 — Overlap edges fill the relation floor

Decision: `buildLineage` adds same-family `cultural_continuity` edges until the relation count is 450. The year is the later row’s start, and that year sits inside both closed lifetimes. The note says both rows are current in that year. Pages were not opened. Belgium and Muromachi stay roots. The Mughal pair, VOC toward Thailand, VOC toward the Pacific microstates, and Habsburg Spain toward Prussia stay absent. Candidates at or before 2000 BCE wait behind later years. This pass used years from 1894 BCE to 1991 CE. `npm run layout:report`: 238 ribbons, 0 overlaps, importance-3 labels 82/82, 0 unroutable, 278 omitted, callouts dropped 222, markers 13, placed 88, max drift 3.211. Cold runtime 260 ms, warm 188 ms, over the 150 ms gate. The layout engine was not changed.

Alternatives: Add split or merge edges. Use a year outside either lifetime. Change the solver to chase the runtime gate.

Why: The sheet had 188 relations. The floor is 450. These edges use a start year and source ids already stored on the later row.

Reversible? y

## 2026-10-26 — Plan periods fill the band floor

Decision: Twenty-two bands bring the count from 13 to 35. Each title is a period named in the plan or in Appendix B. Where the plan gives years, the band uses those years. Where it names a period and gives no years, the band uses a widely cited span and says so. The thirteen older bands keep their spans. Every new row is unverified. The cited pages were not opened. `npm run layout:report`: 238 ribbons, 0 overlaps, 0 unroutable, markers 13, placed 88, warm runtime 177 ms, over the 150 ms gate. The layout engine was not changed.

Alternatives: Leave the count at 13. Move the older bundled bands onto the narrower years. Mark a band cross-checked from a page that was not opened.

Why: The floor is 35. Earlier passes left these titles off when the plan gave them no years.

Reversible? y

## 2026-10-26 — Nine arcs join rows already on the sheet

Decision: Nine cultural routes bring the count from 6 to 15. Each arc uses two polity names already stored, a year inside both stored spans, and a poster x from that row’s anchors. The description names those rows and says the cited page was not opened. No commodity list is added. The six migrated routes stay as they are. `npm run layout:report`: 238 ribbons, 0 overlaps, 0 unroutable, markers 13, placed 88, warm runtime 173 ms, over the 150 ms gate. The layout engine was not changed.

Alternatives: Copy cargo lists onto the new arcs. Reuse the Silk Road waypoints under a new id. Download nothing, and leave the count at 6.

Why: The floor is 15. Tag `gemini-v1` has six routes. These nine use rows that are already on the sheet.

Reversible? y

## 2026-10-26 — Forty-two later callouts rise to importance 3

Decision: Forty-two callouts whose year is after 1500 BCE rise from importance 2 to 3. Their blurbs already restate a checklist year in 14 words or fewer. They stay unverified. The cited pages were not opened. Callouts in `fanout-01`, `fanout-02`, and `fanout-03` stay at importance 2. The 40 migrated callouts stay at importance 4 and unverified. The count at importance 3 or higher is 100. `npm run layout:report`: overlaps 0, unroutable 0, markers 13, placed 90, dropped 220, warm runtime 177 ms, over the 150 ms gate. The ancient frame still shows the same 13 markers. The layout engine was not changed.

Alternatives: Add new cards inside 3300–1800 BCE. Demote the importance 4 rows so the unverified report reads 0.

Why: The floor is 100. Years after 1500 BCE sit below the ancient frame, which runs from about 3300 BCE to about 1800 BCE.

Reversible? y

## 2026-10-26 — Print is a query on the same poster

Decision: `?print=1` renders the chart at a fixed physical size and leaves off the top bar, search, zoom, skip links, and title actions. The default sheet is 24 by 36 inches. `size=letter` is 8.5 by 11. `size=tabloid` is 11 by 17. An unknown size stays on the poster. The chart fits inside a 0.5 in margin, under a 1.2 in title band. Print type uses the 24×36 floor. On that sheet, 10 design px is already at least 6 pt, so the boost stays 1 and the layout sizes stay. Letter and tabloid keep that same type, reduced to the sheet. Era, axis, band, and milestone labels follow `--sheet-boost`. Milestone labels stay at the axis size, above the 5 pt tertiary floor. The screen label floor, the layout solver, and the 150 ms gate stay as they are. `v2/main` is the P6 merge `533cafd`, tagged `v2-p6-done`.

Alternatives: Shrink the screen floor to 6 pt. Raise letter and tabloid type until 10 px equals 6 pt on those sheets. Add a second router. Export the PDF in this same task.

Why: §4.5 sets the print floor at 24×36, and the screen floor already clears it there. Raising type to 6 pt on letter covered the ribbons. Bleed and the PDF script stay on later tasks.

Reversible? y

## 2026-10-26 — Trim PDFs come from the print route

Decision: `scripts/export-pdf.ts` builds the app and prints `?print=1` with Playwright `page.pdf` to `dist-print/`. Letter is 8.5 by 11, tabloid is 11 by 17, and the poster is 24 by 36. `npm run check` does not run that export. On 2026-10-26, `pdfinfo` reported 612 by 792 pt, 792 by 1224 pt, and 1728 by 2592 pt, one page each. `pdffonts` listed every face with emb=yes: BarlowCondensed-Bold, BarlowCondensed-ExtraBold, BarlowCondensed-SemiBold as CID TrueType, that same SemiBold name as Type 3, Arimo-Bold, and SourceSans3ExtraLight-Regular. `pdftotext` reads CHRONOS from the masthead. The weight-400 Source Sans 3 woff2 name table says SourceSans3ExtraLight-Regular. Its OS/2 weight class is 400, and the glyph advance for n matches the woff named SourceSans3-Regular. Arimo-Bold is Chromium’s fallback for U+2192, which sits outside the Barlow unicode-range, on ribbon names that use that arrow. The Type 3 face is the stroked axis text. This task writes no PNG.

Alternatives: Rasterize the sheet. Rename the woff2. Replace the arrows in the roster. Run the export inside `npm run check`.

Why: T7.02 asks for those three PDFs and a `pdffonts` check. The names above are the ones the tool printed.

Reversible? y

## 2026-10-26 — The 24×36 sheet can add 0.125 in of bleed

Decision: `?print=1&bleed=1` grows only the poster, by 0.125 in on every side. The trim box stays 24 by 36 inches, with the same 0.5 in margin and 1.2 in title. Eight crop marks sit in that bleed, stop 0.02 in short of the trim, and use a 0.5 pt stroke. Letter and tabloid ignore `bleed`. Plain `?print=1` stays 24 by 36 with no marks. `export:pdf poster-bleed` writes `dist-print/chronos-poster-bleed.pdf`. On 2026-10-26, `pdfinfo` reported 1746 by 2610 pt, one page. A 144 dpi crop of the top-left corner shows the two marks and a gap at the corner.

Alternatives: Bleed every sheet. Draw the marks across the trim. Trust the DOM test and skip the PDF.

Why: §4.13 names 0.125 in of bleed for 24×36. The trim PDFs stay the T7.02 page size.

Reversible? y

## 2026-10-26 — The 0.25 pt stroke floor is enforced on the 24×36 PDFs

Decision: `scripts/check-pdf.ts` checks the four chart PDFs with `pdfinfo`, `pdffonts`, `pdfimages -list`, and a content-stream stroke walk. A missing tool, `emb=no`, an image under 300 ppi, a page size off by more than 1 pt, or zero strokes is a failure. The 0.25 pt floor applies when the job is the poster, trim or bleed. On 2026-10-26 the checker printed letter 616 strokes, minimum 0.181 pt, floor not applied; tabloid 616 strokes, minimum 0.304 pt, floor not applied; poster 616 strokes, minimum 0.562 pt, floor 0.25 pt; bleed poster 624 strokes, minimum 0.500 pt, floor 0.25 pt. Each file had 6 fonts and 0 images. Exit 0. Letter strokes are that same drawing reduced onto 8.5 by 11, so a 0.56 pt poster hairline is about 0.18 pt there. Those letter strokes were not thickened. Tabloid clears 0.25 pt on this export, and the checker still does not apply the floor there. `npm run check` does not run this script. `npm run check:pdf` does.

Alternatives: Fail letter at 0.181 pt. Apply the floor to tabloid as well. Thicken letter strokes with non-scaling-stroke. Treat a missing `pdfimages` as a pass.

Why: §4.13 and the phase exit name 0.25 pt for the 24×36 sheet. Letter is a reduction of that drawing. A missing tool is not evidence the page passed.

Reversible? y

## 2026-10-26 — Reference pages are an export of the stored notes

Decision: `scripts/export-reference.ts` writes Letter HTML and `dist-print/chronos-reference.pdf` from `loadDataset()`. The six note ids are labeled 3300–2000 BCE, 2000–600 BCE, 600 BCE–500 CE, 500–1500 CE, 1500–1800 CE, and 1800–2000 CE. Any other era id is printed as stored. Region names come from `geography.json`. A region id that is not in that list is printed as stored. Each note prints its entries, `whyItMatters`, and the connections that are stored. The reading key is `READING_KEY`. The colophon is `colophonFor` of `media.generated.json` and `media-src.json`. Sources list id, title, publisher, url, accessed date, and kind. On 2026-10-26 `pdfinfo` reported 14 pages, 612 by 792 pt. `pdffonts` listed emb=yes on every row: BarlowCondensed-ExtraBold, BarlowCondensed-Bold, SourceSans3ExtraLight-Regular, SourceSans3ExtraLight-SemiBold, and SourceSerif4-SemiBold. Those ExtraLight PostScript names are the weight-400 and weight-600 Source Sans 3 woff2 files. Their OS/2 weight classes are 400 and 600. The Source Serif 4 woff2 weight class is 600. `pdftotext` reads Chronos, Peoples outlast states, stored why-it-matters sentences, source titles, and No image files are shipped. `npm run check` does not run this export. `npm run export:reference` does.

Alternatives: Hand-maintain a reference PDF. Add a connection so every note has three. Number the sources 1 through 37.

Why: T7.05 asks for the expanded reference as an export of this dataset. Q-02 still leaves the Gemini bibliography out.

Reversible? y

## 2026-10-26 — export:all writes the print set and a manifest

Decision: `npm run export:all` builds the app, writes the three trim PDFs, the bleed poster, and the reference PDF, then runs the chart check on those four files. It writes `dist-print/manifest.json` with path, bytes, page inches, page count, and `generatedAt` taken from the clock at the write. On 2026-10-26 that stamp was `2026-10-26T21:43:38.334Z`. The files were letter 1006458 bytes, 8.5 by 11 in, 1 page; tabloid 1130105 bytes, 11 by 17 in, 1 page; poster 1576949 bytes, 24 by 36 in, 1 page; bleed poster 1588516 bytes, 24.25 by 36.25 in, 1 page; reference 103297 bytes, 8.5 by 11 in, 14 pages. The chart check then exited 0. A file that was not written is left out of the manifest. `npm run check` does not run this command. `dist-print/` stays gitignored.

Alternatives: Commit the PDFs. Put a fixed timestamp in the manifest. Run the export inside `npm run check`.

Why: T7.06 asks for one command that fills `dist-print/` and a manifest.

Reversible? y
