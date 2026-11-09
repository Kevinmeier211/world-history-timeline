/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- The named image scroll region needs keyboard focus for native arrow-key panning. */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import type { Media, MediaSummary, Source } from './model';
import type { MediaFailure } from './useMediaDetails';
import { asset } from './data';
import { AnnotatedImage, AnnotationNotes } from './AnnotatedImage';
import { inspectionCentre, inspectionLayout, inspectionScroll } from './inspection-fit';
import type { ImagePoint, ImageSize, InspectionLayout } from './inspection-fit';

const sourceImageUrl = (url: string) =>
  /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url) ? url : asset(url);

export function ObjectImage({
  object,
  thumb = false,
  priority = false,
  image,
  style,
  fallbackControls = true,
  retryKey = 0,
  onImageError,
  onImageLoad,
  description,
}: {
  object: MediaSummary;
  thumb?: boolean;
  priority?: boolean;
  image?: string;
  style?: CSSProperties;
  fallbackControls?: boolean;
  retryKey?: number;
  onImageError?: (image: string) => void;
  onImageLoad?: (element: HTMLImageElement, image: string) => void;
  description?: string;
}) {
  const rawSource = image ?? (thumb ? object.thumbnail : object.image);
  const [attempt, setAttempt] = useState(0);
  const requestKey = JSON.stringify([rawSource, retryKey, attempt]);
  const [failed, setFailed] = useState<string | null>(null);
  return failed === requestKey ? (
    <div className="image-error">
      Image unavailable.
      {fallbackControls && (
        <>
          {' '}
          <a href={sourceImageUrl(object.sourceImage)} target="_blank" rel="noreferrer">
            Open source image ↗
          </a>
          <button onClick={() => setAttempt((value) => value + 1)}>Retry image</button>
        </>
      )}
    </div>
  ) : (
    <img
      key={requestKey}
      src={asset(rawSource)}
      width={object.width}
      height={object.height}
      style={{
        ...(thumb ? {} : { maxWidth: `min(100%, ${object.width}px)` }),
        ...style,
      }}
      alt={description ?? object.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onLoad={(event) => onImageLoad?.(event.currentTarget, rawSource)}
      onError={() => {
        setFailed(requestKey);
        onImageError?.(rawSource);
      }}
    />
  );
}

export type FigureDetails =
  | { status: 'ready'; object: Media }
  | { status: 'loading'; retry: () => void }
  | MediaFailure;

function MediaStatus({
  details,
  retryTarget,
}: {
  details: FigureDetails;
  retryTarget?: RefObject<HTMLButtonElement | null>;
}) {
  if (details.status === 'ready') return null;
  return (
    <p role="status" className="media-status">
      {details.status === 'loading' ? (
        'Loading image information…'
      ) : (
        <>
          {details.recovery === 'reload'
            ? 'Image information cannot load from this atlas file. Reload the atlas to try a fresh copy.'
            : 'Image information could not be loaded.'}{' '}
          <button
            onClick={(event) => {
              if (details.recovery === 'reload') {
                details.reload();
                return;
              }
              const focused = document.activeElement === event.currentTarget;
              details.retry();
              if (focused) retryTarget?.current?.focus({ preventScroll: true });
            }}
          >
            {details.recovery === 'reload' ? 'Reload atlas' : 'Retry image information'}
          </button>
        </>
      )}
    </p>
  );
}

function ImageCredit({
  object,
  source,
  inspection = false,
}: {
  object: MediaSummary;
  source?: Source;
  inspection?: boolean;
}) {
  return (
    <div className="media-attribution">
      <p className="credit">
        {object.credit} {object.rights}
      </p>
      <div className="media-links">
        {object.licenseUrl && (
          <a href={object.licenseUrl} target="_blank" rel="noreferrer">
            {inspection ? 'Image licence ↗' : 'Read the image licence ↗'}
          </a>
        )}
        <a href={sourceImageUrl(object.sourceImage)} target="_blank" rel="noreferrer">
          Open source image ↗
        </a>
        {source?.url && (
          <a href={source.url} target="_blank" rel="noreferrer">
            Read original institutional record ↗
          </a>
        )}
      </div>
    </div>
  );
}

const sameStrings = (left?: string[], right?: string[]) =>
  left === right ||
  (!!left &&
    !!right &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]));

export function MediaFigure({
  object,
  details,
  source,
  sources = [],
}: {
  object: MediaSummary;
  details: FigureDetails;
  source?: Source;
  sources?: Source[];
}) {
  const [inspect, setInspect] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState(0);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [imageAttempt, setImageAttempt] = useState(0);
  const record = details.status === 'ready' ? details.object : null;
  const [interactionObject, setInteractionObject] = useState(object.id);
  if (interactionObject !== object.id) {
    setInteractionObject(object.id);
    setZoom(1);
    setView(0);
  }
  const dialog = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLButtonElement>(null);
  const closeTrigger = useRef<HTMLButtonElement>(null);
  const scrollRegion = useRef<HTMLDivElement>(null);
  const [knownImages, setKnownImages] = useState<{
    id: string;
    additional: string[];
    descriptions?: string[];
  }>({
    id: object.id,
    additional: record?.additionalImages ?? [],
    descriptions: record?.additionalImageAlts,
  });
  if (
    record &&
    (knownImages.id !== object.id ||
      !sameStrings(record.additionalImages ?? [], knownImages.additional) ||
      !sameStrings(record.additionalImageAlts, knownImages.descriptions))
  )
    setKnownImages({
      id: object.id,
      additional: record.additionalImages ?? [],
      descriptions: record.additionalImageAlts,
    });
  const [natural, setNatural] = useState<(ImageSize & { key: string }) | null>(null);
  const [viewport, setViewport] = useState<ImageSize>({ width: 0, height: 0 });
  const measuredViewport = useRef<ImageSize>({ width: 0, height: 0 });
  const previousLayout = useRef<{ key: string; layout: InspectionLayout } | null>(null);
  const pendingCentre = useRef<{ key: string; point: ImagePoint } | null>(null);
  const verifiedViews = record
    ? {
        additional: record.additionalImages ?? [],
        descriptions: record.additionalImageAlts,
      }
    : knownImages.id === object.id
      ? knownImages
      : null;
  const images = [object.image, ...(verifiedViews?.additional ?? [])];
  const selectedImage = images[view] ?? object.image;
  const selectedDescription =
    view === 0
      ? object.alt
      : (verifiedViews?.descriptions?.[view - 1] ??
        `Additional view of ${object.title}`);
  const selectedKey = JSON.stringify([object.id, selectedImage]);
  const currentImageKey = useRef(selectedKey);
  const dimensions = natural?.key === selectedKey ? natural : object;
  const naturalWidth = dimensions.width;
  const naturalHeight = dimensions.height;
  const layout = useMemo(
    () =>
      inspectionLayout({ width: naturalWidth, height: naturalHeight }, viewport, zoom),
    [naturalWidth, naturalHeight, viewport, zoom],
  );
  const captureCentre = useCallback(() => {
    const previous = previousLayout.current;
    const region = scrollRegion.current;
    if (previous && region)
      pendingCentre.current = {
        key: previous.key,
        point: inspectionCentre(previous.layout, {
          x: region.scrollLeft,
          y: region.scrollTop,
        }),
      };
  }, []);
  useLayoutEffect(() => {
    currentImageKey.current = selectedKey;
  }, [selectedKey]);
  useLayoutEffect(() => {
    if (inspect) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else if (dialog.current?.open) dialog.current.close();
  }, [inspect]);
  useLayoutEffect(() => {
    const region = scrollRegion.current;
    if (!inspect || !region) return;
    const measure = () => {
      const next = { width: region.clientWidth, height: region.clientHeight };
      if (next.width <= 0 || next.height <= 0) return;
      const previous = measuredViewport.current;
      if (previous.width === next.width && previous.height === next.height) return;
      captureCentre();
      measuredViewport.current = next;
      setViewport(next);
    };
    measure();
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(region);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [inspect, captureCentre]);
  useLayoutEffect(() => {
    const region = scrollRegion.current;
    if (!inspect || !region || !layout) return;
    const sameImage = previousLayout.current?.key === selectedKey;
    const centre = sameImage
      ? pendingCentre.current?.key === selectedKey
        ? pendingCentre.current.point
        : inspectionCentre(previousLayout.current!.layout, {
            x: region.scrollLeft,
            y: region.scrollTop,
          })
      : { x: 0.5, y: 0.5 };
    const scroll = inspectionScroll(layout, centre);
    region.scrollLeft = scroll.x;
    region.scrollTop = scroll.y;
    previousLayout.current = { key: selectedKey, layout };
    pendingCentre.current = null;
  }, [inspect, layout, selectedKey]);
  return (
    <figure
      className="object-figure"
      data-depiction={object.depiction}
      data-media-id={object.id}
      data-media-status={details.status}
      data-media-recovery={details.status === 'failed' ? details.recovery : undefined}
    >
      <AnnotatedImage
        object={object}
        annotations={record?.annotations}
        status={details.status}
      >
        <button
          ref={imageTrigger}
          className="image-open"
          aria-label={`Inspect object: ${object.title}`}
          onClick={() => {
            setZoom(1);
            setView(0);
            previousLayout.current = null;
            pendingCentre.current = null;
            setInspect(true);
          }}
        >
          <ObjectImage
            key={object.id}
            object={object}
            priority
            fallbackControls={false}
            retryKey={imageAttempt}
            onImageError={setFailedImage}
          />
          <span>Inspect object ↗</span>
        </button>
      </AnnotatedImage>
      {failedImage === object.image && (
        <button
          className="image-retry"
          onClick={() => {
            setFailedImage(null);
            setImageAttempt((value) => value + 1);
          }}
        >
          Retry image
        </button>
      )}
      <figcaption>
        <strong>{object.title}</strong>
        <span>
          {object.date.label}
          {record && <> · {record.material}</>}
        </span>
        <MediaStatus details={details} retryTarget={imageTrigger} />
        {record && <p>{record.caption}</p>}
        <ImageCredit object={object} source={source} />
        {record?.annotations && (
          <AnnotationNotes annotations={record.annotations} sources={sources} />
        )}
        {record && (
          <details>
            <summary>Object record and credit</summary>
            <dl>
              <dt>Maker</dt>
              <dd>{record.creator}</dd>
              <dt>Place</dt>
              <dd>{record.place}</dd>
              <dt>Accession</dt>
              <dd>{object.accession}</dd>
              <dt>Image</dt>
              <dd>
                {object.depiction}; {object.rights}
              </dd>
              {record.representedDate && (
                <>
                  <dt>Represented date</dt>
                  <dd>{record.representedDate}</dd>
                </>
              )}
            </dl>
            {record.datingNote && <p>{record.datingNote}</p>}
          </details>
        )}
      </figcaption>
      <dialog
        ref={dialog}
        className="inspection"
        aria-label={object.title}
        onCancel={() => setInspect(false)}
        onClose={() => setInspect(false)}
      >
        <div className="inspection-tools">
          <h2>{object.title}</h2>
          <button ref={closeTrigger} onClick={() => setInspect(false)}>
            Close inspection
          </button>
        </div>
        <div className="actions">
          <button
            disabled={zoom <= 1}
            onClick={() => {
              captureCentre();
              setZoom((value) => Math.max(1, value - 0.5));
            }}
          >
            Zoom out
          </button>
          <output aria-live="polite" aria-label="Zoom relative to fitted image">
            {Math.round(zoom * 100)}%
          </output>
          <button
            disabled={zoom >= 3}
            onClick={() => {
              captureCentre();
              setZoom((value) => Math.min(3, value + 0.5));
            }}
          >
            Zoom in
          </button>
          {images.length > 1 && (
            <label>
              View{' '}
              <select
                value={view}
                onChange={(event) => {
                  setView(Number(event.target.value));
                  setZoom(1);
                  previousLayout.current = null;
                  pendingCentre.current = null;
                }}
              >
                {images.map((_, index) => (
                  <option key={index} value={index}>
                    Image {index + 1}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div
          ref={scrollRegion}
          className="inspection-scroll"
          role="region"
          aria-label="Zoomed object image"
          tabIndex={0}
        >
          <div
            className="inspection-stage"
            style={
              layout
                ? { width: layout.stage.width, height: layout.stage.height }
                : undefined
            }
          >
            <AnnotatedImage
              object={{ ...object, width: dimensions.width, height: dimensions.height }}
              annotations={record?.annotations}
              status={details.status}
              mode="inspection"
              zoom={zoom}
              inspectionWidthPx={layout?.image.width}
              active={view === 0}
              imageKey={selectedImage}
            >
              <ObjectImage
                object={object}
                image={selectedImage}
                description={selectedDescription}
                style={{
                  width: object.hasAnnotations
                    ? '100%'
                    : layout
                      ? `${layout.image.width}px`
                      : `${zoom * 100}%`,
                  maxWidth: 'none',
                }}
                onImageLoad={(element, source) => {
                  if (
                    source !== selectedImage ||
                    currentImageKey.current !== selectedKey
                  )
                    return;
                  const { naturalWidth: width, naturalHeight: height } = element;
                  if (width <= 0 || height <= 0) return;
                  if (
                    natural?.key === selectedKey &&
                    natural.width === width &&
                    natural.height === height
                  )
                    return;
                  captureCentre();
                  setNatural({ key: selectedKey, width, height });
                }}
              />
            </AnnotatedImage>
          </div>
        </div>
        <p>{object.date.label}</p>
        <MediaStatus details={details} retryTarget={closeTrigger} />
        {record && <p>{record.caption}</p>}
        <ImageCredit object={object} source={source} inspection />
        {view === 0 && record?.annotations && (
          <AnnotationNotes annotations={record.annotations} sources={sources} />
        )}
      </dialog>
    </figure>
  );
}
