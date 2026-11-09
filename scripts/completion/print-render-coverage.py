"""Reuse hash-matched page renders and fill gaps without regenerating any PDF."""
from pathlib import Path
import json,hashlib,subprocess,collections
from PIL import Image,ImageStat,ImageOps
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'output/remaining-plan-2026-11-05/print'
cat=json.loads((ROOT/'public/atlas/exports/catalog.json').read_text())
receipts=[]
for base in ['output/media-review-2026-11-04','output/dossier-review-2026-11-04','output/completion-2026-11-04','output/pdf/chronos-downloads']:
 for p in (ROOT/base).rglob('receipt.json'):
  try:d=json.loads(p.read_text())
  except (ValueError,OSError):continue
  if isinstance(d,dict) and isinstance(d.get('inputs'),list) and isinstance(d.get('pages'),list):receipts.append((p,d))
rows=[];supplement=OUT/'supplemental-render';supplement.mkdir(exist_ok=True)
for row in cat['files']:
 sha=hashlib.sha256((ROOT/'public'/row['path'].lstrip('/')).read_bytes()).hexdigest();assert sha==row['sha256']
 found=None
 if row['kind']=='Short activity':
  paths=[OUT/'short-tagged/rendered'/f"{row['id']}-{n}.png" for n in range(1,row['pages']+1)]
  assert all(p.exists() for p in paths);found=('current tagged replacement render',paths)
 else:
  for receipt,d in receipts:
   if not any(i.get('id')==row['id'] and i.get('sha256')==sha for i in d['inputs']):continue
   pages={int(v['page']):receipt.parent/v['raster'] for v in d['pages'] if isinstance(v,dict) and v.get('id')==row['id'] and v.get('raster')}
   if set(pages)==set(range(1,row['pages']+1)) and all(p.exists() for p in pages.values()):
    found=(str(receipt.relative_to(ROOT)),[pages[n] for n in range(1,row['pages']+1)]);break
 if not found:
  prefix=supplement/row['id'];subprocess.run(['pdftoppm','-r','45','-gray','-png',str(ROOT/'public'/row['path'].lstrip('/')),str(prefix)],check=True)
  paths=sorted(supplement.glob(row['id']+'-*.png'),key=lambda p:int(p.stem.rsplit('-',1)[1]));assert len(paths)==row['pages'];found=('supplemental current-PDF rendering',paths)
 page_rows=[]
 for n,p in enumerate(found[1],1):
  with Image.open(p) as im:
   gray=im.convert('L');stats=ImageStat.Stat(gray);ink=ImageOps.invert(gray).point(lambda x:255 if x>10 else 0);bbox=ink.getbbox();assert bbox is not None,(row['id'],n,'blank raster')
   page_rows.append({'page':n,'raster':str(p.relative_to(ROOT)),'pixels':list(im.size),'nonblank':True,'luminanceStdDev':round(stats.stddev[0],3)})
 rows.append({'id':row['id'],'sha256':sha,'pages':row['pages'],'renderEvidence':found[0],'pageRenders':page_rows})
 print(row['id'],row['pages'],found[0],flush=True)
result={'date':'2026-11-05','pdfs':len(rows),'pages':sum(r['pages'] for r in rows),'hashMatchedPriorPDFs':sum(r['renderEvidence'].endswith('receipt.json') for r in rows),'hashMatchedPriorPages':sum(r['pages'] for r in rows if r['renderEvidence'].endswith('receipt.json')),'supplementalPDFs':sum(r['renderEvidence'].startswith('supplemental') for r in rows),'supplementalPages':sum(r['pages'] for r in rows if r['renderEvidence'].startswith('supplemental')),'replacementPages':16,'files':rows,'scope':'All current pages have nonblank raster evidence. Prior renders reused only when their recorded PDF SHA-256 matches current bytes. Supplemental 45-dpi renders establish rendering/nonblank output, not fine print legibility.'}
(OUT/'render-coverage.json').write_text(json.dumps(result,indent=2)+'\n');print('COMPLETE', {k:v for k,v in result.items() if k!='files'},flush=True)
