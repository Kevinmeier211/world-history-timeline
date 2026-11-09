# Local exemplar implementation and Sol handoff

**Continuation:** the [28 October C8 and registry handoff](C8-HANDOFF-2026-10-28.md) is now current. This file preserves the earlier Batch A/B/C delivery record; its inventory and next-work statement describe that earlier checkpoint.

27 October 2026. Kevin authorized Batch A, richer Rome/Han, Angkor and Partition, the necessary timeline/map improvements, local validation and an updated handoff. No message has been sent to Sol. Nothing has been pushed, deployed or published.

## Outcome and next decision

The everyday navigation defects are repaired and the three contrasting experiences are implemented. Rome/Han uses two richer dossiers and a four-topic comparison; Angkor uses a landscape investigation; Partition uses a decision/aftermath sequence, archival documents and situated personal testimony. The examples have family entry, core reading, optional depth, evidence/source access and standalone print readers.

**Recommend reviewing these examples before broad expansion.** Sol can continue effectively from this concrete standard, starting with a finite topic registry and one bounded regional/period workpack. A later reviewer should independently assess the expanded material. Changing models alone will not prevent a repeat of the earlier gap between passing structural checks and an unfinished historical atlas.

This is a delivered local implementation, not Kevin's editorial/design acceptance or historian approval. The remaining plan still includes major historical, graphical and learning work.

## Start here

Repository: `/Users/kevinmeier/World Hist Timeline`; branch `codex/atlas-redesign`. Starting checkpoint: `90649d7358a83cfa36f20a73b5eb65d2e1eaf5ef`. Inspect `git status` and the latest local receipt before editing. Preexisting `output/` material and `docs/reference/local-only/` were preserved. The earlier portable ZIPs were not overwritten and do **not** contain this implementation.

Read:

1. This handoff and [current status](STATUS.md).
2. [Model, migration and editorial standard](EXEMPLAR-STANDARD-2026-10-27.md).
3. [Source consultation and rights](EXEMPLAR-SOURCES-2026-10-27.md).
4. [the updated roadmap](ROADMAP-2026-10-27.md), now carrying an execution ledger.
5. The original `REVIEW.md`, `REPRODUCTIONS.md` and `CONTENT_INVENTORY.md` in that review folder. Those are historical baseline evidence, not current bug counts.
6. `output/implementation-2026-10-27/README.md` and its verification receipts.

## What changed

| Area                 | Delivered behavior                                                                                                                                                                                                 | Important limit                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Navigation           | Opening a dossier preserves browse-region intent. World-context action opens a global view. Full history clears dossier/comparison/journey/map state. Back/Forward and copied evidence links restore reading focus | Context year remains distinct from the case's own dates                                    |
| Focus and journeys   | Native in-page anchors do not trigger delayed route focus. End-of-journey exercises remain below the full-width reader. Hidden timeline context is not rendered in dossier-only mode                               | Physical assistive-technology testing remains open                                         |
| Comparison           | Stable dimension keys with visible labels; 42 authored preferred pairs/questions; all 75 dossiers have a supported default. Rome/Han shares four substantive topics                                                | Arbitrary pairs can remain asymmetric; a comparison does not prove contact                 |
| Search               | Names, aliases, core/deeper/evidence text, concepts, separate journey/glossary matches, visible result counts and Show more. Han outranks words such as changing; names/summaries work while full-text index loads | Unresearched topics remain explicit gaps                                                   |
| Orientation          | 23 authored anchors across seven regions on a proportional BCE/CE overview; four separate reference contexts and phase lists; authored chapter examples                                                            | Not a complete reference chronology                                                        |
| World at a time      | Global context around 200, 1200 and 1950; exact case-date inclusion, separately labelled reference frames and nearest researched cases for uncovered regions; no year zero                                         | Nearby material is not contemporaneous coverage; modern reference history remains sparse   |
| Geography            | Selectable world map, zoom/pan/reset, overlapping-target groups and equivalent lists. Five-place Angkor and five-place Partition diagrams, with citations and schematic conventions                                | No invented imperial borders, canals or migration routes                                   |
| Reading and graphics | Comfortable single-column reader, smaller opening text, family and deeper layers, source scope visible at point of citation. NASA landscape plus Punjab map and telegram                                           | Twenty other dossiers still have no attached image                                         |
| Print                | Four new reader exports retain prose, phases, maps, evidence, reflection and bibliography. Existing overview/chapter/family exports refreshed                                                                      | The older overview is still a chapter-oriented poster; full print redesign remains Batch F |
| Verification         | One candidate command covers legacy/current unit checks, current coverage report, fresh build, bundle, isolated browser flows, print bounds, media and performance                                                 | Automated/source self-review is not a human learning or historical assessment              |

Current corpus: **75 dossiers, 207 sources, 64 media records, four reference contexts, 42 authored pairs, eight packs, fourteen journeys, 58 glossary terms and two historical networks**. The 1,274 legacy dispositions and original case dates/IDs are retained. Count increases do not demonstrate historical completeness.

## Run and inspect

```sh
npm run check:candidate
npm run dev -- --host 127.0.0.1 --port 4382 --strictPort
```

The candidate check builds fresh content and starts its own static server on an available loopback port. It does not depend on a previously open preview. For a compressed static preview after a build, run `npm run preview:portable`; its default address is `http://127.0.0.1:4174`.

Useful paths, appended to the chosen local origin:

- `/?pack=C4&subject=roman-world&scale=local&year=200`
- `/?pack=C4&subject=roman-world&compare=eastern-han&scale=local&year=200`
- `/?pack=C6&subject=angkor&scale=local&year=1200`
- `/?pack=C8&subject=partition-1947&scale=local&year=1947`
- `/?pack=C8&view=world&scale=era&year=1950`
- `/?print=reader&subject=angkor` (the same reader route supports each exemplar)

`npm run axe` now checks the current app on the built candidate; it no longer waits for the removed `svg.stage`. `npm run test:atlas` reports coverage of actual current-atlas source separately from the inherited layout-engine gate. `npm run test:browser` requires a fresh build and checks corpus identity before starting. The dated evidence directory is configurable within component scripts through `ATLAS_REPORT_DIR`; the one-command runner records this implementation's evidence folder.

The default Vitest run now uses two workers after repeated load-sensitive legacy timing failures during review. Assertions, timeouts and the inherited coverage/bundle/performance budgets were not raised. Current-atlas unit coverage is still roughly 30%; broad browser checks are separate evidence, not a claim of comprehensive unit coverage.

The performance receipt separates UI acknowledgement from full search-index/dossier readiness. The former retains the 200 ms target; meaningful loading retains a 2.5-second target. Because the new overview precedes chapter images, the illustration path now explicitly scrolls to the first chapter image before waiting for decode. Earlier 'illustrated view' timings should not be treated as an identical visual task. Long tasks and layout shift remain in the raw receipt.

## Verification and limitations

Final validation is recorded in `output/implementation-2026-10-27/README.md`, `check-candidate.log`, `browser/suite.json`, the per-suite JSON files, `coverage-atlas/coverage-summary.json`, and `print-review/pdf-verification.json`. Every reported pass must refer to this candidate, not an earlier ZIP. The older release documents remain historical receipts.

The review process caught and repaired overlapping phone map targets, visible/accessible label mismatches, a hidden final journey exercise, substring search ordering, a native-anchor focus race, and a hidden lazy-image wait in the old screenshot/performance assumptions. The original functional assertions were retained; screenshot/measurement readiness was aligned with the new layout rather than weakening accessibility checks.

Source consultation is described precisely: some Met/Columbia/Carter text was available through indexed text rather than a complete downloaded PDF. Partition Museum material uses published summaries, not invented interview transcripts. The current National Archives page and supplied transcripts were successfully retrieved, superseding that page's earlier 403 limitation. The two TNA image reproductions remain local private educational copies; public reproduction clearance is open.

Unperformed human checks: independent historian review, a real adult/family session, a human screen-reader pass, physical Safari/iOS/phone testing and physical print inspection. 'Five minutes' is an activity-design estimate, not an observed family completion time. Tagged PDF structure is checked; PDF/UA compliance is not claimed.

## Remaining work — do not mark the atlas complete

1. **Accept or revise the demonstrated standard.** Review the Rome/Han comparison, Angkor map/mechanism and Partition sources/sequence. Decide whether more historical explanation and less repeated source criticism are needed before reproducing the pattern. The deeper layers are intentionally bounded, not full-length reference chapters.
2. **Create the finite topic registry for Batch D.** Classify the 75 entries as cases/reference subjects/both; specify keep/deepen/split/connect, source gaps, dates, visual needs and acceptance evidence. The original plan's eight workpacks remain the scope guide.
3. **Extend the chronological framework.** Add researched contexts and meaningful moments across all periods/regions. Improve sparse modern snapshots. Keep the difference between current and nearby material; never stretch case dates to fill a map.
4. **Deepen coverage in bounded workpacks.** The other 71 dossiers have not been comprehensively rewritten. Prioritize essential missing reference histories and entries carrying a major region in a few sentences. Do not automatically restore the legacy corpus.
5. **Make geography more explanatory.** Add properly sourced regional maps, dated networks, site plans and useful sea/river/place labels. Four broad contexts and two new place diagrams are a demonstration, not the full atlas.
6. **Complete media and learning.** Twenty dossiers remain imageless. Audit small images for actual readability; add permitted transcripts and annotations where useful. Improve distractors, vary activities, provide glossary help at the point of need, and complete note editing/revision/undo with export migrations.
7. **Complete print and portable delivery.** Design the simultaneous world poster and true chapter readers; inspect grayscale and physical output. Build a new uniquely named portable package only from the final chosen checkpoint, verify every byte and a fresh offline extraction. Keep prior ZIPs intact; do not run the old package script blindly over them.
8. **Independent final review and release decision.** Follow Batch G. Historical/source review, usability, accessibility and actual human testing remain separate from automated structural checks. Publication and resolving image reproduction are later decisions.

## Suggested next instruction for Sol

> Continue in the current Chronos Atlas working tree. Read `docs/redesign/BATCH-ABC-HANDOFF-2026-10-27.md`, the exemplar standard/source notes, and the updated plan before editing. First inspect the implemented examples and current local receipt; preserve the new navigation, comparison, search, chronology and notebook contracts. Prepare a finite Batch D topic registry and propose one bounded first workpack with concrete historical questions, sources, visual needs and acceptance criteria. Do not begin bulk expansion until Kevin selects that workpack. Keep dates and source-access limits explicit. Do not claim the atlas complete from counts or schema checks. Stay local; no push, deployment, new chats/agents/automations, access change or public image reuse.

This is a copyable handoff, not a message already sent or authorization for Sol to start a new batch.
