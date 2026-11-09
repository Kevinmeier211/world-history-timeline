import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Citation, MediaAnnotations, MediaSummary, Source } from './model';
import { Citations } from './Evidence';

type AnnotationImage = Pick<MediaSummary, 'width' | 'height' | 'hasAnnotations'>;

/** The inner surface has the photograph's ratio; padding belongs to its frame. */
export function AnnotatedImage({
  object,
  annotations,
  children,
  mode = 'web',
  zoom = 1,
  active = true,
  status,
  widthMm,
  imageKey = 'primary',
  inspectionWidthPx,
}: {
  object: AnnotationImage;
  annotations?: MediaAnnotations;
  children: ReactNode;
  mode?: 'web' | 'inspection' | 'reader' | 'print';
  zoom?: number;
  active?: boolean;
  status?: 'loading' | 'failed' | 'ready';
  widthMm?: number;
  imageKey?: string;
  inspectionWidthPx?: number;
}) {
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const imageFailed = failedImages.has(imageKey);
  if (!object.hasAnnotations && !annotations) return children;
  const print = mode === 'reader' || mode === 'print';
  const natural = mode === 'reader' && widthMm !== undefined;
  const style: CSSProperties & Record<string, string | number> = {
    '--annotation-ratio': object.width / object.height,
    '--annotation-native-width': `${object.width}px`,
    ...(mode === 'inspection'
      ? {
          width:
            inspectionWidthPx === undefined
              ? `${zoom * 100}%`
              : `${inspectionWidthPx}px`,
        }
      : {}),
    ...(natural ? { width: `${widthMm}mm`, maxWidth: '100%', height: 'auto' } : {}),
  };
  return (
    <span
      className={`annotated-image-frame annotated-image--${mode}${natural ? ' annotation-natural-size' : ''}`}
      style={style}
      data-annotation-status={
        imageFailed ? 'image-failed' : annotations ? 'ready' : (status ?? 'loading')
      }
      onErrorCapture={(event) => {
        if (event.target instanceof HTMLImageElement)
          setFailedImages((previous) => new Set(previous).add(imageKey));
      }}
      onLoadCapture={(event) => {
        if (event.target instanceof HTMLImageElement)
          setFailedImages((previous) => {
            if (!previous.has(imageKey)) return previous;
            const next = new Set(previous);
            next.delete(imageKey);
            return next;
          });
      }}
    >
      <span
        className="annotation-canvas"
        style={{ aspectRatio: `${object.width} / ${object.height}` }}
      >
        {children}
        <span className="annotation-pins" aria-hidden="true">
          {active &&
            !imageFailed &&
            annotations?.items.map((item, index) => (
              <b
                key={item.id}
                className="annotation-pin"
                data-annotation-id={item.id}
                style={{
                  left: `${item.x * 100}%`,
                  top: `${item.y * 100}%`,
                  fontSize: print ? '10pt' : '18px',
                }}
              >
                {index + 1}
              </b>
            ))}
        </span>
      </span>
    </span>
  );
}

/** Modern editorial rights remain distinct from the underlying image's rights. */
export function AnnotationNotes({
  annotations,
  sources = [],
  compact = false,
  renderCitations,
}: {
  annotations: MediaAnnotations;
  sources?: Source[];
  compact?: boolean;
  renderCitations?: (citations: Citation[]) => ReactNode;
}) {
  return (
    <section
      className={`annotation-notes${compact ? ' annotation-notes--compact' : ''}`}
    >
      {!compact && <h2>Modern image annotations</h2>}
      <ol className="annotation-legend">
        {annotations.items.map((item, index) => (
          <li key={item.id} data-annotation-note={item.id}>
            <strong>
              {compact && `${index + 1}. `}
              {item.label}
            </strong>
            {!compact && (
              <>
                <p>{item.text}</p>
                {renderCitations ? (
                  renderCitations(item.citations)
                ) : (
                  <Citations citations={item.citations} sources={sources} />
                )}
              </>
            )}
          </li>
        ))}
      </ol>
      <p className="annotation-credit">
        Modern annotations · {annotations.createdOn}. {annotations.credit}{' '}
        {annotations.rights} <a href={annotations.licenseUrl}>Annotation licence</a>.
      </p>
    </section>
  );
}
