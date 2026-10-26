import { execFileSync } from 'node:child_process';

export function toolError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const extra = error as Error & { stderr?: string | Buffer; code?: unknown };
  const stderr = extra.stderr === undefined ? '' : String(extra.stderr).trim();
  const code = extra.code === undefined ? '' : `code ${String(extra.code)}`;
  return [code, error.message, stderr].filter((part) => part.length > 0).join('\n');
}

export function runTool(
  command: string,
  args: readonly string[],
): { ok: true; stdout: string } | { ok: false; error: string } {
  try {
    const stdout = execFileSync(command, [...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024,
    });
    return { ok: true, stdout };
  } catch (error) {
    return { ok: false, error: toolError(error) };
  }
}
