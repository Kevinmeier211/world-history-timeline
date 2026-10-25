# Run configuration — edit values, save, continue

MAX_PHASE=7                  # highest phase Cursor may start (0–9)
ALLOW_MEDIA_DOWNLOAD=false   # true = fetch images listed in reviewed media-src.json from open-access sources
ALLOW_PUSH=false             # true = push branches/tags to origin (still no workflows, still once per phase)
ALLOW_DEPLOY=false           # true = deploy; requires a named target below
DEPLOY_TARGET=               # e.g. vercel-preview
ALLOW_BIG_DEPS=false         # true = permit runtime deps > 50 KB gz
CC_BY_APPROVED_IDS=          # comma-separated media ids Kevin approved despite attribution/share-alike
