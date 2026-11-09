/** Local equirectangular projection, corrected at the view's central latitude.
 * Fits a region without stretching each axis independently. Not a surveyed map.
 * Explicit crossing bounds unwrap eastward; a second land image can be placed
 * one returned land.width to the right of the first.
 */
export function placeProjection(
  bounds: [number, number, number, number],
  crossesAntimeridian = false,
) {
  const [west, south, east, north] = bounds;
  const longitudeSpan = (crossesAntimeridian ? east + 360 : east) - west;
  const longitudeFactor = Math.cos((((south + north) / 2) * Math.PI) / 180);
  const scale = Math.min(
    640 / (longitudeSpan * longitudeFactor),
    360 / (north - south),
  );
  const left = (720 - longitudeSpan * longitudeFactor * scale) / 2;
  const top = (420 - (north - south) * scale) / 2;
  const xy = ([lon, lat]: [number, number]): [number, number] => [
    left +
      ((crossesAntimeridian && lon < west ? lon + 360 : lon) - west) *
        longitudeFactor *
        scale,
    top + (north - lat) * scale,
  ];
  return {
    xy,
    land: {
      x: left - (west + 180) * longitudeFactor * scale,
      y: top - (90 - north) * scale,
      width: 360 * longitudeFactor * scale,
      height: 180 * scale,
    },
  };
}
