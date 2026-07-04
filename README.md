# Happy Paws Grooming

MVP-проект для портфолио: светлый лендинг и мини-система онлайн-записи для grooming-салона. Проект показывает не только UI, но и продуктовую логику малого бизнеса: форма заявки, локальная база, CRM-статусы, админка и подготовленный Telegram-модуль.

## Функционал

- Лендинг с hero-блоком, преимуществами, услугами, процессом работы, мастерами и отзывами.
- Онлайн-запись с полями: имя владельца, телефон, питомец, тип питомца, порода, услуга, дата и комментарий.
- Сохранение заявок в `localStorage`.
- Отдельная админка `/admin` со списком заявок.
- CRM-статусы: `новая` → `подтверждена` → `выполнена` / `отменена`.
- Фильтр заявок по статусу.
- Базовая статистика: всего, новые, подтвержденные, выполненные.
- Telegram formatter и серверный endpoint `api/telegram.js` для безопасной отправки уведомлений.
- Демо-данные для услуг, мастеров и отзывов.
- Адаптивность под телефон, планшет и десктоп.

## Технологии

- React
- TypeScript
- Vite
- React Router
- Lucide React
- localStorage
- Vercel-style serverless API для Telegram

## Запуск

```bash
pnpm install
pnpm dev
```

Открыть:

- сайт: `http://localhost:5173`
- админка: `http://localhost:5173/admin`

Сборка:

```bash
pnpm build
```

## Telegram

Токен бота нельзя хранить во frontend-коде и нельзя коммитить в GitHub. Для подключения:

1. Скопировать `.env.example` в `.env`.
2. Заполнить переменные:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_admin_chat_id
VITE_TELEGRAM_ENABLED=true
```

3. На хостинге добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` как секретные environment variables.
4. Endpoint `api/telegram.js` отправит сообщение через Telegram Bot API при POST-запросе с заявкой.

В локальном MVP Telegram по умолчанию выключен через `VITE_TELEGRAM_ENABLED=false`, но сообщение формируется и показывается после отправки формы.

## Структура

```text
src/
  assets/            # hero image
  components/        # Header, Hero, Services, BookingForm, AdminDashboard и др.
  data/              # услуги, мастера, отзывы, подписи статусов
  lib/               # localStorage и Telegram helpers
  pages/             # LandingPage, AdminPage
  types/             # доменные типы заявки
api/
  telegram.js        # serverless endpoint для Telegram
```

## Что улучшить дальше

- Подключить настоящую базу данных: Supabase, PostgreSQL или Firebase.
- Добавить авторизацию администратора.
- Сделать календарь свободных слотов.
- Добавить email/SMS-напоминания.
- Добавить загрузку реальных фото мастеров и работ.
- Добавить историю изменений статуса заявки.
