import type { NoteDraft, Note } from './notebook-data';
import { parseNotebook } from './notebook-data';
import { readLocation, type Location } from './navigation';

export interface QuestionDraft {
  title: string;
  question: string;
  kind: Note['kind'];
  answer: string;
  collection: string;
  location: Location;
}
const isRecord = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === 'object';
const strings = (x: Record<string, unknown>, keys: string[]) =>
  keys.every((k) => typeof x[k] === 'string' && (x[k] as string).length <= 20000);
export function readQuestionDraft(): QuestionDraft | null {
  try {
    const x: unknown = JSON.parse(
      sessionStorage.getItem('chronos.question-draft') ?? 'null',
    );
    if (
      !isRecord(x) ||
      !strings(x, [
        'title',
        'question',
        'answer',
        'collection',
        'kind',
        'locationQuery',
      ]) ||
      !['question', 'subject', 'comparison', 'journey'].includes(x.kind as string)
    )
      return null;
    return {
      ...x,
      location: readLocation(x.locationQuery as string),
    } as unknown as QuestionDraft;
  } catch {
    return null;
  }
}
export function readEditDraft(): NoteDraft | null {
  try {
    const x: unknown = JSON.parse(
      sessionStorage.getItem('chronos.edit-draft') ?? 'null',
    );
    if (
      !isRecord(x) ||
      !strings(x, [
        'id',
        'title',
        'question',
        'collection',
        'answer',
        'reflection',
        'evidence',
      ]) ||
      !['details', 'thinking'].includes(x.mode as string)
    )
      return null;
    if (x.base) parseNotebook(JSON.stringify({ version: 1, notes: [x.base] }));
    return x as unknown as NoteDraft;
  } catch {
    return null;
  }
}
export function saveSessionDraft(key: string, value: unknown): boolean {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function readResume(): string | null {
  try {
    const raw = localStorage.getItem('chronos.resume');
    return raw?.startsWith('?') && raw.length < 10000 ? raw : null;
  } catch {
    return null;
  }
}
