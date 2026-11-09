#!/bin/bash
set -euo pipefail
cd -- "$(dirname -- "$0")"

pause_on_error() {
  status=$?
  if [ "$status" -ne 0 ]; then
    printf '\nChronos could not start. The error is shown above.\n'
    read -r -p 'Press Return to close this window. ' || true
  fi
}
trap pause_on_error EXIT

if ! command -v npm >/dev/null 2>&1 || ! command -v python3 >/dev/null 2>&1; then
  printf 'Chronos needs Node.js (npm) and Python 3 on this Mac.\n'
  exit 1
fi

mkdir -p output/local-launch
printf 'Preparing Chronos Atlas…\n'
if ! npm run build > output/local-launch/build.log 2>&1; then
  tail -n 25 output/local-launch/build.log
  exit 1
fi
python3 scripts/launch_atlas.py --open
