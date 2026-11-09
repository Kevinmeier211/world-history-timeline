"""Package a local review candidate, verify extraction, and test offline use.

This is deliberately not the sealed/approved release packager. Human gates remain
open and no deployment or source commit is implied.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import zipfile

root = Path(__file__).resolve().parents[2]
build = root / os.environ.get('ATLAS_BUILD_ROOT', 'output/completion-2026-11-04/content-candidate')
out = root / 'output/completion-2026-11-04/portable'
out.mkdir(exist_ok=True)
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
files = {str(p.relative_to(build)): sha(p) for p in sorted(build.rglob('*')) if p.is_file()}
identity = hashlib.sha256(json.dumps({'siteFiles': files, 'packagingScriptSHA256': sha(Path(__file__)), 'extractionTestSHA256': sha(root / 'scripts/completion/portable-review.mjs')}, sort_keys=True).encode()).hexdigest()
destination = out / ('chronos-review-' + identity[:12])
if destination.exists(): raise RuntimeError('Preserve the existing package; this candidate is already packaged.')
destination.mkdir()
shutil.copytree(build, destination / 'site')
launcher = '''from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse, functools
p = argparse.ArgumentParser()
p.add_argument('--port', type=int, default=8000)
a = p.parse_args()
class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
    def handle(self):
        try: super().handle()
        except (BrokenPipeError, ConnectionResetError): pass
server = ThreadingHTTPServer(('127.0.0.1', a.port), functools.partial(Handler, directory=str(Path(__file__).parent / 'site')))
print('http://127.0.0.1:' + str(server.server_port), flush=True)
try: server.serve_forever()
except KeyboardInterrupt: pass
finally: server.server_close()
'''
(destination / 'launch.py').write_text(launcher)
(destination / 'README.txt').write_text('CHRONOS ATLAS - LOCAL REVIEW CANDIDATE\n\nRequires Python 3. Run: python3 launch.py\nOpen http://127.0.0.1:8000 in a browser. Stop with Control-C.\nOnly the local computer can connect. No account is required locally.\n\nThe historical corpus and application are a selective educational draft.\nIndependent historical, reader, device/accessibility and physical-print gates remain open.\nNotebook entries stay in this browser and origin; export them before changing origin/device.\nMedia carry individual credits and reuse conditions, including noncommercial and jurisdiction-specific terms. The two Partition records use original reference cards and link to the archive scans. Consult the item records before reusing individual images.\nExternal institutional sources still require internet access; the atlas readings, local images, fonts and PDFs are included.\n')
source_files = {}
for folder in ['src', 'scripts', 'docs/redesign']:
    for p in (root / folder).rglob('*'):
        if p.is_file() and '__pycache__' not in p.parts:
            source_files[str(p.relative_to(root))] = sha(p)
for name in ['package.json', 'package-lock.json', 'vite.config.ts', 'vitest.config.ts', 'vitest.atlas.config.ts', 'eslint.config.js', 'index.html', '.prettierrc.json', '.prettierignore', '.gitignore']:
    if (root / name).is_file(): source_files[name] = sha(root / name)
for p in root.glob('tsconfig*.json'): source_files[p.name] = sha(p)
source_state = {'status': 'local_review_candidate_not_accepted_release', 'artifactIdentity': identity,
                'sourceCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
                'identityNote': 'Commit alone does not identify this dirty candidate; use the exact source hashes.',
                'sourceFiles': source_files, 'siteFiles': files}
(destination / 'SOURCE_STATE.json').write_text(json.dumps(source_state, indent=2) + '\n')
checks = {str(p.relative_to(destination)): sha(p) for p in sorted(destination.rglob('*')) if p.is_file()}
(destination / 'SHA256SUMS.json').write_text(json.dumps(checks, indent=2) + '\n')
archive = destination.with_suffix('.zip')
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as zipped:
    for p in sorted(destination.rglob('*')):
        if p.is_file(): zipped.write(p, str(Path(destination.name) / p.relative_to(destination)))
with tempfile.TemporaryDirectory(prefix='chronos-review-extract-') as temporary:
    with zipfile.ZipFile(archive) as zipped: zipped.extractall(temporary)
    extracted = Path(temporary) / destination.name
    for name, digest in checks.items():
        if sha(extracted / name) != digest: raise RuntimeError('Extracted bytes differ: ' + name)
    server = subprocess.Popen([sys.executable, str(extracted / 'launch.py'), '--port', '0'], stdout=subprocess.PIPE, text=True)
    try:
        origin = server.stdout.readline().strip()
        if not origin.startswith('http://127.0.0.1:'): raise RuntimeError('Loopback launcher failed')
        subprocess.run(['node', str(root / 'scripts/completion/portable-review.mjs'), origin, str(extracted)], cwd=root, check=True, timeout=240)
    finally:
        server.terminate()
        server.wait(timeout=10)
receipt = {'result': 'pass', 'scope': 'local review package; not release acceptance', 'archive': str(archive.relative_to(root)), 'bytes': archive.stat().st_size, 'sha256': sha(archive), 'filesVerifiedAfterExtraction': len(checks), 'artifactIdentity': identity}
(out / (destination.name + '-receipt.json')).write_text(json.dumps(receipt, indent=2) + '\n')
(out / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt, indent=2))
