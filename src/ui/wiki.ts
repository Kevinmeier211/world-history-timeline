export interface WikiExtract {
  title: string;
  extract: string;
}

const cache = new Map<string, WikiExtract>();

export function wikiSummaryUrl(title: string): string {
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
}

export function resetWikiCache(): void {
  cache.clear();
}

export async function loadWikiExtract(
  title: string,
  fetchImpl: typeof fetch,
  signal?: AbortSignal,
): Promise<WikiExtract> {
  const cached = cache.get(title);
  if (cached) return cached;
  const response = await fetchImpl(wikiSummaryUrl(title), { signal });
  if (!response.ok) throw new Error(`wikipedia ${response.status}`);
  const body = (await response.json()) as { title?: unknown; extract?: unknown };
  if (typeof body.extract !== 'string' || body.extract.trim() === '') {
    throw new Error('wikipedia empty');
  }
  const extract: WikiExtract = {
    title: typeof body.title === 'string' && body.title ? body.title : title,
    extract: body.extract.trim(),
  };
  cache.set(title, extract);
  return extract;
}
