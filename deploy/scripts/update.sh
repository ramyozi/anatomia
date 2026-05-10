#!/usr/bin/env bash
#
# Pull the latest main and roll the stack forward in place.
# Rolls back automatically if the new build's healthcheck doesn't pass
# in 90 seconds.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")"/../.. && pwd)"
COMPOSE="docker compose -f ${ROOT}/docker-compose.prod.yml"
DOMAIN="${1:-localhost}"

cd "$ROOT"

echo "==> Snapshot DB before deploy"
./deploy/scripts/backup-db.sh

PREVIOUS=$(git rev-parse HEAD)
echo "==> Current commit: $PREVIOUS"

echo "==> Fetching new revisions"
git fetch --all --tags
git reset --hard origin/main

echo "==> Rebuilding containers"
$COMPOSE up -d --build --remove-orphans

echo "==> Waiting for healthcheck (90s budget)"
for i in $(seq 1 18); do
  if curl -fsS "https://${DOMAIN}/api/health" >/dev/null 2>&1 \
     || curl -fsS "http://127.0.0.1:8080/api/health" >/dev/null 2>&1; then
    echo "==> Health OK after ${i} attempt(s)"
    exit 0
  fi
  sleep 5
done

echo "!! New build failed healthcheck — rolling back to $PREVIOUS" >&2
git reset --hard "$PREVIOUS"
$COMPOSE up -d --build --remove-orphans
exit 1
