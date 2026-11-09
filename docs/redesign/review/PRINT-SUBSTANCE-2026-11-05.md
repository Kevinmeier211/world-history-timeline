# P03 digital PDF audit — 5 November 2026

The current collection contains **138 PDFs and 2,066 pages**. The former 2,069-page count preceded the media revisions that removed one page each from the Middle Niger reader, chapter C4 and the combined chapter volume. No PDF content was shortened in this audit.

Eight short activity packets previously lacked language metadata and a structure tree. Their existing content now passes through semantic HTML and managed Chromium, producing genuine headings, paragraphs, captions, image descriptions and links. All eight remain two pages and within their existing size budgets. Extracted token/punctuation multisets and external source URL sets match the originals. All 16 replacement pages were rendered and visually inspected.

The other 130 PDFs received their verified catalog names as document titles through incremental metadata-only updates. Every original byte remains as a prefix; every original indirect object except `/Info` has an identical serialized hash. This preserves page, font, content, tag and link objects. Original content revisions remain unchanged. Future browser exports set the same catalog title before printing.

The final [machine-readable receipt](PRINT-SUBSTANCE-2026-11-05.json) maps every current file hash to the audited content hash. The supporting evidence is under `output/remaining-plan-2026-11-05/print/`:

- `structure-audit.json`: all 138 files have language, tags, embedded fonts, valid structure references, nonblank text, in-page text bounds and matching page/size budgets; no flagged issue files.
- `logical-reader-contract.json`: all 2,754 canonical blocks in 77 dossier readers occur in source order in the PDF tag tree. `logical-short-contract.json` verifies the five principal sections in all eight short packets.
- `figure-structure.json`: 290 Figure nodes carry their own alternative text; the remaining 252 are wrappers with a described descendant. No Figure branch lacks a description.
- `render-coverage.json`: 1,823 pages reused from 95 PDFs by exact hash, 227 supplementary page renders from 35 PDFs, and 16 replacement pages. All 2,066 pages have nonblank raster evidence. Metadata-only successor hashes retain that evidence through the object-preservation proof.
- `representative-pages.json`: 12 additional unchanged pages visually inspected across regional, chapter, combined, family, overview and dossier templates, including archive reference cards and former page-count cases. No clipping, overlap or missing figures was observed.
- `title-repair.json`: before/after hashes, unchanged object counts, titles and byte-preservation checks for all 130 metadata updates. Originals remain in `before-title-repair/`.
- `short-text-parity.json`, `short-repair-validation.json` and `installation.json`: eight-packet content, link, structure and installation evidence. Earlier PDFs remain in `before/`.

The link audit checks 4,757 annotations with 573 unique external targets for portable URI syntax; it does not establish current remote availability. No internal link annotations were present. All 114 canonical claim records retain their text, uncertainty where supplied, locators and source titles.

This is digital structural and rendering evidence, **not PDF/UA certification, spoken screen-reader testing or physical-print acceptance**. Numbered activity instructions remain paragraph tags. The 3,496 unmarked characters include numeric labels/page numbers and repeated activity headers/footers in inspected samples; artifact classification is not certified. Supplemental 45 dpi rasters establish nonblank rendering, not fine-detail print legibility. Only the stated 28 pages received new visual inspection in this pass.

The audit uses an isolated parser correction for nested `/ActualText` spans: pdfplumber 0.11.8 otherwise loses an outer MCID and Unicode replacement during extraction. This corrected the audit, without altering PDFs or installed dependencies. Managed Chromium closed in `finally`; no owned browser, server or heavy audit process remains.
