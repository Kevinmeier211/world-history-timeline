# Chronos Atlas hosting — November 1, 2026

Current local implementation: [November 4 status](IMPLEMENTATION-2026-11-04.md) and [inventory](CURRENT-STATE.json). This document records the unchanged November 1 hosted release.

The existing Living timeline app is hosted at **https://chronos-atlas-five.vercel.app/**. **Meanwhile elsewhere** is reached through **Compare this moment**, preserving the chosen date and story. Vercel sign-in protection remains enabled. The app's Notebook still uses browser-local storage; existing local notes can be exported and imported on the hosted address.

## Deployment identity

- Team: `kevin-s-projects-082f3ccb` (`team_oDhato3M2cyAoAkiuDGbD2wl`).
- Project: `chronos-atlas` (`prj_e6nwbdOKc3Ciq4HXokjwdFOcn6Zj`).
- Deployment: `dpl_4wTFc4yAWPs4358p1v45mLed8rUJ`.
- Immutable URL: https://chronos-atlas-apluj6tyw-kevin-s-projects-082f3ccb.vercel.app/.
- Dashboard: https://vercel.com/kevin-s-projects-082f3ccb/chronos-atlas/4wTFc4yAWPs4358p1v45mLed8rUJ.
- Reported state: `READY`; actual target: `production`. The CLI was called with `--target preview`, but Vercel assigned this first project deployment to production and created the stable alias above.

Vercel was selected to preserve the two existing PDF exports larger than 25 MiB without changing their contents. No GPT Site was created. No Git commit or push was performed, and no automatic Git deployment was connected.

## Exact artifact and evidence

The verified November 1 `dist` was copied into `output/vercel-living-timeline-2026-11-01/site/`. Only its 474 static files and `vercel.json` were uploaded. Private research, local-only documents, test receipts and notebook contents were excluded by constructing this separate staging folder.

All 475 uploaded files were read back through Vercel's authenticated deployment manifest and matched the staging files' SHA-1 hashes. The 416 files under `public/atlas` remain unchanged from the pre-redesign snapshot. The corpus SHA-256 remains `4b6ea2949c3e65c599d9291ef2bb91063ccca18bb7bc998981106b65158f5431`.

The hosted app passed the existing browser checks at 320, 390, 768 and 1440 pixels, covering both views, source notes, search, date navigation, dossier return state, dark appearance, Axe accessibility and page overflow. The served index, complete corpus and all four PDF downloads matched their original SHA-256 hashes. All owned managed-Chromium contexts and browsers were closed after verification.

Receipts are in [the deployment folder](../../output/vercel-living-timeline-2026-11-01/):

- `artifact-manifest.json`: exact local artifact, SHA-256 hashes and source checkout identity.
- `remote-files.json` and `remote-file-verification.json`: authenticated upload readback and comparison.
- `authenticated-browser-access.json`: successful hosted application access using a short-lived account OIDC token.
- `browser/` and `browser.log`: hosted managed-Chromium checks and screenshots.
- `hosted-downloads.json`: byte counts and SHA-256 matches for the served data and all PDF downloads.
- `verification.json`: final deployment and verification status.

No share link or persistent protection-bypass secret was created. Browser authentication used an origin-scoped OIDC header without saving the credential. Existing Vercel access controls were retained.

## Future updates

Keep this project identity when updating the site. Rebuild and validate the app, then stage only the complete current `dist` plus the static hosting configuration. The staging folder's `.vercel/project.json` identifies the project and team; do not deploy the entire dirty research workspace.

The app needs no server functions, database, API keys or external font requests. All runtime content and PDF exports are included in the static artifact. Historical external source links retain their original destinations and access limitations.
