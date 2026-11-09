# Publication-contract regression migration

The nine test sources preserved verbatim in `docs/reference/legacy-tests/*.txt` required the superseded research scaffold or generated historical relations. For example, t606-prose required “Appendix B” and “not opened”; lineage required succession and cultural continuity derived from family/date adjacency. These are the original review defects, not release requirements.

They have been replaced by `src/atlas/release.test.ts` coverage of the complete released corpus: reject scaffold and unresolved claim references; reject generated relationships and fabricated endpoints; retain real Manila/Byzantine/Moche dates; require all eight packs and regional assessments; account for every legacy record; verify URL restoration, BCE parsing, old-link identity explanation, date projection, Pacific path splitting and notebook validation. Browser scenarios additionally exercise actual content and all authored journeys. Geometry, palette, schema and other useful inherited tests remain active. Coverage thresholds have not been lowered.

The run-config expectation now enables the locally authorized media downloads while still asserting push/deploy/access-related switches remain unchanged. No failed release assertion was removed to obtain a pass.

## Current candidate gate, 27 October 2026

`npm run check:candidate` now combines the retained repository gate with current-atlas coverage, a fresh production build, the unchanged 400 KB gzip bundle limit and isolated browser/print/media/performance checks. The accessibility entry point checks current atlas views rather than `svg.stage`. Two Vitest workers bound load-sensitive legacy timings without raising timeouts, dropping assertions or changing the inherited coverage thresholds.

`vitest.atlas.config.ts` includes actual `src/atlas` components in a separately reported coverage denominator. Its roughly 30% unit coverage is intentionally visible; the inherited layout engine's 85% gate is not presented as application-wide assurance. Browser scenarios independently cover navigation, concepts/body search, comparison, all fourteen journeys, storage, evidence focus, map selection/clustering, the new contexts and reader exports.

The richer reader revealed real regressions: the final journey exercise was hidden with the context column; substring search put changing ahead of Han; native anchor navigation could steal keyboard focus. Those were fixed in the app while retaining the existing assertions. The reader now omits hidden timeline content, preventing lazy hidden images from blocking screenshot readiness. Performance explicitly distinguishes UI acknowledgement, full content readiness and the newly scrolled chapter illustration path; the 200 ms and 2.5 s budgets remain in force. These checks verify local behavior, not historical completeness or human approval.
