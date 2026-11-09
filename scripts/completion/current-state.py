"""Generate current inventory without treating historical receipts as current checks."""
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]
c = json.loads((ROOT / 'public/atlas/corpus.json').read_text())
result = {
    'schemaVersion': 1,
    'sourceCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
    'sourceIdentityNote': 'Commit alone does not identify uncommitted work; pair with a release source manifest.',
    'corpusSHA256': hashlib.sha256((ROOT / 'public/atlas/corpus.json').read_bytes()).hexdigest(),
    'inventory': {k: len(v) for k, v in c.items() if isinstance(v, list)},
    'expandedDossiers': sum(bool(s.get('deeperReading')) for s in c['subjects']),
    'placeStudies': sum(bool(s.get('placeStudy')) for s in c['subjects']),
    'imagelessDossiers': [s['id'] for s in c['subjects'] if not s['objectIds']],
    'validation': 'See dated receipts for checks against an exact source/build; counts are not historical approval.',
}
(ROOT / 'docs/redesign/CURRENT-STATE.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result['inventory']))
