"""Record authored regional work without converting coverage counts into acceptance."""
import hashlib
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
corpus_path = root / 'public/atlas/corpus.json'
c = json.loads(corpus_path.read_text())
old = json.loads((root / 'output/completion-2026-11-04/content-candidate/atlas/corpus.json').read_text())
rows = c.get('orientations', [])
chapters = sorted({r['chapter'] for r in rows})
remaining_chapters = [f'C{i}' for i in range(1, 9) if f'C{i}' not in chapters]
count = len(rows)
snapshots = sum(len(r['snapshots']) for r in rows)
sha = hashlib.sha256(corpus_path.read_bytes()).hexdigest()
fresh = ['orientation-an-son','orientation-mohenjodaro','orkney-neolithic','giza-settlement','kerma-city-project','liangzhu','dholavira','uruk','completion-kuk-sequence','completion-kuk-ditches','caral-starch-2023','orientation-bhagwanpura','kerma','shang-yinxu','orientation-meroe','orientation-achaemenid','orientation-hellenistic','orientation-warring-states','chavin-center-unesco','chavin-center-met-chronology','ashoka','qin','orientation-post-han','parthia','orientation-oc-eo','lapita-tonga-ceramic-change']
receipt_rel = 'docs/redesign/review/REGIONAL-READINGS-2026-11-04.json'
browser_path = root / 'output/completion-2026-11-04/regional-browser/receipt.json'
browser = json.loads(browser_path.read_text()) if browser_path.exists() else {}
assets = browser.get('applicationAssets', [])
browser_current = browser.get('corpusSHA256') == sha and sorted((v['id'], v['region'], v['year']) for v in browser.get('snapshotChecks', [])) == sorted((r['id'], r['region'], s['year']) for r in rows for s in r['snapshots']) and len(browser.get('results', [])) == count*3 and bool(assets) and all((root / 'dist' / 'assets' / a['name']).exists() and hashlib.sha256((root / 'dist' / 'assets' / a['name']).read_bytes()).hexdigest() == a['sha256'] for a in assets)
receipt = {
 'date':'2026-11-04','status':'local_editorial_review_candidate','corpusSHA256':sha,
 'authoredOrientations':count,'requiredOrientations':56,'authoredSnapshots':snapshots,'requiredSnapshots':84,
 'chapters':chapters,'newStandaloneDossiers':0,
 'reviewScope':'Codex authorship and source consultation, not independent historian acceptance. New passages use freshly consulted sources or preserved, specifically scoped dossier/reference evidence; not every old full source has been reconsulted. Each row retains locators and limits.',
 'preservation':{k:c[k]==old[k] for k in ['subjects','contexts','media','journeys','comparisons','glossary','packs','relations']},
 'addedSources':[s['id'] for s in c['sources'] if s['id'] not in {v['id'] for v in old['sources']}],
 'expandedConsultationScopes':[s['id'] for s in old['sources'] if s!=next(v for v in c['sources'] if v['id']==s['id'])],
 'freshlyConsultedSourceIds':list(dict.fromkeys(fresh+[s['id'] for s in c['sources'] if s.get('accessed')=='2026-11-04' and (s['id'].startswith('orientation-') or 'Additional consultation 4 November' in s.get('scope',''))])),
 'accessLimits':[
  'Original Bhagwanpura excavation PDF exceeded the web fetch limit; local download timed out and is preserved with .partial suffix. The orientation cites the accessible Kenoyer scholarly chapter, printed p43, not the unread original excavation.',
  'Kenoyer PDF text was read through web extraction; direct local download returned 403. No local pixel review or full-volume review is claimed.',
  'UNESCO Chavin Description and Brief synthesis conflict. Both remain explicit; separately consulted Paracas c300 BCE evidence supplies the snapshot setting.',
  'Museum China chronology contains inaccurate Qin event heading and Sima Jian/Wu wording in its later volume. Those claims are explicitly excluded from the added source scopes.',
  'Tongan site continuity is explicitly discussed in Methods; it is not an exact 200 CE deposit date or a demonstrated connection with Vietnam.',
 ],
 'delivery':{'lazyProse':'public/atlas/orientations.json','initialPayload':'Chapter IDs only; full prose deferred until expansion and snapshots until Meanwhile elsewhere opens','lazySnapshots':'public/atlas/regional-snapshots.json','print':'Separate regional companion per authored chapter; full locators, source scopes and response criteria retained.'},
 'verification':{'browser':browser if browser_current else 'Current-build verification pending; do not reuse an older receipt.'},
 'units':[{'id':r['id'],'chapter':r['chapter'],'region':r['region'],'status':'ready_for_review','snapshotYears':[s['year'] for s in r['snapshots']], 'citations':list({(q['source'],q['locator']):q for s in [r['summary']]+r['sections']+r['snapshots'] for q in s['citations']}.values()), 'scope':r['scope'],'perspectives':r['perspectives'],'acceptance':'Author/source review and local implementation ready; independent acceptance not performed.'} for r in rows],
 'remainingAutonomousScope':(f"{', '.join(remaining_chapters)}: {56-count} regional orientations and {84-snapshots} snapshots; " if remaining_chapters else "") + "Complete narrative, comparison, journey, media, place and glossary audits; remaining engineering, print and release preparation. Human gates separately recorded; H01/H02 remain removed by owner.",
 'release':'Source uncommitted; no push or deployment. Previous portable archive is a prior checkpoint, not this successor.'
}
(root / receipt_rel).write_text(json.dumps(receipt,indent=2,ensure_ascii=False)+'\n')
p=root / 'docs/redesign/COMPLETION-TRACKER-2026-11-04.json';t=json.loads(p.read_text());byid={r['id']:r for r in rows}
for row in t['regional_orientations']:
 if row['id'] not in byid:continue
 r=byid[row['id']]
 row.update(status='ready_for_review',authored_orientation_id=r['id'],source_gaps=[],review_result='Authored cited summary and process/change sections, geographic/perspective limits, destinations and usable evidence-response criteria. Local author review, not independent historical acceptance.')
 row['evidence']=list(dict.fromkeys(row['evidence']+[receipt_rel,'scripts/redesign/orientations-'+r['chapter'].lower()+'.ts']))
 if row['id']=='C3-R1':row['source_gaps']=['Chavin endpoint conflict retained; independently dated Paracas comparison supplies 300 BCE snapshot.']
for row in t['snapshots']:
 r=next((r for r in rows if r['region']==row['region'] and any(s['year']==row['year'] for s in r['snapshots'])),None)
 if r:
  row.update(status='ready_for_review',authored_orientation_id=r['id'],source_review='Date-specific source locators; no case or continuous reference interval widened.',ui_review='Exact prose verified in managed Chromium.' if browser_current else 'Current-build check pending.',evidence=[receipt_rel,'output/completion-2026-11-04/regional-browser/receipt.json'])
for task in t['tasks']:
 groups={'C03':['C1','C2'],'C04':['C3','C4'],'C05':['C5','C6'],'C06':['C7'],'C07':['C8']}
 if task['id'] in groups:
  included=groups[task['id']]; selected=[r for r in rows if r['chapter'] in included]
  task['status']='ready_for_review' if len(selected)==len(included)*7 and browser_current else 'in_progress'
  task['acceptance_result']=f"{', '.join(included)}: {len(selected)} cited regional readings and {sum(len(r['snapshots']) for r in selected)} individually dated snapshots authored; coverage and local delivery evidence recorded. Chapter-level historical acceptance is separate."
  task['evidence']=list(dict.fromkeys(task['evidence']+[receipt_rel]))
 if task['id']=='T03':
  task.update(status='ready_for_review' if snapshots==84 and browser_current else 'in_progress', acceptance_result=f'{snapshots}/84 exact-year explanations authored. Independent historical acceptance remains open.',evidence=[receipt_rel])
 if task['id']=='P03':
  task['status']='in_progress';task['open_issues']=[v for v in task['open_issues'] if 'regional companions' not in v]
  task['open_issues']=list(dict.fromkeys(task['open_issues']+['Regional companion exports and render checks retain their actual revisions; earlier 130 exports are prior checkpoints. Physical-print acceptance remains open.']))
t['milestone_status']['M3']=f'in_progress: {count}/56 regional readings and {snapshots}/84 exact-year snapshots authored. Thematic routes, remaining case-level historical, rights, geography and learning audits and independent acceptance retain separate evidence.'
t['regional_implementation_checkpoint']={'date':'2026-11-04','authoredOrientations':count,'plannedOrientations':56,'authoredSnapshots':snapshots,'plannedSnapshots':84,'chapters':chapters,'corpusSHA256':sha,'status':'local_editorial_review_candidate','remainingAutonomousWork':receipt['remainingAutonomousScope'],'release':receipt['release']}
p.write_text(json.dumps(t,indent=2,ensure_ascii=False)+'\n')
print(f'Recorded {count}/56 orientations and {snapshots}/84 snapshots; no independent acceptance inferred.')
