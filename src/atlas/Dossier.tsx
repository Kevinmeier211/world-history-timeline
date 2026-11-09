import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RuntimeCorpus, Subject, GlossaryTerm } from './model';
import type { Location } from './navigation';
import { loadSubject } from './data';
import { MediaFigure } from './MediaFigure';
import { useSubjectMedia } from './useMediaDetails';
import { Citations } from './Evidence';
import { comparisonPartners } from './comparisons';
import { locationQuery, worldContext } from './navigation';
import { PlaceMap } from './PlaceMap';
import { ReferenceTimeline } from './ReferenceTimeline';
import { glossaryReading } from './glossary-reading';
import { GlossaryText, GlossaryDefinition } from './GlossaryReading';
import { storyObject } from './story-selection';
import chapterLearning from './chapter-learning.json';
export function useSubject(id: string | null, corpus: RuntimeCorpus) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{
    id: string;
    attempt: number;
    subject?: Subject;
    error?: string;
  } | null>(null);
  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  useEffect(() => {
    let active = true;
    if (id)
      loadSubject(id)
        .then((subject) => {
          if (subject.id !== id) throw Error('The researched dossier could not load.');
          if (active) setLoaded({ id, attempt, subject });
        })
        .catch(() => {
          if (active)
            setLoaded({
              id,
              attempt,
              error: 'The researched dossier could not load. Try again.',
            });
        });
    return () => {
      active = false;
    };
  }, [id, attempt]);
  const current = loaded?.id === id && loaded.attempt === attempt ? loaded : null;
  return {
    subject: current?.subject ?? corpus.subjects.find((subject) => subject.id === id),
    loading: !!id && !current,
    error: current?.error ?? '',
    retry,
  };
}
export function Dossier({
  corpus,
  location,
  close,
  navigate,
  openSubject,
  save,
  onReady,
}: {
  corpus: RuntimeCorpus;
  location: Location;
  close: () => void;
  navigate: (patch: Partial<Location>, focus?: 'context') => void;
  openSubject: (s: Subject) => void;
  save: (
    title: string,
    question: string,
    kind: 'subject' | 'comparison' | 'journey' | 'question',
  ) => void;
  onReady: () => void;
}) {
  const { subject: s, loading, error, retry } = useSubject(location.subject, corpus);
  const readingTitle = useRef<HTMLHeadingElement>(null);
  const bootstrap = corpus.subjects.find((subject) => subject.id === location.subject);
  const objects = useMemo(
    () => corpus.media.filter((media) => bootstrap?.objectIds.includes(media.id)),
    [corpus.media, bootstrap],
  );
  const media = useSubjectMedia(corpus, location.subject, objects);
  const object =
    objects.find((media) => media.id === location.object) ??
    (bootstrap ? storyObject(bootstrap, objects) : undefined) ??
    objects[0];
  const record =
    media.status === 'ready'
      ? media.media.find((media) => media.id === object?.id)
      : undefined;
  const settled = (!loading || !!error) && media.status !== 'loading';
  const navigationKey = locationQuery(location);
  const notified = useRef<string | null>(null);
  const [definition, setDefinition] = useState<GlossaryTerm | null>(null);
  const definitionTrigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!settled || notified.current === navigationKey) return;
    notified.current = navigationKey;
    onReady();
  }, [settled, navigationKey, onReady]);
  if (!s)
    return (
      <aside
        className="dossier"
        data-reading-ready={settled}
        data-media-status={media.status}
      >
        <button onClick={close}>Back to atlas</button>
        <h1 data-reading-title tabIndex={-1} ref={readingTitle}>
          This saved subject has changed
        </h1>
        <p>
          {error ||
            'This identifier is not part of the researched local release. Use search or a chapter to find a related subject.'}
        </p>
      </aside>
    );
  const related = corpus.relations.filter((r) => r.from === s.id || r.to === s.id);
  const learning = chapterLearning.find((row) => row.subject === s.id);
  // Keep a diagram's inspection mounted while its longer reading arrives.
  const readingSections =
    s.sections.length || object?.depiction !== 'explanatory diagram'
      ? s.sections
      : [{ title: '', text: '', citations: [] }];
  const partner = comparisonPartners(corpus, s)[0];
  const terms = corpus.glossary.filter((term) => s.terms.includes(term.id));
  const mainReading = glossaryReading(
    [s.summary, ...s.sections.map((section) => section.text)],
    terms,
  );
  const deeperReading = glossaryReading(
    (s.deeperReading ?? []).map((section) => section.text),
    terms,
  );
  const define = (term: GlossaryTerm, trigger: HTMLButtonElement) => {
    definitionTrigger.current = trigger;
    setDefinition(term);
  };
  return (
    <aside
      className="dossier"
      aria-label={`${s.name} dossier`}
      data-reading-ready={settled}
      data-media-status={media.status}
    >
      {location.object && !objects.some((item) => item.id === location.object) && (
        <p role="status">
          The image in this saved link is unavailable. Showing this subject’s available
          evidence.
        </p>
      )}
      <div className="dossier-top">
        <button onClick={close}>← Back to atlas</button>
        <button
          onClick={() => navigate({ evidence: !location.evidence })}
          aria-pressed={location.evidence}
          aria-controls="claim-evidence"
        >
          Sources
        </button>
      </div>
      <p className="eyebrow">
        {s.region} · {s.kind}
      </p>
      <h1 data-reading-title tabIndex={-1} ref={readingTitle}>
        {s.name}
      </h1>
      <p className="date-label">{s.interval.label}</p>
      <p className="place-label">⌖ {s.place}</p>
      <p className="question">{s.question}</p>
      <div
        className={`dossier-opening ${object && object.depiction !== 'explanatory diagram' ? 'has-image' : ''}`}
      >
        {object && object.depiction !== 'explanatory diagram' && (
          <MediaFigure
            key={object.id}
            object={object}
            details={
              record
                ? { status: 'ready', object: record }
                : media.status === 'ready'
                  ? {
                      status: 'failed',
                      recovery: 'reload',
                      reload: () => window.location.reload(),
                    }
                  : media
            }
            source={corpus.sources.find((x) => x.id === object.source)}
            sources={corpus.sources}
          />
        )}
        <p className="lead">
          <GlossaryText parts={mainReading[0]!} define={define} />
        </p>
      </div>
      {s.familyActivity && (
        <details className="family-start">
          <summary>
            {s.familyActivity.duration} · {s.familyActivity.title}
          </summary>
          {learning && (
            <section className="short-activity" aria-label="Short entry activity">
              <h2>A short starting activity</h2>
              <p>
                {learning.duration}. Ages 10–14 with an adult, or independent adult
                reading.
              </p>
              <p>{learning.shortOutcome}</p>
              <ol>
                {learning.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                Use the image or source reading supplied in this dossier. Describe what
                you can support and one thing it cannot settle.
              </p>
              <button
                onClick={() =>
                  save(
                    s.familyActivity!.title,
                    learning.shortOutcome +
                      ' What evidence supports your answer, and what remains uncertain?',
                    'question',
                  )
                }
              >
                Save my activity response
              </button>
              <details>
                <summary>Facilitator guide</summary>
                <p>{learning.facilitatorRubric}</p>
                <p>{s.familyActivity.explanation}</p>
                <p>{learning.revisit}</p>
              </details>
            </section>
          )}
          {learning && <h2>Continue the activity</h2>}
          <ol>
            {s.familyActivity.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <details>
            <summary>Talk about what you noticed</summary>
            <p>{s.familyActivity.explanation}</p>
          </details>
        </details>
      )}
      {mainReading.some((parts) => parts.some((part) => part.term)) && (
        <p className="reader-word-help">
          Dotted words open a short definition without leaving the story.
        </p>
      )}
      {s.deeperReading && (
        <nav className="reader-contents" aria-label="In this investigation">
          <a href="#main-explanation">Read the story</a>
          {s.contextIds?.length ? <a href="#wider-context">Time and place</a> : null}
          <a href="#deeper-reading">Go deeper</a>
          <a href={`?print=reader&subject=${s.id}`} target="_blank" rel="noreferrer">
            Print this investigation
          </a>
        </nav>
      )}
      {object?.depiction !== 'explanatory diagram' &&
        record &&
        record.notice.length > 0 && (
          <section className="notice">
            <h2>Look first</h2>
            <ul>
              {record.notice.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        )}
      <div className="actions">
        <button onClick={() => save(s.name, s.returnPrompt, 'subject')}>
          Save a question
        </button>
        <button
          disabled={!partner}
          onClick={() =>
            navigate({
              compare: partner?.id ?? null,
            })
          }
        >
          Compare two subjects
        </button>
        <button
          aria-controls="dossier-world-context"
          onClick={() => navigate(worldContext(location), 'context')}
        >
          Show in world context
        </button>
      </div>
      <p className="scope-note">
        {s.interval.note} {s.geographicPrecision}
      </p>
      {s.interval.alternatives?.length ? (
        <details>
          <summary>Alternative date treatments</summary>
          {s.interval.alternatives.map((a) => (
            <div key={a.label}>
              <p>{a.label}</p>
              <Citations citations={a.citations} sources={corpus.sources} />
            </div>
          ))}
        </details>
      ) : null}
      {loading && <p role="status">Loading the researched dossier…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button
            onClick={() => {
              readingTitle.current?.focus({ preventScroll: true });
              retry();
            }}
          >
            Retry dossier reading
          </button>
        </div>
      )}
      <div id="main-explanation" />
      {readingSections.map((section, i) => (
        <section className="dossier-section" key={i}>
          {section.title && <h2>{section.title}</h2>}
          {section.text && (
            <p>
              <GlossaryText parts={mainReading[i + 1]!} define={define} />
            </p>
          )}
          <Citations citations={section.citations} sources={corpus.sources} />
          {i === 0 && object?.depiction === 'explanatory diagram' && (
            <MediaFigure
              key={object.id}
              object={object}
              details={
                record
                  ? { status: 'ready', object: record }
                  : media.status === 'ready'
                    ? {
                        status: 'failed',
                        recovery: 'reload',
                        reload: () => window.location.reload(),
                      }
                    : media
              }
              source={corpus.sources.find((x) => x.id === object.source)}
              sources={corpus.sources}
            />
          )}
          {i === 0 &&
            object?.depiction === 'explanatory diagram' &&
            record &&
            record.notice.length > 0 && (
              <section className="notice">
                <h2>Look first</h2>
                <ul>
                  {record.notice.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            )}
          {i === 0 && objects.length > 1 && (
            <div className="object-choices">
              {section.title ? (
                <h3>Look at related objects</h3>
              ) : (
                <h2>Look at related objects</h2>
              )}
              {objects.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={m.id === object?.id}
                  onClick={() => navigate({ object: m.id })}
                >
                  {m.title}
                  <small>{m.date.label}</small>
                </button>
              ))}
            </div>
          )}
        </section>
      ))}
      {s.contextIds?.length ? (
        <div id="wider-context">
          <ReferenceTimeline subject={s} corpus={corpus} />
        </div>
      ) : null}
      {s.placeStudy && <PlaceMap study={s.placeStudy} sources={corpus.sources} />}
      {s.evidenceReading && (
        <section className="evidence-reading">
          <h2>{s.evidenceReading.title}</h2>
          <p>{s.evidenceReading.introduction}</p>
          {s.evidenceReading.items.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <blockquote>{item.text}</blockquote>
              <p>{item.interpretation}</p>
              <Citations citations={item.citations} sources={corpus.sources} />
            </article>
          ))}
        </section>
      )}
      {s.deeperReading && (
        <section id="deeper-reading" className="deeper-reading">
          <h2>Go deeper</h2>
          <p>
            Follow the institutions, sources and competing explanations behind this
            story.
          </p>
          {s.deeperReading.map((section, i) => (
            <details key={section.title}>
              <summary>{section.title}</summary>
              <p>
                <GlossaryText parts={deeperReading[i]!} define={define} />
              </p>
              <Citations citations={section.citations} sources={corpus.sources} />
            </details>
          ))}
        </section>
      )}
      {related.length > 0 && (
        <section className="dossier-section">
          <h2>Follow a supported connection</h2>
          {related.map((r) => {
            const target = corpus.subjects.find(
              (x) => x.id === (r.from === s.id ? r.to : r.from),
            );
            return (
              <article className="connection" key={r.id}>
                <p className="eyebrow">
                  {r.type} · {r.date}
                </p>
                <p>{r.explanation}</p>
                <Citations citations={r.citations} sources={corpus.sources} />
                {target && (
                  <button onClick={() => openSubject(target)}>
                    Follow to {target.name} →
                  </button>
                )}
              </article>
            );
          })}
        </section>
      )}
      <section className="dossier-section" id="claim-evidence">
        <h2 data-evidence-title tabIndex={-1}>
          How do we know?
        </h2>
        <p>
          Claims below were checked by Codex against the cited material. This is agent
          source consultation and self-review, not independent historian approval.
          Historical uncertainty can remain after a source is checked.
        </p>
        {s.review && (
          <p className="scope-note">
            {s.review.scope} Consulted {s.review.consultedOn}.{' '}
            {s.review.limitations.join(' ')}
          </p>
        )}
        {location.evidence && (
          <div className="claims">
            {s.claims.map((c) => (
              <article key={c.id}>
                <h3>{c.text}</h3>
                {c.uncertainty && <p className="uncertainty">{c.uncertainty}</p>}
                <Citations citations={c.citations} sources={corpus.sources} />
                <small>
                  {c.checkedBy} · {c.checkedOn}
                </small>
              </article>
            ))}
          </div>
        )}
        <button onClick={() => navigate({ evidence: !location.evidence })}>
          {location.evidence ? 'Fold claim notes' : 'Open claim-specific evidence'}
        </button>
      </section>
      {s.terms.length > 0 && (
        <section className="dossier-section glossary">
          <h2>Words for this investigation</h2>
          {s.terms.map((id) => {
            const term = corpus.glossary.find((t) => t.id === id);
            return (
              term && (
                <details key={id}>
                  <summary>{term.name}</summary>
                  <p>{term.definition}</p>
                </details>
              )
            );
          })}
        </section>
      )}
      <section className="revisit">
        <h2>Explain it back</h2>
        <p>{s.returnPrompt}</p>
        <button onClick={() => save(s.name, s.returnPrompt, 'question')}>
          Keep this question
        </button>
      </section>
      <GlossaryDefinition
        term={definition}
        dismiss={() => {
          setDefinition(null);
          if (definitionTrigger.current?.isConnected)
            definitionTrigger.current.focus({ preventScroll: true });
        }}
      />
    </aside>
  );
}
