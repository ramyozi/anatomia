# Anatomia — Production deployment

Self-contained guide to bring the Vite + FastAPI stack online on an
Ubuntu 24.04 VPS, with HTTPS via Let's Encrypt and a bind-mounted
SQLite database that survives container rebuilds.

## Architecture

```
            +---------------------------+
 internet → |  host nginx + certbot     |  TLS, HTTP/2, redirect 80→443
            |  /etc/nginx/sites-enabled |
            +-------------+-------------+
                          ↓ http://127.0.0.1:8080
            +---------------------------+
            |  frontend container       |  nginx-alpine, serves SPA,
            |  (nginx + Vite build)     |  proxies /api → backend:8000
            +-------------+-------------+
                          ↓ http://backend:8000
            +---------------------------+
            |  backend container        |  FastAPI + uvicorn (non-root)
            |  (Python 3.11-slim)       |
            +-------------+-------------+
                          ↓ bind mount
            +---------------------------+
            |  ./data/anatomia.db       |  SQLite — survives rebuilds
            +---------------------------+
```

Everything is brought up by `docker compose -f docker-compose.prod.yml`,
itself supervised by the `anatomia.service` systemd unit so the stack
auto-starts on boot and restarts on failure.

## One-shot VPS bootstrap

The bootstrap script handles Docker, the firewall, host nginx,
Let's Encrypt and the systemd unit in one go.

```bash
# As root on a fresh Ubuntu 24.04 VPS:
curl -fsSL https://raw.githubusercontent.com/ramyozi/anatomia/main/deploy/scripts/bootstrap-vps.sh \
  | bash -s -- anatomia.example.com admin@example.com
```

Then fill in production secrets:

```bash
cd /srv/anatomia
cp .env.production.example .env
$EDITOR .env          # set SECRET_KEY and CORS_ORIGINS
systemctl start anatomia
systemctl status anatomia
curl -fsS https://anatomia.example.com/api/health
```

## Manual setup (if you prefer)

```bash
# 1. Packages
apt-get update
apt-get install -y docker.io docker-compose-plugin nginx certbot \
                   python3-certbot-nginx ufw git
systemctl enable --now docker

# 2. Firewall
ufw allow OpenSSH && ufw allow "Nginx Full" && ufw --force enable

# 3. Clone + env
git clone https://github.com/ramyozi/anatomia.git /srv/anatomia
cd /srv/anatomia
cp .env.production.example .env
$EDITOR .env
mkdir -p data

# 4. Host nginx
cp deploy/nginx/anatomia.conf /etc/nginx/sites-available/anatomia
sed -i 's/anatomia.example.com/your-domain.com/g' \
  /etc/nginx/sites-available/anatomia
ln -sf /etc/nginx/sites-available/anatomia /etc/nginx/sites-enabled/anatomia
nginx -t && systemctl reload nginx

# 5. Let's Encrypt (auto-edits the nginx config)
certbot --nginx -d your-domain.com -m you@example.com --agree-tos --redirect

# 6. systemd
cp deploy/systemd/anatomia.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now anatomia
```

## Day-2 operations

| What | Command |
|---|---|
| Tail container logs | `docker compose -f docker-compose.prod.yml logs -f` |
| Tail systemd logs   | `journalctl -u anatomia -f` |
| Stop the stack      | `systemctl stop anatomia` |
| Force rebuild       | `systemctl restart anatomia` |
| Pull + redeploy     | `./deploy/scripts/update.sh anatomia.example.com` |
| Snapshot DB         | `./deploy/scripts/backup-db.sh` |
| Restore DB          | `./deploy/scripts/restore-db.sh data/backups/anatomia-...db.gz` |
| Renew certs         | `certbot renew --quiet` (already in `/etc/cron.d/certbot`) |

### Scheduled DB backup

The included script keeps 14 daily snapshots in `data/backups/`. Wire
it to cron once on the VPS:

```cron
5 4 * * * /srv/anatomia/deploy/scripts/backup-db.sh >>/var/log/anatomia-backup.log 2>&1
```

### Rollback

`update.sh` already auto-rolls back to the previous commit if the new
build fails its healthcheck. To roll back manually:

```bash
cd /srv/anatomia
git log --oneline | head -5
git reset --hard <previous-sha>
docker compose -f docker-compose.prod.yml up -d --build
```

## CI/CD

`.github/workflows/ci.yml` runs typecheck + Vite build + backend smoke
test + docker image builds on every push.

`.github/workflows/deploy.yml` triggers `update.sh` on the VPS after
a successful CI run on `main`. It needs four repository secrets:

| Secret | Example |
|---|---|
| `DEPLOY_HOST`    | `1.2.3.4` |
| `DEPLOY_USER`    | `deploy` |
| `DEPLOY_SSH_KEY` | contents of `~/.ssh/id_ed25519` |
| `DEPLOY_DOMAIN`  | `anatomia.example.com` |

## Healthchecks

- Backend `GET /api/health` → `{"status": "ok", "version": "..."}`. The
  container's `HEALTHCHECK` invokes it every 30 s.
- Frontend container has its own `HEALTHCHECK` that hits the root SPA.
- `update.sh` polls `/api/health` for 90 s after every rolling deploy
  and rolls back on failure.

## Security posture

- Backend runs as a dedicated UID (1001) and only the frontend ingress
  is reachable from the host.
- `SECRET_KEY` must be 48 random bytes (run
  `python -c "import secrets;print(secrets.token_urlsafe(48))"`).
- `CORS_ORIGINS` must match the production domain — wildcard origins
  are rejected.
- Host nginx sends HSTS + X-Frame-Options + X-Content-Type-Options.
- `ufw` only allows SSH + 80/443. Postgres / SQLite / FastAPI never see
  the open internet.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `https://...` returns 502 | `docker compose ps` — frontend container down? Check `systemctl status anatomia`. |
| Frontend OK, `/api/...` 502 | Backend container unhealthy; `docker compose logs backend`. |
| Models return 404           | Build artefacts missing from frontend image — rebuild without cache: `docker compose -f docker-compose.prod.yml build --no-cache frontend`. |
| DB file ownership issue     | `chown -R 1001:1001 ./data` (matches the non-root UID in the backend image). |
| Cert renewal failed         | `certbot renew --dry-run`; if blocked by nginx, check that `/var/www/certbot` exists. |
