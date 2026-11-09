"""Prepare bounded human review inputs. Never create observations or invitations."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
corpus_path = root / 'public/atlas/corpus.json'
corpus = json.loads(corpus_path.read_text())
tracker = json.loads((root / 'docs/redesign/COMPLETION-TRACKER-2026-11-04.json').read_text())
out = root / 'docs/redesign/review/human-2026-11-05'
out.mkdir(parents=True, exist_ok=True)
subjects = {x['id']: x for x in corpus['subjects']}
sources = {x['id']: x for x in corpus['sources']}
orientations = {x['id']: x for x in corpus['orientations']}
sha = hashlib.sha256(corpus_path.read_bytes()).hexdigest()

def refs(value):
    found = []
    if isinstance(value, dict):
        if 'source' in value and 'locator' in value:
            found.append(value)
        for child in value.values(): found += refs(child)
    elif isinstance(value, list):
        for child in value: found += refs(child)
    return found

def write(name, value):
    (out / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

review_units = []
for selected in tracker['historical_review_dossiers']:
    record = subjects[selected['id']]
    citations = refs(record)
    review_units.append({
        **selected, 'status': 'not_started', 'reviewer': None,
        'corpusSHA256': sha, 'record': record,
        'sources': [sources[s] for s in sorted({x['source'] for x in citations})],
        'observedFindings': None, 'independentDecision': None,
    })
assert len(review_units) == 12
assert {u['chapterRequirement'] for u in review_units if u['chapterRequirement']} == {f'C{i}' for i in range(1, 9)}
write('historical-dossiers.json', review_units)
write('glossary.json', corpus['glossary'])
snapshots = []
for unit in tracker['snapshots']:
    orientation = orientations[unit['authored_orientation_id']]
    actual = next(x for x in orientation['snapshots'] if x['year'] == unit['year'] and x['region'] == unit['region'])
    snapshots.append({'id': unit['id'], 'orientation': orientation['id'], 'region': unit['region'], 'year': unit['year'], 'reading': actual, 'reviewer': None, 'status': 'not_started', 'observedFindings': None, 'decision': None})
assert len(snapshots) == 84 and len({(s['year'], s['region']) for s in snapshots}) == 84
write('historical-snapshots.json', snapshots)
write('regional-readings.json', list(orientations.values()))
source_ids = {x['source'] for x in refs(list(orientations.values()))}
write('regional-sources.json', [sources[s] for s in sorted(source_ids)])
# Planned slots are not participants, appointments, observations or denominators.
rotation = [('C1', 'C8'), ('C2', 'C7'), ('C3', 'C8'), ('C4', 'C6'), ('C5', 'C7')]
sessions = []
for track, prefix in [('adult self-directed', 'FA'), ('adult-child ages 10-14', 'FP')]:
    for i, chapters in enumerate(rotation, 1):
        sessions.append({'id': prefix + str(i).zfill(2), 'track': track, 'chapters': chapters, 'taskIds': ['RT01','RT02','RT03','RT04','RT05','RT06'], 'status': 'not_recruited', 'participant': None, 'newToPrototype': None, 'candidateIdentity': None, 'deviceBrowserInput': None, 'agreementRecorded': None, 'observations': None, 'followup': {'targetDays': [7,14], 'status': 'not_scheduled', 'taskId': 'RT07', 'observations': None}})
write('final-reader-slots.json', sessions)
devices = [
    ('A03-IPHONE', 'Physical iPhone with Safari', ['orientation', 'touch targets', 'zoom/reflow', 'RT01','RT05','RT06']),
    ('A03-ANDROID', 'Physical Android with Chrome', ['orientation', 'touch targets', 'zoom/reflow', 'RT01','RT05','RT06']),
    ('A03-TABLET', 'Physical tablet; record OS and browser', ['portrait/landscape', 'text scaling', 'RT02','RT04','RT06']),
    ('A03-SR', 'Experienced screen-reader evaluator on their configured system', ['spoken headings/landmarks', 'reading order', 'dialog isolation', 'status/errors', 'RT01','RT02','RT03','RT04','RT05','RT06']),
    ('A03-KEYBOARD', 'Keyboard/zoom evaluator on their configured system', ['visible/unobscured focus', 'no traps', 'actual 200/400 percent zoom', 'RT01','RT03','RT05','RT06']),
]
write('device-slots.json', [{'id': i, 'setup': setup, 'checks': checks, 'status': 'not_started', 'evaluator': None, 'candidateIdentity': None, 'observations': None} for i,setup,checks in devices])
print_ids = ['world-overview', 'reader-nalanda', 'reader-partition-1947', 'family-cities-evidence', 'chapter-C8', 'short-C1']
write('physical-print-slots.json', [{'id': 'P03-'+str(i+1), 'downloadId': key, 'path': '/atlas/exports/'+key+'.pdf', 'checks': ['Actual paper and scaling', 'Legibility at normal distance', 'Grayscale evidence distinctions', 'Fine-detail limits and text alternative', 'Page/section continuity', 'Spoken reading order in configured PDF reader when applicable'], 'status': 'not_printed', 'evaluator': None, 'observations': None} for i,key in enumerate(print_ids)])
write('finding-template.json', {'status':'blank_template_not_an_observation','id':None,'gate':None,'candidateIdentity':None,'reviewerOrSession':None,'unitOrTask':None,'observedTextOrAction':None,'expectedResult':None,'sourceOrPage':None,'severity':None,'assistance':None,'repair':None,'successorIdentity':None,'retestResult':None,'reviewerReconciliation':None})
write('manifest.json', {'status':'prepared_not_observed_or_accepted','corpusSHA256':sha,'historicalDossiers':12,'regionalReadings':56,'snapshotEntries':84,'finalAdultSlots':5,'finalFamilySlots':5,'minimumNewParticipantsPerTrack':3,'minimumDelayedFollowupsPerTrack':3,'deviceSlots':5,'physicalPrintSlots':len(print_ids),'observedPeople':0,'historicalDecisions':0,'formativePilot':'removed_by_owner; not reinstated','limits':'Slots are a ready-to-use allocation, not recruited participants, observed results or acceptance. Verify exact candidate and PDF identities before use.'})
print('Prepared 12 dossier / 84 snapshot / 56 regional inputs and blank human observation slots.')
