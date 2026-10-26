# Chronos Atlas

Chronos Atlas is a states-and-peoples chart from 3300 BCE to 2000 CE. Each polity is a ribbon. Width is prominence. Color is lineage. The same roster is the interactive poster and the print sheets: Letter, Tabloid, and 24×36.

The UsefulCharts poster is the inspiration. This repo does not contain that poster or the Gemini PDFs (Q-01). The roster, the prose, and the coordinates are this project's.

## Run

```bash
npm install
npm run dev
npm run check
```

`npm run dev` serves the interactive poster. `npm run check` is the typecheck, lint, design lint, palette check, tests, and data validation. Image download stays off (`ALLOW_MEDIA_DOWNLOAD=false` in `docs/RUN_CONFIG.md`). No image files are shipped.

## Export

`?print=1` is a static 24×36 in sheet with the chrome left off. `size=letter` is 8.5×11. `size=tabloid` is 11×17. `?print=1&bleed=1` is the poster with 0.125 in of bleed and crop marks.

```bash
npm run export:pdf
npm run export:reference
npm run export:all
npm run check:pdf
```

`export:pdf` writes the three trim PDFs. `export:reference` writes the era-by-region reference. `export:all` writes those files, the bleed poster, and `dist-print/manifest.json`. `check:pdf` checks page size, embedded fonts, image dpi, and the 24×36 stroke floor. These commands sit outside `npm run check`. `dist-print/` is gitignored.

`docs/PRINT_QA.md` records the export stamped `2026-10-26T21:43:38.334Z`.

## Data

The protocol is `docs/DATA_PROTOCOL.md`. Every roster row has source ids from `src/data/sources.json`, a confidence, an importance, and a verification. BCE years are negative. Year 0 is invalid. The chart's political end is 2000. A claim stays `verification: unverified` until a listed page is opened and the evidence note records what that page said. `docs/UNVERIFIED.md` is generated. It lists 40 of 40 importance-4 callouts as unverified. Cross-checked rows are 0.

## Credits

Ribbon and interface type is Barlow Condensed, Source Sans 3, and Source Serif 4, under the SIL Open Font License 1.1. No image plates are shipped. The colophon is `docs/print/colophon.txt`. The land watermark is built from `world-atlas` land geometry. The dependency audit is `docs/LICENSES.md`. The source list is `LICENSES/SOURCES.md`.

## Documents

- [Handoff](docs/HANDOFF.md)
- [Licenses](docs/LICENSES.md)
- [Print QA](docs/PRINT_QA.md)
- [Implementation plan](docs/CURSOR_PLAN.md)
- [Run configuration](docs/RUN_CONFIG.md)
- [Progress](docs/PROGRESS.md)
- [Decisions](docs/DECISIONS.md)
- [Questions](docs/QUESTIONS.md)
- [Unverified claims](docs/UNVERIFIED.md)
- [Context for the next session](docs/CONTEXT.md)
- [Design](docs/DESIGN.md)
- [Data protocol](docs/DATA_PROTOCOL.md)
