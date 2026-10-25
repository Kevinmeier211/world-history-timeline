export interface RunConfig {
  MAX_PHASE: number;
  ALLOW_MEDIA_DOWNLOAD: boolean;
  ALLOW_PUSH: boolean;
  ALLOW_DEPLOY: boolean;
  DEPLOY_TARGET: string;
  ALLOW_BIG_DEPS: boolean;
  CC_BY_APPROVED_IDS: string[];
}

function stripComment(value: string): string {
  const hash = value.indexOf('#');
  return (hash === -1 ? value : value.slice(0, hash)).trim();
}

export function parseRunConfig(text: string): RunConfig {
  const raw: Record<string, string> = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    raw[trimmed.slice(0, eq).trim()] = stripComment(trimmed.slice(eq + 1));
  }
  const flag = (key: string) => raw[key] === 'true';
  const phase = Number(raw.MAX_PHASE ?? '7');
  return {
    MAX_PHASE: Number.isFinite(phase) ? phase : 7,
    ALLOW_MEDIA_DOWNLOAD: flag('ALLOW_MEDIA_DOWNLOAD'),
    ALLOW_PUSH: flag('ALLOW_PUSH'),
    ALLOW_DEPLOY: flag('ALLOW_DEPLOY'),
    DEPLOY_TARGET: raw.DEPLOY_TARGET ?? '',
    ALLOW_BIG_DEPS: flag('ALLOW_BIG_DEPS'),
    CC_BY_APPROVED_IDS: (raw.CC_BY_APPROVED_IDS ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0),
  };
}
