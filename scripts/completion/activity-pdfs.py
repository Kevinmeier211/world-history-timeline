"""Export eight source-backed short activity packets; no new historical claims."""
import argparse
import re
import hashlib
import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether
from pypdf import PdfReader
from PIL import Image as PILImage

root = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', default='output/pdf/chronos-short-activities')
args = parser.parse_args()
out = root / args.output
out.mkdir(parents=True, exist_ok=True)
corpus_path = root / 'public/atlas/corpus.json'
c = json.loads(corpus_path.read_text())
contracts = json.loads((root / 'src/atlas/chapter-learning.json').read_text())
sources = {s['id']: s for s in c['sources']}
pdfmetrics.registerFont(TTFont('ChronosSerif', '/System/Library/Fonts/Supplemental/Georgia.ttf'))
pdfmetrics.registerFont(TTFont('ChronosBold', '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle('BodyAtlas', fontName='ChronosSerif', fontSize=10, leading=14, spaceAfter=7, textColor=colors.HexColor('#243b31')))
styles.add(ParagraphStyle('HeadingAtlas', fontName='ChronosBold', fontSize=19, leading=23, spaceAfter=12, textColor=colors.HexColor('#243b31')))
styles.add(ParagraphStyle('SubAtlas', fontName='ChronosBold', fontSize=12, leading=16, spaceBefore=8, spaceAfter=7, textColor=colors.HexColor('#243b31')))
styles.add(ParagraphStyle('SmallAtlas', fontName='ChronosSerif', fontSize=8, leading=11, spaceAfter=5, textColor=colors.HexColor('#47574e')))
styles.add(ParagraphStyle('LabelAtlas', parent=styles['SmallAtlas'], alignment=TA_CENTER))
def clean(text):
    return str(text).replace('–', '-').replace('—', ' - ').replace('\u2011', '-')
def p(text, style='BodyAtlas'):
    return Paragraph(escape(clean(text)), styles[style])
def html_text(value):
    return re.sub(r'<link\b', '<a', value).replace('</link>', '</a>')

def flow_html(flow):
    if isinstance(flow, Paragraph):
        tag = 'h1' if flow.style.name == 'HeadingAtlas' else 'h2' if flow.style.name == 'SubAtlas' else 'p'
        return f'<{tag} class="{flow.style.name}">{html_text(flow.text)}</{tag}>'
    if isinstance(flow, Image):
        return f'<img src="{Path(flow.filename).resolve().as_uri()}" alt="{escape(flow.atlas_alt, {chr(34): "&quot;"})}" width="{flow.drawWidth / .75}" height="{flow.drawHeight / .75}" style="width:{flow.drawWidth}pt;height:{flow.drawHeight}pt">'
    if isinstance(flow, Table):
        figures = []
        for cell in flow._cellvalues[0]:
            image, caption = cell
            figures.append('<figure>' + flow_html(image) + '<figcaption>' + html_text(caption.text) + '</figcaption></figure>')
        return '<div class="figures" style="grid-template-columns:repeat(' + str(len(figures)) + ',minmax(0,1fr))">' + ''.join(figures) + '</div>'
    if isinstance(flow, PageBreak):
        return '</section><section class="evidence-page">'
    if isinstance(flow, Spacer):
        return f'<div aria-hidden="true" style="height:{flow.height}pt"></div>'
    raise TypeError(type(flow).__name__)

CSS = """
@font-face {font-family:ChronosGeorgia;src:url(file:///System/Library/Fonts/Supplemental/Georgia.ttf)}
@font-face {font-family:ChronosGeorgia;src:url(file:///System/Library/Fonts/Supplemental/Georgia%20Bold.ttf);font-weight:bold}
@page {size:Letter portrait;margin:46pt 48pt 52pt}
* {box-sizing:border-box}
html {font-family:ChronosGeorgia,Georgia,serif;color:#243b31;font-size:10pt;line-height:14pt}
body {margin:0}
p {margin:0 0 7pt}
h1 {font-size:19pt;line-height:23pt;margin:0 0 12pt;font-weight:bold;break-after:avoid}
h2 {font-size:12pt;line-height:16pt;margin:8pt 0 7pt;font-weight:bold;break-after:avoid}
.SmallAtlas {font-size:8pt;line-height:11pt;margin-bottom:5pt;color:#47574e}
a {color:#245d46;text-decoration:underline;overflow-wrap:anywhere}
.evidence-page {break-before:page}
.figures {display:grid;gap:8pt;break-inside:avoid;width:510pt;max-width:100%}
figure {margin:0;text-align:center}
figure img {max-width:100%;object-fit:contain}
figcaption {font-size:8pt;line-height:11pt;margin-top:0;margin-bottom:5pt;color:#47574e}
"""

results = []
for row in contracts:
    subject = next(s for s in c['subjects'] if s['id'] == row['subject'])
    media = [next(m for m in c['media'] if m['id'] == mid) for mid in subject['objectIds']]
    # These activities use the first visual, except Han's explicitly named three models.
    media = media if row['chapter'] == 'C4' else media[:1]
    story = [p(row['chapter'] + ' | A short source investigation', 'SmallAtlas'), p(subject['familyActivity']['title'], 'HeadingAtlas'), p(subject['name'] + ' | ' + subject['interval']['label'], 'SmallAtlas'), p(row['duration']), p(row['shortOutcome'])]
    if media:
        cells = []
        for m in media:
            path = root / 'public' / m['image'].lstrip('/')
            if path.suffix == '.svg':
                raster = out / (m['id'] + '.png')
                subprocess.run(['node', '--input-type=module', '-e', 'import sharp from "sharp"; await sharp(process.argv[1], {density:144}).png().toFile(process.argv[2]);', str(path), str(raster)], cwd=root, check=True)
                path = raster
            else:
                derivative = out / (m['id'] + '-print.jpg')
                with PILImage.open(path) as source_image:
                    source_image = source_image.convert('RGB')
                    source_image.thumbnail((1200, 1200))
                    source_image.save(derivative, quality=90, optimize=True)
                path = derivative
            width, height = ImageReader(str(path)).getSize()
            maxwidth = 510 / len(media) - 10
            ratio = min(maxwidth / width, (250 if len(media) == 1 else 195) / height)
            figure = Image(str(path), width=width * ratio, height=height * ratio)
            figure.atlas_alt = m['alt']
            cells.append([figure, p(m['title'] + ' | ' + m['date']['label'], 'LabelAtlas')])
        table = Table([cells], colWidths=[510 / len(media)] * len(media))
        table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 4), ('RIGHTPADDING', (0, 0), (-1, -1), 4)]))
        story += [table, Spacer(1, 6)]
    else:
        story += [p('This investigation uses the dated source readings on the next page. No illustrative image is supplied.', 'SmallAtlas')]
    story += [p('Try it', 'SubAtlas')]
    for index, step in enumerate(row['steps'], 1): story += [p(str(index) + '. ' + step)]
    story += [p('My explanation and one evidence limit', 'SubAtlas'), p('Use the supplied evidence on the following page. Distinguish what you observe from what a source explains.'), Spacer(1, 20), p('____________________________________________________________________'), Spacer(1, 10), p('____________________________________________________________________'), PageBreak(), p('Evidence to use', 'HeadingAtlas'), p('These editorial paraphrases distinguish visible detail from interpretations of a relief’s purpose. They are not quotations.' if row['chapter'] == 'C3' else subject['evidenceReading']['introduction'])]
    refs = []
    selected_items = {'C1': [0], 'C2': [0, 1, 2], 'C3': [0], 'C4': [0], 'C5': [0], 'C6': [0, 1], 'C7': [0, 1, 2], 'C8': [1, 2]}[row['chapter']]
    for item in [subject['evidenceReading']['items'][index] for index in selected_items]:
        story += [p(item['label'], 'SubAtlas'), p(item['text']), p(item['interpretation'])]
        locators = []
        for ref in item['citations']:
            if ref not in refs: refs.append(ref)
            locators.append('[' + str(refs.index(ref) + 1) + ']')
        story += [p('Sources: ' + ' '.join(locators), 'SmallAtlas')]
    if row['chapter'] == 'C5':
        for ref in subject['evidenceReading']['items'][1]['citations']:
            if ref not in refs: refs.append(ref)
    story += [p('For the adult or independent reader', 'SubAtlas'), p(row['facilitatorRubric']), p(subject['familyActivity']['explanation']), p(row['revisit']), p('Save the first answer before adding a later reflection. The estimated duration has not been tested with readers.', 'SmallAtlas'), p('Sources and image credits', 'SubAtlas')]
    for index, ref in enumerate(refs, 1):
        source = sources[ref['source']]
        title = escape(clean(source['title']))
        url = escape(source['url'], {'"': '&quot;'})
        story += [Paragraph(f'[{index}] <link href="{url}" color="#245d46">{title}</link>. {escape(clean(source["institution"]))}. Locator: {escape(clean(ref["locator"]))}.', styles['SmallAtlas'])]
    for m in media:
        source = sources[m['source']]
        story += [p(m['title'] + ': ' + m['credit'] + '. ' + m['rights'] + '. Object date: ' + m['date']['label'] + '. ' + m['caption'], 'SmallAtlas'), Paragraph('<link href="' + escape(source['url'], {'"': '&quot;'}) + '" color="#245d46">Original institutional record</link>', styles['SmallAtlas'])]
    filename = 'short-' + row['chapter']
    html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>' + escape(subject['familyActivity']['title']) + '</title><style>' + CSS + '</style></head><body><main><section>' + ''.join(flow_html(item) for item in story) + '</section></main></body></html>'
    (out / (filename + '.html')).write_text(html)
    results.append({'chapter': row['chapter'], 'subject': subject['id'], 'html': str((out / (filename + '.html')).relative_to(root)), 'path': str((out / (filename + '.pdf')).relative_to(root)), 'title': subject['familyActivity']['title']})
(out / 'inputs.json').write_text(json.dumps({'corpusSHA256': hashlib.sha256(corpus_path.read_bytes()).hexdigest(), 'packets': results}, indent=2) + '\n')
subprocess.run(['node', str(root / 'scripts/completion/tagged-activity-pdfs.mjs'), str(out / 'inputs.json')], cwd=root, check=True)
