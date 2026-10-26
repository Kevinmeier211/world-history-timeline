/** Stable hash of a JSON-like value. Key order does not change the result. */
export function stableHash(value: unknown): string {
  if (Array.isArray(value))
    return `[${value.map((item) => stableHash(item)).join(',')}]`;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record)
      .filter((key) => record[key] !== undefined)
      .sort();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableHash(record[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}
