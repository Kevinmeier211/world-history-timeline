"""Check named claims in actual PDFs and compare delivery bytes with the catalog."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import unicodedata

root = Path(__file__).resolve().parents[2]
out = root / 'output/dossier-review-2026-11-04'
digest = lambda raw: hashlib.sha256(raw).hexdigest()
def text_key(value):
    # Poppler may insert line breaks, layout whitespace and discretionary hyphens.
    value = unicodedata.normalize('NFKC', value).replace('\u00ad', '')
    return re.sub(r'\s+', '', value).casefold()

corpus_bytes = (root / 'public/atlas/corpus.json').read_bytes()
corpus = json.loads(corpus_bytes)
catalog = json.loads((root / 'public/atlas/exports/catalog.json').read_text())
prior = {row['id']: row for row in json.loads((out / 'catalog-before.json').read_text())['files']}
assert catalog['corpusSHA256'] == digest(corpus_bytes)
by_id = {s['id']: s for s in corpus['subjects']}
sources = {s['id']: s for s in corpus['sources']}
changed, claims = [], []
for row in catalog['files']:
    path = root / 'public' / row['path'].lstrip('/')
    raw = path.read_bytes()
    assert len(raw) == row['bytes'] and digest(raw) == row['sha256'] and row['withinBudget'], row['id']
    if row['sha256'] != prior[row['id']]['sha256']:
        changed.append(row['id'])
    if row['kind'] != 'Investigation reader':
        continue
    extracted = text_key(subprocess.check_output(['pdftotext', '-layout', str(path), '-'], text=True))
    assert text_key('How do we know?') in extracted, row['id']
    for claim in by_id[row['id'][len('reader-'):]]['claims']:
        expected = [claim['text'], *[c['locator'] for c in claim['citations']], *[sources[c['source']]['title'] for c in claim['citations']]]
        if claim.get('uncertainty'):
            expected.append(claim['uncertainty'])
        for fragment in expected:
            assert text_key(fragment) in extracted, (row['id'], claim['id'], fragment)
        claims.append(claim['id'])
assert len(set(claims)) == 114 and len(by_id) == 77 and len(prior) == len(catalog['files']) == 138
outcome = dict(result='pass', corpusSHA256=digest(corpus_bytes), pdfs=len(catalog['files']),
               totalPages=sum(r['pages'] for r in catalog['files']), readers=77, verifiedClaimIDs=claims,
               changedPDFs=changed, changedPages=sum(r['pages'] for r in catalog['files'] if r['id'] in changed),
               method='PDF text extraction matched every named claim, uncertainty, source locator and source title. SHA-256 and byte budgets checked for the full catalogue.')
(out / 'pdf-verification.json').write_text(json.dumps(outcome, indent=2) + '\n')
print(f"{len(changed)} changed PDFs, {outcome['changedPages']} changed-document pages, 114 named claims verified in 77 readers.")
