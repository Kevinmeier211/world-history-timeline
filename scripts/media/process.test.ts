import { readFileSync } from 'node:fs';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import {
  PLATE_INK,
  PLATE_SIZES,
  applyPlatePixels,
  desaturatedRaw,
  dominantInterior,
  emptyGenerated,
  focalCropBox,
  meanChroma,
  processPlate,
  syntheticPlatePng,
} from './process.ts';

function solidPng(red: number, green: number, blue: number): Promise<Buffer> {
  return sharp({
    create: {
      width: 16,
      height: 16,
      channels: 3,
      background: { r: red, g: green, b: blue },
    },
  })
    .png()
    .toBuffer();
}

describe('plate processing', () => {
  it('crops the focal half of the synthetic plate', () => {
    expect(focalCropBox(80, 40, 1, { x: 0.9, y: 0.5 })).toEqual({
      left: 40,
      top: 0,
      width: 40,
      height: 40,
    });
    expect(focalCropBox(80, 40, 1, { x: 0.1, y: 0.5 }).left).toBe(0);
  });

  it('drops saturation, warms the interior, and frames the edge', async () => {
    const source = await solidPng(220, 20, 20);
    const raw = await sharp(source).raw().toBuffer({ resolveWithObject: true });
    const faded = await desaturatedRaw(source);
    expect(meanChroma(faded.data, faded.channels)).toBeLessThan(
      meanChroma(raw.data, raw.info.channels),
    );
    const treated = applyPlatePixels(raw.data, 16, 16, raw.info.channels);
    expect(treated[0]).toBe(PLATE_INK.r);
    expect(treated[1]).toBe(PLATE_INK.g);
    expect(treated[2]).toBe(PLATE_INK.b);
    const interior = 8 * 16 * 3 + 8 * 3;
    expect(treated[interior + 2] ?? 0).toBeGreaterThan(raw.data[interior + 2] ?? 0);
  });

  it('writes AVIF and WebP from the synthetic fixture and keeps the red side', async () => {
    const fixture = readFileSync('src/__fixtures__/plate-synthetic.png');
    const made = await syntheticPlatePng();
    expect(fixture.equals(made)).toBe(true);
    const right = await processPlate(fixture, { ratio: 1, focal: { x: 0.9, y: 0.5 } });
    const left = await processPlate(fixture, { ratio: 1, focal: { x: 0.1, y: 0.5 } });
    expect(right.derivatives.map((item) => item.size)).toEqual([...PLATE_SIZES]);
    const thumb = right.derivatives[0];
    expect(thumb?.width).toBe(128);
    expect(thumb?.height).toBe(128);
    expect(thumb?.raw[0]).toBe(PLATE_INK.r);
    expect(thumb?.webp.subarray(0, 4).toString()).toBe('RIFF');
    expect(thumb?.avif.subarray(4, 8).toString()).toBe('ftyp');
    const decoded = await sharp(thumb?.webp).metadata();
    expect(decoded.width).toBe(128);
    expect(right.dominant.r).toBeGreaterThan(left.dominant.r);
    expect(right.dominant.r).toBeGreaterThan(right.dominant.b);
    expect(dominantInterior(thumb?.raw ?? Buffer.alloc(0), 128, 128, 3).r).toBe(
      right.dominant.r,
    );
    expect(emptyGenerated()).toEqual({ images: [] });
  });
});
