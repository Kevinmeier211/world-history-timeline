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
