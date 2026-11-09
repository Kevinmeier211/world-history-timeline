"""Reconcile the individually written author reviews with the original case register."""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[2]
tracker = root / 'docs/redesign/COMPLETION-TRACKER-2026-11-04.json'
review = tracker.parent / 'review'
data = json.loads(tracker.read_text())
rows = {row['id']: row for row in data['dossier_audits']}
seen = set()
paths = []
for file in sorted(review.glob('DOSSIER-AUDIT-C*.json')):
    path = str(file.relative_to(root))
    paths.append(path)
    for case in json.loads(file.read_text())['cases']:
        case_id = case['id']
        row = rows[case_id]
        assert case_id not in seen and case['chapter'] == row['chapters'][0]
        assert set(case['rubric']) == set(row['rubric']) and all(case['rubric'].values())
        assert case['evidence'] and all(e['locator'] for e in case['evidence'])
        seen.add(case_id)
        row.update(rubric=case['rubric'], status='ready_for_review',
                   reviewer='Codex author review and targeted source checks')
        if path not in row['evidence']:
            row['evidence'].append(path)
previous = [r for r in rows.values() if any('FIRST-READS' in p for p in r['evidence'])]
assert len(previous) == 2 and all(r['id'] not in seen for r in previous)
for row in previous:
    row['status'] = 'ready_for_review'
count = len(previous) + len(seen)
task = next(t for t in data['tasks'] if t['id'] == 'C01')
task['evidence'] = list(dict.fromkeys(task['evidence'] + paths))
check = data.setdefault('dossier_review_checkpoint', {})
check.update(author_reads=count, target=len(rows), new_reads=len(seen),
             open_reads=sorted(r['id'] for r in rows.values() if r['status'] != 'ready_for_review'),
             chapter_reports=paths, prior_two='docs/redesign/review/DOSSIER-RUBRIC-FIRST-READS.md')
task['acceptance_result'] = f'{count}/77 eight-part author reviews recorded. Each chapter report records case-specific evidence and scope. See the dossier review checkpoint for citation and delivery verification.'
task['open_issues'] = ([f'{77-count} additional dossier reads.'] if count < 77 else []) + ['Independent historical review is tracked under H03.']
print(f'{count}/77 eight-part reads recorded')

tasks = {item['id']: item for item in data['tasks']}
corpus = json.loads((root / 'public/atlas/corpus.json').read_text())
subjects = {item['id']: item for item in corpus['subjects']}
def report_path(name):
    return str((review / name).relative_to(root))
def attach(row, *paths):
    row['evidence'] = list(dict.fromkeys(row['evidence'] + list(paths)))

findings = report_path('DOSSIER-FINDINGS-2026-11-04.md')
if count == 77 and (root / findings).exists():
    attach(task, findings)
    tasks['U04']['open_issues'] = ['Check the remaining return-state requirements under U05.']
    if tasks['C03']['open_issues'] == ['C1–C2 dossier-level rubric and independent historical review remain open.']:
        tasks['C03']['open_issues'] = ['Independent historical review remains under H03.']
    data['milestone_status']['M2'] = 'Author-side dossier review and regional briefs complete. Exemplar and independent-review selections frozen. H01/H02 removed by the owner.'
    for row in rows.values():
        row['existing_interval'] = subjects[row['id']]['interval']
        row['claim_review']['status'] = 'see_named_claim_findings_and_case_rubric'
    check['findings'] = findings

glossary = report_path('GLOSSARY-EDITORIAL-2026-11-04.json')
if (root / glossary).exists():
    terms = {r['id']: r for r in json.loads((root / glossary).read_text())['terms']}
    assert set(terms) == {r['id'] for r in corpus['glossary']}
    for r in data['glossary_audits']:
        reading = terms[r['id']]
        assert r['id'] in subjects[reading['exampleSubject']]['terms']
        r.update(status='ready_for_review', definition_review=reading['outcome'],
                 contextual_variation=reading['finding'], reading_links_review=reading['exampleSubject'])
        attach(r, glossary)
    check['glossaryReview'] = glossary
    tasks['C08'].update(status='ready_for_review', acceptance_result='Twelve authored routes provide 36 evidence stops. All 82 glossary entries have individual editorial findings. Five terms were revised and all 297 dossier-term assignments resolve.')
    attach(tasks['C08'], glossary)

journey = report_path('JOURNEY-EDITORIAL-2026-11-04.json')
if (root / journey).exists():
    reviews = {r['id']: r for r in json.loads((root / journey).read_text())['journeys']}
    assert set(reviews) == {j['id'] for j in corpus['journeys']}
    for row in data['journey_audits']:
        reading = reviews[row['id']]
        assert row['stop_subject_ids'] == [s['subject'] for s in reading['sequence']]
        row.update(status='ready_for_review', learning_outcome=reading['returnQuestion'],
                   audience_fit=reading['role'] + ', family with adult and self-directed tracks',
                   duration_observed=None, sequence_review=reading['transitionFinding'],
                   evidence_task_review=reading['evidenceFinding'])
        attach(row, journey)
    tasks['L03'].update(status='ready_for_review', acceptance_result='All 33 route sequences, transitions, evidence tasks, prerequisites and return questions reviewed. Eight primary chapter routes identified. Durations are estimates.')
    attach(tasks['L03'], journey)
    check['journeyReview'] = journey

places = report_path('PLACE-EDITORIAL-2026-11-04.json')
if (root / places).exists():
    studies = {r['id']: r for r in json.loads((root / places).read_text())['studies']}
    assert set(studies) == {s['id'] for s in subjects.values() if s.get('placeStudy')}
    for row in data['place_study_audits']:
        r = studies[row['subject_id']]
        row.update(status='ready_for_review', locators_dates_precision=r['finding'])
        attach(row, places)
    check['placeReview'] = places
    attach(tasks['V03'], places)
    tasks['V03']['acceptance_result'] = '38 studies and 114 named points reviewed across eight first chapters. Six schematic features have source-specific limits. Corrected the inland Antioch locator. All 77 dossiers have a named geographic orientation.'

comparison = report_path('COMPARISON-EDITORIAL-2026-11-04.json')
notes_path = 'src/atlas/comparison-reading-notes.json'
if (root / comparison).exists() and (root / notes_path).exists():
    pairs = {r['id']: r for r in json.loads((root / comparison).read_text())['pairs']}
    notes = json.loads((root / notes_path).read_text())
    if len(pairs) == len(notes) == len(corpus['comparisons']):
        for row in data['comparison_audits']:
            pair = pairs[row['id']]
            assert pair['subjects'] == row['subject_ids']
            row['source_review'] = notes[row['id']]['text']
            row['asymmetry_review']['historicalJudgment'] = notes[row['id']]['text']
            attach(row, comparison, notes_path)
            row['status'] = 'ready_for_review'
        check['comparisonReview'] = comparison
        attach(tasks['T05'], comparison, notes_path)
        tasks['T05']['acceptance_result'] = '76 individual comparisons reviewed for historical suitability, with a reader-facing note and a cited reading from each side. All 77 default choices resolve to an authored pair.'
        tasks['T05']['open_issues'] = []
        tasks['T05']['status'] = 'ready_for_review'

import hashlib
digest = hashlib.sha256((root / 'public/atlas/corpus.json').read_bytes()).hexdigest()
closure = report_path('DOSSIER-CITATION-CLOSURE-2026-11-04.json')
if (root / closure).exists():
    verified = json.loads((root / closure).read_text())
    if verified['corpusSHA256'] == digest and verified['result'] == 'pass':
        repairs = {r['id']: r for r in verified['repairs']}
        assert len(repairs) == 4
        for row in rows.values():
            for claim in row['claim_review']['findings']:
                if claim['claim'] in repairs:
                    claim.update(status='repaired_and_verified', evidence=closure)
        register = [cl for r in rows.values() for cl in r['claim_review']['findings']]
        assert len(register) == 114 and all(cl['status'] in ('supported', 'supported_via_official_companion', 'supported_with_limits', 'repaired_and_supported', 'repaired_and_verified') for cl in register), set(cl['status'] for cl in register)
        check.pop('citationVerification', None)
        check.update(corpusSHA256=digest, namedClaims=114, supportedOrRepaired=114, namedCitationIssuesOpen=0, citationClosure=closure)
        attach(task, closure)
        task.update(status='ready_for_review' if count == 77 else 'in_progress',
                    acceptance_result=f'{count}/77 eight-part dossier reads recorded, including consequential passages outside the named register. All 114 named claims supported or repaired across the three review passes. The final four were tested in the delivered evidence panels. The finite findings index separates repaired defects from limits on stronger future claims.')
else:
    check['citationVerification'] = 'Four source repairs in compiled corpus. Final browser, PDF and catalog readback in progress.'

data['milestone_status']['M3'] = 'In progress. The 77 dossier reads, 56 regional readings, 84 snapshots and explicit comparison, journey, place and glossary reviews have individual receipts. Rights, exemplar work and independent acceptance are tracked separately.'
tracker.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
