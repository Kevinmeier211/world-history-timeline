# R04 — local restoration rehearsal, November 5, 2026

The technical local rehearsal passed. The frozen November 1 application can read, display and export the tested current version 1 notebooks without losing fields. The current candidate can then recover the notebook, including a revision created while the old reader is running. This is **not a provider rollback or a cleared release fallback**.

**Do not automatically restore the November 1 deployment.** It restores the original `partition-punjab-map` and `partition-telegram` scans whose redistribution scope remains unresolved. The current candidate replaced those scans with original reference cards linking to the archive. It also restores older notebook behavior without the current cross-tab write serialization, persisted edit/question drafts and recovery interface. Previous acceptance identifies the artifact; it does not clear these newly identified regressions. See [the media review](MEDIA-ARCHIVES-2026-11-04.json).

## Precisely identified artifacts

| Artifact                   | Identity and status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prior deployment           | `dpl_4wTFc4yAWPs4358p1v45mLed8rUJ`, project `prj_e6nwbdOKc3Ciq4HXokjwdFOcn6Zj`, team `team_oDhato3M2cyAoAkiuDGbD2wl`. Documented November 1 protected release. No fresh provider availability/state check was performed.                                                                                                                                                                                                                                                                                                                                      |
| Historical immutable URL   | `https://chronos-atlas-apluj6tyw-kevin-s-projects-082f3ccb.vercel.app/`; historical alias `https://chronos-atlas-five.vercel.app/`. Access protection must remain enabled. Neither URL was changed or accessed for this rehearsal.                                                                                                                                                                                                                                                                                                                            |
| Prior local source         | `output/vercel-living-timeline-2026-11-01/site/`. Its 474 static files still match the original SHA-256 manifest; all 475 uploaded files, including `vercel.json`, match the cached November 1 remote SHA-1 manifest. This verifies local bytes against archived provider evidence, not current provider state.                                                                                                                                                                                                                                               |
| Frozen rehearsal prior     | `output/remaining-plan-2026-11-05/rollback/prior-site/`: exact 474 static files plus hosting configuration. `.vercel/project.json` is deliberately not copied. Prior index SHA-256: `9113ad04db653bcbe828dbee9b64e4f96a14f6ac69e011dfbf71bef8aeef4855`. Prior corpus SHA-256: `4b6ea2949c3e65c599d9291ef2bb91063ccca18bb7bc998981106b65158f5431`.                                                                                                                                                                                                             |
| Frozen rehearsal candidate | `output/remaining-plan-2026-11-05/rollback/candidate-site/`: 710 static files plus 223 gzip derivatives, copied from verified `dist`, entry `assets/index-DWl9J7iV.js`. Index SHA-256: `8cf344b06e41ee8724ce37173c4d6276285429f22e99236f29277e6443e642b6`. Corpus SHA-256: `e1a55385b2e242dbb9dcf865d94a0527fa4ed14396a2df0908d427bb5866cddd`.                                                                                                                                                                                                                |
| Forward-restoration option | `output/completion-2026-11-04/portable/chronos-review-e5ad905147d2.zip`; artifact identity `e5ad905147d278e1da81d70c2074220a041afeb08acf595fd834d3eb8563f7f3`; ZIP SHA-256 `836c6ddf07ef4f0d45df2d76b418b9f77015bf120c99f80b68f6ea56fe2a47fc`. All 713 recorded archive files were reverified. All 710 packaged static files equal the rehearsed candidate. This preserves the present archive reference cards and notebook safeguards; it is an **undeployed, unaccepted local review candidate**, and any deployment still requires explicit authorization. |

The earlier source commit `069c1d4ddb1c95878cfef1977a955619bb5fc813` does not reproduce either dirty-worktree artifact by itself. Restore exact packaged bytes, not an assumed build from that commit. Complete file inventories and hashes are in the [artifact verification](../../../output/remaining-plan-2026-11-05/rollback/artifact-verification.json) and sibling `*-manifest.json` files.

## Executed rehearsal

An owned ephemeral server bound to `127.0.0.1` switched its serving root in memory from candidate → prior → candidate. The browser URL origin and browser context stayed unchanged; localStorage was not cleared or migrated. Cache headers were `no-store`. At each transition, fetched index and corpus hashes matched the selected frozen artifact. No live deployment, alias, DNS, Git state, existing server, user browser or real notebook was changed. The server and all owned managed-Chromium contexts/browser were closed in `finally`.

Managed Chromium `156.0.8078.4` passed eight checks. The synthetic notebook covered:

- A question and first answer saved through the candidate UI, with actual captured dossier context and complete institutional source metadata.
- A revision made through the UI, including answer, reflection, evidence and dates.
- A conflicting revision imported through the candidate UI and retained as a distinct `importedFrom` alternative.
- A source context containing only source ID and locator, representing unavailable bibliography metadata.
- A basic legacy note without optional context/revision fields.

There were four resulting entries. The prior reader displayed both competing revisions and sparse source context. It preserved the existing localStorage string byte for byte before any old-reader edits. A fresh prior browser context also imported the candidate export. No source metadata, earlier answer, alternative origin, revision or date was dropped.

| Compared exports                                                                                     | Result                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `candidate-export.json`, `prior-roundtrip-export.json`, `prior-fresh-import-export.json`             | Deep-equal JSON and byte-identical, 10,057 bytes each; SHA-256 `064dba77750760abd3b82f5e7f6e17be2178474a4e0ac9dc728e41d840e15c14`.                                                  |
| `prior-edited-export.json`, `candidate-restored-export.json`, `candidate-fresh-recovery-export.json` | After one additional revision in the old reader: deep-equal JSON and byte-identical, 10,314 bytes each; SHA-256 `447c633cb548049b19a98cdadf05952c7829e850d3381f2af3fe70aed50578ad`. |

Exact fields compared include `id`, `title`, `question`, `answer`, `collection`, `kind`, `saved`, `updated`, `location`, `importedFrom`; all revision IDs/dates/answers/reflections/evidence; context label, subject, comparison, object, year, journey and step; and every saved source ID, locator, title, URL and consulted value. Nulls and absent optional fields remain intact. The [final verification receipt](../../../output/remaining-plan-2026-11-05/rollback/final-verification.json) enumerates fields per note.

The [browser receipt](../../../output/remaining-plan-2026-11-05/rollback/browser-rehearsal.json), six exports, synthetic conflict input and screenshots are retained beside the scripts. Final browser execution recorded zero page errors and zero external requests. `browser-failure.json` preserves an initial harness failure: a list of locators changed indices as reveal-button labels changed. The corrected loop passed; it was not a notebook product failure. The first sandboxed launch also could not bind localhost; the permitted local-server execution then completed.

## Repeatable local commands

From `/Users/kevinmeier/World Hist Timeline`, verify the retained artifact bytes and export comparisons:

```sh
/Users/kevinmeier/.local/bin/agent-heavy-run -- python3 output/remaining-plan-2026-11-05/rollback/verify.py
```

Run the same-origin rehearsal with only synthetic data and an automatically assigned unused loopback port:

```sh
/Users/kevinmeier/.local/bin/agent-heavy-run -- node output/remaining-plan-2026-11-05/rollback/rehearse.mjs
```

The rehearsal rewrites its run receipts and synthetic export files with new IDs/timestamps. Preserve this dated evidence directory before repeating it if these exact export hashes must remain available. `prepare.py` is the retained one-time preparation recipe and refuses to overwrite either frozen site directory. Do not rerun it over this archive or rebuild the prior target from today's source.

For a manual local review of the forward-restoration site on an unused loopback port:

```sh
python3 scripts/redesign/serve.py --root output/remaining-plan-2026-11-05/rollback/candidate-site --port 0
```

Use the printed address, then stop only this owned server. Changing ports creates a different browser origin; use the tested Export/Import path to transfer notes. This manual command does not itself demonstrate same-origin persistence; the automated rehearsal does.

## Recovery procedure and remaining gate

Before any authorized hosting change, save unfinished questions/revisions and use **Notebook → Export notebook**. Retain that unmodified JSON separately. An export contains saved notes, not unsaved session drafts or all recovery/backup keys. If the candidate reports damaged storage, use **Export original saved data** before recovery. Deployment changes do not restore or back up browser storage.

For recovery in a fresh current reader: **Notebook → Import notebook → review the preview → Add imported entries → Export notebook**. Verify entry counts, competing alternatives, earlier thinking, revisions and saved source context against the retained export. The old reader imports immediately without the candidate's preview step; this difference was exercised. Prefer the current reader for continued editing, especially across multiple tabs. The tested version 1 fixtures establish a supported saved-notebook recovery path; they do not prove every possible malformed/limit-sized notebook or every old behavior safe.

R04's autonomous local evidence is complete. The provider gate remains open: no isolated provider preview, deployment promotion/rollback, hosted same-origin notebook check, access-policy check or served-asset verification of a newly deployed candidate occurred. Before an explicitly authorized release, confirm the exact target still exists and is usable in the intended project/team, preserve protection, stage only the selected complete static artifact, verify the isolated hosted preview and notebook recovery there, and record served hashes before changing the stable alias. **The November 1 target must not be selected automatically because of the known media and notebook regressions.** The current verified package is an identified forward-restoration option, not a deployment authorization or a claim of acceptance.
