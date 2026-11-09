"""Audit PDF bytes, content, links and logical structure; does not certify PDF/UA."""
from pathlib import Path
import collections, hashlib, json, re, subprocess, unicodedata, xml.etree.ElementTree as ET
from urllib.parse import urlsplit
from pypdf import PdfReader
from pypdf.generic import IndirectObject, ArrayObject, DictionaryObject, NumberObject
import pdfplumber
import pdfplumber.page
from pdfplumber.utils import decode_text

# pdfplumber 0.11.8 clears the outer MCID at nested ActualText spans.
# Preserve the PDF marked-content stack and its Unicode replacement instead.
class NestedMarkedContent(pdfplumber.page.PDFPageAggregatorWithMarkedContent):
 def __init__(self,*args,**kwargs):
  super().__init__(*args,**kwargs);self.marked_stack=[];self.actual_override=None
 def begin_tag(self,tag,props=None):
  self.marked_stack.append((self.cur_mcid,self.cur_tag,self.actual_override))
  self.cur_tag=decode_text(tag.name)
  if isinstance(props,dict):
   if 'MCID' in props:self.cur_mcid=props['MCID']
   if 'ActualText' in props:self.actual_override={'text':decode_text(props['ActualText']),'used':False}
 def end_tag(self):
  self.cur_mcid,self.cur_tag,self.actual_override=self.marked_stack.pop() if self.marked_stack else (None,None,None)
 def render_char(self,*args,**kwargs):
  advance=super().render_char(*args,**kwargs)
  if self.actual_override is not None and self.cur_item._objs:
   obj=self.cur_item._objs[-1]
   obj._text='' if self.actual_override['used'] else self.actual_override['text']
   self.actual_override['used']=True
  return advance
pdfplumber.page.PDFPageAggregatorWithMarkedContent=NestedMarkedContent

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'output/remaining-plan-2026-11-05/print'
(OUT/'logical-order').mkdir(parents=True,exist_ok=True)
cat=json.loads((ROOT/'public/atlas/exports/catalog.json').read_text())
corpus=json.loads((ROOT/'public/atlas/corpus.json').read_text())
subjects={s['id']:s for s in corpus['subjects']};sources={s['id']:s for s in corpus['sources']}
key=lambda t:re.sub(r'\s+','',unicodedata.normalize('NFKC',t).replace('\u00ad','')).casefold()
def refkey(x):
 if isinstance(x,IndirectObject):return (x.idnum,x.generation)
 y=getattr(x,'indirect_reference',None)
 return (y.idnum,y.generation) if y else None
def resolve(x):return x.get_object() if isinstance(x,IndirectObject) else x
rows=[]
for source in cat['files']:
 name=source['id'];path=ROOT/'public'/source['path'].lstrip('/')
 raw=path.read_bytes();pdf=PdfReader(path);root=pdf.trailer['/Root'];pageids={refkey(p):i+1 for i,p in enumerate(pdf.pages)}
 row={'id':name,'kind':source['kind'],'input':str(path.relative_to(ROOT)),'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'pages':len(pdf.pages),'catalogPages':source['pages'],'withinBudget':source['budget'] is None or len(raw)<=source['budget'],'language':root.get('/Lang'),'marked':bool(root.get('/MarkInfo',{}).get('/Marked',False)),'hasStructureTree':bool(root.get('/StructTreeRoot')),'title':(pdf.metadata or {}).get('/Title'),'issues':[]}
 if row['pages']!=source['pages']:row['issues'].append('catalog page mismatch')
 if not row['withinBudget']:row['issues'].append('size budget exceeded')
 bbox=subprocess.check_output(['pdftotext','-bbox-layout',str(path),'-'])
 xml=ET.fromstring(bbox);pages=xml.findall('.//{http://www.w3.org/1999/xhtml}page')
 bounds=[];blank=[];text=[];sizes=[]
 for number,p in enumerate(pages,1):
  w,h=float(p.attrib['width']),float(p.attrib['height']);sizes.append([round(w,2),round(h,2)])
  words=p.findall('.//{http://www.w3.org/1999/xhtml}word')
  if len(words)<5:blank.append(number)
  for word in words:
   x0,y0,x1,y1=[float(word.attrib[x]) for x in ['xMin','yMin','xMax','yMax']]
   if x0 < -.5 or y0 < -.5 or x1>w+.5 or y1>h+.5:bounds.append({'page':number,'word':word.text,'bounds':[x0,y0,x1,y1]})
  text.append(' '.join(word.text or '' for word in words))
 row.update(paperSizes=sorted(set(tuple(x) for x in sizes)),blankPages=blank,textBoundsIssues=bounds)
 if blank or bounds:row['issues'].append('blank or out-of-bounds text')
 layout=subprocess.check_output(['pdftotext','-layout',str(path),'-'],text=True)
 row['claimChecks']=[]
 if source['kind']=='Investigation reader':
  for claim in subjects[name[7:]]['claims']:
   fragments=[claim['text'],*[c['locator'] for c in claim['citations']],*[sources[c['source']]['title'] for c in claim['citations']]]
   if claim.get('uncertainty'):fragments.append(claim['uncertainty'])
   missing=[v for v in fragments if key(v) not in key(layout)]
   row['claimChecks'].append({'id':claim['id'],'missing':missing})
   if missing:row['issues'].append('missing claim fragment: '+claim['id'])
 roles=collections.Counter();refs=[];figures=[];structerrors=[];seen=set()
 def walk(obj,page=None,ancestry=()):
  if obj is None:return
  marker=refkey(obj);obj=resolve(obj)
  if isinstance(obj,(list,ArrayObject)):
   for child in obj:walk(child,page,ancestry)
  elif isinstance(obj,(int,NumberObject)):
   if page not in pageids:structerrors.append({'type':'MCID page unavailable','mcid':int(obj),'page':str(page)})
   else:refs.append((pageids[page],int(obj),ancestry))
  elif isinstance(obj,(dict,DictionaryObject)):
   if '/S' in obj:
    if marker in seen:return
    if marker:seen.add(marker)
    role=str(obj['/S'])[1:];roles[role]+=1;ancestry=ancestry+(role,)
    if role=='Figure':figures.append({'alt':str(obj.get('/Alt','')),'hasChildren':'/K' in obj})
   if '/Pg' in obj:page=refkey(obj.raw_get('/Pg'))
   if '/MCID' in obj:walk(obj['/MCID'],page,ancestry)
   elif '/K' in obj:walk(obj['/K'],page,ancestry)
 if root.get('/StructTreeRoot'):walk(root['/StructTreeRoot'])
 row['structure']={'roles':dict(roles),'figures':len(figures),'figuresWithAlt':sum(bool(f['alt']) for f in figures),'references':len(refs),'errors':structerrors}
 if structerrors:row['issues'].append('unresolved structure references')
 taggedchars=0;untaggedchars=0;unreferenced=[];chunks={};unmarked=[];mainmissing=[]
 refset={(p,m) for p,m,_ in refs}
 with pdfplumber.open(path) as plumber:
  for number,page in enumerate(plumber.pages,1):
   for ch in page.chars:
    value=ch['text'];mcid=ch.get('mcid')
    if mcid is None:
     untaggedchars+=len(value.strip())
     if value.strip():unmarked.append((number,value))
    else:
     taggedchars+=len(value.strip());chunks.setdefault((number,mcid),[]).append(value)
     if (number,mcid) not in refset and value.strip():unreferenced.append((number,mcid))
   content=pdf.pages[number-1].get_contents()
   present={int(m) for m in re.findall(rb'/MCID\s+(\d+)',content.get_data() if content is not None else b'')}
   for p,m in refset:
    if p==number and m not in present:mainmissing.append((p,m))
   page.close()
 logical=[];used=set();previous=0;backtracks=[]
 for p,m,rolepath in refs:
  if (p,m) in used or (p,m) not in chunks:continue
  used.add((p,m));value=''.join(chunks[(p,m)])
  if not value.strip():continue
  if p<previous:backtracks.append({'fromPage':previous,'toPage':p,'text':value[:80]})
  previous=p
  logical.append(f'[page {p}; {"/".join(rolepath)}; MCID {m}] {value}')
 (OUT/'logical-order'/(name+'.txt')).write_text('\n'.join(logical)+'\n')
 row['readingOrder']={'taggedCharacters':taggedchars,'unmarkedCharacters':untaggedchars,'unreferencedTextMCIDs':sorted(set(unreferenced)),'referencesAbsentFromPageContent':sorted(set(mainmissing)),'pageBacktracks':backtracks,'logicalTextFile':str((OUT/'logical-order'/(name+'.txt')).relative_to(ROOT)),'unmarkedTextSample':''.join(t for _,t in unmarked)[:180]}
 if unreferenced:row['issues'].append('text MCIDs absent from structure tree')
 if mainmissing:row['issues'].append('structure MCIDs absent from page stream; investigate nested forms')
 external=[];internal=[];linkissues=[]
 destinations=pdf.named_destinations
 for number,page in enumerate(pdf.pages,1):
  for ref in page.get('/Annots',[]):
   annotation=resolve(ref)
   if annotation.get('/Subtype')!='/Link':continue
   action=resolve(annotation.get('/A',{}));uri=action.get('/URI')
   if uri:
    uri=str(uri);external.append(uri)
    try:
     split=urlsplit(uri)
     if split.scheme not in ['https','http','mailto'] or (split.scheme in ['http','https'] and not split.netloc) or any(c.isspace() for c in uri):linkissues.append({'page':number,'uri':uri,'reason':'invalid or nonportable URI'})
    except Exception as error:linkissues.append({'page':number,'uri':uri,'reason':str(error)})
   else:
    dest=resolve(annotation.get('/Dest',action.get('/D')))
    if isinstance(dest,str):
     if dest in destinations:internal.append(pdf.get_destination_page_number(destinations[dest])+1)
     else:linkissues.append({'page':number,'destination':dest,'reason':'unknown named destination'})
    elif isinstance(dest,(list,ArrayObject)) and dest:
     target=refkey(dest[0]);n=pageids.get(target)
     if n is None and isinstance(dest[0],(int,NumberObject)):n=int(dest[0])+1
     if n and 1<=n<=len(pdf.pages):internal.append(n)
     else:linkissues.append({'page':number,'reason':'invalid internal page destination'})
    else:linkissues.append({'page':number,'reason':'link has no URI or resolvable destination'})
 row['links']={'externalCount':len(external),'uniqueExternalURLs':sorted(set(external)),'internalCount':len(internal),'issues':linkissues}
 if linkissues:row['issues'].append('invalid embedded links')
 fonts=subprocess.check_output(['pdffonts',str(path)],text=True).splitlines()[2:]
 row['fonts']={'rows':fonts,'allEmbedded':all(re.search(r'\s+yes\s+(?:yes|no)\s+(?:yes|no)\s+\d+\s+\d+\s*$',line) for line in fonts)}
 if not row['fonts']['allEmbedded']:row['issues'].append('font embedding not confirmed')
 rows.append(row)
 (OUT/'structure-audit.json').write_text(json.dumps({'date':'2026-11-05','status':'running','files':rows},indent=2)+'\n')
 print(name,len(pdf.pages),'pages',len(row['issues']),'issues',flush=True)
result={'date':'2026-11-05','status':'complete','pdfs':len(rows),'pages':sum(r['pages'] for r in rows),'files':rows,'issueFiles':[r['id'] for r in rows if r['issues']]}
(OUT/'structure-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print('COMPLETE',result['pdfs'],result['pages'],len(result['issueFiles']),'files requiring review',flush=True)
