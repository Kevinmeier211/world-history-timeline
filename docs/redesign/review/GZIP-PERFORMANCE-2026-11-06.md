# Gzip performance repair — November 6, 2026

**Subsequent browser investigation:** the earlier non-reproduced observation below is superseded by the [WebKit follow-up](WEBKIT-FOLLOWUP-2026-11-06.md). The same application build now has controlled reproduction and engine-attribution evidence; the diagnostic remains open. This does not alter the recorded gzip measurements.

The final local gzip candidate passes all 12 established cold-cache trials. **No timing limit, network/CPU profile, trial count or readiness endpoint was relaxed. A direct comparison against the November 5 benchmark confirms the six original limits and twelve trial/profile/readiness settings.** A04's local gzip issue is closed; hosted verification and human acceptance remain separate open scopes.

## Measurements

Each value below is the worst observed time in milliseconds across a complete 12-trial run. The baseline is the preserved November 5 candidate; the final column identifies the current verified build. Intermediate passes and failures remain in the second table and raw receipts. Those failures drove the additional loading, search and rendering repairs described below.

| Endpoint                 | Limit | Baseline | Final gzip |
| ------------------------ | ----: | -------: | ---------: |
| Useful text              |  2500 |     2299 |       2085 |
| Illustrated view + fonts |  2500 |     2565 |       2395 |
| Open search              |   200 |      198 |        146 |
| Identify selected case   |   200 |       88 |         81 |
| Full search ready        |  2500 |     1552 |       1558 |
| Full dossier ready       |  2500 |      378 |        865 |

The retained sequence includes every completed benchmark, including the failed confirmations:

| Run                          | Illustrated maximum | Search opening maximum | Selection maximum | Result |
| ---------------------------- | ------------------: | ---------------------: | ----------------: | ------ |
| baseline                     |                2565 |                    198 |                88 | failed |
| candidate                    |                2424 |                    122 |                73 | pass   |
| confirmation                 |                2428 |                    215 |                72 | failed |
| search-isolated              |                2451 |                    125 |                74 | pass   |
| selection-diagnostic         |                2430 |                    125 |               322 | failed |
| prepared-search-diagnostic   |                2544 |                    169 |                73 | failed |
| notebook-diagnostic          |                2396 |                    230 |                66 | failed |
| dialog-layout-diagnostic     |                2397 |                    214 |                59 | failed |
| metadata-priority-diagnostic |                2495 |                    219 |               125 | failed |
| final-gzip                   |                2395 |                    146 |                81 | pass   |

Each run covers the gallery and default timeline, desktop and throttled phone, with three cold-cache trials per combination. Phone: 390 × 844, 4× CPU slowdown, 200000 bytes/s download, 93750 bytes/s upload and 150 ms latency. Useful illustrated content still requires the historical image to decode and document fonts to be ready. Full search and full dossier readiness remain independent measurements from opening the search box or identifying the selected case. Every successful captured HTML/CSS/JS/JSON response declares gzip. Raw per-trial timings, layout shifts, long tasks, transferred bytes and response headers remain in the [performance receipt](../../../output/gzip-performance-2026-11-06/performance/receipt.json) and its ten linked run files. Trials were not discarded or averaged to obtain a pass.

## Changes and tradeoffs

Search retains its dark modal backdrop without blurring the entire underlying atlas, reducing rendering work when the dialog opens.

1. Dossier controls are imported only when a case is selected. Pending/error views retain the case title and full-reader readiness remains a separate assertion.
2. Chapter investigation startup records retain navigation IDs; print-only instructions remain unchanged in the full corpus.
3. Search dialog open state is local to SearchLayer, avoiding a gallery/timeline rerender on opening. Dismissal and navigation retain their different focus behavior. Native modal opening and initial focus occur before paint; index loading remains asynchronous. Search data is prepared once for repeated queries. The existing 40-query suite exercises the prepared path, and an additional exact-result comparison covers all names, aliases and prefixes in both summary-only and full-text modes.
4. Vite omits redundant target-module preloads only for Dossier, WorldContext and Notebook. Native imports recover after failed requests; shared dependencies and print CSS/target preloads remain intact.

Initial bibliography metadata updates now yield to interaction; explicit recovery remains urgent. Passive click/dialog and long-task timestamps supplement the original measurements without moving their start/end points or thresholds.

Notebook controls also load on navigation, with explicit loading/error/reload and saved/session draft preservation. Bootstrap phase years remain exact in every region; qualified phase labels arrive with the already-deferred reference reading rather than being downloaded twice.

The first reader opening now fetches a separate module: it is slower than the eager baseline but remains below the unchanged 2,500 ms full-reader limit. The immediate selected-case heading is measured separately against 200 ms; it is not counted as completed reading.

Main-script gzip bytes fall from **120,166 to 112,182**. Startup JSON falls from **132,265 to 121,237**. Total JavaScript is **157,217 gzip bytes**, below the unchanged 400,000-byte ceiling; splitting improves startup delivery rather than promising a smaller total application. The main/bootstrap sizes are actual level-9 gzip sidecars used by the established local server. The total-JavaScript ceiling still uses the unchanged default-gzip bundle checker. Compiler checks verify exact chapter invitation IDs/order, regional step years and preservation of canonical print prose.

## Verification and identity

- Fresh locked dependency installation and complete atlas gate: **719 tests in 74 files**, types, lint/format, content/citation contracts and bundle ceiling passed.
- Working build and isolated build match across **714 files**. The **648 atlas files other than startup index**, including all **138 PDFs / 2,066 pages**, remain byte-identical to the November 5 candidate. Exact index comparison permits only the intended investigation projection and omitted deferred phase labels. Historical content, sources, images, fonts and PDFs remain exact. The sole stylesheet change removes blur from the search backdrop; its dark dimming and native modality remain.
- Chromium, Firefox and WebKit each pass 11 navigation checks, 6 delayed-loading/recovery checks and the 390 px accessibility smoke. Search Escape/trigger focus, selection-to-heading focus, dossier failures, reload and saved notebook preservation are exercised. WebKit additionally passes the original inspector-aborted-request recovery scenario. These are automated checks, not human assistive-technology acceptance.
- One WebKit navigation run recorded an access-control page error for contexts.json. Its log is retained. A diagnostic follow-up completed all 11 checks across 29 navigations with zero failed requests or page errors, without suppressing errors or changing application code; subsequent WebKit accessibility and aborted-request recovery checks passed. This remains a non-reproduced observation for future browser/device checks.
- The updated search backdrop is checked at 390px and 1440px: no blur, dimming retained, input focused on open and trigger focus restored on Escape.
- Release-staging fixture suite: 14 tests pass. The offline dependency attempt and documentation-format and outdated test-mock diagnostics remain preserved; the final isolated gate uses a fresh online locked install. A managed-browser launch permission error produced no timing observations; the subsequent authorized launch supplied the recorded trial data.
- Main script: `index-D7b7zApS.js`; SHA-256 `c2f075364b162e153ce9366d67e4f9e786ab4ca76a4119acc4588c27f11367b0`.
- Full corpus SHA-256: `cacd0e7d9be7ef13909afe5f9bd511a0ce73b5cc9379648b6d59380fc81d167c`.

See [verification.json](../../../output/gzip-performance-2026-11-06/verification.json), [exact artifact parity](../../../output/gzip-performance-2026-11-06/artifact-parity.json), and [machine-readable review](GZIP-PERFORMANCE-2026-11-06.json). Older failed measurements and the November 5 Brotli result remain dated evidence. The final run has finite headroom and is a local laboratory result, not a guarantee for all devices or networks.

## Remaining endpoints

- Local throttled lab evidence only; hosted compression, access policy and performance remain unverified pending deployment approval.
- Human historical/community review, final adult/family sessions, experienced assistive-technology/device/keyboard evaluation, physical print and spoken PDF reading order remain open.
- H01/H02 formative-pilot requirements remain removed by owner, not passed.
- Rights qualifications and source conflicts remain as documented; no new historical or media acceptance is inferred.

The source/application checks bind 928 code/config files to the isolated snapshot; subsequent changes are review documentation, receipts and the separately verified navigation diagnostic runner. No deployment, provider change, commit or push was performed. The tracker retains A04 as in progress solely for hosted verification, and keeps the separate human and deployment tasks open. Any material application change invalidates the relevant build/browser/performance proof.

## Review delivery

The refreshed [offline archive](../../../output/completion-2026-11-04/portable/chronos-review-d00b8f842cc2.zip) passed fresh extraction and all 717 checksums. The [release-review bundle](../../../output/release-review-2026-11-06.zip) passed 781 staged/archive checks, including 715 possible hosting inputs (714 verified application files plus the existing static configuration). Review materials remain outside `site/`. See the [staging receipt](../../../output/release-review-2026-11-06-receipt.json). Archives freeze inputs before construction; the current tracker and completion receipt record the successful staging afterward. All task-owned browsers and loopback servers are closed. This preparation is not deployment or human acceptance.
