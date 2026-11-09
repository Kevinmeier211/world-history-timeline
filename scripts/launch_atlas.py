"""Launch the built Atlas at a stable local address, preserving notebook storage."""
import argparse
import errno
import functools
import hashlib
import json
from pathlib import Path
import sys
from urllib.error import URLError
from urllib.request import urlopen
import webbrowser

from redesign.serve import LocalServer, Static

ROOT = Path(__file__).resolve().parents[1]
IDENTITY_PATH = '/__chronos_identity'


def build_identity(root):
    files = [root / 'index.html', root / 'atlas/index.json']
    if not all(path.is_file() for path in files):
        raise ValueError('The built atlas is missing. Run npm run build first.')
    digest = hashlib.sha256()
    for path in files:
        digest.update(path.read_bytes())
    return {'app': 'chronos-atlas', 'build': digest.hexdigest()}


class AtlasHandler(Static):
    def do_GET(self):
        if self.path != IDENTITY_PATH:
            return super().do_GET()
        payload = json.dumps(build_identity(Path(self.directory))).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def same_build_at(url, identity):
    try:
        with urlopen(url + IDENTITY_PATH, timeout=2) as response:
            return json.loads(response.read(2048)) == identity
    except (URLError, OSError, ValueError):
        return False


def launch(root, port=4383, open_browser=False):
    root = Path(root).resolve()
    identity = build_identity(root)
    url = f'http://127.0.0.1:{port}'
    handler = functools.partial(AtlasHandler, directory=str(root))
    try:
        server = LocalServer(('127.0.0.1', port), handler)
    except OSError as error:
        if error.errno != errno.EADDRINUSE:
            raise
        if not same_build_at(url, identity):
            raise ValueError(
                f'Port {port} is in use by another app or build. Nothing was stopped. '
                'Close that server yourself, or choose --port with another number. '
                'Notebook entries stay with their original browser and port.'
            ) from error
        print(f'Chronos is already running: {url}/', flush=True)
        if open_browser:
            webbrowser.open(url + '/')
        return 0
    with server:
        url = f'http://127.0.0.1:{server.server_port}/'
        print(f'Chronos Atlas: {url}', flush=True)
        print('Keep this window open while using the atlas. Press Control-C to stop.', flush=True)
        if open_browser:
            webbrowser.open(url)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nChronos stopped. Your saved notebook remains in your browser.')
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT / 'dist')
    parser.add_argument('--port', type=int, default=4383)
    parser.add_argument('--open', action='store_true', help='Open the default browser.')
    args = parser.parse_args()
    try:
        return launch(args.root, args.port, args.open)
    except (ValueError, OSError) as error:
        print(f'Could not start Chronos: {error}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
