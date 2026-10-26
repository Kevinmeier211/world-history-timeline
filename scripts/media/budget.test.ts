import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  THUMB_EACH_MAX,
  THUMB_TOTAL_MAX,
  assessBudget,
  isThumbnail,
  thumbStats,
} from './budget.ts';

describe('media budget', () => {
  it('passes an empty thumbnail set and fails the caps', () => {
    expect(isThumbnail('public/media/plate-128.webp')).toBe(true);
    expect(isThumbnail('public/media/plate-128.avif')).toBe(true);
    expect(isThumbnail('public/media/plate-320.webp')).toBe(false);
    expect(isThumbnail('public/media/plate-960.avif')).toBe(false);
    expect(assessBudget([]).ok).toBe(true);
    expect(assessBudget([{ name: 'a-128.webp', bytes: THUMB_EACH_MAX }]).ok).toBe(true);
    const over = assessBudget([{ name: 'a-128.webp', bytes: THUMB_EACH_MAX + 1 }]);
    expect(over.ok).toBe(false);
    expect(over.failures[0]).toContain('a-128.webp');
    const many = Array.from({ length: 160 }, (_, index) => ({
      name: `t${index}-128.webp`,
      bytes: 8 * 1024,
    }));
    const total = assessBudget(many);
    expect(total.total).toBeGreaterThan(THUMB_TOTAL_MAX);
    expect(total.ok).toBe(false);
  });

  it('reports the shipped directory as gated when it has no thumbnails', () => {
    expect(thumbStats('public/media')).toEqual([]);
    const result = spawnSync(
      path.resolve('node_modules/.bin/tsx'),
      ['scripts/media/budget.ts'],
      {
        encoding: 'utf8',
      },
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('0 thumbnails');
    expect(result.stdout).toContain('Gated');
  });
});
