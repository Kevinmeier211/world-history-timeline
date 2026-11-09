import importlib.util
import os
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('atlas_server', Path(__file__).with_name('serve.py'))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)


class EncodingTests(unittest.TestCase):
    def test_preferences_and_explicit_refusal(self):
        for header, expected in [('', []), ('br, gzip', ['br', 'gzip']),
                                 ('br;q=0,gzip', ['gzip']), ('gzip;q=.9,br;q=.1', ['gzip', 'br']),
                                 ('*;q=.5,br;q=0', ['gzip']), ('br;q=bad,gzip;q=2', [])]:
            with self.subTest(header=header):
                self.assertEqual(server.accepted_encodings(header), expected)

    def test_stale_and_absent_sidecars_fall_back(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'index.html'
            source.write_text('new content')
            gzip = Path(str(source) + '.gz')
            brotli = Path(str(source) + '.br')
            gzip.write_bytes(b'fixture'); brotli.write_bytes(b'fixture')
            os.utime(brotli, (1, 1))
            self.assertEqual(server.compressed_file(source, 'br,gzip'), ('gzip', gzip))
            gzip.unlink()
            self.assertIsNone(server.compressed_file(source, 'br,gzip'))
            self.assertIsNone(server.compressed_file(source, 'br;q=0'))
            source.unlink()
            self.assertIsNone(server.compressed_file(source, 'br,gzip'))


if __name__ == '__main__':
    unittest.main()
