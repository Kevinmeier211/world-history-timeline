"""Verify that the local launcher never reuses an unrelated server."""
import functools
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.request import urlopen

from launch_atlas import AtlasHandler, LocalServer, Static, build_identity, launch, same_build_at


class LauncherTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.addCleanup(self.folder.cleanup)
        self.root = Path(self.folder.name)
        (self.root / 'atlas').mkdir()
        (self.root / 'index.html').write_text('<h1>Chronos</h1>')
        (self.root / 'atlas/index.json').write_text('{"subjects":[]}')

    def serve(self, handler=AtlasHandler):
        server = LocalServer(('127.0.0.1', 0), functools.partial(handler, directory=str(self.root)))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()

        def close():
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)

        self.addCleanup(close)
        return server, f'http://127.0.0.1:{server.server_port}'

    def test_missing_build_has_clear_error(self):
        (self.root / 'atlas/index.json').unlink()
        with self.assertRaisesRegex(ValueError, 'npm run build'):
            build_identity(self.root)

    def test_same_build_is_reused_at_the_same_notebook_origin(self):
        server, url = self.serve()
        with patch('launch_atlas.webbrowser.open') as open_browser:
            self.assertEqual(launch(self.root, server.server_port, True), 0)
            open_browser.assert_called_once_with(url + '/')
        with urlopen(url) as response:
            self.assertIn(b'Chronos', response.read())

    def test_foreign_server_is_left_running(self):
        server, url = self.serve(Static)
        with patch('launch_atlas.webbrowser.open') as open_browser:
            with self.assertRaisesRegex(ValueError, 'Nothing was stopped'):
                launch(self.root, server.server_port, True)
            open_browser.assert_not_called()
        with urlopen(url) as response:
            self.assertEqual(response.status, 200)

    def test_changed_content_is_not_mistaken_for_the_original_build(self):
        original = build_identity(self.root)
        server, url = self.serve()
        (self.root / 'atlas/index.json').write_text('{"subjects":["changed"]}')
        self.assertFalse(same_build_at(url, original))
        self.assertTrue(same_build_at(url, build_identity(self.root)))


if __name__ == '__main__':
    unittest.main()
