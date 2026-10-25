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

Default applied: Omit the undated name and meet the family count with dated checklist rows, including group successors when the checklist names a group and a year band but not each state (Central American states, 1821/1838; African independence, 1950s–70s). Those successor rows use `confidence: debated` and say the checklist did not name each state. Undated names skipped so far: Mixtec (T1.11), Thule (T1.12), medieval Serbia (T1.18), Aragon, Castile, and Habsburg Austria (T1.19, no start year), Gaul (end only, 51 BCE) and Germanic tribes (T1.20), Sarmatians and Muscovy (T1.21, no start year), Xianbei and Chagatai (T1.23), Sri Lanka and Nepal (T1.24), Yangshao, Longshan, and Taiwan (T1.25). Further names will be added here.

Affects tasks: T1.11–T1.27.

## Q-05 — The Latin West checklist is shorter than the family minimum

Why it matters: T1.19 requires at least 45 `latin_west` polities. Appendix B's dated Latin West lines, plus the six migrated bundles, do not reach 45. Inventing foundation years for Aragon, Castile, or Habsburg Austria would be a new claim.

Default applied: Add every dated Appendix B line the v1 ids do not already occupy, and add a debated row only where two checklist dates leave an unnamed interval (West and East Francia, Spain after 1700, the Netherlands after 1795, Austria and Hungary after 1918, Germany in 1918–19, 1945–49, and after 1990, Italy in 476–493, the French Revolution and First Republic). Section 15 says to include modern UN members and to cluster micro-states. Belgium, Switzerland, and one micro-state cluster use 1800–2000 with `confidence: debated`. The note says 1800 is the plan's modern-era edge, not a founding year. Aragon, Castile, and Habsburg Austria stay omitted (Q-04).

Affects tasks: T1.19.
