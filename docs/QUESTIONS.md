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

Default applied: Omit the undated name and meet the family count with dated checklist rows, including group successors when the checklist names a group and two years (Central American states, 1821/1838). Those successor rows use `confidence: debated` and say the checklist did not name each state. Undated names skipped so far: Mixtec (T1.11), Thule (T1.12). Further names will be added here.

Affects tasks: T1.11–T1.27.
