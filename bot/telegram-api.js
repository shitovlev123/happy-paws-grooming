const botToken = () => process.env.TELEGRAM_BOT_TOKEN

export const telegramRequest = async (method, payload) => {
  const token = botToken()

  if (!token) {
    return { ok: false, skipped: true, error: 'TELEGRAM_BOT_TOKEN is not configured' }
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return response.json()
}

export const sendTelegramMessage = (chatId, text, extra = {}) =>
  telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
    ...extra,
  })

export const editTelegramMessage = (chatId, messageId, text, extra = {}) =>
  telegramRequest('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...extra,
  })

export const answerCallbackQuery = (callbackQueryId, text) =>
  telegramRequest('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
  })

export const getUpdates = (offset) =>
  telegramRequest('getUpdates', {
    offset,
    timeout: 25,
    allowed_updates: ['message', 'callback_query'],
  })

export const setWebhook = (url) =>
  telegramRequest('setWebhook', {
    url,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: false,
  })
