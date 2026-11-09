"""Inspect actual shipped image bytes; do not infer reproduction rights or dates."""
from pathlib import Path
import json,hashlib,io,subprocess
from PIL import Image,ImageOps,ImageDraw
root=Path(__file__).resolve().parents[2]
corpus=root/'public/atlas/corpus.json'
data=json.loads(corpus.read_text())
out=root/'output/completion-2026-11-04/media-delivery'
out.mkdir(exist_ok=True,parents=True)
sources={s['id']:s for s in data['sources']}
rows=[]; sheets=[]; unique={}
for i,m in enumerate(data['media']):
 if i%20==0:
  sheet=Image.new('RGB',(1050,1120),'#eceae5');sheets.append(sheet)
 x=(i%20%4)*262;y=(i%20//4)*224
 draw=ImageDraw.Draw(sheet);draw.text((x+5,y+4),m['id'],fill='black')
 files=[]; flags=[]
 for kind,path in [('display',m['image']),('thumbnail',m['thumbnail'])]+[('alternate',p) for p in m.get('additionalImages',[])]:
  p=root/'public'/path.lstrip('/')
  if p.suffix=='.svg':
   png=subprocess.check_output(['node','--input-type=module','-e',"import sharp from 'sharp';process.stdout.write(await sharp(process.argv[1]).png().toBuffer());",str(p)],cwd=root)
   img=Image.open(io.BytesIO(png))
  else: img=Image.open(p)
  img.load();actual=img.size
  sha=hashlib.sha256(p.read_bytes()).hexdigest()
  assert hashlib.sha256((root/'dist'/path.lstrip('/')).read_bytes()).hexdigest()==sha
  unique[path]=sha
  files.append({'role':kind,'path':path,'width':actual[0],'height':actual[1],'sha256':sha})
  if kind=='display':
   if actual!=(m['width'],m['height']):flags.append('Declared and actual display dimensions differ.')
   if p.suffix!='.svg' and max(actual)<800:flags.append('Longest display dimension below 800 px; inspect the task at its intended size or use a transcription.')
  if kind in ('display','thumbnail'):
   box=(170,175) if kind=='display' else (74,82)
   small=ImageOps.contain(img.convert('RGB'),box);sheet.paste(small,(x+(4 if kind=='display' else 179),y+25))
  img.close()
 rec=sources[m['source']]
 rows.append({'id':m['id'],'subject':m['subject'],'source':m['source'],'catalogueURL':rec['url'],'accession':m['accession'],'date':m['date'],'depiction':m['depiction'],'datingNote':m.get('datingNote'),'rightsAsRecorded':m['rights'],'creditAsRecorded':m['credit'],'alt':m['alt'],'relevance':m['relevance'],'derivatives':files,'flags':flags})
for i,sheet in enumerate(sheets):sheet.save(out/f'contact-{i+1}.jpg',quality=88)
p=root/'docs/redesign/review/MEDIA-DELIVERY-2026-11-04.json'
p.write_text(json.dumps(dict(scope='All declared display, thumbnail and alternate assets decoded and compared with the production build. Metadata transcribed for review. Pixel dimensions and source IDs do not authenticate legal rights, source identity, visual fidelity, or contextual alt text.',corpusSHA256=hashlib.sha256(corpus.read_bytes()).hexdigest(),records=len(rows),uniqueFiles=len(unique),recordsWithFlags=sum(bool(r['flags']) for r in rows),rows=rows),indent=2,ensure_ascii=False)+'\n')
print(len(rows),'records;',len(unique),'distinct media derivatives;',sum(bool(r['flags']) for r in rows),'records flagged')
