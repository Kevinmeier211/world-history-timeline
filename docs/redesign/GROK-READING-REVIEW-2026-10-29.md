# Grok reading adoption — review

29 October 2026. Reviewed the current dirty tree against content checkpoint `26977813205def7f237d1d0961ffe341695ebb92` and the prepared output packets. This is a bounded code/content review, not independent historian or community approval. No implementation or source data was changed during review.

**Verdict: retain the useful additions, but do not mark the remaining reading work complete or treat this as a checked release yet.**

## Findings

1. **P2 — The war framework adoption leaves missing reading destinations and an incomplete WWII expansion.** `war-one-frame.ts:148` and `:175` refer readers to three regional inquiries that were not adopted. `ww2-regional-proposals.ts:1100` and `:1120` similarly ask readers to compare sources and identify speakers without supplying the proposed source passages or named-life accounts. WWII has a single 53-word deeper section and no `evidenceReading` or suitable older-reader entry; the registry still counts it as expanded because its predicate only requires deeper reading plus a context. The weakness is missing explanatory/source work, not the word count alone. Add bounded source capsules to the existing case IDs, or explicitly retain partial/split work in the plan. No generic young-child war activity or new dossier is required to resolve this.

2. **P2 — Wendat's new contents link has no destination.** `src/atlas/Dossier.tsx:210` always renders “Time and place” for deeper readings, while `:322` creates `#wider-context` only when context IDs exist. Wendat correctly has no invented reference span. Browser inspection confirms its link target is absent. Hide or replace that navigation item when a valid destination is unavailable; keep the historical date model unchanged.

3. **P2 — New reader layers are not covered by the integrated browser/print gate.** The adoption adds unit tests but no browser/reader-export checker for these seventeen newly deepened cases. Existing expansion checks open some of their older dossier views, but do not validate all new sections, source passages, bibliography text, reader pagination or all in-page destinations. Add a bounded checker for the newly adopted cases and include it in `run-browser-suite.mjs`. Merely rerunning the existing whole gate will not supply the missing standalone-reader coverage. The handoff correctly discloses that print/portable validation has not run; current `dist/atlas/corpus.json` also differs from the working/served corpus.

4. **P3 — Correct the preflight provenance statement.** `REMAINING-READING-HANDOFF-2026-10-29.md:43` and `content-niger-voyaging.ts:7` say Middle Niger and voyaging had no draft module. Both exist: `output/c6-evidence-preflight-2026-10-29/middle-niger/evidence-middle-niger.ts` and `voyaging/c6-voyaging.ts`. They contain archaeological source work not included in this replacement. Their existence does not invalidate Grok's narrower accounts, but the handoff should accurately describe the choice and leave an explicit reconciliation task.

## What survived and what passed

- All 77 stable IDs and full original case intervals are exact. Original claims/dimensions are unchanged. All 105 media records and existing media files are unchanged.
- All 33 journeys, 76 comparison pairs, 2 relationships, 8 packs and 82 glossary records are exact. The 60 pre-existing contexts remain exact. Source changes to old records are limited to scope/access fields; none of their other metadata changed.
- Most adopted modules match the earlier prepared drafts byte for byte. Other inspected deltas are small, including spacing, a family instruction and the particular 1 January 1885 qualifier.
- Typecheck, targeted ESLint and 24 targeted tests in four files pass. Local browser checks verified Wendat, WWII and Middle Niger plus the WWII print route; no runtime errors occurred. Browser evidence is in `/tmp/chronos-grok-review-2026-10-29/`.
- Selected Middle Niger claims align with the Met exhibition's [archaeology and Ancient Mali passages](https://www.metmuseum.org/exhibitions/sahel-art-empire-sahara/inside-the-exhibition). Selected settlement/navigation details align with [Te Ara settlement](https://teara.govt.nz/en/when-was-new-zealand-first-settled), its [genealogical discussion](https://teara.govt.nz/en/when-was-new-zealand-first-settled/page-2), and [canoe navigation](https://teara.govt.nz/en/canoe-navigation/print). These are spot checks of institutional accounts, not verification of all 65 new sources or underlying archaeology.

The full 883-test claim, complete candidate suite, every new reader/PDF, physical devices and human acceptance were not independently rerun here. Keep the earlier sealed receipts intact. Ask Grok for the bounded repairs above, followed by a fresh candidate receipt including the added reader coverage. No broad rewrite is warranted by this review.
