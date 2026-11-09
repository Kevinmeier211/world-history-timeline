"""Check canonical reader blocks in PDF tag order after print-structure-audit.py."""
from pathlib import Path
import json, re, unicodedata
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/remaining-plan-2026-11-05/print'
corpus = json.loads((ROOT / 'public/atlas/corpus.json').read_text())
def key(text):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', text).replace('\u00ad', '')).casefold()
rows = []
for s in corpus['subjects']:
    path = OUT / 'logical-order' / f"reader-{s['id']}.txt"
    text = key(re.sub(r'^\[page .*?\] ', '', path.read_text(), flags=re.M))
    expected = [s['name'], s['question'], s['summary']]
    for block in s['sections']:
        expected.extend([block['title'], block['text']])
    expected.append('Place this story in time')
    evidence = s.get('evidenceReading')
    if evidence:
        expected.extend([evidence['title'], evidence['introduction']])
        for item in evidence['items']:
            expected.extend([item['label'], item['text'], item['interpretation']])
    expected.append('How do we know?')
    for claim in s['claims']:
        expected.append(claim['text'])
        if claim.get('uncertainty'):
            expected.append(claim['uncertainty'])
    expected.append('Go deeper')
    for block in s.get('deeperReading', []):
        expected.extend([block['title'], block['text']])
    expected.extend(['Keep a question', s['returnPrompt'], 'Sources, access and limits'])
    position = 0
    gaps = []
    for block in expected:
        found = text.find(key(block), position)
        if found < 0:
            gaps.append(block)
        else:
            position = found + len(key(block))
    rows.append({'id': s['id'], 'blocks': len(expected), 'missingOrReordered': gaps})
(OUT / 'logical-reader-contract.json').write_text(json.dumps(rows, indent=2) + '\n')
print(json.dumps({'readers': len(rows), 'blocks': sum(r['blocks'] for r in rows), 'failed': [r['id'] for r in rows if r['missingOrReordered']]}))
