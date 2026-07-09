#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/happy-paws/app}"
REPO_URL="${REPO_URL:-https://github.com/shitovlev123/happy-paws-grooming.git}"
BRANCH="${BRANCH:-main}"
ENV_FILE="${ENV_FILE:-/etc/happy-paws/env}"

if [ ! -d "$APP_DIR/.git" ]; then
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

corepack enable
corepack prepare pnpm@11.7.0 --activate
pnpm install --frozen-lockfile
pnpm migrate
pnpm build

chown -R happy-paws:happy-paws "$APP_DIR"
systemctl restart happy-paws-api.service
systemctl restart happy-paws-bot.service
systemctl reload caddy
