import {
  bootstrapAdmin,
  clearPendingAdminGrant,
  grantAdmin,
  hasPendingAdminGrant,
  isAdmin,
  readState,
  requireAdmin,
  setPendingAdminGrant,
  updateBookingStatus,
} from './state.js'
import {
  adminPanelKeyboard,
  adminPanelText,
  bookingKeyboard,
  formatBookingMessage,
  formatHelpMessage,
  mainKeyboard,
} from './messages.js'
import { answerCallbackQuery, editTelegramMessage, sendTelegramMessage } from './telegram-api.js'

const statuses = new Set(['new', 'confirmed', 'completed', 'cancelled'])

const sendAdminPanel = (chatId) =>
  sendTelegramMessage(chatId, adminPanelText, {
    reply_markup: adminPanelKeyboard,
  })

const sendBookings = async (chatId) => {
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
}

const sendAdmins = async (chatId) => {
  const state = await readState()
  await sendTelegramMessage(
    chatId,
    state.admins.length > 0 ? `Администраторы:\n${state.admins.join('\n')}` : 'Админов пока нет.',
  )
}

const askAdminId = async (chatId, userId) => {
  const result = await sendTelegramMessage(chatId, 'Отправьте Telegram ID пользователя ответом на это сообщение.', {
    reply_markup: {
      force_reply: true,
      input_field_placeholder: '123456789',
    },
  })

  if (result.ok && result.result?.message_id) {
    await setPendingAdminGrant(userId, result.result.message_id)
  }
}

const grantFromText = async (chatId, requesterId, text) => {
  const targetId = text.trim()

  if (!/^\d{4,20}$/.test(targetId)) {
    await sendTelegramMessage(chatId, 'Нужен числовой Telegram ID, например 123456789.')
    return
  }

  await grantAdmin(requesterId, targetId)
  await clearPendingAdminGrant(requesterId)
  await sendTelegramMessage(chatId, `Готово. Пользователь ${targetId} теперь администратор.`, {
    reply_markup: mainKeyboard,
  })
}

export const handleTelegramMessage = async (message) => {
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
      { reply_markup: mainKeyboard },
    )

    if (await isAdmin(userId)) {
      await sendAdminPanel(chatId)
    } else {
      await sendTelegramMessage(chatId, formatHelpMessage(false))
    }
    return
  }

  const adminCheck = await requireAdmin(userId)

  if (!adminCheck.ok) {
    await sendTelegramMessage(chatId, 'Нет доступа. Попросите администратора выдать права.')
    return
  }

  if (
    message.reply_to_message?.message_id &&
    (await hasPendingAdminGrant(userId, message.reply_to_message.message_id))
  ) {
    await grantFromText(chatId, userId, text)
    return
  }

  if (text === 'Админ-панель' || text.startsWith('/panel')) {
    await sendAdminPanel(chatId)
    return
  }

  if (text.startsWith('/grant')) {
    const [, targetId] = text.trim().split(/\s+/)

    if (!targetId) {
      await askAdminId(chatId, userId)
      return
    }

    await grantFromText(chatId, userId, targetId)
    return
  }

  if (text.startsWith('/admins')) {
    await sendAdmins(chatId)
    return
  }

  if (text.startsWith('/bookings')) {
    await sendBookings(chatId)
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

  await sendAdminPanel(chatId)
}

export const handleTelegramCallback = async (callbackQuery) => {
  const userId = callbackQuery.from.id
  const chatId = callbackQuery.message?.chat.id
  const data = callbackQuery.data || ''

  if (!(await isAdmin(userId))) {
    await answerCallbackQuery(callbackQuery.id, 'Нет доступа')
    return
  }

  if (data === 'panel:bookings') {
    await answerCallbackQuery(callbackQuery.id, 'Открываю заявки')
    await sendBookings(chatId)
    return
  }

  if (data === 'panel:grant') {
    await answerCallbackQuery(callbackQuery.id, 'Введите Telegram ID')
    await askAdminId(chatId, userId)
    return
  }

  if (data === 'panel:admins') {
    await answerCallbackQuery(callbackQuery.id, 'Список админов')
    await sendAdmins(chatId)
    return
  }

  const [action, bookingId, status] = data.split(':')

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

export const handleTelegramUpdate = async (update) => {
  if (update.message) {
    await handleTelegramMessage(update.message)
  }

  if (update.callback_query) {
    await handleTelegramCallback(update.callback_query)
  }
}
