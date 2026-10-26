# License audit

Audited on 2026-10-26 from the installed tree. Each direct dependency is the `license` field of its `package.json` under `node_modules`, at the version npm installed. `license-checker` is not a dependency of this repo, so it was not run.

A second walk read that same field on every `package.json` under `node_modules`, including scoped folders and nested `node_modules` two levels down. The copyleft section lists every hit whose field matched GPL, AGPL, LGPL, MPL, SSPL, EUPL, OSL, or CDDL. Packages with no `license` field would not appear in that list. This audit did not open the full text of every permissive license.

## Runtime dependencies

| Package                        | Version | License      |
| ------------------------------ | ------- | ------------ |
| `@fontsource/barlow-condensed` | 5.3.0   | OFL-1.1      |
| `@fontsource/source-sans-3`    | 5.3.1   | OFL-1.1      |
| `@fontsource/source-serif-4`   | 5.3.1   | OFL-1.1      |
| `d3-ease`                      | 3.0.1   | BSD-3-Clause |
| `d3-scale`                     | 4.0.2   | ISC          |
| `d3-shape`                     | 3.2.0   | ISC          |
| `d3-zoom`                      | 3.0.0   | ISC          |
| `rbush`                        | 4.0.1   | MIT          |
| `react`                        | 19.3.1  | MIT          |
| `react-dom`                    | 19.3.1  | MIT          |
| `zod`                          | 4.6.7   | MIT          |
| `zustand`                      | 5.0.16  | MIT          |

## Dev dependencies

| Package                       | Version | License    |
| ----------------------------- | ------- | ---------- |
| `@axe-core/playwright`        | 4.14.0  | MPL-2.0    |
| `@playwright/test`            | 1.64.1  | Apache-2.0 |
| `@testing-library/jest-dom`   | 7.0.1   | MIT        |
| `@testing-library/react`      | 16.3.3  | MIT        |
| `@testing-library/user-event` | 14.6.8  | MIT        |
| `@types/d3-ease`              | 3.0.2   | MIT        |
| `@types/d3-scale`             | 4.0.9   | MIT        |
| `@types/d3-shape`             | 3.2.0   | MIT        |
| `@types/d3-zoom`              | 3.0.9   | MIT        |
| `@types/node`                 | 26.6.5  | MIT        |
| `@types/rbush`                | 4.0.0   | MIT        |
| `@types/react`                | 19.3.0  | MIT        |
| `@types/react-dom`            | 19.3.0  | MIT        |
| `@types/topojson-client`      | 3.1.5   | MIT        |
| `@vitejs/plugin-react`        | 4.7.0   | MIT        |
| `@vitest/coverage-v8`         | 5.0.5   | MIT        |
| `culori`                      | 4.0.2   | MIT        |
| `eslint`                      | 9.39.5  | MIT        |
| `eslint-plugin-jsx-a11y`      | 6.10.2  | MIT        |
| `eslint-plugin-react-hooks`   | 7.1.1   | MIT        |
| `jsdom`                       | 30.1.3  | MIT        |
| `prettier`                    | 3.9.10  | MIT        |
| `sharp`                       | 0.35.5  | Apache-2.0 |
| `topojson-client`             | 3.1.0   | ISC        |
| `tsx`                         | 4.23.15 | MIT        |
| `typescript`                  | 5.8.3   | Apache-2.0 |
| `typescript-eslint`           | 8.72.0  | MIT        |
| `vite`                        | 6.4.5   | MIT        |
| `vitest`                      | 5.0.5   | MIT        |
| `world-atlas`                 | 2.0.2   | ISC        |

## Copyleft

These are the only copyleft fields the walk found. They are dev packages. `src/` does not import them. The on-disk client file `dist/assets/index-WNtnW4YO.js` contains none of the strings `libvips`, `sharp-wasm`, or `axe-core`.

| Package                            | Version | License                                  | Where it is used                        |
| ---------------------------------- | ------- | ---------------------------------------- | --------------------------------------- |
| `axe-core`                         | 4.14.0  | MPL-2.0                                  | `npm run axe` (`tests/e2e/axe.spec.ts`) |
| `@axe-core/playwright`             | 4.14.0  | MPL-2.0                                  | same axe test                           |
| `@img/sharp-libvips-linux-x64`     | 1.3.4   | LGPL-3.0-or-later                        | native library of devDependency `sharp` |
| `@img/sharp-libvips-linuxmusl-x64` | 1.3.4   | LGPL-3.0-or-later                        | same                                    |
| `@img/sharp-wasm32`                | 0.35.5  | Apache-2.0 AND LGPL-3.0-or-later AND MIT | wasm build of `sharp`                   |

`sharp` itself declares Apache-2.0. `scripts/media/process.ts` imports it. No image files are shipped, so that script has not written plates.

## Fonts

The three Fontsource packages declare OFL-1.1.

- Barlow Condensed 5.3.0. The package README names Copyright 2017 The Barlow Project Authors.
- Source Sans 3 5.3.1. The package README names Google Inc. and links the SIL Open Font License 1.1.
- Source Serif 4 5.3.1. The package README names Google Inc. and links the SIL Open Font License 1.1.

`src/main.tsx` imports Barlow Condensed 600, 700, and 800, Source Sans 3 400 and 600, and Source Serif 4 600.

The print PDFs from `docs/PROGRESS.md` (T7.02 and T7.05) embed those families with `emb=yes`, plus Arimo-Bold on the chart sheets. Arimo is not an npm dependency. It is the face Chromium used for U+2192. On this machine, `/usr/share/fonts/truetype/croscore/Arimo-Bold.ttf` has a name table that records Copyright 2010 Google Inc. and the SIL Open Font License 1.1. This audit did not byte-compare that file to the embedded subset. The Source Sans woff2 files report PostScript names `SourceSans3ExtraLight-Regular` and `SourceSans3ExtraLight-SemiBold`. Their OS/2 weight classes, recorded in the T7.05 decision, are 400 and 600.

## Data and media

No image files are shipped. `docs/print/colophon.txt` reads: "Chronos Atlas / No image files are shipped. / Fetch is queued-gated while downloads are off. / Pictograms stand in for plates."

`LICENSES/SOURCES.md` is generated from `src/data/sources.json`. It lists 58 pages that returned HTTP 200 on 2026-10-25. Listing a URL does not license that site's content. Gemini bibliography entries [1]–[37] are omitted (Q-02). Roster prose is this project's and stays `verification: unverified` until a listed page is opened.

`world-atlas` 2.0.2 declares ISC. Its `LICENSE` is Copyright 2013–2019 Michael Bostock, with the ISC permission paragraph. The package README says the repository redistributes Natural Earth vector data 4.1.0 as TopoJSON. `scripts/make-watermark.ts` reads `world-atlas/land-110m.json`. That README entry describes the file as Natural Earth land boundaries at 1:110m. This audit did not open naturalearthdata.com, and it does not state a Natural Earth license. The countries files in the same package are unused by the watermark script.

## What stays gated

`ALLOW_MEDIA_DOWNLOAD` is false. CC BY and CC BY-SA images need an entry in `CC_BY_APPROVED_IDS` before they can ship. That list is empty.
