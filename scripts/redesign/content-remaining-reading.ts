import type { Citation, Corpus } from '../../src/atlas/model';
import { applyEasternCanandaigua } from './eastern-canandaigua';
import { applyEasternCherokee } from './eastern-cherokee';
import { applyEasternOjibwe } from './eastern-ojibwe';
import { applyEasternWendat } from './eastern-wendat';
import { applyKnowledgeBering } from './knowledge-bering';
import { applyKnowledgeInuinnait } from './knowledge-inuinnait';
import { applyKnowledgeOzette } from './knowledge-ozette';
import { applyAuthorityHaiti } from './authority-haiti';
import { applyAuthorityTiriti } from './authority-tiriti';
import { applyWarScienceSputnik } from './war-science-sputnik';
import { applyWW1Frame } from './war-one-frame';
import { applyEvidenceMiddleNiger } from './evidence-middle-niger';
import { applyEvidenceVoyaging } from './c6-voyaging';
import {
  worldWarTwoFrameworkContext,
  worldWarTwoFrameworkUpdate,
  worldWarTwoSplitSources,
} from './ww2-regional-proposals';

/**
 * Adopt the reviewed reading drafts for the remaining dossiers.
 * World War I and World War II stay on their existing case IDs.
 * Proposed regional case IDs are not created.
 */
export function applyRemainingReading(c: Corpus): void {
  const before = c.subjects.length;
  applyEasternWendat(c);
  applyEasternCanandaigua(c);
  applyEasternCherokee(c);
  applyEasternOjibwe(c);
  applyKnowledgeBering(c);
  applyKnowledgeOzette(c);
  applyKnowledgeInuinnait(c);
  applyAuthorityHaiti(c);
  applyAuthorityTiriti(c);
  applyWarScienceSputnik(c);
  applyWW1Frame(c);
  applyWorldWarTwoFramework(c);
  // Reuse the prepared C6 consultations. This is not a fresh source audit.
  applyEvidenceMiddleNiger(c);
  applyEvidenceVoyaging(c);
  if (c.subjects.length !== before)
    throw new Error('Remaining reading must not add or remove dossiers');
}

function citedSources(rows: Citation[]): Set<string> {
  return new Set(rows.map((row) => row.source));
}

/** Deepen the existing 1933–1945 case. Do not add the proposed regional dossiers. */
function applyWorldWarTwoFramework(c: Corpus): void {
  const framework = c.subjects.find((s) => s.id === 'world-war-two');
  if (!framework) throw new Error('Missing preserved world-war-two framework');
  const needed = citedSources([
    ...worldWarTwoFrameworkContext.citations,
    ...worldWarTwoFrameworkContext.phases.flatMap((phase) => phase.citations),
    ...worldWarTwoFrameworkUpdate.additionalSections.flatMap(
      (section) => section.citations,
    ),
    ...worldWarTwoFrameworkUpdate.deeperReading.flatMap((section) => section.citations),
    ...worldWarTwoFrameworkUpdate.evidenceReading.items.flatMap(
      (item) => item.citations,
    ),
  ]);
  for (const row of worldWarTwoSplitSources) {
    if (!needed.has(row.id)) continue;
    const at = c.sources.findIndex((source) => source.id === row.id);
    if (at < 0) c.sources.push(structuredClone(row));
    else c.sources[at] = structuredClone(row);
  }
  c.contexts ??= [];
  const at = c.contexts.findIndex(
    (context) => context.id === worldWarTwoFrameworkContext.id,
  );
  if (at < 0) c.contexts.push(structuredClone(worldWarTwoFrameworkContext));
  else c.contexts[at] = structuredClone(worldWarTwoFrameworkContext);
  const addedTitles = new Set(
    worldWarTwoFrameworkUpdate.additionalSections.map((section) => section.title),
  );
  framework.sections = [
    ...framework.sections.filter((section) => !addedTitles.has(section.title)),
    ...structuredClone(worldWarTwoFrameworkUpdate.additionalSections),
  ];
  framework.deeperReading = structuredClone(worldWarTwoFrameworkUpdate.deeperReading);
  framework.evidenceReading = structuredClone(
    worldWarTwoFrameworkUpdate.evidenceReading,
  );
  framework.familyActivity = structuredClone(worldWarTwoFrameworkUpdate.familyActivity);
  framework.review = structuredClone(worldWarTwoFrameworkUpdate.review);
  framework.contextIds = [
    ...new Set([...(framework.contextIds ?? []), worldWarTwoFrameworkContext.id]),
  ];
}
