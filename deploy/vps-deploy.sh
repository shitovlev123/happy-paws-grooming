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

git config --global --add safe.directory "$APP_DIR" >/dev/null 2>&1 || true
cd "$APP_DIR"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

if [ -n "${SQLITE_DB_FILE:-}" ]; then
  install -d -m 750 -o happy-paws -g happy-paws "$(dirname "$SQLITE_DB_FILE")"
fi

CODEX_AGENT_HOME="${CODEX_AGENT_HOME:-/opt/happy-paws/codex-home}"
CODEX_AGENT_WORKDIR="${CODEX_AGENT_WORKDIR:-/opt/happy-paws/codex-agent-workspace}"
install -d -m 750 -o happy-paws -g happy-paws "$CODEX_AGENT_HOME" "$CODEX_AGENT_WORKDIR"
cat > "$CODEX_AGENT_WORKDIR/CONTEXT.md" <<'EOF'
# Счастливые лапки

Публичный контекст для AI-консультанта сайта.

- Груминг-салон в Москве, район Хамовники.
- Услуги: комплексный груминг, стрижка, купание, вычесывание, уход за когтями, экспресс-уход.
- Запись идет через форму на сайте с выбором даты и времени.
- Администратор получает заявки в Telegram.
- Тон общения: спокойный, заботливый, премиальный, без технических подробностей.
EOF
chown -R happy-paws:happy-paws "$CODEX_AGENT_HOME" "$CODEX_AGENT_WORKDIR"

if [ "${CODEX_AGENT_ENABLED:-0}" = "1" ] && ! command -v codex >/dev/null 2>&1; then
  npm install -g @openai/codex
fi

if command -v codex >/dev/null 2>&1; then
  CODEX_BIN_PATH="$(readlink -f "$(command -v codex)")"
  CODEX_PACKAGE_DIR="$(cd "$(dirname "$CODEX_BIN_PATH")/.." && pwd)"
  chmod a+rx "$(dirname "$CODEX_PACKAGE_DIR")"
  chmod -R a+rX "$CODEX_PACKAGE_DIR"
fi

export NODE_OPTIONS="${NODE_OPTIONS:---disable-warning=ExperimentalWarning}"

install -m 644 deploy/happy-paws-api.service /etc/systemd/system/happy-paws-api.service
install -m 644 deploy/happy-paws-bot.service /etc/systemd/system/happy-paws-bot.service
install -m 644 deploy/Caddyfile /etc/caddy/Caddyfile
systemctl daemon-reload

corepack enable
corepack prepare pnpm@11.7.0 --activate
pnpm install --frozen-lockfile
pnpm migrate
if [ -n "${SQLITE_DB_FILE:-}" ]; then
  chown -R happy-paws:happy-paws "$(dirname "$SQLITE_DB_FILE")"
fi
pnpm build

chown -R happy-paws:happy-paws "$APP_DIR"
systemctl restart happy-paws-api.service
systemctl restart happy-paws-bot.service
systemctl reload caddy
