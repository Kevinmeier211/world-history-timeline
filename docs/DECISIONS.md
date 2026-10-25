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

## 2026-10-25 — Design lint skips v1 until it is deleted

Decision: `scripts/design-lint.ts` does not scan `index.html` or the v1 app (`src/App.tsx`, `src/main.tsx`, `src/components/`, `src/styles/app.css`, `src/utils/`). The five §13.6 rules still run on every other file, and unit tests cover each rule.

Alternatives: Fail `design:lint` on v1 now, or loosen the rules so the current CSS passes.

Why: T0.11 still needs an untouched v1 screenshot, and T3.01 / T3.16 are the tasks that remove Google fonts and the old canvas. The allowlist is a constant asserted by a test so it cannot grow quietly.

Reversible? y

## 2026-10-25 — Year 0 is invalid data, and endpoints are explicit

Decision: Schema years reject `0`. Alternative political ends (Safavid 1722/1736 and the like) go in optional `endpoints` notes instead of a second silent `end`.

Alternatives: Allow `0` and map it only at display time. Store one end and mention the other only in prose.

Why: The date policy says display has no year 0 and debated ends must not be chosen silently. Rejecting `0` in the schema makes the mistake fail validation.

Reversible? y

## 2026-10-25 — Lineage hues stay near Appendix A, lightness moves for contrast

Decision: `families.json` keeps each Appendix A hue within about 30 degrees, then changes lightness and chroma until every neighbor pair (families that share an `xZone`) has ΔE2000 ≥ 12 in normal vision and in deuteranopia, protanopia, and tritanopia, and each fill has a label contrast ≥ 4.5 against either ink or paper in both themes.

Alternatives: Keep the exact Appendix A hex values and drop the contrast rule. Compare every family pair, including ones that never sit next to each other.

Why: Several starting swatches (Chinese red, Levantine purple, Latin purple) cannot hold 4.5:1 type in either ink or paper. Neighbor-only comparison matches the rule that color must separate ribbons that can touch. Exact hex values that fail the gate are not usable.

Reversible? y

## 2026-10-25 — Local culori types instead of `@types/culori`

Decision: `src/types/culori.d.ts` declares the four functions the palette check calls. `@types/culori` is not installed.

Alternatives: Keep `@types/culori` and cast through `any`.

Why: Those published types make `differenceCiede2000()` a union too large for `tsc` to represent (`TS2590`). A narrow local declaration typechecks the calls we actually make.

Reversible? y

## 2026-10-25 — v1 data barrel moved to `legacy.ts`

Decision: `src/data/index.ts` is the v2 catalog entry. The previous barrel lives in `src/data/legacy.ts` and is re-exported so the v1 app keeps compiling until T3.16.

Alternatives: Replace the barrel now and update every v1 import. Leave the v2 catalog under a second filename.

Why: The plan names `src/data/index.ts` as the loader. Keeping the v1 names exported avoids a broken chart before the renderer swap.

Reversible? y

## 2026-10-25 — Validator warnings versus errors

Decision: Schema failures, duplicate ids, missing endpoints, a relation year outside a life ± 50 years, and missing source or media ids are errors. A polity with no inbound relation, a pre-1000 BCE polity with fewer than two sources, an empty source URL, and an importance ≥ 3 entry whose only citations are Wikipedia are warnings. The adjacent-lane color rule (>25% of touching pairs share a hex) is implemented and unit-tested; `validate:data` does not invent lane pairs, and prints that the check waits for the layout report.

Alternatives: Fail the build on orphans and single ancient sources now. Skip the color rule until T2.

Why: §6.3 says errors fail and warnings print. Orphans are cleared in T1.28, second ancient sources arrive as the roster is sourced, and lanes do not exist until the solver. The color function is already strict so the later call site cannot quietly drop the gate.

Reversible? y
