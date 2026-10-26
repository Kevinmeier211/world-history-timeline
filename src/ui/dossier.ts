import { formatRange, formatYear } from '../lib/years.ts';
import type { Confidence, Verification } from '../data/schema/primitives.ts';

export interface DossierChip {
  id: string;
  label: string;
}

export interface DossierSourceLink {
  id: string;
  title: string;
  url: string;
}

export interface DossierModel {
  id: string;
  name: string;
  dates: string;
  confidence: string;
  summary: string;
  keyFacts: readonly string[];
  rulers: readonly { name: string; reign: string; title?: string }[];
  lineage: readonly DossierChip[];
  callouts: readonly DossierChip[];
  sources: readonly DossierSourceLink[];
  verification: string;
  mediaNote: string;
}

interface DossierSource {
  polities: readonly {
    id: string;
    name: string;
    start: number;
    end: number;
    confidence: Confidence;
    summary: string;
    keyFacts: readonly string[];
    rulers?: readonly { name: string; reign: string; title?: string }[];
    sourceIds: readonly string[];
    verification: Verification;
  }[];
  relations: readonly {
    id: string;
    from: readonly string[];
    to: readonly string[];
    type: string;
  }[];
  callouts: readonly {
    id: string;
    title: string;
    year: number;
    attachTo?: string;
  }[];
  sources: readonly { id: string; title: string; url: string }[];
}

const CONFIDENCE: Record<Confidence, string> = {
  secure: 'Secure',
  conventional: 'Conventional',
  approximate: 'Approximate',
  debated: 'Debated',
};

const VERIFICATION: Record<Verification, string> = {
  unverified: 'Not yet cross-checked',
  'cross-checked': 'Cross-checked',
  'primary-checked': 'Checked against a primary source',
};

const RELATION: Record<string, string> = {
  succession: 'Succession',
  split: 'Split',
  merge: 'Merge',
  conquest: 'Conquest',
  vassalage: 'Vassalage',
  cultural_continuity: 'Cultural continuity',
  migration: 'Migration',
  disputed: 'Disputed',
};

export function dossierFor(id: string, dataset: DossierSource): DossierModel | null {
  const polity = dataset.polities.find((item) => item.id === id);
  if (!polity) return null;
  const names = new Map(dataset.polities.map((item) => [item.id, item.name]));
  const sourceById = new Map(dataset.sources.map((source) => [source.id, source]));
  return {
    id: polity.id,
    name: polity.name,
    dates: formatRange(polity.start, polity.end, polity.confidence),
    confidence: CONFIDENCE[polity.confidence],
    summary: polity.summary,
    keyFacts: polity.keyFacts,
    rulers: polity.rulers ?? [],
    lineage: lineageChips(id, dataset.relations, names),
    callouts: dataset.callouts
      .filter((callout) => callout.attachTo === id)
      .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
      .map((callout) => ({
        id: callout.id,
        label: `${callout.title}, ${formatYear(callout.year)}`,
      })),
    sources: polity.sourceIds.flatMap((sourceId) => {
      const source = sourceById.get(sourceId);
      return source ? [{ id: source.id, title: source.title, url: source.url }] : [];
    }),
    verification: VERIFICATION[polity.verification],
    mediaNote: 'No image is attached.',
  };
}

function lineageChips(
  id: string,
  relations: DossierSource['relations'],
  names: ReadonlyMap<string, string>,
): DossierChip[] {
  const chips: DossierChip[] = [];
  for (const relation of relations) {
    const type = RELATION[relation.type] ?? relation.type;
    if (relation.from.includes(id)) {
      for (const other of relation.to) {
        const name = names.get(other);
        if (!name || other === id) continue;
        chips.push({
          id: `${relation.id}:to:${other}`,
          label: `${type} to ${name}`,
        });
      }
    }
    if (relation.to.includes(id)) {
      for (const other of relation.from) {
        const name = names.get(other);
        if (!name || other === id) continue;
        chips.push({
          id: `${relation.id}:from:${other}`,
          label: `${type} from ${name}`,
        });
      }
    }
  }
  chips.sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
  return chips;
}
