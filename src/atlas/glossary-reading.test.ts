import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, GlossaryTerm } from './model';
import { glossaryReading } from './glossary-reading';
const term = (id: string, name = id): GlossaryTerm => ({
  id,
  name,
  definition: 'An existing definition.',
});
describe('Definitions at the point of reading', () => {
  it('conserves every authored character in all main and deeper dossier passages', () => {
    const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
    for (const s of c.subjects) {
      const terms = c.glossary.filter((t) => s.terms.includes(t.id));
      for (const texts of [
        [s.summary, ...s.sections.map((x) => x.text)],
        (s.deeperReading ?? []).map((x) => x.text),
      ]) {
        const parts = glossaryReading(texts, terms);
        expect(parts.map((group) => group.map((part) => part.text).join(''))).toEqual(
          texts,
        );
        const annotated = parts
          .flat()
          .filter((part) => part.term)
          .map((part) => part.term!.id);
        expect(new Set(annotated).size).toBe(annotated.length);
        expect(annotated.every((id) => s.terms.includes(id))).toBe(true);
      }
    }
  });
  it('avoids substring matches, including plurals and non-Latin word boundaries', () => {
    const parts = glossaryReading(
      ['Important ports; a port. xport portx _port; αport. Port!'],
      [term('port')],
    )[0]!;
    expect(parts.filter((p) => p.term).map((p) => p.text)).toEqual(['port']);
    expect(
      glossaryReading(['important ports αport _port'], [term('port')])[0]!.some(
        (p) => p.term,
      ),
    ).toBe(false);
  });
  it('matches authored slash variants, apostrophes and hyphenated phrases', () => {
    const texts = [
      "Jeliw describe mit'a and primary-source evidence.",
      'A jeli tells another account.',
    ];
    const parts = glossaryReading(texts, [
      term('jeli', 'Jeli / jeliw'),
      term('mita', 'Mit’a'),
      term('primary-source'),
    ]);
    expect(
      parts
        .flat()
        .filter((p) => p.term)
        .map((p) => [p.text, p.term!.id]),
    ).toEqual([
      ['Jeliw', 'jeli'],
      ["mit'a", 'mita'],
      ['primary-source', 'primary-source'],
    ]);
    expect(
      glossaryReading(['A primary source.'], [term('primary-source')])[0]!.some(
        (p) => p.term,
      ),
    ).toBe(true);
  });
  it('prefers a complete longer phrase and escapes regex characters literally', () => {
    const parts = glossaryReading(
      ['Experimental archaeology; archaeology. C++ is literal, and C is separate.'],
      [
        term('archaeology'),
        term('experimental', 'experimental archaeology'),
        term('code', 'C++'),
      ],
    )[0]!;
    expect(parts.filter((p) => p.term).map((p) => p.term!.id)).toEqual([
      'experimental',
      'archaeology',
      'code',
    ]);
  });
  it('leaves unknown words intact and never mutates text or glossary data', () => {
    const texts = ['No matching phrase.', '', 'A dynasty; another dynasty.'];
    const terms = [term('dynasty')],
      before = JSON.stringify({ texts, terms });
    expect(glossaryReading(texts, [])).toEqual(
      texts.map((text) => ({ text })).map((part) => [part]),
    );
    expect(glossaryReading(texts, terms)[2]!.filter((p) => p.term)).toHaveLength(1);
    expect(JSON.stringify({ texts, terms })).toBe(before);
  });
});
