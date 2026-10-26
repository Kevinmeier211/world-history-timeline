import { appendFileSync, readFileSync } from 'node:fs';

/** A Blocked note for QUESTIONS.md. The error text is copied, not paraphrased. */
export function blockedEntry(tool: string, task: string, error: string): string {
  return [
    '',
    `## Blocked — ${tool} (${task})`,
    '',
    'Why it matters: The print tool did not run, so this check is not claimed.',
    '',
    'Default applied: The exact error is recorded. Parts of the task that can run still run.',
    '',
    '```',
    error.trim(),
    '```',
    '',
    `Affects tasks: ${task}.`,
    '',
  ].join('\n');
}

export function logBlocked(tool: string, task: string, error: string): void {
  const marker = `Blocked — ${tool} (${task})`;
  const file = 'docs/QUESTIONS.md';
  const current = readFileSync(file, 'utf8');
  console.error(marker);
  console.error(error.trim());
  if (current.includes(marker)) return;
  appendFileSync(file, blockedEntry(tool, task, error));
}
