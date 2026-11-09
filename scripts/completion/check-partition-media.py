"""Look for the two unlicensed archive scans in the static site and PDF image streams."""
import hashlib
import io
import json
import sys
import zipfile
from pathlib import Path
from pypdf import PdfReader
from pypdf.generic import IndirectObject
from pypdf.generic._image_xobject import _xobj_to_image
from PIL import Image, ImageChops, ImageStat

build, preserved, previous_zip, receipt = map(Path, sys.argv[1:])
probes = []
for image in sorted(preserved.glob('*.jpg')):
    with Image.open(image) as original:
        probes.append((image.name, original.width / original.height, original.convert('RGB').resize((64, 64))))
assert len(probes) == 2

def find_scans(pdf, cache):
    matches = set()
    reader = PdfReader(io.BytesIO(pdf))
    for number in reader.xref.get(0, {}):
        if number == 0:
            continue
        obj = reader.get_object(IndirectObject(number, 0, reader))
        if not isinstance(obj, dict) or obj.get('/Subtype') != '/Image':
            continue
        ratio = obj['/Width'] / obj['/Height']
        candidates = [(name, sample) for name, expected, sample in probes if abs(ratio / expected - 1) < 0.025]
        if not candidates:
            continue
        digest = hashlib.sha256(obj.get_data()).digest()
        if digest not in cache:
            img = _xobj_to_image(obj)[2]
            view = img.convert('RGB').resize((64, 64))
            cache[digest] = [name for name, sample in candidates if sum(ImageStat.Stat(ImageChops.difference(view, sample)).mean) / 3 < 8]
        matches.update(cache[digest])
    return sorted(matches)

with zipfile.ZipFile(previous_zip) as archive:
    old_reader = next(p for p in archive.namelist() if p.endswith('/reader-partition-1947.pdf'))
    controls = find_scans(archive.read(old_reader), {})
assert len(controls) == 2, 'The previous reader must detect both original scans'
forbidden = {hashlib.sha256(p.read_bytes()).digest() for p in preserved.iterdir() if p.is_file()}
standalone = []
pdf_hits = []
pdf_count = 0
cache = {}
for p in sorted(build.rglob('*')):
    if not p.is_file():
        continue
    raw = p.read_bytes()
    if hashlib.sha256(raw).digest() in forbidden:
        standalone.append(str(p))
    if p.suffix == '.pdf':
        pdf_count += 1
        matches = find_scans(raw, cache)
        if matches:
            pdf_hits.append({'file':str(p),'matches':matches})
result = dict(positiveControls=controls, standaloneOriginalsFound=standalone, pdfsChecked=pdf_count,
              pdfOriginalsFound=pdf_hits, scope='Exact hashes for retired display, thumbnail and print files; aspect-ratio and decoded RGB comparison for embedded PDF images. Positive control from pre-repair PDF.')
receipt.write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result))
assert pdf_count == 138 and not standalone and not pdf_hits
