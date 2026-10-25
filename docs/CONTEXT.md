# Context

Skeleton for a fresh session. T0.12 replaces this with commands once tooling exists.

## Architecture

Vite 6, React 19, TypeScript. v1 chart still lives in `src/`. v2 layout, data, and renderer are not built yet. The operating plan is `docs/CURSOR_PLAN.md`. Appendix E is the queue.

## Commands

`npm run dev`, `npm run build`, `npm run preview`. `npm run check` arrives in T0.10.

## Conventions

BCE years are negative. No year 0 in display. Do not invent sources or poster artwork. Files stay at or under 400 lines. One task, one commit. `npm run check` must be green before every commit once it exists.

## Gotchas

The UsefulCharts poster and both Gemini PDFs are missing (Q-01). Switches in `docs/RUN_CONFIG.md` are all off. `MAX_PHASE` is 7. Do not push, deploy, or add CI.

## Now

Phase P0 on `v2/p0-tooling`. Next: T0.05 cursor rule, T0.06 dependencies, T0.07 TypeScript and test runners.
