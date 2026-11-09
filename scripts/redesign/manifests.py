"""Deterministic coverage and asset manifests from the released corpus."""
import pathlib,json,hashlib,csv
c=json.load(open('public/atlas/corpus.json'));out=pathlib.Path('output/redesign/manifests');out.mkdir(parents=True,exist_ok=True)
coverage=[]
for p in c['packs']:
 for region,cell in p['coverage'].items():coverage.append({'pack':p['id'],'start':p['start'],'end':p['end'],'region':region,**cell})
(out/'coverage.json').write_text(json.dumps(coverage,indent=2,ensure_ascii=False))
with (out/'coverage.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['pack','window','region','status','editorial assessment','released subjects'])
 for r in coverage:w.writerow([r['pack'],f"{r['start']} to {r['end']}",r['region'],r['status'],r['reason'],'; '.join(r['subjects'])])
lines=['# Coverage matrix','', 'Every assessment is editorial and selective; no empty cell means absence of people.','', '| Pack | Region | Assessment | Subjects and limits |','|---|---|---|---|']
for r in coverage:lines.append(f"| {r['pack']} | {r['region']} | {r['status']} | {', '.join(r['subjects']) or 'No released subject'}. {r['reason']} |")
(out/'coverage-matrix.md').write_text('\n'.join(lines)+'\n')
refs=[]
for s in c['subjects']:
 for layer,sections in [('main',s['sections']),('deeper',s.get('deeperReading',[])),('evidence',s.get('evidenceReading',{}).get('items',[])),('place',s.get('placeStudy',{}).get('points',[])),('map-feature',s.get('placeStudy',{}).get('features',[]))]:
  for section in sections:
   for ref in section['citations']:refs.append({'subject':s['id'],'layer':layer,'section':section.get('title',section.get('label',section.get('id'))),**ref})
 for key,dimension in s['dimensions'].items():
  for ref in dimension['citations']:refs.append({'subject':s['id'],'layer':'comparison','dimension':key,**ref})
 for claim in s['claims']:
  for ref in claim['citations']:refs.append({'subject':s['id'],'claim':claim['id'],'checkedBy':claim['checkedBy'],'checkedOn':claim['checkedOn'],**ref})
for context in c.get('contexts',[]):
 for ref in context['citations']:refs.append({'context':context['id'],'layer':'reference',**ref})
 for phase in context['phases']:
  for ref in phase['citations']:refs.append({'context':context['id'],'layer':'phase','phase':phase['title'],'year':phase['year'],**ref})
for journey in c['journeys']:
 for ref in journey['evidence']['citations']:refs.append({'journey':journey['id'],'layer':'learning-evidence',**ref})
 for ref in journey.get('familyEvidence',{}).get('citations',[]):refs.append({'journey':journey['id'],'layer':'family-source-summary',**ref})
assets=[]
for m in c['media']:
 for note in m.get('annotations',{}).get('items',[]):
  for ref in note['citations']:refs.append({'media':m['id'],'layer':'image-reading-note','annotation':note['id'],'createdOn':m['annotations']['createdOn'],**ref})
 for url in [m['image'],m['thumbnail'],*m.get('additionalImages',[])]:
  p=pathlib.Path('public'+url);assets.append({'id':m['id'],'path':url,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'rights':m['rights'],'credit':m['credit'],'source':m['source']})
(out/'claim-source-locators.json').write_text(json.dumps(refs,indent=2,ensure_ascii=False))
(out/'asset-checksums.json').write_text(json.dumps(assets,indent=2,ensure_ascii=False))
# Descriptive text is separate from image identity/hash/rights; no pixel changes.
image_descriptions=[]
for m in c['media']:
 views=[m['image'],*m.get('additionalImages',[])]
 alts=m.get('additionalImageAlts')
 if alts is not None and (not isinstance(alts,list) or len(alts)!=len(views)-1 or not all(isinstance(a,str) and a.strip() for a in alts)):
  raise ValueError(f"Misaligned alternate descriptions: {m['id']}")
 for index,url in enumerate(views):
  description=m['alt'] if index==0 else alts[index-1] if alts is not None else f"Additional view of {m['title']}"
  image_descriptions.append({'id':m['id'],'path':url,'viewIndex':index,'alt':description,'source':m['source'],'descriptionType':'primary' if index==0 else 'authored alternate' if alts is not None else 'generic alternate fallback'})
(out/'media-image-descriptions.json').write_text(json.dumps(image_descriptions,indent=2,ensure_ascii=False))
(out/'release-corpus-summary.json').write_text(json.dumps({'subjects':len(c['subjects']),'media':len(c['media']),'journeys':len(c['journeys']),'sources':len(c['sources']),'relations':len(c['relations']),'regionalAssessments':len(coverage),'corpusSha256':hashlib.sha256(pathlib.Path('public/atlas/corpus.json').read_bytes()).hexdigest()},indent=2))
print('Coverage, precise locators and derivative checksums recorded.')
