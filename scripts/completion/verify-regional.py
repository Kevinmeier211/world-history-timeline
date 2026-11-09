"""Own one temporary server and run regional checks; use agent-heavy-run."""
import os
import argparse
from pathlib import Path
import subprocess
import sys
parser = argparse.ArgumentParser()
parser.add_argument('--skip-exports', action='store_true')
parser.add_argument('--export-ids', default='regional-C1,regional-C2,regional-C3,regional-C4,regional-C5,regional-C6,regional-C7,regional-C8')
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
build = root / 'dist'
subprocess.run([sys.executable, 'scripts/redesign/precompress.py'], cwd=root, check=True)
server = subprocess.Popen([sys.executable, '-u', 'scripts/redesign/serve.py', '--root', str(build), '--port', '0'], cwd=root, stdout=subprocess.PIPE, text=True)
try:
    line = server.stdout.readline().strip()
    origin = line.split('http://', 1)[1].split(' ', 1)[0]
    env = dict(os.environ, ATLAS_URL='http://' + origin, ATLAS_BUILD_ROOT=str(build), ATLAS_REPORT_DIR=str(root / 'output/completion-2026-11-04/regional-browser'))
    for command in [
        ['node', 'scripts/completion/regional-browser.mjs'],
        ['node', 'scripts/completion/export-catalog.mjs', '--ids', args.export_ids],
        ['node', 'scripts/redesign/performance.mjs'],
    ]:
        if args.skip_exports and 'scripts/completion/export-catalog.mjs' in command:
            continue
        subprocess.run(command, cwd=root, env=env, check=True)
finally:
    server.terminate()
    server.wait(timeout=10)
