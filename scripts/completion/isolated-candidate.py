"""Build a source snapshot in a new directory; never clean the working tree.

Run with agent-heavy-run on Kevin's Mac. The default installs exact locked
dependencies from the npm cache and fails explicitly if unavailable.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--reuse-dependencies', action='store_true', help='Diagnostic only; not a clean dependency-install gate')
parser.add_argument('--online', action='store_true', help='Fetch missing locked packages from the configured registry')
parser.add_argument('--report-dir', default='output/completion-2026-11-04/reproducibility', help='Separate receipt directory for this candidate')
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
stage = Path(tempfile.mkdtemp(prefix='chronos-candidate-'))
report = root / args.report_dir
report.mkdir(parents=True, exist_ok=True)
allowed_dirs = ['src', 'scripts', 'public', 'tests', 'docs', 'LICENSES']
excluded = {'local-only', '__pycache__', '.DS_Store'}
files = []
for name in allowed_dirs:
    for p in (root / name).rglob('*'):
        if p.is_file() and not any(part in excluded for part in p.relative_to(root).parts):
            files.append(p)
files += [p for p in root.iterdir() if p.is_file() and (
    p.name in {'README.md', 'index.html', '.gitignore', '.prettierignore', '.prettierrc.json', 'Start Chronos.command'}
    or p.suffix in {'.json', '.ts', '.js'} and not p.name.endswith('.tsbuildinfo'))]
manifest = []
for p in sorted(files):
    relative = p.relative_to(root)
    dest = stage / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(p, dest)
    manifest.append({'path': str(relative), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'bytes': p.stat().st_size})
receipt = {'stage': str(stage), 'sourceFiles': manifest, 'dependencyMode': 'shared diagnostic' if args.reuse_dependencies else ('npm ci' if args.online else 'npm ci --offline'), 'steps': [], 'status': 'running', 'runtime': {}}
for name, command in [('node', ['node', '--version']), ('npm', ['npm', '--version']), ('python', ['python3', '--version'])]:
    receipt['runtime'][name] = subprocess.check_output(command, text=True).strip()
steps = []
if args.reuse_dependencies:
    (stage / 'node_modules').symlink_to(root / 'node_modules', target_is_directory=True)
else:
    steps.append(('install', ['npm', 'ci', *([] if args.online else ['--offline']), *(['--cache', str(stage / '.npm-cache')] if args.online else []), '--no-audit', '--no-fund']))
steps += [('build', ['npm', 'run', 'build']), ('current-atlas-gate', ['npm', 'run', 'check:atlas']), ('bundle', ['node', '--import', 'tsx', 'scripts/bundle-size.ts'])]
try:
    for name, command in steps:
        print(name + ': ' + ' '.join(command), flush=True)
        with (report / (name + '.log')).open('w') as log:
            result = subprocess.run(command, cwd=stage, stdout=log, stderr=subprocess.STDOUT)
        receipt['steps'].append({'name': name, 'exitCode': result.returncode})
        if result.returncode:
            raise RuntimeError(name + ' failed; see ' + str(report / (name + '.log')))
    receipt['status'] = 'pass'
    receipt['buildFiles'] = [{'path': str(p.relative_to(stage / 'dist')), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted((stage / 'dist').rglob('*')) if p.is_file()]
finally:
    if receipt['status'] != 'pass': receipt['status'] = 'failed'
    (report / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
    print('Preserved isolated candidate: ' + str(stage), flush=True)
