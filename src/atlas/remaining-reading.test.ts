import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';

const c = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
const subject = (id: string) => c.subjects.find((row) => row.id === id)!;
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

describe('Remaining reading expansion', () => {
  it('keeps 77 dossiers and the previous image count', () => {
    expect(validateCorpus(c)).toEqual([]);
    expect(c.subjects).toHaveLength(77);
    expect(c.media).toHaveLength(105);
  });

  it('preserves every remaining case interval', () => {
    expect(subject('bering-sea-carvers').interval).toMatchObject({
      start: 300,
      end: 500,
    });
    expect(subject('middle-niger').interval).toMatchObject({
      start: 1200,
      end: 1300,
    });
    expect(subject('polynesian-voyaging').interval).toMatchObject({
      start: 1250,
      end: 1300,
    });
    expect(subject('haitian-revolution').interval).toMatchObject({
      start: 1791,
      end: 1804,
    });
    expect(subject('ozette-makah').interval).toMatchObject({
      start: 1560,
      end: 1700,
      precision: 'disputed',
    });
    expect(subject('wendat-laine').interval).toMatchObject({
      start: 1595,
      end: 1626,
    });
    expect(subject('haudenosaunee-canandaigua').interval).toMatchObject({
      start: 1794,
      end: 1795,
    });
    expect(subject('tiriti').interval).toMatchObject({ start: 1840, end: 1840 });
    expect(subject('world-war-one').interval).toMatchObject({
      start: 1914,
      end: 1918,
    });
    expect(subject('world-war-two').interval).toMatchObject({
      start: 1933,
      end: 1945,
    });
    expect(subject('sputnik').interval).toMatchObject({ start: 1957, end: 1957 });
    expect(subject('inuinnait-sewing').interval).toMatchObject({
      start: 1913,
      end: 1916,
    });
    expect(subject('cherokee-print').interval).toMatchObject({
      start: 1821,
      end: 1839,
    });
    expect(subject('ojibwe-manoomin').interval).toMatchObject({
      start: 1913,
      end: 1913,
    });
  });

  it('adds reference frames without new regional war dossiers', () => {
    const ids = c.subjects.map((row) => row.id);
    expect(ids).not.toContain('ww1-indian-mail');
    expect(ids).not.toContain('ww1-birtley-belgians');
    expect(ids).not.toContain('ww1-east-african-carriers');
    expect(ids).not.toContain('nanjing-civilian-refuge');
    expect(ids).not.toContain('singapore-household-food');
    expect(ids).not.toContain('warsaw-oneg-shabbat');
    expect(subject('world-war-one').contextIds).toContain('ww1-decisions-work-context');
    expect(subject('world-war-two').contextIds).toContain(
      'war-occupation-persecution-context',
    );
    expect(
      c.contexts!.find((row) => row.id === 'war-occupation-persecution-context')!
        .interval,
    ).toMatchObject({ start: 1931, end: 1945 });
    expect(subject('wendat-laine').deeperReading?.length).toBeGreaterThan(0);
    expect(subject('wendat-laine').contextIds ?? []).toEqual([]);
  });

  it('keeps the Middle Niger figure apart from the excavated sequence', () => {
    const s = subject('middle-niger');
    const text = [s.summary, ...s.sections.map((row) => row.text)].join(' ');
    const deeper = s.deeperReading!.map((row) => row.text).join(' ');
    expect(words(text)).toBeGreaterThan(300);
    expect(text).toMatch(/thirteenth century/i);
    expect(text).toMatch(/centralized state/);
    expect(deeper).toMatch(/hypothesis/);
    expect(s.objectIds).toEqual(['met-314362']);
    expect(s.claims.map((row) => row.id)).toEqual(['middle-niger-checked']);
    expect(Object.keys(s.dimensions)).toEqual(['participation', 'evidence']);
    expect(s.interval).toMatchObject({ start: 1200, end: 1300 });
    const context = c.contexts!.find(
      (row) => row.id === 'middle-niger-settlement-evidence',
    )!;
    expect(context.interval).toMatchObject({ start: 400, end: 1400 });
    expect(context.interval.note).toMatch(
      /thirteenth-century object interval remains separate/,
    );
    expect(
      c.contexts!.some((row) => row.id === 'middle-niger-urban-study-context'),
    ).toBe(false);
    const figure = c.sources.find((row) => row.id === 'met-314362')!;
    expect(figure.accessed).toBe('2026-10-29');
    expect(figure.scope).toMatch(/Prior consultation \(2026-10-26\) retained/);
    expect(figure.scope).toMatch(/not a controlled excavated locus/);
    expect(s.review!.limitations.join(' ')).toMatch(
      /1981 paper was read only through its exposed extract/,
    );
    expect(
      `${s.familyActivity!.steps.join(' ')} ${s.familyActivity!.explanation}`,
    ).toMatch(/without giving the person a feeling/);
  });

  it('keeps Polynesian settlement dating apart from modern practice', () => {
    const s = subject('polynesian-voyaging');
    const text = [
      s.summary,
      ...s.sections.map((row) => row.text),
      ...s.deeperReading!.map((row) => row.text),
    ].join(' ');
    expect(text).toMatch(/1250/);
    expect(text).toMatch(/1280/);
    expect(text).toMatch(/Hōkūleʻa/);
    expect(text).toMatch(/68%/);
    expect(text).toMatch(/No compass is copied/);
    expect(s.familyActivity!.explanation).toMatch(/does not teach navigation at sea/);
    expect(s.objectIds).toEqual([]);
    expect(s.claims.map((row) => row.id)).toEqual(['polynesian-voyaging-checked']);
    expect(Object.keys(s.dimensions)).toEqual(['production', 'evidence']);
    expect(s.interval).toMatchObject({ start: 1250, end: 1300 });
    const context = c.contexts!.find(
      (row) => row.id === 'voyaging-dating-knowledge-context',
    )!;
    expect(context.interval).toMatchObject({ start: 1250, end: 1300 });
    expect(context.interval.note).toMatch(/complete case interval unchanged/);
    expect(
      c.contexts!.some((row) => row.id === 'polynesian-settlement-practice-context'),
    ).toBe(false);
    const settlement = c.sources.find((row) => row.id === 'nz-settlement')!;
    expect(settlement.accessed).toBe('2026-11-04');
    expect(s.claims[0]!.citations.map((ref) => ref.source)).toEqual([
      'nz-settlement',
      'navigation',
    ]);
    expect(settlement.scope).toContain('4 November');
    expect(settlement.scope).toMatch(/Prior consultation, 2026-10-26 \(retained\)/);
    expect(s.review!.limitations.join(' ')).toMatch(/waiata/);
  });

  it('puts war capsules on the existing dossiers', () => {
    const ww1 = [
      subject('world-war-one').summary,
      ...subject('world-war-one').sections.map((row) => row.text),
      ...subject('world-war-one').deeperReading!.map((row) => row.text),
      ...subject('world-war-one').evidenceReading!.items.map((row) => row.text),
    ].join(' ');
    expect(ww1).toMatch(/Natha Singh/);
    expect(ww1).toMatch(/19 February 1916/);
    expect(ww1).toMatch(/Debauche/);
    expect(ww1).toMatch(/Watkins/);
    expect(ww1).not.toMatch(/regional inquiries/);
    const ww2 = subject('world-war-two');
    const ww2Text = [
      ...ww2.sections.map((row) => row.text),
      ...ww2.deeperReading!.map((row) => row.text),
      ...ww2.evidenceReading!.items.map((row) => `${row.text} ${row.interpretation}`),
      ww2.familyActivity!.explanation,
    ].join(' ');
    expect(ww2Text).toMatch(/Tsen Shui-fang/);
    expect(ww2Text).toMatch(/Lichtensztajn/);
    expect(ww2Text).toMatch(/31 July 1942/);
    expect(ww2Text).toMatch(/Lee Tian Soo/);
    expect(ww2Text).toMatch(/not read/);
    expect(ww2.familyActivity!.duration).toMatch(/older reader/i);
    expect(ww2.familyActivity!.steps.join(' ')).toMatch(/Do not act out/);
    expect(ww2.review!.limitations.join(' ')).toMatch(/nanjing-civilian-refuge/);
    expect(c.subjects.map((row) => row.id)).not.toContain('nanjing-civilian-refuge');
  });
});
