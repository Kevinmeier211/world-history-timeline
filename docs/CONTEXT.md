# Context

Resume here. Branch `v2/p1-data`. Last done task is in `docs/PROGRESS.md`. v1 still renders. Layout and the v2 renderer are not started. Do not start P8.

## Architecture

Vite 6 + React 19 + TypeScript, strict and `noUncheckedIndexedAccess`. v1 chart: `src/App.tsx`, `src/components/`, `src/data/*.ts`, `src/utils/timeLayout.ts`, `src/styles/app.css`. v2 schemas live in `src/data/schema` (zod is the source of truth). `src/data/index.ts` loads the v2 catalog and re-exports the v1 barrel from `legacy.ts`. Still to come: `src/layout` (pure), `src/render`, `src/camera`, `src/state`, `src/ui`. Plan: `docs/CURSOR_PLAN.md`. Queue: Appendix E. Switches: `docs/RUN_CONFIG.md` (all off, `MAX_PHASE=7`).

## Commands

`npm run check` = typecheck + lint + design:lint + palette:check + vitest + validate:data. `npm run shots` writes Playwright PNGs. `npm run dev` / `build` / `preview`. `validate:data` is real and warns on polities with no inbound relation until T1.28. Layout, perf, media, and export commands are still stubs. `media:fetch` refuses to download while `ALLOW_MEDIA_DOWNLOAD=false`. Checklist rows are applied with `npx tsx scripts/apply-roster.ts <family>`.

## Conventions

One task, one commit, message `T0.01: …`. Green `npm run check` before every commit. Files ≤ 400 lines. BCE years are negative; no year 0; display goes through `src/lib/years.ts` once it exists. Do not invent sources, URLs, accession numbers, quotes, or poster artwork. Unverified claims stay `verification: unverified` or `confidence: debated`. No push, no CI, no deploy. Branches: `v2/pN-…`, merge `--no-ff` into `v2/main` at the phase gate. Never commit to `main`.

## Gotchas

Poster and both Gemini PDFs are missing (Q-01). Gemini bibliography [1]–[37] was not reconstructed (Q-02). Tag `gemini-v1` has 6 routes and 5 presets, not 9 and 16 (Q-03). Undated checklist names are omitted (Q-04). ESLint, Prettier, and design-lint ignore v1 until T3.16; design-lint also ignores `index.html` until T3.01. The allowlist is asserted in `src/lint/designRules.test.ts`. Vitest includes only `src/**/*.test.ts` and `scripts/**/*.test.ts`. `src/data/sources.json` and `LICENSES/SOURCES.md` are prettier-ignored. v1 map centers are schematic pixels, so migrated anchors use `xKey`. Skeleton files are `src/data/polities/<family>-skeleton.json` and may split as `-2`, `-3` to stay under 400 lines. Orphan warnings are expected until T1.28. Zod 4 is the installed major.

## Next

T1.22 Islamic and Arab checklist skeleton (`islamic_arab`, minimum 12). Then T1.23 through T1.27, T1.28 relations, T1.29 era minimums, T1.30 unverified report, T1.31 overrides, T1.99 phase gate. Do not start P8.
