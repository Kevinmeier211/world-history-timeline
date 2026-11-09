# Reading glossary continuation — 28 October 2026

Local continuation from C6 checkpoint `4eb0061fd5a6eb8ba98d99c1982a0a8533bc3361` on `codex/atlas-redesign`. Kevin’s authorization to continue locally remains in force. No push, deployment, publication, external message, new chat, subagent or automation. Earlier references, research, receipts and ZIPs remain preserved.

Relevant named terms now open the existing glossary definition beside the reading experience. Dotted inline words are real keyboard-operable buttons with a named native modal, Escape and a visible return button. Closing returns focus to the same word and restores its reading position. The background cannot receive focus or scroll while the definition is open; browser Back removes an open definition and releases its scroll lock. No URL, notebook record or historical text is changed by looking up a word.

The first exact mention of a listed term is linked once within the main reading group and separately within optional deeper reading. Matching supports authored slash alternatives such as jeli/jeliw, apostrophe variants and space/hyphen forms, with Unicode word boundaries. It does not guess plurals, stem words or attach unrelated global definitions. Fifty-two dossiers currently have exact in-passage mentions. The existing full word lists and glossary search remain for other forms and unmatched terms.

All 77 dossiers’ main/deeper paragraphs are reconstructed character-for-character in tests. Browser checks also compare the visible summary and main paragraphs with the authored JSON, verify modal isolation, focus/scroll restoration, unchanged URLs and retained deeper-reading disclosure state. The same flows pass four widths in Chromium and the installed WebKit engine. A browser-close event and React cleanup are asynchronous; checks wait for the completed restoration rather than treating the first hidden-dialog frame as the settled state.

Implementation uses small module-level React components, a pure text-partition helper, existing CSS variables and native dialog behavior. No new dependency, asynchronous source request, account, storage key, narration or historical claim is introduced. Effect cleanup restores previous overflow/gutter styles; a route unmount leaves destination scrolling to the router. Definitions are the current corpus definitions, without a claim of renewed source review.

Current evidence belongs to `output/learning-glossary-2026-10-28/`. Final gate, source/build/PDF hashes and archive verification identify the checked candidate. Source corpus and all 263 tracked atlas data/media files match C6. Re-exported print remains a separate regression check; this screen-only interaction does not rewrite the readers.

The final integrated gate passes **456 tests in 122 files**, including **97 atlas tests in sixteen files**, all 21 journeys, four-width browser flows, 179 derivatives and six unchanged-bound performance trials. JavaScript is 107,394 gzip bytes; atlas coverage is 37.76% statements / 38.06% lines / 35.97% branches / 25.94% functions. Worst text is 2,031 ms, illustration 2,393 ms, search 151 ms, selection 177 ms, full search index 1,482 ms and dossier ready 382 ms. Phone illustrations are 2,360 / 2,335 / 2,393 ms against 2,500 ms.

The separate WebKit run passes the same four-width definition/history flows. A dark-appearance check passes in Chromium and WebKit with no axe violations. All **29 PDFs / 390 pages** were re-exported, rendered and checked for paper, bounds, nonblank text and tags. Every page matches C6 pixels, and all extracted text matches exactly. Shared public/build/report PDF copies match. Tagged output is not a PDF/UA claim; the current receipt identifies final bytes.

Use a fresh directory for a later gate:

```sh
ATLAS_REPORT_DIR=output/current-candidate/browser ATLAS_COVERAGE_DIR=output/current-candidate/coverage-atlas npm run check:candidate
```

Independent historical review, actual family/adult use, human screen-reader/device behavior and physical print remain separate. Automated browser behavior is not a human assistive-technology assessment. Broader glossary wording/coverage, varied exercises, chapter-reader design, remaining content/reference/geography and human acceptance remain open; local implementation should continue without another checkpoint permission loop.
