import { useEffect, useState } from 'react';
import type {
  RuntimeCorpus,
  Relation,
  Subject,
  RuntimePack as Pack,
  RegionalSnapshotReading,
} from './model';
import { loadRegionalSnapshots } from './data';
import { regions } from './model';
import { formatYear } from '../lib/years';
import {
  distanceFromInterval,
  includesYear,
  nearbyDateLabel,
  nearbyYearLimit,
  worldAtTime,
} from './chronology';
import { AtlasMap } from './AtlasMap';
import { Citations } from './Evidence';
import { TimeNavigator } from './TimeExplorer';
import { explorationSelection, regionalStartingPoints } from './exploration';
import { RegionalCards } from './RegionalCards';
import type { ComparePinControls } from './ComparisonPins';
import { ReferenceFrame } from './ReferenceFrame';
import { StoryPreview } from './StoryPreview';
import { regionalSnapshot } from './snapshot';
import { ChapterRegionalReading } from './RegionalReading';

export function WorldContext({
  corpus,
  year,
  region,
  selected,
  openSubject,
  goYear,
  relation,
  pack,
  previewSubject,
  showTimeline,
  pins,
  inDossier,
}: {
  corpus: RuntimeCorpus;
  year: number;
  region: string;
  selected: string | null;
  openSubject: (s: Subject, object?: string, year?: number) => void;
  goYear: (year: number) => void;
  relation?: Relation;
  pack: Pack;
  previewSubject: (id: string) => void;
  showTimeline: (year: number, subject: string | null) => void;
  pins?: ComparePinControls;
  inDossier?: boolean;
}) {
  const [viewYear, setViewYear] = useState(year);
  const [snapshotReadings, setSnapshotReadings] = useState<
    RegionalSnapshotReading[] | null
  >(null);
  const [snapshotError, setSnapshotError] = useState(false);
  const [snapshotAttempt, setSnapshotAttempt] = useState(0);
  useEffect(() => {
    if (!corpus.regionalSnapshotsDeferred) return;
    let active = true;
    loadRegionalSnapshots()
      .then((rows) => {
        if (active) setSnapshotReadings(rows);
      })
      .catch(() => {
        if (active) setSnapshotError(true);
      });
    return () => {
      active = false;
    };
  }, [corpus.regionalSnapshotsDeferred, snapshotAttempt]);
  const snapshotsReady = !corpus.regionalSnapshotsDeferred || snapshotReadings !== null;
  const [frameRegion, setFrameRegion] = useState(() =>
    region !== 'all'
      ? region
      : (corpus.subjects.find((s) => s.id === selected)?.region ?? 'Europe'),
  );
  const snapshot = worldAtTime(corpus, viewYear, region);
  const regionalFrames = regionalSnapshot(
    { ...corpus, regionalSnapshots: snapshotReadings ?? corpus.regionalSnapshots },
    viewYear,
    region,
  );
  const activeFrameRegion = regionalFrames.some((row) => row.region === frameRegion)
    ? frameRegion
    : regionalFrames[0]?.region;
  const focus = corpus.subjects.find((s) => s.id === selected);
  const points = [...snapshot.current, ...snapshot.nearby];
  if (focus && !points.some((s) => s.id === focus.id)) points.push(focus);
  const preview = explorationSelection(corpus, points, viewYear, selected);
  const cards = regionalStartingPoints(points, viewYear).map((subject) =>
    preview?.region === subject.region &&
    distanceFromInterval(preview.interval, viewYear) <= nearbyYearLimit
      ? preview
      : subject,
  );
  const visibleRelation =
    relation &&
    (!relation.notBefore || viewYear >= relation.notBefore) &&
    [relation.from, relation.to].every((id) => {
      const subject = corpus.subjects.find((item) => item.id === id);
      return subject && includesYear(subject.interval, viewYear);
    })
      ? relation
      : undefined;
  const Heading = inDossier ? 'h2' : 'h1';
  return (
    <section className="world-context meanwhile-view">
      <header className="exploration-heading">
        <div>
          <p className="eyebrow">A shared moment. Different worlds.</p>
          <Heading
            data-context-title={inDossier ? undefined : true}
            tabIndex={inDossier ? undefined : -1}
          >
            Meanwhile, around {formatYear(viewYear)}…
          </Heading>
          <p>
            Compare regional starting points. Shared dates do not establish contact.
          </p>
        </div>
        <button onClick={() => showTimeline(viewYear, preview?.id ?? null)}>
          ← Living timeline
        </button>
      </header>
      <TimeNavigator
        key={`${year}:${region}`}
        corpus={corpus}
        year={year}
        region={region}
        goYear={goYear}
        range={pack.displayWindow ?? { start: pack.start, end: pack.end }}
        onPreview={setViewYear}
      />
      <section
        className="snapshot-orientation"
        aria-label="Historical context by region"
      >
        <h2>Historical context at {formatYear(viewYear)}</h2>
        <p>
          Choose a region for its dated frame, then inspect a case or object. A missing
          frame means this atlas has not covered that region at this date.
        </p>
        <label>
          Regional frame
          <select
            value={activeFrameRegion}
            onChange={(e) => setFrameRegion(e.target.value)}
          >
            {regionalFrames.map((row) => (
              <option key={row.region} value={row.region}>
                {row.region}
                {row.status === 'frame-gap' && snapshotsReady
                  ? ' · not yet covered'
                  : ''}
              </option>
            ))}
          </select>
        </label>
        <div className="snapshot-regions" aria-live="polite">
          {regionalFrames
            .filter((row) => row.region === activeFrameRegion)
            .map(({ region: r, frames, reading }) => {
              return (
                <article key={r}>
                  <h3>{r}</h3>
                  {reading && (
                    <section className="curated-snapshot-reading">
                      <h4>Around this date</h4>
                      <p>{reading.text}</p>
                      <Citations
                        citations={reading.citations}
                        sources={corpus.sources}
                      />
                      <ChapterRegionalReading
                        key={reading.orientation}
                        corpus={corpus}
                        chapter={reading.orientation.split('-')[0]!}
                        selectedRegion={r}
                        openSubject={openSubject}
                      />
                    </section>
                  )}
                  {!snapshotsReady && (
                    <p role="status">
                      {snapshotError ? (
                        <>
                          Snapshot reading could not load.{' '}
                          <button
                            onClick={() => {
                              setSnapshotError(false);
                              setSnapshotAttempt((n) => n + 1);
                            }}
                          >
                            Retry snapshot reading
                          </button>
                        </>
                      ) : (
                        'Loading dated snapshot reading…'
                      )}
                    </p>
                  )}
                  {frames.length ? (
                    frames.map((frame) => (
                      <div key={frame.id}>
                        <h4>{frame.title}</h4>
                        <p className="eyebrow">{frame.interval.label}</p>
                        <p>{frame.summary}</p>
                        {frame.interval.note && (
                          <p className="scope-note">{frame.interval.note}</p>
                        )}
                        <Citations
                          citations={frame.citations}
                          sources={corpus.sources}
                        />
                        {frame.subjectIds.map((id) => {
                          const subject = corpus.subjects.find((s) => s.id === id);
                          return subject ? (
                            <button key={id} onClick={() => openSubject(subject)}>
                              Read {subject.name}
                            </button>
                          ) : null;
                        })}
                      </div>
                    ))
                  ) : !reading && snapshotsReady ? (
                    <p className="scope-note">
                      This atlas has no researched regional frame spanning{' '}
                      {formatYear(viewYear)} here. Nearby readings below retain their
                      own dates.
                    </p>
                  ) : null}
                </article>
              );
            })}
        </div>
      </section>
      <div className="meanwhile-workbench">
        <AtlasMap
          key={`${viewYear}:${region}`}
          subjects={points}
          selected={preview?.id ?? null}
          year={viewYear}
          onSelect={(subject) => previewSubject(subject.id)}
          onOpen={openSubject}
          compact
          relation={visibleRelation}
          nearbyIds={points
            .filter((s) => !snapshot.current.some((item) => item.id === s.id))
            .map((s) => s.id)}
        />
        {preview && (
          <aside className="meanwhile-preview" aria-label="Selected regional story">
            <StoryPreview
              key={preview.id}
              corpus={corpus}
              subject={preview}
              year={viewYear}
              openSubject={(subject, object) => openSubject(subject, object, viewYear)}
              priority
            />
          </aside>
        )}
      </div>
      {visibleRelation && (
        <section className="scope-note" aria-label="Evidence for the mapped connection">
          <h2>What supports this connection?</h2>
          <p>{visibleRelation.date}</p>
          <p>{visibleRelation.explanation}</p>
          <p>
            The dashed line is a schematic network with intermediaries, not an exact
            journey or a boundary. Each linked case retains its own dates.
          </p>
          <Citations citations={visibleRelation.citations} sources={corpus.sources} />
        </section>
      )}
      <RegionalCards
        corpus={corpus}
        year={viewYear}
        rows={regionalFrames}
        cards={cards}
        selected={preview?.id}
        previewSubject={previewSubject}
        pins={pins}
      />
      <details className="world-reading-notes">
        <summary>All regional readings, reference frames &amp; source notes</summary>
        {!snapshot.current.length && (
          <p className="notice">
            No case study in this selection spans {formatYear(viewYear)}. The reference
            context and nearest investigations below provide a starting point; their
            dates have not been widened to fill the map.
          </p>
        )}
        {snapshot.contexts.length > 0 && (
          <section className="reference-contexts">
            <h2>A wider historical frame</h2>
            {snapshot.contexts.map((context) => (
              <ReferenceFrame
                key={context.id}
                frame={context}
                corpus={corpus}
                openSubject={openSubject}
              />
            ))}
          </section>
        )}
        {regions
          .filter((r) => region === 'all' || region === r)
          .map((r) => {
            const current = snapshot.current.filter((s) => s.region === r);
            const nearby = snapshot.nearby.filter((s) => s.region === r);
            return (
              <section key={r} className="regional-snapshot">
                <h2>{r}</h2>
                {current.map((s) => (
                  <button key={s.id} onClick={() => openSubject(s)}>
                    <strong>{s.name}</strong>
                    <small>
                      Includes {formatYear(viewYear)} · {s.interval.label}
                    </small>
                    <span>{s.summary}</span>
                  </button>
                ))}
                {nearby.map((s) => (
                  <article key={s.id} className="nearby-context">
                    <p className="eyebrow">
                      Nearby investigation · {nearbyDateLabel(s.interval, viewYear)} ·{' '}
                      {s.interval.label}
                    </p>
                    <button onClick={() => openSubject(s)}>
                      <strong>{s.name}</strong>
                      <span>{s.summary}</span>
                    </button>
                    <p className="scope-note">
                      This is a reading suggestion from a different date, not a claim
                      that the pictured object or event belongs to{' '}
                      {formatYear(viewYear)}.
                    </p>
                  </article>
                ))}
              </section>
            );
          })}
      </details>
    </section>
  );
}
