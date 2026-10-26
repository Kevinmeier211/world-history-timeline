import { describe, expect, it } from 'vitest';

import {
  LEGACY_DESIGN_LINT_ALLOWLIST,
  fontSizeFloor,
  isLegacyDesignPath,
  isTokensFile,
  lintDesignSource,
} from './designRules';

describe('color literals', () => {
  it('rejects hex and rgb outside tokens.css', () => {
    const hits = lintDesignSource(
      'src/styles/chart.css',
      '.ribbon { fill: #9A78BF; stroke: rgb(0, 0, 0); }',
    );
    expect(hits.map((hit) => hit.rule)).toEqual(['color-literal', 'color-literal']);
  });

  it('allows the same literals in tokens.css', () => {
    const hits = lintDesignSource(
      'src/styles/tokens.css',
      ':root { --ink: #2A241C; --paper: rgb(241, 232, 210); }',
    );
    expect(hits).toEqual([]);
    expect(isTokensFile('src/styles/tokens.css')).toBe(true);
  });
});

describe('font-size floors', () => {
  it('uses 13px for UI, 11px for callouts, and 10px for the chart', () => {
    expect(fontSizeFloor('src/ui/TopBar.tsx')).toBe(13);
    expect(fontSizeFloor('src/styles/ui.css')).toBe(13);
    expect(fontSizeFloor('src/render/Callout.tsx')).toBe(11);
    expect(fontSizeFloor('src/render/RibbonLabel.tsx')).toBe(10);
  });

  it('rejects type below the floor and accepts type on it', () => {
    expect(
      lintDesignSource(
        'src/ui/TopBar.tsx',
        '<button style={{ fontSize: 12 }}>Search</button>',
      ),
    ).toHaveLength(1);
    expect(lintDesignSource('src/styles/ui.css', '.bar { font-size: 13px; }')).toEqual(
      [],
    );
    expect(
      lintDesignSource(
        'src/render/Callout.tsx',
        '<text style={{ fontSize: "10px" }} />',
      ),
    ).toHaveLength(1);
    expect(
      lintDesignSource('src/styles/chart.css', '.tick { font-size: 0.5rem; }'),
    ).toHaveLength(1);
    expect(
      lintDesignSource('src/styles/chart.css', '.tick { font-size: 10px; }'),
    ).toEqual([]);
  });
});

describe('infinite animation', () => {
  it('allows only the loading spinner', () => {
    expect(
      lintDesignSource(
        'src/styles/ui.css',
        '.loading-spinner { animation: spin 1s linear infinite; }',
      ),
    ).toEqual([]);
    const hits = lintDesignSource(
      'src/styles/chart.css',
      '.route { animation: dash 2s linear infinite; }',
    );
    expect(hits.map((hit) => hit.rule)).toEqual(['infinite-animation']);
  });
});

describe('icon-only buttons', () => {
  it('requires an accessible name when the button has no text', () => {
    const bare = lintDesignSource(
      'src/ui/TopBar.tsx',
      '<button type="button"><svg /></button>',
    );
    expect(bare.map((hit) => hit.rule)).toContain('icon-button-name');
    expect(
      lintDesignSource(
        'src/ui/TopBar.tsx',
        '<button type="button" aria-label="Close"><svg /></button>',
      ),
    ).toEqual([]);
    expect(
      lintDesignSource('src/ui/TopBar.tsx', '<button type="button">Close</button>'),
    ).toEqual([]);
  });
});

describe('remote fonts', () => {
  it('rejects hosted font services and allows fontsource imports', () => {
    const hits = lintDesignSource(
      'index.html',
      '<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />',
    );
    expect(hits.map((hit) => hit.rule)).toEqual(['remote-font']);
    expect(
      lintDesignSource('src/main.tsx', "import '@fontsource/source-sans-3/400.css';"),
    ).toEqual([]);
  });
});

describe('legacy allowlist', () => {
  it('stays limited to v1 paths', () => {
    expect([...LEGACY_DESIGN_LINT_ALLOWLIST]).toEqual([
      'src/App.tsx',
      'src/main.tsx',
      'src/components/',
      'src/styles/app.css',
      'src/utils/',
    ]);
    expect(isLegacyDesignPath('src/components/TimelineCanvas.tsx')).toBe(true);
    expect(isLegacyDesignPath('src/styles/tokens.css')).toBe(false);
    expect(isLegacyDesignPath('src/ui/TopBar.tsx')).toBe(false);
  });
});
