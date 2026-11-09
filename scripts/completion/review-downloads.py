"""Render every PDF page, deduplicate identical rasters and inspect text bounds."""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import tempfile
import pdfplumber
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser()
parser.add_argument('--ids', help='Comma-separated catalog IDs; default renders all PDFs')
parser.add_argument('--report-dir', default='output/pdf/chronos-downloads/review')
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
out = root / args.report_dir
out.mkdir(parents=True, exist_ok=True)
catalog = json.loads((root / 'public/atlas/exports/catalog.json').read_text())
if args.ids:
    selected = set(args.ids.split(','))
    catalog['files'] = [item for item in catalog['files'] if item['id'] in selected]
    assert {item['id'] for item in catalog['files']} == selected, 'Unknown export ID'
unique = {}
records = []
issues = []
for item in catalog['files']:
    file = root / 'public' / item['path'].lstrip('/')
    if item['kind'] == 'Short activity':
        # Poppler 26.04's bbox extractor aborts on these ReportLab font records.
        # pdfminer/pdfplumber independently extracts their actual word bounds.
        pages = []
        with pdfplumber.open(file) as pdf:
            for sheet in pdf.pages:
                page = ET.Element('{pdf}page', {'width': str(sheet.width), 'height': str(sheet.height)})
                for word in sheet.extract_words():
                    element = ET.SubElement(page, '{pdf}word', {'xMin': str(word['x0']), 'yMin': str(word['top']), 'xMax': str(word['x1']), 'yMax': str(word['bottom'])})
                    element.text = word['text']
                pages.append(page)
    else:
        bbox = subprocess.check_output(['pdftotext', '-bbox', str(file), '-'])
        xml = ET.fromstring(bbox)
        pages = [element for element in xml.iter() if element.tag.endswith('}page')]
    assert len(pages) == item['pages'], item['id']
    with tempfile.TemporaryDirectory(prefix='chronos-pdf-pages-') as directory:
        prefix = str(Path(directory) / 'page')
        subprocess.run(['pdftoppm', '-r', '72', '-png', str(file), prefix], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        rasters = sorted(Path(directory).glob('page-*.png'), key=lambda p: int(p.stem.split('-')[-1]))
        assert len(rasters) == len(pages), item['id']
        for number, (page, raster) in enumerate(zip(pages, rasters)):
            width, height = float(page.attrib['width']), float(page.attrib['height'])
            words = [element for element in page.iter() if element.tag.endswith('}word')]
            outside = [word.attrib for word in words if float(word.attrib['xMin']) < -1 or float(word.attrib['yMin']) < -1 or float(word.attrib['xMax']) > width + 1 or float(word.attrib['yMax']) > height + 1]
            if outside: issues.append({'id': item['id'], 'page': number + 1, 'outside': outside})
            picture = Image.open(raster).convert('RGB')
            digest = hashlib.sha256(picture.tobytes()).hexdigest()
            if digest not in unique:
                index = len(unique) + 1
                image = out / ('page-%04d.png' % index)
                picture.save(image)
                unique[digest] = {'index': index, 'file': image.name, 'firstDocument': item['id'], 'page': number + 1}
            records.append({'id': item['id'], 'page': number + 1, 'raster': unique[digest]['file'], 'uniqueIndex': unique[digest]['index'], 'textCharacters': sum(len(word.text or '') for word in words), 'bounds': 'pass' if not outside else 'review'})
values = list(unique.values())
contacts = []
for offset in range(0, len(values), 24):
    sheet = Image.new('RGB', (1040, 2112), '#cccccc')
    draw = ImageDraw.Draw(sheet)
    for slot, row in enumerate(values[offset:offset + 24]):
        picture = Image.open(out / row['file']).convert('RGB')
        picture.thumbnail((250, 324))
        x = (slot % 4) * 260 + 5
        y = (slot // 4) * 352 + 20
        sheet.paste(picture, (x, y))
        draw.text((x, y - 15), str(row['index']) + ' ' + row['firstDocument'][:25] + ':' + str(row['page']), fill='black')
    name = 'contact-%03d.jpg' % (len(contacts) + 1)
    sheet.save(out / name, quality=88)
    contacts.append(name)
receipt = {'pdfs': len(catalog['files']), 'inputs': [{'id': item['id'], 'sha256': item['sha256']} for item in catalog['files']], 'pagesRendered': len(records), 'uniqueRenderedPages': len(values), 'boundsIssues': issues, 'contacts': contacts, 'pages': records, 'visualReview': 'Contact sheets generated; record inspected sheets explicitly. Automated bounds do not establish layout or reading-order acceptance.'}
(out / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({key: receipt[key] for key in ['pdfs', 'pagesRendered', 'uniqueRenderedPages', 'boundsIssues', 'contacts']}, indent=2))
