# Handoff

Chronos Atlas v2, local only. This is the §13.14 closeout. Pushes made: **0**. CI runs triggered: **0**.

The print gate is the merge `a9f3a4e` on `v2/main`. The annotated tag `v2-p7-done` points at that merge (tag object `eaca0fa`). Closeout commits are on `v2/p7-print` after `fa54816`. They are not in the tag.

## Per-phase status

| Phase | Where it stands                                                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0    | Merged. `v2-p0-done` is `328b547`. Branch `v2/p0-tooling` is `30271ba`.                                                                                          |
| P1    | `v2-p1-done` is `b4f3bea` (T1.29). That commit is an ancestor of `v2/main`. The tag is the content commit, not a merge commit. Branch `v2/p1-data` is `ab39aa9`. |
| P2    | Merged. `v2-p2-done` is `390baa7`. Branch `v2/p2-layout` is `ccf2731`.                                                                                           |
| P3    | Merged. `v2-p3-done` is `09a5f75`. Branch `v2/p3-poster` is `67d63e2`.                                                                                           |
| P4    | Merged. `v2-p4-done` is `7aa3c39`. Branch `v2/p4-media` is `51ac16b`. Images stayed gated.                                                                       |
| P5    | `v2-p5-done` stays at `b5f7501` (the 5/10 review). Branch `v2/p5-interactions` is `1e6d5ab` (the 9/10 review). Both commits are ancestors of `v2/main`.          |
| P6    | Merged. `v2-p6-done` is annotated: tag object `50fb131`, commit `533cafd`. Branch `v2/p6-content` is `02b065a`. Checkpoint: `docs/reviews/M3.md`.                |
| P7    | Merged and tagged. See the opening paragraph. Branch tip at the gate was `fa54816`.                                                                              |
| P8    | Closed. `MAX_PHASE=7`.                                                                                                                                           |
| P9    | README, `docs/LICENSES.md`, this file, and `docs/CONTEXT.md` are on `v2/p7-print`. T9.03 is unrun.                                                               |

`main` (the GitHub default branch) is still `14b5965`, tag `gemini-v1`, tracking `origin/main`. This run did not commit to `main`.

## Metrics

These numbers were already in the tree, or measured from a file already on disk. This closeout did not re-run `layout:report`, `perf`, `shots`, `axe`, `media:budget`, or `bundle:check`.

### Layout

`docs/reports/layout-latest.json`:

| Field               | Value                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Ribbons / polities  | 238 / 436                                                                                                                |
| Overlaps            | 0                                                                                                                        |
| Minimum gap         | 6                                                                                                                        |
| Importance-3 labels | 82/82                                                                                                                    |
| Callouts            | dropped 220, markers 13, placed 90                                                                                       |
| Relations           | 450 total, 172 routed, 278 omitted, 0 unroutable                                                                         |
| Label hits          | 0                                                                                                                        |
| Max drift           | 3.211                                                                                                                    |
| Cold / warm         | 257 ms / 177 ms                                                                                                          |
| Gates               | overlaps, unroutable, and importance-3 fit pass. `runtimeMs` is false. `pass` is false. The only failure is `runtimeMs`. |

The 150 ms gate stays. The engine was left as it is. `docs/reviews/M3.md` records an earlier run (warm 188 ms, placed 88, dropped 222). The JSON above is the later committed report (warm 177 ms, placed 90).

`docs/reviews/layout-pass.md` scores Appendix D at 9/10, with item 2 partial on `japan_timeline`. `docs/reviews/M4.md` is an earlier P5 score, 5/11. T9.03 did not replace that file.

### Bundle

`scripts/bundle-size.ts` gzips each `dist/assets/*.js` with Node `gzipSync` and fails above 400 KB (`400 * 1000` bytes). On 2026-10-26 the file already in `dist/assets/index-WNtnW4YO.js` was 1,306,157 bytes raw and 280,930 bytes gzipped (280.93 KB). That is the method the script uses. `npm run bundle:check` was not re-run; that command rebuilds. A T5.20 run recorded an earlier build at 233.77 KB.

### Performance

`docs/reviews/M3.md`: `npm run perf` exited 0, 300 ribbons mounted, 149 frames, p95 16.80 ms, worst 83.30 ms. The p95 gate is 20 ms. That probe was not re-run.

### Accessibility

The decision “Axe scenes report no serious or critical issues” records `npm run axe` on the chart, dossier, dark theme, table, search, reading key, stories, columns, and era reading, at 1440×900, 1920×1080, and 390×844. A later decision records 24 passed and no serious or critical violation. Moderate landmark notes remain: the top bar and the title band are both banners, and the page has no main landmark. Axe was not re-run for this closeout.

### Closeout check

`npm run check` during the closeout reported 115 files, 376 tests, and layout branch coverage 86.26%. `validate:data` reported 436 polities, 155 roots, and 0 warnings. The jsdom canvas `getContext` lines are the expected notice. Export and `check:pdf` sit outside `npm run check`.

## Screenshot index

This closeout did not retake frames. `docs/reviews/M3.md` attributes `docs/shots/p3/` to `f2a236c`.

`docs/shots/v1/` has 12 PNGs: desktop, mobile, and wide, each with ancient, classical, default, and modern.

`docs/shots/p3/` has 21 PNGs: desktop, mobile, and wide, each with overview, ancient, classical, medieval, dark, focus, and modern.

## Counts against §7

| Target                             | Floor | On the sheet |
| ---------------------------------- | ----: | -----------: |
| Polities                           |   300 |          436 |
| Relations                          |   450 |          450 |
| Callouts                           |   260 |          323 |
| Callouts at importance 3 or higher |   100 |          100 |
| Bands                              |    35 |           35 |
| Routes                             |    15 |           15 |
| Images                             |   120 |            0 |
| Tours                              |    10 |           15 |

Tour stops are 63. Presets are 5 (`src/data/presets.json`). Sources are 58. Polity importance is 2 = 354, 3 = 82, 4 = 0, 5 = 0. Callouts at importance 3 are 60 and at importance 4 are 40.

Era floors from the closeout `validate:data`, all met: 3300–2000 BCE 38 (floor 35), 2000–1000 BCE 48 (40), 1000–1 BCE 83 (55), 1–500 CE 67 (40), 500–1000 CE 103 (45), 1000–1500 CE 113 (55), 1500–1800 CE 108 (55), 1800–2000 CE 171 (70).

Every loaded row is unverified. Cross-checked rows are 0. Primary-checked rows are 0.

## UNVERIFIED

`docs/UNVERIFIED.md` is generated by `npm run report:unverified`. Do not hand-edit it.

| Kind       | Unverified | Cross-checked | Primary-checked |
| ---------- | ---------: | ------------: | --------------: |
| Polities   |        436 |             0 |               0 |
| Relations  |        450 |             0 |               0 |
| Callouts   |        323 |             0 |               0 |
| Bands      |         35 |             0 |               0 |
| Routes     |         15 |             0 |               0 |
| Tour stops |         63 |             0 |               0 |
| Climate    |          1 |             0 |               0 |

Importance 4 and 5 are empty except callouts: 40 unverified, 0 cross-checked, 0 primary-checked. That is 40 of 40. The dossier chip is the honest state.

## Open questions

`docs/QUESTIONS.md` has Q-01 through Q-07. There is no Blocked entry for a missing PDF tool. Poppler and Chromium both ran during P7.

- Q-01. The UsefulCharts poster and both Gemini PDFs are absent.
- Q-02. Bibliography [1]–[37] was omitted. The hosts that returned 403, 429, or a challenge are listed there. `sources.json` has the 58 pages that returned HTTP 200 on 2026-10-25.
- Q-03. Tag `gemini-v1` has 6 routes and 5 presets. The plan text says 9 and 16.
- Q-04. Undated checklist names stay omitted. T6 later added states the pass names and Appendix B does not date.
- Q-05. Latin West uses debated intervals where the checklist left a gap inside the family minimum.
- Q-06. Conquest, vassalage, and migration were not assigned from untyped v1 parents.
- Q-07. The 3300–2000 BCE bin is 38. The floor stays 35.

## Known issues

- Warm layout runtime is 177 ms. The 150 ms gate is false. Overlaps are 0, unroutable relations are 0, and importance-3 labels fit 82/82.
- Images are 0. Fetch is queued-gated. The colophon says no image files are shipped.
- The 40 migrated callouts are importance 4 and unverified.
- Layout-pass item 2 is partial on `japan_timeline` (max drift 3.211).
- On the export stamped `2026-10-26T21:43:38.334Z`, letter minimum stroke is 0.181 pt and the 0.25 pt floor is not applied. Tabloid minimum is 0.304 pt and the floor is not applied there either. Poster minimum is 0.562 pt and the bleed poster is 0.500 pt. Both poster jobs pass the floor. See `docs/PRINT_QA.md`.
- Chart PDFs embed Arimo-Bold for U+2192 in addition to the shipped faces. Source Sans 3 woff2 files use the PostScript names `SourceSans3ExtraLight-Regular` (OS/2 weight 400) and `SourceSans3ExtraLight-SemiBold` (OS/2 weight 600).
- No contract proof was printed. Parchment `#f1e8d2` on uncoated stock needs one before a press run.
- Q-01 and Q-02 are still open.

## How to run and export

```bash
npm install
npm run dev
npm run check
npm run export:pdf
npm run export:reference
npm run export:all
npm run check:pdf
```

`npm run dev` serves the poster. `?print=1` is the static 24×36 sheet. `size=letter` is 8.5×11. `size=tabloid` is 11×17. `?print=1&bleed=1` adds 0.125 in of bleed and crop marks on the poster only.

`export:pdf` writes the three trim PDFs under `dist-print/`. `export:reference` writes the era-by-region Letter PDF from the stored notes. `export:all` writes the trim PDFs, the bleed poster, the reference PDF, and `dist-print/manifest.json`, then runs the chart check. `check:pdf` checks page size, font embedding, image dpi, and the poster stroke floor. `dist-print/` is gitignored. These commands sit outside `npm run check`.

`npm run shots`, `npm run perf`, `npm run axe`, `npm run layout:report`, and `npm run bundle:check` also sit outside `npm run check`. `media:fetch` reports queued-gated while downloads are off.

Switches in `docs/RUN_CONFIG.md`: `MAX_PHASE=7`, `ALLOW_MEDIA_DOWNLOAD=false`, `ALLOW_PUSH=false`, `ALLOW_DEPLOY=false`.

## Git summary

Pushes made: **0**. CI runs triggered: **0**.

`v2/main` is `a9f3a4e`, 223 commits, parents `533cafd` and `fa54816`. `v2/p7-print` holds the print work through `fa54816` and the closeout commits after that. It does not contain the merge commit. The tag was not moved.

Annotated tags: `v2-p6-done` (`50fb131` → `533cafd`), `v2-p7-done` (`eaca0fa` → `a9f3a4e`). The other `v2-pN-done` tags are lightweight and point straight at the commits in the phase table. `gemini-v1` is `14b5965`.

There is no `.github` directory. No workflow file was added. `origin` exists. This run did not push.

Closeout hashes are the T9 rows in `docs/PROGRESS.md`.

## Recommended next steps

- T9.03, if a release-candidate review is wanted: `shots`, `perf`, `layout:report`, `media:budget`, and `axe`, written up under a new filename. `docs/reviews/M4.md` stays the P5 score of 5/11. If warm runtime is still over 150 ms, leave the engine and the gate as they are.
- Leave the 40 importance-4 callouts unverified until a listed page is opened and the evidence note records what it said.
- A contract proof before any press run.
- P8 stays closed until `MAX_PHASE` is at least 8 and Kevin asks. This closeout does not start it.
- Leave `v2-p7-done` on `a9f3a4e`. The closeout commits stay on `v2/p7-print`.
