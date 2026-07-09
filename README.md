# Счастливые лапки

Портфолио-проект для груминг-салона: живой лендинг, онлайн-запись, Telegram-админка, SQL-база заявок и аккуратный AI-помощник на сайте.

Публичный сайт выглядит как клиентский продукт для салона: без технических описаний, CRM-терминов и внутренней кухни. Вся админская логика вынесена в Telegram-бота.

## Что реализовано

- Адаптивный лендинг груминг-салона в светлом премиальном стиле.
- Hero с видео-фоном, блок услуг, мастера, отзывы, карта, контакты и форма записи.
- Кликабельные карточки услуг: выбранная услуга автоматически подставляется в форму.
- Форма онлайн-записи с именем владельца, телефоном, питомцем, услугой, датой и временем.
- Telegram-бот для администраторов.
- Первый пользователь бота становится главным администратором, если админов ещё нет.
- Администратор может выдавать права другим пользователям через Telegram.
- Заявки приходят администраторам сообщением от бота.
- Idempotency key для заявок: повторная отправка одной попытки возвращает ту же заявку и не дублирует Telegram-уведомление.
- Статусы заявок: новая, подтверждена, выполнена, отменена.
- SQLite-хранилище для заявок, админов, pending-действий и статусов.
- Floating AI-chat widget на сайте: mock по умолчанию или изолированный Codex CLI agent на VPS.
- VPS deployment через Caddy, Node.js systemd services и GitHub Actions.

## Технологии

- React
- TypeScript
- Vite
- Phosphor Icons
- Node.js
- SQLite
- Telegram Bot API
- Caddy
- GitHub Actions
- Mock AI endpoint
- Optional Codex CLI agent gateway

## Локальный запуск

```bash
pnpm install
pnpm dev
```

Сайт:

```text
http://localhost:5173
```

Сборка:

```bash
pnpm build
```

Локальный API:

```bash
pnpm serve
```

Миграция SQL-схемы:

```bash
pnpm migrate
```

Telegram polling bot:

```bash
pnpm bot
```

## Переменные окружения

Создайте `.env` по примеру `.env.example`.

```bash
TELEGRAM_BOT_TOKEN=replace_with_bot_token
TELEGRAM_ADMIN_IDS=comma_separated_admin_telegram_ids_optional
SQLITE_DB_FILE=bot/data/happy-paws.sqlite
PORT=3001
HOST=127.0.0.1
CODEX_AGENT_ENABLED=0
CODEX_AGENT_BIN=codex
CODEX_AGENT_HOME=bot/data/codex-home
CODEX_AGENT_WORKDIR=bot/data/codex-agent-workspace
CODEX_AGENT_TIMEOUT_MS=35000
CODEX_AGENT_MAX_PROMPT_CHARS=800
```

Сейчас чат безопасно работает в mock AI режиме, если `CODEX_AGENT_ENABLED=0` или Codex CLI не готов. При `CODEX_AGENT_ENABLED=1` backend сначала пытается получить ответ через Codex CLI agent, а при ошибке возвращается к mock-ответу, чтобы сайт не падал.

## Codex agent mode

Codex agent подключается только через backend `/api/chat`. Frontend не получает токены и не общается с Codex напрямую.

Защитные ограничения:

- prompt ограничен по длине через `CODEX_AGENT_MAX_PROMPT_CHARS`;
- `/api/chat` имеет простой rate limit;
- Codex запускается через `spawn` без shell;
- процесс получает очищенный env без Telegram token, SQLite path и deploy secrets;
- используется отдельный `CODEX_AGENT_HOME`;
- используется отдельная рабочая папка `CODEX_AGENT_WORKDIR` только с публичным контекстом салона;
- runner запускается с `codex exec --sandbox read-only -c approval_policy="never" --skip-git-repo-check --ignore-rules --json -`;
- при ошибке, отсутствии CLI или отсутствии авторизации сайт отвечает mock-режимом.

На VPS deploy script создает `CODEX_AGENT_HOME` и `CODEX_AGENT_WORKDIR`. Если `CODEX_AGENT_ENABLED=1` и команда `codex` не найдена, deploy script устанавливает Codex CLI через `npm install -g @openai/codex`.

Авторизацию Codex нужно делать отдельно для `CODEX_AGENT_HOME`. Локальный `~/.codex/auth.json` не коммитится в репозиторий.

## API

```text
POST /api/bot
```

Принимает заявку с сайта, сохраняет её в SQLite или fallback-state и отправляет администраторам Telegram-сообщение.

```text
POST /api/chat
```

Отвечает на сообщения виджета AI-помощника. Endpoint работает как mock AI или как безопасный шлюз к Codex CLI agent, если агент включен и авторизован.

```text
GET /api/health
```

Проверяет состояние VPS API.

## Telegram-бот

Команды:

```text
/start
/panel
/bookings
/admins
/grant TELEGRAM_ID
/status BOOKING_ID new|confirmed|completed|cancelled
```

На VPS бот работает в polling-режиме через `happy-paws-bot.service`. Это важно для текущего сервера, потому что порт `443` занят Xray Reality, а Telegram webhook требует публичный HTTPS URL.

## VPS deployment

Файлы инфраструктуры лежат в `deploy/`:

```text
deploy/Caddyfile
deploy/happy-paws-api.service
deploy/happy-paws-bot.service
deploy/vps-deploy.sh
```

Схема:

- Caddy слушает `:80`.
- Caddy отдаёт `dist/`.
- Caddy проксирует `/api/*` на `127.0.0.1:3001`.
- `happy-paws-api.service` запускает Node API.
- `happy-paws-bot.service` запускает Telegram polling bot.
- SQLite хранится одним файлом, например `/opt/happy-paws/data/happy-paws.sqlite`.

## GitHub auto deploy

Workflow:

```text
.github/workflows/deploy-vps.yml
```

Нужные GitHub Secrets:

```text
VPS_HOST
VPS_USER
VPS_SSH_KEY
```

На сервере deploy key можно ограничить forced command на `/opt/happy-paws/deploy.sh`, чтобы GitHub Actions мог только деплоить проект.

## Структура проекта

```text
api/
  bot.js                  # заявки и Telegram webhook-compatible endpoint
  chat.js                 # mock AI chat endpoint
bot/
  controller.js           # Telegram-команды, callback-кнопки, админ-панель
  happy-paws-bot.js       # polling runner
  messages.js             # тексты и inline-кнопки Telegram
  state.js                # общий state facade
  state-sqlite.js         # SQLite adapter
  telegram-api.js         # Telegram Bot API wrapper
deploy/
  Caddyfile
  happy-paws-api.service
  happy-paws-bot.service
  vps-deploy.sh
server/
  chat.js
  index.js
  migrate.js
src/
  components/
  data/
  lib/
  pages/
  types/
public/
  happy-paws-hero.mp4
```

## Что улучшить дальше

- Подключить реальный домен и решить схему HTTPS вместе с Xray Reality.
- Добавить календарь занятых слотов и блокировку уже занятых дат/времени.
- Добавить напоминания клиентам перед визитом.
- Добавить настоящие фото мастеров и работ.
- Подключить полноценный OpenAI API key для AI-помощника.
