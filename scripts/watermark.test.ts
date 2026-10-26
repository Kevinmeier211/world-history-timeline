import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { posterWorld } from '../src/camera/camera.ts';
import { watermarkD } from '../src/render/watermark.generated.ts';
import { watermarkBox } from '../src/render/watermark.ts';

describe('watermark file', () => {
  it('is a local land path in the poster plot', () => {
    const svg = readFileSync('public/watermark.svg', 'utf8');
    const box = watermarkBox(posterWorld().height);
    expect(svg).toContain(`viewBox="${box.x} ${box.y} ${box.width} ${box.height}"`);
    expect(svg).toContain(`<path d="${watermarkD}"/>`);
    expect(svg).not.toMatch(/fonts\.googleapis|fonts\.gstatic|typekit/);
    expect(watermarkD.startsWith('M')).toBe(true);
    expect(watermarkD.length).toBeGreaterThan(1000);
  });
});
