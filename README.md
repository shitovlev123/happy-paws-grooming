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
- Floating mock AI-chat widget на сайте.
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
```

Сейчас чат работает в mock AI режиме и не делает внешних AI-запросов. Не копируйте локальные Codex/OpenAI auth-токены в публичный сайт или VPS runtime. Для настоящего AI-помощника позже нужен отдельный серверный API key в env.

## API

```text
POST /api/bot
```

Принимает заявку с сайта, сохраняет её в SQLite или fallback-state и отправляет администраторам Telegram-сообщение.

```text
POST /api/chat
```

Отвечает на сообщения виджета AI-помощника. Сейчас endpoint работает как mock AI: выбирает сценарный ответ и быстрые подсказки по тексту вопроса.

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
