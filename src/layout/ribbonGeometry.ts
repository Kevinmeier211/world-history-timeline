/** Circle-cubic constant. A semicircle cap is two of these curves. */
const KAPPA = 0.5522847498;

export interface RibbonPoint {
  y: number;
  x: number;
  width: number;
}

interface Cubic {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

function fmt(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Object.is(rounded, -0)) return '0.00';
  return rounded.toFixed(2);
}

/** Drop points that do not move forward in y. Keyframes must be monotone. */
export function monotonePoints(points: readonly RibbonPoint[]): RibbonPoint[] {
  const sorted = [...points].sort((left, right) => left.y - right.y);
  const kept: RibbonPoint[] = [];
  for (const point of sorted) {
    const previous = kept.at(-1);
    if (previous && point.y <= previous.y) continue;
    kept.push(point);
  }
  return kept;
}

/**
 * Insert width-profile samples. X at a new y is linearly interpolated.
 * A profile year that matches a keyframe replaces that width.
 */
export function withWidthProfile(
  points: readonly RibbonPoint[],
  profile: readonly { y: number; width: number }[],
): RibbonPoint[] {
  const base = monotonePoints(points);
  if (base.length === 0) return [];
  const extras: RibbonPoint[] = profile.flatMap((sample) => {
    const first = base[0];
    const last = base.at(-1);
    if (!first || !last || sample.y <= first.y || sample.y >= last.y) return [];
    const match = base.find((point) => point.y === sample.y);
    if (match) return [];
    let index = 0;
    while (index < base.length - 1 && (base[index + 1]?.y ?? 0) < sample.y) index += 1;
    const left = base[index];
    const right = base[index + 1];
    if (!left || !right) return [];
    const t = (sample.y - left.y) / (right.y - left.y);
    return [{ y: sample.y, x: left.x + (right.x - left.x) * t, width: sample.width }];
  });
  const replaced = base.map((point) => {
    const hit = profile.find((sample) => sample.y === point.y);
    return hit ? { ...point, width: hit.width } : point;
  });
  return monotonePoints([...replaced, ...extras]);
}

/** Fritsch–Carlson tangents. Slopes of opposite sign become zero, so the curve does not overshoot. */
export function monotoneTangents(
  t: readonly number[],
  values: readonly number[],
): number[] {
  const count = t.length;
  const delta: number[] = [];
  for (let index = 0; index < count - 1; index += 1) {
    const t0 = t[index] ?? 0;
    const t1 = t[index + 1] ?? t0;
    const v0 = values[index] ?? 0;
    const v1 = values[index + 1] ?? v0;
    delta.push((v1 - v0) / (t1 - t0));
  }
  const slope = new Array<number>(count).fill(0);
  const first = delta[0] ?? 0;
  slope[0] = first;
  slope[count - 1] = delta[count - 2] ?? first;
  for (let index = 1; index < count - 1; index += 1) {
    const before = delta[index - 1] ?? 0;
    const after = delta[index] ?? 0;
    slope[index] = before * after <= 0 ? 0 : (before + after) / 2;
  }
  for (let index = 0; index < count - 1; index += 1) {
    const secant = delta[index] ?? 0;
    if (secant === 0) {
      slope[index] = 0;
      slope[index + 1] = 0;
      continue;
    }
    const alpha = (slope[index] ?? 0) / secant;
    const beta = (slope[index + 1] ?? 0) / secant;
    const sum = alpha * alpha + beta * beta;
    if (sum > 9) {
      const scale = 3 / Math.sqrt(sum);
      slope[index] = scale * alpha * secant;
      slope[index + 1] = scale * beta * secant;
    }
  }
  return slope;
}

function hermite(
  v0: number,
  v1: number,
  m0: number,
  m1: number,
  dt: number,
  u: number,
): number {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * v0 +
    (u3 - 2 * u2 + u) * dt * m0 +
    (-2 * u3 + 3 * u2) * v1 +
    (u3 - u2) * dt * m1
  );
}

/** Samples of the centerline. `steps` is the count per span between keyframes. */
export function sampleCenterline(
  points: readonly RibbonPoint[],
  steps = 4,
): RibbonPoint[] {
  const curve = monotonePoints(points);
  if (curve.length === 0) return [];
  if (curve.length === 1) return [...curve];
  const t = curve.map((point) => point.y);
  const xs = monotoneTangents(
    t,
    curve.map((point) => point.x),
  );
  const widths = monotoneTangents(
    t,
    curve.map((point) => point.width),
  );
  const samples: RibbonPoint[] = [];
  for (let index = 0; index < curve.length - 1; index += 1) {
    const left = curve[index];
    const right = curve[index + 1];
    if (!left || !right) continue;
    const dt = right.y - left.y;
    for (let step = 0; step <= steps; step += 1) {
      if (index > 0 && step === 0) continue;
      const u = step / steps;
      samples.push({
        y: left.y + dt * u,
        x: hermite(left.x, right.x, xs[index] ?? 0, xs[index + 1] ?? 0, dt, u),
        width: hermite(
          left.width,
          right.width,
          widths[index] ?? 0,
          widths[index + 1] ?? 0,
          dt,
          u,
        ),
      });
    }
  }
  return samples;
}

function segmentCubics(
  curve: readonly RibbonPoint[],
  side: -1 | 1,
  xs: readonly number[],
  widths: readonly number[],
): Cubic[] {
  const cubics: Cubic[] = [];
  for (let index = 0; index < curve.length - 1; index += 1) {
    const left = curve[index];
    const right = curve[index + 1];
    if (!left || !right) continue;
    const dt = right.y - left.y;
    const x0 = left.x + side * (left.width / 2);
    const x3 = right.x + side * (right.width / 2);
    const m0 = (xs[index] ?? 0) + side * ((widths[index] ?? 0) / 2);
    const m1 = (xs[index + 1] ?? 0) + side * ((widths[index + 1] ?? 0) / 2);
    cubics.push({
      x0,
      y0: left.y,
      x1: x0 + (m0 * dt) / 3,
      y1: left.y + dt / 3,
      x2: x3 - (m1 * dt) / 3,
      y2: right.y - dt / 3,
      x3,
      y3: right.y,
    });
  }
  return cubics;
}

function cubicCommand(cubic: Cubic): string {
  return `C ${fmt(cubic.x1)} ${fmt(cubic.y1)} ${fmt(cubic.x2)} ${fmt(cubic.y2)} ${fmt(cubic.x3)} ${fmt(cubic.y3)}`;
}

function reverseCubic(cubic: Cubic): Cubic {
  return {
    x0: cubic.x3,
    y0: cubic.y3,
    x1: cubic.x2,
    y1: cubic.y2,
    x2: cubic.x1,
    y2: cubic.y1,
    x3: cubic.x0,
    y3: cubic.y0,
  };
}

/** Two cubics for a semicircle cap. `sign` 1 bulges downward. */
function capCubics(x: number, y: number, radius: number, sign: 1 | -1): Cubic[] {
  const k = KAPPA * radius;
  const bulge = y + sign * radius;
  return [
    {
      x0: x - radius,
      y0: y,
      x1: x - radius,
      y1: y + sign * k,
      x2: x - k,
      y2: bulge,
      x3: x,
      y3: bulge,
    },
    {
      x0: x,
      y0: bulge,
      x1: x + k,
      y1: bulge,
      x2: x + radius,
      y2: y + sign * k,
      x3: x + radius,
      y3: y,
    },
  ];
}

/**
 * Closed ribbon path. The left edge runs down, the end cap bulges down,
 * the right edge runs up, and the start cap bulges up.
 */
export function ribbonPath(points: readonly RibbonPoint[]): string {
  const curve = monotonePoints(points);
  const first = curve[0];
  const last = curve.at(-1);
  if (!first || !last || curve.length < 2) return '';
  const t = curve.map((point) => point.y);
  const xs = monotoneTangents(
    t,
    curve.map((point) => point.x),
  );
  const widths = monotoneTangents(
    t,
    curve.map((point) => point.width),
  );
  const down = segmentCubics(curve, -1, xs, widths);
  const up = segmentCubics(curve, 1, xs, widths).reverse().map(reverseCubic);
  const endCap = capCubics(last.x, last.y, last.width / 2, 1);
  const startCap = capCubics(first.x, first.y, first.width / 2, -1)
    .reverse()
    .map(reverseCubic);
  const commands = [
    `M ${fmt(first.x - first.width / 2)} ${fmt(first.y)}`,
    ...down.map(cubicCommand),
    ...endCap.map(cubicCommand),
    ...up.map(cubicCommand),
    ...startCap.map(cubicCommand),
    'Z',
  ];
  return commands.join(' ');
}
