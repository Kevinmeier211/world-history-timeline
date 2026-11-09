export interface ImageSize {
  width: number;
  height: number;
}
export interface ImagePoint {
  x: number;
  y: number;
}
export interface InspectionLayout {
  viewport: ImageSize;
  fit: ImageSize;
  image: ImageSize;
  stage: ImageSize;
  offset: ImagePoint;
}

const positive = (value: number) => Number.isFinite(value) && value > 0;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Fit the complete source at 100%, without enlarging a small original. */
export function inspectionLayout(
  natural: ImageSize,
  viewport: ImageSize,
  zoom: number,
): InspectionLayout | null {
  if (
    !positive(natural.width) ||
    !positive(natural.height) ||
    !positive(viewport.width) ||
    !positive(viewport.height) ||
    !Number.isFinite(zoom) ||
    zoom < 1
  )
    return null;
  const scale = Math.min(
    1,
    viewport.width / natural.width,
    viewport.height / natural.height,
  );
  const fit = { width: natural.width * scale, height: natural.height * scale };
  const image = { width: fit.width * zoom, height: fit.height * zoom };
  const stage = {
    width: Math.max(viewport.width, image.width),
    height: Math.max(viewport.height, image.height),
  };
  return {
    viewport,
    fit,
    image,
    stage,
    offset: {
      x: (stage.width - image.width) / 2,
      y: (stage.height - image.height) / 2,
    },
  };
}

/** Image fraction at the viewport centre, independent of the fitted pixel size. */
export function inspectionCentre(
  layout: InspectionLayout,
  scroll: ImagePoint,
): ImagePoint {
  return {
    x: clamp(
      (scroll.x + layout.viewport.width / 2 - layout.offset.x) / layout.image.width,
      0,
      1,
    ),
    y: clamp(
      (scroll.y + layout.viewport.height / 2 - layout.offset.y) / layout.image.height,
      0,
      1,
    ),
  };
}

/** Keep that point centred where possible; edges use the nearest feasible pan. */
export function inspectionScroll(
  layout: InspectionLayout,
  centre: ImagePoint,
): ImagePoint {
  return {
    x: clamp(
      layout.offset.x +
        clamp(centre.x, 0, 1) * layout.image.width -
        layout.viewport.width / 2,
      0,
      layout.stage.width - layout.viewport.width,
    ),
    y: clamp(
      layout.offset.y +
        clamp(centre.y, 0, 1) * layout.image.height -
        layout.viewport.height / 2,
      0,
      layout.stage.height - layout.viewport.height,
    ),
  };
}
