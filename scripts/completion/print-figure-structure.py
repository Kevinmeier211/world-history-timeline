"""Classify nested PDF Figure tags without equating wrappers with missing image Alt."""
from pathlib import Path
import json
from pypdf import PdfReader
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/remaining-plan-2026-11-05/print'
catalog = json.loads((ROOT / 'public/atlas/exports/catalog.json').read_text())
def resolve(value):
    return value.get_object() if hasattr(value, 'get_object') else value

def collect(value):
    value = resolve(value)
    if isinstance(value, list):
        return [item for child in value for item in collect(child)]
    if not isinstance(value, dict):
        return []
    children = collect(value.get('/K'))
    if value.get('/S') == '/Figure':
        return [{'alt': str(value.get('/Alt', '')), 'actualText': str(value.get('/ActualText', '')), 'children': children, 'childRoles': roles(value.get('/K'))}]
    return children

def roles(value):
    value = resolve(value)
    if isinstance(value, list):
        return [role for child in value for role in roles(child)]
    if not isinstance(value, dict):
        return []
    return ([str(value['/S'])] if '/S' in value else []) + roles(value.get('/K'))

def described(nodes):
    return any(node['alt'] or node['actualText'] or described(node['children']) for node in nodes)

rows = []
for entry in catalog['files']:
    pdf = PdfReader(ROOT / 'public' / entry['path'].lstrip('/'))
    nodes = collect(pdf.trailer['/Root'].get('/StructTreeRoot'))
    counts = {'ownAlt': 0, 'ownActualText': 0, 'wrapperWithDescribedDescendant': 0, 'withoutDescription': 0}
    remaining = []
    def visit(nodes):
        for node in nodes:
            if node['alt']:
                counts['ownAlt'] += 1
            elif node['actualText']:
                counts['ownActualText'] += 1
            elif described(node['children']):
                counts['wrapperWithDescribedDescendant'] += 1
            else:
                counts['withoutDescription'] += 1
                remaining.append(node)
            visit(node['children'])
    visit(nodes)
    rows.append({'id': entry['id'], 'sha256': entry['sha256'], **counts, 'remaining': remaining})
result = {'date': '2026-11-05', 'pdfs': len(rows), 'counts': {key: sum(row[key] for row in rows) for key in counts}, 'files': rows}
(OUT / 'figure-structure.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result['counts']))
