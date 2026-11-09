"""Stage a hash-bound local release review packet. Never deploy or modify inputs.

Run through agent-heavy-run. The supplied verification directory must contain a
passing verification.json and isolated/receipt.json with the exact buildFiles.
Only the explicitly selected documents/receipts below are copied, outside site/.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import zipfile

ROOT = Path(__file__).resolve().parents[2]
DOCS = [
    'docs/redesign/CURRENT-STATE.json',
    'docs/redesign/COMPLETION-PLAN-2026-11-04.md',
    'docs/redesign/COMPLETION-TRACKER-2026-11-04.json',
    'docs/redesign/IMPLEMENTATION-2026-11-04.md',
    'docs/redesign/STATUS.md',
    'docs/redesign/MAINTENANCE.md',
    'docs/redesign/VERCEL-HOSTING-2026-11-01.md',
    'docs/redesign/review/MEDIA-RIGHTS-FIDELITY-2026-11-04.md',
    'docs/redesign/review/ROLLBACK-REHEARSAL-2026-11-05.md',
    'docs/redesign/review/ROLLBACK-REHEARSAL-2026-11-05.json',
    'docs/redesign/review/ACCESSIBILITY-MATRIX.md',
    'docs/redesign/review/ACCESSIBILITY-BROWSER-2026-11-05.json',
    'docs/redesign/review/READER-PROTOCOL.md',
    'docs/redesign/review/GLOSSARY-CONTEXT-2026-11-05.md',
    'docs/redesign/review/GLOSSARY-CONTEXT-2026-11-05.json',
    'docs/redesign/review/GEOGRAPHIC-SEMANTICS-2026-11-05.json',
    'docs/redesign/REMAINING-WORK-2026-11-05.md',
    'docs/redesign/review/PRINT-SUBSTANCE-2026-11-05.md',
    'docs/redesign/review/PRINT-SUBSTANCE-2026-11-05.json',
    'docs/redesign/review/GZIP-PERFORMANCE-2026-11-06.md',
    'docs/redesign/review/GZIP-PERFORMANCE-2026-11-06.json',
]
HUMAN_DIR = 'docs/redesign/review/human-2026-11-05'
HUMAN_FILES = [
    'README.md', 'manifest.json', 'historical-dossiers.json', 'glossary.json',
    'historical-snapshots.json', 'regional-readings.json', 'regional-sources.json',
    'final-reader-slots.json', 'device-slots.json', 'physical-print-slots.json',
    'finding-template.json',
]
RECEIPTS = [
    'verification.json', 'isolated/receipt.json', 'isolated/parity.json',
    'artifact-parity.json', 'navigation-final.json', 'performance/receipt.json',
    'print-impact/receipt.json', 'print/installation.json',
    'print/short-repair-validation.json', 'print/short-text-parity.json',
    'print/render-coverage.json', 'print/representative-pages.json',
    'print/logical-reader-contract.json', 'print/title-repair.json',
    'print/figure-structure.json', 'print/receipt.json',
    'print/logical-short-contract.json', 'print/structure-audit.json',
    'performance/encoding-readback.json', 'performance/gzip-limitations.json',
    'portable.json', 'portable-browser.json',
    'baseline/performance/performance.json', 'candidate/performance/performance.json',
    'confirmation/performance/performance.json',
    'search-isolated/performance/performance.json', 'final-gzip/performance/performance.json',
    'selection-diagnostic/performance/performance.json', 'search-ranking-parity.json',
    'prepared-search-diagnostic/performance/performance.json',
    'notebook-diagnostic/performance/performance.json',
    'dialog-layout-diagnostic/performance/performance.json',
    'metadata-priority-diagnostic/performance/performance.json',
]
RECEIPTS += [f'final-navigation/{engine}.json' for engine in ('chromium', 'firefox', 'webkit')]
RECEIPTS += [f'final-world-loading/world-loading-{engine}.json' for engine in ('chromium', 'firefox', 'webkit')]
RECEIPTS += [f'final-accessibility/matrix-{engine}.json' for engine in ('chromium', 'firefox', 'webkit')]
RECEIPTS += [f'final-loading/world-loading-{engine}.json' for engine in ('chromium', 'firefox', 'webkit')]
RECEIPTS += ['webkit-abort-fixed/world-loading-webkit.json']
STATIC_EXTENSIONS = {'.html', '.js', '.css', '.json', '.webp', '.jpg', '.jpeg',
                     '.png', '.svg', '.woff', '.woff2', '.pdf', '.ico'}
PRIVATE_NAMES = {'.git', '.vercel', '.aws', '.ssh', 'node_modules', 'local-only',
                 'credentials', 'credentials.json', 'storage-state.json',
                 'storagestate.json', 'auth.json', 'notebook-export.json',
                 'chronos-household-notebook.json'}
CONFIG_SHA256 = '799e69301860a2865debcdeade416fa6392d8e8072122a20ece585210c0b5cdf'
TARGET = {
    'evidenceDate': '2026-11-01',
    'projectId': 'prj_e6nwbdOKc3Ciq4HXokjwdFOcn6Zj',
    'teamId': 'team_oDhato3M2cyAoAkiuDGbD2wl',
    'projectName': 'chronos-atlas',
    'previousDeploymentId': 'dpl_4wTFc4yAWPs4358p1v45mLed8rUJ',
    'previousImmutableURL': 'https://chronos-atlas-apluj6tyw-kevin-s-projects-082f3ccb.vercel.app/',
    'historicalAlias': 'https://chronos-atlas-five.vercel.app/',
    'accessPolicy': 'Preserve Vercel sign-in protection. Local config does not enforce provider access policy.',
    'providerState': 'Archived evidence only; fresh project, team, deployment, protection and served-asset verification required upon explicit deployment approval.',
    'automaticRollbackSafe': False,
    'rollbackLimitation': 'November 1 restores two unresolved-rights Partition scans and older notebook safeguards. Do not select it automatically.',
    'earlierForwardOption': {
        'archive': 'output/completion-2026-11-04/portable/chronos-review-e5ad905147d2.zip',
        'sha256': '836c6ddf07ef4f0d45df2d76b418b9f77015bf120c99f80b68f6ea56fe2a47fc',
        'artifactIdentity': 'e5ad905147d278e1da81d70c2074220a041afeb08acf595fd834d3eb8563f7f3',
        'status': 'Earlier verified local restoration option, not previously deployed or accepted; not substituted for this packet.',
    },
}


def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def relative_path(name):
    value = PurePosixPath(name)
    if not name or '\\' in name or value.is_absolute() or '..' in value.parts:
        raise ValueError('Unsafe relative path: ' + name)
    if any(p.startswith('.') or p.lower() in PRIVATE_NAMES or p.lower().startswith('.env')
           for p in value.parts):
        raise ValueError('Private input path: ' + name)
    return Path(*value.parts)


def safe_file(path, base):
    relative = path.relative_to(base)
    relative_path(relative.as_posix())
    cursor = base
    if base.is_symlink():
        raise ValueError('Symlink input root: ' + str(base))
    for component in relative.parts:
        cursor = cursor / component
        if cursor.is_symlink():
            raise ValueError('Symlink input: ' + str(cursor))
    if not stat.S_ISREG(path.stat().st_mode):
        raise ValueError('Not a regular input file: ' + str(path))


def check_payload(path):
    if path.suffix.lower() not in {'.json', '.md', '.txt', '.js', '.html'}:
        return
    text = path.read_text(encoding='utf-8')
    if re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-proj-|sk-ant-api)[A-Za-z0-9_-]{16,}|\bAKIA[A-Z0-9]{16}\b', text):
        raise ValueError('Potential credential material: ' + str(path))
    if path.suffix == '.json':
        value = json.loads(text)
        if isinstance(value, dict) and (
            value.get('version') == 1 and isinstance(value.get('notes'), list)
            or 'cookies' in value and 'origins' in value
        ):
            raise ValueError('Notebook contents or browser authentication state: ' + str(path))


def static_files(build):
    files = {}
    skipped = []
    for path in sorted(build.rglob('*')):
        if path.is_symlink():
            raise ValueError('Symlink build input: ' + str(path))
        rel = path.relative_to(build)
        relative_path(rel.as_posix())
        if path.is_dir():
            continue
        safe_file(path, build)
        original = path.with_suffix('') if path.suffix in {'.gz', '.br'} else path
        name = original.relative_to(build)
        if (len(name.parts) == 1 and name.name not in {'index.html', 'watermark.svg', 'favicon.ico'}
                or len(name.parts) > 1 and name.parts[0] not in {'assets', 'atlas'}
                or original.suffix.lower() not in STATIC_EXTENSIONS):
            raise ValueError('Not an allowed static site input: ' + str(rel))
        if path.suffix in {'.gz', '.br'}:
            safe_file(original, build)
            skipped.append(rel.as_posix())
            continue
        check_payload(path)
        files[rel.as_posix()] = digest(path)
    for required in ['index.html', 'atlas/corpus.json']:
        if required not in files:
            raise ValueError('Missing required build file: ' + required)
    return files, skipped


def load_json(path):
    return json.loads(path.read_text())


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def verify_packet(destination, expected_site):
    """Recheck every staged byte; reject extra files and verify ZIP readback."""
    manifest = load_json(destination / 'SHA256SUMS.json')
    actual = set()
    for path in destination.rglob('*'):
        if path.is_symlink():
            raise ValueError('Symlink in review packet')
        if path.is_file() and path != destination / 'SHA256SUMS.json':
            safe_file(path, destination)
            rel = path.relative_to(destination).as_posix()
            actual.add(rel)
            if digest(path) != manifest.get(rel):
                raise ValueError('Staged hash mismatch: ' + rel)
    if actual != set(manifest):
        raise ValueError('Packet inventory mismatch')
    for rel, checksum in expected_site.items():
        if manifest.get('site/' + rel) != checksum:
            raise ValueError('Staged site differs from supplied build: ' + rel)
    if {name[5:] for name in manifest if name.startswith('site/')} != set(expected_site):
        raise ValueError('Unexpected staged site bytes')
    archive = destination.with_name(destination.name + '.zip')
    expected = {destination.name + '/' + name: value for name, value in manifest.items()}
    expected[destination.name + '/SHA256SUMS.json'] = digest(destination / 'SHA256SUMS.json')
    with zipfile.ZipFile(archive) as zipped:
        if set(zipped.namelist()) != set(expected) or len(zipped.namelist()) != len(expected):
            raise ValueError('Archive inventory mismatch')
        for name, checksum in expected.items():
            if hashlib.sha256(zipped.read(name)).hexdigest() != checksum:
                raise ValueError('Archive byte mismatch: ' + name)
    return {'filesVerified': len(manifest), 'archiveSHA256': digest(archive),
            'archiveBytes': archive.stat().st_size}


def prepare(build, verification, destination, repo=ROOT):
    for folder in [build, verification, repo]:
        if folder.is_symlink() or not folder.is_dir():
            raise ValueError('Require a real input directory: ' + str(folder))
    build, verification, repo = build.resolve(), verification.resolve(), repo.resolve()
    if destination.is_symlink() or destination.exists():
        raise ValueError('Refusing to overwrite output: ' + str(destination))
    destination = destination.absolute()
    if destination.parent.is_symlink():
        raise ValueError('Symlink output parent')
    destination = destination.resolve()
    archive = destination.with_name(destination.name + '.zip')
    receipt_path = destination.with_name(destination.name + '-receipt.json')
    if archive.exists() or receipt_path.exists():
        raise ValueError('Refusing to overwrite archive or receipt')
    if destination.is_relative_to(build) or destination.is_relative_to(verification):
        raise ValueError('Output must be outside build and verification inputs')
    files, skipped = static_files(build)
    selected = []
    for name in DOCS + [HUMAN_DIR + '/' + name for name in HUMAN_FILES]:
        selected.append((repo / name, repo, 'review/' + name))
    for name in RECEIPTS:
        source = verification / name
        if source.exists() or name in {'verification.json', 'isolated/receipt.json'}:
            selected.append((source, verification, 'verification/' + name))
    config = repo / 'output/vercel-living-timeline-2026-11-01/site/vercel.json'
    selected.append((config, repo, 'site/vercel.json'))
    # Preflight every selected path before creating output. No recursive evidence copy.
    input_hashes = {}
    for source, base, _ in selected:
        safe_file(source, base)
        check_payload(source)
        input_hashes[source] = digest(source)
    final = load_json(verification / 'verification.json')
    isolated = load_json(verification / 'isolated/receipt.json')
    if final.get('status') not in {'pass', 'passed', 'passed_local_scope'} or isolated.get('status') != 'pass':
        raise ValueError('Final verification and isolated receipt must pass')
    if not isolated.get('steps') or any(step.get('exitCode') != 0 for step in isolated['steps']):
        raise ValueError('Isolated verification steps are absent or failed')
    if isolated.get('dependencyMode') not in {'npm ci', 'npm ci --offline'}:
        raise ValueError('A locked dependency installation is required for the final isolated build')
    if not {'build', 'current-atlas-gate'}.issubset({step.get('name') for step in isolated['steps']}):
        raise ValueError('Missing isolated build or atlas validation step')
    expected = {}
    for row in isolated['buildFiles']:
        name = relative_path(row['path']).as_posix()
        if name.endswith(('.gz', '.br')):
            continue
        if name in expected:
            raise ValueError('Duplicate verified build path: ' + name)
        expected[name] = row['sha256']
    if expected != files:
        raise ValueError('Supplied static build does not exactly match isolated buildFiles')
    corpus_sha = files['atlas/corpus.json']
    inventory = load_json(repo / DOCS[0])
    human = load_json(repo / HUMAN_DIR / 'manifest.json')
    if any(x.get('corpusSHA256') != corpus_sha for x in [final, inventory, human]):
        raise ValueError('Final verification, current inventory or human packet is stale for this corpus')
    if final.get('mainSHA256') and final['mainSHA256'] not in files.values():
        raise ValueError('Final main script hash is absent from supplied build')
    source_files = isolated.get('sourceFiles')
    if not source_files:
        raise ValueError('Missing isolated release-source manifest')
    for row in source_files:
        source_path = PurePosixPath(row['path'])
        if source_path.name == '.gitkeep':
            # An empty directory marker is inventory metadata, never a copied input.
            relative_path(str(source_path.parent / 'placeholder'))
            if row.get('bytes') != 0 or row['sha256'] != hashlib.sha256(b'').hexdigest():
                raise ValueError('Nonempty directory marker in source manifest')
        elif row['path'] not in {'.gitignore', '.prettierignore', '.prettierrc.json'}:
            relative_path(row['path'])
    # Exact historical configuration, with no build commands or provider credentials.
    config_value = load_json(config)
    if config_value != {'$schema': 'https://openapi.vercel.sh/vercel.json', 'framework': None,
                        'buildCommand': '', 'installCommand': '', 'outputDirectory': '.'}:
        raise ValueError('Unexpected November 1 static hosting configuration')
    config_hash = digest(config)
    if config_hash != CONFIG_SHA256:
        raise ValueError('Static configuration bytes differ from archived November 1 config')
    site_files = {**files, 'vercel.json': config_hash}
    identity = hashlib.sha256(json.dumps(site_files, sort_keys=True).encode()).hexdigest()
    destination.mkdir(parents=True, exist_ok=False)
    for name, checksum in files.items():
        target = destination / 'site' / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(build / name, target)
        if digest(target) != checksum:
            raise ValueError('Build changed during staging: ' + name)
    copied = []
    for source, base, relative in selected:
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        before = input_hashes[source]
        shutil.copyfile(source, target)
        if digest(source) != before or digest(target) != before:
            raise ValueError('Review input changed during staging: ' + str(source))
        copied.append({'source': str(source.relative_to(base)), 'packetPath': relative, 'sha256': before})
    if static_files(build)[0] != files:
        raise ValueError('Build changed during final copy verification')
    if any(digest(path) != checksum for path, checksum in input_hashes.items()):
        raise ValueError('Review inputs changed during final copy verification')
    write_json(destination / 'RELEASE-SOURCE-MANIFEST.json', {
        'source': 'supplied isolated/receipt.json', 'sourceFiles': source_files,
        'buildFiles': expected, 'identityNote': 'Hashes identify isolated inputs; current Git commit alone is not this build.',
    })
    write_json(destination / 'TARGET-EVIDENCE.json', TARGET)
    tracker = load_json(repo / 'docs/redesign/COMPLETION-TRACKER-2026-11-04.json')
    write_json(destination / 'OPEN-SCOPES.json', {
        'tasks': [{k: task[k] for k in ['id', 'status', 'description', 'acceptance_result'] if k in task}
                  for task in tracker['tasks'] if task.get('status') not in {'accepted', 'removed_by_owner'}],
        'humanPacketStatus': human.get('status'), 'limits': final.get('limits', []),
        'note': 'Task labels copied from the tracker; no review decisions are inferred from this packet.',
    })
    write_json(destination / 'STAGING.json', {
        'status': 'local_release_review_only_not_approved_or_deployed',
        'preparedAt': datetime.now(timezone.utc).isoformat(), 'artifactIdentity': identity,
        'buildRoot': str(build), 'verificationDirectory': str(verification),
        'staticFiles': site_files, 'excludedCompressionSidecars': skipped,
        'copiedReviewInputs': copied, 'corpusSHA256': corpus_sha,
        'generatorSHA256': digest(Path(__file__)),
        'inputPolicy': 'Only verified static bytes, exact historical static config, and explicit review document/receipt allowlists; no .vercel linkage, credentials, private research, browser storage or notebook exports.',
    })
    (destination / 'RELEASE-NOTES.md').write_text(
        '# Chronos local release review packet\n\n'
        'This is a reviewable staged candidate, not approval, acceptance or deployment.\n\n'
        f'Artifact identity: `{identity}`. Corpus SHA-256: `{corpus_sha}`.\n\n'
        'The supplied isolated build passed exact static-file parity. All provided PDFs, media, fonts, data and application files are copied without regeneration or content alteration; gzip/Brotli preview sidecars are excluded. '
        'Only `site/` is a possible future static hosting input. Review documents, source hashes, target evidence and verification receipts stay outside it.\n\n'
        'To review locally, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory site` from this packet and open http://127.0.0.1:8000. Workspace references beginning `public/atlas/` correspond to this packet’s `site/atlas/`. External source websites require internet access.\n\n'
        'Current inventory: ' + json.dumps(inventory.get('inventory', {}), sort_keys=True) + '.\n\n'
        'Review copied STATUS/IMPLEMENTATION, media qualifications, the full tracker, OPEN-SCOPES.json and the human packet for known limitations and unfinished historical, reader, device, assistive-technology and physical-print scopes. Prepared slots are not observations or acceptance.\n\n'
        'Vercel sign-in protection must remain enabled. Fresh provider identity, protection and served-asset verification is required after explicit approval; this packet has no deployment command or credentials.\n\n'
        'The November 1 target is historical evidence and is unsuitable for automatic rollback: it restores unresolved-rights Partition scans and older notebook safeguards. TARGET-EVIDENCE.json names the earlier verified e5ad local forward-restoration package separately; it is not an accepted or deployed fallback.\n\n'
        'Export saved notebooks before any authorized origin or release change. Unsaved drafts are not notebook exports. See the copied rollback rehearsal for the demonstrated version 1 recovery path.\n')
    manifest = {p.relative_to(destination).as_posix(): digest(p)
                for p in sorted(destination.rglob('*')) if p.is_file()}
    write_json(destination / 'SHA256SUMS.json', manifest)
    with zipfile.ZipFile(archive, 'x', zipfile.ZIP_DEFLATED) as zipped:
        for path in sorted(destination.rglob('*')):
            if path.is_file():
                zipped.write(path, (Path(destination.name) / path.relative_to(destination)).as_posix())
    result = verify_packet(destination, site_files)
    receipt = {'status': 'passed_local_staging_only', 'output': str(destination),
               'archive': str(archive), 'artifactIdentity': identity,
               'siteFiles': len(site_files), 'verifiedInputFiles': len(files),
               'excludedCompressionSidecars': len(skipped), **result,
               'deploymentPerformed': False, 'humanAcceptanceInferred': False}
    write_json(receipt_path, receipt)
    return receipt


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-root', type=Path, required=True)
    parser.add_argument('--verification-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(prepare(args.build_root, args.verification_dir, args.output), indent=2))
