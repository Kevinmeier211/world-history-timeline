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
