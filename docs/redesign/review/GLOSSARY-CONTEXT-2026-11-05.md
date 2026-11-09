# Glossary context review — 5 November 2026

The autonomous D02 contextual pass is complete for the current 82-term glossary. One canonical definition was corrected: **provenance** now includes documented origins and previous locations alongside ownership, while explicitly distinguishing archaeological **provenience** and find context. Independent historian, language-speaker, legal-specialist and community review remains separate.

The item-level [JSON receipt](GLOSSARY-CONTEXT-2026-11-05.json) records every definition, a specific contextual finding, its assigned dossiers, exact inline annotations with their containing paragraphs, and the existing dossier citation trail. It distinguishes newly consulted evidence from previously authored case references. It does **not** claim that every underlying archival item, original-language text, full research paper or community practice was newly verified.

## Observed scope

| Check                                                                         | Result                      |
| ----------------------------------------------------------------------------- | --------------------------- |
| Definitions / dossiers                                                        | 82 / 77                     |
| Term–dossier assignments inspected                                            | 297                         |
| Fresh, explicitly scoped external source checks                               | 20 checks covering 23 terms |
| Actual inline annotations, using production matching                          | 140, covering 53 terms      |
| Definitions available only through word lists in current main/deeper passages | 29                          |
| Paragraphs reconstructed character-for-character                              | 619                         |
| Canonical definition changes / added terms                                    | 1 / 0                       |
| Existing glossary regression tests                                            | 5 passed                    |

The matcher is limited to each dossier's assigned terms, exact names and documented punctuation alternatives, once per main or deeper reading group. It deliberately does not stem plurals. Thus “demes,” “reliefs,” or “cache pits” do not become guessed singular links; their word-list entries remain available. No text was rewritten merely to manufacture a match. Browser focus, modal dismissal and human assistive-technology behavior are separate from this content receipt.

## Correction and disciplinary boundary

The previous provenance definition covered ownership only. That was too narrow for the Ojibwe dossier's use concerning a photograph's geographic attribution and for Getty's own account, which includes origins and earlier locations. The correction also fits the other current inline uses in Benin, Kongo and the Maya vessel. Provenance is assigned to 17 dossiers in total.

Getty's [collection-provenance guidance](https://www.getty.edu/museum/provenance/) was compared with the Archaeological Institute of America's [provenance/provenience entries](https://www.archaeological.org/programs/educators/introduction-to-archaeology/glossary/) and the NPS [archaeology glossary](https://www.nps.gov/subjects/archeology/glossary.htm). NPS uses a narrower ownership meaning for provenance. The revised wording therefore makes the distinction visible instead of asserting that every discipline uses the same vocabulary.

The only production edit is `glossary/provenance/definition` in `scripts/redesign/content-canonical/shared.json`. Its before/after text and source scopes are in the JSON. Source registry, dossier text, IDs, assignments, ordering and matching behavior are unchanged. Compilation, resulting delivery hashes and affected print exports are coordinated by the parent task; this receipt alone is not export or release acceptance.

## Contexts retained deliberately

- Onondaga's wampum account and U'mista's potlatch/repatriation account remain attributed to those communities. The definitions do not reduce wampum to money or impose a universal Northwest Coast ceremony or return process.
- GLIFWC's manoomin account retains reciprocal care and distinguishes rice-finishing stages. It does not establish a pictured person's rights or a particular lake.
- The Roman freedman gloss remains assigned to the Roman dossier. Cherokee Freedmen's collective legal and political history is not automatically assigned that definition.
- State-sovereignty and federation glosses remain assigned to Indonesia and Ghana. Te Tiriti's Māori terms remain in attributed explanations distinguishing original texts, later translations and bounded findings.
- Mit’a remains explicitly Inka; resettlement, reciprocal help and later colonial forms are not merged. Dhamma is explicitly the Ashoka case's moral and administrative program, not all Buddhist doctrine.
- Genocide retains the Convention's acts-plus-intent distinction and illustrative wording. The fresh comparison used official indexed Article II text because direct UN page retrieval returned 403; no new legal adjudication is claimed.
- Bukhara's architecture was cross-checked against MIT's catalogue when two direct Iranica retrievals timed out. This corroborates the specified spaces, not all curricula or every claim in the unreopened article.

No new global glossary entries were required to resolve the identified contextual problem. Additional meanings are candidates for separately scoped entries when relevant cases are authored, rather than reasons to silently broaden every current definition.

## Evidence and limits

`output/glossary-context-2026-11-05/audit.mjs` uses the canonical loader and production `glossaryReading` helper; its notes, machine check and test log are beside it. The source checks record consultation date, URL, exact scope and access method. The JSON's contextual findings are author self-review, not independent approval. Preserved uncertainty includes object provenance gaps, alternative chronologies, disputed inscriptions, incomplete archival voices, and the difference between scholarly or institutional interpretation and a community's own account.
