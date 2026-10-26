# Questions for Kevin

Cursor logs a question here, applies the plan default, and continues. Do not block the run on these.

## Q-01 — UsefulCharts poster and Gemini PDFs are not in this environment

Why it matters: T0.03 asks for `docs/reference/usefulcharts-poster.webp`, `docs/reference/gemini/World_History_Timeline_8x11.pdf`, and `docs/reference/gemini/World_History_Timeline_Expanded_8x11.pdf`. Appendix C and T1.07 depend on the Expanded PDF for bibliography entries [1]–[37]. Appendix D is a side-by-side review against the poster.

Default applied: The directories exist. The three files were not invented, traced, or replaced with lookalikes. `docs/CURSOR_PLAN.md` was copied verbatim. Source records will be added only when a real URL is checked and resolves. Gemini table prose will be rewritten from the roster and the plan's own summaries, not reconstructed from a PDF we do not have. M1 scores Appendix D from the written checklist and our screenshots, and records that the poster image itself was unavailable.

Affects tasks: T0.03, T0.11, T1.07, T3.17, T6 era-note passes, T7 reference pages.

## Q-02 — Bibliography [1]–[37] was not reconstructed, and several hosts blocked this environment

Why it matters: T1.07 asks for the Expanded PDF's sources [1]–[37], plus 15 further museum, university, and handbook URLs that actually resolve. Inventing those titles or pasting URLs that did not answer would put false citations in `sources.json`.

Default applied: [1]–[37] are omitted. `sources.json` has 58 pages that returned HTTP 200 on 2026-10-25 (Louvre, Getty, Rijksmuseum, Cambridge Histories, Yale HRAF and eHRAF, UNESCO General History of Africa, Library of Congress, and the US, UK, French, German, and Japanese national archives, among others). These hosts answered 403, 429, or a challenge page and were left out: Met (`metmuseum.org`), British Museum, Smithsonian (`si.edu` and its museums), National Gallery of Art, Oxford handbooks and Oxford Research Encyclopedias, UNESCO World Heritage Centre, Encyclopaedia Britannica, Encyclopaedia Iranica, and Khan Academy. Empty `url` fields were not used as placeholders for sources we cannot name. Skeleton rows may point at the verified pages only as bibliography pointers and stay `verification: unverified`.

Affects tasks: T1.07, T1.08–T1.27, T6.09.

## Q-03 — Tag gemini-v1 has fewer routes and presets than Appendix E states

Why it matters: T1.09 says the migrated counts should match v1 at 58 nodes, 11 bands, 9 routes, 3 tours, and 16 presets. The tag `gemini-v1` actually contains 58 nodes, 11 cross-cutting bands, 6 routes, 3 tours, and 5 comparison presets.

Default applied: Migrate the rows that are on the tag. Do not invent three routes or eleven presets to hit the plan's numbers. Era-gutter periods in v1 (`early_bronze` through `modern_period`) stay out of the band list; the 11 bands are the cross-cutting set. Paleoclimate is 18 points, copied with `verification: unverified`.

Affects tasks: T1.09, T5.10, T5.11.

## Q-04 — Checklist names with no year span are left out

Why it matters: Appendix B names some polities without a start or end (Mixtec is the first). A skeleton still needs integer years. Guessing a span would be a new historical claim.

Default applied: Omit the undated name and meet the family count with dated checklist rows, including group successors when the checklist names a group and a year band but not each state (Central American states, 1821/1838; African independence, 1950s–70s). Those successor rows use `confidence: debated` and say the checklist did not name each state. Undated names skipped so far: Mixtec (T1.11), Thule (T1.12), medieval Serbia (T1.18), Aragon, Castile, and Habsburg Austria (T1.19, no start year), Gaul (end only, 51 BCE) and Germanic tribes (T1.20), Sarmatians and Muscovy (T1.21, no start year), Xianbei and Chagatai (T1.23), Sri Lanka and Nepal (T1.24), Yangshao, Longshan, and Taiwan (T1.25), Gojoseon (T1.26, legendary start, no year), Aboriginal Australia (T1.27, a duration of c.65,000 years, not a start and end). Further names will be added here.

Affects tasks: T1.11–T1.27.

T6.01 later added states Appendix B does not date, because that pass names them and the checklist is not a ceiling. The rows are Haiti, Cuba, the Empire of Brazil and the republic, Poland after 1795, Yugoslavia, Czechoslovakia, Turkey after 1922, a Gulf cluster, Afghanistan, the Central Asian republics, Sri Lanka, Nepal, Taiwan, Mongolia, Laos, Cambodia, Malaysia, and Burma after the Konbaung. Years are widely cited, `confidence` is approximate or debated, and `verification` is unverified. Pages were not opened. Mixtec, Thule, and the other undated names in the list above stay omitted.

T6.02 adds three more undated spans the pass names: Sweden 1523–1800, Denmark–Norway 1523–1814, and Saadi Morocco 1549–1659. The modern Scandinavian rows stay 1800–2000 placeholders. Pages were not opened.

## Q-05 — The Latin West checklist is shorter than the family minimum

Why it matters: T1.19 requires at least 45 `latin_west` polities. Appendix B's dated Latin West lines, plus the six migrated bundles, do not reach 45. Inventing foundation years for Aragon, Castile, or Habsburg Austria would be a new claim.

Default applied: Add every dated Appendix B line the v1 ids do not already occupy, and add a debated row only where two checklist dates leave an unnamed interval (West and East Francia, Spain after 1700, the Netherlands after 1795, Austria and Hungary after 1918, Germany in 1918–19, 1945–49, and after 1990, Italy in 476–493, the French Revolution and First Republic). Section 15 says to include modern UN members and to cluster micro-states. Belgium, Switzerland, and one micro-state cluster use 1800–2000 with `confidence: debated`. The note says 1800 is the plan's modern-era edge, not a founding year. Aragon, Castile, and Habsburg Austria stay omitted (Q-04).

Affects tasks: T1.19.

## Q-06 — Conquest, vassalage, and migration are not assigned yet

Why it matters: T1.28 asks for a cross-family pass that includes those types. v1 only stored untyped `parentIds`. A shared year is not a checked succession: Russian America ends in 1867 and Canada begins in 1867. Inventing conquest, vassalage, or migration would be a new claim.

Default applied: Same-family succession or split only when the predecessor ends on the successor's start year, or one continuous year later while no checklist row in that family is still current. That keeps the Zhou handoffs of 771/770 and 476/475, and it does not make Prussia a successor of Habsburg Spain or Thailand a successor of the VOC. Several meeting ends become one `disputed` relation instead of a guess, so a same-year neighbor can appear on that edge until a later pass removes it. gemini-v1 `parentIds` are copied as `cultural_continuity` only when the child's start or the parent's end lies inside the other lifetime ± 50. A year that sits in neither span is not invented. Nine equal Appendix B spans that were stored in two families are `cultural_continuity`. Mughal is not one of them: the v1 bundle starts in 1206 and the checklist row in 1526. Polities with no inbound relation get a reason that names the nearest rejected end. Nineteen v1 parent edges have no such year and are not copied.

Affects tasks: T1.28, T6 relation passes.

## Q-07 — 3300–2000 BCE stays under the §7 floor of 35

Why it matters: T1.29 and the P1 exit need every era bin to meet its §7 floor. After T1.28 that bin held 22 polities. The other seven bins already met their floors.

Default applied: Added Old Kingdom 2686–2181 BCE as its own row. The migrated `egypt_old_kingdom` bundle stays the wider Early Dynastic plus Old Kingdom ribbon. Added three intervals Appendix B bounds and does not name: Mesopotamia 2154–2112 BCE, Mesopotamia 2004–1894 BCE, and China 2300–1900 BCE. Each is `confidence: debated` and `verification: unverified`. That pass left the early bin at 26. Kevin then directed that Appendix B is a checklist, not a ceiling, and that at least nine real cultures whose widely cited spans fall mainly in 3300–2000 BCE be added as `approximate` or `debated` and `unverified`, using only source ids already in `sources.json`. Twelve were added: Majiayao, Longshan, Jemdet Nasr, Early Dynastic Mesopotamia, Early Cycladic, Corded Ware, Bell Beaker, Naqada III, Yamnaya, Kura-Araxes, Los Millares, and Ebla. Yangshao stays out: its usual span is mostly before 3300 BCE (Q-04). The early bin is 38. `ERA_FLOORS` stays 35. `scripts/era-floor.test.ts` locks 38 and an empty shortfall list. `v2-p1-done` stays untagged while layout continues on this branch.

Affects tasks: T1.29, T1.99, T6.06.
