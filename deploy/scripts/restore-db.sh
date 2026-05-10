#!/usr/bin/env bash
#
# Restore the SQLite database from a backup file.
#
# Usage:
#     ./deploy/scripts/restore-db.sh /srv/anatomia/data/backups/anatomia-2026....db.gz
#
# The script:
#   1. stops the backend container so no writer holds the file,
#   2. moves the current DB aside (kept as ``anatomia.db.bak.<ts>``),
#   3. decompresses + copies the backup in place,
#   4. restarts the backend.

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <backup.db.gz>" >&2
  exit 2
fi

SOURCE="$1"
ROOT="$(cd "$(dirname "$0")"/../.. && pwd)"
DB="${ROOT}/data/anatomia.db"
STAMP=$(date -u +"%Y%m%dT%H%M%SZ")
COMPOSE="docker compose -f ${ROOT}/docker-compose.prod.yml"

[[ -f "$SOURCE" ]] || { echo "no such file: $SOURCE" >&2; exit 1; }

echo "==> Stopping backend"
$COMPOSE stop backend || true

if [[ -f "$DB" ]]; then
  echo "==> Saving current DB → ${DB}.bak.${STAMP}"
  cp "$DB" "${DB}.bak.${STAMP}"
fi

echo "==> Restoring from $SOURCE"
if [[ "$SOURCE" == *.gz ]]; then
  gunzip -c "$SOURCE" > "$DB"
else
  cp "$SOURCE" "$DB"
fi

echo "==> Restarting backend"
$COMPOSE up -d backend

echo "Restore complete. Old DB preserved at ${DB}.bak.${STAMP}"
