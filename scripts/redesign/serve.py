"""Loopback-only static preview with optional verified gzip/Brotli sidecars."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import functools
import mimetypes


def accepted_encodings(header):
    qualities = {}
    for item in header.split(','):
        parts = [part.strip().lower() for part in item.split(';')]
        quality = 1.0
        for parameter in parts[1:]:
            if parameter.startswith('q='):
                try:
                    quality = float(parameter[2:])
                except ValueError:
                    quality = 0
        qualities[parts[0]] = quality if 0 <= quality <= 1 else 0
    return sorted(
        [name for name in ('br', 'gzip') if qualities.get(name, qualities.get('*', 0)) > 0],
        key=lambda name: qualities.get(name, qualities.get('*', 0)), reverse=True,
    )


def compressed_file(original, header):
    if not original.is_file():
        return None
    for encoding in accepted_encodings(header):
        candidate = Path(str(original) + ('.br' if encoding == 'br' else '.gz'))
        if candidate.is_file() and candidate.stat().st_mtime_ns >= original.stat().st_mtime_ns:
            return encoding, candidate
    return None


class Static(SimpleHTTPRequestHandler):
    def send_head(self):
        original = Path(self.translate_path(self.path))
        if original.is_dir():
            original = original / 'index.html'
        choice = compressed_file(original, self.headers.get('Accept-Encoding', ''))
        if choice:
            encoding, compressed = choice
            stream = compressed.open('rb')
            self.send_response(200)
            self.send_header('Content-Type', mimetypes.guess_type(str(original))[0] or 'application/octet-stream')
            self.send_header('Content-Encoding', encoding)
            self.send_header('Content-Length', str(compressed.stat().st_size))
            self.end_headers()
            return stream
        return super().send_head()

    def end_headers(self):
        self.send_header('Vary', 'Accept-Encoding')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, *args):
        pass


class LocalServer(ThreadingHTTPServer):
    request_queue_size = 64


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default='site')
    parser.add_argument('--port', type=int, default=4174)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    assert (root / 'index.html').is_file(), f'No built atlas at {root}'
    server = LocalServer(('127.0.0.1', args.port), functools.partial(Static, directory=str(root)))
    print(f'Chronos local atlas: http://127.0.0.1:{server.server_port} (Ctrl-C to stop)', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
