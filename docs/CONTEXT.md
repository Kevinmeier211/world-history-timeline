# Context

Resume here. Phase P0 is the tooling baseline on `v2/p0-tooling`. v1 still renders. v2 data and layout are not built.

## Architecture

Vite 6 + React 19 + TypeScript, strict and `noUncheckedIndexedAccess`. v1 chart: `src/App.tsx`, `src/components/`, `src/data/*.ts`, `src/utils/timeLayout.ts`, `src/styles/app.css`. v2 will add `src/data/schema`, `src/layout` (pure), `src/render`, `src/camera`, `src/state`, `src/ui`. Plan: `docs/CURSOR_PLAN.md`. Queue: Appendix E. Switches: `docs/RUN_CONFIG.md` (all off, `MAX_PHASE=7`).

## Commands

`npm run check` = typecheck + lint + design:lint + palette:check + vitest + validate:data. `npm run shots` writes Playwright PNGs. `npm run dev` / `build` / `preview`. Palette, validate, layout, perf, media, and export commands are stubs until the task named in their log line. `media:fetch` refuses to download while `ALLOW_MEDIA_DOWNLOAD=false`.

## Conventions

One task, one commit, message `T0.01: …`. Green `npm run check` before every commit. Files ≤ 400 lines. BCE years are negative; no year 0; display goes through `src/lib/years.ts` once it exists. Do not invent sources, URLs, accession numbers, quotes, or poster artwork. Unverified claims stay `verification: unverified` or `confidence: debated`. No push, no CI, no deploy. Branches: `v2/pN-…`, merge `--no-ff` into `v2/main` at the phase gate. Never commit to `main`.

## Gotchas

Poster and both Gemini PDFs are missing (Q-01). ESLint, Prettier, and design-lint ignore v1 until T3.16; design-lint also ignores `index.html` until T3.01. The allowlist is asserted in `src/lint/designRules.test.ts`. Vitest includes only `src/**/*.test.ts` and `scripts/**/*.test.ts` so Playwright specs are not unit tests. v1 opens with the dossier and map visible; on a 390px screen the chart is covered, so the four mobile baselines match. Zod 4 is the installed major. `@types/node` is a dev dependency for scripts.

## Next

T0.12 closes P0. Then branch `v2/p1-data` and start T1.01 (zod schemas). Do not start P8.
