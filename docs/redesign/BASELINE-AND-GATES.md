# Current source and candidate gates

The current implementation is identified by file hashes, not by the old Git commit alone. The working tree contains earlier uncommitted changes. Preserve them; do not reset or use a blanket staging command.

The current inventory is [CURRENT-STATE.json](CURRENT-STATE.json). The completion program is [COMPLETION-PLAN-2026-11-04.md](COMPLETION-PLAN-2026-11-04.md), with task status in [the tracker](COMPLETION-TRACKER-2026-11-04.json). Earlier STATUS, coverage and hosting documents are dated checkpoints, not the status of this candidate.

## Reproduce the baseline

Validated runtime: Node 26.10.0, npm 11.19.1, Python 3.9.6 on macOS. Other runtime versions are not yet validated. Use the exact package lock; do not update dependencies as part of reproducing a release.

```sh
/Users/kevinmeier/.local/bin/agent-heavy-run -- python3 scripts/completion/isolated-candidate.py --online
```

This command copies allowlisted source/input directories into a new temporary directory, excludes private `local-only` research and prior output, installs locked dependencies into that directory, rebuilds content and application, runs type/lint/design/palette checks, validates the complete atlas contract, runs the atlas tests and checks the bundle budget. It preserves the temporary candidate and writes the exact input hashes, runtime, step results and build hashes to `output/completion-2026-11-04/reproducibility/receipt.json`. No dev server is needed. Use `--report-dir <path>` for a separate dated receipt. `--reuse-dependencies` is a diagnostic mode and does not prove clean dependency installation. The default offline installation requires a complete local npm cache; the first attempt found a missing cached Zustand package and failed explicitly. The subsequent online clean install/build/validation/test run passed.

The receipt identifies the snapshot captured when the command began. Later source edits invalidate its use as final release evidence. Repeat on the frozen candidate before M4.

## Inputs and private boundaries

- Authored application and data assembly: `src/`, `scripts/`, root configuration and lockfile. Canonical content is in `scripts/redesign/content-canonical/`, with eight chapter files, a shared-record file, the source registry and an explicit record-order/ownership manifest.
- Preserved static inputs: `public/`, including local image derivatives and reference assets. These bytes are hashed in [the review register](review/current-register.json). A derivative hash does not establish copyright permission or historical accuracy.
- Generated corpus and sidecars: produced by `npm run content:build` from the canonical files through a fresh validated loader and delivery projections. Add a new record to its canonical owner file and to both the ownership and ordered-ID entries in the manifest. The earlier base and 35-stage pipeline remain a historical comparator, with field-writer provenance in `CONTENT-HISTORY-2026-11-05.json`.
- Existing PDF/portable exports: `public/atlas/exports/` is ignored by Git and copied as a supplied artifact. It must be carried in a release asset archive or regenerated through the print/portable workflow. The clean source build proves reproducibility with those explicitly supplied bytes; it does not prove fresh PDF regeneration. P01–P04 still govern that release work.
- Receipts, screenshots, candidate builds and archives: `output/`, ignored. Keep exact release evidence in a deliberate release packet rather than relying on a source commit to preserve it.
- Private reference material: `docs/reference/local-only/`, excluded from staging and isolated copies. `.playwright-cli/`, caches, dependencies and credentials are not source inputs.

Before a source checkpoint, review `git status --short`, inspect the diff, and stage named implementation files only. Inspect `git diff --cached --name-only` and `git diff --cached --check` before committing. Never stage `output`, private research, browser state, dependency caches, or notebook exports. A commit is optional for local verification, but a release receipt must include dirty-file hashes if no commit identifies the exact source.

The November 5 content migration matched the complete corpus and all 190 delivery JSON files first for C1 and then for all chapters. Its receipts are under `output/navigation-accessibility-2026-11-05/content-ownership/`. Intentional later content edits receive a new corpus revision and current-contract validation. The optional `ATLAS_BASELINE_CORPUS` comparison is a structural parity gate. Run `scripts/completion/content-ownership.ts` without that variable to refresh current canonical ownership after an editorial change.

## Separate gates

1. `npm run typecheck` and `npm run lint`: types and source hygiene.
2. `npm run validate:atlas -- --complete`: current data, citations, IDs, media and content contracts.
3. `npm run check:atlas` is the release-facing static/unit gate. `npm run test:atlas` reports current application coverage separately; `npm run test:legacy` runs inherited non-atlas tests and layout coverage. The original `npm run check`/`npm run test` aggregate remains available for compatibility. Legacy layout coverage is never presented as atlas UI coverage.
4. Build a candidate, then run `ATLAS_BUILD_ROOT=<candidate-directory> ATLAS_REPORT_DIR=<new-receipt-directory> npm run test:browser`. The runner owns an isolated port and closes its server in `finally`. Use the resource launcher for direct Node browser runs. Browser scripts use managed engines and close owned browsers on failure.
5. Notebook concurrency/recovery: `ATLAS_URL=<owned-preview> node scripts/completion/notebook-browser.mjs`, inside the resource launcher. This includes real tabs, draft reload, edit conflicts, deletion during editing and raw recovery export.
6. Print, portable, performance, additional engines and human checks retain their separate acceptance criteria in the completion plan. No unit test substitutes for independent source review or observed reader use.

The November 1 protected hosted release remains unchanged. A local candidate is not an accepted or deployed release.
