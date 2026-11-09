import { useState } from 'react';
import type { RuntimeCorpus } from './model';
import { regions } from './model';
import { asset } from './data';
import { formatYear } from '../lib/years';
import {
  defaultJourneyFilters,
  matchesJourneyFilters,
  type JourneyFilters,
} from './journey-filters';
import { readResume } from './visit-state';
import { locationQuery, readLocation, type Location } from './navigation';
import chapterLearning from './chapter-learning.json';
import learningThemes from './learning-themes.json';
import printIndex from './short-print-index.json';

export function JourneyLibrary({
  corpus,
  location,
  changeFilters,
  start,
  navigate,
  openActivity,
}: {
  corpus: RuntimeCorpus;
  location: Location;
  changeFilters: (filters: JourneyFilters, replace?: boolean) => void;
  start: (id: string) => void;
  navigate: (location: Location) => void;
  openActivity: (id: string) => void;
}) {
  const filters = location.journeyFilters ?? defaultJourneyFilters;
  const { query, chapter, region, duration, theme, track } = filters;
  const changeFilter = (key: keyof JourneyFilters, value: string) =>
    changeFilters({ ...filters, [key]: value }, key === 'query');
  const [allActivities, setAllActivities] = useState(false);
  const [resume, setResume] = useState(readResume);
  const [message, setMessage] = useState('');
  const selectedTheme = learningThemes.find((row) => row.id === theme);
  const activities = allActivities
    ? chapterLearning
    : chapterLearning.filter((row) => ['C1', 'C4', 'C8'].includes(row.chapter));
  const resumed = resume ? readLocation(resume) : null;
  const continueReading = (saved: Location) =>
    navigate({
      ...saved,
      journeyFilters: location.journeyFilters,
      returnTo: locationQuery(location),
    });
  const resumedJourney = corpus.journeys.find((row) => row.id === resumed?.journey);
  const journeys = corpus.journeys.filter((journey) =>
    matchesJourneyFilters(journey, corpus, filters),
  );
  return (
    <section className="journeys-page">
      <div className="chapter-intro">
        <p className="eyebrow">Investigations across the atlas</p>
        <h1 tabIndex={-1}>Follow a good question.</h1>
        <p className="lead">
          Travel through objects and places, test an explanation, and return with a
          question of your own. Each journey can be taken one stop at a time.
        </p>
      </div>
      <details className="short-activity-choices" open>
        <summary>Start with a short activity · eight chapters</summary>
        <p>
          Choose one source question. Each entry has an estimated 5–10 minute task, a
          facilitator guide, and a way to save your thinking.
        </p>
        <div className="journey-grid">
          {activities.map((row) => (
            <article key={row.chapter}>
              <div>
                <p className="eyebrow">
                  {row.chapter} · {row.responseForm}
                </p>
                <h2>{corpus.subjects.find((s) => s.id === row.subject)?.name}</h2>
                <p>{row.shortOutcome}</p>
                <button onClick={() => openActivity(row.subject)}>
                  Open short activity
                </button>
                <button onClick={() => start(row.journey)}>
                  Follow the chapter route
                </button>
                {printIndex
                  .filter((file) => file.chapter === row.chapter)
                  .map((file) => (
                    <p key={file.chapter}>
                      <a href={asset(file.path)} download>
                        Activity PDF · {file.pages} pages ·{' '}
                        {Math.ceil(file.bytes / 1024)} KB
                      </a>
                    </p>
                  ))}
              </div>
            </article>
          ))}
        </div>
        <button onClick={() => setAllActivities((value) => !value)}>
          {allActivities
            ? 'Show three starting choices'
            : 'Show all 8 short activities'}
        </button>
      </details>
      {resume && (
        <div className="actions">
          <button onClick={() => continueReading(readLocation(resume))}>
            Continue previous reading
          </button>
          <button
            onClick={() => {
              try {
                localStorage.removeItem('chronos.resume');
                setResume(null);
              } catch {
                setMessage('Browser storage could not reset the reading position.');
              }
            }}
          >
            Reset reading position
          </button>
          <p>
            Your last reading is kept on this device. Notebook entries are separate.
          </p>
          {resumedJourney && (
            <p>
              {resumedJourney.title} · saved position: stop {(resumed?.step ?? 0) + 1}{' '}
              of {resumedJourney.stops.length}. This records your place, not mastery.
            </p>
          )}
        </div>
      )}
      <div className="journey-filters">
        <label>
          Reading track
          <select value={track} onChange={(e) => changeFilter('track', e.target.value)}>
            <option value="adult">Adult self-directed</option>
            <option value="family">Ages 10–14 with an adult</option>
          </select>
        </label>
        <label>
          Theme
          <select value={theme} onChange={(e) => changeFilter('theme', e.target.value)}>
            <option value="all">All themes</option>
            {learningThemes.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Find an investigation
          <input
            type="search"
            value={query}
            onChange={(e) => changeFilter('query', e.target.value)}
            placeholder="Try work, water, or power"
          />
        </label>
        <label>
          Period / chapter
          <select
            value={chapter}
            onChange={(e) => changeFilter('chapter', e.target.value)}
          >
            <option value="all">All chapters</option>
            {corpus.packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {formatYear(p.start)}–{formatYear(p.end)} · {p.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Region at any stop
          <select
            value={region}
            onChange={(e) => changeFilter('region', e.target.value)}
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>
          Suggested full-route time
          <select
            value={duration}
            onChange={(e) => changeFilter('duration', e.target.value)}
          >
            <option value="all">Any length</option>
            <option value="40">Up to 40 minutes</option>
            <option value="50">Up to 50 minutes</option>
          </select>
        </label>
        <button onClick={() => changeFilters(defaultJourneyFilters)}>
          Clear filters
        </button>
      </div>
      <p>
        {track === 'family'
          ? 'Read together: let the learner describe the evidence first. The adult can read the source capsule aloud and ask what supports the answer before opening the facilitator guide.'
          : 'Read independently: write an initial explanation, consult the source and its limits, then compare your reasoning with the guide and save a later reflection.'}
      </p>
      {selectedTheme && (
        <section aria-label="Three-stop theme reading">
          <h2>{selectedTheme.question}</h2>
          <ol>
            {selectedTheme.stops.map((stop) => {
              const subject = corpus.subjects.find((s) => s.id === stop.subject);
              if (!subject) return null;
              const target: Location = {
                ...location,
                destination: 'explore',
                subject: subject.id,
                pack: subject.packs[0] ?? location.pack,
                year: subject.interval.start ?? location.year,
                scale: 'local',
                returnTo: locationQuery(location),
              };
              return (
                <li key={stop.subject}>
                  <a
                    href={locationQuery(target)}
                    onClick={(event) => {
                      if (
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      navigate(target);
                    }}
                  >
                    {subject.name}
                  </a>
                  <p>
                    Read “{stop.section}”. {stop.prompt}
                  </p>
                </li>
              );
            })}
          </ol>
          {selectedTheme.limit && <p className="scope-note">{selectedTheme.limit}</p>}
        </section>
      )}
      <p role="status">
        {message || `${journeys.length} investigations match your choices.`}
      </p>
      {!journeys.length && (
        <p>
          No investigation matches these choices. Clear a filter or try a broader
          question. This is a selective collection.
        </p>
      )}
      <div className="journey-grid">
        {journeys.map((j) => {
          const image = corpus.media.find(
            (m) => m.id === j.stops.find((s) => s.object)?.object,
          );
          const outcome =
            chapterLearning.find((row) => row.journey === j.id)?.deeperOutcome ??
            j.returnPrompt;
          const savedStop =
            resumed?.journey === j.id && j.stops[resumed.step] ? resumed : null;
          return (
            <article key={j.id} aria-labelledby={`journey-card-${j.id}`}>
              {image && (
                <img
                  src={asset(image.thumbnail)}
                  alt=""
                  width="400"
                  height="240"
                  loading="lazy"
                />
              )}
              <div>
                <p className="eyebrow">
                  {j.duration} (estimated) · {j.stops.length} stops
                </p>
                <h2 id={`journey-card-${j.id}`}>{j.title}</h2>
                <p className="question">{j.question}</p>
                <p>{j.introduction}</p>
                <p>
                  <strong>Your task</strong> · {outcome}
                </p>
                {track === 'family' &&
                  (j.hasFamilyActivity ||
                    ('familyEvidence' in j && !!j.familyEvidence)) && (
                    <p>
                      <a href={asset(`/atlas/exports/family-${j.id}.pdf`)} download>
                        Family source activity PDF
                      </a>
                    </p>
                  )}
                {savedStop && (
                  <button onClick={() => continueReading(savedStop)}>
                    Continue at stop {savedStop.step + 1} of {j.stops.length}
                  </button>
                )}
                <button
                  aria-describedby={`journey-card-${j.id}`}
                  onClick={() => start(j.id)}
                >
                  Begin investigation →
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
