#!/bin/sh
# Anatomia FastAPI entrypoint.
#
# The Docker image ships with a pre-seeded SQLite database at
# /app/anatomia.db. Two deployment modes are supported:
#
#   1. Free / ephemeral filesystem (no persistent disk attached):
#      DATABASE_URL=sqlite:///./anatomia.db    →  /app/anatomia.db (baked in)
#      The DB is read-only-ish; every cold start uses the seeded file.
#
#   2. Paid plan + persistent disk mounted at /data:
#      DATABASE_URL=sqlite:////data/anatomia.db
#      On first boot the disk is empty, so we copy the baked-in seed into
#      /data/anatomia.db. Subsequent boots keep whatever's on disk.
#
# We never overwrite an existing /data/anatomia.db — operator runtime data
# wins over the build-time seed.

set -eu

BAKED_DB="/app/anatomia.db"

# Detect a "sqlite:////data/..." URL → bootstrap that path from the baked-in
# seed if missing. We don't try to parse arbitrary SQLAlchemy URLs; this is
# a narrow heuristic for the disk-mount case.
case "${DATABASE_URL:-}" in
  sqlite:////data/*)
    target_db="${DATABASE_URL#sqlite:///}"
    if [ ! -f "$target_db" ] && [ -f "$BAKED_DB" ]; then
      echo "[entrypoint] bootstrapping persistent DB at $target_db from baked seed"
      mkdir -p "$(dirname "$target_db")"
      cp "$BAKED_DB" "$target_db"
    else
      echo "[entrypoint] persistent DB present at $target_db (size: $(wc -c < "$target_db" 2>/dev/null || echo '?') bytes)"
    fi
    ;;
  *)
    if [ -f "$BAKED_DB" ]; then
      echo "[entrypoint] using baked-in DB at $BAKED_DB (size: $(wc -c < "$BAKED_DB") bytes)"
    fi
    ;;
esac

exec "$@"
