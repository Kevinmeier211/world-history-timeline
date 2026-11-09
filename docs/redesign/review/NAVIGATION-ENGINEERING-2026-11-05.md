# Navigation and engineering review

The November 5 work follows U02, U04, U05, L04, E01, E02 and the automated portions of A01, A02 and A04. The source and historical-media reviews remain documented in the November 4 checkpoints.

## Application responsibilities

- `use-atlas-navigation.ts` owns location parsing, URL writes, browser history, reading targets, pending-focus cancellation and restoration. Each history entry receives an identifier. Its focus and scroll snapshot remains distinct when several entries have the same URL. Explicit return actions can restore the latest visit to that route.
- `use-atlas-data.ts` owns the initial corpus and deferred bibliography requests. It cancels obsolete completions and scheduled work, bounds the initial image wait, and makes retries explicit. A reader's later navigation or interaction cancels recovery focus.
- `use-notebook.ts` continues to own notebook persistence and recovery. Question and edit drafts stay above the changing reading views.
- `AtlasShell.tsx` owns the shared header and footer. `App.tsx` composes those responsibilities and the historical reading actions.

## Navigation contract

| Transition                                    | Expected behavior                                                                         | Verification                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Dossier to comparison and back                | Restore the triggering control and reading position                                       | Normal browser entry points, including WebKit pointer activation   |
| Back and Forward                              | Restore each entry's year, route, focus and position                                      | Repeated-URL sequence with distinct scroll positions               |
| Return to a control within a disclosure       | Reopen containing disclosures before focusing the control                                 | Family activity detour                                             |
| Copied evidence link                          | Open the named dossier and evidence heading at its recorded year                          | New document navigation                                            |
| Legacy hash link                              | Resolve its recorded replacement and retain the explanation                               | Existing legacy mapping through the browser entry point            |
| Missing subject or investigation              | Explain the missing record and offer a usable recovery path                               | Missing-ID browser cases                                           |
| Missing image ID                              | Explain the unavailable saved image while presenting available case evidence              | Dossier browser case                                               |
| Failed dossier or comparison request          | Retain available summary, offer retry, retain heading focus and evict an invalid response | Recovery component/cache regressions and browser failure injection |
| Lazy investigation library                    | Wait for the reading surface before consuming focus                                       | Loader readiness and real navigation                               |
| Open question draft during history navigation | Preserve its text and original context                                                    | Browser draft-preservation case                                    |
| Changed library filters                       | Retain period, region, duration, theme and track in the URL                               | Reload, Back/Forward, continuation and reset                       |
| Time slider preview                           | Preview locally until commit; label the pending year                                      | Both timeline and world views                                      |
| Direct year entry                             | Respect bounds and BCE/CE without a year zero                                             | Existing controls and date-boundary cases                          |
| Deferred reading focus                        | Cancel obsolete work and respect an open dialog                                           | Controlled asynchronous tests                                      |

A subsequent focus movement takes priority over a prior pointer origin. Native WebKit pointer activation can focus a containing page region before the button click handler, so the navigation owner retains that control for the subsequent return.

## Content ownership and pending saves

The production compiler now reads complete canonical chapter and shared records, with a separate source registry and explicit owner/order manifest. C1 was migrated first, then all chapters. Both stages preserved the complete corpus and all 190 delivery JSON files byte for byte. The old transformations remain historical evidence. See [canonical content ownership](../CONTENT-OWNERSHIP.md).

A cancelled notebook save can finish after another question has opened. The completion now checks its save token before closing the dialog or announcing success. Submitted fields are disabled while saving. A controlled persistence regression and a real cross-tab Web Lock contention check verify that the later draft remains intact.

Browser-tab titles identify the current dossier, evidence, comparison, notebook, investigations or dated exploration view, including after browser history navigation.

## Verification and limits

The dated machine receipts identify browser versions, build hashes and observed results. The navigation script runs normal reading actions in managed Chromium, Firefox and WebKit. The accessibility matrix adds four viewport sizes, both appearances, reduced-motion settings, keyboard dialogs, failure recovery and text spacing. Actual Chromium browser zoom records the browser factor, CSS viewport, outer viewport and device-pixel ratio separately.

Physical iPhone, Android and tablet checks, experienced screen-reader speech and reading order, and a configured keyboard/zoom evaluator remain human tasks. The automated checks do not close those requirements. Final reader, independent historian and physical-print requirements remain separate in the completion tracker.

## Startup performance correction

A compressed phone trial reached 2,515 ms for the first illustrated view against the unchanged 2,500 ms target. Expressing the first image's existing priority with `fetchPriority="high"` alone left one 2,503 ms result. Both diagnostic runs are retained. The world-view module and map controls now load when that view is selected, reducing initial timeline/gallery JavaScript. Its loader signals readiness for focus, suppresses obsolete completions and offers timeline/reload recovery after a failed chunk request. The final performance receipt records all twelve trials; the budget is unchanged.

The local timing profile uses `scripts/redesign/precompress.py` and `scripts/redesign/serve.py`, matching the documented gzip preview. Run it without another heavy job. Raw uncompressed diagnostic measurements are retained separately and do not stand in for that profile. Hosted delivery and field Core Web Vitals require separate evidence.
