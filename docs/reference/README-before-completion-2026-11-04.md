# Chronos World History Atlas

**Proposed completion program, November 4:** [Detailed plan and acceptance endpoints](docs/redesign/COMPLETION-PLAN-2026-11-04.md) · [Task and coverage tracker](docs/redesign/COMPLETION-TRACKER-2026-11-04.json). Covers the full improvement scope, including adult-guided learning for ages 10–14. The program is planned; its implementation and human acceptance are not yet complete.

**Hosted app:** [Open Chronos Atlas](https://chronos-atlas-five.vercel.app/) (Vercel sign-in required). The November 1 release includes the Living timeline and Meanwhile elsewhere comparison view, with the existing content, source notes, images and PDF exports preserved. Notebook entries stay in each browser; use Export and Import to move them from the local app. See [hosting details and verification](docs/redesign/VERCEL-HOSTING-2026-11-01.md).

A React/Vite/TypeScript atlas for family exploration and adult investigation, covering 3300 BCE–2000 CE. Current corpus: **77 dossiers, 451 sources, 105 media, 60 reference contexts, 76 authored pairs, 8 chapters, 33 journeys and 82 glossary terms**. **60 dossiers** have expanded reading layers; **17** have not received those layers. **7** remain imageless. There are **38 place studies**, **22 original guides** and **26 explanatory diagram records**. These counts do not establish complete social histories.

Start with [current status](docs/redesign/STATUS.md), [Skills, records and protection](docs/redesign/C8-INDUSTRY-HANDOFF-2026-10-29.md), [source/rights scopes](docs/redesign/C8-INDUSTRY-SOURCES-2026-10-29.md), [topic registry](docs/redesign/TOPIC-REGISTRY.md) and [roadmap](docs/redesign/ROADMAP-2026-10-27.md). The October 29 content checkpoint deepens Factory reform, Tomioka and Hine with separately dated records, a supplied print/training family inquiry and four qualified modern component references. All prior full media and pixels remain exact; Tomioka gains one reviewed print. The following content-validation figures describe that local checkpoint; November 1 hosting is recorded separately above.

The integrated candidate gate passes **870 tests in 155 files** and the separate **511-test atlas run in 49 files**, all **33 journeys**, browser flows at **320/390/768/1440 pixels** and **223 image derivatives**. Atlas coverage is **66.62% statements / 67.57% lines / 65.86% branches / 53.95% functions**. JavaScript is **115,152 gzip bytes**. All six timing trials pass unchanged targets: maxima are **2,432 ms** useful text, **2,498 ms** illustration, **112 ms** search, **1,942 ms** index readiness, **85 ms** selection and **368 ms** dossier readiness.

All **64 PDFs / 1141 pages** pass rendered bounds, tagging, source checks and internal visual review: **60 readers / 644 pages**, **428 chapter pages**, **33 family sheets**, one A3 overview and **35 companion pages**. Against sealed Pacific, **1041 pages** match exactly, **0** match outside the footer area and **100** are new or changed and visually reviewed. Source checks cover **706 chapter records / 393 unique sources**, all reader bibliographies and family tasks, and **49 poster sources**. Tags do not establish PDF/UA conformance.

Current validation is in [the Industry receipt](output/c8-industry-2026-10-29/). Actual source/build and archive identities belong to its `SOURCE_STATE.json` and post-package `PORTABLE_RESULT.json`. The [preceding Pacific handoff](docs/redesign/C7-PACIFIC-EXCHANGE-HANDOFF-2026-10-29.md) and [receipt](output/c7-pacific-exchange-2026-10-29/) retain their own historical evidence.

## Run and explore locally

Fresh visits open the **Living timeline** at 200 CE. Move the time slider to preview a moment, select a case for its object and question, then use **Explore** to commit the date. **Compare this moment** opens **Meanwhile elsewhere**, with a world map and regional starting points; both views retain the chosen moment and story when returning from a dossier. **Refine view** contains chapter, region and full-history controls. The original gallery, complete chronology, chapter readings and source notes remain available. The October 30 interface changes preserve every existing content file; their scoped verification is in [the Living timeline receipt](output/living-timeline-2026-10-30/).

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

Content is authored in `scripts/redesign/`; `src/atlas` renders it. The inherited `src/data` remains research and is excluded from teaching runtime. All 1,274 legacy dispositions remain accounted for. Source locators, consultation scopes, media rights and checksums are retained in manifests and dated packets. Content status “published” means included in this local build. Revisioned media and journey records retain immediate navigation/provenance with visible load failure/retry; full corpus and print remain complete.

Independent historian/community assessment, real adult/family use, human screen-reader testing, physical-device behavior and physical print inspection remain open. Internal author-team source review and automated checks do not supply those acceptance results. Switching models alone does not supply them. Abstract-only, inaccessible, uncollated, image-date and source-copy uncertainties remain explicit.

Authorized local implementation continues with a focused startup-performance and presentation-copy pass, keeping the same phone targets, fonts, source records and historical dates. The finite minor copy observations are recorded in `output/c8-industry-2026-10-29/copy-followups.json`. Prepared content packets and remaining registry tasks follow; they are separate from this checked candidate. Broader simultaneous-world coverage, phone time exploration, explanatory graphics, learning and glossary design, notebook revision, broader reader design and human acceptance remain materially open. The entire roadmap is not complete.

Earlier receipts and ZIPs preserve their historical bytes and validation. Local-only references and research remain intact. The November 1 Vercel deployment contains only the tested static app and its hosting configuration; the Git working tree remains uncommitted and was not pushed.
