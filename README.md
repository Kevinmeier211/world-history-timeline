# Chronos World History Atlas

**Full tracker review, November 6:** all 65 tasks and 635 detailed entries reconciled; no further autonomous implementation repair identified. See [remaining human, deployment and WebKit endpoints](docs/redesign/review/FULL-TRACKER-AUDIT-2026-11-06.md). Application bytes and prior archives are unchanged.

Latest local follow-up: [WebKit investigation and tracker corrections](docs/redesign/review/WEBKIT-FOLLOWUP-2026-11-06.md). Standard navigation passes in all three engines; a reproduced WebKit document-replacement diagnostic remains open. No deployment or human acceptance is implied.

The **November 6 gzip successor** passes all 12 unchanged local timing trials (worst illustrated view 2,395 ms; search opening 146 ms; selection 81 ms), 719 tests and three-engine navigation/loading/accessibility checks. Startup loading and repeated search work were reduced; the historical corpus and all 138 PDFs are unchanged. See the [gzip review](docs/redesign/review/GZIP-PERFORMANCE-2026-11-06.md) and current tracker for exact build identities, retained failed diagnostics and remaining scopes. Human testing and deployment/hosted verification remain open.

**Completion program in progress, November 6:** [Detailed plan and acceptance endpoints](docs/redesign/COMPLETION-PLAN-2026-11-04.md) · [Task and coverage tracker](docs/redesign/COMPLETION-TRACKER-2026-11-04.json). Covers the full improvement scope, including adult-guided learning for ages 10–14. Local implementation and review preparation are verified for the candidate identified below; human acceptance and final release remain open.

**Hosted app:** [Open Chronos Atlas](https://chronos-atlas-five.vercel.app/) (Vercel sign-in required). The November 1 release includes the Living timeline and Meanwhile elsewhere comparison view, with the existing content, source notes, images and PDF exports preserved. Notebook entries stay in each browser; use Export and Import to move them from the local app. See [hosting details and verification](docs/redesign/VERCEL-HOSTING-2026-11-01.md).

A React/Vite/TypeScript atlas for adult exploration and adult-guided learning for ages 10–14, covering 3300 BCE–2000 CE. The current compiled corpus contains **77 dossiers, 589 sources, 105 media records, 78 reference contexts, 56 regional readings, 76 comparisons, 33 journeys and 82 glossary terms**. All 77 dossiers have expanded reading and family activities; 38 have place studies and seven have no attached image.

[Current inventory](docs/redesign/CURRENT-STATE.json) is generated with `python3 scripts/completion/current-state.py`. Counts describe authored coverage, not historical completeness or independent approval. [Implementation status](docs/redesign/IMPLEMENTATION-2026-11-04.md) records current work and its verification. The complete [completion plan](docs/redesign/COMPLETION-PLAN-2026-11-04.md) and [tracker](docs/redesign/COMPLETION-TRACKER-2026-11-04.json) distinguish local implementation from human acceptance and hosted release.

The regional expansion adds **56 of 56 planned regional readings and 84 of 84 dated snapshots**, covering all eight chapters. Eight new printable companions join the earlier 130 downloads. [Regional implementation and remaining scope](docs/redesign/review/REGIONAL-READINGS-2026-11-04.md) records the new work and its separate checks.

The earlier November 5 engineering pass added per-entry navigation/focus restoration, persistent investigation filters, explicit reading retries, protected pending-save drafts and canonical content ownership. The [navigation review](docs/redesign/review/NAVIGATION-ENGINEERING-2026-11-05.md) and [accessibility matrix](docs/redesign/review/ACCESSIBILITY-MATRIX.md) record three-engine coverage, native Chromium zoom and the remaining human checks. The fresh-install gate passed 703 current-atlas tests and 710-file build parity; that checkpoint preserved the historical corpus and all 138 PDFs. The subsequent November 5 remaining-plan pass changed one glossary definition and eight short PDFs, as recorded in its dated receipt below.

The subsequent November 5 pass added sourced map explanations, completed the glossary context review, repaired eight short activity PDFs and updated 130 PDF titles without changing their content. Its [November 5 verification receipt](output/remaining-plan-2026-11-05/verification.json) remains dated predecessor evidence. The print catalog is **138 PDFs / 2,066 pages**.

The [current handoff](docs/redesign/REMAINING-WORK-2026-11-05.md), [November 6 verification receipt](output/gzip-performance-2026-11-06/verification.json) and [release-review receipt](output/release-review-2026-11-06-receipt.json) identify the verified gzip candidate, exact review package and remaining human/deployment endpoints. No deployment was performed.

The earlier November 4 implementation checkpoint passed **645 current-atlas tests and 359 separately reported legacy tests**. A fresh locked-dependency build matched all 698 delivered files. That earlier catalog contained 130 PDFs, and the [local review archive](output/completion-2026-11-04/portable/chronos-review-1651adc70a4b.zip) passed fresh extraction and offline browser checks. That ZIP predates the regional expansion. The complete historical/editorial program remains open. Kevin removed the H01/H02 formative pilot gate; it is recorded as removed rather than passed.

The November 4 assessment passed the standard 936-test gate and the overlapping 577-test atlas suite, plus responsive browser checks. Those receipts describe the pre-implementation baseline. New implementation checks and limitations are recorded separately. Earlier content, print and packaging evidence remains in the [archived README](docs/reference/README-before-completion-2026-11-04.md) and dated handoffs.

## Run and explore locally

Fresh visits open the **Living timeline** at 200 CE. Move the time slider to preview a moment, select a case for its object and question, then use **Explore** to commit the date. **Compare this moment** opens **Meanwhile elsewhere**, with a world map and regional starting points; both views retain the chosen moment and story when returning from a dossier. **Refine view** contains chapter and region controls; **Full history** and direct year entry remain visible outside it, including on phones. Investigation filters persist in the URL through reload, Back/Forward and continuation. The original gallery, complete chronology, chapter readings and source notes remain available. The October 30 interface changes preserve every existing content file; their scoped verification is in [the Living timeline receipt](output/living-timeline-2026-10-30/).

Double-click **Start Chronos.command** in this project folder to build and open the atlas at [127.0.0.1:4383](http://127.0.0.1:4383/). Keep its Terminal window open while reading; press Control-C to stop. Launch it again whenever you want to return. It uses this Mac's Node.js and Python 3 and opens only a local server. Notebook entries remain associated with this address and browser; export the notebook before moving to another address or device. Build errors are recorded in `output/local-launch/build.log`.

For development, use [127.0.0.1:4382](http://127.0.0.1:4382/):

```sh
ATLAS_REPORT_DIR=output/current-candidate/browser ATLAS_COVERAGE_DIR=output/current-candidate/coverage-atlas npm run check:candidate
npm run dev -- --host 127.0.0.1 --port 4382
```

Use a fresh report directory for each new receipt. An older packaging script or ZIP is not a current release receipt.

Follow [Skills, records and protection](http://127.0.0.1:4382/?journey=skills-records-protection&step=0&pack=C8&subject=factory-reform&scale=local&year=1836) or inspect [Tomioka's print and modern references](http://127.0.0.1:4382/?pack=C8&subject=tomioka&scale=local&year=1872&object=tomioka-reeling-print) and [Hine's photograph and separately dated records](http://127.0.0.1:4382/?pack=C8&subject=hine-labor&scale=local&year=1908&object=loc-hine). Read source notes, save/revise a Notebook question and export readers, chapters, family sheets or the A3 overview/companion. Versioned notebook JSON preserves questions and conflicting revisions when moved or imported.

Build with `npm run build`. For an archive identified by its actual portable receipt, extract its ZIP and run `python3 launch.py` inside it. The launcher serves static teaching content on loopback; external source links need internet. Use HTTP rather than opening `index.html` directly.

## Evidence and remaining work

Content is authored in the chapter and shared registries under `scripts/redesign/content-canonical/`; the manifest records each record's owner and stable delivery order. See [content ownership](docs/redesign/CONTENT-OWNERSHIP.md). `src/atlas` renders the generated delivery files. The inherited `src/data` remains research and is excluded from teaching runtime. All 1,274 legacy dispositions remain accounted for. Source locators, consultation scopes, media rights and checksums are retained in manifests and dated packets. Content status “published” means included in this local build. Revisioned media and journey records retain immediate navigation/provenance with visible load failure/retry; full corpus and print remain complete.

Independent historian/community assessment, real adult/family use, human screen-reader testing, physical-device behavior and physical print inspection remain open. Internal author-team source review and automated checks do not supply those acceptance results. Switching models alone does not supply them. Abstract-only, inaccessible, uncollated, image-date and source-copy uncertainties remain explicit.

Historical October implementation notes below describe the earlier startup-performance and presentation-copy pass, keeping the same phone targets, fonts, source records and historical dates. The finite minor copy observations are recorded in `output/c8-industry-2026-10-29/copy-followups.json`. Prepared content packets and remaining registry tasks follow; they are separate from this checked candidate. Broader simultaneous-world coverage, phone time exploration, explanatory graphics, learning and glossary design, notebook revision, broader reader design and human acceptance remain materially open. The entire roadmap is not complete.

Earlier receipts and ZIPs preserve their historical bytes and validation. Local-only references and research remain intact. The November 1 Vercel deployment contains only the tested static app and its hosting configuration; the Git working tree remains uncommitted and was not pushed.
