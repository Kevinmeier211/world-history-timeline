import { useEffect, useState } from 'react';
import type { Corpus, Pack, Media } from './model';
import { asset } from './data';
import { ReaderPrint } from './ReaderPrint';
import { WorldPoster, PosterNotes } from './WorldPoster';
import { dimensionLabels } from './comparisons';
import {
  chapterSourceRows,
  chapterSourceGroups,
  chapterComparisonDimensions,
  type ChapterSourceRow,
} from './chapter-sources';
import { FamilySourceSummary } from './FamilySourceSummary';
import { familyMedia } from './family-media';
import { formatYear } from '../lib/years';
import { latestConsultationDate } from './consultation-date';
import './print.css';
import { AnnotatedImage, AnnotationNotes } from './AnnotatedImage';
import { printMedia } from './print-media';
import { PrintCatalog } from './PrintCatalog';
import { RegionalPrint } from './RegionalPrint';
function PrintImage({ m, c }: { m: Media; c: Corpus }) {
  return (
    <figure className="print-object">
      <AnnotatedImage object={m} annotations={m.annotations} mode="print">
        <img src={printMedia(m.image)} alt={m.alt} />
      </AnnotatedImage>
      <figcaption>
        <strong>{m.title}</strong> · {m.date.label}
        <br />
        {m.printCaption ?? m.caption}
        <br />
        <span>
          {m.printCredit ?? m.credit} {m.rights}
          {m.licenseUrl && (
            <>
              {' '}
              <a href={m.licenseUrl}>{m.licenseUrl}</a>
            </>
          )}
        </span>
        <br />
        <a href={c.sources.find((s) => s.id === m.source)?.url}>
          Original institutional record · {m.accession}
        </a>
        {m.annotations && <AnnotationNotes annotations={m.annotations} compact />}
      </figcaption>
    </figure>
  );
}
function Colophon({ c }: { c: Corpus }) {
  const reviewed = latestConsultationDate(c) ?? 'an unrecorded date';
  return (
    <footer className="print-colophon">
      Chronos · Selective world history, 3300 BCE–2000 CE · Codex source consultation
      and self-review through {reviewed}. Citations, scopes and media credits accompany
      the atlas. Independent historian, family and physical print acceptance remain
      open.
    </footer>
  );
}
function Chapter({ c, p }: { c: Corpus; p: Pack }) {
  const journey = c.journeys.find((j) => j.id === p.journey)!;
  const pair = p.comparison.map((id) => c.subjects.find((s) => s.id === id)!);
  const media =
    c.media.find((m) => m.id === journey.leadObject) ??
    c.media.find((m) => journey.stops.some((s) => s.object === m.id)) ??
    c.media.find((m) => pair.some((s) => s.objectIds.includes(m.id)));
  const dimensions = chapterComparisonDimensions(pair);
  const sourceRows = chapterSourceRows(c, journey, pair);
  const breaks = [
    0,
    ...(journey.printBreakAfter ??
      (journey.stops.length > 6 ? [Math.ceil(journey.stops.length / 2)] : [])),
    journey.stops.length,
  ];
  const stopGroups = breaks
    .slice(0, -1)
    .map((start, i) => journey.stops.slice(start, breaks[i + 1]));
  const sourceGroups = chapterSourceGroups(
    sourceRows,
    journey.printSourcesPerPage ?? 3,
  );
  const total = stopGroups.length + 3 + sourceGroups.length;
  const sourceNotes = (rows: ChapterSourceRow[]) => (
    <section className="print-sources">
      <h2>Evidence to revisit</h2>
      {rows.map(({ source, locators }) => {
        return (
          <p key={source.id} data-source={source.id}>
            <a href={source.url}>{source.title}</a> · {source.institution}.{' '}
            {source.author && source.author !== source.institution
              ? `${source.author}. `
              : ''}
            {source.published ? `Source date: ${source.published}. ` : ''}
            {locators.join('; ')}. {source.scope} Consulted {source.accessed}.
            <a className="chapter-source-url" href={source.url}>
              {source.url}
            </a>
          </p>
        );
      })}
    </section>
  );
  return (
    <>
      <article className="print-page chapter-sheet">
        <header>
          <p>
            {p.id} · 1 of {total} · {formatYear(p.start)} – {formatYear(p.end)}
          </p>
          <h1>{p.title}</h1>
          <h2>{p.question}</h2>
        </header>
        <p>{p.orientation}</p>
        <p>
          <strong>Place matters.</strong> {p.geography}
        </p>
        <div className="orientation-print-grid">
          {media && <PrintImage m={media} c={c} />}
          <section>
            <h2>Look closely</h2>
            {media?.notice.map((n) => (
              <p key={n}>{n}</p>
            ))}
            <h2>Return to an idea</h2>
            <p>{journey.returnPrompt}</p>
          </section>
        </div>
        <p className="print-limits">
          <strong>Coverage limits.</strong> {p.limits}
        </p>
        <Colophon c={c} />
      </article>
      {stopGroups.map((stops, group) => (
        <article key={group} className="print-page chapter-route">
          <header>
            <p>
              {p.id} · {group + 2} of {total} · An authored investigation
            </p>
            <h1>{journey.title}</h1>
            <h2>{journey.question}</h2>
          </header>
          {group === 0 ? (
            <p>{journey.introduction}</p>
          ) : (
            <p>
              Continue the investigation. Keep the previous evidence and its limits in
              mind.
            </p>
          )}
          <ol className="print-stop-list" start={breaks[group]! + 1}>
            {stops.map((stop, i) => (
              <li key={i}>
                <strong>{stop.title}</strong>
                <span>
                  {c.subjects.find((x) => x.id === stop.subject)?.name} ·{' '}
                  {formatYear(stop.year)}
                </span>
                <p>{stop.narrative}</p>
              </li>
            ))}
          </ol>
          {group === stopGroups.length - 1 && (
            <>
              <h2>Return to the world</h2>
              <p>{journey.conclusion}</p>
            </>
          )}
          <Colophon c={c} />
        </article>
      ))}
      <article className="print-page comparison-sheet">
        <header>
          <p>
            {p.id} · {stopGroups.length + 2} of {total} · Compare with care
          </p>
          <h1>
            {pair[0]!.name}
            <span className="print-versus">and</span>
            {pair[1]!.name}
          </h1>
        </header>
        <div className="print-pair">
          {pair.map((s) => (
            <section key={s.id}>
              <h2>{s.name}</h2>
              <p className="print-date">{s.interval.label}</p>
              <p>{s.summary}</p>
              <p className="print-date">{s.interval.note}</p>
            </section>
          ))}
        </div>
        {dimensions.map((d) => (
          <section key={d}>
            <h2>{dimensionLabels[d] ?? d}</h2>
            <div className="print-pair">
              {pair.map((s) => (
                <p key={s.id}>{s.dimensions[d]!.text}</p>
              ))}
            </div>
          </section>
        ))}
        {!dimensions.length && (
          <p>
            No matched institutional dimension is supported by both dossiers. Compare
            their defined scope, place and surviving evidence without filling gaps by
            analogy.
          </p>
        )}
        <h2>Strengthen the comparison</h2>
        <p>
          Name a similarity, a difference and a limit in the evidence. A comparison
          establishes no historical contact.
        </p>
        <Colophon c={c} />
      </article>
      <article className="print-page chapter-evidence">
        <header>
          <p>
            {p.id} · {stopGroups.length + 3} of {total} · Evidence and explanation
          </p>
          <h1>{journey.evidence.prompt}</h1>
        </header>
        <div className="print-evidence">
          {journey.evidence.options.map((o, i) => (
            <section key={i}>
              <h2>{o.supported ? 'Supported with limits' : 'Overreaches'}</h2>
              <p>{o.text}</p>
              <p>{o.feedback}</p>
            </section>
          ))}
        </div>
        <h2>Keep a question</h2>
        <p>{journey.returnPrompt}</p>
        <Colophon c={c} />
      </article>
      {sourceGroups.map((rows, group) => (
        <article
          key={group}
          className="print-page chapter-evidence"
          data-journey={journey.id}
        >
          <header>
            <p>
              {p.id} · {stopGroups.length + 4 + group} of {total} · References and
              further questions
            </p>
            <h1>Follow the evidence</h1>
            <h2>{journey.question}</h2>
          </header>
          {sourceNotes(rows)}
          <h2>Return with a question</h2>
          <p>{journey.returnPrompt}</p>
          <Colophon c={c} />
        </article>
      ))}
    </>
  );
}

function Family({ c, p }: { c: Corpus; p: Pack }) {
  const j = c.journeys.find((j) => j.id === p.journey)!;
  const evidence = j.familyEvidence;
  const m = familyMedia(c, j);
  return (
    <article className="print-page family-sheet" data-journey={j.id}>
      <header>
        <p>
          {p.id} · Explore together · {formatYear(p.start)} – {formatYear(p.end)}
        </p>
        <h1>Look closely. Ask a good question.</h1>
        <h2>{p.question}</h2>
      </header>
      <div className="family-image-grid">
        {m && <PrintImage m={m} c={c} />}
        {!m && evidence && <FamilySourceSummary c={c} evidence={evidence} />}
        <section>
          {m && evidence && <FamilySourceSummary c={c} evidence={evidence} />}
          <h2>Notice</h2>
          {(evidence?.notice ?? m?.notice)?.map((n) => (
            <p key={n}>{n}</p>
          ))}
          {!evidence && (
            <p>Point, talk, draw or write. An adult can read the caption aloud.</p>
          )}
          <div className="writing-space" aria-hidden="true" />
        </section>
      </div>
      <div className={evidence ? 'family-response-grid' : undefined}>
        <section className="family-claim">
          <h2>Make a careful claim</h2>
          <p>{evidence?.claimPrompt ?? j.evidence.prompt}</p>
          {!evidence && <p>What does the evidence support? What is still unknown?</p>}
          <div className="writing-space" aria-hidden="true" />
        </section>
        <section className="family-return">
          <h2>Come back another day</h2>
          <p>{evidence?.returnPrompt ?? j.returnPrompt}</p>
        </section>
      </div>
      <details open className="print-feedback">
        <summary>Read after making your claim</summary>
        <p>
          {evidence?.feedback ?? j.evidence.options.find((o) => o.supported)?.feedback}
        </p>
      </details>
      <Colophon c={c} />
    </article>
  );
}
export function PrintAtlas() {
  const [c, setC] = useState<Corpus | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(asset('/atlas/corpus.json'))
      .then((r) => {
        if (!r.ok) throw Error('Content could not load');
        return r.json();
      })
      .then(setC)
      .catch((e) => setError(e.message));
  }, []);
  const q = new URLSearchParams(window.location.search),
    mode = q.get('print'),
    packs = c?.packs.filter((p) => !q.get('pack') || p.id === q.get('pack')) ?? [];
  if (!c)
    return (
      <main>
        <h1>{error || 'Preparing the print composition…'}</h1>
      </main>
    );
  return (
    <main className={`print-document print-${mode}`}>
      <div className="print-toolbar">
        <a href="?">Return to atlas</a>
        <button onClick={() => window.print()}>Print or save PDF</button>
        <p>
          {mode === 'overview'
            ? 'A3 landscape, actual size. The regional companion provides larger reading and full source notes.'
            : mode === 'overview-notes'
              ? 'US Letter portrait, actual size. Companion to the numbered world poster.'
              : mode === 'chapter'
                ? 'US Letter portrait, actual size; separate routes, comparisons and references.'
                : 'US Letter portrait, actual size; enable background graphics if desired.'}
        </p>
        {(mode === 'overview' || mode === 'overview-notes') && (
          <a href={mode === 'overview' ? '?print=overview-notes' : '?print=overview'}>
            {mode === 'overview'
              ? 'Open regional reading companion'
              : 'Open A3 world poster'}
          </a>
        )}
      </div>
      {mode === 'catalog' ? (
        <PrintCatalog />
      ) : mode === 'regional' ? (
        <RegionalPrint corpus={c} chapter={q.get('pack')} />
      ) : mode === 'reader' ? (
        <ReaderPrint corpus={c} subjectId={q.get('subject')} />
      ) : mode === 'overview' ? (
        <WorldPoster c={c} footer={<Colophon c={c} />} />
      ) : mode === 'overview-notes' ? (
        <PosterNotes c={c} footer={<Colophon c={c} />} />
      ) : (
        packs.map((p) =>
          mode === 'family' ? (
            <div key={p.id}>
              {(!q.get('journey') || q.get('journey') === p.journey) && (
                <Family c={c} p={p} />
              )}
              {(p.investigations ?? [])
                .filter((i) => !q.get('journey') || q.get('journey') === i.journey)
                .map((investigation) => (
                  <Family
                    key={investigation.journey}
                    c={c}
                    p={{ ...p, ...investigation }}
                  />
                ))}
            </div>
          ) : (
            <div key={p.id}>
              <Chapter c={c} p={p} />
              {(p.investigations ?? []).map((investigation) => (
                <Chapter
                  key={investigation.journey}
                  c={c}
                  p={{ ...p, ...investigation }}
                />
              ))}
            </div>
          ),
        )
      )}
    </main>
  );
}
