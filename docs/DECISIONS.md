# Decisions

Local, reversible choices consistent with the plan. Format: date, decision, alternatives, why, reversible.

## 2026-10-25 — Phase branches stay on the names in the plan

Decision: Work lands on `v2/p0-tooling`, then `v2/p1-data`, and so on. Completed phases merge with `--no-ff` into `v2/main`. `main` is not touched.

Alternatives: A single `cursor/…` branch for the whole run.

Why: Kevin named these branches in the approved plan and in the run instructions. `ALLOW_PUSH` is false, so the branches stay local.

Reversible? y

## 2026-10-25 — `@types/node` for configs and scripts

Decision: Dev-dependency `@types/node` is installed so `vite.config.ts` and later `scripts/` can import Node builtins under `tsc -b`.

Alternatives: Keep configs out of `tsc` and use URL-only aliases with no Node import.

Why: T0.07 requires `tsc -b` to typecheck the Vite and Playwright configs, and every later script is TypeScript on Node. This is not a runtime dependency and is under the size switch.

Reversible? y
