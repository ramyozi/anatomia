# Anatomia — Production deployment

The live stack runs on **Vercel** (frontend) + **Render** (backend) +
**Sentry** (monitoring). The Ubuntu VPS recipe further below is kept as
an alternative for self-hosting.

## Live URLs

| Surface  | URL                                            |
|----------|------------------------------------------------|
| Frontend | https://anatomia.ramzibenmansour.com           |
| Backend  | https://anatomia-api.onrender.com              |
| Health   | https://anatomia-api.onrender.com/api/health   |
| Sentry   | https://ramzibenmansour.sentry.io/projects/anatomia-backend/ |

## Topology (managed PaaS)

```
       browser
          │
          ▼
  ┌───────────────────┐         /api/*  Vercel rewrite (server-side)
  │  Vercel — Vite SPA│ ──────────────────────────────────────────┐
  │  anatomia.        │                                            │
  │  ramzibenmansour. │   static  /models/*.glb  /assets/*         │
  │  com              │ ◄─── immutable cache 1y / 30d              │
  └───────────────────┘                                            ▼
                                                ┌──────────────────────┐
                                                │ Render — FastAPI     │
                                                │ Docker, Frankfurt    │
                                                │ anatomia-api.        │
                                                │ onrender.com         │
                                                └─────┬────────────────┘
                                                      │
                                                      ▼
                                          /app/anatomia.db (520 KB)
                                          baked into image — re-seeds
                                          deterministically on cold start
```

Render's free plan ships **no persistent disk**, so the SQLite catalogue
is built into the Docker image (see `backend/Dockerfile` +
`backend/docker-entrypoint.sh`). The data is read-only in practice
(organs / diseases / countries / glossary), so this is intentional.
Upgrading to Starter + Disk: uncomment the `disk` block in `render.yaml`
and set `DATABASE_URL=sqlite:////data/anatomia.db` — the entrypoint will
auto-copy the baked-in seed to the disk on first boot.

## Redeploy

| Surface  | Trigger                                                 |
|----------|---------------------------------------------------------|
| Backend  | push to `main` (Render `autoDeploy: yes`)               |
| Frontend | push to `main` (Vercel auto-deploys)                    |
| Env vars | Render dashboard → service → Environment → save → redeploy auto-triggers |

## Provisioning recap (one-time)

1. **Render service** — `POST /v1/services` with the body in
   `render.yaml`. The CLI-friendly equivalent is `curl -X POST
   https://api.render.com/v1/services -H "Authorization: Bearer $RENDER_API_KEY"
   -d @scripts/.render-create.json` (gitignored).
2. **Env vars** — `PUT /v1/services/<id>/env-vars` with the full list
   (`CORS_ORIGINS`, `SENTRY_DSN`, `SECRET_KEY` generated locally with
   `python -c "import secrets;print(secrets.token_urlsafe(48))"`).
3. **Vercel domain** — `anatomia.ramzibenmansour.com` is attached to the
   `anatomia` project; SSO protection turned off via
   `PATCH /v9/projects/anatomia -d '{"ssoProtection":null}'`.
4. **Sentry** — DSNs minted from the
   `ramzibenmansour/anatomia-backend` and `…/anatomia-frontend`
   projects. Backend reads `SENTRY_DSN`; frontend reads
   `VITE_SENTRY_DSN` at build time.

## Cold-start latency

Free Render Web Services sleep after 15 min of inactivity. First request
after a sleep takes ~30 s while the container wakes up; subsequent
requests are <300 ms p50 from Frankfurt to FR users.

---

# Alternative: self-hosted VPS

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
