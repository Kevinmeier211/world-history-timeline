export interface TabStop {
  id: string;
  y0: number;
  x?: number;
}

/** Reading order is down the poster, then left to right. */
export function tabOrder<T extends TabStop>(items: readonly T[]): T[] {
  return [...items].sort((left, right) => {
    if (left.y0 !== right.y0) return left.y0 - right.y0;
    const dx = (left.x ?? 0) - (right.x ?? 0);
    if (dx !== 0) return dx;
    return left.id.localeCompare(right.id);
  });
}
