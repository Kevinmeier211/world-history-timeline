import { describe, it, expect } from 'vitest';
import { reconcileNotebook } from './notebook-persistence';
import type { Note, Notebook } from './notebook-data';
const note = (id: string, answer = ''): Note => ({
  id,
  title: id,
  question: 'What is the evidence?',
  answer,
  collection: 'Household',
  saved: '2026-11-04T12:00:00Z',
  location: '?year=200',
  kind: 'question',
});
const book = (...notes: Note[]): Notebook => ({ version: 1, notes });
describe('concurrent notebook changes', () => {
  it('preserves independent saves from stale tabs', () => {
    expect(
      reconcileNotebook(book(), book(note('B')), book(note('A'))).notes.map(
        (n) => n.id,
      ),
    ).toEqual(['B', 'A']);
  });
  it('preserves conflicting edits as alternatives', () => {
    const result = reconcileNotebook(
      book(note('A')),
      book(note('A', 'local')),
      book(note('A', 'remote')),
    );
    expect(result.notes.map((n) => n.answer)).toEqual(['remote', 'local']);
    expect(result.notes[1]?.importedFrom).toBe('A');
  });
  it('does not resurrect an unchanged remotely deleted note', () => {
    expect(
      reconcileNotebook(book(note('A')), book(note('A'), note('B')), book()).notes.map(
        (n) => n.id,
      ),
    ).toEqual(['B']);
  });
  it('preserves a remote edit against a stale deletion', () => {
    expect(
      reconcileNotebook(book(note('A')), book(), book(note('A', 'remote'))).notes[0]
        ?.answer,
    ).toBe('remote');
  });
  it('retains an edit competing with deletion as an identified alternative', () => {
    const result = reconcileNotebook(book(note('A')), book(note('A', 'local')), book());
    expect(result.notes[0]?.importedFrom).toBe('A');
    expect(result.notes[0]?.id).not.toBe('A');
  });
  it('applies a deletion of an unchanged version', () => {
    expect(
      reconcileNotebook(book(note('A')), book(), book(note('A'), note('B'))),
    ).toEqual(book(note('B')));
  });
});
