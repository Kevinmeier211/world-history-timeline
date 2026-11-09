# WebKit follow-up — November 6, 2026

The remaining WebKit error is now reproducible and diagnosed as consistent with a browser-engine cancellation classification problem. It is **not fixed or suppressed**. All 36 stressed application cases restored the complete reference reading; the original `contexts.json` diagnostic occurred twice. Standard navigation passes all 11 checks in each of Chromium, Firefox and WebKit.

This follow-up changes verification tooling, tracker statuses and handoff documents only. All **714 application files** and **1,211 application source/configuration files** match the prior isolated candidate. The prior 719-test gate and 12 passing gzip trials remain valid evidence for those unchanged application bytes; they were not rerun or relabeled as new results. No timing limit changed. [Application parity](../../../output/webkit-followup-2026-11-06/application-parity.json).

## Investigation and limits

The application probe used managed WebKit 27.2, a 390 × 844 viewport, three server-side context-response delays (0, 0.3 and 1 second), four navigation actions and three repetitions of each combination. It used no request interception or browser-security changes. All 36 cases restored the complete reference timeline without a retry control. Eleven native access-control page errors were retained: nine for `index.json` during document replacement and two for `contexts.json` during reload (`0.3-reload-3` and `1-reload-3`). These cases are functional recovery evidence, **not a zero-error stress pass**. [Raw application observations](../../../output/webkit-followup-2026-11-06/pending-navigation.json).

An independent nine-cell control contained only plain HTML, a same-origin JSON endpoint and a held replacement-document response. It captured the original document before navigation and invoked fetch after the replacement request reached the server. The bounded 300 ms observation window controls when the replacement is released; it is not an application timing budget. Both ordinary `location.href` navigation and automation-driven navigation were checked.

| Engine                | No navigation     | Held document replacement, both methods                                  | Native page errors     |
| --------------------- | ----------------- | ------------------------------------------------------------------------ | ---------------------- |
| Chromium 156.0.8078.4 | JSON returned 200 | Request pending before release; replacement completes                    | 0                      |
| Firefox 157.0         | JSON returned 200 | JSON returned 200; replacement completes                                 | 0                      |
| WebKit 27.2           | JSON returned 200 | Fetch rejects; no JSON request reaches the server; replacement completes | 1 per replacement cell |

The WebKit cells retain matching original-document identity and same origin. No framework, authentication, application data or CORS restriction was present. The first control attempt blocked while observing Chromium and timed out; its failed log is retained. The corrected control bounds observation, handles navigation rejections immediately and closes its server, contexts and browsers. All nine corrected cells completed without harness failure. [Control source](../../../output/webkit-followup-2026-11-06/engine-control.mjs), [observations](../../../output/webkit-followup-2026-11-06/engine-control.json).

This independently observed behavior matches an [upstream Playwright investigation](https://github.com/microsoft/playwright/issues/43120): a WebKit maintainer attributes the misleading access-control report to cancellation while a document is being replaced. That supports engine attribution, but does not establish an exact source mapping for this installed binary or a released fix. The error can occur before `pagehide`, so a pagehide-only cancellation change is not a demonstrated repair. No CORS relaxation, keepalive workaround, message filter or dependency upgrade was applied.

A second 36-case confirmation compared every displayed phase title and paragraph with the source JSON (five or six phases per reading). All 36 matched exactly. It retained 11 further native diagnostics (two contexts and nine index); these are preserved separately and do not replace the first run. Both batches used project Playwright 1.64.1. [Full-reference confirmation](../../../output/webkit-followup-2026-11-06/full-reference-confirmation.json).

## Verified tooling repair

Previously the navigation runner wrote its receipt only after every assertion passed. A failure could therefore lose the evidence needed to investigate it. `scripts/completion/navigation-browser.mjs` now saves a pass or fail receipt after owned-browser cleanup, including bounded error stacks, page URLs, checkpoints, same-origin JSON request/response/failure metadata and cleanup failures. It reads no response bodies or notebook contents. Existing assertions and the requirement of zero page errors remain intact.

- All **33 standard navigation checks** pass: 11 each in Chromium, Firefox and WebKit; zero page errors. There were 29, 30 and 29 navigation events respectively. [Receipts](../../../output/webkit-followup-2026-11-06/navigation/).
- A deliberately throwing local HTML fixture exits 1 and preserves its error, stack, URL, navigation and assertion failure. [Control verification](../../../output/webkit-followup-2026-11-06/failure-control/verification.json).
- The existing injected-navigation failure also exits 1 and produces a failure receipt. Its lifecycle marker records `launched` then `closed`. [Failure receipt](../../../output/webkit-followup-2026-11-06/injected-navigation/chromium.json), [cleanup marker](../../../output/webkit-followup-2026-11-06/cleanup-marker.txt).

## Tracker and handoff corrections

All 40 search slots now say `ready_for_review` with specific automated evidence: 26 positive subject/source-excerpt cases, seven valid dates, one invalid zero-CE case and six deliberate empty-result cases. This corrects stale initial statuses; it adds no claim of human acceptance. Date parser cases are distinguished from subject-ranking checks. The frozen November 6 gate includes the unchanged fixtures; November 4 browser evidence remains explicitly dated. Screen-reader announcements and experienced human use remain under A03.

README, current status, implementation and remaining-work handoffs now identify the verified November 6 gzip successor. The November 5 candidate, failed measurements and immutable archives remain preserved. The existing November 6 review ZIP freezes earlier documentation; the separate follow-up addendum contains these corrections and diagnostic evidence without replacing application files or representing a new deployment.

## Remaining endpoints

- **WebKit engine diagnostic:** open. Recheck the same controls and strict application navigation suite when a supported engine correction is available. Repeated functional failure or errors outside document replacement require renewed application investigation. A clean standard run does not erase the stress reproductions.
- **Human testing:** independent historical/community review, final adult and adult–child sessions (ages 10–14), physical devices, experienced assistive technology, physical print and spoken PDF order remain open. H01/H02 remain removed by owner.
- **Deployment/provider:** approval, fresh access-policy and compression/performance verification, provider restoration and rollback decisions remain separate. The November 1 deployment remains unsuitable for automatic rollback.

[Machine-readable report](WEBKIT-FOLLOWUP-2026-11-06.json) · [Verification receipt](../../../output/webkit-followup-2026-11-06/verification.json) · [Tracker](../COMPLETION-TRACKER-2026-11-04.json).

The [follow-up addendum](../../../output/webkit-followup-2026-11-06-addendum.zip) and its [extraction receipt](../../../output/webkit-followup-2026-11-06-addendum-receipt.json) preserve the updated documentation and diagnostic evidence alongside the unchanged application archive.
