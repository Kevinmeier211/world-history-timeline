import { readdirSync, writeFileSync } from 'node:fs';

import sharp from 'sharp';

/** Chart, hero, and dossier widths from the plate pipeline. */
export const PLATE_SIZES = [128, 320, 960] as const;

/** 1:1 objects, 4:5 portraits, 3:2 monuments. */
export const PLATE_RATIOS = {
  object: 1,
  portrait: 4 / 5,
  monument: 3 / 2,
} as const;

/** Light-theme ink, applied as a 1px frame after the color treatment. */
export const PLATE_INK = { r: 42, g: 36, b: 28 } as const;

const WARM = { r: 255, g: 214, b: 170 } as const;

export interface FocalPoint {
  x: number;
  y: number;
}

export interface CropBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface PlateDerivative {
  size: number;
  width: number;
  height: number;
  channels: number;
  raw: Buffer;
  webp: Buffer;
  avif: Buffer;
}

export interface PlateResult {
  dominant: Rgb;
  derivatives: PlateDerivative[];
}

export interface GeneratedMedia {
  images: {
    id: string;
    dominant: Rgb;
    files: { size: number; webp: string; avif: string }[];
  }[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Crop window around a focal point. The window stays inside the source. */
export function focalCropBox(
  width: number,
  height: number,
  ratio: number,
  focal: FocalPoint,
): CropBox {
  const safe = ratio > 0 ? ratio : 1;
  let cropW = width;
  let cropH = Math.max(1, Math.round(width / safe));
  if (cropH > height) {
    cropH = height;
    cropW = Math.max(1, Math.round(height * safe));
  }
  cropW = Math.min(width, cropW);
  cropH = Math.min(height, cropH);
  const left = clamp(Math.round(focal.x * width - cropW / 2), 0, width - cropW);
  const top = clamp(Math.round(focal.y * height - cropH / 2), 0, height - cropH);
  return { left, top, width: cropW, height: cropH };
}

function grainAt(index: number): number {
  const seed = (Math.imul(index + 1, 1664525) + 1013904223) >>> 0;
  return 220 + (seed % 36);
}

/**
 * Warm the interior by 20%, multiply a light grain, then paint the 1px ink frame.
 * Saturation is reduced earlier, by sharp, so this step does not touch it.
 */
export function applyPlatePixels(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
): Buffer {
  const out = Buffer.from(data);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels;
      const edge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (edge) {
        out[i] = PLATE_INK.r;
        out[i + 1] = PLATE_INK.g;
        out[i + 2] = PLATE_INK.b;
        if (channels === 4) out[i + 3] = 255;
        continue;
      }
      const grain = grainAt(y * width + x);
      const red = out[i] ?? 0;
      const green = out[i + 1] ?? 0;
      const blue = out[i + 2] ?? 0;
      out[i] = Math.round(((red * 0.8 + WARM.r * 0.2) * grain) / 255);
      out[i + 1] = Math.round(((green * 0.8 + WARM.g * 0.2) * grain) / 255);
      out[i + 2] = Math.round(((blue * 0.8 + WARM.b * 0.2) * grain) / 255);
    }
  }
  return out;
}

/** Most common interior color, with the ink frame left out. */
export function dominantInterior(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
): Rgb {
  const bins = new Map<string, { count: number; rgb: Rgb }>();
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = (y * width + x) * channels;
      const rgb = { r: data[i] ?? 0, g: data[i + 1] ?? 0, b: data[i + 2] ?? 0 };
      const key = `${rgb.r >> 4},${rgb.g >> 4},${rgb.b >> 4}`;
      const bin = bins.get(key);
      if (bin) bin.count += 1;
      else bins.set(key, { count: 1, rgb });
    }
  }
  let best: { count: number; rgb: Rgb } | undefined;
  for (const bin of bins.values()) {
    if (!best || bin.count > best.count) best = bin;
  }
  return best?.rgb ?? { r: 0, g: 0, b: 0 };
}

/** Mean chroma, used to check the saturation step. */
export function meanChroma(data: Buffer, channels: number): number {
  let total = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += channels) {
    const red = data[i] ?? 0;
    const green = data[i + 1] ?? 0;
    const blue = data[i + 2] ?? 0;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    total += max === 0 ? 0 : (max - min) / max;
    count += 1;
  }
  return count === 0 ? 0 : total / count;
}

/** Lower saturation by 15% and return raw pixels. */
export async function desaturatedRaw(
  input: Buffer,
): Promise<{ data: Buffer; channels: number }> {
  const result = await sharp(input)
    .modulate({ saturation: 0.85 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: result.data, channels: result.info.channels };
}

/** 80×40 synthetic plate: blue on the left, red on the right. Not a photograph. */
export async function syntheticPlatePng(): Promise<Buffer> {
  const width = 80;
  const height = 40;
  const raw = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 3;
      if (x < width / 2) {
        raw[i] = 20;
        raw[i + 1] = 40;
        raw[i + 2] = 180;
      } else {
        raw[i] = 180;
        raw[i + 1] = 30;
        raw[i + 2] = 20;
      }
    }
  }
  return sharp(raw, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();
}

export async function processPlate(
  input: Buffer,
  options: { ratio: number; focal: FocalPoint; sizes?: readonly number[] },
): Promise<PlateResult> {
  const meta = await sharp(input).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < 2 || height < 2) throw new Error('plate input is too small');
  const box = focalCropBox(width, height, options.ratio, options.focal);
  const cropped = await sharp(input).extract(box).toBuffer();
  const sizes = options.sizes ?? PLATE_SIZES;
  const derivatives: PlateDerivative[] = [];
  for (const size of sizes) {
    const outW = size;
    const outH = Math.max(
      1,
      Math.round(size / (options.ratio > 0 ? options.ratio : 1)),
    );
    const desat = await sharp(cropped)
      .resize(outW, outH, { fit: 'fill' })
      .modulate({ saturation: 0.85 })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const treated = applyPlatePixels(
      desat.data,
      desat.info.width,
      desat.info.height,
      desat.info.channels,
    );
    const encoded = sharp(treated, {
      raw: {
        width: desat.info.width,
        height: desat.info.height,
        channels: desat.info.channels,
      },
    });
    derivatives.push({
      size,
      width: desat.info.width,
      height: desat.info.height,
      channels: desat.info.channels,
      raw: treated,
      webp: await encoded.clone().webp({ quality: 70 }).toBuffer(),
      avif: await encoded.clone().avif({ quality: 45 }).toBuffer(),
    });
  }
  const first = derivatives[0];
  if (!first) throw new Error('no plate sizes');
  return {
    dominant: dominantInterior(first.raw, first.width, first.height, first.channels),
    derivatives,
  };
}

export function emptyGenerated(): GeneratedMedia {
  return { images: [] };
}

function cacheNames(): string[] {
  try {
    return readdirSync('media-cache').filter((name) => !name.startsWith('.'));
  } catch {
    return [];
  }
}

const invoked =
  process.argv[1]?.endsWith('process.ts') || process.argv[1]?.endsWith('process.js');

if (invoked) {
  const cached = cacheNames();
  if (cached.length > 0) {
    console.error(
      `media:process: ${cached.length} cached files were left in place. Derivatives are not written while this run has no reviewed download.`,
    );
    process.exit(1);
  }
  writeFileSync(
    'src/data/media.generated.json',
    `${JSON.stringify(emptyGenerated(), null, 2)}\n`,
  );
  console.log(
    'media:process: no cached originals. Pipeline checked on src/__fixtures__/plate-synthetic.png. No files downloaded.',
  );
}
