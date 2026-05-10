#!/usr/bin/env bash
#
# One-shot VPS bootstrap for Anatomia (Ubuntu 24.04).
#
# Idempotent — re-running just refreshes packages and skips already
# installed pieces. Run as root (or with sudo).

set -euo pipefail

DOMAIN="${1:-anatomia.example.com}"
EMAIL="${2:-admin@example.com}"
REPO_URL="${3:-https://github.com/ramyozi/anatomia.git}"
INSTALL_DIR="${4:-/srv/anatomia}"

echo "==> Updating apt cache"
apt-get update
apt-get install -y --no-install-recommends \
  ca-certificates curl gnupg lsb-release ufw nginx git \
  python3-certbot-nginx fail2ban

echo "==> Installing Docker Engine + compose plugin"
if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi

echo "==> Setting up firewall"
ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable

echo "==> Cloning repo into $INSTALL_DIR"
if [[ ! -d "$INSTALL_DIR/.git" ]]; then
  git clone "$REPO_URL" "$INSTALL_DIR"
else
  git -C "$INSTALL_DIR" pull --ff-only
fi
mkdir -p "$INSTALL_DIR/data"
chown -R 1001:1001 "$INSTALL_DIR/data"

echo "==> Wiring host nginx"
sed -i "s/anatomia.example.com/$DOMAIN/g" \
  "$INSTALL_DIR/deploy/nginx/anatomia.conf"
install -m 0644 "$INSTALL_DIR/deploy/nginx/anatomia.conf" \
  /etc/nginx/sites-available/anatomia
ln -sf /etc/nginx/sites-available/anatomia /etc/nginx/sites-enabled/anatomia
mkdir -p /var/www/certbot
nginx -t
systemctl reload nginx

echo "==> Issuing TLS certificate via Let's Encrypt"
certbot --nginx --non-interactive --agree-tos --redirect \
  -d "$DOMAIN" -m "$EMAIL"

echo "==> Installing systemd unit"
install -m 0644 "$INSTALL_DIR/deploy/systemd/anatomia.service" \
  /etc/systemd/system/anatomia.service
sed -i "s|/srv/anatomia|$INSTALL_DIR|g" /etc/systemd/system/anatomia.service
systemctl daemon-reload
systemctl enable anatomia.service

cat <<EOM

==========================================================================
 Bootstrap done.

 Next steps:
   1. cp $INSTALL_DIR/.env.production.example $INSTALL_DIR/.env
      $EDITOR $INSTALL_DIR/.env              # set SECRET_KEY + CORS_ORIGINS
   2. systemctl start anatomia               # build & launch the stack
   3. systemctl status anatomia              # verify
   4. curl -fsS https://$DOMAIN/api/health   # sanity check

 Logs:
   journalctl -u anatomia -f
   docker compose -f $INSTALL_DIR/docker-compose.prod.yml logs -f
==========================================================================
EOM
