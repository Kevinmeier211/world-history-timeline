import type {
  MediaSummary,
  RuntimePack as Pack,
  RuntimeCorpus,
  Subject,
} from './model';
import type { Location } from './navigation';
import { formatYear } from '../lib/years';
import { ObjectImage } from './MediaFigure';
import { storySelection } from './story-selection';
import './story-gallery.css';

function ImageProvenance({
  object,
  corpus,
}: {
  object: MediaSummary;
  corpus: RuntimeCorpus;
}) {
  const source = corpus.sources.find((source) => source.id === object.source);
  return (
    <details className="story-image-credit">
      <summary>Image &amp; source</summary>
      <p>{object.title}</p>
      <p>{object.credit}</p>
      <p>{object.rights}</p>
      {object.licenseUrl && (
        <a href={object.licenseUrl} target="_blank" rel="noreferrer">
          Image licence ↗
        </a>
      )}
      {source?.url && (
        <a href={source.url} target="_blank" rel="noreferrer">
          {source.institution} · original record ↗
        </a>
      )}
    </details>
  );
}
export function StoryGallery({
  corpus,
  location,
  pack,
  openSubject,
  openPack,
}: {
  corpus: RuntimeCorpus;
  location: Location;
  pack: Pack;
  openSubject: (subject: Subject, object?: string) => void;
  openPack: (pack: Pack) => void;
}) {
  const allHistory = location.scale === 'world';
  const { entries, featured } = storySelection(
    corpus,
    allHistory ? null : pack.id,
    location.region,
  );
  const [first, ...rest] = featured;
  return (
    <section className="story-gallery" aria-label="Stories and objects">
      <header className="story-gallery-intro">
        <p className="eyebrow">
          {allHistory ? '3300 BCE — 2000 CE' : pack.title}
          {location.region !== 'all' && ` · ${location.region}`}
        </p>
        <h1 data-context-title tabIndex={-1}>
          {allHistory ? 'A world made by people.' : 'Find a story. Look closer.'}
        </h1>
        <p>
          Start with something people made, a place they built or a moment someone
          recorded. Follow it into a story of work, belief and everyday life.
        </p>
      </header>
      {first?.object && (
        <article className="story-feature" data-subject={first.subject.id}>
          <div className="story-feature-image">
            <button
              className="story-image-button"
              aria-label={`Look closer: ${first.subject.name}`}
              onClick={() => openSubject(first.subject, first.object!.id)}
            >
              <ObjectImage
                object={first.object}
                thumb
                priority
                fallbackControls={false}
              />
              <span>Look closer ↗</span>
            </button>
            <ImageProvenance object={first.object} corpus={corpus} />
          </div>
          <div className="story-feature-reading">
            <p className="eyebrow">Start here · {first.subject.region}</p>
            <h2>{first.subject.question}</h2>
            <p className="story-feature-name">{first.subject.name}</p>
            <p>{first.subject.summary}</p>
            <p className="story-object-date">
              <strong>Pictured:</strong> {first.object.date.label}
            </p>
            <button
              className="story-read-button"
              onClick={() => openSubject(first.subject, first.object!.id)}
            >
              Read this story →
            </button>
          </div>
        </article>
      )}
      {rest.length > 0 && (
        <section className="story-shelf" aria-labelledby="story-shelf-title">
          <div className="story-shelf-intro">
            <h2 id="story-shelf-title">Where will you look next?</h2>
            <p>Different places and dates. Each opens its own investigation.</p>
          </div>
          <div className="story-card-grid">
            {rest.map(({ subject, object }) => (
              <article
                className="story-card"
                key={subject.id}
                data-subject={subject.id}
              >
                <button
                  className="story-image-button"
                  aria-label={`Explore ${subject.name}`}
                  onClick={() => openSubject(subject, object!.id)}
                >
                  <ObjectImage object={object!} thumb fallbackControls={false} />
                </button>
                <div className="story-card-reading">
                  <p className="eyebrow">{subject.region}</p>
                  <h3>
                    <button onClick={() => openSubject(subject, object!.id)}>
                      {subject.question} <span aria-hidden="true">→</span>
                    </button>
                  </h3>
                  <p>{subject.name}</p>
                  <p className="story-object-date">Pictured: {object!.date.label}</p>
                  <ImageProvenance object={object!} corpus={corpus} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {allHistory && (
        <section className="story-chapters" aria-labelledby="story-chapters-title">
          <h2 id="story-chapters-title">Choose a chapter</h2>
          <div>
            {corpus.packs.map((chapter, index) => (
              <button key={chapter.id} onClick={() => openPack(chapter)}>
                <span className="eyebrow">Chapter {index + 1}</span>
                <strong>{chapter.title}</strong>
                <span>
                  {formatYear(chapter.start)} — {formatYear(chapter.end)}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      <details className="story-directory">
        <summary>Browse all {entries.length} investigations in this selection</summary>
        <div>
          {entries.map(({ subject }) => (
            <button key={subject.id} onClick={() => openSubject(subject)}>
              <strong>{subject.name}</strong>
              <span>
                {subject.interval.label} · {subject.region}
              </span>
            </button>
          ))}
        </div>
      </details>
      {!entries.length && (
        <p>
          No investigations match this chapter and region. Choose another selection.
        </p>
      )}
    </section>
  );
}
