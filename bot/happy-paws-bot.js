import { bootstrapAdmin, grantAdmin, isAdmin, readState, updateBookingStatus } from './state.js'
import {
  answerCallbackQuery,
  editTelegramMessage,
  getUpdates,
  sendTelegramMessage,
} from './telegram-api.js'
import { bookingKeyboard, formatBookingMessage, formatHelpMessage } from './messages.js'

const statuses = new Set(['new', 'confirmed', 'completed', 'cancelled'])

const sendHelp = async (chatId, userId) => {
  const adminUser = await isAdmin(userId)
  await sendTelegramMessage(chatId, formatHelpMessage(adminUser))
}

const handleMessage = async (message) => {
  const text = message.text || ''
  const chatId = message.chat.id
  const userId = message.from.id

  if (text.startsWith('/start')) {
    const { created } = await bootstrapAdmin(userId)
    await sendTelegramMessage(
      chatId,
      created
        ? 'Вы первый пользователь бота и получили права главного администратора.'
        : 'Бот Happy Paws активен.',
    )
    await sendHelp(chatId, userId)
    return
  }

  if (!(await isAdmin(userId))) {
    await sendTelegramMessage(chatId, 'Нет доступа. Попросите администратора выдать права.')
    return
  }

  if (text.startsWith('/grant')) {
    const [, targetId] = text.trim().split(/\s+/)

    if (!targetId) {
      await sendTelegramMessage(chatId, 'Укажите Telegram ID: /grant 123456789')
      return
    }

    await grantAdmin(userId, targetId)
    await sendTelegramMessage(chatId, `Пользователь ${targetId} теперь администратор.`)
    return
  }

  if (text.startsWith('/admins')) {
    const state = await readState()
    await sendTelegramMessage(chatId, `Администраторы:\n${state.admins.join('\n')}`)
    return
  }

  if (text.startsWith('/bookings')) {
    const state = await readState()
    const bookings = state.bookings.slice(0, 10)

    if (bookings.length === 0) {
      await sendTelegramMessage(chatId, 'Заявок пока нет.')
      return
    }

    for (const booking of bookings) {
      await sendTelegramMessage(chatId, formatBookingMessage(booking), {
        reply_markup: bookingKeyboard(booking.id),
      })
    }
    return
  }

  if (text.startsWith('/status')) {
    const [, bookingId, status] = text.trim().split(/\s+/)

    if (!bookingId || !statuses.has(status)) {
      await sendTelegramMessage(chatId, 'Формат: /status HP-123 confirmed')
      return
    }

    const { booking } = await updateBookingStatus(bookingId, status)
    await sendTelegramMessage(
      chatId,
      booking ? formatBookingMessage(booking) : `Заявка ${bookingId} не найдена.`,
      booking ? { reply_markup: bookingKeyboard(booking.id) } : {},
    )
    return
  }

  await sendHelp(chatId, userId)
}

const handleCallback = async (callbackQuery) => {
  const userId = callbackQuery.from.id

  if (!(await isAdmin(userId))) {
    await answerCallbackQuery(callbackQuery.id, 'Нет доступа')
    return
  }

  const [action, bookingId, status] = callbackQuery.data.split(':')

  if (action !== 'status' || !statuses.has(status)) {
    await answerCallbackQuery(callbackQuery.id, 'Неизвестная команда')
    return
  }

  const { booking } = await updateBookingStatus(bookingId, status)
  await answerCallbackQuery(callbackQuery.id, booking ? 'Статус обновлен' : 'Заявка не найдена')

  if (booking && callbackQuery.message) {
    await editTelegramMessage(
      callbackQuery.message.chat.id,
      callbackQuery.message.message_id,
      formatBookingMessage(booking),
      { reply_markup: bookingKeyboard(booking.id) },
    )
  }
}

let offset = 0

console.log('Happy Paws bot started')

while (true) {
  const updates = await getUpdates(offset)

  if (!updates.ok) {
    console.error(updates)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    continue
  }

  for (const update of updates.result) {
    offset = update.update_id + 1

    if (update.message) {
      await handleMessage(update.message)
    }

    if (update.callback_query) {
      await handleCallback(update.callback_query)
    }
  }
}
