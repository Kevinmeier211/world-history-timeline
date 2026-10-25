import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { parseRunConfig } from './runConfig.ts';

describe('parseRunConfig', () => {
  it('reads the checked-in switches as off and phase 7', () => {
    const text = readFileSync(path.resolve('docs/RUN_CONFIG.md'), 'utf8');
    expect(parseRunConfig(text)).toEqual({
      MAX_PHASE: 7,
      ALLOW_MEDIA_DOWNLOAD: false,
      ALLOW_PUSH: false,
      ALLOW_DEPLOY: false,
      DEPLOY_TARGET: '',
      ALLOW_BIG_DEPS: false,
      CC_BY_APPROVED_IDS: [],
    });
  });

  it('ignores comments and parses an explicit approval list', () => {
    const parsed = parseRunConfig(`
      MAX_PHASE=4 # cap
      ALLOW_MEDIA_DOWNLOAD=true
      ALLOW_PUSH=false
      CC_BY_APPROVED_IDS=met-1, nga-2
    `);
    expect(parsed.MAX_PHASE).toBe(4);
    expect(parsed.ALLOW_MEDIA_DOWNLOAD).toBe(true);
    expect(parsed.ALLOW_PUSH).toBe(false);
    expect(parsed.CC_BY_APPROVED_IDS).toEqual(['met-1', 'nga-2']);
  });
});
