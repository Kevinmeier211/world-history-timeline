"""Build a fresh local package from a sealed candidate; never replace an earlier one."""
from pathlib import Path
import argparse
import gzip
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parents[2]


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')


MEDIA_DETAIL_KEYS = {
    'caption', 'notice', 'creator', 'place', 'material', 'representedDate',
    'relevance', 'datingNote', 'additionalImages', 'additionalImageAlts', 'printWidthMm', 'annotations',
}
MEDIA_PRINT_ONLY_KEYS = {'printCaption', 'printCredit'}


def verify_media_sidecars(public_atlas, built_atlas):
    """Check the exact local delivery inventory before creating a package."""
    corpus = json.loads((public_atlas / 'corpus.json').read_text())
    index = json.loads((public_atlas / 'index.json').read_text())
    revision = index.get('mediaRevision')
    require(index.get('mediaDetailsDeferred') is True, 'Media details are not explicitly deferred in the checked index.')
    require(isinstance(revision, str) and re.fullmatch(r'[0-9a-f]{64}', revision), 'Invalid global media revision.')
    for media in corpus['media']:
        if 'additionalImageAlts' in media:
            paths, alts = media.get('additionalImages'), media['additionalImageAlts']
            require(isinstance(paths, list) and isinstance(alts, list) and len(paths) == len(alts)
                    and all(isinstance(value, str) and value.strip() for value in [*paths, *alts]),
                    f'Alternate descriptions do not align with image paths: {media["id"]}')
        require('hasAnnotations' not in media or media['hasAnnotations'] is True, f'Invalid retained annotation flag: {media["id"]}')
        require(('annotations' in media) == (media.get('hasAnnotations') is True), f'Annotation flag/set mismatch: {media["id"]}')
        if 'annotations' in media:
            require(isinstance(media['annotations'], dict), f'Invalid annotation set: {media["id"]}')
    expected_summaries = [
        {key: value for key, value in media.items() if key not in MEDIA_DETAIL_KEYS | MEDIA_PRINT_ONLY_KEYS}
        for media in corpus['media']
    ]
    require(index['media'] == expected_summaries, 'Bootstrap media differ from the complete corpus retained fields/order.')
    full_media = {media['id']: media for media in corpus['media']}
    require(len(full_media) == len(corpus['media']), 'Duplicate complete media IDs.')
    subjects = [subject for subject in corpus['subjects'] if subject['objectIds']]
    expected_names = {f"{subject['id']}.json" for subject in subjects}
    require(len(expected_names) == len(subjects), 'Duplicate media subject IDs.')
    public_dir, built_dir = public_atlas / 'media-records', built_atlas / 'media-records'
    for folder in (public_dir, built_dir):
        require(folder.is_dir() and not folder.is_symlink(), f'Missing or symlinked media-records directory: {folder}')
        require(all(path.is_file() and not path.is_symlink() for path in folder.iterdir()), f'Unexpected directory/symlink in {folder}')
    require({path.name for path in public_dir.iterdir()} == expected_names, 'Public media sidecar inventory contains missing or stale files.')
    built_names = {path.name for path in built_dir.iterdir()}
    gzip_names = {f'{name}.gz' for name in expected_names}
    require(built_names in (expected_names, expected_names | gzip_names), 'Built media sidecar inventory contains missing, partial gzip or stale files.')
    files = []
    for subject in subjects:
        name = f"{subject['id']}.json"
        public_file, built_file = public_dir / name, built_dir / name
        content = public_file.read_bytes()
        require(content == built_file.read_bytes(), f'Stale built media sidecar: {name}')
        compressed = built_dir / f'{name}.gz'
        if compressed.exists():
            require(gzip.decompress(compressed.read_bytes()) == content, f'Stale compressed media sidecar: {name}')
        payload = json.loads(content)
        require(isinstance(payload, dict) and set(payload) == {'subject', 'revision', 'media'}, f'Malformed media envelope: {name}')
        require(payload['subject'] == subject['id'] and payload['revision'] == revision, f'Media subject/revision mismatch: {name}')
        require(isinstance(payload['media'], list), f'Missing media delta array: {name}')
        ids = [row.get('id') if isinstance(row, dict) else None for row in payload['media']]
        require(all(isinstance(id, str) and id for id in ids), f'Invalid media delta ID: {name}')
        require(len(ids) == len(set(ids)) and len(ids) == len(subject['objectIds']) and set(ids) == set(subject['objectIds']), f'Incomplete/duplicate/extra media IDs: {name}')
        for row in payload['media']:
            require(set(row) <= {'id'} | MEDIA_DETAIL_KEYS, f'Media delta overwrites retained/unknown fields: {name}/{row["id"]}')
            media = full_media.get(row['id'])
            require(media is not None, f'Missing complete media record: {name}/{row["id"]}')
            expected = {'id': row['id'], **{key: value for key, value in media.items() if key in MEDIA_DETAIL_KEYS}}
            require(row == expected, f'Media delta differs from the complete corpus: {name}/{row["id"]}')
        deltas = {row['id']: row for row in payload['media']}
        for summary in index['media']:
            if summary['id'] not in subject['objectIds']:
                continue
            details = {key: value for key, value in deltas[summary['id']].items() if key != 'id'}
            expected_web = {key: value for key, value in full_media[summary['id']].items() if key not in MEDIA_PRINT_ONLY_KEYS}
            require({**summary, **details} == expected_web, f'Media delta fails exact web reconstruction: {name}/{summary["id"]}')
        files.append({'subject': subject['id'], 'path': f'atlas/media-records/{name}', 'sha256': sha(public_file), 'bytes': len(content), 'mediaIds': ids})
    return {'revision': revision, 'subjects': len(subjects), 'records': sum(len(subject['objectIds']) for subject in subjects), 'files': files}


JOURNEY_PRINT_ONLY_KEYS = {
    'familyEvidence', 'leadObject', 'printBreakAfter', 'printSourcesPerPage',
}


def verify_journey_records(public_atlas, built_atlas):
    """Require exact reconstruction of every deferred journey before packaging."""
    corpus = json.loads((public_atlas / 'corpus.json').read_text())
    index = json.loads((public_atlas / 'index.json').read_text())
    require(index.get('journeyDetailsDeferred') is True, 'Journey reading is not explicitly deferred.')
    require([j['id'] for j in index['journeys']] == [j['id'] for j in corpus['journeys']], 'Journey bootstrap IDs/order differ.')
    names = {f"{j['id']}.json" for j in corpus['journeys']}
    require(len(names) == len(corpus['journeys']), 'Duplicate journey IDs.')
    public_dir, built_dir = public_atlas / 'journey-records', built_atlas / 'journey-records'
    for folder in (public_dir, built_dir):
        require(folder.is_dir() and not folder.is_symlink(), f'Missing or symlinked journey-records directory: {folder}')
        require(all(p.is_file() and not p.is_symlink() for p in folder.iterdir()), f'Unexpected journey directory/symlink: {folder}')
    require({p.name for p in public_dir.iterdir()} == names, 'Missing/stale public journey records.')
    require({p.name for p in built_dir.iterdir()} in (names, names | {f'{name}.gz' for name in names}), 'Missing/partial/stale built journey records.')
    files = []
    for full, summary in zip(corpus['journeys'], index['journeys']):
        name = full['id'] + '.json'
        source, built = public_dir / name, built_dir / name
        raw = source.read_bytes()
        require(built.read_bytes() == raw, f'Stale built journey: {name}')
        compressed = built_dir / f'{name}.gz'
        if compressed.exists():
            require(gzip.decompress(compressed.read_bytes()) == raw, f'Stale gzip journey: {name}')
        record = json.loads(raw)
        require(set(record) == {'journey', 'revision', 'stops', 'conclusion', 'evidence'}, f'Unknown/missing journey delta keys: {name}')
        require(record['journey'] == full['id'], f'Wrong journey identity: {name}')
        revision = summary.get('detailsRevision')
        require(isinstance(revision, str) and re.fullmatch(r'[0-9a-f]{64}', revision), f'Invalid journey revision: {name}')
        require(record['revision'] == revision, f'Stale journey revision: {name}')
        require(record['stops'] == [{'index': i, 'narrative': stop['narrative']} for i, stop in enumerate(full['stops'])], f'Journey narratives differ: {name}')
        require(record['conclusion'] == full['conclusion'], f'Journey conclusion differs: {name}')
        require(record['evidence'] == {k: full['evidence'][k] for k in ('prompt', 'options')}, f'Journey question differs: {name}')
        web = {k: v for k, v in full.items() if k not in JOURNEY_PRINT_ONLY_KEYS}
        expected = {k: v for k, v in web.items() if k not in ('conclusion', 'stops', 'evidence')}
        expected['stops'] = [{k: v for k, v in stop.items() if k != 'narrative'} for stop in full['stops']]
        expected['evidence'] = {'citations': full['evidence']['citations']}
        expected['detailsRevision'] = revision
        require(summary == expected, f'Journey bootstrap overwrites or loses retained metadata: {name}')
        retained = {k: v for k, v in summary.items() if k != 'detailsRevision'}
        reading = {k: record[k] for k in ('stops', 'conclusion', 'evidence')}
        recomputed = hashlib.sha256(json.dumps({'summary': retained, 'reading': reading}, ensure_ascii=False, separators=(',', ':')).encode('utf-8')).hexdigest()
        require(recomputed == revision, f'Journey revision does not cover retained metadata and reading: {name}')
        restored = {k: v for k, v in summary.items() if k != 'detailsRevision'}
        restored['stops'] = [{**stop, 'narrative': record['stops'][i]['narrative']} for i, stop in enumerate(summary['stops'])]
        restored['conclusion'] = record['conclusion']
        restored['evidence'] = {**summary['evidence'], **record['evidence']}
        require(restored == web, f'Journey fails exact web reconstruction: {name}')
        files.append({'journey': full['id'], 'revision': revision, 'path': f'atlas/journey-records/{name}', 'sha256': sha(source), 'bytes': len(raw)})
    return {'journeys': len(files), 'files': files}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--receipt', type=Path, required=True)
    parser.add_argument('--destination', type=Path, required=True)
    args = parser.parse_args()
    receipt = args.receipt.resolve()
    destination = args.destination.resolve()
    archive = destination.with_suffix('.zip')
    require(destination.is_relative_to(ROOT / 'output'), 'Destination must be under this repository output/.')
    require(not destination.exists() and not archive.exists(), 'Destination or ZIP already exists; choose a fresh name.')
    state = json.loads((receipt / 'SOURCE_STATE.json').read_text())
    head = git('rev-parse', 'HEAD')
    require(state['completionCommit'] == head, 'Receipt does not identify current HEAD.')
    require(not git('status', '--porcelain', '--untracked-files=no'), 'Tracked source must be committed before packaging.')
    suite = json.loads((receipt / 'browser/suite.json').read_text())
    require(suite['result'] == 'pass', 'Candidate browser suite is not sealed as passing.')
    require(suite['indexSHA256'] == sha(ROOT / 'dist/index.html'), 'Built HTML differs from the checked candidate.')
    require(suite['corpusSHA256'] == sha(ROOT / 'dist/atlas/corpus.json'), 'Built corpus differs from the checked candidate.')
    require({str(p.relative_to(ROOT)) for p in (ROOT / 'dist').rglob('*') if p.is_file()} == {entry['path'] for entry in state['builtFiles']}, 'Built file inventory differs from the sealed candidate.')
    for entry in state['builtFiles']:
        require(sha(ROOT / entry['path']) == entry['sha256'], f"Changed build: {entry['path']}")
    for entry in state['evidence']:
        require(sha(receipt / entry['path']) == entry['sha256'], f"Changed evidence: {entry['path']}")
    for name in ['corpus.json', 'index.json', 'search.json', 'source-scopes.json', 'contexts.json']:
        require((ROOT / 'public/atlas' / name).read_bytes() == (ROOT / 'dist/atlas' / name).read_bytes(), f'Stale built data: {name}')
    media_sidecars = verify_media_sidecars(ROOT / 'public/atlas', ROOT / 'dist/atlas')
    journey_records = verify_journey_records(ROOT / 'public/atlas', ROOT / 'dist/atlas')
    pdfs = json.loads((receipt / 'print-review/pdf-verification.json').read_text())
    require(len(pdfs) == state['verifiedPDFs'], 'PDF inventory differs from the sealed receipt.')
    require(sum(p['pages'] for p in pdfs) == state['verifiedPDFPages'], 'PDF page count differs from the sealed receipt.')
    require(len({Path(p['file']).name for p in pdfs}) == len(pdfs), 'PDF filenames must be unique.')
    for pdf in pdfs:
        require(sha(receipt / pdf['file']) == pdf['sha256'], f"Changed PDF: {pdf['file']}")
    manifests = ROOT / 'output/redesign/manifests'
    summary = json.loads((manifests / 'release-corpus-summary.json').read_text())
    require(summary['corpusSha256'] == suite['corpusSHA256'], 'Current manifests do not match the candidate corpus.')

    destination.mkdir(parents=True)
    site = destination / 'site'
    site.mkdir()
    for name in ['index.html', 'assets', 'atlas']:
        original = ROOT / 'dist' / name
        require(not original.is_symlink(), f'Symlink is not a portable build input: {original}')
        if original.is_dir():
            require(not any(p.is_symlink() for p in original.rglob('*')), f'Symlink inside build: {original}')
            shutil.copytree(original, site / name)
        else:
            shutil.copy2(original, site / name)
    for pdf in pdfs:
        shutil.copy2(receipt / pdf['file'], site / 'atlas/exports' / Path(pdf['file']).name)
    for path in list(site.rglob('*')):
        if path.is_file() and path.suffix in ['.js', '.css', '.json', '.html', '.svg']:
            Path(str(path) + '.gz').write_bytes(gzip.compress(path.read_bytes(), compresslevel=9, mtime=0))
    shutil.copy2(ROOT / 'scripts/redesign/serve.py', destination / 'launch.py')
    shutil.copytree(manifests, destination / 'manifests')
    verification = destination / 'verification'
    verification.mkdir()
    shutil.copy2(receipt / 'SOURCE_STATE.json', verification / 'CANDIDATE_SOURCE_STATE.json')
    for entry in state['evidence']:
        target = verification / entry['path']
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(receipt / entry['path'], target)
    source = destination / 'source'
    source.mkdir()
    source_zip = source / 'source-checkpoint.zip'
    subprocess.run(['git', 'archive', '--format=zip', f'--output={source_zip}', head], cwd=ROOT, check=True)
    tracked = [name for name in subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', '-z', head], cwd=ROOT).decode().split('\0') if name]
    with zipfile.ZipFile(source_zip) as zipped:
        for name in tracked:
            expected = subprocess.check_output(['git', 'show', f'{head}:{name}'], cwd=ROOT)
            require(zipped.read(name) == expected, f'Archived source bytes differ: {name}')

    licenses = destination / 'LICENSES'
    licenses.mkdir()
    lock = json.loads((ROOT / 'package-lock.json').read_text())
    missing = []
    for name, info in lock['packages'].items():
        if not name or info.get('dev'):
            continue
        module = ROOT / name
        license_files = [p for p in module.iterdir() if p.is_file() and p.name.lower().startswith(('license', 'licence', 'copying'))]
        target = licenses / 'dependencies' / name.removeprefix('node_modules/')
        target.mkdir(parents=True, exist_ok=True)
        for path in license_files:
            shutil.copy2(path, target / path.name)
        if not license_files:
            missing.append({'package': name, 'declaredLicense': info.get('license')})
    require(not missing, f'Production dependency license text missing: {missing}')
    corpus = json.loads((site / 'atlas/corpus.json').read_text())
    expanded = sum(bool(s.get('deeperReading') and s.get('evidenceReading')) for s in corpus['subjects'])
    imageless = sum(not s['objectIds'] for s in corpus['subjects'])
    write_json(licenses / 'MEDIA.json', [{**m, 'sourceRecord': next(s for s in corpus['sources'] if s['id'] == m['source'])} for m in corpus['media']])
    (licenses / 'README.txt').write_text('Media rights and attribution are item-specific in MEDIA.json and the atlas captions. This includes original explanatory diagrams, contemporary photographs and historical reproductions with distinct dates and rights. Coastline: Natural Earth via world-atlas, public domain, as recorded in the project. Dependency license texts are retained separately. No research PDFs or private notebook data are included. Source-checkpoint.zip contains only committed repository files, excluding local-only references, output and prior portable archives.\n')
    write_json(destination / 'SOURCE_STATE.json', {
        'commit': head, 'branch': git('branch', '--show-current'),
        'candidateReceiptSHA256': sha(receipt / 'SOURCE_STATE.json'),
        'corpusSHA256': suite['corpusSHA256'], 'sourceArchiveSHA256': sha(source_zip),
        'mediaRevision': media_sidecars['revision'], 'mediaSidecars': media_sidecars['subjects'],
        'journeyRecords': journey_records['journeys'],
        'verifiedSourceFiles': len(tracked), 'pdfs': len(pdfs),
        'pdfPages': sum(p['pages'] for p in pdfs), 'scope': 'Local only; no push, publication or deployment.',
    })
    pdf_list = '\n'.join(f"- {Path(p['file']).name}: {p['pages']} pages" for p in pdfs)
    (destination / 'README.md').write_text(f'''# Chronos local candidate

Source checkpoint: `{head}`. This is a local review candidate, not a published or independently accepted atlas.

Run `python3 launch.py` from this folder, then open http://127.0.0.1:4174/. Use `--port 4175` if needed. The server binds only to 127.0.0.1. Python 3 is the only runtime needed to view the site; do not open index.html directly.

The site contains {len(corpus['subjects'])} dossiers, {len(corpus['sources'])} sources, {len(corpus['media'])} media records and {len(corpus['journeys'])} journeys. Essential reading, source consultation scopes, maps, media, search and notebook work locally. Original external sources and licence pages require internet. Notebook data stays in browser storage for this origin; export/import JSON to preserve it or transfer between ports/devices. First answers, saved revisions and source context are retained. Session drafts and undo history do not survive reload.

The numbered A3 poster has a Letter companion with the exact date qualifications, regional explanations and source notes. Print at actual size. PDF tags are not a PDF/UA claim. The verified PDFs are in `site/atlas/exports/`:

{pdf_list}

Build assets are in `site/`, complete committed source is in `source/source-checkpoint.zip`, and current candidate evidence is in `verification/`. Source scopes, media rights and all legacy dispositions are in `manifests/`. No raw research PDFs, local-only reference folder, earlier ZIPs or private user notebook are included.

`SHA256SUMS.json` covers every packaged file except that checksum manifest itself. The archive is byte-checked after a fresh extraction, and browser smoke runs with external requests blocked. The final archive hash and that extraction report are recorded beside the ZIP in its archive receipt. Earlier dated packages are preserved.

{expanded} dossiers have expanded reading layers; {len(corpus['subjects']) - expanded} have not been comprehensively deepened and {imageless} lack media. Broader reference coverage, remaining content and learning work, full chapter-reader redesign and independent/human acceptance remain. No historian approval, real family/adult session, human screen-reader pass, physical-device test or physical-print test is claimed. Nothing was pushed, deployed or published.
''')
    checks = {str(p.relative_to(destination)): sha(p) for p in sorted(destination.rglob('*')) if p.is_file()}
    write_json(destination / 'SHA256SUMS.json', checks)
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipped:
        for path in sorted(destination.rglob('*')):
            if path.is_file():
                zipped.write(path, path.relative_to(destination.parent))
    report = destination.parent / f'{destination.name}-archive-receipt.json'
    smoke_report = destination.parent / f'{destination.name}-offline-smoke.json'
    with tempfile.TemporaryDirectory(prefix='fresh-extraction-', dir=destination.parent) as temporary:
        with zipfile.ZipFile(archive) as zipped:
            expected_names = {f'{destination.name}/{name}' for name in checks} | {f'{destination.name}/SHA256SUMS.json'}
            require(set(zipped.namelist()) == expected_names, 'Archive file inventory differs from the package.')
            for name in expected_names:
                require(not Path(name).is_absolute() and '..' not in Path(name).parts, 'Unsafe archive path.')
                path = destination.parent / name
                require(hashlib.sha256(zipped.read(name)).hexdigest() == sha(path), f'Changed archive bytes: {name}')
            zipped.extractall(temporary)
        extracted = Path(temporary) / destination.name
        require(sha(extracted / 'SHA256SUMS.json') == sha(destination / 'SHA256SUMS.json'), 'Changed extracted checksum manifest.')
        for name, digest in checks.items():
            require(sha(extracted / name) == digest, f'Changed extracted bytes: {name}')
        launch = subprocess.Popen([sys.executable, 'launch.py', '--port', '0'], cwd=extracted, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            message = launch.stdout.readline().strip()
            require('http://127.0.0.1:' in message, f'Portable server did not start: {message}')
            origin = message.split('http://', 1)[1].split(' ', 1)[0]
            subprocess.run(['node', str(ROOT / 'scripts/redesign/portable-candidate-checks.mjs'), str(extracted), f'http://{origin}', str(smoke_report)], cwd=ROOT, check=True, timeout=240)
        finally:
            launch.terminate()
            launch.wait(timeout=10)
    write_json(report, {'result': 'pass', 'commit': head, 'archive': str(archive.relative_to(ROOT)), 'bytes': archive.stat().st_size, 'sha256': sha(archive), 'filesVerifiedInZIPAndFreshExtraction': len(checks) + 1, 'sourceArchiveFilesVerifiedAgainstCommit': len(tracked), 'allPDFBytesVerified': len(pdfs), 'pdfPages': sum(p['pages'] for p in pdfs), 'corpusSHA256': suite['corpusSHA256'], 'offlineSmoke': smoke_report.name, 'offlineSmokeSHA256': sha(smoke_report), 'noPushDeploymentOrPublication': True})
    print(report.read_text())


if __name__ == '__main__':
    main()
