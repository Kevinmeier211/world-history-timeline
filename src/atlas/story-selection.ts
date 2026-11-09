import type { MediaSummary, RuntimeCorpus, Subject } from './model';

// Editorial starting points, not a ranking or a claim of historical contact.
const startingPoints = [
  'colima',
  'kerma-potters',
  'shang-ritual',
  'borobudur',
  'mughal-books',
  'zand-iran',
  'roman-world',
  'tomioka',
];
export function storyObject(subject: Subject, media: MediaSummary[]) {
  return subject.objectIds
    .map((id) => media.find((object) => object.id === id))
    .find((object) => object && object.depiction !== 'explanatory diagram');
}
export function storySelection(
  corpus: RuntimeCorpus,
  pack: string | null,
  region: string,
) {
  const subjects = corpus.subjects.filter(
    (subject) =>
      (!pack || subject.packs.includes(pack)) &&
      (region === 'all' || subject.region === region),
  );
  const entries = subjects.map((subject) => ({
    subject,
    object: storyObject(subject, corpus.media),
  }));
  const featured = pack
    ? entries.filter((entry) => entry.object)
    : startingPoints.flatMap((id) => {
        const entry = entries.find((entry) => entry.subject.id === id && entry.object);
        return entry ? [entry] : [];
      });
  // A region without a curated starting point still offers its own actual records.
  return {
    entries,
    featured: featured.length ? featured : entries.filter((entry) => entry.object),
  };
}
