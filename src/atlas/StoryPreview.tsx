import { useMemo, useState } from 'react';
import { formatYear } from '../lib/years';
import { includesYear } from './chronology';
import { Citations } from './Evidence';
import { explorationObject } from './exploration';
import { ObjectImage } from './MediaFigure';
import type { MediaSummary, RuntimeCorpus, Subject } from './model';
import { useSubjectMedia } from './useMediaDetails';

function PreviewSourceNotes({
  corpus,
  subject,
  object,
}: {
  corpus: RuntimeCorpus;
  subject: Subject;
  object: MediaSummary;
}) {
  const summaries = useMemo(
    () => corpus.media.filter((item) => subject.objectIds.includes(item.id)),
    [corpus.media, subject.objectIds],
  );
  const details = useSubjectMedia(corpus, subject.id, summaries);
  const record =
    details.status === 'ready'
      ? details.media.find((item) => item.id === object.id)
      : undefined;
  return (
    <>
      <p>{subject.interval.note}</p>
      {subject.interval.alternatives?.map((alternative) => (
        <div key={alternative.label}>
          <p>{alternative.label}</p>
          <Citations citations={alternative.citations} sources={corpus.sources} />
        </div>
      ))}
      <p>{object.date.note}</p>
      {record ? (
        <>
          <p>{record.caption}</p>
          {record.datingNote && <p>{record.datingNote}</p>}
          {record.representedDate && <p>Represented date: {record.representedDate}</p>}
        </>
      ) : details.status === 'loading' ? (
        <p role="status">Loading image notes…</p>
      ) : details.status === 'failed' ? (
        <p role="status">
          Image notes could not load.{' '}
          <button
            aria-label={
              details.recovery === 'reload' ? 'Reload atlas' : 'Retry image notes'
            }
            onClick={details.recovery === 'reload' ? details.reload : details.retry}
          >
            {details.recovery === 'reload' ? 'Reload atlas' : 'Retry image notes'}
          </button>
        </p>
      ) : null}
      <p>{object.credit}</p>
      <p>{object.rights}</p>
      {object.licenseUrl && (
        <a href={object.licenseUrl} target="_blank" rel="noreferrer">
          Image licence ↗
        </a>
      )}
      <Citations
        citations={[{ source: object.source, locator: object.title }]}
        sources={corpus.sources}
      />
    </>
  );
}

export function StoryPreview({
  corpus,
  subject,
  year,
  openSubject,
  priority = false,
}: {
  corpus: RuntimeCorpus;
  subject: Subject;
  year: number;
  openSubject: (subject: Subject, object?: string) => void;
  priority?: boolean;
}) {
  const object = explorationObject(subject, corpus.media);
  const [notes, setNotes] = useState(false);
  return (
    <article className="story-preview" data-preview-subject={subject.id}>
      {object && (
        <button
          className="preview-image"
          onClick={() => openSubject(subject, object.id)}
          aria-label={`Look closer: ${subject.name}`}
        >
          <ObjectImage
            object={object}
            thumb
            priority={priority}
            fallbackControls={false}
          />
          <span>Look closer ↗</span>
        </button>
      )}
      <div className="preview-copy">
        <p className="eyebrow">{subject.region}</p>
        <h2 tabIndex={-1}>{subject.question}</h2>
        <p className="preview-name">{subject.name}</p>
        <p className="preview-dates">
          <strong>Case:</strong> {subject.interval.label}
        </p>
        {object && (
          <p className="preview-dates">
            <strong>Pictured:</strong> {object.date.label}
          </p>
        )}
        {!includesYear(subject.interval, year) && (
          <p className="preview-date-note">
            Different dates: this case does not span {formatYear(year)}.
          </p>
        )}
        <button
          className="preview-read"
          onClick={() => openSubject(subject, object?.id)}
        >
          Read this story →
        </button>
        <details className="preview-overview">
          <summary>Story overview</summary>
          <p>{subject.summary}</p>
        </details>
        <details
          className="preview-sources"
          onToggle={(event) => {
            if (event.currentTarget.open) setNotes(true);
          }}
        >
          <summary>Dates, image &amp; source notes</summary>
          {object && notes ? (
            <PreviewSourceNotes corpus={corpus} subject={subject} object={object} />
          ) : (
            <p>{subject.interval.note}</p>
          )}
        </details>
      </div>
    </article>
  );
}
