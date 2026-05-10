#!/usr/bin/env bash
#
# Snapshot the SQLite database to ./data/backups/.
#
# Uses ``sqlite3 .backup`` (consistent online copy — safe to run while
# the API is serving) when sqlite3 is installed; falls back to a plain
# file copy otherwise. Retains the last 14 dumps.
#
# Wire it as a cron job:
#     5 4 * * * /srv/anatomia/deploy/scripts/backup-db.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")"/../.. && pwd)"
DB="${ROOT}/data/anatomia.db"
DEST="${ROOT}/data/backups"
KEEP=14

mkdir -p "$DEST"
[[ -f "$DB" ]] || { echo "no db at $DB"; exit 0; }

stamp=$(date -u +"%Y%m%dT%H%M%SZ")
out="${DEST}/anatomia-${stamp}.db"

if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB" ".backup '$out'"
else
  cp "$DB" "$out"
fi
gzip -f "$out"

# Retain the most recent $KEEP files.
ls -1t "$DEST"/anatomia-*.db.gz 2>/dev/null \
  | tail -n +$((KEEP + 1)) \
  | xargs -r rm -f

echo "Backed up to ${out}.gz"
