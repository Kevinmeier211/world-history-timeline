import { localMediaHref } from '../lib/localMedia.ts';

export interface MediaFigureModel {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
}

/** Dossier figure. Without a local file, the caption says no image is attached. */
export function MediaFigure({
  note,
  figure,
}: {
  note: string;
  figure?: MediaFigureModel;
}) {
  const src = figure ? localMediaHref(figure.src) : undefined;
  if (!figure || !src) {
    return (
      <figure className="dossier-figure">
        <figcaption>{note}</figcaption>
      </figure>
    );
  }
  return (
    <figure className="dossier-figure">
      <img
        src={src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        {figure.caption} {figure.credit}
      </figcaption>
    </figure>
  );
}
