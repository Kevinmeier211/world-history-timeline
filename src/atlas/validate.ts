import { orientationYears } from './regional-reading-contract';
import type { Corpus, Citation } from './model';
import { regions } from './model';
import { toT } from '../lib/years';
import { comparisonPartners, sharedDimensions } from './comparisons';
import { isCompleteMedia, validAdditionalImageAlts } from './media-details';
export function validateCorpus(c: Corpus, complete = false): string[] {
  const errors: string[] = [];
  const fail = (s: string) => errors.push(s);
  for (const collection of [
    'subjects',
    'sources',
    'media',
    'relations',
    'packs',
    'journeys',
    'glossary',
  ] as const) {
    const ids = new Set<string>();
    for (const row of c[collection]) {
      if (ids.has(row.id)) fail(`Duplicate ${collection} ${row.id}`);
      ids.add(row.id);
    }
  }
  const sources = new Set(c.sources.map((s) => s.id)),
    subjects = new Set(c.subjects.map((s) => s.id)),
    media = new Set(c.media.map((m) => m.id)),
    packs = new Set(c.packs.map((p) => p.id));
  for (const source of c.sources) {
    try {
      const url = new URL(source.url);
      if (!['http:', 'https:'].includes(url.protocol) || /\s/.test(source.url))
        fail(`${source.id}: invalid source URL`);
    } catch {
      fail(`${source.id}: invalid source URL`);
    }
  }
  const citations = (cs: Citation[], owner: string) => {
    if (!cs.length) fail(`${owner}: missing evidence`);
    for (const ref of cs)
      if (!sources.has(ref.source) || ref.locator.length < 4)
        fail(`${owner}: unresolved citation ${ref.source}`);
  };
  const scaffold =
    /appendix\s+b|checklist|not opened|placeholder|\bTODO\b|cited.page|count floor/i;
  const contextIds = new Set<string>();
  for (const context of c.contexts ?? []) {
    if (contextIds.has(context.id)) fail(`Duplicate contexts ${context.id}`);
    contextIds.add(context.id);
    const d = context.interval;
    if (
      d.start === 0 ||
      d.end === 0 ||
      (d.start !== null && d.end !== null && d.start > d.end)
    )
      fail(`${context.id}: invalid context interval`);
    if (!d.label || !d.note || !context.summary)
      fail(`${context.id}: incomplete context`);
    if (d.ongoing && d.end !== null)
      fail(`${context.id}: ongoing context has a manufactured end`);
    citations(context.citations, context.id);
    for (const id of context.subjectIds)
      if (!subjects.has(id)) fail(`${context.id}: missing context subject ${id}`);
    let previous = -Infinity;
    for (const phase of context.phases) {
      if (
        !Number.isFinite(phase.year) ||
        phase.year === 0 ||
        phase.year < previous ||
        (d.start !== null && phase.year < d.start) ||
        (d.end !== null && phase.year > d.end)
      )
        fail(`${context.id}: invalid phase chronology`);
      previous = phase.year;
      citations(phase.citations, `${context.id}/${phase.title}`);
    }
  }
  const comparisonIds = new Set<string>();
  const orientationIds = new Set<string>();
  const snapshotKeys = new Set<string>();
  for (const orientation of c.orientations ?? []) {
    if (orientationIds.has(orientation.id))
      fail(`Duplicate orientation ${orientation.id}`);
    orientationIds.add(orientation.id);
    if (!packs.has(orientation.chapter) || !regions.includes(orientation.region))
      fail(`${orientation.id}: invalid chapter or region`);
    if (!orientation.id.startsWith(`${orientation.chapter}-R`))
      fail(`${orientation.id}: chapter identity mismatch`);
    if (
      !orientation.title ||
      !orientation.question ||
      !orientation.scope ||
      !orientation.perspectives ||
      !orientation.activity.prompt ||
      !orientation.activity.response ||
      !orientation.sections.length ||
      !orientation.snapshots.length ||
      !orientation.subjectIds.length
    )
      fail(`${orientation.id}: incomplete orientation`);
    for (const section of [orientation.summary, ...orientation.sections]) {
      if (!section.title || !section.text) fail(`${orientation.id}: empty reading`);
      citations(section.citations, `${orientation.id}/${section.title}`);
    }
    for (const id of orientation.contextIds)
      if (!contextIds.has(id)) fail(`${orientation.id}: missing reference ${id}`);
    for (const id of orientation.subjectIds)
      if (!subjects.has(id)) fail(`${orientation.id}: missing destination ${id}`);
    for (const snapshot of orientation.snapshots) {
      const key = `${snapshot.year}:${snapshot.region}`;
      if (snapshotKeys.has(key)) fail(`${orientation.id}: duplicate snapshot ${key}`);
      snapshotKeys.add(key);
      if (
        !Number.isInteger(snapshot.year) ||
        snapshot.year === 0 ||
        !orientationYears[orientation.chapter]?.includes(snapshot.year) ||
        snapshot.orientation !== orientation.id ||
        snapshot.region !== orientation.region ||
        !snapshot.text
      )
        fail(`${orientation.id}: invalid snapshot reading`);
      citations(snapshot.citations, `${orientation.id}/${snapshot.year}`);
    }
  }
  for (const pair of c.comparisons ?? []) {
    if (comparisonIds.has(pair.id)) fail(`Duplicate comparison ${pair.id}`);
    comparisonIds.add(pair.id);
    const [a, b] = pair.subjects.map((id) => c.subjects.find((s) => s.id === id));
    if (
      !a ||
      !b ||
      a.id === b.id ||
      !pair.question ||
      (a && b && !sharedDimensions(a, b).length)
    )
      fail(`${pair.id}: unsupported comparison`);
  }
  for (const s of c.subjects) {
    if (s.status !== 'published') fail(`${s.id}: non-release status`);
    if (!s.summary || s.sections.length < 2 || !s.claims.length)
      fail(`${s.id}: incomplete dossier`);
    if (scaffold.test([s.summary, ...s.sections.map((x) => x.text)].join(' ')))
      fail(`${s.id}: research scaffold in teaching prose`);
    const d = s.interval;
    if (d.start === 0 || d.end === 0) fail(`${s.id}: year zero`);
    if (
      d.start !== null &&
      d.end !== null &&
      d.start !== 0 &&
      d.end !== 0 &&
      toT(d.start) > toT(d.end)
    )
      fail(`${s.id}: reversed interval`);
    if (d.ongoing && d.end !== null)
      fail(`${s.id}: ongoing identity has a manufactured end`);
    if (!d.note || !d.label) fail(`${s.id}: unexplained interval`);
    if (!s.geographicPrecision) fail(`${s.id}: unexplained map precision`);
    for (const alternative of s.interval.alternatives ?? [])
      citations(alternative.citations, `${s.id}/date alternative`);
    if (
      !s.coordinates.every(Number.isFinite) ||
      Math.abs(s.coordinates[0]) > 180 ||
      Math.abs(s.coordinates[1]) > 90
    )
      fail(`${s.id}: invalid geographic locator`);
    if (!s.packs.length) fail(`${s.id}: no chapter membership`);
    for (const p of s.packs) if (!packs.has(p)) fail(`${s.id}: missing pack ${p}`);
    for (const sec of s.sections) citations(sec.citations, `${s.id}/${sec.title}`);
    for (const sec of s.deeperReading ?? [])
      citations(sec.citations, `${s.id}/${sec.title}`);
    for (const item of s.evidenceReading?.items ?? [])
      citations(item.citations, `${s.id}/${item.label}`);
    for (const id of s.contextIds ?? [])
      if (!contextIds.has(id)) fail(`${s.id}: missing historical context ${id}`);
    if (
      s.dimensionKeys &&
      [...s.dimensionKeys].sort().join('|') !==
        Object.keys(s.dimensions).sort().join('|')
    )
      fail(`${s.id}: comparison keys do not match content`);
    if (c.comparisons?.length && !comparisonPartners(c, s).length)
      fail(`${s.id}: no supported default comparison`);
    if (s.placeStudy) {
      const place = s.placeStudy;
      const [west, south, east, north] = Array.isArray(place.bounds)
        ? place.bounds
        : ([NaN, NaN, NaN, NaN] as [number, number, number, number]);
      const crosses = place.crossesAntimeridian === true;
      const longitudeSpan = (crosses ? east + 360 : east) - west;
      if (
        !Array.isArray(place.bounds) ||
        place.bounds.length !== 4 ||
        ![west, south, east, north].every(Number.isFinite) ||
        (place.crossesAntimeridian !== undefined &&
          typeof place.crossesAntimeridian !== 'boolean') ||
        (crosses ? west <= east : west >= east) ||
        longitudeSpan <= 0 ||
        south >= north ||
        west < -180 ||
        west > 180 ||
        east < -180 ||
        east > 180 ||
        south < -90 ||
        north > 90
      )
        fail(`${s.id}: invalid place-study bounds`);
      const includesLongitude = (x: number) =>
        crosses ? x >= west || x <= east : x >= west && x <= east;
      const includesPoint = (coordinates: [number, number]) => {
        if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;
        const [x, y] = coordinates;
        return (
          Number.isFinite(x) &&
          Number.isFinite(y) &&
          x >= -180 &&
          x <= 180 &&
          includesLongitude(x) &&
          y >= south &&
          y <= north
        );
      };
      const pointIds = new Set<string>();
      for (const point of place.points) {
        if (pointIds.has(point.id)) fail(`${s.id}: duplicate place point ${point.id}`);
        pointIds.add(point.id);
        if (!includesPoint(point.coordinates))
          fail(`${s.id}: place point outside bounds`);
        citations(point.citations, `${s.id}/${point.id}`);
      }
      for (const feature of place.features) {
        if (
          feature.points.length < 2 ||
          feature.points.some((point) => !includesPoint(point))
        )
          fail(`${s.id}: invalid place feature`);
        citations(feature.citations, `${s.id}/${feature.label}`);
      }
    }
    for (const claim of s.claims) {
      citations(claim.citations, claim.id);
      if (claim.status !== 'published' || !claim.checkedBy || !claim.checkedOn)
        fail(`${claim.id}: unchecked required claim`);
    }
    for (const m of s.objectIds) if (!media.has(m)) fail(`${s.id}: missing media ${m}`);
    for (const term of s.terms)
      if (!c.glossary.some((t) => t.id === term))
        fail(`${s.id}: missing glossary ${term}`);
    for (const [dim, value] of Object.entries(s.dimensions))
      citations(value.citations, `${s.id}/${dim}`);
  }
  for (const m of c.media) {
    if (!validAdditionalImageAlts(m))
      fail(
        `${m.id}: alternate image descriptions must align exactly with nonblank alternate paths`,
      );
    if (m.date.start === 0 || m.date.end === 0) fail(`${m.id}: media year zero`);
    if (m.date.start !== null && m.date.end !== null && m.date.start > m.date.end)
      fail(`${m.id}: reversed media interval`);
    if (!m.date.label || !m.date.note) fail(`${m.id}: unexplained object chronology`);
    if (!subjects.has(m.subject) || !sources.has(m.source))
      fail(`${m.id}: missing context`);
    if (
      !m.rights ||
      !m.credit ||
      !m.alt ||
      !m.caption ||
      !m.relevance ||
      !m.image ||
      !m.thumbnail ||
      !m.width ||
      !m.height
    )
      fail(`${m.id}: incomplete media contract`);
    if (!!m.hasAnnotations !== !!m.annotations)
      fail(`${m.id}: annotation flag and reading notes disagree`);
    if (m.annotations) {
      const annotatedId = m.id;
      if (!isCompleteMedia(m)) {
        fail(`${annotatedId}: invalid modern annotation contract`);
        continue;
      }
      if (
        !m.annotations.createdOn ||
        !m.annotations.credit ||
        !m.annotations.rights ||
        !/^https?:\/\//.test(m.annotations.licenseUrl) ||
        !m.annotations.items.length
      )
        fail(`${m.id}: incomplete modern annotation credit`);
      const ids = new Set<string>(),
        labels = new Set<string>();
      for (const note of m.annotations.items) {
        if (
          !note.id ||
          !note.label ||
          !note.text ||
          ids.has(note.id) ||
          labels.has(note.label) ||
          !Number.isFinite(note.x) ||
          !Number.isFinite(note.y) ||
          note.x < 0 ||
          note.x > 1 ||
          note.y < 0 ||
          note.y > 1
        )
          fail(`${m.id}: invalid image reading marker`);
        ids.add(note.id);
        labels.add(note.label);
        citations(note.citations, `${m.id}/${note.id}`);
      }
    }
  }
  for (const r of c.relations) {
    if (
      r.id.startsWith('overlap_') ||
      r.id.startsWith('abut_') ||
      !r.explanation ||
      !r.date ||
      r.status !== 'published'
    )
      fail(`${r.id}: unsupported relationship`);
    if (!subjects.has(r.from) || !subjects.has(r.to)) fail(`${r.id}: unknown endpoint`);
    citations(r.citations, r.id);
  }
  for (const j of c.journeys) {
    if (j.familyEvidence) {
      const f = j.familyEvidence;
      if (!f.title || !f.text || !f.claimPrompt || f.notice.length < 1)
        fail(`${j.id}: incomplete family evidence`);
      citations(f.citations, `${j.id}/family`);
      if (
        f.object &&
        !j.stops.some((stop) =>
          c.subjects.find((s) => s.id === stop.subject)?.objectIds.includes(f.object!),
        )
      )
        fail(`${j.id}: family object must belong to a participating dossier`);
    }
    if (
      j.leadObject &&
      (!c.media.some((m) => m.id === j.leadObject) ||
        !j.stops.some((s) => s.object === j.leadObject))
    )
      fail(`${j.id}: print lead must be a supplied stop object`);
    if (
      j.printSourcesPerPage !== undefined &&
      (!Number.isInteger(j.printSourcesPerPage) || j.printSourcesPerPage < 1)
    )
      fail(`${j.id}: invalid print source page size`);
    const breaks = j.printBreakAfter ?? [];
    if (
      breaks.some(
        (n, i) =>
          !Number.isInteger(n) || n <= (breaks[i - 1] ?? 0) || n >= j.stops.length,
      )
    )
      fail(`${j.id}: invalid print stop break`);
    const hasText = (value: string | undefined) => !!value?.trim();
    const pairedSubjects = new Set(j.stops.map((stop) => stop.subject));
    const authoredPair =
      j.stops.length === 2 &&
      pairedSubjects.size === 2 &&
      (c.comparisons ?? []).some(
        (pair) =>
          pair.subjects.length === 2 &&
          pair.subjects[0] !== pair.subjects[1] &&
          pair.subjects.every((id) => pairedSubjects.has(id)) &&
          hasText(pair.question),
      );
    // A fully sourced family comparison can be complete with two dossiers.
    // Existing family, citation, stop and reasoning checks still apply.
    const completePairedJourney =
      authoredPair &&
      [
        j.title,
        j.question,
        j.duration,
        j.introduction,
        j.conclusion,
        j.returnPrompt,
        j.evidence.prompt,
      ].every(hasText) &&
      j.stops.every(
        (stop) =>
          hasText(stop.title) &&
          hasText(stop.narrative) &&
          Number.isFinite(stop.year) &&
          stop.year !== 0,
      ) &&
      !!j.familyEvidence &&
      [
        j.familyEvidence.title,
        j.familyEvidence.text,
        j.familyEvidence.claimPrompt,
      ].every(hasText) &&
      j.familyEvidence.notice.length > 0 &&
      j.familyEvidence.notice.every(hasText) &&
      (j.familyEvidence.returnPrompt === undefined ||
        hasText(j.familyEvidence.returnPrompt)) &&
      (j.familyEvidence.feedback === undefined || hasText(j.familyEvidence.feedback)) &&
      j.familyEvidence.citations.length > 0 &&
      j.evidence.citations.length > 0 &&
      j.evidence.options.length >= 2 &&
      j.evidence.options.some((option) => option.supported) &&
      j.evidence.options.every(
        (option) => hasText(option.text) && hasText(option.feedback),
      );
    if (
      (j.stops.length < 3 && !completePairedJourney) ||
      !j.conclusion ||
      !j.returnPrompt
    )
      fail(`${j.id}: unfinished investigation`);
    for (const s of j.stops) {
      if (!subjects.has(s.subject)) fail(`${j.id}: missing stop ${s.subject}`);
      if (s.compare && !subjects.has(s.compare))
        fail(`${j.id}: missing comparison target`);
      if (s.relation && !c.relations.some((r) => r.id === s.relation))
        fail(`${j.id}: missing supported connection`);
      if (s.object && !media.has(s.object)) fail(`${j.id}: missing object`);
      if (!s.narrative || !s.title || s.year === 0) fail(`${j.id}: incomplete stop`);
    }
    if (
      !j.evidence.options.some((o) => o.supported) ||
      j.evidence.options.some((o) => !o.feedback)
    )
      fail(`${j.id}: missing reasoning feedback`);
    citations(j.evidence.citations, j.id);
  }
  for (const p of c.packs) {
    for (const id of p.featuredSubjects ?? [])
      if (!c.subjects.some((s) => s.id === id && s.packs.includes(p.id)))
        fail(`${p.id}: invalid featured subject ${id}`);
    for (const investigation of p.investigations ?? []) {
      if (!c.journeys.some((j) => j.id === investigation.journey))
        fail(`${p.id}: missing companion journey ${investigation.journey}`);
      for (const id of investigation.comparison)
        if (!subjects.has(id)) fail(`${p.id}: missing companion comparison ${id}`);
      const start = investigation.start ?? p.start;
      const end = investigation.end ?? p.end;
      if (!investigation.title || !start || !end || toT(start) > toT(end))
        fail(`${p.id}: invalid companion investigation scope`);
    }
    if (!c.journeys.some((j) => j.id === p.journey)) fail(`${p.id}: missing journey`);
    for (const id of p.comparison)
      if (!subjects.has(id)) fail(`${p.id}: missing comparison subject`);
    if (!p.orientation || !p.geography || !p.limits)
      fail(`${p.id}: missing orientation`);
    for (const r of regions) {
      const cell = p.coverage[r];
      if (!cell || !cell.reason) fail(`${p.id}/${r}: absent editorial assessment`);
      else
        for (const id of cell.subjects)
          if (!subjects.has(id)) fail(`${p.id}/${r}: missing covered subject`);
    }
  }
  if (complete) {
    for (const [chapter, years] of Object.entries(orientationYears))
      for (const region of regions) {
        const matching =
          c.orientations?.filter((r) => r.chapter === chapter && r.region === region) ??
          [];
        if (
          matching.length !== 1 ||
          years.some((y) => !matching[0]?.snapshots.some((s) => s.year === y))
        )
          fail(
            chapter +
              '/' +
              region +
              ': missing required regional reading or dated snapshot',
          );
      }
    const investigationRefs = c.packs.flatMap((p) => [
      p.journey,
      ...(p.investigations ?? []).map((i) => i.journey),
    ]);
    for (const j of c.journeys)
      if (!investigationRefs.includes(j.id))
        fail(`${j.id}: no chapter or printable investigation entry`);
    if (new Set(investigationRefs).size !== investigationRefs.length)
      fail('Duplicate chapter investigation entry');
    for (let i = 1; i <= 8; i++)
      if (!packs.has(`C${i}`)) fail(`Missing required coverage pack C${i}`);
    for (const r of regions)
      if (!c.subjects.some((s) => s.region === r))
        fail(`${r}: no substantive regional treatment`);
  }
  return errors;
}
