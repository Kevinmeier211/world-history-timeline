"""Check all exported PDF pages and verify the identical copies in the portable build."""
from pathlib import Path
import json,hashlib
from pypdf import PdfReader
measurements=json.loads(Path('output/redesign/print/export-measurements.json').read_text())
results=[];index=[]
for export in measurements:
 p=Path('output/redesign/print')/(export['name']+'.pdf');raw=p.read_bytes();pdf=PdfReader(p)
 assert len(pdf.pages)==len(export['compositions']),(p,len(pdf.pages))
 size=[1191,842] if export['paper']=='A3' else [612,792]
 for i,page in enumerate(pdf.pages):
  assert [round(float(v)) for v in page.mediabox[2:]]==size,(p,i)
  text=page.extract_text();assert 'Chronos' in text,(p,i,'missing colophon or blank page')
  index.append({'file':p.name,'page':i+1,'opening':text[:200]})
 assert Path('dist/atlas/exports',p.name).read_bytes()==raw
 assert Path('public/atlas/exports',p.name).read_bytes()==raw
 tagged=bool(pdf.trailer['/Root'].get('/MarkInfo',{}).get('/Marked',False));assert tagged
 results.append({'file':p.name,'pages':len(pdf.pages),'sizePoints':size,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'tagged':tagged})
Path('output/redesign/print/pdf-verification.json').write_text(json.dumps(results,indent=2)+'\n')
Path('output/redesign/print/page-index.json').write_text(json.dumps(index,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(results,indent=2))
