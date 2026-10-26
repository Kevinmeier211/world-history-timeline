export interface ManifestEntry {
  path: string;
  bytes: number;
  widthIn: number;
  heightIn: number;
  pages: number | null;
}

export interface PrintManifest {
  generatedAt: string;
  files: ManifestEntry[];
}

/** Inches from a measured point size. A missing measurement keeps the requested size. */
export function pageInches(points: number | null, fallback: number): number {
  if (points === null) return fallback;
  return points / 72;
}

/** The clock value is passed in. This function does not read the time. */
export function printManifest(
  generatedAt: string,
  files: readonly ManifestEntry[],
): PrintManifest {
  return {
    generatedAt,
    files: files.map((file) => ({ ...file })),
  };
}

export function manifestJson(manifest: PrintManifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
