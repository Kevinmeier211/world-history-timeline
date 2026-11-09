"""Package only the finished static atlas and inspectable release evidence."""
import pathlib,shutil,json,hashlib,subprocess,zipfile
root=pathlib.Path('.').resolve();dest=root/'output/redesign/release/chronos-local-rc'
if dest.exists():shutil.rmtree(dest)
dest.mkdir(parents=True)
site=dest/'site';site.mkdir()
for name in ['index.html','index.html.gz','assets','atlas']:
 p=root/'dist'/name
 if p.is_dir():shutil.copytree(p,site/name)
 elif p.exists():shutil.copy2(p,site/name)
shutil.copy2(root/'scripts/redesign/serve.py',dest/'launch.py')
shutil.copytree(root/'output/redesign/manifests',dest/'manifests')
verification=dest/'verification';verification.mkdir()
for name in ['browser-results.json','performance.json','reading-sequence.txt','media-decoding.json']:
 shutil.copy2(root/'output/redesign/final'/name,verification/name)
smoke=root/'output/redesign/release/package-smoke.json'
if smoke.exists():shutil.copy2(smoke,verification/'package-smoke.json')
shutil.copytree(root/'output/redesign/final/screens',verification/'screens')
followup=root/'output/redesign/followup'
if (followup/'reading-results.json').exists():
 (verification/'followup').mkdir()
 for name in ['reading-results.json','phone-evidence.png']:
  shutil.copy2(followup/name,verification/'followup'/name)
for name in ['full-check.log','full-build.log','final-lint.log','bundle-size.log']:
 shutil.copy2(root/'output/redesign'/name,verification/name)
shutil.copy2(root/'output/redesign/print/pdf-verification.json',verification/'pdf-verification.json')
expansion=root/'output/redesign/expansion'
if (expansion/'browser-results.json').exists():
 e=verification/'expansion';e.mkdir()
 for name in ['browser-results.json','notebook-expansion.json','full-check.log','build.log','final-lint.log','print-export.log','media-process.log','bundle-size.log','performance.log','performance-before-preload.json','release-browser.log','reading.log','media-decoding.log','pdf-verification.log']:
  shutil.copy2(expansion/name,e/name)
 shutil.copytree(expansion/'screens',e/'screens')
 shutil.copy2(expansion/'research/media-receipts.json',e/'media-receipts.json')
 shutil.copytree(expansion/'print-rendered',e/'print-rendered',ignore=shutil.ignore_patterns('*.png'))
northern=root/'output/redesign/northern-expansion'
if (northern/'browser-results.json').exists():
 n=verification/'northern';n.mkdir()
 for name in ['browser-results.json','notebook-expansion.json','full-check.log','build.log','final-lint.log','print-export.log','media-process.log','bundle-size.log','performance.log','release-browser.log','reading.log','media-decoding.log','pdf-verification.log','legacy-shell-isolated.log','full-check-contention.log']:
  shutil.copy2(northern/name,n/name)
 shutil.copytree(northern/'screens',n/'screens')
 shutil.copy2(northern/'research/media-receipts.json',n/'media-receipts.json')
 shutil.copytree(northern/'print-rendered',n/'print-rendered',ignore=shutil.ignore_patterns('*.png'))
woodlands=root/'output/redesign/woodlands-expansion'
if (woodlands/'browser-results.json').exists():
 w=verification/'woodlands';w.mkdir()
 for name in ['browser-results.json','notebook-expansion.json','full-check.log','build.log','final-lint.log','print-export.log','media-process.log','bundle-size.log','performance.log','release-browser.log','reading.log','media-decoding.log','pdf-verification.log','targeted-tests.log','content-build.log','print-overflow-initial.log']:
  shutil.copy2(woodlands/name,w/name)
 shutil.copytree(woodlands/'screens',w/'screens')
 shutil.copy2(woodlands/'research/media-receipts.json',w/'media-receipts.json')
 shutil.copytree(woodlands/'print-rendered',w/'print-rendered',ignore=shutil.ignore_patterns('*.png'))
reports=dest/'reports';reports.mkdir()
for name in ['RELEASE.md','ACCEPTANCE.md','FINAL_SELF_REVIEW.md','CONTENT_COVERAGE.md','TEST_MIGRATION.md','DECISIONS.md','STATUS.md','BASELINE.md','FOLLOWUP-2026-10-27.md','EXPANSION-2026-10-27.md','NORTHERN-EXPANSION-2026-10-27.md','WOODLANDS-EXPANSION-2026-10-27.md']:
 shutil.copy2(root/'docs/redesign'/name,reports/name)
licenses=dest/'LICENSES';licenses.mkdir()
for module in ['react','react-dom','scheduler']:
 shutil.copy2(root/f'node_modules/{module}/LICENSE',licenses/f'{module}-MIT.txt')
for family in ['source-sans-3','source-serif-4']:
 shutil.copy2(root/f'node_modules/@fontsource/{family}/LICENSE',licenses/f'{family}-OFL.txt')
(licenses/'MEDIA.txt').write_text('Individual rights, provenance and credits are in manifests/media.json and asset-checksums.json. Met selections are public domain/Open Access CC0. Selected NPS-credited government photographs and the public-domain 1848 survey reproduction have recorded provenance; this does not imply every image on NPS is unrestricted. Poverty Point Figure 10 is from the corrected 1985 Gibson publication in Project Gutenberg ebook 62948, which identifies it as public domain in the USA; original photographer credit is retained. Library of Congress selections either have no known publication restrictions in their records or are expired U.S. publications (including the c1907 Cahokia print); see each record. Rights statements are jurisdiction-specific. Coastline: Natural Earth via world-atlas, public domain. Historical text: original atlas explanations with consulted references. No research PDFs are redistributed.\n')
with (licenses/'MEDIA.txt').open('a') as f:
 f.write('Northern additions: Met 2019.456.17 has a verified public-domain image; the 1922 Jenness plate is reproduced from a historic Canadian government publication, with full plate/caption retained (expired publication rights in the USA; historic Crown term). The 1921 Government Printing Office title page is explicitly public domain/free to reuse at LOC. The Curtis photograph has expired 1910–11 U.S. publication copyright. UM expressly released the 2005 Head-Smashed-In photograph to public domain worldwide. NPS earthlodge photography and the garden-tool teaching illustration have explicit NPS credits. Reconstructions, publication/exposure dates and limited source resolution are distinguished in captions. Rejected restricted images are not redistributed.\n')
with (licenses/'MEDIA.txt').open('a') as f:
 f.write('Eastern Woodlands additions: NPS-credited floor/exterior photographs are government works with separate ancient/reconstruction dates. Manning and Birch 2022 Figure 2 is CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/), DOI 10.1017/RDC.2022.23; both panels/axes retained, resized and converted to WebP, no content alteration. Full authorship, source and license remain in the media record. The NARA/IDA Canandaigua scan is a faithful reproduction of an eighteenth-century federal document. Its 1795 ratification is distinct from the incorporated 1794 treaty. The 1828 Phoenix publication has expired original copyright; LOC identifies no known publication restrictions. Linde’s catalogued 1913 image carries the precise LOC No known restrictions advisory, not a blanket public-domain declaration. No restricted wampum photograph or copyrighted brochure illustrations are redistributed.\n')
state={'branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'commit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'baseline':'260b492da7eda2139af5c5e9c9fb0eec9fc0db20','originalLocalBranch':'v2/main at 7e959c47fab2cfb10c08544e819a156b25108e4c','status':subprocess.check_output(['git','status','--short'],text=True),'corpusSha256':hashlib.sha256((site/'atlas/corpus.json').read_bytes()).hexdigest(),'deployment':'local only; no push or public deployment','sourceDate':subprocess.check_output(['git','show','-s','--format=%cs','HEAD'],text=True).strip()}
(dest/'SOURCE_STATE.json').write_text(json.dumps(state,indent=2)+'\n')
summary=json.loads((root/'output/redesign/manifests/release-corpus-summary.json').read_text())
assert summary['corpusSha256']==state['corpusSha256'],'Build and manifests disagree'
pdfs={v['file']:v for v in json.loads((root/'output/redesign/print/pdf-verification.json').read_text())}
legacy=len(json.loads((root/'public/atlas/legacy-disposition.json').read_text()))
(dest/'README.md').write_text(f'''# Chronos local atlas release candidate

Run `python3 launch.py` from this folder and open http://127.0.0.1:4174/. Use `python3 launch.py --port 4175` if another preview is running. Python 3 is the only runtime needed. The server binds only to 127.0.0.1 and serves static files; no account or backend is required. Do not open index.html directly.

Start with Full history or Journeys. The world around 200 CE is a complete eight-stop investigation; C8 has three connected modern inquiries. Search Nimrud and compare with Ashoka, then investigate Hattusha or Qin for deeper evidence questions. Notebook entries stay in browser storage; export/import JSON to preserve or move them.

The October 27 expansion adds Earth, food and gathering in Indigenous North America (Poverty Point, Ohio Hopewell, Chaco and Cahokia) and Books, silk and power: West/Central Asia, 1500–1800 (Bukhara, Ottoman workshops, Isfahan/New Julfa and later-eighteenth-century Iran). Begin either in Journeys or its chapter invitation. All {summary['journeys']} investigations have printable routes and family sheets. The corpus has {summary['subjects']} dossiers, {summary['media']} media records and {summary['sources']} precise source records.

The northern expansion adds Arctic, coast and Plains: work, knowledge and belonging. Its six stops investigate a Bering Sea carving, Makah Ozette, Blackfoot bison knowledge, Hidatsa gardens/earthlodges, Inuinnait clothing and Kwakwaka’wakw potlatch/community custody. Begin in Journeys or the C8 companion invitation. It crosses dates deliberately; individual object, observation, publication and institutional dates remain separate.

The Eastern Woodlands expansion adds five dossiers and six media records, with an inquiry that reuses the Hopewell dossier. Begin Eastern Woodlands: communities, knowledge and power in Journeys or its C8 invitation. Investigate Ocmulgee’s disputed construction chronology, a Wendat village model, Haudenosaunee diplomacy, Cherokee printing/removal and Ojibwe rice work. Compare political promises with exclusions and performance; save a return question. Source identities, model/record dates and licensing stay explicit.

Print PDFs are in site/atlas/exports: world-overview.pdf (A3 landscape, {pdfs['world-overview.pdf']['pages']} page), chapter-spreads.pdf (Letter portrait, {pdfs['chapter-spreads.pdf']['pages']} pages), family-explorations.pdf (Letter portrait, {pdfs['family-explorations.pdf']['pages']} sheets). Use actual size. No physical print test was performed.

Manifests include all {summary['regionalAssessments']} regional assessments, all {legacy:,} legacy dispositions, precise claim/source locators and image rights/checksums. Reports and verification include the eighteen-finding resolution, scenario evidence, measurements and real screenshots. Exact source state is in SOURCE_STATE.json; SHA256SUMS.json covers the delivered files.

The atlas is selective. No family testing, historian approval, human screen-reader session or physical-device/Safari test is claimed. Original external sources need internet; essential teaching content and media are local. Source code remains on the named branch in the original repository. Nothing was pushed or deployed.
''')
checks={str(p.relative_to(dest)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(dest.rglob('*')) if p.is_file()}
(dest/'SHA256SUMS.json').write_text(json.dumps(checks,indent=2)+'\n')
archive=dest.with_suffix('.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(dest.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(dest.parent))
# Verify every archived byte against the prepared package, not just ZIP metadata.
with zipfile.ZipFile(archive) as z:
 for p in dest.rglob('*'):
  if p.is_file():assert hashlib.sha256(z.read(str(p.relative_to(dest.parent)))).digest()==hashlib.sha256(p.read_bytes()).digest()
print(json.dumps({'package':str(archive),'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'filesVerified':len(checks)+1,'commit':state['commit']},indent=2))
