# Canonical content and record ownership

The compiler reads complete authored records from `scripts/redesign/content-canonical/`. Each record has one owner, recorded in `manifest.json`. The loader assembles these records in the manifest's collection and record order and returns a fresh deep copy. The delivery projections in `compile.ts` then validate the corpus and generate the public files.

The eight chapter files own dossiers, their media, chapter records, orientations, and the contexts, comparisons and journeys assigned to that chapter. Dossiers were assigned to their first listed chapter during migration. Their existing chapter membership remains part of the historical record. For example, Dholavira has its authoring home in C1 and appears in both C1 and C2. Changing a dossier's visible chapter membership does not automatically move its authoring home.

`sources.json` owns all source records, including access dates, scope limits and publication metadata. `shared.json` owns glossary terms and cross-chapter relationships, comparisons and journeys. A reference to a shared source uses its existing ID. Its full record is edited in the source registry.

For an existing record, locate `subjects/<id>`, `contexts/<id>`, `sources/<id>`, or another collection/ID in [the ownership report](CONTENT-OWNERSHIP.json). Its `file` field identifies the editable canonical file. Update the complete record there. For a new record, add it to its chosen canonical file, add its ID to the appropriate `manifest.order` array at the intended position, and add its collection/ID to `manifest.owners`. The loader rejects duplicate IDs, absent records, records without owners, conflicting owners and unsupported collections.

Run `npm run content:build` after edits, then the applicable complete data/citation, unit and browser gates. Regenerate the ownership report with the command below. Its default behavior reports the current canonical revision and checks independent assembly. An intentional editorial change receives a new corpus hash and the required source review.

```sh
/Users/kevinmeier/.local/bin/agent-heavy-run -- node --import tsx scripts/completion/content-ownership.ts
```

Set `ATLAS_BASELINE_CORPUS` only for a structural migration that must match a particular frozen corpus. That optional comparison rejects any byte change. Future editorial work uses current delivery and citation contracts and records its new revision.

The November 5 migration first read C1 from its canonical file and compared the whole corpus and all 190 delivery JSON files. The same checks then passed for all eight chapters and shared records. Repeated compilation, independent assembly and mutation isolation also passed. The preserved corpus hash is `e1a55385b2e242dbb9dcf865d94a0527fa4ed14396a2df0908d427bb5866cddd`. Receipts and frozen inputs are under `output/navigation-accessibility-2026-11-05/content-ownership/`.

The earlier 35 transformations remain available through `content-base.ts` and `content-pipeline.ts` as a historical comparator. [The frozen history](CONTENT-HISTORY-2026-11-05.json) preserves every observed field writer, stage and the migration corpus hash. Earlier editorial-addition tests continue to exercise that historical sequence. New content corrections belong in the canonical files. Production assembly uses `canonical-content.ts` and `canonical-assembly.ts`.

The one-time `scripts/completion/migrate-canonical-content.ts` requires a new destination and refuses to overwrite an existing authoring directory. `scripts/completion/verify-canonical-delivery.ts` compares the C1 pilot and complete migration against an explicitly frozen set of delivery files in isolated output directories. These tools preserve the migration evidence independently of future editorial revisions.
