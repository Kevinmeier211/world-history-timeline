import type { Citation, Corpus, Media } from './model';
import { printMedia } from './print-media';
import { formatYear } from '../lib/years';
import { PlaceMap } from './PlaceMap';
import { Fragment } from 'react';
import { AnnotatedImage, AnnotationNotes } from './AnnotatedImage';

export function ReaderPrint({
  corpus,
  subjectId,
}: {
  corpus: Corpus;
  subjectId: string | null;
}) {
  const s = corpus.subjects.find((s) => s.id === subjectId);
  if (!s)
    return (
      <article className="reader-print">
        <h1>Choose an investigation to print</h1>
        <p>Open a dossier and select “Print this investigation.”</p>
      </article>
    );
  const contexts = (corpus.contexts ?? []).filter((c) => s.contextIds?.includes(c.id));
  const media = s.objectIds
    .map((id) => corpus.media.find((m) => m.id === id))
    .filter((m): m is Media => !!m);
  const citations = [
    ...s.claims.flatMap((claim) => claim.citations),
    ...s.sections.flatMap((x) => x.citations),
    ...(s.deeperReading ?? []).flatMap((x) => x.citations),
    ...(s.evidenceReading?.items ?? []).flatMap((x) => x.citations),
    ...contexts.flatMap((x) => [
      ...x.citations,
      ...x.phases.flatMap((p) => p.citations),
    ]),
    ...(s.placeStudy?.points ?? []).flatMap((p) => p.citations),
    ...(s.placeStudy?.features ?? []).flatMap((p) => p.citations),
    ...media.flatMap(
      (m) => m.annotations?.items.flatMap((item) => item.citations) ?? [],
    ),
  ];
  const ids = [
    ...new Set([...citations.map((c) => c.source), ...media.map((m) => m.source)]),
  ];
  const refs = (cs: Citation[]) => (
    <p className="reader-refs">
      {cs.map((c, i) => (
        <span key={`${c.source}-${i}`}>
          [{ids.indexOf(c.source) + 1}] {c.locator}
          {i < cs.length - 1 ? '; ' : ''}
        </span>
      ))}
    </p>
  );
  const renderFigure = (m: Media) => (
    <Fragment key={m.id}>
      <figure
        className="reader-image reader-block"
        data-depiction={m.depiction}
        data-orientation={m.width > m.height ? 'landscape' : 'portrait'}
        key={m.id}
      >
        <AnnotatedImage
          object={m}
          annotations={m.annotations}
          mode="reader"
          widthMm={m.printWidthMm}
        >
          <img
            src={printMedia(m.image)}
            alt={m.alt}
            style={
              m.printWidthMm
                ? { width: m.printWidthMm + 'mm', maxWidth: '100%', height: 'auto' }
                : undefined
            }
          />
        </AnnotatedImage>
        <figcaption>
          <strong>{m.title}</strong> · {m.date.label}
          <p>{m.caption}</p>
          <p>
            {m.credit} {m.rights} [{ids.indexOf(m.source) + 1}]
            {m.licenseUrl && (
              <>
                {' '}
                <a href={m.licenseUrl}>{m.licenseUrl}</a>
              </>
            )}
          </p>
        </figcaption>
      </figure>
      {m.annotations && (
        <AnnotationNotes annotations={m.annotations} renderCitations={refs} />
      )}
      {(m.additionalImages ?? []).map((view, index) => (
        <figure className="reader-image reader-block" key={view}>
          <img
            src={printMedia(view)}
            alt={m.additionalImageAlts?.[index] ?? `Additional view of ${m.title}`}
          />
          <figcaption>
            <strong>
              Additional recorded view {index + 1}: {m.title}
            </strong>
            <p>
              {m.additionalImageAlts?.[index] ??
                'Compare this angle with the primary photograph; its annotations apply only to that primary view.'}
            </p>
            <p>
              {m.credit} {m.rights} [{ids.indexOf(m.source) + 1}]
            </p>
          </figcaption>
        </figure>
      ))}
    </Fragment>
  );
  return (
    <article className="reader-print">
      <header>
        <p>CHRONOS · An investigation to read and revisit</p>
        <h1>{s.name}</h1>
        <p>
          {s.interval.label} · {s.place}
        </p>
        <h2>{s.question}</h2>
        <p>{s.summary}</p>
      </header>
      {s.familyActivity && (
        <section className="reader-block family-print">
          <h2>
            {s.familyActivity.duration} · {s.familyActivity.title}
          </h2>
          <ol>
            {s.familyActivity.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{s.familyActivity.explanation}</p>
        </section>
      )}
      {media.filter((m) => m.depiction !== 'explanatory diagram').map(renderFigure)}
      <p className="reader-refs">
        {s.interval.note} {s.geographicPrecision}
      </p>
      {s.sections.map((section) => (
        <section className="reader-block" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>
          {refs(section.citations)}
        </section>
      ))}
      {media.filter((m) => m.depiction === 'explanatory diagram').map(renderFigure)}
      <h2>Place this story in time</h2>
      {contexts.map((c) => (
        <section key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.summary}</p>
          <p>
            {c.interval.label}. {c.interval.note}
          </p>
          {refs(c.citations)}
          <ol className="reader-phases">
            {c.phases.map((p) => (
              <li className="reader-block" key={`${p.year}-${p.title}`}>
                <strong>
                  {p.label ?? formatYear(p.year)} · {p.title}
                </strong>
                <p>{p.text}</p>
                {refs(p.citations)}
              </li>
            ))}
          </ol>
        </section>
      ))}
      {s.placeStudy && (
        <section className="reader-geography">
          <div className="reader-block">
            <PlaceMap study={s.placeStudy} sources={corpus.sources} />
          </div>
          <ol>
            {s.placeStudy.points.map((p) => (
              <li className="reader-block" key={p.id}>
                <strong>{p.label}</strong>
                <p>{p.text}</p>
                {refs(p.citations)}
              </li>
            ))}
          </ol>
          <p>
            Approximate locators and schematic features; no surveyed or political
            boundaries are implied.
          </p>
          {s.placeStudy.features.map((f) => (
            <div key={f.label}>
              <p className="reader-refs">
                {f.label}: {f.note}
              </p>
              {refs(f.citations)}
            </div>
          ))}
        </section>
      )}
      {s.evidenceReading && (
        <section>
          <h2>{s.evidenceReading.title}</h2>
          <p>{s.evidenceReading.introduction}</p>
          {s.evidenceReading.items.map((item) => (
            <div className="reader-block" key={item.label}>
              <h3>{item.label}</h3>
              <blockquote>{item.text}</blockquote>
              <p>{item.interpretation}</p>
              {refs(item.citations)}
            </div>
          ))}
        </section>
      )}
      {s.claims.length > 0 && (
        <section className="reader-claims">
          <h2>How do we know?</h2>
          {s.claims.map((claim) => (
            <div className="reader-block" key={claim.id}>
              <p>{claim.text}</p>
              {claim.uncertainty && <p>{claim.uncertainty}</p>}
              {refs(claim.citations)}
            </div>
          ))}
        </section>
      )}
      <h2>Go deeper</h2>
      {s.deeperReading?.map((section) => (
        <section className="reader-block" key={section.title}>
          <h3>{section.title}</h3>
          <p>{section.text}</p>
          {refs(section.citations)}
        </section>
      ))}
      <section className="reader-block">
        <h2>Keep a question</h2>
        <p>{s.returnPrompt}</p>
        <div className="writing-space" />
      </section>
      <section className="reader-block reader-review">
        <p>
          {s.review?.scope} Consulted {s.review?.consultedOn}.{' '}
          {s.review?.limitations.join(' ')}
        </p>
        <footer>
          Local educational candidate · Source consultation and self-review by Codex;
          independent historian approval, physical print inspection and family testing
          remain open.
        </footer>
      </section>
      <section className="reader-bibliography">
        <h2>Sources, access and limits</h2>
        <ol>
          {ids.map((id) => {
            const source = corpus.sources.find((s) => s.id === id)!;
            return (
              <li className="reader-block" key={id}>
                <a href={source.url}>{source.title}</a> ·{' '}
                {source.author ?? source.institution}.{' '}
                <p>
                  {source.scope} Consulted {source.accessed}.
                </p>
                <p className="reader-url">{source.url}</p>
              </li>
            );
          })}
        </ol>
      </section>
    </article>
  );
}
