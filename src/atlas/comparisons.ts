import type { RuntimeCorpus, Subject } from './model';

/** Distinct questions stay distinct, even when their labels sound similar. */
export const dimensionLabels: Record<string, string> = {
  belief: 'Belief and expression',
  production: 'Work and production',
  authority: 'Authority',
  evidence: 'Surviving evidence',
  movement: 'Movement and exchange',
  audience: 'Audience and making',
  urban: 'Urban work',
  participation: 'Authority and participation',
  change: 'Change and continuity',
  coordination: 'Work and coordination',
  obligation: 'Work, obligation and benefit',
  mediation: 'Makers, intermediaries and choice',
  maintenance: 'Maintaining places and work',
  'material-work': 'Materials, making and use',
  'place-context': 'Objects and documented places',
  'place-work': 'People, work and places',
  'work-organization': 'Organizing work',
  'evidence-limits': 'Evidence and its limits',
  patronage: 'Work and patronage',
  inequality: 'Authority and unequal power',
  materials: 'Work and materials',
  knowledge: 'Knowledge and belonging',
  custody: 'Evidence and custody',
  'evidence-authority': 'Evidence and authority',
};
export function dimensionKey(label: string): string {
  return (
    Object.entries(dimensionLabels).find(([, value]) => value === label)?.[0] ?? label
  );
}
export function sharedDimensions(a: Subject, b: Subject): string[] {
  const keys = new Set(b.dimensionKeys ?? Object.keys(b.dimensions));
  return (a.dimensionKeys ?? Object.keys(a.dimensions)).filter((key) => keys.has(key));
}
export function comparisonDefinition(corpus: RuntimeCorpus, a: string, b: string) {
  return corpus.comparisons?.find(
    (pair) => pair.subjects.includes(a) && pair.subjects.includes(b),
  );
}
function authoredPartners(corpus: RuntimeCorpus, id: string) {
  return (corpus.comparisons ?? [])
    .filter((pair) => pair.subjects.includes(id))
    .flatMap((pair) => pair.subjects.filter((partner) => partner !== id));
}
export function comparisonPartners(corpus: RuntimeCorpus, subject: Subject): Subject[] {
  const authored = authoredPartners(corpus, subject.id);
  return corpus.subjects
    .filter(
      (other) => other.id !== subject.id && sharedDimensions(subject, other).length > 0,
    )
    .sort((a, b) => {
      const score = (other: Subject) =>
        (authored.includes(other.id) ? 1000 - authored.indexOf(other.id) : 0) +
        sharedDimensions(subject, other).length * 10 +
        (other.packs.some((id) => subject.packs.includes(id)) ? 3 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    });
}

export function comparisonPartnerGroups(corpus: RuntimeCorpus, left: string) {
  const subject = corpus.subjects.find((s) => s.id === left);
  const authoredIds = [...new Set(authoredPartners(corpus, left))];
  const authored = authoredIds.flatMap((id) => {
    const partner = corpus.subjects.find((s) => s.id === id);
    return partner ? [partner] : [];
  });
  const ranked = subject ? comparisonPartners(corpus, subject) : [];
  const rankedIds = new Set(ranked.map((s) => s.id));
  const remaining = [
    ...ranked,
    ...corpus.subjects.filter((s) => s.id !== left && !rankedIds.has(s.id)),
  ].filter((s) => !authoredIds.includes(s.id));
  const sharesChapter = (partner: Subject) =>
    partner.packs.some((id) => subject?.packs.includes(id));
  return [
    { label: 'Authored comparisons', cases: authored },
    { label: 'Cases in the same chapter', cases: remaining.filter(sharesChapter) },
    {
      label: 'Other cases',
      cases: remaining.filter((partner) => !sharesChapter(partner)),
    },
  ].filter((group) => group.cases.length);
}
