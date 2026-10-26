/** A plate or figure may use a local path. A remote URL is not drawn. */
export function localMediaHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('//')) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return undefined;
  return trimmed;
}
