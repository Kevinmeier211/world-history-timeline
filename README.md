# Chronos Atlas

A states-and-peoples chart from 3300 BCE to 2000 CE. Ribbons run through time. Width is prominence. Color is lineage.

## Project documents

- [Implementation plan](docs/CURSOR_PLAN.md)
- [Run configuration](docs/RUN_CONFIG.md) (approvals; all default off)
- [Progress](docs/PROGRESS.md)
- [Decisions](docs/DECISIONS.md)
- [Questions](docs/QUESTIONS.md)
- [Unverified claims](docs/UNVERIFIED.md)
- [Context for the next session](docs/CONTEXT.md)
- [Design](docs/DESIGN.md)
- [Data protocol](docs/DATA_PROTOCOL.md)

## Commands

```bash
npm install
npm run dev
npm run check
npm run shots
npm run perf
npm run layout:report
```

`npm run shots` writes poster scenes to `docs/shots/p3/`. The earlier baseline PNGs stay in `docs/shots/v1/`. Media download and deploy stay off (`docs/RUN_CONFIG.md`). The old canvas is gone.
