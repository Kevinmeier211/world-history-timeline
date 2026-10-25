# Progress ledger (append-only; newest at bottom)

| Task | Status | Commit | Evidence (command → result) | Minutes | Notes |
| --- | --- | --- | --- | --- | --- |
| T0.01 | done | dc29e0a | `git tag` lists `gemini-v1`; branches `v2/main`, `v2/p0-tooling` | 4 | Empty commit; the task is git metadata. `npm run check` did not exist yet. |
| T0.02 | done | 2502139 | `git ls-files \| grep tsbuildinfo` empty | 3 | Ignore `dist/`, `dist-print/`, `media-cache/`, `test-results/`, `playwright-report/`, `*.tsbuildinfo`. |
| T0.03 | done | 64085b2 | `cmp` plan copies identical (820 lines); reference image and PDFs absent | 5 | See Q-01. |
| T0.04 | done | (this commit) | `RUN_CONFIG`, `PROGRESS`, `DECISIONS`, `QUESTIONS`, `UNVERIFIED`, `CONTEXT`, `DESIGN`, `DATA_PROTOCOL` exist; README links them | 12 | DESIGN and DATA_PROTOCOL copied from the plan sections named in T0.04. |

## Blocked

| Task | Tried | Error | Hypotheses | Unblock needs |
| --- | --- | --- | --- | --- |
