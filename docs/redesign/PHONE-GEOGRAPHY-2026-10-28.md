# Phone time navigation and geographic exploration

28 October 2026. Local continuation from `4dc0939727f9fc261a5695111038175126b00a11`, on `codex/atlas-redesign`. Kevin asked to keep progressing through the remaining local plan without stopping for another go-ahead after each checkpoint. Publication, external messages and automations remain separate actions.

## Implemented

Phones now open a readable year-focused regional view instead of requiring sideways timeline scrolling. It distinguishes reference-frame dates, included case dates and nearby readings from different dates. The proportional world/chapter charts remain available through named controls and remain visible on wider screens. Chapter background can be expanded on phones so navigation appears earlier.

The time navigator provides earlier/later documented context, a keyboard-operable proportional year slider, an explicit apply action, viewing shortcuts and single-year steps. The continuous year index crosses directly between 1 BCE and 1 CE. Context steps use existing chapter anchors and reference phases, filtered by region; they do not invent events or establish a complete global chronology. A draft slider position changes no URL or reading until applied. Back/reload restore the chosen year.

The world map can fit shown places, focus a named location without opening its dossier, and then open that reading explicitly. The focused place retains its geographical precision and own dates. World reset, zoom, pan, clustered places and the equivalent named list remain. Locator labels stay inside the map; long labels have an accessible full name and a full text panel. Dateline-separated places retain a world view rather than being joined across the wrong side of the map.

No corpus assertions, source scopes, dates, coordinates, historical relationships or earlier media bytes changed. This improves exploration around the existing research; broader historical coverage, sourced routes/plans and the compact reading breadcrumb remain open.

## Verification

The full candidate gate passed **423 tests**, including the separate **64-test atlas run**, all **eighteen journeys**, four-width browser checks, all **165 image derivatives** and six unchanged-bound performance trials. Atlas coverage is **30.43% statements / 30.56% lines**. Final JavaScript is **100,578 gzip bytes**. The slowest throttled-phone illustrated view was **2,427 ms**, against the unchanged 2,500 ms limit; local lab timing has limited headroom.

All nineteen PDFs / 259 pages were rendered and verified for sizes, bounds, tags and matching shared export copies. 258 pages match reviewed C3 pixels; Indonesia reader page five was visually reviewed again. No print content changed. Tagged output does not establish PDF/UA conformance.

The new browser checks cover draft/application behavior, context boundaries, Back restoration, named map focus, fit/reset, intentional region preservation, label containment, keyboard use, no overflow and zero axe violations at 320/390/768/1440 pixels. The accessibility pass caught a skipped map heading level, repaired before the successful gate. Earlier diagnostic runs retain a misplaced CLI-evidence formatting failure and sandbox IPC failure; no application requirement was relaxed.

React review checked derived data, keyed slider drafts, stable component boundaries, observer cleanup, native form/control semantics, local-only data flow and bundle cost. No new dependency or remote request was added. Independent historical, actual adult/family, screen-reader, physical-device and physical-print acceptance remain open.

The dated receipt is `output/phone-geography-2026-10-28/README.md`; final source/build/PDF hashes are in `SOURCE_STATE.json`. Earlier receipts and ZIPs keep their historical scope. C4 Palmyra, Kushan and Aksum source review is underway; subsequent content must receive a fresh gate and receipt.
