"""Incrementally repair catalog PDF titles, proving all other original objects unchanged."""
from pathlib import Path
from io import BytesIO
import hashlib, json, shutil
from pypdf import PdfReader, PdfWriter
from pypdf.generic import IndirectObject
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/remaining-plan-2026-11-05/print'
BEFORE = OUT / 'before-title-repair'
BEFORE.mkdir(exist_ok=True)
catpath = ROOT / 'public/atlas/exports/catalog.json'
catalog = json.loads(catpath.read_text())
(BEFORE / 'catalog.json').write_text(catpath.read_text())
def digest(raw):
    return hashlib.sha256(raw).hexdigest()
def objects(reader):
    keys = {(generation, number) for generation, members in reader.xref.items() for number in members if number and generation != 65535}
    keys.update((0, number) for number in reader.xref_objStm)
    result = {}
    for generation, number in keys:
        obj = reader.get_object(IndirectObject(number, generation, reader))
        output = BytesIO()
        obj.write_to_stream(output)
        result[(generation, number)] = digest(output.getvalue())
    return result
rows = []
for row in catalog['files']:
    if row['id'].startswith('short-'):
        continue
    path = ROOT / 'public' / row['path'].lstrip('/')
    raw = path.read_bytes()
    assert digest(raw) == row['sha256']
    prior = PdfReader(BytesIO(raw))
    assert prior.metadata.title == 'Chronos Atlas — States and peoples, 3300 BCE to 2000 CE'
    before_objects = objects(prior)
    info = prior.trailer.raw_get('/Info')
    info_key = (info.generation, info.idnum)
    writer = PdfWriter(BytesIO(raw), incremental=True)
    writer.add_metadata({'/Title': row['title']})
    changes = writer.list_objects_in_increment()
    assert [(ref.generation, ref.idnum) for ref in changes] == [info_key]
    output = BytesIO()
    writer.write(output)
    updated = output.getvalue()
    assert updated.startswith(raw), row['id']
    after = PdfReader(BytesIO(updated))
    after_objects = objects(after)
    unchanged = [key for key in before_objects if key != info_key]
    assert all(before_objects[key] == after_objects[key] for key in unchanged), row['id']
    assert after.metadata.title == row['title']
    assert len(after.pages) == row['pages']
    assert row['budget'] is None or len(updated) <= row['budget']
    assert {k:v for k,v in prior.metadata.items() if k != '/Title'} == {k:v for k,v in after.metadata.items() if k != '/Title'}
    (BEFORE / path.name).write_bytes(raw)
    path.write_bytes(updated)
    output_copy = ROOT / 'output/pdf/chronos-downloads' / path.name
    if output_copy.exists():
        shutil.copyfile(path, output_copy)
    rows.append({'id': row['id'], 'beforeSHA256': digest(raw), 'sha256': digest(updated), 'beforeBytes': len(raw), 'bytes': len(updated), 'pages': len(after.pages), 'title': after.metadata.title, 'originalBytesPreservedAsPrefix': True, 'unchangedOriginalObjectsExcludingInfo': len(unchanged), 'onlyChangedOriginalObject': list(info_key), 'otherMetadataUnchanged': True, 'contentRevision': row['revision']})
    row.update(sha256=digest(updated), bytes=len(updated), withinBudget=True)
manifest = json.dumps(catalog, indent=2) + '\n'
catpath.write_text(manifest)
(ROOT / 'output/pdf/chronos-downloads/catalog.json').write_text(manifest)
receipt = {'date': '2026-11-05', 'method': 'pypdf 6.9.1 incremental append; only existing Info object changes; original bytes retained verbatim; all other original indirect-object serializations identical', 'files': rows, 'pdfs': len(rows), 'pages': sum(row['pages'] for row in rows), 'unchangedShortPDFs': 8, 'renderReuse': 'All prior page/content/tag/link objects unchanged, so prior rendered pages and complete structure audit remain valid for these successor hashes.'}
(OUT / 'title-repair.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'repaired': len(rows), 'pagesPreserved': receipt['pages'], 'unchangedShortPDFs': 8}))
