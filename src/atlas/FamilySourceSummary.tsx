import type { Corpus, Journey } from './model';
export function FamilySourceSummary({
  c,
  evidence,
}: {
  c: Corpus;
  evidence: NonNullable<Journey['familyEvidence']>;
}) {
  return (
    <section className="family-source-summary">
      <h2>{evidence.title}</h2>
      <p>{evidence.text}</p>
      <div className="family-source-credits">
        {evidence.citations.map((ref) => {
          const source = c.sources.find((s) => s.id === ref.source)!;
          return (
            <p key={`${ref.source}/${ref.locator}`}>
              <a href={source.url}>{source.title}</a> · {source.institution}.{' '}
              {ref.locator}. Consulted {source.accessed}.
            </p>
          );
        })}
      </div>
    </section>
  );
}
