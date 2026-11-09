# Plains and community authority — local content handoff

29 October 2026. Kevin asked content expansion to resume. This pass adopts three already researched accounts. It does not finish the remaining fourteen dossiers, the visual-exploration review, or a new full print/portable candidate.

## What was adopted

The drafts in `output/plains-authority-preflight-2026-10-29/` are now applied by `scripts/redesign/content-plains-authority.ts` during `content:build`. Compiler modules:

- `plains-blackfoot.ts`
- `plains-hidatsa.ts`
- `plains-kwakwakawakw.ts`

The consultation record remains that folder’s `PLAINS-AUTHORITY-SOURCES-2026-10-29.md`, each case’s `SOURCE-ACCESS.json`, and `CLAIMS-EVIDENCE-VISUALS.md`. Those files are the scope of what was read. They are not independent community or historian acceptance.

| Dossier                 | Preserved case          | Separate reference                                               | Main / deeper words |
| ----------------------- | ----------------------- | ---------------------------------------------------------------- | ------------------- |
| `blackfoot-bison`       | c.1700–1850             | `blackfoot-work-interpretation-context`, 1700–2008               | 383 / 209           |
| `hidatsa-villages`      | c.1600–1845 Big Hidatsa | `hidatsa-gardens-relocation-context`                             | 377 / 223           |
| `kwakwakawakw-potlatch` | 1884–1980               | `kwakwakawakw-witnesses-return-context`, through one 2003 return | 374 / 202           |

Corpus after this build: 77 dossiers, 459 sources, 105 media, 63 contexts. Eight new source records and twelve dated scope renewals. Brink’s 27 October chapter-7 scope and the Hunt/Boas title-page consultation were not renewed. No new image, annotation, place study, journey, comparison or historical relationship.

## Blackfoot communal work

The account asks how much coordinated work lies beyond the moment at the cliff. UNESCO’s site description supplies drive lanes, bone deposits and processing camps. The Blackfoot/Glenbow collaborative exhibition, _Niitsitapiisini_, supplies preparation, timing, runners along drive lanes, drying, hide work, water and fuel. Blackfoot Crossing supplies a separate Siksika account of materials and trade protocols. Credits distinguish collaborative teaching from a named eighteenth-century quotation. A Kainai language version is recorded as the source of many terms, not as every Blackfoot group’s speech.

The photograph remains the 2005 landscape view. Its caption says it does not show a historic hunt, buried layers or every drive-lane marker. Brink’s retained experiment, with Piikani crew member Hazel Big Smoke, cattle bones and modern tools, stays a modern method. It is not an ancient meal. No song, costume, ritual instruction or hunt reenactment is reproduced. The approximate 1850 site boundary does not end Blackfoot people or bison knowledge.

## Hidatsa gardens and later homes

Women’s cultivation, storage, earthlodge construction and river exchange are the mechanism. Hunting and gathering stay in the account. The NPS teaching text is credited to MHA Nation contributors. Numerical population totals and extinction language on the MHA history page are not adopted.

Maxi´diwiac (Buffalobird-woman), interpreted by Edward Goodbird and edited by Gilbert L. Wilson, is used from the November 1917 University of Minnesota book: foreword method, selected tool recollections, the remembered garden map’s limits, and garden boundaries, permission and fallowing. The foreword’s 1912 dictation and later corrections stay distinct from 1917 publication. Her memories are Like-a-Fishhook recollections, not a diary of every Big Hidatsa household from 1600 to 1845. Goodbird’s steer-shoulder-blade model is not identified with the NPS tool illustration.

The case still ends in 1845, when MHA’s history places the move to Like-a-Fishhook. The 1837 epidemic, 1917 publication, the NPS 1953 dam completion and MHA’s fall 1954 relocation stay on the reference frame. The standing lodge and tool images remain later depictions with unknown creation dates. No Big Hidatsa measured plan was adopted. Lower Hidatsa and Figure 36 were inspected in the preflight and left unadopted because they are different places and their image rights are not cleared for this atlas.

## Kwakwaka’wakw witnesses and particular returns

Preparation, food and gifts are treated as the work that makes witnessing possible. U’mista distinguishes the 1884 amendment from the prohibition taking effect on 1 January 1885. Continued potlatching is not erased by the statute. Dan Cranmer’s 1921 gathering at Village Island, the prosecutions and confiscations, Vera Newman’s recollection of fear and imprisonment, and Chief Bill Cranmer’s account of surrendering belongings to keep people from jail are particular statements. Contradictory prison totals inside the source are omitted.

Return is organizational work: Chief Jimmy Sewid, councils, Elders, and the history’s statement that oldest living descendants would decide where belongings were held. U’mista’s 1980 opening remains the case endpoint. Florence and Sean Matilpi’s family headdress, and the source’s 23 September 2003 return associated with Chief Sam Scow, are named. They do not prove every custody link or that every belonging was home by 1980. The 1921 title page still shows Hunt’s data and Boas’s authorship, not a pictured potlatch. No song, ceremony, ceremonial photograph or reenactment is included.

## Checks

`npm run content:build` completed: 77 subjects, 8 packs, 105 objects, 1,274 legacy records still accounted for. `npx vitest run` passed **878 tests in 157 files**, including the new plains contract and the existing northern date contract. The three dossiers were opened in the running local preview. Each shows its preserved case date, the new lead, and the photograph or title page beside that lead. The Blackfoot caption still identifies a 2005 landscape photograph.

Not rerun: the full browser suite, atlas coverage, all PDF exports and page review, and a new portable ZIP. The Industry receipt remains the last sealed whole-candidate checkpoint. Its metrics are not a gate for this pass. Existing public PDFs were not regenerated.

## Still open

Fourteen dossiers still lack the expanded reading layer: Bering Sea carvers, Middle Niger, Polynesian voyaging, the Haitian Revolution, Ozette, Wendat, the Canandaigua treaty, Te Tiriti, the two world-war cases, Sputnik, Inuinnait sewing, Cherokee print and Ojibwe manoomin. Several of those have unadopted research packets. They were not folded in here.

Independent Blackfoot, MHA and Kwakwaka’wakw review, historian review, real family use, screen readers, physical devices and physical print remain open. Author QA does not supply them.

Local only. No push, deployment, publication or external message. Pushes this pass: **0**. CI runs: **0**.
