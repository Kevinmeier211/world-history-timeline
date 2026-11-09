"""Disposable fixtures for the local release stager; never package a real build."""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('stager', Path(__file__).with_name('prepare-release-review.py'))
stager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stager)


class ReleaseStagingTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='chronos-stager-test-')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.repo, self.build, self.verification = [self.root / n for n in ['repo', 'dist', 'verification']]
        self.output = self.root / 'packet'
        for path in [self.repo, self.build, self.verification]:
            path.mkdir()
        self.put(self.build / 'index.html', '<!doctype html><title>Fixture</title>')
        self.put(self.build / 'assets/app.js', 'void 0;')
        self.put(self.build / 'assets/app.js.gz', b'preview sidecar only')
        self.put(self.build / 'assets/app.js.br', b'Brotli preview sidecar only')
        self.put(self.build / 'atlas/exports/activity.pdf', b'%PDF-synthetic byte fixture')
        self.put(self.build / 'atlas/media/object.webp', b'RIFFsynthetic byte fixture')
        self.put(self.build / 'atlas/corpus.json', {'subjects': []})
        self.corpus = stager.digest(self.build / 'atlas/corpus.json')
        for name in stager.DOCS:
            self.put(self.repo / name, {} if name.endswith('.json') else 'Synthetic review scope.\n')
        for name in stager.HUMAN_FILES:
            self.put(self.repo / stager.HUMAN_DIR / name, {} if name.endswith('.json') else 'Prepared only.\n')
        self.put(self.repo / stager.DOCS[0], {'corpusSHA256': self.corpus, 'inventory': {'subjects': 0}})
        self.put(self.repo / stager.HUMAN_DIR / 'manifest.json', {'corpusSHA256': self.corpus, 'status': 'prepared_not_observed_or_accepted'})
        self.put(self.repo / 'docs/redesign/COMPLETION-TRACKER-2026-11-04.json', {'tasks': [{'id': 'R03', 'status': 'blocked', 'description': 'Hosting approval pending.'}]})
        config = 'output/vercel-living-timeline-2026-11-01/site/vercel.json'
        self.put(self.repo / config, (stager.ROOT / config).read_bytes())
        self.put(self.verification / 'verification.json', {'status': 'passed_local_scope', 'corpusSHA256': self.corpus})
        files, _ = stager.static_files(self.build)
        self.put(self.verification / 'isolated/receipt.json', {
            'status': 'pass', 'dependencyMode': 'npm ci --offline',
            'steps': [{'name': 'build', 'exitCode': 0}, {'name': 'current-atlas-gate', 'exitCode': 0}],
            'sourceFiles': [{'path': '.gitignore', 'sha256': '0' * 64}, {'path': 'src/main.tsx', 'sha256': '1' * 64}],
            'buildFiles': [{'path': name, 'sha256': sha} for name, sha in files.items()],
        })

    @staticmethod
    def put(path, value):
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(value, bytes):
            path.write_bytes(value)
        elif isinstance(value, str):
            path.write_text(value)
        else:
            path.write_text(json.dumps(value))

    def run_stager(self):
        return stager.prepare(self.build, self.verification, self.output, self.repo)

    def test_exact_static_copy_archive_and_review_separation(self):
        # Unselected private evidence must not be traversed or copied.
        self.put(self.verification / 'real-notebook.json', {'version': 1, 'notes': [{'private': True}]})
        result = self.run_stager()
        self.assertEqual(result['status'], 'passed_local_staging_only')
        self.assertEqual(result['excludedCompressionSidecars'], 2)
        self.assertFalse(result['deploymentPerformed'])
        self.assertFalse((self.output / 'site/assets/app.js.gz').exists())
        self.assertFalse((self.output / 'verification/real-notebook.json').exists())
        self.assertEqual((self.output / 'site/atlas/exports/activity.pdf').read_bytes(), (self.build / 'atlas/exports/activity.pdf').read_bytes())
        self.assertEqual(stager.digest(self.output / 'site/vercel.json'), stager.CONFIG_SHA256)
        self.assertTrue((self.output / 'RELEASE-SOURCE-MANIFEST.json').exists())
        self.assertFalse((self.output / 'site/TARGET-EVIDENCE.json').exists())
        with zipfile.ZipFile(self.output.with_suffix('.zip')) as zipped:
            self.assertIn('packet/SHA256SUMS.json', zipped.namelist())
        manifest = stager.load_json(self.output / 'STAGING.json')['staticFiles']
        stager.verify_packet(self.output, manifest)
        self.put(self.output / 'site/assets/app.js', 'tampered')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            stager.verify_packet(self.output, manifest)

    def test_empty_directory_marker_is_inventory_only(self):
        path = self.verification / 'isolated/receipt.json'
        receipt = stager.load_json(path)
        receipt['sourceFiles'].append({'path': 'docs/reference/.gitkeep', 'bytes': 0, 'sha256': stager.hashlib.sha256(b'').hexdigest()})
        self.put(path, receipt)
        self.assertEqual(self.run_stager()['status'], 'passed_local_staging_only')
        self.assertFalse((self.output / 'review/docs/reference/.gitkeep').exists())

    def test_nonempty_hidden_marker_is_rejected(self):
        path = self.verification / 'isolated/receipt.json'
        receipt = stager.load_json(path)
        receipt['sourceFiles'].append({'path': 'docs/reference/.gitkeep', 'bytes': 10, 'sha256': 'f' * 64})
        self.put(path, receipt)
        with self.assertRaisesRegex(ValueError, 'Nonempty directory marker'):
            self.run_stager()
        self.assertFalse(self.output.exists())

    def test_refuses_existing_destination_or_archive(self):
        self.output.mkdir()
        with self.assertRaisesRegex(ValueError, 'overwrite'):
            self.run_stager()
        self.output.rmdir()
        self.output.with_suffix('.zip').write_bytes(b'preserve')
        with self.assertRaisesRegex(ValueError, 'overwrite'):
            self.run_stager()

    def test_rejects_changed_build(self):
        self.put(self.build / 'assets/app.js', 'changed')
        with self.assertRaisesRegex(ValueError, 'exactly match'):
            self.run_stager()
        self.assertFalse(self.output.exists())

    def test_rejects_stale_human_packet(self):
        self.put(self.repo / stager.HUMAN_DIR / 'manifest.json', {'corpusSHA256': 'old'})
        with self.assertRaisesRegex(ValueError, 'stale'):
            self.run_stager()

    def test_rejects_failed_isolated_gate(self):
        path = self.verification / 'isolated/receipt.json'
        receipt = stager.load_json(path)
        receipt['steps'][0]['exitCode'] = 1
        self.put(path, receipt)
        with self.assertRaisesRegex(ValueError, 'failed'):
            self.run_stager()

    def test_rejects_symlink_in_build(self):
        (self.build / 'assets/linked.js').symlink_to(self.build / 'assets/app.js')
        with self.assertRaisesRegex(ValueError, 'Symlink'):
            self.run_stager()

    def test_rejects_symlink_selected_receipt(self):
        original = self.verification / 'isolated/receipt.json'
        saved = self.root / 'saved.json'
        shutil.move(original, saved)
        original.symlink_to(saved)
        with self.assertRaisesRegex(ValueError, 'Symlink'):
            self.run_stager()

    def test_rejects_private_path(self):
        self.put(self.build / '.env', 'SECRET=value')
        with self.assertRaisesRegex(ValueError, 'Private'):
            self.run_stager()

    def test_rejects_notebook_payload(self):
        self.put(self.build / 'atlas/user-data.json', {'version': 1, 'notes': []})
        with self.assertRaisesRegex(ValueError, 'Notebook contents'):
            self.run_stager()

    def test_rejects_browser_storage_payload(self):
        self.put(self.verification / 'verification.json', {'cookies': [], 'origins': []})
        with self.assertRaisesRegex(ValueError, 'authentication state'):
            self.run_stager()

    def test_rejects_nested_output(self):
        self.output = self.build / 'new-packet'
        with self.assertRaisesRegex(ValueError, 'outside build'):
            self.run_stager()

    def test_rejects_config_byte_drift(self):
        config = self.repo / 'output/vercel-living-timeline-2026-11-01/site/vercel.json'
        config.write_text(config.read_text() + '\n')
        with self.assertRaisesRegex(ValueError, 'configuration bytes'):
            self.run_stager()


if __name__ == '__main__':
    unittest.main()
