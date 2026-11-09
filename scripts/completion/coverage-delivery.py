"""Attach exact delivered records to the editorial tracker without approving history."""
import hashlib
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
def read(path): return json.loads((root/path).read_text())
def write(path,data): (root/path).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
cp='public/atlas/corpus.json'
corpus=read(cp)
out='output/completion-2026-11-04/comparison-place-browser.json'
checks=read(out)
assert checks['status']=='pass' and checks['corpusSHA256']==hashlib.sha256((root/cp).read_bytes()).hexdigest()
tp='docs/redesign/COMPLETION-TRACKER-2026-11-04.json'
t=read(tp)
subjects={s['id']:s for s in corpus['subjects']}
themes={r['id']:r for r in read('src/atlas/learning-themes.json')}
receipt='docs/redesign/review/COVERAGE-DELIVERY-2026-11-04.json'
pairs={p['id']:p for p in checks['comparisons']}
defaults={d['subject']:d for d in checks['defaults']}
places={p['subject']:p for p in checks['places']}
assert len(pairs)==76 and len(defaults)==77 and len(places)==38
for r in t['comparison_audits']:
 p=pairs[r['id']]
 r.update(status='in_progress',source_review='Displayed dimension text, citation destinations and locators matched both authored records. External-source interpretation still open.',default_action_review=[defaults[s] for s in r['subject_ids']],asymmetry_review={'shownShared':p['matched'],'identifiedAsOneSided':p['oneSided'],'historicalJudgment':'open'},evidence=[receipt])
for r in t['place_study_audits']:
 p=places[r['subject_id']]
 r.update(status='in_progress',locators_dates_precision='Named controls, explanatory texts, citation URLs and geographic limits verified in browser. Historical dates and coordinate accuracy require editorial judgment.',routes_evidence=p['features'],legend_and_text_alternative=f"{len(p['points'])} named controls selected successfully; accessible map description and selectable text verified.",evidence=[receipt])
route_evidence=[]
for row in t['thematic_routes']:
 guide=themes[row['id']]
 rr=[]
 for stop in guide['stops']:
  s=subjects[stop['subject']];section=next(v for v in s['sections'] if v['title']==stop['section']);assert stop['source'] in [c['source'] for c in section['citations']]
  rr.append(dict(**stop,region=s['region'],chapters=s['packs'],citations=section['citations']))
 assert len({s['subject'] for s in rr})==3 and len({s['region'] for s in rr})>=2
 route_evidence.append(dict(id=row['id'],question=guide['question'],scope=guide['limit'],stops=rr))
 row.update(status='ready_for_review',stop_ids=[s['subject'] for s in rr],review='Three named sections, source locators and case-specific evidence prompts. Independent educational acceptance remains open.',evidence=['src/atlas/learning-themes.json',receipt])
for task in t['tasks']:
 if task['id'] in ['T05','V03','C08']:
  result={'T05':'76 pair displays verified, including both source sets, one-sided dimensions and 77 default comparison/return paths. Historical fit and evidence asymmetry still need editorial judgment.',
          'V03':'All 38 place studies delivered 114 selectable named locators and explanations; all feature notes checked. Coordinate/date and route-source appraisal remains open.',
          'C08':'Twelve guides with 36 sourced stops and individualized evidence prompts are delivered through the theme selector. Case-specific glossary and broader editorial review remain open.'}[task['id']]
  task.update(status='in_progress',acceptance_result=result,evidence=list(dict.fromkeys(task['evidence']+[receipt])))
 if task['id']=='C03':task['open_issues']=['C1–C2 dossier-level rubric and independent historical review remain open.']
write(receipt,dict(scope='Local delivered-record and curriculum checks; not source authentication, community endorsement or reader acceptance.', corpusSHA256=checks['corpusSHA256'], browser=out,comparisons=checks['comparisons'],defaults=checks['defaults'],places=checks['places'],themes=route_evidence))
write(tp,t)
