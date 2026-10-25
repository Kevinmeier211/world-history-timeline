import { describe, expect, it } from 'vitest';

import { paletteIssues, type PaletteFamily, type PaletteTheme } from './check.ts';

const light: PaletteTheme = { name: 'light', ink: '#2A241C', paper: '#F1E8D2' };

function family(id: string, color: string, xZones: string[]): PaletteFamily {
  return { id, color, xZones };
}

describe('paletteIssues', () => {
  it('rejects identical neighbors and a low-contrast ribbon', () => {
    const issues = paletteIssues(
      [family('a', '#888888', ['europe']), family('b', '#888888', ['europe'])],
      [light],
    );
    expect(
      issues.some(
        (issue) => issue.kind === 'deltaE' && issue.message.includes('normal'),
      ),
    ).toBe(true);
    const pale = paletteIssues([family('wash', '#7A756C', ['europe'])], [light]);
    expect(pale.some((issue) => issue.kind === 'contrast')).toBe(true);
  });

  it('accepts distant colors that do not share a zone', () => {
    const issues = paletteIssues(
      [family('west', '#FAB800', ['europe']), family('east', '#8E2F2A', ['east_asia'])],
      [light],
    );
    expect(issues).toEqual([]);
  });

  it('rejects a pair that collides only after color-vision simulation', () => {
    const issues = paletteIssues(
      [family('red', '#D9473F', ['africa']), family('green', '#2F9E44', ['africa'])],
      [light],
    );
    const modes = issues
      .filter((issue) => issue.kind === 'deltaE')
      .map((issue) => issue.message);
    expect(
      modes.some(
        (message) => message.includes('deuteranopia') || message.includes('protanopia'),
      ),
    ).toBe(true);
  });
});
