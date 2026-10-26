import type { Relation } from './schema/index.ts';

/** A split or merge the abutment rules do not emit on their own. */
export interface ExplicitFork {
  id: string;
  type: 'split' | 'merge';
  year: number;
  from: readonly string[];
  to: readonly string[];
  note: string;
}

/**
 * Rome's halves and the Castile–Aragon union. Abutment stays inside one family
 * and types two predecessors as disputed, so these edges are named here.
 * Dates are conventional. The cited pages were not opened.
 */
export const EXPLICIT_FORKS: readonly ExplicitFork[] = [
  {
    id: 'split_roman_empire_eastern_roman_empire_western_roman_empire',
    type: 'split',
    year: 395,
    from: ['roman_empire'],
    to: ['eastern_roman_empire', 'western_roman_empire'],
    note: 'Conventional division in 395. The western ribbon runs to 476. The eastern ribbon stops at 476 so it does not lie on the Byzantine ribbon through 1453. Pages were not opened.',
  },
  {
    id: 'merge_aragon_castile_spain_union',
    type: 'merge',
    year: 1469,
    from: ['aragon', 'castile'],
    to: ['spain_union'],
    note: 'Checklist date for the union of the crowns, 1469. Pages were not opened.',
  },
];

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((id, index) => id === b[index]);
}

/** Relations for forks whose endpoints are all in the roster. */
export function forkRelations(
  polities: readonly { id: string; sourceIds: readonly string[] }[],
): Relation[] {
  const byId = new Map(polities.map((polity) => [polity.id, polity]));
  const built: Relation[] = [];
  for (const fork of EXPLICIT_FORKS) {
    if (![...fork.from, ...fork.to].every((id) => byId.has(id))) continue;
    const source = byId.get(fork.to[0] ?? '');
    if (!source || source.sourceIds.length === 0) continue;
    built.push({
      id: fork.id,
      from: [...fork.from],
      to: [...fork.to],
      year: fork.year,
      type: fork.type,
      note: fork.note,
      sourceIds: [...source.sourceIds],
      confidence: 'debated',
      verification: 'unverified',
      evidence: fork.note,
    });
  }
  return built;
}

/**
 * Drop the abutment edge that the explicit fork replaces.
 * A split replaces a same-parent succession or split onto its children.
 * A merge replaces the disputed or succession edge with the same ends.
 */
export function forkReplaces(item: Relation, forks: readonly Relation[]): boolean {
  return forks.some((fork) => {
    if (fork.type === 'merge') {
      if (item.type !== 'disputed' && item.type !== 'succession') return false;
      return sameIds(item.from, fork.from) && sameIds(item.to, fork.to);
    }
    if (item.type !== 'succession' && item.type !== 'split') return false;
    return sameIds(item.from, fork.from) && item.to.every((id) => fork.to.includes(id));
  });
}
