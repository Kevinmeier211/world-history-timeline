# Startup media delivery continuation

29 October 2026 · Local implementation on `codex/atlas-redesign`, starting from sealed and packaged C3 commit `f36f1bbc5cae5f4299e7ea3175d3c9d3a9bef49d`.

The startup media candidate passes its final integrated gate, source/preservation checks and actual PDF/visual review: **635 tests in 135 files**, separate **276 atlas tests in 29 files**, all 25 journeys, 205 image derivatives and **41 PDFs / 686 pages**. All 686 rendered PDF pages are pixel-identical to sealed C3. This is a local delivery improvement; the broader atlas plan remains open. Checkpoint identity belongs to the completion receipt's `SOURCE_STATE.json` and actual archive/extraction status to its subsequently produced `PORTABLE_RESULT.json`.

## What changed

Opening the atlas previously downloaded detailed interpretation for every image. The bootstrap now keeps the information needed for immediate display and provenance, while a dossier requests its complete image information alongside its reading. An overview makes no request for those details. One revisioned file serves all images belonging to the selected dossier, so switching between its images does not add a request.

The bootstrap retains image IDs and titles, complete dates, image/thumbnail paths and dimensions, alt text, attribution, rights, licence, institutional source and source-image link, depiction type and accession. Captions, observation prompts and detailed object/interpretation fields load from `atlas/media-records/<subject>.json`. Full canonical media records remain complete; print continues to read the full corpus directly.

The payload preflight records **153,250 → 134,307 gzip-6 bytes** for the bootstrap, a reduction of **18,943 bytes**. There are **68** subject files, with median **691** and maximum **1,415** gzip bytes after formatting with the repository configuration. These are compressed payload measurements, not a claim of a corresponding network-time reduction. See [payload-formatted.json](../../output/startup-media-2026-10-29/payload-formatted.json).

The reader and open inspection show an explicit loading status. A failed detail request retains the image, date, credit, rights, licence and source fallback, and offers **Retry image information**. An incomplete bootstrap that cannot identify the correct revision instead offers **Reload atlas**. Image-file failure has its own recovery. Failure is settled reading state, but it is never presented as verified metadata readiness.

Metadata hydration preserves the mounted image and inspection dialog, including the selected view, zoom and focus. A previous dossier's late response cannot populate the current dossier. Reading focus settles once per navigation; metadata retry does not repeat it, and completion does not steal focus from open inspection. Local source-image links respect the application base path; scheme and protocol-relative external URLs remain external. Image fallback controls avoid nested links/buttons inside the inspection opener.

The loader validates subject, revision, exact image membership and the allowed detail fields before exposing a record. It rejects missing, incomplete, malformed or mismatched responses and retained-field injection. Validated requests share a cache; failed requests are evicted so retry can recover. An unmarked incomplete full record cannot silently count as ready.

A small notebook repair also aligns saved evidence with the image actually displayed when a copied URL supplies a missing or foreign object ID. Its two focused regressions cover both cases. Accession and full dates remain available while details are pending or unavailable.

## Historical content and preserved evidence

This continuation adds no historical assertions, sources, images, contexts or registry dispositions. The canonical corpus remains byte-identical to C3:

```text
315df4cabf71d47e32d6d228bda2525aedf09ce6d32e2961d0327743b8324a35
```

The [final invariants](../../output/startup-media-2026-10-29/invariants.json) records unchanged complete intervals/records for all **77 dossiers**, **322 source records**, **96 full media records**, all **205 image files**, all **77 subject-reading files**, the contexts/search/source-scope files and the topic registry. All 68 detail files reconstruct the previous 96 web media records; public/build data parity passes. The corpus still has **37 expanded dossiers**, forty not comprehensively deepened, nine without attached media, 37 contexts, 62 comparison pairs, eight packs, 25 journeys and 75 glossary terms. All 1,274 legacy dispositions remain accounted for.

The [C3 handoff](C3-NILE-PALACES-HANDOFF-2026-10-29.md), [C3 source record](C3-NILE-PALACES-SOURCES-2026-10-29.md), sealed research/verification folders and earlier archives remain historical evidence for their own bytes. This delivery pass does not renew source consultation or independent historical review.

## Final validation and retained diagnostics

The earlier combined focused run passed **103 tests in five files**: loader/schema/cache behavior, compiler/bootstrap parity, media UI settlement/recovery and notebook fallback provenance. The UI test now awaits the terminal reading effect before asserting its callback; DOM commit alone did not establish that the effect had run. Once-only assertions after retry remain. See [targeted-final-followup.log](../../output/startup-media-2026-10-29/targeted-final-followup.log). A subsequent focused UI run passes **19 tests**, including one additional scrolling-region focus regression. The passing final integrated run includes the new regression; the earlier 103-test run predates it.

Author visual/accessibility follow-up identified two further repairs: the inspection's scrolling image region lacked keyboard focus, and a toast's dismiss button inherited light text on a light background. The image region is now a named, focusable region with native keyboard scrolling, the dialog has an accessible name, and toast buttons use the existing ink token. The unit check verifies focus and region identity through failed/loading/ready metadata states. The fresh browser preflight verifies real Tab access and ArrowDown/ArrowRight panning at all four widths, Axe checks while pending at 320 pixels and in the failed open inspection at 390 pixels, and readable dismiss controls. The earlier failing accessibility probe is preserved; the new results describe the repaired candidate.

The fourth browser preflight passes **18 cases**: parallel pending requests at 320/390/768/1440 pixels, object switching, retained provenance, stable image/inspection/zoom/focus through retry, eight rejected responses, incomplete-bootstrap reload, stale case response, foreign object fallback, independent image failure, an imageless dossier and synchronous canonical print. See [browser checks](../../output/startup-media-2026-10-29/browser-preflight-4/media-loading/checks.json). These are automated browser checks, not human screen-reader or physical-device acceptance.

The first integrated attempt stopped because the 68 generated detail files did not match repository formatting. The generator now uses the repository's Prettier configuration; no formatter exclusion was added. The formatted payload above supersedes the smaller unformatted sidecar measurements, while the bootstrap size is unchanged. The original failure log remains retained; the repaired final gate passes.

The first performance preflight failed desktop search and selection bounds while its phone targets passed. The unchanged sealed-C3 control passed. All six subsequent candidate trials passed unchanged profiles and bounds, with maxima of **2,110 ms** useful text, **2,344 ms** illustration, **189 ms** search, **1,542 ms** search-index readiness, **106 ms** selection and **415 ms** dossier readiness. The original failure's cause is not established; all runs are retained in [performance-investigation.json](../../output/startup-media-2026-10-29/performance-investigation.json). These controlled preflights are historical diagnostics; the final integrated result below is authoritative for the gate.

A later partial run passed 635 tests but stalled in `release-browser.mjs` at the hidden-dialog lazy image wait, confirmed by the stack at line 308. An early suspicion about Axe was not the diagnosis. The harness now restricts the wait to viewport-visible images, bounds decoding/selection/navigation waits and closes the browser in `finally`; all original assertions remain. The partial run is preserved in `before-visible-image-wait-repair/` and does not count as a passing gate.

The **final integrated gate passed with exit 0**. Actual atlas coverage is **52.35% statements / 52.59% lines / 50.27% branches / 40.24% functions**, measured by the separate atlas run, and JavaScript is **110,783 gzip bytes**. All six final performance trials pass unchanged bounds: maxima **2,052 ms** useful text, **2,332 ms** illustration, **125 ms** search, **1,443 ms** search-index readiness, **90 ms** selection and **374 ms** dossier readiness. The gate also passes the repaired bounded image wait and all new four-width media flows. See [candidate-gate.log](../../output/startup-media-2026-10-29/candidate-gate.log), [actual atlas coverage](../../output/startup-media-2026-10-29/coverage-atlas/coverage-summary.json) and [final performance trials](../../output/startup-media-2026-10-29/browser/performance/performance.json).

All **41 PDFs / 686 pages** were rendered and checked for page bounds, tags, matching public/build bytes and source completeness. The exact pixel comparison is **686 identical / zero changed** against sealed C3, so its prior page inspection remains applicable. The 37 individual readers contain 362 pages; chapter investigations contain 269, family sheets 25, the A3 poster one and its companion 29. Source checks cover **448 chapter source records / 291 unique sources**, all 37 reader bibliographies, all 25 family sheets and all 44 poster sources. Tagged output does not establish PDF/UA conformance.

Final internal author visual review passes **17 screenshots and three contact sheets**, with four further views at native phone size, covering pending/error/recovered reading and inspection, map geometry, sources and readable dismiss controls. This is author QA, separate from independent historian review or real family, human screen-reader, physical-device and physical-print acceptance. The [visual record](../../output/startup-media-2026-10-29/visual-review.json) and [final metrics](../../output/startup-media-2026-10-29/metrics.json) identify the actual reviewed candidate and PDF comparison.

Portable checks have been extended to verify all 68 detail endpoints, hashes, allowed fields, cross-references and public/build parity, plus recovery inside open inspection after a deliberately failed local request. Use the actual `output/startup-media-2026-10-29/SOURCE_STATE.json` for `completionCommit` and source/build hashes once sealed. The subsequently produced `PORTABLE_RESULT.json` is authoritative for the archive filename/hash and fresh-extraction result. This handoff's passing gate/PDF results do not by themselves assert archive success; consult those actual records rather than inferring it from a prior package.

## Continue locally

Read [current status](STATUS.md), the [roadmap](ROADMAP-2026-10-27.md) and the [topic registry](TOPIC-REGISTRY.md). A fresh integrated gate can use:

```sh
ATLAS_REPORT_DIR=output/current-candidate/browser ATLAS_COVERAGE_DIR=output/current-candidate/coverage-atlas npm run check:candidate
```

Use a fresh output location when retaining a new receipt. Start the development preview if needed with `npm run dev -- --host 127.0.0.1 --port 4382`. Useful checks include `/?pack=C3&subject=nimrud-palace&object=nimrud-palace-plan&scale=local&year=-850`, an imageless dossier such as `/?subject=banda-1621`, and a dossier URL whose object belongs to another case.

The preceding [C3 archive](../../output/c3-nile-palaces-2026-10-29/PORTABLE_RESULT.json) remains preserved and does not contain this startup continuation. Choose a current archive only from its actual portable result. Existing reference material, research output and earlier ZIPs remain preserved; the old packaging script is not a current release receipt. Output-only next-content research under `output/next-content-preflight-2026-10-29/` is separate from the unchanged teaching corpus and this delivery validation.

Broader simultaneous-world coverage, remaining content workpacks, richer maps/plans, learning and glossary design, broader reader design and independent/human acceptance remain open. Author checks and internal subagent review do not establish independent historian approval, real adult/family usability, human screen-reader behavior, physical-device or physical-print quality, or PDF/UA conformance. The wider plan remains unfinished.

Everything remains local. No push, deployment, publication, external message, new chat or automation has occurred. Kevin's authorization to continue local implementation persists; those external actions remain separate.
