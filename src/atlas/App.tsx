import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { JourneySummary, RuntimePack as Pack, Subject } from './model';
import { regions } from './model';
import { formatYear, parseYearQuery, toT } from '../lib/years';
import { AtlasHeader, AtlasFooter } from './AtlasShell';
import { asset } from './data';
import {
  initialLocation,
  locationQuery,
  readLocation,
  fullHistory,
  type Location,
} from './navigation';
import { Timeline } from './Timeline';
import { StoryGallery } from './StoryGallery';
import { WorldContextLoader } from './WorldContextLoader';
import { includesYear } from './chronology';
import { ComparePinTray } from './ComparisonPins';
import { DossierContext } from './DossierContext';
import { DossierLoader } from './DossierLoader';
import { SearchLayer, type SearchHandle } from './Search';
import { JourneyLibraryLoader } from './JourneyLibraryLoader';
import { VisitEntry } from './VisitEntry';
import { EvidenceExercise } from './Evidence';
import { useJourneyDetails, type JourneyReadingState } from './use-journey-details';
import type { Note, NotebookSession } from './Notebook';
import { NotebookLoader } from './NotebookLoader';
import { captureNoteContext, mergeNotebooks } from './notebook-data';
import { useNotebook } from './use-notebook';
import { useAtlasData } from './use-atlas-data';
import { useAtlasNavigation, type ReadingTarget } from './use-atlas-navigation';
import {
  readQuestionDraft,
  readEditDraft,
  saveSessionDraft,
  type QuestionDraft,
} from './visit-state';
import './atlas.css';
import './exploration.css';
import legacyTargets from './legacy-targets.json';
const Compare = lazy(() =>
  import('./Compare').then(
    (module) => ({ default: module.Compare }),
    () => ({
      default: ({ close }: { close: () => void }) => (
        <section role="alert">
          <p>The comparison could not load. Reload the atlas to try again.</p>
          <button onClick={close}>Return to subject</button>
        </section>
      ),
    }),
  ),
);
function readTheme() {
  try {
    return localStorage.getItem('chronos.theme') === 'dark';
  } catch {
    return false;
  }
}
function JourneyInvitation({
  inquiry,
  onStart,
}: {
  inquiry: JourneySummary;
  onStart: (id: string) => void;
}) {
  return (
    <section className="journey-invitation">
      <p className="eyebrow">Follow an investigation</p>
      <h2>{inquiry.question}</h2>
      <p>{inquiry.introduction}</p>
      <button onClick={() => onStart(inquiry.id)}>Begin {inquiry.title} →</button>
    </section>
  );
}
function JourneyReadingNotice({
  reading,
  retry,
}: {
  reading: JourneyReadingState;
  retry: () => void;
}) {
  if (reading.status === 'loading')
    return <p role="status">Loading journey reading…</p>;
  if (reading.status !== 'failed') return null;
  return (
    <div role="status">
      <p>
        Journey reading is unavailable. The cases, source records and stop navigation
        remain available.
      </p>
      {reading.recovery === 'reload' ? (
        <button onClick={() => window.location.reload()}>Reload atlas</button>
      ) : (
        <button onClick={retry}>Retry journey reading</button>
      )}
    </div>
  );
}
export function Atlas() {
  const {
    corpus,
    error,
    bibliography,
    bibliographyNotice,
    bibliographyRetry,
    retryBibliography,
  } = useAtlasData();
  const {
    location,
    yearText,
    setYearText,
    navigate: changeLocation,
    requestReadingTarget,
    focusReading,
    refineControls,
  } = useAtlasNavigation(!!corpus);
  const [pinnedSubjects, setPinnedSubjects] = useState<string[]>([]);
  const pins = {
    ids: pinnedSubjects,
    toggle: (id: string) =>
      setPinnedSubjects((current) =>
        current.includes(id)
          ? current.filter((pinned) => pinned !== id)
          : current.length < 2
            ? [...current, id]
            : current,
      ),
  };
  useEffect(() => {
    if (!location.compare) return;
    const clearPins = () =>
      setPinnedSubjects((current) => (current.length ? [] : current));
    window.addEventListener('popstate', clearPins);
    return () => window.removeEventListener('popstate', clearPins);
  }, [location.compare]);
  const search = useRef<SearchHandle>(null);
  const [notebookSession, setNotebookSession] = useState<NotebookSession>({
    draft: readEditDraft(),
    removed: [],
  });
  const [saving, setSaving] = useState(false);
  const saveToken = useRef(0);
  const [message, setMessage] = useState('');
  const { book, getLatestBook, notebookPersisted, updateBook, recoverBook } =
    useNotebook(setMessage);
  const notebookReady = useCallback(
    (editing: boolean) => {
      if (editing) requestReadingTarget(null);
      else focusReading();
    },
    [requestReadingTarget, focusReading],
  );
  const [dark, setDark] = useState(readTheme);
  const [saveDraft, setSaveDraft] = useState<QuestionDraft | null>(readQuestionDraft);
  const [draftPersisted, setDraftPersisted] = useState(true);
  const saveDialog = useRef<HTMLDialogElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try {
      localStorage.setItem('chronos.theme', dark ? 'dark' : 'light');
    } catch {
      /* Appearance still works for this visit. */
    }
  }, [dark]);
  useEffect(() => {
    if (saveDraft) {
      if (!saveDialog.current?.open) saveDialog.current?.showModal();
    } else saveDialog.current?.close();
  }, [saveDraft]);
  useEffect(() => {
    const questionSaved = saveSessionDraft(
      'chronos.question-draft',
      saveDraft
        ? { ...saveDraft, locationQuery: locationQuery(saveDraft.location) }
        : null,
    );
    const editSaved = saveSessionDraft('chronos.edit-draft', notebookSession.draft);
    // Report the result of writing to external browser storage, not derived form state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftPersisted(questionSaved && editSaved);
  }, [saveDraft, notebookSession.draft]);
  useEffect(() => {
    if (location.destination !== 'explore' || (!location.subject && !location.journey))
      return;
    try {
      localStorage.setItem('chronos.resume', locationQuery(location));
    } catch {
      /* Current navigation still works. */
    }
  }, [location]);
  const navigate = useCallback(
    (next: Location, replace = false) => {
      changeLocation(next, replace);
      search.current?.close();
      setMessage('');
    },
    [changeLocation],
  );
  const patch = (next: Partial<Location>, focus?: ReadingTarget | null) => {
    navigate({ ...location, ...next });
    if (focus !== undefined) requestReadingTarget(focus);
  };
  function openSubject(s: Subject, objectId?: string, atYear = location.year) {
    const preferred = s.packs.includes(location.pack)
      ? location.pack
      : (s.packs[0] ?? 'C4');
    const p = corpus?.packs.find((p) => p.id === preferred);
    const numeric = s.interval.start ?? p?.anchor ?? 200;
    const y =
      p &&
      toT(atYear) >= toT(s.interval.start ?? p.start) &&
      toT(atYear) <= toT(s.interval.end ?? p.end)
        ? atYear
        : numeric;
    patch({
      legacy: null,
      destination: 'explore',
      scale: 'local',
      subject: s.id,
      preview: s.id,
      object: objectId && s.objectIds.includes(objectId) ? objectId : null,
      returnTo:
        !location.journey && !location.subject
          ? locationQuery({ ...location, year: atYear, preview: s.id })
          : location.returnTo,
      evidence: false,
      compare: null,
      pack: preferred,
      year: y,
    });
  }
  function openPack(p: Pack) {
    patch({
      legacy: null,
      destination: 'explore',
      scale: 'era',
      pack: p.id,
      year: p.anchor,
      region: location.region,
      subject: null,
      preview: null,
      object: null,
      compare: null,
      evidence: false,
      journey: null,
      returnTo: null,
    });
    window.scrollTo({ top: 0 });
  }
  function goYear(year: number) {
    if (!corpus) return;
    if (year < -3300 || year > 2000) {
      setMessage(
        'This atlas covers 3300 BCE–2000 CE. Choose a date within that program.',
      );
      search.current?.close();
      return;
    }
    const p = corpus.packs.find(
      (p) => toT(p.start) <= toT(year) && toT(p.end) >= toT(year),
    );
    if (!p) {
      setMessage('That date is outside the currently compiled chapters.');
      return;
    }
    patch({
      year,
      pack: p.id,
      scale: 'era',
      subject: null,
      preview: null,
      object: null,
      evidence: false,
      compare: null,
      journey: null,
      returnTo: null,
      destination: 'explore',
    });
  }
  function switchExploration(
    view: 'timeline' | 'world',
    year: number,
    preview: string | null,
  ) {
    const chapter = corpus?.packs.find(
      (item) => toT(item.start) <= toT(year) && toT(item.end) >= toT(year),
    );
    patch({
      view,
      year,
      preview,
      pack: chapter?.id ?? location.pack,
      subject: null,
      object: null,
      compare: null,
      evidence: false,
      journey: null,
      returnTo: null,
      scale: location.scale === 'world' ? 'world' : 'era',
    });
  }
  function save(title: string, question: string, kind: Note['kind']) {
    if (saveDraft) {
      setMessage('Finish or cancel your open question first.');
      return;
    }
    setSaveDraft({
      title,
      question,
      kind,
      answer: '',
      collection: 'Household',
      location: { ...location },
    });
  }
  function closeSave() {
    saveToken.current++;
    setSaving(false);
    setSaveDraft(null);
  }
  const pack = corpus?.packs.find((p) => p.id === location.pack) ?? corpus?.packs[0];
  const journey = corpus?.journeys.find((j) => j.id === location.journey);
  const journeyReading = useJourneyDetails(
    location.destination === 'explore' ? journey : undefined,
    corpus?.journeyDetailsDeferred === true,
  );
  const resolvedJourney =
    journeyReading.status === 'ready' ? journeyReading.journey : undefined;
  function retryJourneyReading() {
    requestReadingTarget(null);
    // The recovery button disappears while pending. Keep keyboard focus on the
    // existing stop heading, then leave it there when verified prose arrives.
    document
      .querySelector<HTMLElement>('.journey-context [data-journey-title]')
      ?.focus({ preventScroll: true });
    journeyReading.retry();
  }
  const step = journey ? Math.min(location.step, journey.stops.length - 1) : 0;
  const stop = journey?.stops[step];
  function goStop(index: number) {
    if (!journey || !corpus) return;
    const i = Math.min(journey.stops.length - 1, Math.max(0, index));
    const s = journey.stops[i]!;
    const subject = corpus.subjects.find((x) => x.id === s.subject)!;
    patch({
      journey: journey.id,
      step: i,
      subject: s.subject,
      object: s.object ?? null,
      year: s.year,
      scale: 'local',
      pack: subject.packs.includes(location.pack) ? location.pack : subject.packs[0]!,
      compare: null,
      evidence: false,
      destination: 'explore',
    });
    window.scrollTo({ top: 0 });
  }
  function startJourney(id: string) {
    const j = corpus?.journeys.find((j) => j.id === id);
    const s = j?.stops[0];
    const target = corpus?.subjects.find((x) => x.id === s?.subject);
    if (!j || !s || !target) return;
    patch({
      journey: id,
      step: 0,
      subject: s.subject,
      object: s.object ?? null,
      year: s.year,
      pack: target.packs[0]!,
      region: 'all',
      scale: 'local',
      view: 'world',
      compare: null,
      evidence: false,
      destination: 'explore',
      returnTo: locationQuery({ ...location, journey: null, returnTo: null }),
    });
  }
  function exitJourney() {
    navigate(
      readLocation(
        location.returnTo ??
          locationQuery({ ...initialLocation, pack: location.pack, scale: 'era' }),
      ),
    );
  }
  const selected = corpus?.subjects.find((s) => s.id === location.subject);
  let pageTitle = 'Chronos Atlas';
  if (error) pageTitle = 'Content unavailable · Chronos Atlas';
  else if (location.destination === 'notebook') pageTitle = 'Notebook · Chronos Atlas';
  else if (location.destination === 'journeys')
    pageTitle = 'Investigations · Chronos Atlas';
  else if (selected) {
    const other = corpus?.subjects.find((subject) => subject.id === location.compare);
    const reading = other
      ? `${selected.name} and ${other.name} · Comparison`
      : `${selected.name}${location.evidence ? ' · Sources' : ''}`;
    pageTitle = `${reading} · Chronos Atlas`;
  } else if (location.subject) pageTitle = 'Case unavailable · Chronos Atlas';
  else {
    const viewTitle = {
      timeline: 'Living timeline',
      world: 'Meanwhile elsewhere',
      stories: 'Historical stories',
    }[location.view];
    pageTitle = `${viewTitle} · ${formatYear(location.year)} · Chronos Atlas`;
  }
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  const activeRelation = corpus?.relations.find((r) => {
    if (!(
      r.id === stop?.relation ||
      r.from === location.subject ||
      r.to === location.subject
    ))
      return false;
    if (r.notBefore && location.year < r.notBefore) return false;
    return [r.from, r.to].every((id) => {
      const s = corpus.subjects.find((s) => s.id === id);
      return s && includesYear(s.interval, location.year);
    });
  });
  const worldPanel = corpus && pack && (
    <WorldContextLoader
      onReady={location.subject ? undefined : focusReading}
      key={`${location.year}:${location.region}:${location.pack}`}
      corpus={corpus}
      year={location.year}
      region={location.region}
      selected={location.preview ?? location.subject}
      openSubject={openSubject}
      goYear={goYear}
      relation={activeRelation}
      pack={pack}
      previewSubject={(id) => patch({ preview: id }, 'preview')}
      pins={pins}
      inDossier={!!location.subject}
      showTimeline={(year, preview) => switchExploration('timeline', year, preview)}
    />
  );
  if (error)
    return (
      <main className="page-reading">
        <h1>Atlas content could not load</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </main>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to atlas
      </a>
      <AtlasHeader
        location={location}
        dark={dark}
        navigate={navigate}
        searchButton={searchButton}
        openSearch={() => search.current?.open()}
        toggleTheme={() => setDark((value) => !value)}
      />
      {!corpus || !pack ? (
        <main id="main" className="page-reading" tabIndex={-1}>
          <h1>Opening the atlas…</h1>
          <p>Loading the local content index.</p>
        </main>
      ) : (
        <>
          <main id="main" tabIndex={-1}>
            {location.destination === 'explore' && (
              <>
                <section
                  className={`orientation exploration-controls ${location.subject ? 'reading-mode' : ''}`}
                  aria-label="Time and geographic scope"
                  data-presentation={location.view}
                  data-scale={location.scale}
                >
                  <button
                    className={
                      location.scale === 'world' && location.view === 'timeline'
                        ? 'active'
                        : ''
                    }
                    onClick={() => navigate(fullHistory(location))}
                  >
                    Full history
                  </button>
                  <details className="explore-refine" ref={refineControls}>
                    <summary>
                      Refine view
                      {location.region !== 'all' ? ` · ${location.region}` : ''}
                    </summary>
                    <div className="scope-controls">
                      <select
                        aria-label="Chapter"
                        value={location.scale === 'world' ? 'overview' : pack.id}
                        onChange={(e) =>
                          openPack(corpus.packs.find((p) => p.id === e.target.value)!)
                        }
                      >
                        <option value="overview" disabled>
                          Choose a chapter
                        </option>
                        {corpus.packs.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Region"
                        value={location.region}
                        onChange={(e) =>
                          patch({
                            region: e.target.value,
                            subject: null,
                            preview: null,
                            object: null,
                            compare: null,
                            scale: location.scale === 'world' ? 'world' : 'era',
                          })
                        }
                      >
                        <option value="all">All regions</option>
                        {regions.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </details>
                  <div className="view-switch" aria-label="Explore presentation">
                    <button
                      aria-pressed={location.view === 'timeline'}
                      onClick={() => patch({ view: 'timeline' })}
                    >
                      Living timeline
                    </button>
                    <button
                      aria-pressed={location.view === 'world'}
                      onClick={() =>
                        patch(
                          {
                            view: 'world',
                            scale: location.scale === 'world' ? 'era' : location.scale,
                          },
                          location.subject ? 'context' : undefined,
                        )
                      }
                    >
                      Meanwhile elsewhere
                    </button>
                    <button
                      aria-pressed={location.view === 'stories'}
                      onClick={() => patch({ view: 'stories' })}
                    >
                      Stories &amp; objects
                    </button>
                  </div>
                  {location.subject && (
                    <form
                      className="year-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const year = parseYearQuery(yearText);
                        if (year === null)
                          setMessage(
                            'Enter a year such as 1200 BCE or 200 CE. Historical dates have no year zero.',
                          );
                        else goYear(year);
                      }}
                    >
                      <label className="sr-only" htmlFor="year-input">
                        Go to year
                      </label>
                      <input
                        id="year-input"
                        value={yearText}
                        onChange={(e) => setYearText(e.target.value)}
                        aria-label="Go to year"
                      />
                      <button>Go</button>
                    </form>
                  )}
                </section>
                {location.journey && !journey && (
                  <aside role="status" className="page-reading">
                    <h2>This saved investigation is unavailable</h2>
                    <p>Choose an investigation from the library to continue.</p>
                    <button
                      onClick={() =>
                        patch({ destination: 'journeys', journey: null, step: 0 })
                      }
                    >
                      Open investigations
                    </button>
                  </aside>
                )}
                {journey && location.step !== step && (
                  <p role="status">
                    This saved stop exceeds the current investigation. Showing its final
                    stop.
                  </p>
                )}
                {journey && stop && (
                  <section
                    className="journey-context"
                    data-journey-id={journey.id}
                    data-journey-status={journeyReading.status}
                  >
                    <div>
                      <p className="eyebrow">
                        {journey.title} · Stop {step + 1} of {journey.stops.length}
                      </p>
                      <h2 data-journey-title tabIndex={-1}>
                        {stop.title}
                      </h2>
                      {resolvedJourney ? (
                        <p>{resolvedJourney.stops[step]!.narrative}</p>
                      ) : (
                        <JourneyReadingNotice
                          reading={journeyReading}
                          retry={retryJourneyReading}
                        />
                      )}
                    </div>
                    <div className="actions">
                      <button disabled={step === 0} onClick={() => goStop(step - 1)}>
                        Previous stop
                      </button>
                      {step < journey.stops.length - 1 ? (
                        <button onClick={() => goStop(step + 1)}>Next stop →</button>
                      ) : (
                        <button
                          onClick={() =>
                            document
                              .getElementById('journey-ending')
                              ?.scrollIntoView({ behavior: 'instant' })
                          }
                        >
                          Make your claim ↓
                        </button>
                      )}
                      {stop.compare && (
                        <button onClick={() => patch({ compare: stop.compare! })}>
                          Compare with{' '}
                          {corpus.subjects.find((s) => s.id === stop.compare)?.name}
                        </button>
                      )}
                      {location.subject !== stop.subject && (
                        <button onClick={() => goStop(step)}>
                          Return to this stop
                        </button>
                      )}
                      <button
                        className="quiet"
                        onClick={() =>
                          save(journey.title, journey.returnPrompt, 'journey')
                        }
                      >
                        Save journey
                      </button>
                      <button className="quiet" onClick={exitJourney}>
                        Exit journey
                      </button>
                    </div>
                  </section>
                )}
                {location.legacy && (
                  <section className="notice" aria-label="Legacy link disposition">
                    <h2>This earlier link has been reviewed</h2>
                    <p>
                      {(
                        legacyTargets as Record<
                          string,
                          { name: string; reason: string }
                        >
                      )[location.legacy]?.name ?? location.legacy}
                      :{' '}
                      {(legacyTargets as Record<string, { reason: string }>)[
                        location.legacy
                      ]?.reason ??
                        'This inherited identifier has no researched replacement in this selective release. Its unverified record is preserved in the disposition ledger; use search or a chapter for released content.'}
                    </p>
                    <a href={asset('/atlas/legacy-disposition.json')}>
                      Read the complete legacy disposition ledger
                    </a>
                    <button onClick={() => patch({ legacy: null })}>
                      Dismiss this explanation
                    </button>
                  </section>
                )}
                {location.year < -3300 || location.year > 2000 ? (
                  <p className="notice">
                    This copied link is outside the atlas’s 3300 BCE–2000 CE coverage.
                    Use Full history or choose an included date.
                  </p>
                ) : null}
                {location.compare && location.subject ? (
                  <Suspense
                    fallback={
                      <p role="status" data-reading-title data-reading-ready="false">
                        Opening comparison…
                      </p>
                    }
                  >
                    <Compare
                      onReady={focusReading}
                      corpus={corpus}
                      left={location.subject}
                      right={location.compare}
                      setRight={(id) => patch({ compare: id })}
                      close={() => patch({ compare: null })}
                      save={() =>
                        save(
                          `${selected?.name} / ${corpus.subjects.find((s) => s.id === location.compare)?.name}`,
                          'What comparison is supported, and where is evidence unequal?',
                          'comparison',
                        )
                      }
                    />
                  </Suspense>
                ) : (
                  <div
                    className={`atlas-layout ${location.subject ? 'has-dossier' : ''}`}
                    data-presentation={location.view}
                  >
                    {location.subject && (
                      <DossierLoader
                        key={location.subject}
                        corpus={corpus}
                        location={location}
                        close={() => {
                          if (!location.journey && location.returnTo)
                            navigate(readLocation(location.returnTo));
                          else
                            patch({
                              subject: null,
                              object: null,
                              compare: null,
                              evidence: false,
                              scale: 'era',
                            });
                        }}
                        navigate={patch}
                        openSubject={openSubject}
                        save={save}
                        onReady={focusReading}
                      />
                    )}
                    {location.subject ? (
                      <DossierContext key={`${location.subject}:${location.view}`}>
                        {worldPanel}
                      </DossierContext>
                    ) : (
                      <div className="atlas-context">
                        {location.view === 'stories' ? (
                          <StoryGallery
                            corpus={corpus}
                            location={location}
                            pack={pack}
                            openSubject={openSubject}
                            openPack={openPack}
                          />
                        ) : location.view === 'world' ? (
                          worldPanel
                        ) : (
                          <Timeline
                            corpus={corpus}
                            location={location}
                            pack={pack}
                            openSubject={openSubject}
                            openPack={openPack}
                            goYear={goYear}
                            previewSubject={(id) => patch({ preview: id }, 'preview')}
                            pins={pins}
                            compareWorld={(year, preview) =>
                              switchExploration('world', year, preview)
                            }
                          />
                        )}
                        {!location.journey && (
                          <VisitEntry
                            moment={() => patch({ view: 'world' })}
                            investigate={() => startJourney(pack.journey)}
                            navigate={navigate}
                          />
                        )}
                        {!journey &&
                          !(
                            location.view === 'stories' && location.scale === 'world'
                          ) &&
                          [
                            { journey: pack.journey },
                            ...(pack.investigations ?? []),
                          ].map(({ journey: id }) => {
                            const inquiry = corpus.journeys.find((j) => j.id === id);
                            return (
                              inquiry && (
                                <JourneyInvitation
                                  key={id}
                                  inquiry={inquiry}
                                  onStart={startJourney}
                                />
                              )
                            );
                          })}
                      </div>
                    )}
                    {journey && stop && step === journey.stops.length - 1 && (
                      <section
                        id="journey-ending"
                        className="journey-ending"
                        data-journey-status={journeyReading.status}
                      >
                        <h2>Return to the world</h2>
                        {resolvedJourney ? (
                          <p>{resolvedJourney.conclusion}</p>
                        ) : (
                          <p>
                            The closing reading and source question are unavailable
                            until journey reading loads. Use the recovery control beside
                            the stop heading if loading fails.
                          </p>
                        )}
                        {stop.compare && (
                          <button onClick={() => patch({ compare: stop.compare! })}>
                            Compare {selected?.name} with{' '}
                            {corpus.subjects.find((s) => s.id === stop.compare)?.name}
                          </button>
                        )}
                        {resolvedJourney && (
                          <EvidenceExercise
                            key={journey.id}
                            question={resolvedJourney.evidence}
                            sources={corpus.sources}
                          />
                        )}
                        <p className="question">{journey.returnPrompt}</p>
                        <button
                          onClick={() =>
                            save(journey.title, journey.returnPrompt, 'question')
                          }
                        >
                          Save this question
                        </button>
                        <button onClick={exitJourney}>Return to my exploration</button>
                      </section>
                    )}
                  </div>
                )}
                {!location.compare && (
                  <ComparePinTray
                    names={pinnedSubjects.flatMap((id) => {
                      const subject = corpus.subjects.find((s) => s.id === id);
                      return subject ? [subject.name] : [];
                    })}
                    clear={() => setPinnedSubjects([])}
                    compare={() => {
                      const [left, right] = pinnedSubjects;
                      if (!left || !right) return;
                      setPinnedSubjects([]);
                      patch({
                        legacy: null,
                        scale: 'local',
                        subject: left,
                        preview: left,
                        compare: right,
                        object: null,
                        evidence: false,
                        journey: null,
                        returnTo: locationQuery(location),
                      });
                    }}
                  />
                )}
              </>
            )}
            {location.destination === 'journeys' && (
              <JourneyLibraryLoader
                corpus={corpus}
                location={location}
                changeFilters={(journeyFilters, replace) => {
                  navigate({ ...location, journeyFilters }, replace);
                  requestReadingTarget(null);
                }}
                onReady={focusReading}
                start={startJourney}
                navigate={navigate}
                openActivity={(id) => {
                  const subject = corpus.subjects.find((s) => s.id === id);
                  if (subject) {
                    openSubject(subject);
                    requestReadingTarget('activity');
                  }
                }}
              />
            )}
            {location.destination === 'notebook' && (
              <NotebookLoader
                onReady={notebookReady}
                book={book}
                onChange={updateBook}
                navigate={navigate}
                session={notebookSession}
                persisted={notebookPersisted}
                onRecovered={recoverBook}
                onSessionChange={setNotebookSession}
                onImport={(incoming) => {
                  const result = mergeNotebooks(getLatestBook(), incoming);
                  return updateBook(result.book);
                }}
              />
            )}
          </main>
          <AtlasFooter packId={pack.id} />
        </>
      )}
      {(bibliography === 'loading' || bibliography === 'failed' || message) && (
        <div className="app-messages">
          {(bibliography === 'loading' || bibliography === 'failed') && (
            <div
              className="app-message bibliography-status"
              role="status"
              tabIndex={-1}
              ref={bibliographyNotice}
            >
              <span>
                {bibliography === 'loading'
                  ? 'Loading source titles and record links. Reading and pictures stay available.'
                  : 'Source titles and record links could not load. Reading and pictures stay available.'}
              </span>
              {bibliography === 'failed' && (
                <button ref={bibliographyRetry} onClick={retryBibliography}>
                  Retry source records
                </button>
              )}
            </div>
          )}
          {message && (
            <div className="app-message" role="status">
              <span>{message}</span>
              <button onClick={() => setMessage('')}>Dismiss</button>
            </div>
          )}
        </div>
      )}
      {corpus && (
        <SearchLayer
          ref={search}
          corpus={corpus}
          close={() => {
            search.current?.close();
            requestAnimationFrame(() => searchButton.current?.focus());
          }}
          openSubject={openSubject}
          goYear={goYear}
          startJourney={startJourney}
        />
      )}
      <dialog
        ref={saveDialog}
        className="save-dialog"
        onCancel={closeSave}
        onClose={() => {
          if (!saveDialog.current?.open) closeSave();
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!saveDraft || !corpus || saving) return;
            const f = new FormData(e.currentTarget);
            const token = ++saveToken.current;
            setSaving(true);
            const context = await captureNoteContext(corpus, saveDraft.location);
            if (token !== saveToken.current) return;
            const note: Note = {
              id: crypto.randomUUID(),
              title: saveDraft.title,
              kind: saveDraft.kind,
              question: String(f.get('question')),
              answer: String(f.get('answer')),
              collection: String(f.get('collection') || 'Household'),
              saved: new Date().toISOString(),
              location: locationQuery({
                ...saveDraft.location,
                object: context.object,
              }),
              context,
            };
            const latest = getLatestBook();
            const persisted = await updateBook({
              ...latest,
              notes: [note, ...latest.notes],
            });
            // A cancelled save may finish after a different draft has opened.
            if (token !== saveToken.current) return;
            closeSave();
            if (persisted) {
              setMessage('Saved on this device. Revisit it from Notebook.');
            }
          }}
        >
          <h2>Keep a question</h2>
          <p>{saveDraft?.title}</p>
          <p role="status">
            {draftPersisted
              ? 'Draft kept in this tab across reloads. Cancel discards it.'
              : 'Draft storage is unavailable. Keep this tab open until you save or copy your answer.'}
          </p>
          <label>
            Question
            <textarea
              name="question"
              disabled={saving}
              value={saveDraft?.question ?? ''}
              onChange={(e) =>
                setSaveDraft((d) => (d ? { ...d, question: e.target.value } : d))
              }
              maxLength={10000}
              required
            />
          </label>
          <label>
            Your thinking, if you want to record it
            <textarea
              name="answer"
              disabled={saving}
              maxLength={10000}
              value={saveDraft?.answer ?? ''}
              onChange={(e) =>
                setSaveDraft((d) => (d ? { ...d, answer: e.target.value } : d))
              }
            />
          </label>
          <label>
            Collection
            <input
              name="collection"
              disabled={saving}
              value={saveDraft?.collection ?? 'Household'}
              maxLength={100}
              onChange={(e) =>
                setSaveDraft((d) => (d ? { ...d, collection: e.target.value } : d))
              }
            />
          </label>
          <div className="actions">
            <button
              disabled={saving}
              aria-label="Save on this device"
              aria-busy={saving}
            >
              {saving ? 'Saving…' : 'Save on this device'}
            </button>
            <button type="button" onClick={closeSave}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
