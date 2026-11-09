export type MapView = [number, number, number, number];
export const worldMapView: MapView = [0, 0, 720, 360];
export const worldXY = ([lon, lat]: [number, number]): [number, number] => [
  (lon + 180) * 2,
  (90 - lat) * 2,
];

/** Fit approximate locators; widely separated/date-line places retain the world view. */
export function fitMapView(coordinates: [number, number][]): MapView {
  if (!coordinates.length) return [...worldMapView];
  const points = coordinates.map(worldXY);
  const xs = points.map(([x]) => x),
    ys = points.map(([, y]) => y);
  const left = Math.min(...xs),
    right = Math.max(...xs);
  const top = Math.min(...ys),
    bottom = Math.max(...ys);
  const width = Math.min(720, Math.max(90, (right - left) * 1.5, (bottom - top) * 3));
  if (width === 720) return [...worldMapView];
  return [
    Math.max(0, Math.min(720 - width, (left + right - width) / 2)),
    Math.max(0, Math.min(360 - width / 2, (top + bottom - width / 2) / 2)),
    width,
    width / 2,
  ];
}
