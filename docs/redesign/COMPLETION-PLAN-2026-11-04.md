# Chronos Atlas completion plan

Date: 4 November 2026. Status: implementation in progress. Owner scope change on 4 November: H01 mandatory formative reader sessions and the dependent H02/M2 formative gate are removed. This records a scope decision, not evidence of reader testing. Independent historical, final reader, device/accessibility and physical-print gates retain their separately defined scopes.

The objective is a coherent, dependable history atlas in which adults and families can orient themselves in time and place, investigate evidence, compare historical experiences, retain their thinking, and return to continue learning. The accepted family audience is **ages 10–14 with an adult**. Adult self-directed reading is a separate supported track.

This plan covers the whole improvement program: existing content, regional and chronological breadth, exploration, reading, learning, notebook reliability, visuals, discovery, accessibility, engineering, print, independent review, and delivery. Priority determines order; it does not remove lower-priority requirements from the finish line.

## 1. Baseline and fixed scope

The 4 November assessment found 77 dossiers, 527 sources, 105 media records, 76 reference contexts, 76 authored comparison pairs, 33 journeys, eight chapters, 82 glossary terms, and 38 place studies. All 77 dossiers have expanded reading and family activities. Seven have no attached image. The current named claim register contains 114 claims, all labelled as Codex source consultation/self-review rather than independent historical approval.

The standard check passed 936 tests in 162 files. The separate atlas run passed 577 overlapping tests with 69.94% statement coverage. Current-build browser checks passed at 320, 390, 768, and 1440 CSS pixels; 47 Axe reports had no violations. A separate two-tab notebook experiment reproduced an overwrite: the second tab's save removed the first tab's new note from persistent storage. These facts define the starting point, not future acceptance evidence.

Baseline evidence: [assessment receipt](../../output/assessment-2026-11-04/inventory-and-findings.json), [notebook reproduction](../../output/assessment-2026-11-04/two-tab-notebook-result.log), [standard check](../../output/assessment-2026-11-04/check-final.log), and [atlas tests](../../output/assessment-2026-11-04/atlas-tests.log).

### The finite content program

| Unit                       | Required final scope                                        | What counts as completion                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing dossiers          | All 77                                                      | Each passes the editorial, source, navigation, reading, and activity rubric; necessary repairs are applied or the unsupported material is explicitly held |
| Chapter introductions      | All eight                                                   | Each establishes its chronological frame, useful questions, internal diversity, main changes, and starting routes                                         |
| Chapter–region orientation | All 56 combinations of eight chapters and seven regions     | Each provides a substantive, dated, source-backed orientation to named settings; a populated cell or a gap label alone does not pass                      |
| Curated snapshots          | 12 dates × seven regions = 84 entries                       | Every entry offers an appropriate historical frame, its evidence and date limits, and a useful next destination                                           |
| Thematic routes            | 12 themes                                                   | Each has a usable, source-grounded route through selected material; existing journeys may satisfy it                                                      |
| Existing journeys          | All 33                                                      | Metadata, stop order, transitions, evidence task, return path, and resume behavior pass review                                                            |
| Chapter entry routes       | Eight short activities and eight longer routes              | One adult-guided 5–10 minute entry and one approximately 20–40 minute route per chapter, reusing existing material where suitable                         |
| Existing media             | All 105 records and every shipped derivative                | Identity, dates, rights, attribution, fidelity, accessible description, and display suitability are reviewed                                              |
| Existing visual gaps       | Seven named dossiers                                        | Each receives a useful sourced visual or an intentionally text-based evidence treatment with a documented reason                                          |
| Place studies              | All 38, plus geographic orientation for every dossier       | Locators, dates, precision, legends, and accessible alternatives are checked                                                                              |
| Glossary                   | All 82 existing terms plus terms essential to added content | Definitions, context, reading links, and return behavior pass review                                                                                      |
| New standalone dossiers    | At most 16 in this program                                  | Select exact research briefs during C02; use reference/context improvements when a new case is unnecessary                                                |

The 56 orientations and 84 snapshot entries are **acceptance units**, not a requirement to write 140 separate essays. A well-scoped reference record may serve several units when its supported dates and geography genuinely fit. Existing cases and contexts should be reused. Source count, image count, and word count are not quality targets.

Preserve the 3300 BCE–2000 CE scope, all valid existing IDs/deep links, original case intervals and uncertainty, source locators, notebook compatibility, legitimate media credits, and the 1,274-entry legacy disposition ledger. Alternative date models must not become successive phases. View windows must not change historical dates.

This program retains static delivery and browser-local learning records. Accounts, cloud collaboration, social features, pre-3300 BCE/post-2000 expansion, an unrestricted legacy import, and a framework replacement are separate projects. A hosted release in this plan retains the current sign-in protection; changing the audience/access policy is a separate decision.

### Completion states

- **Local candidate complete:** all required implementation/editorial tasks and local checks pass on an identified build; external human gates may still be pending.
- **Reader and reviewer validated:** the specified family/adult, accessibility, physical-device, physical-print, and independent historical review gates pass on that candidate or a traceable repaired successor.
- **Hosted release verified:** the accepted candidate is deployed when requested, its served assets are verified, and rollback and maintenance records are complete.

The whole program is complete only at the third state. If a human reviewer, device, or source is unavailable, record the exact open gate. Do not replace it with an automated check or rename an unresolved requirement as complete.

## 2. Execution and responsibility

Use one implementation owner for each change and a distinct reviewer where the gate requires independence. Roles below are responsibilities to assign, not people who have already agreed to work.

| Role                            | Responsibility                                                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implementation owner            | Application, data delivery, storage, migration, tests, build and release tooling                                                                           |
| Historical/editorial owner      | Research briefs, source consultation, explanations, dates, regional scope and content reconciliation                                                       |
| Learning/design owner           | Entry flows, family/adult reading, activities, journeys, pilot materials and revisions                                                                     |
| Independent historical reviewer | Review within documented topic/language expertise; identify errors, omissions and unsupported interpretation                                               |
| Accessibility/reader evaluators | Observe real use and assistive-technology behavior; record failures and recheck repairs                                                                    |
| Kevin                           | Resolve product/scope tradeoffs, confirm the intended audience, arrange or authorize human participation, and make release/access decisions when requested |

Keep at most two heavy local jobs running across all work. Use the existing resource launcher and worker caps. Automated browsers use Playwright-managed Chromium; additional WebKit/Firefox checks use managed test engines. Close only owned browser sessions and servers, including on failure. Do not enable VoiceOver on Kevin's Mac; screen-reader review is performed on an evaluator's configured device.

Each task receives a named owner, status, dependencies, changed files/records, acceptance evidence, and unresolved issues in the companion tracker. Statuses are `planned`, `in_progress`, `ready_for_review`, `accepted`, `blocked`, or `removed_by_owner`. A blocked item needs a specific dependency and the next action that would unblock it. A removed requirement retains the dated owner instruction and is never counted as passed.

Use a fresh evidence folder per milestone. Preserve earlier receipts. A claim that a milestone passes must identify source revision, content revision, test environment, and the actual artifacts checked.

## 3. Workstream B — establish a trustworthy current baseline

**Outcome:** a future contributor can identify the running product, its source, and remaining work in a few minutes. Owner: implementation, with editorial reconciliation. This is the first workstream.

- **B01** Record source and artifact identity. Inventory tracked and untracked application files, authored/generated content, public assets, private research, and receipts; preserve concurrent work. Compare the current source/build with the existing hosted staging record. Record commit plus dirty-file hashes where needed.
- **B02** Generate a current inventory and status page. Derive counts from the actual corpus; reconcile README, STATUS, CONTENT_COVERAGE, topic registry, and the November 1 hosting note. Preserve historical checkpoints with their dates rather than overwriting their claims.
- **B03** Separate source from local output. Define explicit handling for generated screenshots, build artifacts, archives, and local-only research; keep required provenance manifests versioned. Provide a safe, documented source checkpoint procedure that does not sweep private research into a commit.
- **B04** Freeze this program's acceptance register. Assign all tasks, the 56 orientation units, 84 snapshot entries, and 77 dossier audits stable identifiers. Record all current in-scope source/rights gaps and distinguish them from future expansion ideas.
- **B05** Capture a reproducible baseline. Document supported runtime versions and one clean candidate command; prove that a new temporary checkout/staging area can build and validate using documented inputs. Identify any generated asset that is currently supplied only from this Mac.

**Endpoint:** current counts agree everywhere designated as current; every shipped asset has an identified input or preserved source artifact; the source checkpoint excludes local-only material; one documented command produces a traceable baseline without a hidden dev server. Evidence: `baseline/current-state.json`, source manifest, reproducibility log, and reconciled entry documentation.

## 4. Workstream N — dependable notebook and return visits

**Outcome:** saved thinking survives realistic use, including multiple tabs, reloads, import conflicts, and storage failures. Owner: implementation. Depends on B.

- **N01** Implement conflict-safe persistence. Prefer transactional per-note storage with an explicit schema/migration contract; retain a compatibility adapter for version-1 exports. Evaluate browser support against the target device matrix before finalizing the storage implementation. Do not treat a storage-event listener alone as a concurrency solution.
- **N02** Migrate and recover existing records. Preserve original answers, creation dates, revisions, context, collections, and IDs. Detect malformed/unsupported storage, preserve the raw record for recovery, and offer export/recovery instead of silently treating corruption as a new empty notebook.
- **N03** Reconcile tabs and deletions. Define same-note edit conflicts, distinct-note saves, delete-versus-edit conflicts, undo, and repeated imports. Preserve competing revisions; use deletion/version information so merging cannot silently resurrect or erase a note.
- **N04** Persist learning drafts and resume state. Recover a partially written response after a reload; keep drafts associated with the correct note/investigation. Store the last meaningful reading/journey position with a visible reset action and a local-storage explanation.
- **N05** Improve notebook use. Provide clear collection filtering, editable titles/questions, dated reflection, source return, backup/export and import preview. Keep export usable when persistent storage is unavailable. Show a truthful saved/unsaved state.
- **N06** Verify the persistence contract. Cover two pre-opened tabs saving different notes; simultaneous edits to one note; delete versus edit; draft reload; migration; repeat import; conflicting import; invalid import; storage quota/unavailability; and restoration in a fresh browser context.

**Endpoint:** no silent data loss in any listed scenario; both notes from the reproduced failure survive reload/export/import; conflicts remain inspectable; failed storage is visible; existing version-1 files still import without losing fields. Evidence: migration fixtures, concurrency tests, real export/import files, and browser receipts. The original first answer must remain distinct from later reflection.

## 5. Workstream U — a clear first session and reading experience

**Outcome:** both reader groups can choose a useful starting point and move through the atlas without learning its internal organization. Owner: learning/design and implementation. Depends on B; final integration depends on N and T.

- **U01** Implement three entry choices: explore a moment, start a short investigation, and continue a previous visit. Show an explanatory first-visit introduction once, with an obvious way to reopen or dismiss it. A fresh visitor must see substantive historical material immediately.
- **U02** Make scope visible. Keep the chosen year, chapter/range, region filter, and return path understandable. Put full-history access and direct year entry within one obvious action on a phone. Resolve the slider preview/commit interaction through a prototype test, then use the same behavior in both timeline and world views.
- **U03** Refine phone and desktop composition. On a 390×844 screen, show the selected historical question, its date, and a useful action without requiring the reader to scroll through repeated introductions. Provide a visible invitation to regional comparison. Use a focused time-slice/list view on phones and a fuller proportional overview on desktop.
- **U04** Standardize dossier reading. Every case has a concrete opening, orientation, readable main explanation, optional deeper material, evidence access, a short activity, and clear next destinations. Keep the reader's place after glossary, image, source, comparison, and notebook detours. Surface a consequential uncertainty beside the relevant claim.
- **U05** Verify all navigation states. Test deep links, old links, Back/Forward, copied URLs, changed filters, expired/missing IDs, loading failures, retry, no matching material, and unavailable images. Ensure state transitions do not discard drafts or silently switch the chosen historical moment.

**Endpoint:** all named flows work at the target widths and with keyboard operation; pilot readers can begin without instruction; a reader can explain the current date/filter and return from a detour to the same context. Evidence: before/after flows, state-transition fixtures, screenshots, and the H pilot results. Correct the contradictory footer statement about proportional timeline bars during this work.

## 6. Workstream T — time, world context, comparison and geography

**Outcome:** a chosen date yields an intelligible, honestly scoped view across regions. Owner: implementation and historical/editorial. Depends on B; uses C content.

- **T01** Implement an explicit snapshot model. Each regional entry identifies its reference frame, supported interval, summary, relevant case/evidence, citations, uncertainty, and next reading. Keep case dates, evidence creation/depiction dates, reference periods, and the selected view year as separate fields.
- **T02** Promote context into the primary world view. Show an appropriate regional frame before secondary nearby readings. Label a noncontemporary suggestion with its actual dates and temporal distance. For arbitrary dates, distinguish a supported spanning frame from a nearby suggestion and a coverage gap. Never widen dates to populate the screen.
- **T03** Complete the 12 curated snapshots. Use the eight existing chapter anchors plus 1800, 1900, 1950, and 2000 CE: **2400 BCE, 1200 BCE, 300 BCE, 200 CE, 850 CE, 1250 CE, 1600 CE, 1800 CE, 1900 CE, 1947 CE, 1950 CE, and 2000 CE**. Each has seven accepted regional entries. The close 1947/1950 pair deliberately preserves different independence and transition contexts.
- **T04** Make timeline and map semantics consistent. Distinguish cases and wider contexts; visibly explain uncertain/clipped dates, selected year, and approximate locations. Provide zoom/fit/reset, legible place labels, equivalent named-place lists, accessible cluster selection, and regional focus. Route lines require dated evidence and an explicit statement of schematic or uncertain portions.
- **T05** Audit all 76 comparisons and every dossier's default comparison action. Each supported pair has a clear question, grounded dimensions, similarities/differences, evidence limits, and exact return state. Explain an asymmetric pair honestly. Provide suitable authored alternatives where a default would otherwise produce an avoidable dead end.

**Endpoint:** all 84 snapshot entries pass editorial and interface checks; no curated anchor relies solely on a distant case to represent a region; arbitrary-year fallback is explicit; all supported comparison defaults lead to useful content; map and list routes are equivalent. Evidence: `snapshots/acceptance.json`, date-boundary fixtures, comparison inventory, and cross-view browser scenarios.

## 7. Workstream C — complete the selected historical framework

**Outcome:** the eight chapters form a substantive, connected educational framework across all seven regions. Owner: historical/editorial, supported by implementation. Depends on B. New research claims are verified during execution; the topics below are research briefs, not already-verified accounts.

- **C01** Audit all 77 dossiers against the rubric below. Use the existing topic registry as input, reconcile completed work, and freeze a finite defect list. Recheck every existing named claim and identify consequential uncaptured claims in the main/deeper explanations. Record exact source support or a specific unresolved limitation.
- **C02** Freeze the 56 regional orientation briefs and any new case briefs. Choose bounded places/periods/questions, suitable sources, voice/interpretation gaps, visual needs, and supported links to existing content. Select at most 16 new standalone cases; list exact IDs and scope before authoring. Additional breadth should primarily come from reference explanation and connections among existing cases.
- **C03** Complete C1–C2. Address early communities, food/water/work, settlement diversity, records and resources, exchange, and distinct forms of change. Resolve the absent C1 Southeast Asia/Oceania orientation and the weak C2 European framework with sourceable, explicitly dated material.
- **C04** Complete C3–C4. Strengthen political and intellectual change, household/institutional life, regional transitions, and the difference between comparison and demonstrated contact. Preserve the distinction between whole-society orientation and a narrow portrait, inscription, vessel, or administrative case.
- **C05** Complete C5–C6. Provide connected regional orientations for religious/intellectual institutions, cities, agriculture, movement, political forms, and change. Address weak European, African, South Asian, and steppe connections through bounded source-backed frames; preserve continuing Indigenous histories and diverse Oceanian settings.
- **C06** Complete C7. Explain production, exchange, empire, coercion, religion, communication, and diplomacy through named settings. Extend frameworks around existing work on Indigenous communities, Kongo/Benin, Mughal books, Ottoman/Safavid workshops, Pacific exchange, and Banda. Keep each trade/forced-movement connection tied to its actual evidence.
- **C07** Complete C8 and the 2000 endpoint. Provide usable 1800, 1900, 1947, 1950, and 2000 regional contexts, including industrial/labor change, colonial power and resistance, political transitions, wars and their consequences, science/medicine/communication, and everyday life. Existing narrow cases must not stand in for entire regional modern histories. Prepared war subcase IDs remain unadopted until their source gaps are resolved.
- **C08** Close the thematic and editorial audit. Map 12 themes to usable routes: governance/power; food/water/ecology; households/gender; childhood/education; labor/coercion/slavery; migration/diaspora; religion/intellectual life; science/medicine/technology; art/communication; trade/intermediaries; war/resistance; law/citizenship/exclusion. Each route explains a question through at least three substantive stops, normally across more than one region or period; document a substantive reason for any narrower route. Complete review of all 82 glossary terms and essential new vocabulary.

### Editorial rubric for every existing and new dossier

1. **Orientation:** a reader can identify the people/place, period, question, and relation to the chapter.
2. **Explanation:** the main account explains at least one mechanism or process through named actors, institutions, practices, or material circumstances; generic caveats and labels do not substitute.
3. **Evidence:** a consequential claim links to a suitable source and locator. Source purpose, mediation, access limitations, and alternative interpretations appear where relevant.
4. **Chronology/geography:** cases, contexts, objects, depictions, dates of modern reproductions, and locators retain their distinct meanings. Continuing societies are not ended at a chapter boundary.
5. **Perspective:** distinguish whose account survives, whose experience is missing, and what the selected evidence can support. Avoid treating an elite object or an imperial account as universal testimony.
6. **Reading:** a family can use the short entry without needing all deeper material; an adult has a coherent deeper route. Definitions and explanations avoid unexplained specialist vocabulary.
7. **Activity:** the task is answerable from supplied material, includes an evidence-based response/rubric, and does not require guessing hidden facts.
8. **Connections:** at least one appropriate next destination and one meaningful comparison or context link; a historical contact claim requires its own support.

### Chapter workpacks

| Chapter          | Specific completion work                                                                                                                                              | Required demonstration                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| C1 3300–2000 BCE | Regional settlement and household frameworks around Uruk, Nile/Nubian contexts, Dholavira, Liangzhu, Caral and Skara Brae; dated Southeast Asian/Oceanian orientation | Explain how different evidence reveals work, food/water arrangements and community organization without a universal ladder of development |
| C2 2000–1000 BCE | Distinct Aegean/European, Nile/Nubian, West Asian, South Asian, Shang, American and Lapita-period regional sequences                                                  | Compare two supported forms of exchange or disruption and explain the limits of linking them                                              |
| C3 1000–1 BCE    | Broader contexts around Assyrian/Persian, Greek/Roman, South Asian, Chinese, Nile, American and Southeast Asian material                                              | Use a document/object to distinguish a ruler's claim, institutional practice and surviving evidence                                       |
| C4 1–500 CE      | Contexts around Rome/Han, Aksum, West/Central and South Asian settings, American communities and Southeast Asia                                                       | Explain a similarity and difference between contemporaries and identify whether evidence establishes contact                              |
| C5 500–1000 CE   | Regional transitions, urban/rural work and religious/intellectual institutions across all seven regions                                                               | Trace change within one place and make a grounded comparison elsewhere without claiming a shared universal transition                     |
| C6 1000–1500 CE  | Wider African, European, South Asian and steppe frames connected to existing cities, knowledge, landscapes and Indigenous/Oceanian cases                              | Explain an urban, agricultural, political or knowledge system using a map plus textual/material evidence                                  |
| C7 1500–1800 CE  | Regional production and power, Atlantic/Indian/Pacific systems, Indigenous diplomacy, religion and print, diverse Asian political settings                            | Follow one evidenced connection, name an intermediary and explain work/coercion as well as goods                                          |
| C8 1800–2000 CE  | Regional modern histories, industrial and colonial change, independence, war, rights, science and life after 1950                                                     | Use a sequence and contrasting sources to explain a change and distinguish a formal promise from its implementation                       |

The companion tracker contains a proposed question and current case inventory for every one of the 56 cells. These questions constrain research scope; they do not claim complete regional histories.

**Endpoint:** all 77 audits and all 56 regional orientations pass; eight chapter introductions and 12 thematic routes are usable; all consequential new/changed claims are sourced; no release-critical source gap is disguised as a verified account. Source-access failures lead to a narrower supported statement, a suitable replacement, or a visible held requirement. They do not justify invented text or a superficial coverage checkmark. Independent review remains the separate H gate.

## 8. Workstream V — evidence that readers can see and inspect

**Outcome:** images, maps, diagrams and documents explain historical questions at phone, desktop and print sizes. Owner: editorial/visual and implementation. Depends on C briefs; existing-asset audit can begin after B.

- **V01** Review all 105 media records and their shipped derivatives. Check source identity, object date, depicted date, reproduction date where known, rights, licence/credit, crop, resolution, alt text, and relevance. Preserve original reviewed assets and record replacements with provenance.
- **V02** Resolve the seven visual gaps individually: Banda, Polynesian voyaging, factory reform, Haiti, Te Tiriti, World War II, and Sputnik. First consider a rights-cleared document/map/object or a reproducible explanatory graphic. If a text source is the best evidence, provide a readable source card/transcription and explain that choice in the editorial ledger. Do not add decorative imagery merely to remove a missing-image flag.
- **V03** Complete geographic explanation. Audit all 38 existing place studies; every dossier must have usable regional orientation and a named accessible locator. Every chapter has at least one explanatory map/plan where geography helps answer its central question. Verify routes, place uncertainty, labels, scale claims, and dates.
- **V04** Complete a bounded inspection set. Select 12 evidence exemplars, spread across all eight chapters, for closer inspection through appropriate annotation, transcription, multiple views, or a diagram. Reuse existing good examples. Each marked detail has a source-grounded explanation and a text equivalent.
- **V05** Verify the actual display. Inspect every changed visual at 390-pixel width, desktop, dark appearance, enlargement, and intended print size; inspect every unchanged derivative for decoding/dimensions and sample its display by media type. Document unsuitable low-resolution scans and provide text alternatives instead of implying extra detail.

**Endpoint:** all seven gaps have accepted dispositions; all media/rights records pass; all eight chapter maps and 12 inspection exemplars work; no essential explanation depends on hover, color alone, or an unreadable scan. Evidence: asset manifest, rights register, visual-review contact sheets, and inspection accessibility tests.

## 9. Workstream L — activities, journeys and a learning loop

**Outcome:** an adult or adult-guided 10–14-year-old can start, investigate, explain, save and revisit. Owner: learning/design with editorial review. Depends on N, U, and chapter content.

- **L01** Define a chapter learning contract. For each chapter, write one short-route outcome and one deeper-route outcome with an observable response: locating, sequencing, comparing, explaining a mechanism, or judging a claim from evidence.
- **L02** Deliver eight short entry activities. Aim for 5–10 minutes of adult-guided use, with a visible object/document/question, a small sequence of actions, enough source material on screen, and a facilitator answer guide. Estimated durations stay labelled until tested.
- **L03** Audit all 33 journeys and identify eight chapter routes. Check exact stop order, historical versus thematic ordering, time/place transitions, source detours, supported comparisons, duration, prerequisites, and the final question. New journeys are added only where existing ones cannot meet a defined learning contract.
- **L04** Make selection and continuation useful. Filter journeys by time available, theme, period and reading track. Feature three introductory choices. Show resumable progress and a clear next step; allow reset. Keep progress local and distinct from evidence of mastery.
- **L05** Add varied, evidence-based responses and revisits. Across the eight chapter routes, include at least four forms: observation/annotation, sequencing, comparison, and supported explanation. Supply task-specific feedback/rubrics, save first and later thinking, and include a revisit prompt that asks the learner to apply the idea to a different item. Avoid reducing historical uncertainty to arbitrary quiz scoring.

**Endpoint:** eight short activities and eight chapter routes work end to end; all 33 journeys have accepted metadata and navigation; every required response can be judged from supplied evidence; resume and reflection survive the N tests; H participants can complete and explain the sampled activities. Evidence: outcome/rubric matrix, route fixtures, facilitator sheets, and pilot observations.

## 10. Workstream D — search, glossary and discovery

**Outcome:** readers can find known subjects and discover relevant ideas without understanding internal IDs. Owner: implementation and editorial. Depends on B; reindex after C/L changes.

- **D01** Improve search result explanation. Show why a result matches through a concise excerpt or matched field; retain separate subject, journey and glossary groups. Curate aliases, alternative spellings and important conceptual synonyms; do not imply that an unresearched topic is covered.
- **D02** Finish glossary integration. Review all 82 definitions, necessary additions, culturally situated terminology and in-text matching. Definitions return focus and reading position correctly; distinguish genuinely different historical uses of a term rather than forcing one global meaning.
- **D03** Establish a 40-query acceptance set. Include 10 names/aliases, 10 concepts, eight dates/BCE–CE cases, six spelling/diacritic variants, and six deliberate coverage gaps. Record expected relevant results and acceptable alternatives before implementation; validate keyboard and screen-reader result announcements.

**Endpoint:** all 40 queries produce the expected type of result or honest gap explanation; no truncation hides further matches; glossary detours preserve state; search source excerpts remain faithful to indexed text. Evidence: committed query fixtures and browser receipts.

## 11. Workstream E — maintainable architecture and meaningful verification

**Outcome:** future changes have clear ownership and can be verified without reconstructing historical implementation order. Owner: implementation. Begins after B; refactor incrementally alongside product work.

- **E01** Extract application responsibilities. Separate navigation/history and focus orchestration, notebook persistence, data-loading recovery, and shell presentation from the large App component. Define the state transition contracts first; migrate one responsibility at a time.
- **E02** Simplify content assembly. Introduce clear ownership for dossier/reference/source records and make transformations explicit and inspectable. Migrate one chapter first and compare generated records/bytes; then apply the proven pattern to the remaining chapters. Preserve citation scopes and historical revisions. Treat an intentional editorial change separately from a structural refactor.
- **E03** Separate legacy and current product gates. Retain useful legacy tests with clear scope, but make current-atlas tests/coverage the release-facing report. Add focused regressions for actual user-state failures, especially concurrent notebook changes, sparse-date contexts, resume, cross-view return and malformed/mixed data.
- **E04** Guarantee cleanup and isolated execution. Add failure-safe cleanup to every owned browser/context/server script. Use isolated ports/report directories. Ensure screenshots and receipts cannot accidentally break source-format checks. Preserve two-worker/resource limits and managed browsers.
- **E05** Establish a reproducible change gate. Run type/lint, data/citation contracts, targeted unit/integration tests, core browser journeys, and bundle checks from a fresh source checkout with documented assets. Add a checked-in CI workflow or equivalent repeatable runner; enabling external CI integration is a deployment/configuration task, not a prerequisite for local reproducibility.

**Endpoint:** current-atlas reports are distinct from legacy coverage; new storage/navigation contracts are directly tested; every browser script cleans up on injected failure; content ownership is documented; clean builds do not require this workspace's incidental files. Numeric coverage alone does not pass the gate. Evidence: architecture notes, migration comparisons, isolated-run receipts, and cleanup failure tests.

## 12. Workstream A — accessibility, physical devices and performance

**Outcome:** the principal reading and learning flows are usable with keyboard, assistive technology, touch, zoom and constrained delivery. Owner: implementation plus human evaluators. Depends on stable U/T/L; checks run throughout.

- **A01** Build a WCAG 2.2 AA checklist for the actual flows. Cover headings/landmarks, labels, focus visibility/order/restoration, modal isolation, errors/status, contrast, non-color meaning, targets, keyboard alternatives, text scaling and reflow. Record applicable criteria and evidence instead of inferring conformance from Axe alone.
- **A02** Execute the automated matrix. Managed Chromium at 320×700, 390×844, 768×1024 and 1440×900; additional managed WebKit and Firefox for core reading, dialogs, storage, search and navigation. Include light/dark, reduced motion, keyboard-only, loading/failure states and 200%/400% zoom/reflow checks. Measure actual zoom separately from viewport emulation.
- **A03** Execute human/device checks. At least one physical iPhone/Safari and one physical Android/Chrome session; one tablet session; one experienced screen-reader evaluator using their configured system; and one keyboard/zoom-focused evaluator. Use the same critical tasks as H. Do not enable VoiceOver on Kevin's computer.
- **A04** Preserve performance budgets and verify hosted behavior. Retain the existing 12 cold-cache local trials across gallery/timeline and desktop/throttled-phone profiles: useful text, illustrated view, full search readiness and dossier readiness ≤2500 ms; search opening and selection ≤200 ms. Preserve the 400 KB gzip JavaScript ceiling and record changes from the current approximately 120 KB total. Track transfer sizes and layout shifts. Test the hosted candidate separately; lab timing is not field Core Web Vitals evidence.

**Endpoint:** all automated critical flows pass with no unresolved Axe violations; human/device evaluators complete critical tasks without unresolved task-blocking barriers; every applicable AA criterion has a recorded result or a specifically explained open issue; existing timing budgets pass without relaxed thresholds. Report a WCAG conformance claim only if the complete scoped evaluation supports it. If sufficient consented field data later exists, use the published 75th-percentile LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 targets; field instrumentation is not silently introduced.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C guidance on involving users](https://www.w3.org/WAI/test-evaluate/involving-users/), and [Web Vitals metrics and field thresholds](https://web.dev/articles/vitals).

## 13. Workstream P — practical print and portable delivery

**Outcome:** a reader can obtain a useful small handout, a complete chapter, or an offline atlas without navigating large unexplained files. Owner: implementation, editorial and visual review. Depends on content/learning freeze.

- **P01** Organize the export catalog. Offer individual dossier readers, eight chapter bundles, individual journey/family sheets, eight short activity sheets, and the overview/companion. Reuse renderers; label page count, file size, intended paper and revision before download. Preserve full compilations as optional downloads.
- **P02** Make ordinary downloads manageable. Target individual short sheets ≤2 MB, dossier readers ≤5 MB and chapter bundles ≤10 MB. Optimize image reuse, embedding and export composition; split at meaningful boundaries if needed. An exceptional source scan may exceed the target only with a documented reason and a smaller usable companion. Do not blur evidence or shrink text to meet a byte target.
- **P03** Verify print substance and layout. Check every final PDF for correct text, citations, links, bounds, paper sizes and nonblank output; render every changed page and inspect representative unchanged pages by template. Verify reading order/tagging without equating tags with PDF/UA. Physically print an overview, image-rich reader, map/document reader, family sheet and chapter sample; inspect legibility and grayscale usability.
- **P04** Verify portable use. Produce a versioned static package with a loopback launcher, included content/media/fonts/exports, manifests and checksums. Extract it fresh, block external requests, and exercise exploration, reading, local notebook, internal search and local exports. Explain which external source links require internet and how notebook origins affect transfer.

**Endpoint:** the export catalog is accurate; common downloads meet the stated budgets or have accepted specific alternatives; changed pages and physical samples pass; a fresh offline package works without the development workspace. Evidence: PDF manifest, rendered review, physical-print checklist, archive hashes and extraction receipt.

## 14. Workstream H — independent review and observed learning

**Outcome:** the release has evidence of real usability and a clearly bounded independent historical review. Owner: learning/design, reviewers, and Kevin for participation arrangements. Prepare early; final acceptance follows content/interaction freeze.

- **H01 — removed by owner, 4 November 2026.** The required three-adult/three-family-pair formative pilot is no longer a completion requirement. Keep the prepared task cards as optional evaluation material; do not arrange sessions or wait for them.
- **H02 — dependent formative gate removed.** There are no required formative observations to collect or reconcile. Defects actually found through implementation, editorial review or the separately specified final review still require correction and verification.
- **H03** Obtain a defined independent historical review. Review at least 12 dossiers: one from each chapter plus four selected for disputed dating, translated/mediated testimony, colonial/Indigenous interpretation, or traumatic modern history. Include the 12 snapshot overviews and their 84 entries in the review packet, distributed among reviewers with suitable expertise. Record actual review scope; do not imply that one reviewer certifies all regions or all 77 dossiers. Add relevant community-informed perspectives for selected living-community histories.
- **H04** Run a final formative acceptance round. Use five adult readers and five adult–child pairs; at least three participants/pairs in each group are new to the prototype. Sample every chapter across sessions, with each group covering ancient and modern material. At 7–14 days, invite a short return visit from at least three adults and three pairs to evaluate resume and retained understanding.
- **H05** Close the human acceptance register. Resolve every critical/high finding and retest affected tasks. Publish actual denominators, assistance given, failures and scope limits in the internal receipt. A participant absence, unavailable reviewer or missing follow-up remains pending rather than passed.

### Final reader tasks and proposed acceptance criteria

| Task                   | Criterion for this formative release decision                                                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choose an entry        | At least 4/5 in each reader group reach a substantive activity within 60 seconds without moderator navigation help                                                                                              |
| Orient in time/place   | At least 4/5 in each group correctly state the chosen period and region and distinguish case dates from object dates                                                                                            |
| Compare contemporaries | At least 4/5 in each group identify one supported similarity/difference and avoid inferring contact from shared dates alone                                                                                     |
| Use evidence           | At least 4/5 in each group support an explanation with a supplied source/detail and state a relevant limitation                                                                                                 |
| Navigate a detour      | At least 4/5 in each group return from source/map/glossary/comparison to the intended reading location without moderator help                                                                                   |
| Save and resume        | All ten groups/readers preserve a saved answer and retrieve it after reload; no data loss is acceptable                                                                                                         |
| Delayed revisit        | All six follow-up participants/pairs find the saved investigation without moderator navigation; at least 5/6 give one accurate explanation supported by evidence and distinguish it from their earlier thinking |

These small-sample thresholds are product acceptance targets, not statistical proof of educational efficacy. Family responses may be collaborative; record the adult's assistance. Moderators use task-specific rubrics and record actual elapsed times rather than coaching toward a pass.

**Endpoint:** the final reader round and required delayed followups are documented, required follow-ups occur, the independent review packet is reconciled, A human-device/accessibility gates pass, and no critical/high issue remains. Unavailable external acceptance blocks the validated-release state, while unrelated local work can continue.

## 15. Workstream R — release, rollback and maintenance

**Outcome:** the accepted version is identifiable, recoverable and maintainable. Owner: implementation and Kevin for release decisions. Depends on all required workstreams.

- **R01** Freeze the candidate. Identify exact source/content/asset revisions and all intended files. Run the full current candidate gate once on the frozen state, including appropriate PDF/package checks. If a repair changes relevant behavior or content, invalidate and rerun the affected evidence before signing the gate.
- **R02** Prepare a reviewable release package. Include release notes, current inventory, known low-priority limitations, human review scopes, verification receipts, downloadable artifacts, and a rollback target. Preserve the current access policy and state exactly what would be deployed.
- **R03** Deploy when requested and verify served content. Stage only the intended static application and hosting configuration. Confirm the correct existing Vercel project/team and environment. Verify served index/data/media samples and all download manifests against the accepted artifact, plus the core hosted user flows. Metadata-only readback is not a served-byte verification.
- **R04** Prove rollback and restoration. Document the actual previous deployment and how to restore it. Test rollback in an isolated preview/staging workflow without disrupting the live site; verify compatibility with notebooks created by the new candidate or provide a supported export/recovery path.
- **R05** Establish a finite maintenance routine. Document checks after each content or code release, a monthly source-link/status scan with human review of consequential changes, and a quarterly content/learning backlog review. Define defect ownership and release notes. These are operating procedures; no scheduled automation or external notification is created by this plan.

**Endpoint:** the intended hosted version passes verification; rollback and notebook recovery are demonstrated; release identity is current; maintenance ownership/procedures are recorded. A completed local build alone does not satisfy this endpoint.

## 16. Milestones and explicit stop points

| Milestone                        | Required work                                                             | Demonstration and exit condition                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0 Baseline frozen               | B01–B05                                                                   | One current-state record, finite ledger, reproducible baseline and safe source boundary                                                                                               |
| M1 Reliable reader prototype     | N01–N06; U01–U05 initial prototype; T01–T02; E01 initial extraction       | Two-tab failure repaired; existing notebook migration passes; demonstrate Rome/Han around 200 CE and the dated Factory reform/Tomioka comparison, plus an honest sparse 1950 snapshot |
| M2 Product standard established  | C01–C02; L01; first V04 exemplars; D03 fixtures                           | Scope of all 56 orientations/new cases frozen; evidence and family/adult activity standards demonstrated. H01/H02 formative-session gate removed by owner.                            |
| M3 Content and learning complete | C03–C08; T03–T05; V01–V05; L02–L05; D01–D03                               | All 77 dossiers, 56 orientations, 84 snapshot entries, 33 journeys, eight short routes and eight deeper routes meet their contracts                                                   |
| M4 Local candidate complete      | Finish U/E/A automation; P01–P04 automated/rendered/package work; R01–R02 | Reproducible frozen build, browser/data/performance checks, complete print/portable package and review packet; P03 physical-print acceptance remains M5                               |
| M5 Human acceptance complete     | H03–H05; A03; P03 physical review; affected rechecks                      | Independent review reconciled; final reader and delayed-return criteria pass; device/accessibility/print issues closed                                                                |
| M6 Hosted release complete       | R03–R05                                                                   | Correct protected deployment verified, rollback/recovery demonstrated, maintenance handoff complete                                                                                   |

M3 content work can proceed by chapter while implementation work continues, once M2 has fixed the standard. Independent historical reviewers can examine completed chapters before M4, with version tracking. A final candidate must reconcile those earlier reviews with its actual changed content. The final H acceptance round uses the frozen or traceably repaired candidate.

### Batch and change control

- Use one chapter or one coherent interface/storage change per implementation batch, with its own evidence and unresolved issues.
- At M2, freeze the specific 56 briefs, selected new case IDs, 12 inspection exemplars, and 12 historical-review cases. Changes later require a recorded reason, effect on dependencies, and an explicit scope tradeoff; completion targets cannot silently shrink.
- Stop a research batch when its acceptance rubric passes. Do not keep adding sources, images or prose just to increase counts.
- A new problem is classified against the existing finish line. Necessary factual, data-loss, task-blocking or accessibility repairs enter the current batch; unrelated enhancements enter a separate backlog.
- No historical, family, accessibility, or public-release approval is inferred from an automated test result.

### Effort and scheduling

Use the following initial sizing for planning. A focused contributor-day means implementation, research, editing or review work by a qualified contributor; it is not a prediction of agent runtime. These are estimates, not deadlines or commitments by unassigned reviewers.

| Workstream                      | Initial effort range in focused contributor-days | Main uncertainty                                                                           |
| ------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| B Baseline                      | 2–3                                              | Reproducibility of existing generated assets                                               |
| N Notebook                      | 4–7                                              | Migration and concurrent deletion/edit semantics                                           |
| U Entry and reading             | 5–8                                              | Reader-observed navigation and comprehension problems                                      |
| T Time and world context        | 6–10                                             | Snapshot integration and date/geography edge cases; research is counted under C            |
| C Historical framework          | 35–60                                            | Access to sources and the amount of substantive repair/new explanation                     |
| V Visual evidence               | 10–18                                            | Rights, useful source resolution and need for original diagrams                            |
| L Learning routes               | 8–14                                             | Activity revision after actual family use                                                  |
| D Discovery                     | 3–5                                              | Synonym/definition editorial work and relevant-result expectations                         |
| E Architecture                  | 8–14                                             | Complexity of untangling assembly/state while preserving output                            |
| A Accessibility and performance | 5–8                                              | Device-specific failures and assistive-technology repairs                                  |
| P Print and portable            | 5–9                                              | PDF composition, image reuse and physical print findings                                   |
| H Human acceptance              | 6–10                                             | Preparation, moderation and analysis; specialist review time and scheduling are additional |
| R Release and maintenance       | 3–5                                              | Release reproducibility and notebook-compatible rollback                                   |

The total initial envelope is **100–171 contributor-days**, plus independent specialist review and any exceptional source acquisition. Workstreams overlap in calendar time when appropriate people are available; this total must not be presented as an elapsed schedule. M0 assigns task owners and estimates; M2 recalibrates the content/visual estimates after source access and the exact new-case list are known. The original effort envelope predates removal of H01/H02; it has not been re-estimated. An estimate outside this envelope must trigger an explicit scope/resource discussion, not silent deletion of acceptance criteria.

Milestone order and acceptance criteria are fixed here; calendar dates depend on assigned availability and reviewers. A delayed reviewer must not cause unrelated implementation or research to stop. The largest uncertainty is C/V, so complete the initial source-access inventory early rather than deferring it until the interface is finished.

## 17. Final acceptance checklist

- [ ] Current source, content, build, exports and hosted deployment have matching, inspectable identities.
- [ ] No silent notebook loss occurs in the concurrency, migration, failure and recovery scenarios.
- [ ] Both reader tracks have clear entry, reading, evidence, comparison, save and return flows.
- [ ] All 77 existing dossiers meet the rubric; all new material has the same source/review discipline.
- [ ] All eight chapters and 56 chapter–region orientations are substantive and scoped accurately.
- [ ] All 12 snapshots and 84 regional entries are useful without fabricated simultaneity or widened dates.
- [ ] All 76 existing comparisons and default comparison actions are reviewed and usable.
- [ ] All 105 existing media records and all derivatives have accepted identity/rights/display checks; seven visual gaps are resolved.
- [ ] All 38 existing place studies are checked; all dossiers have useful geographic orientation.
- [ ] Eight short family entries, eight deeper chapter routes, all 33 journeys, and 12 thematic routes meet their learning contracts.
- [ ] Glossary and all 40 search queries pass their tests and editorial checks.
- [ ] Current-atlas gates, cleanup tests, target browser/device/accessibility matrix and preserved performance limits pass.
- [ ] Print/export catalog, changed-page review, physical samples and fresh offline package pass.
- [ ] Independent review, family/adult sessions and delayed returns meet the recorded acceptance criteria.
- [ ] The intended protected hosted release is verified; rollback and notebook restoration are demonstrated.
- [ ] Every remaining item is explicitly outside this release or a documented low-priority limitation; no required endpoint is merely labelled deferred.

## 18. Supporting records

- [Implementation and coverage tracker](COMPLETION-TRACKER-2026-11-04.json) — task status, dependencies, current case inventory, regional research questions and snapshot entries. All implementation tasks start as planned.
- [4 November assessment](../../output/assessment-2026-11-04/inventory-and-findings.json) — current evidence and limits.
- [Existing topic registry](TOPIC-REGISTRY.md) and [topic plan](topic-plan.json) — source-specific remaining work, to reconcile rather than blindly repeat.
- [Earlier roadmap](ROADMAP-2026-10-27.md) — historical design intent and dated progress. This completion plan is the proposed sequencing/acceptance layer for the current request.
- [Hosting record](VERCEL-HOSTING-2026-11-01.md) — existing project identity and deployment artifact boundaries.
