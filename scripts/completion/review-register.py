"""Generate review inputs; presence of fields never constitutes source verification."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
corpus_path = root / 'public/atlas/corpus.json'
c = json.loads(corpus_path.read_text())
tracker = json.loads((root / 'docs/redesign/COMPLETION-TRACKER-2026-11-04.json').read_text())
out = root / 'docs/redesign/review'
out.mkdir(exist_ok=True)
sources = {s['id']: s for s in c['sources']}
subjects = {s['id']: s for s in c['subjects']}
contexts = {s['id']: s for s in c['contexts']}

def citations(value, path='$'):
    result = []
    if isinstance(value, dict):
        if 'source' in value and 'locator' in value:
            result.append({'path': path, **value})
        for key, child in value.items(): result += citations(child, path + '.' + key)
    elif isinstance(value, list):
        for index, child in enumerate(value): result += citations(child, path + '[' + str(index) + ']')
    return result

orientations = []
for unit in tracker['regional_orientations']:
    cases = [subjects[s] for s in unit['current_case_ids']]
    frames = [contexts[s] for s in unit['current_context_ids']]
    refs = sorted({ref['source'] for ref in citations(cases + frames)})
    orientations.append({
        'id': unit['id'], 'chapter': unit['chapter'], 'region': unit['region'],
        'question': unit['question'], 'existingCases': [s['id'] for s in cases],
        'existingFrames': [{'id': s['id'], 'interval': s['interval']} for s in frames],
        'sourcesToConsult': [sources[s] for s in refs],
        'requiredWork': ['Verify the named settings and supported dates against these sources.',
                         'Explain internal differences and change within the chapter; a single case is not a region.',
                         'Identify a consequential evidence limit and missing perspective.',
                         'Choose a supported next reading and a short evidence question.'],
        'gap': 'No current regional frame; new scoped research is required.' if not frames else 'Existing frame coverage needs editorial review across the chapter interval.',
        'status': 'brief_prepared_not_historically_reviewed',
    })

media = []
for m in c['media']:
    files = []
    for url in [m['image'], m['thumbnail'], *m.get('additionalImages', [])]:
        path = root / 'public' / url.lstrip('/')
        files.append({'path': url, 'exists': path.is_file(), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None})
    media.append({'id': m['id'], 'source': sources.get(m['source']), 'rightsAsRecorded': m['rights'], 'creditAsRecorded': m['credit'], 'sourceImage': m.get('sourceImage'), 'files': files, 'review': 'Identity, rights, dates, description and usefulness require source/visual review; hashes prove only local bytes.'})

refs = citations(c)
gaps = [{'id': 'VISUAL-' + s['id'], 'unit': s['id'], 'kind': 'intentional_text_evidence_pending_review', 'disposition': 'docs/redesign/review/TEXT-EVIDENCE-DISPOSITIONS.json', 'nextAction': 'Review the individually documented text treatment and existing source capsules; an image is not required merely to populate a field.'} for s in c['subjects'] if not s['objectIds']]
gaps += [{'id': 'FRAME-' + row['id'], 'unit': row['id'], 'kind': 'no_spanning_frame', 'year': row['year'], 'region': row['region'], 'nextAction': 'Research a bounded named setting for this date; do not stretch case dates.'} for row in tracker['snapshots'] if not row['current_spanning_context_ids']]
gaps += [{'id': 'SOURCE-' + str(i), 'kind': 'unresolved_source_reference', **ref} for i, ref in enumerate(refs) if ref['source'] not in sources]
register = {
    'corpusSHA256': hashlib.sha256(corpus_path.read_bytes()).hexdigest(),
    'status': 'Review preparation only; not historical, rights, or reader acceptance.',
    'counts': {'orientations': len(orientations), 'snapshots': len(tracker['snapshots']), 'dossiers': len(subjects), 'media': len(media), 'citationOccurrences': len(refs)},
    'orientations': orientations, 'gaps': gaps, 'media': media,
    'sourceScopeReviewQueue': [s for s in c['sources'] if any(term in s['scope'].lower() for term in ['unavailable', 'not accessed', 'not consulted', 'only', 'not full'])],
    'sourceScopeQueueNote': 'Keyword routing only, not an assessment that these sources are defective. Read each exact recorded scope and consult the source.',
    'assetInputs': [{'path': str(p.relative_to(root)), 'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'role': 'preserved supplied artifact; regenerate PDFs/archives through the separate print/portable gate' if '/exports/' in str(p) else 'versioned static input or generated content'} for p in sorted((root / 'public').rglob('*')) if p.is_file()],
}
(out / 'current-register.json').write_text(json.dumps(register, indent=2, ensure_ascii=False) + '\n')
for pack in c['packs']:
    rows = [s for s in c['subjects'] if pack['id'] in s['packs']]
    lines = ['# ' + pack['id'] + ': ' + pack['title'], '', 'Review packet generated from corpus ' + register['corpusSHA256'] + '.', '', 'Status: prepared, not reviewed. For each claim, open the cited source and record support, contradiction, uncertainty or unavailable access. Also inspect consequential claims outside the named claim register. Record reviewer, date and exact locator; do not infer approval from field presence.', '', 'Chapter question: ' + pack['question'], '', '## Regional work', '']
    for unit in orientations:
        if unit['chapter'] == pack['id']:
            lines += ['- **' + unit['id'] + ' · ' + unit['region'] + ':** ' + unit['question'] + ' ' + unit['gap']]
    for s in rows:
        lines += ['', '## ' + s['name'] + ' (`' + s['id'] + '`)', '', s['interval']['label'] + ' · ' + s['region'] + ' · ' + s['place'], '', 'Question: ' + s['question'], '', '### Named claims', '']
        for claim in s['claims']:
            lines += ['- **' + claim['id'] + ':** ' + claim['text']]
            for ref in claim['citations']:
                source = sources[ref['source']]
                lines += ['  - [' + source['title'] + '](' + source['url'] + ') — ' + ref['locator'] + '. Recorded scope: ' + source['scope']]
        lines += ['', '### Review record', '', '- Source support/contradiction and exact locator: pending', '- Orientation, explanation and missing perspectives: pending', '- Date, geography and comparison limits: pending', '- Main/deeper/evidence passages beyond named claims: pending', '- Activity success criterion and answerable evidence: pending', '- Visual/rights/alt-text suitability: pending', '- Repair, reviewer and retest reference: pending']
    (out / (pack['id'] + '-review.md')).write_text('\n'.join(lines) + '\n')
print(json.dumps({'counts': register['counts'], 'gapCount': len(gaps)}))
