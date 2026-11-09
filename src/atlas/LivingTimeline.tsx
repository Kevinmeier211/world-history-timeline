import { useState } from 'react';
import { formatYear, toT } from '../lib/years';
import type { ComparePinControls } from './ComparisonPins';
import { explorationSelection, timeTicks } from './exploration';
import { LivingTimelineChart } from './LivingTimelineChart';
import type { RuntimePack as Pack, RuntimeCorpus, Subject } from './model';
import type { Location } from './navigation';
import { StoryPreview } from './StoryPreview';
import { TimeNavigator } from './TimeExplorer';

export function LivingTimeline({
  corpus,
  location,
  pack,
  openSubject,
  openPack,
  goYear,
  previewSubject,
  compareWorld,
  pins,
}: {
  corpus: RuntimeCorpus;
  location: Location;
  pack: Pack;
  openSubject: (subject: Subject, object?: string, year?: number) => void;
  openPack: (pack: Pack) => void;
  goYear: (year: number) => void;
  previewSubject: (id: string) => void;
  compareWorld: (year: number, subject: string | null) => void;
  pins?: ComparePinControls;
}) {
  const [year, setYear] = useState(location.year);
  const available = corpus.subjects.filter(
    (subject) =>
      (location.scale === 'world' || subject.packs.includes(pack.id)) &&
      (location.region === 'all' || subject.region === location.region),
  );
  const selected = explorationSelection(corpus, available, year, location.preview);
  const window =
    location.scale === 'world'
      ? { start: -3300, end: 2000 }
      : (pack.displayWindow ?? { start: pack.start, end: pack.end });
  const ticks = timeTicks(window);
  const position = (value: number) =>
    (100 * (toT(value) - toT(window.start))) / (toT(window.end) - toT(window.start));
  const line = position(year);
  return (
    <section className="living-timeline" aria-label="Living timeline">
      <header className="exploration-heading">
        <div>
          <p className="eyebrow">
            {location.scale === 'world' ? '3300 BCE–2000 CE' : pack.title}
          </p>
          <h1 data-context-title tabIndex={-1}>
            The world, side by side.
          </h1>
          <p>Move through time. Find a life behind the dates.</p>
        </div>
        <button
          className="comparison-invitation"
          onClick={() => compareWorld(year, selected?.id ?? null)}
        >
          Compare this moment ↗
        </button>
      </header>
      <TimeNavigator
        key={`${location.year}:${location.scale}:${pack.id}:${location.region}`}
        corpus={corpus}
        year={location.year}
        region={location.region}
        goYear={goYear}
        range={window}
        onPreview={setYear}
      />
      <div className="living-workbench">
        {selected && (
          <aside className="living-preview" aria-label="Selected timeline story">
            <StoryPreview
              key={selected.id}
              corpus={corpus}
              subject={selected}
              year={year}
              openSubject={(subject, object) => openSubject(subject, object, year)}
              priority
            />
          </aside>
        )}
        <LivingTimelineChart
          corpus={corpus}
          available={available}
          axis={{ window, ticks, position, line }}
          location={location}
          year={year}
          selected={selected}
          openSubject={(subject) => openSubject(subject, undefined, year)}
          previewSubject={previewSubject}
          pins={pins}
        />
      </div>
      <nav className="living-chapters" aria-label="Explore chapters">
        {corpus.packs.map((chapter) => (
          <button
            key={chapter.id}
            aria-current={
              location.scale !== 'world' && chapter.id === pack.id ? 'true' : undefined
            }
            onClick={() => openPack(chapter)}
          >
            <small>
              {formatYear(chapter.start)}–{formatYear(chapter.end)}
            </small>
            <span>{chapter.title}</span>
          </button>
        ))}
      </nav>
    </section>
  );
}
