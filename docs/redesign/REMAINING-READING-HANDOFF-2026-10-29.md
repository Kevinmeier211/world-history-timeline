# Remaining-reading repair — local handoff

29 October 2026. Kevin asked for a bounded repair of the four findings in Codex’s review, then a stop. No dossiers, images, routes, or inferred connections were added. Nothing was committed, pushed, deployed, published, or packaged. Pushes: 0. CI runs: 0.

A later pass the same day repaired two bibliography-loader bugs. That record is at the end of this file. Codex’s review was not edited.

Codex’s review is unchanged: [GROK-READING-REVIEW-2026-10-29.md](GROK-READING-REVIEW-2026-10-29.md). This file records how each finding was resolved. The plains packet and the visual-exploration flow stay in place. The last sealed print/portable checkpoint remains `output/c8-industry-2026-10-29/`. This pass is not that checkpoint and is not a checked release.

Branch `codex/atlas-redesign`, HEAD `26977813205def7f237d1d0961ffe341695ebb92`. Later work is uncommitted. Pre-edit copies and hashes are in `output/grok-reading-repairs-2026-10-29/pre-edit/`. Copies taken before the bibliography split are in `output/grok-reading-repairs-2026-10-29/pre-perf-split/`.

## How the four findings were resolved

1. **War reading.** The existing World War I and World War II dossiers now carry bounded source capsules. World War I explains the Birtley conference and 11 April interview, Debauche’s 31 January 1919 letter, the Natha Singh extract, and the Watkins labour report, each with its purpose and limit. World War II explains Ginling (Vautrin, and the Tsen excerpt), the Singapore provisions card, passbook, and 1983 interview, and Lichtensztajn’s 31 July 1942 request in the 2019 English rendering. The older-reader activity is “Read the source capsules with an adult” (about 15 minutes). It forbids role-play, imagined diaries, and graphic imagery. The six regional case IDs were not created. Both reviews stay partial and name the next reading task. Reusing the 29 October drafts is not a fresh source audit. `consultedOn` remains 2026-10-29.

2. **Wendat navigation.** “Time and place” is rendered only when the dossier has a reference context. Wendat still has no invented numerical frame. Its two date clusters stay alternatives. Regression coverage is in `src/atlas/dossier-contents.test.ts` and in the seventeen-dossier browser check.

3. **Browser and print checks.** `scripts/redesign/reading-repairs-checks.mjs` covers all seventeen dossiers at 320, 390, 768, and 1440 pixels, then exports a Letter reader for each. It is part of the candidate browser suite. The r5 gate passed. See validation below.

4. **Provenance.** The statement that Middle Niger and voyaging had no prepared draft modules was wrong. The adopted accounts are the C6 modules, copied byte-for-byte from `output/c6-evidence-preflight-2026-10-29/` into `scripts/redesign/evidence-middle-niger.ts` and `scripts/redesign/c6-voyaging.ts` (SHA-256 `9c4f74759e9794189996d10a0326be7c3f9203dff492a28b5b1b85688a58a036` and `6db7d0972ad5343c9c6e45962d9cd2751267a85d12cf3bf86c952d8e4beb5b03`). The narrower search-exposed module remains in `scripts/redesign/content-niger-voyaging.ts` and is not called. Kupe, Toi, and the 1999 voyage stay only in that unapplied draft.

## What the corpus now holds

77 dossiers, 527 sources, 105 media, 76 reference contexts, 33 journeys. Public and dist copies match for `corpus.json`, `index.json`, `source-records.json`, `source-scopes.json`, and `contexts.json`. Corpus SHA-256 `4b6ea2949c3e65c599d9291ef2bb91063ccca18bb7bc998981106b65158f5431`.

The object intervals are unchanged. Middle Niger’s figure stays 1200–1300; the reused reference frame is about 400–1400. Voyaging’s case and reused reference stay 1250–1300. Wendat has expanded reading and `contextIds` unset. Banned regional IDs are absent. The old contexts `middle-niger-urban-study-context` and `polynesian-settlement-practice-context` are absent. The C6 contexts `middle-niger-settlement-evidence` and `voyaging-dating-knowledge-context` are present.

World War I has five evidence items. World War II has six. A deeper-reading field plus a context is not treated as proof that the editorial standard is complete. Word counts are diagnostics only.

Bibliography titles and URLs are not in the first-paint `index.json`. Each source stub there is `{id, scope: ""}`. The same fields, still with an empty scope, load from `source-records.json` after the first historical image and after the browser is idle. Scopes remain in `source-scopes.json`. This keeps the phone useful-view budget without removing record links.

## Source verification

This pass did not open a fresh independent source audit. It reused prepared, source-qualified drafts and recorded that limit on the war reviews.

Still unread or only partly seen, and still named in the adopted limits: the McIntosh 2005 book; the 1981 Middle Niger article except the exposed extract; the Rice report’s version date; unread figures; the catalogue HTML that returned 429; unread waiata and recordings; the star compass, which is not copied; Hansard as an independent review; unread British Library originals; uncollated Birtley papers; the unread Watkins typescript and appendices; Tsen’s Chinese manuscript or the full 2010 translation; the original National Archives of Singapore interviews. The narrower Met/Te Ara essay span was not adopted. Reconciling it with the C6 account waits on those unread books and articles.

## Automated validation

`ATLAS_REPORT_DIR=output/grok-reading-repairs-2026-10-29-r5/browser ATLAS_COVERAGE_DIR=output/grok-reading-repairs-2026-10-29-r5/coverage-atlas npm run check:candidate` finished with `EXIT:0`. `output/grok-reading-repairs-2026-10-29-r5/browser/suite.json` records `result: pass` at 2026-10-30T03:48:33.741Z, index SHA-256 `adc67152e5c4d22a89936554bdf834f982509336d6a214248ebd0778621d4ff5`, and the corpus hash above.

The log records 886 tests in 159 files and 527 atlas tests in 53 files. Atlas coverage in that directory is 65.34% statements, 64.41% branches, 52.96% functions, and 66.25% lines. JavaScript is 116,932 gzip bytes, under the existing 400,000-byte limit. The suite’s performance maxima are 1,994 ms useful text, 2,341 ms illustration, 115 ms search, 1,960 ms index readiness, 76 ms selection, and 356 ms dossier readiness. All twelve trials are inside the existing 2,500 ms and 200 ms limits.

Earlier receipts were not overwritten. `output/grok-reading-repairs-2026-10-29-r3/` and `output/grok-reading-repairs-2026-10-29-r4/` remain. r4 failed on one desktop search click at 220 ms while the bibliography file was parsed on that same turn. The idle deferral is what r5 checked. A focused timing rerun before r5 is in `output/grok-reading-repairs-2026-10-29-perf2/`.

The seventeen readers are in `output/grok-reading-repairs-2026-10-29-r5/browser/reading-repairs/`. All 184 pages are pixel-identical at 40 dpi to the focus2 readers that were inspected page by page. Chapter, family, overview, and companion PDFs are in `output/grok-reading-repairs-2026-10-29-r5/browser/print/` and match the public and dist export copies in the suite’s byte check. All 527 of those pages are pixel-identical at 40 dpi to the r3 renders. PDF bytes differ by generation metadata. The inspected r3 pages were the overview, the family sheets, the companion page for Te Tiriti, and the chapter pages that carry the Birtley, Ginling, Lichtensztajn, Wendat, and Middle Niger passages. An edge check of the rendered changed chapter ranges plus every family, notes, and overview page found no ink in a 6-pixel outer band. That is not a claim that every one of the 455 chapter pages was read at full size.

No portable ZIP was created. Do not treat any older ZIP as this pass.

## Human acceptance

Not claimed. Automated checks are not historian or community approval, family usability, screen-reader acceptance, physical-device behavior, or physical print quality.

## Still open

The six regional war dossiers remain unadopted. World War I’s next task is independent review of Hansard, the unread British Library originals, the uncollated Birtley papers, and the unread Watkins typescript before any split. World War II’s next task is Tsen’s Chinese manuscript or the full 2010 translation, and the original Singapore interviews. Middle Niger still needs the unread 2005 book and the full 1981 article before the narrower essay span is reconciled. Voyaging still needs the unread waiata, recordings, and figures before Kupe, Toi, or the 1999 voyage is added to the adopted reference. No star compass is copied.

Broader content expansion was not resumed.

## Bibliography loader repair

Same branch and HEAD. Kevin asked to fix only the two bibliography-loader bugs, add regression tests, run the checks named below, update this handoff, and stop. Nothing was committed, pushed, deployed, published, or packaged. Pushes: 0. CI runs: 0. No ZIP. The four reading repairs, the visual exploration flow, historical content, dates, media, journeys, relationships, comparisons, and notebook compatibility stay in place. Research packets, earlier receipts, and the r5 PDFs and suite file were not overwritten.

Pre-edit copies and hashes are in `output/grok-bibliography-loader-2026-10-29/pre-edit/`. The fresh receipt is `output/grok-bibliography-loader-2026-10-29/`. Executed commands and exit lines are in `output/grok-bibliography-loader-2026-10-29/commands.txt`.

### What changed

1. **Silent failure.** `loadSourceRecords` rejection is no longer discarded. The atlas keeps an explicit bibliography state: idle, loading, failed, or ready. A failed `/atlas/source-records.json` response, including HTTP 503, leaves reading, pictures, and navigation usable. A fixed status banner explains the failure and offers “Retry source records”. Retry sends only that bibliography request. Changing views does not retry, and there is no automatic retry loop. The first attempt still waits for the first historical image, then for an idle callback with a 1,500 ms timeout, so bibliography parsing stays off the first-paint and first-search turn. An explicit retry starts immediately. Initial failure does not move keyboard focus. After the reader activates retry, focus stays on the status while loading and returns to the reading title, the gallery question, or the skip link when the records recover. Citations, gallery provenance, and saved-note links render an anchor only when the source has a URL. Consultation metadata is shown only when the record actually has it. “Original records remain linked” is included only when every cited source has a URL, which is the existing consultation-scope failure case.

2. **Unvalidated success.** `loadSourceRecords` validates the JSON before caching it or merging it into the corpus. A non-array (`{}` included), malformed JSON, a non-object row, a blank or duplicate id, a missing required field, a URL that is not http or https, an unknown type, a non-string scope, or a non-string optional `author` or `published` is rejected. When the atlas supplies required ids, the response must contain exactly those ids. Empty `scope` remains valid. Optional fields are copied only when present. Unknown fields are dropped. A failed or invalid response is removed from the cache, so the next explicit retry can succeed. An older rejection cannot evict a newer in-flight retry.

Print components were not changed. They still read the complete corpus from `corpus.json`.

### Regression results

`src/atlas/source-records.test.ts` (26 tests) covers the real bibliography file, empty scope, omitted optional fields, wrong shapes, invalid rows, duplicate and missing ids, cache clearing, and retry races. `src/atlas/bibliography-ui.test.ts` (3 tests) covers a usable reader during loading, a failure that does not invent links or the “records remain linked” sentence, keyboard focus across retry, and recovery of the title, consultation line, URL, and scope retry.

The atlas suite, `npx vitest run --config vitest.atlas.config.ts`, passed 556 tests in 55 files. It was run without `--coverage`, so this receipt has no coverage report. The r5 coverage figures remain the last full-gate figures.

`scripts/redesign/bibliography-loader-checks.mjs` is now in `scripts/redesign/run-browser-suite.mjs`, immediately after `learning-checks.mjs`. A future candidate gate will exercise these paths. This pass did not run that full gate. The browser fault check passed at 390×844 and 1440. Each width covered a healthy load, a delayed load, HTTP 503 on the gallery and on the Chang’an dossier, malformed JSON, `{}`, a missing title, a duplicate id, and a missing required id. Recovery restored titles, consultation metadata, and working source URLs. The gallery recovery source was `met-317600`. The dossier recovery title was “Chang’an (Xian)” at `https://depts.washington.edu/silkroad/exhibit/tang/essay2.html`. There was no blank screen, uncaught runtime error, false “records remain linked” message, or uncontrolled retry. Keyboard focus stayed useful. An earlier run of that script failed because the original-record link sits inside a closed details element; the passing receipt is the rerun at `output/grok-bibliography-loader-2026-10-29/browser/bibliography-loader/checks.json`.

The same script opened the reader and chapter print routes while forcing `source-records.json` to 503. Those routes made zero source-record requests, and the reader and chapter still showed the corpus bibliography. That is the representative print check. The seventeen-dossier PDF export and `export-print.mjs` were not rerun, because print behavior was not changed.

`learning-checks.mjs` passed, including the existing scope-load failure: “Original records remain linked”, an https citation href, and “Retry source details” restoring “Full university essay”. That script also wrote its usual three C5 reader PDFs into `output/grok-bibliography-loader-2026-10-29/browser/learning/`. Those files are this check’s own output. They do not replace the r5 readers.

`visual-exploration-checks.mjs` passed at 320, 390, 768, and 1440, including the thumbnail-failure and delayed-diagram paths. Receipt: `output/grok-bibliography-loader-2026-10-29/browser/visual-exploration/results.json`.

The twelve performance trials passed with the limits unchanged: 2,500 ms for useful view, search-index readiness, and dossier readiness, and 200 ms for search and selection. The phone profile stayed 390×844, 4× CPU, 150 ms latency, and cold cache. Maxima: useful text 2,004 ms, illustration 2,372 ms, search 100 ms, index readiness 1,927 ms, selection 84 ms, dossier readiness 362 ms. Receipt: `output/grok-bibliography-loader-2026-10-29/browser/performance/performance.json`.

### Preservation and hashes

Canonical data hashes were recorded before editing and again after the build. Public and dist copies match. They are unchanged:

| File                  | SHA-256                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `corpus.json`         | `4b6ea2949c3e65c599d9291ef2bb91063ccca18bb7bc998981106b65158f5431` |
| `index.json`          | `56c306d33c641706f4b383c088061d009695d7b4f3aaab6dc24d6ebf1c9f0473` |
| `source-records.json` | `e998e7b09a464ce82d55d71ad125da96be3b1cf324c4c82c3ad6b2ac66ece0c2` |
| `source-scopes.json`  | `bb474490981bc3583db141f02ab201f55ff47a0fea58157a5bdc995c261608e7` |
| `contexts.json`       | `94c82480be2d6847b780a2b54faf8e9f317dddcb46219f2b765ebe414b47d749` |
| `search.json`         | `5f642ff9ddfd67e231b9caba22b289c7d19903e4a88a1bd5ed70c0429700ee01` |

Browser checks used this build, and no application source changed after it:

| Built file                           | SHA-256                                                            | Bytes   |
| ------------------------------------ | ------------------------------------------------------------------ | ------- |
| `dist/index.html`                    | `8a193d89815034fc4d574bcb584562a928637b0ed316a0f7e8ecca1a9b945c86` | 1,534   |
| `dist/assets/index-Cua0FLKR.js`      | `ba2b13fd4dd1d52a3ef1dedd4d1a78d066a4fc6fc64f7ae3321bda3ea9073a37` | 375,087 |
| `dist/assets/PrintAtlas-D88NtSyo.js` | `e42685d77ba4d72bc4eb93a9b692b6fdf990cb7ee5c199b2fba04eaf2d070d27` | 26,077  |

Vite reported about 109.74 kB gzip for the index chunk. The separate bundle-size gate script was not run.

### Checks that ran

From `/Users/kevinmeier/World Hist Timeline`. The recorded results below exited 0. The first bibliography-script attempt exited 1 and is described above; the receipt is the rerun.

- `npm run build` (`content:build`, `tsc -b`, `vite build`).
- `npm run design:lint`.
- ESLint on `App.tsx`, `data.ts`, `Evidence.tsx`, `Notebook.tsx`, the two new tests, `bibliography-loader-checks.mjs`, and `run-browser-suite.mjs`. Prettier then formatted the browser script; ESLint and Prettier were clean afterward. The formatting change does not alter the passing browser receipt.
- Atlas unit suite, 556 tests in 55 files.
- Bibliography fault checks at phone and desktop, including the print-route spot check.
- `learning-checks.mjs` and `visual-exploration-checks.mjs`.
- Twelve performance trials.

Not run, and not claimed: `npm run check`, `npm run check:candidate`, the bundle-size script, atlas coverage, `reading-repairs-checks.mjs`, `export-print.mjs`, and any portable ZIP. `output/grok-reading-repairs-2026-10-29-r5/` remains the last full candidate gate, checked at 2026-10-30T03:48:33.741Z. `output/grok-reading-repairs-2026-10-29-r3/`, `output/grok-reading-repairs-2026-10-29-r4/`, and `output/grok-reading-repairs-2026-10-29-perf2/` remain historical. The last sealed print/portable checkpoint remains `output/c8-industry-2026-10-29/`.

### Human acceptance

Not claimed for this loader repair. Automated checks are not historian or community approval, family usability, screen-reader acceptance, physical-device behavior, or physical print quality.

Content expansion, redesign, and the other roadmap items were not resumed.

## Notebook persistence and status notices — 30 October 2026

Kevin asked Codex to fix the two remaining findings from the bibliography-loader review. This local repair uses the same branch and HEAD. Nothing was committed, pushed, deployed, published, messaged or packaged. Earlier research, receipts, PDFs and ZIPs are preserved.

A saved source reference now contains either its complete metadata or just its identifier and locator. The parser also accepts the identifier/locator-only shape saved by earlier builds during a deferred bibliography request, so those stored notes become readable alongside earlier valid notes. Partial metadata and unsafe URLs remain invalid. Writes validate the outgoing notebook before replacing storage. Version 1, initial answers, revisions and import conflict handling are retained.

The notebook explains when source record details were unavailable at save time. Saving does not retry the bibliography, and later recovery does not invent metadata in the saved snapshot. New notes saved after recovery retain complete records. Bibliography and saved-note notices now share a fixed stack with spacing and a viewport height limit; mouse Retry and Dismiss are both usable.

Fresh evidence: `output/notebook-bibliography-repair-2026-10-30/README.md` and `verification.json`. Scoped source snapshots are under `pre-edit/`. The six canonical atlas JSON files are byte-identical to the earlier loader receipt and match dist.

- Four regression tests failed before the fix; all 53 focused tests now pass.
- Build and `npm run check` pass: type, lint/format, design, palette, 929 tests in 161 files and complete structural data validation. The initial sandboxed check stopped at the temporary IPC socket used by `tsx`; the permitted local rerun passed.
- The separate atlas run passes 570 tests in 55 files. Atlas coverage: 69.52% statements, 68.92% branches, 57.92% functions, 70.61% lines. The bundle gate passes at 117,949 JavaScript gzip bytes.
- All 27 bibliography browser scenarios pass. The eight new notebook flows cover loading and 503 at 320, 390, 768 and 1440 pixels: earlier-note preservation, source IDs/locators, ordinary mouse retry with both notices present, reload, export/import, another save and another reload. Each finishes with three preserved notes. The earlier malformed JSON, `{}`, missing-title, duplicate-ID, missing-ID and keyboard-focus checks remain. Request totals in notebook rows include reloads; initial request/retry counts are asserted before those reloads.
- Existing notebook checks, including blocked storage and import conflicts, journey loading, media loading and visual exploration pass. Phone and desktop notice screenshots were visually inspected.
- Reader and chapter print routes retain the corpus bibliography with `source-records.json` forced to 503 and make zero requests to that endpoint. This is a print-route check, not a new PDF export receipt.
- All twelve performance trials pass with unchanged profiles and limits. Maxima in ms: text 2,076; illustration 2,390; search 120; index readiness 1,960; selection 83; dossier readiness 363. Limits remain 2,500 ms and 200 ms.

This was scoped repair validation, not a new full `check:candidate` run. The other browser workpacks, seventeen-reader PDF export, `export-print.mjs` and portable packaging were not rerun. Broader content and human-acceptance tasks remain open.

## Full local technical checkpoint — 30 October 2026

Kevin asked to continue with the recommended final technical checkpoint while holding further content expansion. No application code or historical data changes were needed during this checkpoint. The actual branch and base HEAD remain `codex/atlas-redesign` / `26977813205def7f237d1d0961ffe341695ebb92`. The interface, Grok's content work and later repairs remain uncommitted.

Fresh evidence is in `output/final-local-candidate-2026-10-30/README.md`. The exact command was `ATLAS_REPORT_DIR=output/final-local-candidate-2026-10-30/browser ATLAS_COVERAGE_DIR=output/final-local-candidate-2026-10-30/coverage-atlas npm run check:candidate`.

- The full gate passed: build, type/lint/design/palette/data checks, 929 tests in 161 files, the separate 570-test atlas coverage run, all 39 browser scripts, all 33 journeys, all twelve performance trials and 223 decoded derivatives across 105 media records. The bibliography and notebook regressions run as part of that full suite.
- JavaScript remains 117,949 gzip bytes. Performance maxima in ms: useful text 2,009; illustration 2,368; search 127; index readiness 1,943; selection 80; dossier readiness 360. Profiles and the 2,500/200 ms limits are unchanged.
- All 81 PDFs were freshly exported: 77 readers / 829 pages, chapters / 455 pages, family sheets / 33 pages, overview companion / 38 pages and one A3 overview, totaling 1,356 pages. Paper sizes, tags, nonempty pages and public/dist/report copies pass. There are zero extracted characters outside page bounds. Tags are not a PDF/UA claim.
- All 1,356 pages were rendered at 72 dpi and compared pixel-for-pixel with the prior r5 PDFs: 1,356 identical, zero changed. A twelve-page contact sheet and full-size family/source checks were inspected. This is author technical review, not a new independent historical or physical-print review.
- All 77 readers retain 4,661 checked authored passages, including family instructions, interpretations, phases and review limitations. Their 508 selected source references retain titles, attribution, consultation text and working PDF link annotations. The checks use Poppler layout extraction: pypdf mishandles one decomposed macron, and flowing extraction can reorder Japanese/Latin text. Both source pages were visually inspected; the original titles remain correct. Generated page-number footers are removed only for cross-page passage comparison. The initial inspection logs are retained.

The portable artifact is `output/final-local-candidate-2026-10-30/chronos-local-candidate-2026-10-30.zip`. It includes the checked static site, all 81 PDFs, licences/manifests, selected current evidence and an exact working-tree source archive. `SOURCE_STATE.json` binds current source/build/evidence bytes and explicitly identifies uncommitted work; the older committed-source packager was not invoked as a current receipt. Private references, research PDFs, real user notebooks and earlier ZIPs are excluded. `PORTABLE_RESULT.json` is the authoritative completed archive hash and fresh-extraction/browser result; packaging is established only by its passing result. Run the extracted folder with `python3 launch.py`.

Earlier dated receipts, research and packages remain intact. No commit, push, deployment, publication, external message or automation was made. Broader historical coverage, product/learning refinement and independent/family/accessibility/device/physical-print acceptance remain open; this checkpoint does not complete the whole roadmap.

## Saved for later — 30 October 2026

Kevin paused before usability feedback and asked to save everything. A local Git checkpoint now preserves the current app, content, tests and handoff on `codex/atlas-redesign`. The actual commit and save verification are recorded in `output/savepoint-2026-10-30/SAVEPOINT.json`. No push, deployment or publication was made. Research, local-only references, receipts and earlier ZIPs remain in their existing local folders and are excluded from the source commit.

Read [RESUME-2026-10-30.md](RESUME-2026-10-30.md) when returning. The packaged preview uses `http://127.0.0.1:4384/`; the note contains the exact restart command and the last review URL. Content expansion remains on hold while awaiting Kevin's experience with the app. The verified package/receipts are immutable and still describe their earlier working-tree snapshot; only save/resume documentation changed after that gate. Saving does not require another runtime validation cycle for the unchanged application.
