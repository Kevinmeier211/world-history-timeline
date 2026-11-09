# Acceptance evidence

Initial local release, 2026-10-26; current expansion evidence is appended below. Stages 0–6 and C1–C8 have deliverables. Source consultation, rendered inspection and historical review were performed by Codex as self-review. There was no independent historian or family review. The original R01–R18 resolution is in RELEASE.md; this receipt records what was actually checked.

## Repository and publication gates

`npm run check` passed: TypeScript, ESLint/Prettier, design-token and palette checks, 107 test files / 373 tests, inherited data-schema checks and the complete atlas publication contract. Layout coverage remains 95.3% statements, 86.26% branches, 99.74% functions and 98.44% lines; existing thresholds were not raised. The original scaffold/automatic-lineage test migration is explained in TEST_MIGRATION.md, with originals preserved.

`npm run build` passed. The final JavaScript bundle is 90.12 KB gzip across two files, below the unchanged 400 KB budget. The teaching runtime loads the compact atlas index and individual dossier files rather than the inherited research corpus. The release contract validates all eight packs, 56 substantive dossiers, 38 media records, 119 source records, two supported networks, ten journeys and all 56 regional assessments. All 1,274 inherited records have disposition entries. Claims, dates, identities, citation references, media chronology, scaffold leakage and unsupported generated relations are checked across the corpus.

Every one of the 84 local media derivatives was decoded and its dimensions checked. Rights and source identities were consulted and recorded; source disagreements and restricted research access are described in the corpus rather than silently filled in. HTTP availability alone was not used as factual verification.

Evidence: output/redesign/full-check.log, full-build.log, bundle-size.log, final/media-decoding.json and manifests/.

## Twelve user scenarios

Browser evidence is in output/redesign/final/browser-results.json, with screenshots and a saved semantic reading sequence. The actual released content was used.

| Scenario                | Observed result                                                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Opening               | Eight actionable chronological chapters, scope and visible entry points; desktop and phone inspected.                                                                                                                                                                                                              |
| 2 Search                | Known names and aliases open the visible dossier across chapter/region changes; modal closes once and focus does not reopen it.                                                                                                                                                                                    |
| 3 Date                  | BCE/CE context, no year zero, consistent controls and explicit out-of-program handling.                                                                                                                                                                                                                            |
| 4 Contemporaries        | The world at 200 CE includes at least three researched regions; coverage gaps are distinguished from historical absence.                                                                                                                                                                                           |
| 5 Object                | Real pixels decoded, enlargement works, original institutional link is present, represented and object dates distinguished.                                                                                                                                                                                        |
| 6 Relationship          | Typed, dated, cited connection opens a visible destination. Mere coexistence creates no edge.                                                                                                                                                                                                                      |
| 7 Journey               | All ten journeys and all their stops/years executed; evidence detour returns to the same stop and exit restores exploration.                                                                                                                                                                                       |
| 8 Comparison            | Aligned sourced questions with explicit asymmetric/missing dimensions; no invented ranking or contact.                                                                                                                                                                                                             |
| 9 Reasoning             | Both supported and overreaching answers exercised in all ten journeys, with explanatory feedback.                                                                                                                                                                                                                  |
| 10 Resume/share         | Reload, copied URL in a fresh context, Back/Forward, real notebook JSON download/import and saved return passed.                                                                                                                                                                                                   |
| 11 Accessible operation | Keyboard search, selection, dialogs and focus restoration checked; structured reading sequence inspected through Chromium accessibility semantics. Reduced motion and coarse touch checked. This substitutes for the unavailable human screen-reader session and does not establish human screen-reader usability. |
| 12 Reading comfort      | Four screen types at 1440×900, 768×1024, 390×844, 320×700, 1024×768 and 720×900; zero axe findings at every impact level across 24 combinations and dark/reduced-motion mode. Real screenshots inspected. The 720 CSS-pixel viewport is a 200%-zoom-equivalent reflow check, not a manual browser-zoom session.    |

No indispensable action depends on hover. Separate readable directories supplement small spatial marks. No physical phone/tablet or Safari session, human screen-reader test, or WCAG certification is claimed.

## Measured performance

Three cold-cache trials used packaged static gzip delivery over loopback. Desktop: Chromium, 1440×900, unthrottled. Phone: Chromium, 390×844, 4× CPU slowdown, 1.6 Mbps down / 750 Kbps up / 150 ms latency. Useful text means actual interactive content; illustrated useful view also waits for the first authentic image and local fonts.

| Metric                  | Desktop trials  | Phone trials   |
| ----------------------- | --------------- | -------------- |
| Useful text             | 65–69 ms        | 1,694–1,700 ms |
| Illustrated useful view | 75–81 ms        | 2,346–2,365 ms |
| Search response         | 35–37 ms        | 76–93 ms       |
| Selection response      | 39–43 ms        | 81–84 ms       |
| CLS                     | 0.00015–0.00055 | 0.00108        |
| Tasks exceeding 50 ms   | None observed   | None observed  |

All measured trials meet the 2.5-second useful-view and 200-ms interaction targets. These are reproducible local-profile observations, not predictions for a future hosting service. Those initial trials are preserved with the initial release ZIP; final/performance.json now holds the current expansion trials. The portable launcher supplies gzip and stable local assets.

## Print and delivery

Dedicated compositions provide one A3 landscape world overview, 43 Letter chapter pages covering all ten investigations, and eight Letter family exploration sheets. Page bounds, page counts, text presence, tagging and checksums were checked. Every page was rendered; contact sheets and representative full-size pages were visually inspected, including the final Qin and modern investigations. No physical print inspection is claimed. PDF evidence is in output/redesign/print/.

The portable package includes the static site, loopback-only Python launcher, all three PDFs, screenshots, source/media/coverage/legacy manifests, source-state receipt, font licenses and file checksums. The archive is verified by reading every archived file and comparing its bytes with the prepared package. Package launch is tested separately against the prepared site and recorded in release/package-smoke.json. Nothing was pushed or deployed.

## Remaining observation limits

The atlas is a selective global program, not an exhaustive catalogue; individual regional limits are explicit. Maps are broad orientation locators, not historical borders. Source checking is agent review, not historian approval. Human screen-reader usability, real-device Safari, family response and physical print remain unobserved. These limits are retained in the release report and package; none is recorded as a passed human test.

## Follow-up validation, 27 October 2026

The reading/notebook changes in FOLLOWUP-2026-10-27.md pass the full repository gate again (107 files / 373 tests), the original atlas browser suite, and the added four-width reading/normal-storage/blocked-storage regressions. All discovered automated accessibility violations are repaired. The original archive is retained separately.

The final JavaScript bundle is 90.54 KB gzip. Under the same three-trial cold-cache profiles, desktop useful text is 79–134 ms and illustrated view 91–146 ms; phone useful text is 1,726–1,749 ms and illustrated view 2,387–2,449 ms. Desktop search is 33–83 ms and selection 46–94 ms; phone search is 91–117 ms and selection 80–110 ms. CLS is 0.00111 desktop / 0.00108 phone. The latest phone trials observed tasks of 53–88 ms, retained in the receipt; desktop trials observed none. The useful-view and interaction budgets still pass. The earlier absence of long tasks is not claimed for this updated measurement.

The historical corpus and all three PDFs retain their earlier checksums. Updated reading results and the phone evidence screenshot are included in the portable package. Observation limits for human review, physical devices and physical print still apply.

## Expansion validation, 27 October 2026

Current evidence supersedes the preceding dated totals and measurements. `output/redesign/expansion/full-check.log` records 108 passing files / 378 tests and all type, lint, design, palette, inherited-data and complete-publication checks. The current build contains 64 dossiers, 48 media records, 154 sources and twelve authored journeys; all 56 assessments and 1,274 legacy dispositions remain checked. Five new regressions guard the catalogue-date, modern-documentation, companion-reference and independent-chronology failures. All 107 local media derivatives decode.

The original twelve browser scenarios and every stop/feedback state of all twelve journeys pass. New expansion checks add eight dossiers and two comparisons at three widths: zero axe violations across 30 expansion views, decoded media, 150% inspection, visible/focused sources and original record links. Both new journeys save/export return questions. Existing four-width reading and normal/blocked-storage regressions pass. Screenshots in expansion/screens were visually inspected; the source/content/media/print review is Codex self-review.

The initial expansion measurement exceeded the illustrated-view target (phone 2,531–2,544 ms). Preloading the atlas index removes one avoidable round trip; thresholds are unchanged. Final JavaScript is 90.97 KB gzip, under the original 400 KB budget. Same three-trial cold profiles:

| Metric                  | Desktop         | Phone (4× CPU, 1.6 Mbps/750 Kbps, 150 ms) |
| ----------------------- | --------------- | ----------------------------------------- |
| Useful text             | 81–153 ms       | 1,414–1,465 ms                            |
| Illustrated useful view | 96–166 ms       | 2,284–2,336 ms                            |
| Search                  | 34–88 ms        | 98–109 ms                                 |
| Selection               | 50–53 ms        | 75–87 ms                                  |
| CLS                     | 0.00070–0.00111 | 0.00124                                   |
| Tasks over 50 ms        | None observed   | 58, 63 and 103 ms                         |

Every final trial meets useful-view/interaction targets. Tasks are reported rather than omitted; these observations do not establish an absence of main-thread work or a future hosted result. Full current trials are final/performance.json and expansion/performance.log.

Print now provides one A3 overview, 52 Letter chapter pages and 12 Letter family sheets, with a route and family sheet for every authored journey. All 65 pages were rendered, all contact sheets inspected, plus full new orientation/reference/family pages and the A3 overview. No bounds overflow, blank page or count/size/tagging failure remains. Output, public and build PDF bytes match exactly; SHA-256/page receipts are in print/pdf-verification.json. No physical print test is claimed.

The refreshed portable package carries dynamic corpus/PDF counts, expansion rights/byte receipts, all reports/screenshots and prior/current validation evidence. Its fresh extracted copy is checked with external requests blocked: overview, Qin and both new regional dossiers, image decoding, reload, the full corpus hash and all three served-PDF hashes. The outer extraction receipt identifies the archive bytes and exact source commit. Prior ZIPs remain preserved. Human review/device/print limits above still apply; nothing was pushed or deployed.

## Northern expansion validation, 27 October 2026

This receipt supersedes earlier dated totals and performance measurements. The final `northern-expansion/full-check.log` records 109 passing files / 385 tests, with TypeScript, ESLint/Prettier, design/palette, inherited-data and complete publication checks. The local corpus contains 70 dossiers, 55 media records, 179 sources and thirteen authored investigations; all 56 regional assessments and 1,274 legacy dispositions remain complete. All 123 image derivatives decode. Seven new regression tests protect independent chronologies, disputed Ozette dates, media labels, source URLs, chapter membership and print pagination.

The original twelve user scenarios and every stop/feedback state of all thirteen journeys pass. Northern browser checks add 24 zero-axe views: six dossiers and two comparisons at desktop 1440×900, tablet 768×1024 and phone 390×844. Each dossier was opened through its actual chapter directory, with decoded images, 150% object inspection, institutional record links and visible/focused sources. The six-stop journey exercised all evidence responses, saved a question and exported real notebook JSON. Four-width reading and normal/blocked-storage regressions also pass. Final responsive screenshots were visually inspected. This is Codex self-review, not an independent historical or family assessment.

Self-review repaired an incorrect landscape candidate, ambiguous date scopes, missing passage-specific citations, prose spacing and print overflow. It also found malformed chapter IDs that the old compiler silently dropped. Compilation now preserves authored memberships so validation rejects invalid/orphaned entries; whitespace-damaged source URLs and invalid print breaks also fail. No fact dates, reading sizes, test assertions or thresholds were changed to hide failures. An earlier inherited shell test hit its unchanged timeout under competing PDF/browser work; its isolated unchanged eleven-test suite and the subsequent full gate passed. Both failure and repair evidence are retained.

Final JavaScript is 91.00 KB gzip, below the unchanged 400 KB budget. Three cold-cache trials used the same documented static gzip server and profiles: unthrottled desktop; phone 390×844, 4× CPU, 1.6 Mbps down / 750 Kbps up and 150 ms latency.

| Metric                  | Desktop         | Phone                 |
| ----------------------- | --------------- | --------------------- |
| Useful text             | 75–169 ms       | 1,493–1,575 ms        |
| Illustrated useful view | 90–183 ms       | 2,382–2,426 ms        |
| Search                  | 31–103 ms       | 109–123 ms            |
| Selection               | 53–54 ms        | 92–104 ms             |
| CLS                     | 0.00070–0.00111 | 0.00124               |
| Observed long tasks     | None            | 50, 65, 69 and 132 ms |

Every final trial meets the original 2.5-second useful-view and 200-ms interaction targets. Long tasks remain visible in the receipt. These local measurements do not predict future hosted performance. Raw trials are `final/performance.json` and `northern-expansion/performance.log`.

Print contains one A3 overview, 58 Letter chapter pages and thirteen Letter family sheets. All 72 final pages were rendered and their contact sheets inspected; full new orientation, route, comparison, evidence/reference and family pages were also inspected. Page bounds, count, sizes, tagging and text checks pass. Output/public/build PDF bytes match exactly; their hashes are recorded in `print/pdf-verification.json`. There was no physical print test.

The refreshed package includes the northern report, precise source/media manifests, rights and byte receipts, responsive screens, notebook export, all three PDFs and validation evidence. Fresh extraction checks every manifest SHA-256, then exercises local media, reload, the complete corpus and served-PDF hashes with external browser requests blocked. The final outer receipt records the archive bytes and exact local source commit. Previous ZIPs remain preserved. Coverage remains selective, with further northern nations and chronological windows explicitly named in the report. Human-review/device/print limits above still apply. Nothing was pushed or deployed.

## Eastern Woodlands validation, 27 October 2026

This receipt supersedes earlier dated totals and measurements. `woodlands-expansion/full-check.log` records 110 passing files / 393 tests, plus TypeScript, ESLint/Prettier, design/palette, inherited-data and complete publication gates. The release has 75 dossiers, 61 media records, 197 sources and fourteen investigations; all 56 assessments and 1,274 legacy dispositions remain complete. All 135 local media derivatives decode. Eight new tests guard uncertain construction/model dates, signing/ratification and newspaper-issue distinctions, media identity/resolution, political exclusions, broad legacy labels and valid bibliography pagination.

The original twelve user scenarios and all fourteen journeys pass with real content. Added checks open all five new dossiers through actual chapter directories, reload them, decode/inspect images, open institutional links and verify visible/focused sources. Dossiers and source screens each receive axe checks; with two comparisons this is 36 zero-violation views at 1440×900, 768×1024 and 390×844. The full six-stop inquiry, all three feedback options, a saved question and real notebook export pass. Four-width reading and normal/blocked-storage regressions pass. Final desktop comparison, tablet Wendat and phone Ojibwe screens were visually inspected; additional Ocmulgee/Cherokee screens are retained.

Source and rendered self-review repaired a misleading gallery candidate, kept the actual NPS floor image at 526×339, distinguished the preliminary dating graph from the preferred model, and preserved archival and constitutional qualifications. Initial print bounds failed. Repeated orientation/credit prose was tightened and all selected references were retained across three new bibliography pages. Invalid source-page group sizes now fail publication checks. The overview uses matching media and named authored comparison examples. No font size, test assertion or threshold was reduced.

Final JavaScript is 91.39 KB gzip, under the unchanged 400 KB budget. Same three cold-cache profiles: desktop 1440×900 unthrottled; phone 390×844, 4× CPU, 1.6 Mbps down / 750 Kbps up, 150 ms latency, packaged static gzip delivery.

| Metric                  | Desktop         | Phone            |
| ----------------------- | --------------- | ---------------- |
| Useful text             | 65–154 ms       | 1,447–1,487 ms   |
| Illustrated useful view | 77–165 ms       | 2,332–2,365 ms   |
| Search                  | 36–84 ms        | 78–92 ms         |
| Selection               | 49–52 ms        | 77–89 ms         |
| CLS                     | 0.00015–0.00111 | 0.00124          |
| Observed long tasks     | None            | 52, 52 and 87 ms |

All final trials meet the 2.5-second useful-view and 200-ms interaction targets. Long tasks remain reported; these local observations do not predict hosted performance. Raw trials are `final/performance.json` and `woodlands-expansion/performance.log`.

Print has one A3 landscape overview, 66 Letter chapter pages and fourteen Letter family sheets. All 81 pages were rendered; every contact sheet, all eight new chapter pages, the new family sheet and final overview were visually inspected. Bounds/count/size/tagging/text checks pass, and output/public/build PDF bytes match exactly. The source pagination retains all eight selected references with their locators; no physical print test is claimed.

The local package carries current reports, sources/coverage/legacy/media manifests, CC BY attribution and other precise rights, responsive screens, notebook export, all three PDFs and validation receipts. The archive is byte-checked; fresh extraction verifies every file checksum, then runs the offline browser smoke for prior and new dossiers, images, reload, corpus and served-PDF hashes. Final archive bytes and exact local commit are identified in the outer extraction receipt. Prior ZIPs remain preserved. Source consultation and screen/PDF review are Codex self-review; human historian/family/screen-reader/device/physical-print limits above still apply. Nothing was pushed or deployed.

## Batch A and richer examples, 27 October 2026

This is the current local implementation receipt and supersedes the older inventory and performance totals above. It covers Kevin's authorized Batch A, Rome/Han, Angkor and Partition examples, necessary timeline/map improvements, validation and handoff. It does not mark Batches C–G complete or grant editorial, historian or publication approval. The versioned [roadmap](ROADMAP-2026-10-27.md), [handoff](BATCH-ABC-HANDOFF-2026-10-27.md), [editorial standard](EXEMPLAR-STANDARD-2026-10-27.md) and [source/rights notes](EXEMPLAR-SOURCES-2026-10-27.md) define delivered scope and remaining work.

`output/implementation-2026-10-27/check-candidate.log` records a passing integrated gate: fresh build, TypeScript, ESLint/Prettier, design/palette, inherited/current data checks, 111 files / **400 tests**, separate current-atlas coverage, bundle and all browser suites. The **41 current-atlas tests are included in the 400**, then rerun separately for coverage. Current-atlas coverage is 29.53% statements, 29.85% lines, 34.66% branches and 15.09% functions. The inherited engine gate is not a measure of the current UI; its original thresholds remain unchanged. A two-worker Vitest limit reduces load-sensitive failures without altering assertions or timeouts.

A final print-only canvas-background correction was followed by another fresh build and the complete browser suite (`final-print-build.log`, `final-browser.log`, `browser/suite.json`). A hardcoded legacy report label saying ten journeys was changed to the actual corpus count; the same journey/browser assertions passed again (`final-journey-report.log`). Formatting/lint/diff hygiene was rechecked after final documentation and report edits. Source identity and evidence hashes are in the implementation folder's `SOURCE_STATE.json`.

The focused candidate checks pass at 320, 390, 768 and 1440 CSS pixels with 29 zero-violation axe scans. They cover navigation reset and filter preservation, global/date/nearby context, BCE/CE, map zoom/grouping/selection, body/concept search and pagination, all four expanded dossiers, source scope, deeper reading, two place diagrams, four-topic Rome/Han comparison and Back/focus. External requests are blocked and none attempted. The original twelve release scenarios, all fourteen journeys, six-width keyboard/dark/reduced-motion/touch checks, four-width reading and normal/blocked-storage notebook checks pass. The earlier expansion/northern/woodlands browser suites also pass. These are local Chromium checks; physical devices, Safari and human screen-reader testing remain unperformed.

The corpus has **75 dossiers, 207 sources, 64 media, four reference contexts, 42 authored pairs, eight packs, fourteen journeys, 58 glossary terms and two supported networks**. All 75 IDs and original case-date bounds are preserved; 1,274 legacy dispositions remain unchanged. Twenty dossiers remain imageless and the other 71 were not comprehensively deepened. All 141 local image derivatives decode. Final JavaScript is **98,503 bytes gzip**, under the unchanged 400 KB budget.

Three cold-cache trials per profile used the isolated static gzip preview: desktop 1440×900; phone 390×844, 4× CPU, 1.6 Mbps down / 750 Kbps up and 150 ms latency.

| Metric                                     | Desktop         | Phone          |
| ------------------------------------------ | --------------- | -------------- |
| Useful text                                | 91–92 ms        | 1,589–1,593 ms |
| First chapter illustration after scrolling | 126–129 ms      | 2,084–2,086 ms |
| Search UI acknowledgement                  | 35–37 ms        | 100–115 ms     |
| Full search index ready                    | 122–125 ms      | 906–929 ms     |
| Selection acknowledgement                  | 20–49 ms        | 60–75 ms       |
| Meaningful dossier body ready              | 46–63 ms        | 341–357 ms     |
| CLS                                        | 0.00015–0.00033 | 0.00869        |
| Observed long tasks                        | None            | 50–102 ms      |

The retained 200 ms interaction and 2.5-second useful-view/readiness targets pass. Immediate acknowledgement and loaded content are measured separately. The new overview puts chapter images farther down the page, so the illustration timing explicitly includes scrolling before decode; it is not an identical task to the older receipts. Search uses sequential key events, and a regression asserts that index/result changes do not move the search input. The earlier programmatic-fill/layout-shift diagnostic is retained. These local observations do not establish hosted or physical-device performance.

Seven final PDFs contain **119 pages**: Rome 8, Han 8, Angkor 9, Partition 11, overview 1, chapters 68 and family 14. All pages were rendered and visually inspected through contact sheets, with selected maps, documents, source pages and all final reader end pages viewed at full rendered size. The final print background correction changed only four rendered end pages; the other 115 were pixel-identical to the inspected versions. Text/heading/bounds/page-size/tagged-structure checks pass and the three existing exports have identical output/public/build bytes. See `print-review/pdf-verification.json`, `final-render-comparison.json` and `VISUAL-REVIEW.md`. Physical print and PDF/UA compliance are not claimed. The full world-poster/chapter-reader redesign remains Batch F.

Source consultation and rendered review were performed by Codex, with precise access limits recorded. National Archives teaching text/transcripts were retrieved successfully, superseding the earlier 403 limitation. Some other sources were consulted through indexed text rather than complete downloaded PDFs; Partition Museum evidence uses public summaries, not claimed full interviews. Two archive image reproductions remain local educational copies with public reproduction clearance open. Human historian, adult/family and assistive-technology acceptance remains open. No new portable package was created; older ZIPs were preserved. Nothing was pushed, deployed or published, and no message was sent to Sol.
