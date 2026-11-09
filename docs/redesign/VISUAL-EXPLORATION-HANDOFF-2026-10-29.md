# Visual exploration — local review handoff

29 October 2026. Content expansion is on hold at Kevin’s request. This pass completes a concrete visual exploration flow for review; it is not completion of the wider roadmap. Source changes are local and uncommitted. No push, deployment, publication, external message or automation occurred.

## Open and review

Run `npm run dev -- --host 127.0.0.1 --port 4382 --strictPort` if the preview is not already running. Open `http://127.0.0.1:4382/`.

The default entrance now offers actual historical objects, photographs and documents from the existing collection. Start with the Colima model, read its account, inspect the same object, and return to the original collection. Choose another chapter or region, or use Timeline and World at a time for context. All 77 cases remain in the directory, including cases without a cleared image. Object dates remain distinct from dossier dates; modern photographs and reproductions keep their actual labels.

Desktop reading places the image beside its introduction. Teaching diagrams follow the first section of the account, have bounded previews, and retain full inspection. A selected story precedes the world map in document order. A delayed dossier response cannot remove an already open diagram inspection. Explicit old timeline/map links retain their presentation. Choosing a photograph as the default view does not reorder canonical object lists or override a copied object selection.

Screenshots of the final built candidate are in `output/stories-objects-2026-10-29/showcase/`. The browser interaction receipts and the concise `VALIDATION.json` are in that parent output folder.

## Changed implementation

- `src/atlas/StoryGallery.tsx`, `story-gallery.css`, `story-selection.ts`: visual entrance, provenance, actual object selection, chapters and complete directory.
- `src/atlas/App.tsx`, `navigation.ts`, `Dossier.tsx`, `atlas.css`: story view, copied navigation, return to collection, reading layout and diagram placement.
- `index.html`, `src/main.tsx`, `font-subset-priority.css`: the previously measured font-delivery change using existing matching Vietnamese glyph subsets. Original font programs and fallback faces remain.
- `story-selection.test.ts` and `scripts/redesign/visual-exploration-checks.mjs`: discovery, accessibility, focus, failure and delayed-loading checks. The browser suite includes the new flow. Existing timeline-specific checks now request the timeline explicitly. The performance script checks both the real new entrance and the earlier timeline against unchanged bounds.

## Executed checks and limits

Build, type/lint/design/palette/data checks and the 874-test repository run passed. After the final narrow loading adjustment, the build, focused lint and 36 media/annotation/navigation tests passed again. The new flow passes at 320/390/768/1440 pixels, including dark mode, image/source inspection, return navigation, filters, missing thumbnails and keyboard focus. Existing candidate browser and reading suites also pass. Source/data validation remains structural author QA, not independent historical or family acceptance.

All twelve performance trials passed: six for the new entrance and six for the original timeline. New-entrance maxima are 2,139ms useful text, 2,316ms illustration, 122ms search opening, 958ms search-index readiness, 105ms selection and 389ms dossier readiness. All original 2,500ms/200ms bounds remain. Timeline maxima are 2,123/2,248/121/1,960/120/400ms in the same order. These are controlled local browser trials, not physical-device results.

The complete browser suite, separate atlas coverage run, all 64 PDF exports/page review and a new portable ZIP were not rerun for this bounded interface review. Their last sealed whole-candidate receipt is the Industry checkpoint below; its metrics must not be presented as a new full gate for these edits. Existing public PDFs remain unchanged.

## Preserved baseline and continuation boundary

Actual content baseline: commit `26977813205def7f237d1d0961ffe341695ebb92`. Canonical corpus SHA256 remains `934ad2d76e29eeb2e78e078909cec1c0e6cfb3092c8804c6b03e544652ae5538`. Every tracked file under `public/atlas` remains exact, including historical sources, media, dates, readers and notebook provenance data. Corpus remains 77 dossiers, 60 expanded accounts and 17 not yet expanded. This pass adds no historical assertion, source record or image asset.

The prior complete receipt is `output/c8-industry-2026-10-29/`, with its own immutable SOURCE_STATE and PORTABLE_RESULT. Earlier receipts, local-only references, research packets and ZIPs are preserved. Prepared content drafts under output remain unadopted. Do not run older packaging writers as a release receipt for this interface candidate.

Stop for Kevin’s visual review. Do not resume content expansion or alter the wider plan until he directs the next step. A later Cursor continuation should start from the actual dirty tree and this handoff, preserve local-only scope and source uncertainty, and distinguish these executed checks from the remaining full-candidate and human acceptance work.
