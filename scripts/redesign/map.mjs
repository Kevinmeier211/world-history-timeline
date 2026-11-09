/* global console */
import fs from 'node:fs/promises';
import { feature } from 'topojson-client';
const world = JSON.parse(
  await fs.readFile('node_modules/world-atlas/land-110m.json', 'utf8'),
);
const land = feature(world, world.objects.land);
const xy = ([lon, lat]) => [(lon + 180) * 2, (90 - lat) * 2];
const ring = (r) =>
  r
    .map(
      (p, i) =>
        `${i ? 'L' : 'M'}${xy(p)
          .map((v) => v.toFixed(1))
          .join(',')}`,
    )
    .join(' ') + 'Z';
const geometries =
  land.type === 'FeatureCollection'
    ? land.features.map((f) => f.geometry)
    : [land.geometry];
const polygons = geometries.flatMap((g) =>
  g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates],
);
const d = polygons.flatMap((p) => p.map(ring)).join(' ');
await fs.writeFile(
  'public/atlas/land.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360"><path d="${d}" fill="#d9dfcf" stroke="#f9faf5" stroke-width="0.5" vector-effect="non-scaling-stroke"/></svg>`,
);
console.log(
  'Natural Earth land, world-atlas 110m. Public domain coastline; no political borders.',
);
